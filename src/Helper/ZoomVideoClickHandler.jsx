import { useEffect } from "react";

export default function ZoomVideoClickHandler({ isInMeeting, onVideoDouble }) {
  useEffect(() => {
    if (!isInMeeting) return;

    const root = document.getElementById("zmmtg-root");
    if (!root) return;

    const handleDoubleAction = (e) => {
      const videoPlayer = e.target.closest("video-player");
      if (videoPlayer) {
        const nodeId = videoPlayer.getAttribute("node-id");
        if (nodeId && typeof onVideoDouble === "function") {
          onVideoDouble(nodeId);
        }
      }
    };

    // 🖱️ Desktop double-click
    root.addEventListener("dblclick", handleDoubleAction, true);

    // 📱 Mobile double-tap support
    let lastTap = 0;
    const handleTouch = (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 400 && tapLength > 0) {
        handleDoubleAction(e);
      }
      lastTap = currentTime;
    };
    root.addEventListener("touchend", handleTouch, true);

    return () => {
      root.removeEventListener("dblclick", handleDoubleAction, true);
      root.removeEventListener("touchend", handleTouch, true);
    };
  }, [isInMeeting, onVideoDouble]);

  return null; // This component adds no UI
}
