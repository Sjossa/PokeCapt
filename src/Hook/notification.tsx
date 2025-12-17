export async function showNotification(
  title: string,
  options?: NotificationOptions
) {
  if (!("serviceWorker" in navigator)) return;
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const registration = await navigator.serviceWorker.ready;
  registration.showNotification(title, options);
}
