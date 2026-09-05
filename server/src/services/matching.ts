import { AppearanceDescription } from '../types/models';

function normalize(value?: string): string {
  return value?.trim().toLowerCase() ?? '';
}

function same(a?: string, b?: string): boolean {
  return Boolean(
    normalize(a) &&
    normalize(a) === normalize(b)
  );
}

function identifierOverlap(
  a: string[] = [],
  b: string[] = []
): number {
  const left = new Set(a.map(normalize));

  return b
    .map(normalize)
    .filter((item) => item && left.has(item))
    .length;
}

function arrayOverlap(
  a: string[] = [],
  b: string[] = []
): number {
  const left = new Set(a.map(normalize));

  return b
    .map(normalize)
    .filter((item) => item && left.has(item))
    .length;
}

export interface MatchScore {
  score: number;
  rawScore: number;
  matchedFields: string[];
}

export function scoreAppearance(
  target: AppearanceDescription,
  self: AppearanceDescription
): MatchScore {
  let score = 0;

  const matchedFields: string[] = [];

  const add = (
    condition: boolean,
    points: number,
    field: string
  ) => {
    if (condition) {
      score += points;
      matchedFields.push(field);
    }
  };

  add(
    same(target.gender, self.gender),
    10,
    'gender'
  );

  add(
    same(target.topType, self.topType),
    15,
    'topType'
  );

  add(
    same(target.shirtColor, self.shirtColor),
    20,
    'shirtColor'
  );

  add(
    same(target.bottomType, self.bottomType),
    15,
    'bottomType'
  );

  add(
    same(target.pantsColor, self.pantsColor),
    15,
    'pantsColor'
  );

  add(
    same(target.shoeColor, self.shoeColor),
    10,
    'shoeColor'
  );

  add(
    same(target.venueArea, self.venueArea),
    15,
    'venueArea'
  );

  add(
    same(target.activity, self.activity),
    10,
    'activity'
  );

  const overlaps = identifierOverlap(
    target.identifiers,
    self.identifiers
  );

  if (overlaps > 0) {
    score += Math.min(25, overlaps * 15);
    matchedFields.push('identifiers');
  }

  const jewelryMatches = arrayOverlap(
    target.jewelry,
    self.jewelry
  );

  if (jewelryMatches > 0) {
    score += Math.min(20, jewelryMatches * 10);
    matchedFields.push('jewelry');
  }

  return {
    score: Math.min(100, score),
    rawScore: score,
    matchedFields,
  };
}