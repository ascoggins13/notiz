import { describe, expect, it } from 'vitest';
import { scoreAppearance } from './matching';

describe('scoreAppearance', () => {
  it('scores a highly specific match above threshold', () => {
    const result = scoreAppearance(
      { gender: 'woman', shirtColor: 'red', pantsColor: 'black', shoeColor: 'white', identifiers: ['glasses'], venueArea: 'treadmills' },
      { gender: 'woman', shirtColor: 'red', pantsColor: 'black', shoeColor: 'white', identifiers: ['glasses'], venueArea: 'treadmills' },
    );
    expect(result.score).toBeGreaterThanOrEqual(55);
  });
  it('does not score unrelated descriptions highly', () => {
    expect(scoreAppearance({ shirtColor: 'red' }, { shirtColor: 'blue' }).score).toBe(0);
  });
});
