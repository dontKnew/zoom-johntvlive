import { useEffect } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";

/**
 * Listens for device ID changes and logs out if the current device
 * doesn't match the registered one. Only handles logout; nothing else.
 *
 * @param {string} panelUserId - The user ID in Firebase DB
 * @param {string} currentDeviceId - Current device ID
 * @param {function} onLogout - Callback after successful logout
 */
const useDeviceLogoutListener = (panelUserId, currentDeviceId, onLogout, leaveMeeting=null) => {
  useEffect(() => {
    if (!panelUserId) return;

    // console.log("panelUserId ", panelUserId, "token", currentDeviceId);
    const db = getDatabase();
    const deviceRef = ref(db, `users/${panelUserId}/deviceId`);

    const listener = onValue(deviceRef, async (snapshot) => {
      const registeredDeviceId = snapshot.val();

      // If device mismatch, log out
      if (registeredDeviceId && registeredDeviceId !== currentDeviceId) {
        try {
          const auth = getAuth();
          await signOut(auth); // only log out
          if (typeof onLogout === "function") onLogout();
          if (typeof leaveMeeting === "function") leaveMeeting();
        } catch (err) {
          console.error("Failed to log out:", err);
        }
      }
    });

    // Cleanup listener when component unmounts
    return () => off(deviceRef, "value", listener);
  }, [panelUserId, currentDeviceId, onLogout]);
};

export default useDeviceLogoutListener;
