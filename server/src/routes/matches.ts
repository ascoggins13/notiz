import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config/firebase';
import { meetingLocationSchema, preferenceSchema } from '../utils/validation';
import { notifyUser } from '../services/notifications';

export const matchesRouter = Router();

matchesRouter.get('/', async (req, res) => {
  const snap = await db
    .collection('matches')
    .where('userIds', 'array-contains', req.user!.uid)
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();

  const currentUserSnap = await db
    .collection('users')
    .doc(req.user!.uid)
    .get();

  const blockedUserIds =
    (currentUserSnap.data()?.blockedUserIds as string[] | undefined) ?? [];

  const results = await Promise.all(
    snap.docs.map(async (doc) => {
      const data = doc.data();
      const userIds = data.userIds as string[];

      const otherUserId = userIds.find(
        (id) => id !== req.user!.uid
      );
      
      if (!otherUserId) {
        return null;
      }
      
      if (blockedUserIds.includes(otherUserId)) {
        return null;
      }
      
      const otherUserSnap = await db
        .collection('users')
        .doc(otherUserId)
        .get();
      
      const otherBlockedUserIds =
        (otherUserSnap.data()?.blockedUserIds as string[] | undefined) ?? [];
      
      if (otherBlockedUserIds.includes(req.user!.uid)) {
        return null;
      }
      
      const displayName =
        otherUserSnap.data()?.displayName ?? 'Someone';

      const latestMessageSnap = await doc.ref
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      const latestMessage = latestMessageSnap.empty
        ? null
        : {
            id: latestMessageSnap.docs[0].id,
            ...latestMessageSnap.docs[0].data(),
          };

      return {
        id: doc.id,
        status: data.status,

        otherUser: {
          displayName,
        },

        myUnreadCount:
          data.unreadCounts?.[req.user!.uid] ?? 0,

        latestMessage,

        chatAvailable:
          data.counterProposal?.preference === 'chat_first' &&
          data.counterProposal?.status === 'accepted' ||
          data.preferences?.[req.user!.uid] === 'chat_first',
      };
    })
  );

  return res.json(
    results.filter((item) => item !== null)
  );
});

matchesRouter.get('/unread-total', async (req, res) => {
  const currentUserSnap = await db
    .collection('users')
    .doc(req.user!.uid)
    .get();

  const blockedUserIds =
    (currentUserSnap.data()?.blockedUserIds as string[] | undefined) ?? [];

  const snap = await db
    .collection('matches')
    .where('userIds', 'array-contains', req.user!.uid)
    .limit(50)
    .get();

  let unreadCount = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const userIds = data.userIds as string[];

    const otherUserId = userIds.find(
      (id) => id !== req.user!.uid
    );

    if (!otherUserId) continue;

    if (blockedUserIds.includes(otherUserId)) {
      continue;
    }

    const otherUserSnap = await db
      .collection('users')
      .doc(otherUserId)
      .get();

    const otherBlockedUserIds =
      (otherUserSnap.data()?.blockedUserIds as string[] | undefined) ?? [];

    if (otherBlockedUserIds.includes(req.user!.uid)) {
      continue;
    }

    unreadCount +=
      data.unreadCounts?.[req.user!.uid] ?? 0;
  }

  return res.json({
    unreadCount,
  });
});

matchesRouter.get('/:id', async (req, res) => {
  const matchRef = db.collection('matches').doc(req.params.id);
  const matchSnap = await matchRef.get();

  if (!matchSnap.exists) {
    return res.status(404).json({ error: 'Match not found.' });
  }

  const match = matchSnap.data()!;
  const userIds = match.userIds as string[];

  if (!userIds.includes(req.user!.uid)) {
    return res.status(404).json({ error: 'Match not found.' });
  }

  const otherUserId = userIds.find((id) => id !== req.user!.uid);

  if (!otherUserId) {
    return res.status(400).json({ error: 'Invalid match.' });
  }

  const otherUserSnap = await db.collection('users').doc(otherUserId).get();
  const otherUser = otherUserSnap.data();
return res.json({
  id: matchSnap.id,
  status: match.status,
  venueId: match.venueId,
  venueType: match.venueType,
  myUserId: req.user!.uid,
  
  otherUser: {
    id: otherUserId,
    displayName: otherUser?.displayName ?? 'Someone',
  },

  myPreference:
    match.preferences?.[req.user!.uid] ?? null,

  theirPreference:
    match.preferences?.[otherUserId] ?? null,

  myReady:
    match.readyStatus?.[req.user!.uid] ?? false,

  theirReady:
    match.readyStatus?.[otherUserId] ?? false,

    myMeetingLocation:
    match.meetingLocations?.[req.user!.uid] ?? null,
  
  theirMeetingLocation:
    match.meetingLocations?.[otherUserId] ?? null,
  
  myAfterWorkout:
    match.afterWorkout?.[req.user!.uid] ?? null,
  
  theirAfterWorkout:
    match.afterWorkout?.[otherUserId] ?? null,
  
  counterProposal:
    match.counterProposal ?? null,
    myChatReadAt:
  match.chatReadAt?.[req.user!.uid] ?? null,

theirChatReadAt:
  match.chatReadAt?.[otherUserId] ?? null,
});
});
matchesRouter.get('/:id/messages/unread-count', async (req, res) => {
  const matchRef = db.collection('matches').doc(req.params.id);
  const matchSnap = await matchRef.get();

  if (!matchSnap.exists) {
    return res.status(404).json({
      error: 'Match not found.',
    });
  }

  const match = matchSnap.data()!;
  const userIds = match.userIds as string[];

  if (!userIds.includes(req.user!.uid)) {
    return res.status(404).json({
      error: 'Match not found.',
    });
  }

  const myReadAt =
    match.chatReadAt?.[req.user!.uid] ?? null;

  let query = matchRef
    .collection('messages')
    .where('senderId', '!=', req.user!.uid);

  if (myReadAt) {
    query = query.where(
      'createdAt',
      '>',
      myReadAt
    );
  }

  const snap = await query.get();

  return res.json({
    unreadCount: snap.size,
  });
});
matchesRouter.post('/:id/preference', async (req, res) => {
  const parsed = preferenceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const ref = db.collection('matches').doc(req.params.id);
  const snap = await ref.get();
  const users = snap.data()?.userIds as string[] | undefined;
  if (!snap.exists || !users?.includes(req.user!.uid)) return res.status(404).json({ error: 'Match not found.' });
  await ref.update({
    [`preferences.${req.user!.uid}`]: parsed.data.preference,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return res.json({ ok: true });
});
matchesRouter.post('/:id/meeting-location', async (req, res) => {
  const parsed = meetingLocationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const ref = db.collection('matches').doc(req.params.id);
  const snap = await ref.get();

  const users = snap.data()?.userIds as string[] | undefined;

  if (!snap.exists || !users?.includes(req.user!.uid)) {
    return res.status(404).json({ error: 'Match not found.' });
  }

  await ref.update({
    [`meetingLocations.${req.user!.uid}`]: parsed.data.location,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return res.json({ ok: true });
});
matchesRouter.post('/:id/after-workout', async (req, res) => {
  const minutes = Number(req.body.minutes);

  if (
    !Number.isInteger(minutes) ||
    minutes < 5 ||
    minutes > 180
  ) {
    return res.status(400).json({
      error: 'Choose a wait time between 5 and 180 minutes.',
    });
  }

  const ref = db.collection('matches').doc(req.params.id);
  const snap = await ref.get();

  const match = snap.data();
  const users = match?.userIds as string[] | undefined;

  if (!snap.exists || !users?.includes(req.user!.uid)) {
    return res.status(404).json({
      error: 'Match not found.',
    });
  }

  const estimatedReadyAt =
    new Date(Date.now() + minutes * 60 * 1000);

  await ref.update({
    [`afterWorkout.${req.user!.uid}`]: {
      minutes,
      estimatedReadyAt,
      acceptedByOther: false,
    },
    updatedAt: FieldValue.serverTimestamp(),
  });

  return res.json({
    ok: true,
    minutes,
    estimatedReadyAt,
  });
});
matchesRouter.post('/:id/after-workout/accept', async (req, res) => {
  const ref = db.collection('matches').doc(req.params.id);
  const snap = await ref.get();

  const match = snap.data();
  const users = match?.userIds as string[] | undefined;

  if (!snap.exists || !users?.includes(req.user!.uid)) {
    return res.status(404).json({
      error: 'Match not found.',
    });
  }

  const otherUserId = users.find(
    (id) => id !== req.user!.uid
  );

  if (!otherUserId) {
    return res.status(400).json({
      error: 'Invalid match.',
    });
  }

  if (!match?.afterWorkout?.[otherUserId]) {
    return res.status(400).json({
      error: 'No after-workout proposal found.',
    });
  }

  await ref.update({
    [`afterWorkout.${otherUserId}.acceptedByOther`]: true,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return res.json({ ok: true });
});

matchesRouter.post('/:id/counter-proposal', async (req, res) => {
  const preference = String(req.body.preference ?? '');

  const allowed = [
    'approach_now',
    'chat_first',
    'exchange_contact',
    'meet_later',
    'have_a_drink',
  ];

  if (!allowed.includes(preference)) {
    return res.status(400).json({
      error: 'Invalid connection option.',
    });
  }

  const ref = db.collection('matches').doc(req.params.id);
  const snap = await ref.get();

  if (!snap.exists) {
    return res.status(404).json({
      error: 'Match not found.',
    });
  }

  const match = snap.data()!;
  const users = match.userIds as string[];

  if (!users.includes(req.user!.uid)) {
    return res.status(404).json({
      error: 'Match not found.',
    });
  }

  await ref.update({
    counterProposal: {
      fromUserId: req.user!.uid,
      preference,
      status: 'pending',
      createdAt: new Date(),
    },
    updatedAt: FieldValue.serverTimestamp(),
  });

  return res.json({ ok: true });
});

matchesRouter.post('/:id/counter-proposal/respond', async (req, res) => {
  const response = String(req.body.response ?? '');

  if (!['accepted', 'declined'].includes(response)) {
    return res.status(400).json({
      error: 'Invalid response.',
    });
  }

  const ref = db.collection('matches').doc(req.params.id);
  const snap = await ref.get();

  if (!snap.exists) {
    return res.status(404).json({
      error: 'Match not found.',
    });
  }

  const match = snap.data()!;
  const users = match.userIds as string[];

  if (!users.includes(req.user!.uid)) {
    return res.status(404).json({
      error: 'Match not found.',
    });
  }

  const proposal = match.counterProposal;

  if (!proposal || proposal.status !== 'pending') {
    return res.status(400).json({
      error: 'No pending proposal.',
    });
  }

  if (proposal.fromUserId === req.user!.uid) {
    return res.status(400).json({
      error: 'You cannot respond to your own proposal.',
    });
  }

  await ref.update({
    'counterProposal.status': response,
    'counterProposal.respondedBy': req.user!.uid,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return res.json({ ok: true });
});

matchesRouter.post('/:id/ready', async (req, res) => {
  const ready = Boolean(req.body.ready);

  const ref = db.collection('matches').doc(req.params.id);
  const snap = await ref.get();

  const users = snap.data()?.userIds as string[] | undefined;

  if (!snap.exists || !users?.includes(req.user!.uid)) {
    return res.status(404).json({ error: 'Match not found.' });
  }

  await ref.update({
    [`readyStatus.${req.user!.uid}`]: ready,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return res.json({ ok: true });
});

matchesRouter.get('/:id/messages', async (req, res) => {
  const matchRef = db.collection('matches').doc(req.params.id);
  const matchSnap = await matchRef.get();

  if (!matchSnap.exists) {
    return res.status(404).json({
      error: 'Match not found.',
    });
  }

  const match = matchSnap.data()!;
  const userIds = match.userIds as string[];
  if (match.status === 'blocked') {
    return res.status(403).json({
      error: 'This connection is no longer available.',
    });
  }

  if (!userIds.includes(req.user!.uid)) {
    return res.status(404).json({
      error: 'Match not found.',
    });
  }

  const messagesSnap = await matchRef
    .collection('messages')
    .orderBy('createdAt', 'asc')
    .limit(100)
    .get();

  return res.json(
    messagesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  );
});

matchesRouter.post('/:id/messages', async (req, res) => {
  const text = String(req.body.text ?? '').trim();

  if (!text) {
    return res.status(400).json({
      error: 'Message cannot be empty.',
    });
  }

  if (text.length > 1000) {
    return res.status(400).json({
      error: 'Message is too long.',
    });
  }

  const matchRef = db.collection('matches').doc(req.params.id);
  const matchSnap = await matchRef.get();

  if (!matchSnap.exists) {
    return res.status(404).json({
      error: 'Match not found.',
    });
  }

  const match = matchSnap.data()!;
  const userIds = match.userIds as string[];

  if (!userIds.includes(req.user!.uid)) {
    return res.status(404).json({
      error: 'Match not found.',
    });
  }

  const otherUserId = userIds.find(
    (id) => id !== req.user!.uid
  );


  console.log(
    'MESSAGE',
    'sender:',
    req.user!.uid,
    'recipient:',
    otherUserId
  );
  
  if (!otherUserId) {
    return res.status(400).json({
      error: 'Invalid match.',
    });
  }

const chatAllowed =
  match.preferences?.[req.user!.uid] === 'chat_first' ||
  (
    match.counterProposal?.preference === 'chat_first' &&
    match.counterProposal?.status === 'accepted'
  );
  if (!chatAllowed) {
    return res.status(403).json({
      error: 'Chat has not been agreed to.',
    });
  }

  const messageRef = matchRef.collection('messages').doc();

  await messageRef.set({
    senderId: req.user!.uid,
    text,
    createdAt: FieldValue.serverTimestamp(),
  });

  await matchRef.update({
    [`unreadCounts.${otherUserId}`]:
      FieldValue.increment(1),
  
    updatedAt:
      FieldValue.serverTimestamp(),
  });

  await notifyUser(
    otherUserId,
    'New message',
    text,
    {
      type: 'chat_message',
      matchId: matchRef.id,
    }
  );



  return res.status(201).json({
    id: messageRef.id,
    senderId: req.user!.uid,
    text,
  });
  });

  matchesRouter.post('/:id/messages/read', async (req, res) => {
    const matchRef = db.collection('matches').doc(req.params.id);
    const matchSnap = await matchRef.get();
  
    if (!matchSnap.exists) {
      return res.status(404).json({
        error: 'Match not found.',
      });
    }
  
    const match = matchSnap.data()!;
    const userIds = match.userIds as string[];
  
    if (!userIds.includes(req.user!.uid)) {
      return res.status(404).json({
        error: 'Match not found.',
      });
    }
  
    await matchRef.update({
      [`chatReadAt.${req.user!.uid}`]:
        FieldValue.serverTimestamp(),
  
      [`unreadCounts.${req.user!.uid}`]: 0,
  
      updatedAt:
        FieldValue.serverTimestamp(),
    });
  
    return res.json({ ok: true });
  });
  
  

