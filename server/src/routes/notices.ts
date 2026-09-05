import { Router } from 'express';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { db } from '../config/firebase';
import { findCandidateForNotice } from '../services/matchOrchestrator';
import { appearanceSchema } from '../utils/validation';
import { AppearanceDescription } from '../types/models';

export const noticesRouter = Router();

noticesRouter.get('/incoming', async (req, res) => {
  const checkinId = String(req.query.checkinId ?? '');

  if (!checkinId) {
    return res.status(400).json({ error: 'Check-in required.' });
  }

  const checkinRef = db.collection('checkins').doc(checkinId);
  const checkin = await checkinRef.get();

  if (
    !checkin.exists ||
    checkin.data()?.userId !== req.user!.uid ||
    checkin.data()?.status !== 'active'
  ) {
    return res.status(404).json({ error: 'Active check-in not found.' });
  }

  const snap = await db
    .collection('notices')
    .where('candidateCheckinId', '==', checkinId)
    .limit(10)
    .get();

  const now = Date.now();

  const incoming = snap.docs.find((doc) => {
    const data = doc.data();

    return (
      data.status === 'candidate_found' &&
      (!data.expiresAt || data.expiresAt.toMillis() > now)
    );
  });

  return res.json({
    hasIncoming: Boolean(incoming),
  });
});

noticesRouter.get('/status', async (req, res) => {
  const checkinId = String(req.query.checkinId ?? '');

  if (!checkinId) {
    return res.status(400).json({ error: 'Check-in required.' });
  }

  const checkin = await db.collection('checkins').doc(checkinId).get();

  if (
    !checkin.exists ||
    checkin.data()?.userId !== req.user!.uid
  ) {
    return res.status(404).json({ error: 'Check-in not found.' });
  }

  const snap = await db
  .collection('notices')
  .where('senderCheckinId', '==', checkinId)
  .limit(20)
  .get();

const notices = snap.docs
  .map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  .filter(
    (item: any) =>
      item.senderId === req.user!.uid
  )
  .sort((a: any, b: any) => {
    const aTime =
      a.createdAt?.toMillis?.() ?? 0;

    const bTime =
      b.createdAt?.toMillis?.() ?? 0;

    return bTime - aTime;
  });

const notice = notices[0];

  if (!notice) {
    return res.json({
      status: 'none',
      matchId: null,
    });
  }

  return res.json({
    status: (notice as any).status,
    matchId: (notice as any).matchId ?? null,
  });
});

noticesRouter.post('/:id/refine', async (req, res) => {
  const noticeRef = db.collection('notices').doc(req.params.id);
  const noticeSnap = await noticeRef.get();

  if (!noticeSnap.exists) {
    return res.status(404).json({
      error: 'Notiz not found.',
    });
  }

  const notice = noticeSnap.data()!;

  if (notice.senderId !== req.user!.uid) {
    return res.status(404).json({
      error: 'Notiz not found.',
    });
  }

  if (notice.status !== 'needs_clarification') {
    return res.status(400).json({
      error: 'This Notiz does not need clarification.',
    });
  }

  const parsed = appearanceSchema.safeParse(
    req.body.targetDescription
  );

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid description.',
    });
  }

  await noticeRef.update({
    targetDescription: parsed.data,
    status: 'searching',
    updatedAt: FieldValue.serverTimestamp(),
  });

  const result = await findCandidateForNotice(
    noticeRef.id,
    req.user!.uid,
    notice.venueId,
    parsed.data as AppearanceDescription
  );

  return res.json({
    id: noticeRef.id,
    ...result,
  });
});

noticesRouter.post('/', async (req, res) => {
  const parsed = appearanceSchema.safeParse(req.body.targetDescription);
  const checkinId = String(req.body.checkinId ?? '');
  if (!parsed.success || !checkinId) return res.status(400).json({ error: 'Invalid notice.' });
  const checkin = await db.collection('checkins').doc(checkinId).get();
  if (!checkin.exists || checkin.data()?.userId !== req.user!.uid || checkin.data()?.status !== 'active') {
    return res.status(400).json({ error: 'An active check-in is required.' });
  }
  const duplicate = await db.collection('notices')
    .where('senderId', '==', req.user!.uid)
    .where('senderCheckinId', '==', checkinId)
    .where(
      'status',
      'in',
      [
        'searching',
        'needs_clarification',
        'candidate_found',
        'mutual',
      ]
    )
    .limit(1).get();
  if (!duplicate.empty) return res.status(409).json({ error: 'You already have an active notice for this check-in.' });

  const ttl = Number(process.env.NOTICE_TTL_MINUTES ?? 120);
  const ref = db.collection('notices').doc();
  await ref.set({
    senderId: req.user!.uid,
    senderCheckinId: checkinId,
    venueId: checkin.data()!.venueId,
    targetDescription: parsed.data,
    status: 'searching',
    createdAt: FieldValue.serverTimestamp(),
    expiresAt: Timestamp.fromMillis(Date.now() + ttl * 60_000),
  });
  const result = await findCandidateForNotice(
    ref.id,
    req.user!.uid,
    checkin.data()!.venueId,
    parsed.data as AppearanceDescription
  );
  return res.status(201).json({ id: ref.id, ...result });
});
