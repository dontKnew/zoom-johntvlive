import { useEffect, useRef, useState } from "react";
import { enterPictureInPicture, leavePictureInPicture } from "./pip";

export function useZoomPIP({ZoomMtg, isInMeeting}) {
  const containerRef = useRef(null);
  const [isZoomVideoAttached, setIsZoomVideoAttached] = useState(false);

  useEffect(() => {

    if (!ZoomMtg) return;
    if(!isInMeeting) return ;

    const listener = ZoomMtg.inMeetingServiceListener(
      "onVideoTileRendered",
      () => {
        console.log("🎥 Zoom video tile rendered");

        const zoomVideo = document.querySelector(
          "#suspension-view video, #active-speaker-view video"
        );

        if (zoomVideo && containerRef.current && !isZoomVideoAttached) {
          containerRef.current.appendChild(zoomVideo);
          setIsZoomVideoAttached(true);
        }
      }
    );

    return () => ZoomMtg.removeInMeetingServiceListener(listener);

  }, [ZoomMtg, isZoomVideoAttached, isInMeeting]);


  const startPIP = () => {
    if (!containerRef.current) return console.warn("PiP container not ready");
    enterPictureInPicture(containerRef.current);
  };

  const stopPIP = () => {
    if (!containerRef.current) return;
    leavePictureInPicture(containerRef.current);
  };

  return { containerRef, startPIP, stopPIP };
}
