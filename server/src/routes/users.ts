import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config/firebase';
import { getAuth } from 'firebase-admin/auth';

export const usersRouter = Router();

usersRouter.put('/me', async (req, res) => {
  const allowed = {
    profileComplete: Boolean(req.body.profileComplete),
    displayName: String(req.body.displayName ?? '').trim().slice(0, 80),
    birthYear: Number(req.body.birthYear),
    gender: String(req.body.gender ?? '').trim().slice(0, 40),
    interestedIn: Array.isArray(req.body.interestedIn) ? req.body.interestedIn.slice(0, 10) : [],
    termsAcceptedAt:
  String(req.body.termsAcceptedAt ?? '').trim(),

privacyAcceptedAt:
  String(req.body.privacyAcceptedAt ?? '').trim(),

termsVersion:
  String(req.body.termsVersion ?? '').trim(),

privacyVersion:
  String(req.body.privacyVersion ?? '').trim(),
  };
  if (!allowed.displayName || !Number.isInteger(allowed.birthYear)) return res.status(400).json({ error: 'Display name and birth year are required.' });
  await db.collection('users').doc(req.user!.uid).set({ ...allowed, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  return res.json({ ok: true });
});

usersRouter.post('/push-token', async (req, res) => {
  const token = String(req.body.token ?? '').trim();
  if (!token) return res.status(400).json({ error: 'Token required.' });
  await db.collection('users').doc(req.user!.uid).set({ pushTokens: FieldValue.arrayUnion(token) }, { merge: true });
  return res.json({ ok: true });
});

usersRouter.post('/block', async (req, res) => {
  const blockedUserId = String(req.body.userId ?? '');

  if (
    !blockedUserId ||
    blockedUserId === req.user!.uid
  ) {
    return res.status(400).json({
      error: 'Invalid user.',
    });
  }

  // Add the user to my blocked list.
  await db
    .collection('users')
    .doc(req.user!.uid)
    .set(
      {
        blockedUserIds:
          FieldValue.arrayUnion(blockedUserId),
      },
      { merge: true }
    );

  // Find matches between these two users.
  const matchesSnap = await db
    .collection('matches')
    .where(
      'userIds',
      'array-contains',
      req.user!.uid
    )
    .get();

  for (const matchDoc of matchesSnap.docs) {
    const match = matchDoc.data();

    const userIds =
      (match.userIds as string[] | undefined) ?? [];

    if (!userIds.includes(blockedUserId)) {
      continue;
    }

    // Kill the existing connection.
    await matchDoc.ref.update({
      status: 'blocked',
      blockedBy: req.user!.uid,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Find notices attached to this match.
    const noticesSnap = await db
      .collection('notices')
      .where('matchId', '==', matchDoc.id)
      .get();

    for (const noticeDoc of noticesSnap.docs) {
      await noticeDoc.ref.update({
        status: 'blocked',
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  }

  return res.json({ ok: true });
});
usersRouter.delete('/block', async (req, res) => {
  const blockedUserId = String(req.body.userId ?? '');

  if (!blockedUserId) {
    return res.status(400).json({
      error: 'Invalid user.',
    });
  }

  await db.collection('users').doc(req.user!.uid).set(
    {
      blockedUserIds:
        FieldValue.arrayRemove(blockedUserId),
    },
    { merge: true }
  );

  return res.json({ ok: true });
});

usersRouter.get('/blocked', async (req, res) => {
  const userRef = db
    .collection('users')
    .doc(req.user!.uid);

  const userSnap = await userRef.get();

  const blockedUserIds =
    (userSnap.data()?.blockedUserIds as string[] | undefined) ?? [];

  if (blockedUserIds.length === 0) {
    return res.json([]);
  }

  const blockedUsers = await Promise.all(
    blockedUserIds.map(async (userId) => {
      const snap = await db
        .collection('users')
        .doc(userId)
        .get();

      return {
        id: userId,
        displayName:
          snap.data()?.displayName ?? 'Notiz user',
      };
    })
  );

  return res.json(blockedUsers);
});

usersRouter.post('/report', async (req, res) => {
  const reportedUserId = String(req.body.userId ?? '');
  const matchId = String(req.body.matchId ?? '');
  const reason = String(req.body.reason ?? '');
  const details = String(req.body.details ?? '').trim().slice(0, 1000);

  const allowedReasons = [
    'harassment',
    'inappropriate_behavior',
    'fake_or_spam',
    'safety_concern',
    'other',
  ];

  if (
    !reportedUserId ||
    reportedUserId === req.user!.uid ||
    !allowedReasons.includes(reason)
  ) {
    return res.status(400).json({
      error: 'Invalid report.',
    });
  }

  if (matchId) {
    const matchSnap = await db
      .collection('matches')
      .doc(matchId)
      .get();

    if (!matchSnap.exists) {
      return res.status(404).json({
        error: 'Match not found.',
      });
    }

    const userIds =
      (matchSnap.data()?.userIds as string[] | undefined) ?? [];

    if (
      !userIds.includes(req.user!.uid) ||
      !userIds.includes(reportedUserId)
    ) {
      return res.status(404).json({
        error: 'Match not found.',
      });
    }
  }

  const reportRef = db.collection('reports').doc();

  await reportRef.set({
    reporterUserId: req.user!.uid,
    reportedUserId,
    matchId: matchId || null,
    reason,
    details: details || null,
    status: 'open',
    createdAt: FieldValue.serverTimestamp(),
  });

  return res.status(201).json({
    id: reportRef.id,
    ok: true,
  });
});

usersRouter.delete('/me', async (req, res) => {
  const uid = req.user!.uid;

  // End any active check-ins.
  const checkinsSnap = await db
    .collection('checkins')
    .where('userId', '==', uid)
    .get();

  for (const doc of checkinsSnap.docs) {
    await doc.ref.update({
      status: 'ended',
      endedAt: FieldValue.serverTimestamp(),
    });
  }

  // Remove self-description records belonging to this user.
  const descriptionsSnap = await db
    .collection('selfDescriptions')
    .where('userId', '==', uid)
    .get();

  for (const doc of descriptionsSnap.docs) {
    await doc.ref.delete();
  }

  // Mark existing matches as unavailable rather than deleting
  // the other person's history.
  const matchesSnap = await db
    .collection('matches')
    .where('userIds', 'array-contains', uid)
    .get();

  for (const doc of matchesSnap.docs) {
    await doc.ref.update({
      status: 'account_deleted',
      deletedUserIds: FieldValue.arrayUnion(uid),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  // Stop active notices from this account.
  const noticesSnap = await db
    .collection('notices')
    .where('senderId', '==', uid)
    .get();

  for (const doc of noticesSnap.docs) {
    await doc.ref.update({
      status: 'account_deleted',
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  // Delete the Notiz profile.
  await db.collection('users').doc(uid).delete();

  // Finally remove Firebase Authentication account.
  await getAuth().deleteUser(uid);

  return res.status(204).send();
});

usersRouter.get('/me', async (req, res) => {
  const ref = db.collection('users').doc(req.user!.uid);
  const snap = await ref.get();

  if (!snap.exists) {
    return res.json({
      profileComplete: false,
    });
  }

  return res.json({
    id: snap.id,
    ...snap.data(),
  });
});