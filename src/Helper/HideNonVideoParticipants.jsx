import { useEffect } from 'react';

const HideNonVideoParticipants = () => {
  useEffect(() => {
    const hideEmptyVideoContainers = () => {

        const videoFrameSelectors = [
        '.gallery-video-container__video-frame',
        '.speaker-bar-container__video-frame',
        '.suspension-video-container__video-frame',
        '.mobile-gallery-video-container__video-frame',
        '.multi-speaker-main-container__video-frame'
        ];

        videoFrameSelectors.forEach(selector => {
        const matchedElements = document.querySelectorAll(selector);
        if (matchedElements.length) {
            // console.warn(`Selector Matched: ${selector} | Total Elements: ${matchedElements.length}`);
            matchedElements.forEach(videoFrame => {
                const hasVideoPlayer = videoFrame.querySelector('video-player');
                // console.log(
                //     `Rendering: ${selector} | Element Class: "${videoFrame.className}" | Video Present: ${!!hasVideoPlayer}`
                // );
                videoFrame.style.display = hasVideoPlayer ? '' : 'none';
            });
        }
    });
    };
    hideEmptyVideoContainers();
    const observer = new MutationObserver(hideEmptyVideoContainers);
    const container = document.querySelector('#main-container') || document.body;

    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
      });
    }
    return () => observer.disconnect();
  }, []);
  return null; // This component doesn't render anything
};

export default HideNonVideoParticipants;
