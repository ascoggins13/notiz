let notificationNavigationPending = false;

export function setNotificationNavigationPending() {
  notificationNavigationPending = true;
}

export function isNotificationNavigationPending() {
  return notificationNavigationPending;
}

export function clearNotificationNavigationPending() {
  notificationNavigationPending = false;
}
