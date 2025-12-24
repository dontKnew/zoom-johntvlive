import { getDatabase, ref, set, serverTimestamp, onDisconnect } from "firebase/database";

const setUserStatus = (status, user_id = null) => {
  if (!user_id) return;

  const db = getDatabase();
  const statusRef = ref(db, `users/${user_id}`);

  const isOnline = {
    status: "Online",
    lastSeen: serverTimestamp(),
  };

  const isOffline = {
    status: "Offline",
    lastSeen: serverTimestamp(),
  };

  if(status=="Offline"){
    set(statusRef, isOffline);
  }else {
    set(statusRef, isOnline);
  }
  // When tab/browser closes -> set offline automatically (NO need for events)
  onDisconnect(statusRef).set(isOffline);
};

export default setUserStatus;
