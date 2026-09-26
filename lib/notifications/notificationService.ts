export type NotificationPermissionState = "default" | "granted" | "denied" | "unsupported";

export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (err) {
    console.warn("Error requesting notification permission", err);
    return "denied";
  }
}

export function sendBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        ...options,
      });
      return true;
    } catch (err) {
      console.warn("Failed to dispatch browser notification", err);
    }
  }
  return false;
}
