import { useEffect } from 'react';

const CustomPinVideo = () => {
  useEffect(() => {
    const videoFrameSelectors = [
      '.gallery-video-container__video-frame',
      // '.speaker-bar-container__video-frame',
      // '.suspension-video-container__video-frame',
      // '.multi-speaker-main-container__video-frame'
    ];

    const handleClick = (e) => {
      alert('hello clicked');
      // Add any fullscreen or pin logic here
    };

    const elements = [];

    videoFrameSelectors.forEach(selector => {
      const nodeList = document.querySelectorAll(selector);
      nodeList.forEach(el => {
        el.removeEventListener('click', handleClick);   // Changed from 'dblclick'
        el.addEventListener('click', handleClick);       // Changed from 'dblclick'
        elements.push(el); 
      });
    });

    // Cleanup: remove listeners on unmount
    return () => {
      elements.forEach(el => {
        el.removeEventListener('click', handleClick);   // Changed from 'dblclick'
      });
    };
  }, []);

  return null; // No visible UI
};

export default CustomPinVideo;
