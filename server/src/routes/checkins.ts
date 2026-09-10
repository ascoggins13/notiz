import { Router } from 'express';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { db } from '../config/firebase';
import { appearanceSchema, checkinSchema } from '../utils/validation';

export const checkinsRouter = Router();

checkinsRouter.get('/active', async (req, res) => {
  const now = Timestamp.now();

  const snap = await db
    .collection('checkins')
    .where('userId', '==', req.user!.uid)
    .where('status', '==', 'active')
    .where('expiresAt', '>', now)
    .limit(1)
    .get();

  if (snap.empty) {
    return res.json({
      active: false,
      checkin: null,
    });
  }

  const doc = snap.docs[0];
  const data = doc.data();

  return res.json({
    active: true,
    checkin: {
      id: doc.id,
      venueId: data.venueId,
      venueName: data.venueName,
      venueType: data.venueType,
    },
  });
});

checkinsRouter.get('/venue-count', async (req, res) => {
  const venueId = String(req.query.venueId ?? '');

  if (!venueId) {
    return res.status(400).json({
      error: 'Venue required.',
    });
  }

  const now = Timestamp.now();

  const snap = await db
    .collection('checkins')
    .where('venueId', '==', venueId)
    .where('status', '==', 'active')
    .where('expiresAt', '>', now)
    .get();

  return res.json({
    count: snap.size,
  });
});

checkinsRouter.post('/', async (req, res) => {
  const parsed = checkinSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const uid = req.user!.uid;
  const ttl = Number(process.env.CHECKIN_TTL_MINUTES ?? 120);
  const ref = db.collection('checkins').doc();
  await ref.set({
    userId: uid,
    ...parsed.data,
    status: 'active',
    checkedInAt: FieldValue.serverTimestamp(),
    expiresAt: Timestamp.fromMillis(Date.now() + ttl * 60_000),
  });
  return res.status(201).json({ id: ref.id });
});
checkinsRouter.get('/recent', async (req, res) => {
  try {
    const snap = await db
      .collection('checkins')
      .where('userId', '==', req.user!.uid)
      .orderBy('checkedInAt', 'desc')
      .limit(10)
      .get();

    const seenVenueIds = new Set<string>();

    const recent = snap.docs
      .map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          venueId: data.venueId,
          venueName: data.venueName,
          venueType: data.venueType,
          createdAt: data.createdAt,
        };
      })
      .filter((item) => {
        if (!item.venueId) {
          return false;
        }

        if (seenVenueIds.has(item.venueId)) {
          return false;
        }

        seenVenueIds.add(item.venueId);
        return true;
      })
      .slice(0, 2);

    res.json(recent);
  } catch (error) {
    console.error('Could not load recent check-ins', error);

    res.status(500).json({
      error: 'Could not load recent check-ins',
    });
  }
});
checkinsRouter.put('/:id/self-description', async (req, res) => {
  const parsed = appearanceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const checkinRef = db.collection('checkins').doc(req.params.id);
  const checkin = await checkinRef.get();
  if (!checkin.exists || checkin.data()?.userId !== req.user!.uid) return res.status(404).json({ error: 'Check-in not found.' });
  await db.collection('selfDescriptions').doc(req.params.id).set({
    ...parsed.data,
    userId: req.user!.uid,
    venueId: checkin.data()!.venueId,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return res.json({ ok: true });
});

checkinsRouter.delete('/:id', async (req, res) => {
  const ref = db.collection('checkins').doc(req.params.id);
  const snap = await ref.get();
  if (!snap.exists || snap.data()?.userId !== req.user!.uid) return res.status(404).json({ error: 'Check-in not found.' });
  await ref.update({ status: 'ended', endedAt: FieldValue.serverTimestamp() });
  return res.status(204).send();
});
