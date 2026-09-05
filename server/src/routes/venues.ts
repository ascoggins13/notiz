import { Router } from 'express';

console.log(
  'GOOGLE KEY AVAILABLE:',
  Boolean(process.env.GOOGLE_PLACES_API_KEY)
);

export const venuesRouter = Router();

type GooglePlace = {
  id?: string;
  displayName?: {
    text?: string;
  };
  primaryType?: string;
  types?: string[];
  location?: {
    latitude?: number;
    longitude?: number;
  };
};

function distanceInMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const earthRadiusMiles = 3958.8;

  const toRadians = (value: number) =>
    (value * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMiles * c;
}

venuesRouter.get('/nearby', async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({
      error: 'Valid lat and lng are required.',
    });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'Google Places API key is not configured.',
    });
  }

  try {
    const response = await fetch(
      'https://places.googleapis.com/v1/places:searchNearby',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.primaryType,places.types,places.location',
        },
        body: JSON.stringify({
          includedTypes: [
            'gym',
            'fitness_center',
            'bar',
            'night_club',
          ],
          maxResultCount: 20,
          rankPreference: 'DISTANCE',
          locationRestriction: {
            circle: {
              center: {
                latitude: lat,
                longitude: lng,
              },
              radius: 5000,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        'Google Places nearby search failed:',
        errorText
      );

      return res.status(502).json({
        error: 'Could not load nearby places.',
      });
    }

    const result = (await response.json()) as {
      places?: GooglePlace[];
    };

    const venues =
      result.places
        ?.map((place) => {
          const placeLat = place.location?.latitude;
          const placeLng = place.location?.longitude;

          if (
            !place.id ||
            !place.displayName?.text ||
            typeof placeLat !== 'number' ||
            typeof placeLng !== 'number'
          ) {
            return null;
          }

          const types = [
            place.primaryType,
            ...(place.types ?? []),
          ];

          const isGym =
            types.includes('gym') ||
            types.includes('fitness_center');

          const isBar =
            types.includes('bar') ||
            types.includes('night_club');

          if (!isGym && !isBar) {
            return null;
          }

          const miles = distanceInMiles(
            lat,
            lng,
            placeLat,
            placeLng
          );

          return {
            id: place.id,
            name: place.displayName.text,
            type: isGym ? 'gym' : 'bar',
            distance: `${miles.toFixed(1)} mi`,
          };
        })
        .filter(
          (
            venue
          ): venue is {
            id: string;
            name: string;
            type: 'gym' | 'bar';
            distance: string;
          } => venue !== null
        ) ?? [];

    return res.json({
      venues,
    });
  } catch (error) {
    console.error(
      'Nearby venue lookup failed:',
      error
    );

    return res.status(500).json({
      error: 'Could not load nearby places.',
    });
  }
});