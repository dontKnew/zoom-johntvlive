import { useEffect } from "react";

const ChangeZoomWaitingText = () => {
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const updateLoadingText = () => {
      let loadingTextEl;
      let exitButtonIcon;
      if (isMobile) {
        loadingTextEl = document.querySelector(".wr-information .wr-indication span");
        exitButtonIcon = document.querySelector(".wr-exit-btn-icon");
      } else {
        loadingTextEl = document.querySelector(".waiting-room-container .wr-tip span");
      }

      // console.log("Current Wait text:", loadingTextEl?.textContent);
      // console.log("Exit button icon:", exitButtonIcon);

      if (
        loadingTextEl &&
        loadingTextEl.textContent === "Waiting for host to start the meeting"
      ) {
        loadingTextEl.textContent = "Please wait for the stream to start...";
        if (exitButtonIcon) {
            exitButtonIcon.innerHTML = "<span>Exit</span><i><svg width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"SvgLeave\"><path d=\"M10.5 2.5A2.5 2.5 0 0 0 8 0H2.5A2.5 2.5 0 0 0 0 2.5v11A2.5 2.5 0 0 0 2.5 16H8a2.5 2.5 0 0 0 2.5-2.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 1 8 15H2.5A1.5 1.5 0 0 1 1 13.5v-11A1.5 1.5 0 0 1 2.5 1H8a1.5 1.5 0 0 1 1.5 1.5v2a.5.5 0 0 0 1 0v-2Z\" fill=\"currentColor\"></path><path d=\"M12.146 4.647a.5.5 0 0 1 .707 0l3 3a.5.5 0 0 1 0 .707l-3 3a.5.5 0 0 1-.707-.707L14.293 8.5H5a.5.5 0 0 1 0-1h9.293l-2.147-2.146a.5.5 0 0 1 0-.707Z\" fill=\"currentColor\"></path></svg></i>";
        }
      }
    };

    // Run once immediately
    updateLoadingText();

    let container;
    if (isMobile) {
      container = document.querySelector(".wr-information") || document.body;
    } else {
      container = document.querySelector(".waiting-room-container") || document.body;
    }

    const observer = new MutationObserver(updateLoadingText);
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

export default ChangeZoomWaitingText;
