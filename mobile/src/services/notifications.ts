import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from './api';

export async function registerForPushNotifications() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const existingPermissions =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingPermissions.status;

    if (finalStatus !== 'granted') {
      const requestedPermissions =
        await Notifications.requestPermissionsAsync();

      finalStatus = requestedPermissions.status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission was not granted.');
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      throw new Error('Expo project ID not found.');
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

    console.log('Expo push token:', token);

await api('/api/users/push-token', {
  method: 'POST',
  body: JSON.stringify({
    token,
  }),
});

console.log('Push token saved to backend.');

return token;
  } catch (error) {
    console.error(
      'Failed to register for push notifications:',
      error
    );

    return null;
  }
}
