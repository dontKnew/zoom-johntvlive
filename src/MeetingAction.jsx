import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getVideoOnUserIds } from "./Helper/getVideoOnUserIds";
import { useZoomPIP } from "./Helper/useZoomPIP";
import { ConfirmModal } from "./Helper/ConfirmModal";


let currentIndex = -1;
let videoUserIds = [];

export default function MeetingAction({ isInMeeting, handleLeaveMeeting, ZoomMtg }) {
  const [muted, setMuted] = useState(true);
  const [container, setContainer] = useState(null);
  const [muteButtonText, setMuteButtonText] = useState("Join Audio");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hasAutoPinned, setHasAutoPinned] = useState(false); // ✅ added state
  const [showMyButton, setShowMyButton] = useState(false);
  const [open, setOpen] = useState(false);


    useEffect(() => {
    const root = document.getElementById("zmmtg-root"); // Zoom container

    if (!root) return;

    const checkButton = () => {
      const btn = document.querySelector(".full-screen-widget__button");
      setShowMyButton(!!btn);
    };
    checkButton();
    const observer = new MutationObserver(() => {
      checkButton();
    });
    observer.observe(root, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);




  const handleNextVideo = async (ZoomMtg) => {
    try {
      const list = await getVideoOnUserIds(ZoomMtg);
      if (!list || list.length === 0) {
        console.warn("⚠️ No users with video on.");
        return;
      }

      videoUserIds = list;
      currentIndex = (currentIndex + 1) % list.length;
      const nextUserId = list[currentIndex];

      // console.log(`📌 Pinning user index ${currentIndex}: userId ${nextUserId}`);

      ZoomMtg.operatePin({
        operate: "replace",
        userId: nextUserId,
        success: (res) => {
          // console.log(`✅ Successfully pinned user ${nextUserId}`, res);
        },
        error: (err) => {
          alert("Failed")
          console.error(`❌ Failed to pin user ${nextUserId}`, err);
        },
      });
    } catch (err) {
      console.error("Error in handleNextVideo:", err);
    }
  };

  const renderFloatButton = () => {
    let footerContainer = document.getElementById("floating-action-root");
    if (!footerContainer) {
      footerContainer = document.createElement("div");
      footerContainer.id = "floating-action-root";
      document.body.appendChild(footerContainer);
    }
    setContainer(footerContainer);
  };

  const handleMuteToggle = () => {
    setMuteButtonText("Wait...");
    if (isMobile) {
      if (muted) {
        joinAudioMobile();
      } else {
        leaveAudioMobile();
      }
    } else {
      constDesktopMuteToggle();
    }
  };

  const updateMutedStateOnLoad = () => {
    if (!isMobile) return false;
    const pathElement = document.querySelector(".SvgChevronHovered path");
    if (pathElement) {
      setMuted(false);
    } else {
      setMuted(true);
    }
    console.warn("Muted State on load", muted);
  };

  // InMeeting Once
  useEffect(() => {
    if (isInMeeting) {
      let viewButton = document.getElementById("full-screen-dropdown");
      if(viewButton){
        viewButton.click();
      }
      renderFloatButton();
      updateMutedStateOnLoad();
      if (muted) {
         console.warn("On Load Join Audio Called");
        // joinAudioMobile();
      }
    }
  }, [isInMeeting]);

  useEffect(() => {
    setMuteButtonText(muted ? "Join Audio" : "Leave Audio");
  }, [muted]);

  const joinAudioMobile = () => {
    if (!isMobile) return false;
    if (muted) {
      ZoomMtg.showJoinAudioFunction({ show: true });
      const button = document.getElementsByClassName("join-audio-actionsheet__voip")[0];
      if (button !== undefined) {
        button.click();
        setMuted(false);
        console.warn("You have joined computer audio");
      } else {
        console.warn("Join Audio Button Not Found in Popup Mobile");
        setMuted(true);
      }
    }
  };

  const hideNonVideo = ()=>{
    // open dropdown
    const dropdown = document.querySelector('.full-screen-widget__pop-menu');
    if(dropdown){
      dropdown.style.display = "none"; 
    }
    const btn = document.querySelector(".full-screen-widget__button");
    if(!btn) {
      if(isMobile){
        // alert("Function Not Allow")
      }else {
        // alert("Please try refresh or wait for load the meeting");
      }
      return;
    }
    btn.focus();
    btn.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
    // end dropdown

    const tryCheckGallery = setInterval(() => {
    const galleryOption = document.querySelector('a[aria-label="Hide Non-video Participants"]');
    if (!galleryOption) return; 
    galleryOption.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
    clearInterval(tryCheckGallery);
  }, 300);

  if(dropdown){
    setTimeout(function(){
      dropdown.style.display = ""; 
    }, 3000)
  }

  }

const openGalleryView = () => {
  const dropdown = document.querySelector('.full-screen-widget__pop-menu');
  if(dropdown){
     dropdown.style.display = "none"; 
  }
  const btn = document.querySelector(".full-screen-widget__button");
  if(!btn) {
    if(isMobile){
      alert("Only Speaker View Allow")
    }else {
      alert("Please try refresh or wait for load the meeting");
    }
    return;
  }
  btn.focus();
  btn.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));

   const tryCheckGallery = setInterval(() => {
    const galleryOption = document.querySelector('a[aria-label="Gallery View"]');
    const speakerOption = document.querySelector('a[aria-label="Speaker View"]');
    const activeItem = document.querySelector('.full-screen-widget__pop-menu--checked.dropdown-item');

    if (!galleryOption) return; 
    const isActive = activeItem?.getAttribute('aria-label') === 'Gallery View';
    if (isActive) {
      speakerOption.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
    } else {
      galleryOption.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
      console.log("✅ Switched to Gallery View!");
    }

    clearInterval(tryCheckGallery);
  }, 300);

  if(dropdown){
    setTimeout(function(){
      dropdown.style.display = ""; 
    }, 3000)
  }
};



  const leaveAudioMobile = () => {
    if (!isMobile) return false;
    if (toggleMuteUnmuteMenu()) {
      leaveComputerAudio();
    } else {
      console.warn("LeaveAudioFailed - Could not open menu");
      setMuted(false);
    }
  };

  const leaveComputerAudio = () => {
    let checkCount = 0;
    const maxChecks = 100;
    const intervalId = setInterval(() => {
      checkCount++;
      const linkElement = Array.from(document.querySelectorAll("a.dropdown-item")).find(
        (el) => el.textContent.trim() === "Leave Computer Audio"
      );
      if (linkElement) {
        linkElement.click();
        clearInterval(intervalId);
        const noAudioPopupButton = document.getElementsByClassName("zm-action-sheet__cancel-btn")[0];
        if (noAudioPopupButton) {
          setTimeout(() => {
            noAudioPopupButton.dispatchEvent(new MouseEvent("click", { view: window, bubbles: true, cancelable: true }));
            setMuted(true);
            // alert("you have left computer..");
            console.warn("You have left computer audio");
          }, 100);
        } else {
          console.warn("LeaveAudioFailed- No Audio Button in Popup");
          setMuted(false);
        }
      } else if (checkCount >= maxChecks) {
        clearInterval(intervalId);
        console.warn("Link not found after 100 attempts!");
      }
    }, 100);
  };

  const toggleMuteUnmuteMenu = () => {
    const pathElement = document.querySelector(".SvgChevronHovered path, .SvgChevron path");
    if (pathElement) {
      pathElement.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      return true;
    } else {
      console.warn("SVG path not found");
      return false;
    }
  };

  

  const constDesktopMuteToggle = () => {
    ZoomMtg.showJoinAudioFunction({ show: true });
    const maxAttempts = 10;
    let attempts = 0;
    const interval = setInterval(() => {
      const button = document.querySelector(".join-audio-by-voip__join-btn");
      if (button) {
        clearInterval(interval);
        const buttonText = button.textContent.trim();
        if (buttonText.includes("Join")) {
          button.click();
          setMuted(false);
        } else if (buttonText.includes("Leave")) {
          button.click();
          setMuted(true);
        } else {
          alert("Unexpected button");
        }
        ZoomMtg.showJoinAudioFunction({ show: false });
      } else if (++attempts >= maxAttempts) {
        ZoomMtg.showJoinAudioFunction({ show: false });
        clearInterval(interval);
        alert("Audio control not available. Please try again.");
      }
    }, 500);
  };

  const handleLogout = () => {
    // handleLeaveMeeting();
    setOpen(true);
    // let wantLeave = confirm("Are you sure you want to leave the meeting?");
    // if (wantLeave) handleLeaveMeeting();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // ✅ Auto-pin the first video user when meeting starts & not already pinned
  useEffect(() => {
    const autoPin = async () => {
      if (isInMeeting && !hasAutoPinned) {
        const list = await getVideoOnUserIds(ZoomMtg);
        if (list && list.length > 0) {
          // console.log("🎥 Auto-pinning first video user:", list[0]);
          ZoomMtg.operatePin({
            operate: "replace",
            userId: list[0],
            success: (res) => {
              // console.log(`✅ Auto-pinned user ${list[0]}`, res);
              setHasAutoPinned(true);
            },
            error: (err) => {
              console.error("❌ Auto-pin failed:", err);
            },
          });
        }
      }
    };
    autoPin();
    // hideNonVideo();

  }, [isInMeeting, hasAutoPinned, ZoomMtg]);


const isDocumentPictureInPictureSupported = () => 'documentPictureInPicture' in window;


const startPictureInPicture = async () => {
  if (isDocumentPictureInPictureSupported() && !window.documentPictureInPicture?.window) {

    const pipWindow = await window.documentPictureInPicture.requestWindow({ width: 360, height: 360 });

    const thisDocument = window.document;
    const pipDocument = pipWindow.document;

    // Copy styles
    // [...document.querySelectorAll('link[rel="stylesheet"], style')].forEach(s => {
    //   pipDocument.head.appendChild(s.cloneNode(true));
    // });

    // 🔥 Wait until Zoom injects the live video container
    const videoContainer = await waitForVideoElement();
    pipDocument.body.appendChild(videoContainer);

    const movedMsg = document.createElement('p');
    movedMsg.id = "msg-moved-to-pip";
    movedMsg.textContent = "Video moved to Picture-in-Picture";
    movedMsg.style.color = "white";
    thisDocument.body.appendChild(movedMsg);

    pipWindow.addEventListener('unload', () => {
      const containerInsidePip = pipDocument.querySelector('video-player-container');
      const msgNode = thisDocument.querySelector('#msg-moved-to-pip');
      msgNode.replaceWith(containerInsidePip);
    });
  }
};


function waitForVideoElement() {
  return new Promise(resolve => {
    const check = document.querySelector('video-player-container');

    if (check) {
      resolve(check);
      return;
    }

    const observer = new MutationObserver(() => {
      const found = document.querySelector('video-player-container');
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}


  if (!container) return null;
  

  return createPortal(
    <>
    <div className="floating-bar">
      {/* <button onClick={()=>{startPictureInPicture()}} className="btn btn-primary">TestButton</button> */}
      {
        !isMobile && showMyButton  && (<img title="video list" src="/images/a_video.png" className="fab-button video-icon" onClick={openGalleryView} 
          style={
            {
            borderRadius:"unset"
          }
          } />)
      }
      <img title="audio join or leave" src={muted ? '/images/a_audioleave.png' : '/images/a_audiojoin.png'}  className="fab-button audio-icon" onClick={handleMuteToggle} />
      <img title="next video" src="/images/a_next3.png" className="fab-button" onClick={() => handleNextVideo(ZoomMtg)} />
      <img title="leave meeting" src="/images/a_leave.png" className="fab-button" onClick={handleLogout} />
      <img title="refresh the page" src="/images/a_refresh2.png" className="fab-button" onClick={handleRefresh} />
      {
        isMobile && showMyButton  && (<img title="video list" src="/images/a_video.png" className="fab-button video-icon" onClick={openGalleryView} 
          style={
            {
            borderRadius:"unset"
          }
          } />)
      }
    </div>

        <ConfirmModal
        show={open}
        title="John TV Live"
        message="Are you sure you want to exit the stream?"
        confirmText="Exit"
        cancelText="Cancel"
        onConfirm={() => {
          setOpen(false);
          handleLeaveMeeting();
          console.log("Confirmed");
        }}
        onCancel={() => setOpen(false)}
      />

    </>,
    container
  );
}
