import { useEffect } from "react";

const ChangeZoomLoadingText = () => {
  useEffect(() => {
    const updateLoadingText = () => {
      const loadingTextEl = document.querySelector(".loading-main .join-meeting");
      // console.log("Current loading text:", loadingTextEl?.textContent); 
      if (loadingTextEl && loadingTextEl.textContent == "Joining Meeting...") {
        loadingTextEl.textContent = "Connecting...";
      }
    };

    // Run once immediately
    updateLoadingText();

    // Observe DOM changes since Zoom re-renders its UI dynamically
    const observer = new MutationObserver(updateLoadingText);
    const container = document.querySelector("#wc-loading") || document.body;

    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything visible
};

export default ChangeZoomLoadingText;
