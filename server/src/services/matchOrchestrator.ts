import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { db } from '../config/firebase';
import { AppearanceDescription } from '../types/models';
import { scoreAppearance } from './matching';
import { notifyUser } from './notifications';

const threshold = Number(process.env.MATCH_THRESHOLD ?? 55);

export async function findCandidateForNotice(noticeId: string, senderId: string, venueId: string, target: AppearanceDescription) {
  const now = Timestamp.now();
  const senderUserSnap = await db
  .collection('users')
  .doc(senderId)
  .get();

const senderBlocked =
  (senderUserSnap.data()?.blockedUserIds as string[] | undefined) ?? [];
  const checkins = await db.collection('checkins')
    .where('venueId', '==', venueId)
    .where('status', '==', 'active')
    .where('expiresAt', '>', now)
    .get();

    const candidates: {
      userId: string;
      checkinId: string;
      venueName: string;
      venueType: 'gym' | 'bar';
      score: number;
      rawScore: number;
      matchedFields: string[];
    }[] = [];

for (const checkinDoc of checkins.docs) {
  const checkin = checkinDoc.data();

  if (checkin.userId === senderId) continue;
  if (senderBlocked.includes(checkin.userId)) {
    continue;
  }
  const candidateUserSnap = await db
  .collection('users')
  .doc(checkin.userId)
  .get();

const candidateBlocked =
  (candidateUserSnap.data()?.blockedUserIds as string[] | undefined) ?? [];

if (candidateBlocked.includes(senderId)) {
  continue;
}

  const selfDoc = await db
    .collection('selfDescriptions')
    .doc(checkinDoc.id)
    .get();

  if (!selfDoc.exists) continue;

  const result = scoreAppearance(
    target,
    selfDoc.data() as AppearanceDescription
  );

  if (result.score >= threshold) {
    candidates.push({
      userId: checkin.userId,
      checkinId: checkinDoc.id,
      venueName: checkin.venueName,
      venueType: checkin.venueType,
      ...result,
    });
  }
}

candidates.sort((a, b) => b.rawScore - a.rawScore);

const best = candidates[0];
const second = candidates[1];

if (!best) {
  return {
    status: 'searching' as const,
  };
}

const ambiguityMargin = Number(
  process.env.MATCH_AMBIGUITY_MARGIN ?? 15
);

const ambiguous =
  second &&
  best.rawScore - second.rawScore < ambiguityMargin;

if (ambiguous) {
  await db.collection('notices').doc(noticeId).update({
    status: 'needs_clarification',
    candidateCount: candidates.length,
    topCandidateScore: best.score,
    secondCandidateScore: second.score,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    status: 'needs_clarification' as const,
    candidateCount: candidates.length,
  };
}

  await db.collection('notices').doc(noticeId).update({
    candidateUserId: best.userId,
    candidateCheckinId: best.checkinId,
    confidenceScore: best.score,
    matchedFields: best.matchedFields,
    status: 'candidate_found',
    updatedAt: FieldValue.serverTimestamp(),
  });

  await notifyUser(
    best.userId,
    'Someone noticed you',
    'Open Notiz if someone caught your attention too.',
    {
      type: 'candidate_notice',
      checkinId: best.checkinId,
      venueId,
      venueName: best.venueName,
      venueType: best.venueType,
    }
  );

  const reciprocal = await db.collection('notices')
    .where('senderId', '==', best.userId)
    .where('candidateUserId', '==', senderId)
    .where('venueId', '==', venueId)
    .where('status', '==', 'candidate_found')
    .limit(1)
    .get();

  if (reciprocal.empty) return { status: 'candidate_found' as const, score: best.score };

  const reciprocalDoc = reciprocal.docs[0];
  const sortedUserIds = [senderId, best.userId].sort();
const matchKey = `${venueId}_${sortedUserIds.join('_')}`;
const matchRef = db.collection('matches').doc(matchKey);
  const batch = db.batch();
  batch.set(matchRef, {
    userIds:  sortedUserIds,
    venueId,
    noticeIds: [noticeId, reciprocalDoc.id],
    status: 'mutual',
    preferences: {},
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  batch.update(db.collection('notices').doc(noticeId), { status: 'mutual', matchId: matchRef.id });
  batch.update(reciprocalDoc.ref, { status: 'mutual', matchId: matchRef.id });
  await batch.commit();

  await Promise.all([
    notifyUser(senderId, 'You noticed each other', 'Choose how you would like to connect.', { type: 'mutual_match', matchId: matchRef.id }),
    notifyUser(best.userId, 'You noticed each other', 'Choose how you would like to connect.', { type: 'mutual_match', matchId: matchRef.id }),
  ]);

  return { status: 'mutual' as const, matchId: matchRef.id };
}
