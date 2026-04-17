import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
// You must provide the service account key via environment variable or file
if (!admin.apps.length) {
  try {
    // Attempt to initialize with default credentials (if deployed on GCP/Firebase)
    // or through GOOGLE_APPLICATION_CREDENTIALS env var
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.warn("Firebase Admin initialization skipped: Provide GOOGLE_APPLICATION_CREDENTIALS");
  }
}

/**
 * Send a push notification to a specific device via FCM
 */
export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  if (!admin.apps.length) {
    // Mock for local dev if firebase isn't set up
    console.log(`[MOCK PUSH] To: ${token} | Title: ${title} | Body: ${body}`);
    return true;
  }

  try {
    const message = {
      notification: { title, body },
      data: data || {},
      token,
    };

    const response = await admin.messaging().send(message);
    return response;
  } catch (err: any) {
    // Handle unregistered tokens (e.g., user uninstalled app or logged out)
    if (
      err.code === "messaging/invalid-registration-token" ||
      err.code === "messaging/registration-token-not-registered"
    ) {
      console.warn(`[FCM] Invalid or stale token: ${token}`);
      // Usually, you'd trigger a DB call to delete this token
    }
    console.error("[FCM] Push Notification Failed:", err);
    throw err;
  }
}
