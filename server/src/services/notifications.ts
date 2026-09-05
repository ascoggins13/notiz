import { db } from '../config/firebase';

export async function notifyUser(
  userId: string,
  title: string,
  body: string,
  data: Record<string, string> = {}
) {
  const snap = await db
    .collection('users')
    .doc(userId)
    .get();

  const tokens =
    (snap.data()?.pushTokens ?? []) as string[];

  if (!tokens.length) {
    return;
  }

  const messages = tokens.map((token) => ({
    to: token,
    sound: 'default',
    title,
    body,
    data,
  }));

  const response = await fetch(
    'https://exp.host/--/api/v2/push/send',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      'Expo push notification failed:',
      errorText
    );

    return;
  }

  const result = await response.json();

  console.log(
    'Expo push notification sent:',
    result
  );
}
