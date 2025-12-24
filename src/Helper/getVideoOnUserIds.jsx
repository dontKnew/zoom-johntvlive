export function getVideoOnUserIds(ZoomMtg) {
//   console.log("getVideoOnUserIds ", ZoomMtg);
// console.log("ZoomMtg.getAttendeeslist exists?", typeof ZoomMtg.getAttendeeslist);

  return new Promise((resolve, reject) => {
    try {
      ZoomMtg.getAttendeeslist({
        success: (res) => {
          // console.log("✅ Attendees Response:", res);

          const attendeesList = res?.result?.attendeesList || [];

          const videoUsers = attendeesList
            .filter((p) => p.video === true)
            .map((p) => p.userId);

          // console.log("🎥 Video ON User IDs:", videoUsers);
          resolve(videoUsers);
        },

        error: (err) => {
          console.error("❌ Error getting attendees list:", err);
          reject(err);
        },
      });
    } catch (err) {
      console.error("❌ Exception in getVideoOnUserIds:", err);
      reject(err);
    }
  });
}
