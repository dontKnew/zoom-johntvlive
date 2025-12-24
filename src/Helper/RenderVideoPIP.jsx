import { useZoomPIP } from "./useZoomPIP";

export default function RenderVideoPIP({ ZoomMtg, isInMeeting }) {
  if(!isInMeeting) return null;
  console.log("render video pip");
  const { containerRef } = useZoomPIP(ZoomMtg);
  return (
    <div
      id="pip-video-container"
      ref={containerRef}
      style={{ width: 300, height: 200, display: "none" }}
    />
  );
}
