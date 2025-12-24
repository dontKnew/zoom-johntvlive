import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import "./App.css";
import { ZoomMtg } from "@zoom/meetingsdk";
import HideNonVideoParticipants from "./Helper/HideNonVideoParticipants";
import MeetingAction from "./MeetingAction";  

import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import useDeviceLogoutListener from "./useDeviceLogoutListener";
import setUserStatus from "./setUserStatus";
import ChangeZoomLoadingText from "./ChangeZoomLoadingText";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ChangeZoomWaitingText from "./ChangeZoomWaitingText";
import ZoomVideoClickHandler from "./Helper/ZoomVideoClickHandler";
import useEncryptedApi from "./Helper/EncryptedAPI";

ZoomMtg.setLogLevel("silent");
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

function MeetingStart() {
  const { encodedmeetingId = "" } = useParams();
  const { user, loading, logout } = useAuth();
  let meetingId = atob(encodedmeetingId);

  const [showObserver, setShowObserver] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const containerRef = useRef(null);
  const {send} = useEncryptedApi();


  const userName = useMemo(() => (user ? user.name : "Guest"), [user]);
  const userEmail = useMemo(() => `${userName}@gmail.com`, [userName]);

  // useEffect(() => {
  //   // Run this after Zoom meeting UI is visible
  //   const root = document.getElementById("zmmtg-root");

  //   if (!root) return;

  //   const handleDblClick = (e) => {
  //     e.stopPropagation();
  //     e.preventDefault();
  //     console.log("🚫 Blocked double-click fullscreen");
  //   };

  //   // Capture double-clicks anywhere in Zoom area
  //   root.addEventListener("dblclick", handleDblClick, true);

  //   return () => root.removeEventListener("dblclick", handleDblClick, true);
  // }, []);

    const handleVideoDouble = (nodeId) => {
      if(!nodeId){
        console.error("❌ No node ID provided");
        return;
      }
      // convert to integer if necessary
      const userId = parseInt(nodeId, 10);
      // console.log(`📌 Pinning user with nodeId ${nodeId} (userId: ${userId})`);
      ZoomMtg.operatePin({
        operate: "replace",
        userId: userId,
        success: (res) => {
          // console.log(`✅ Successfully pinned user ${userId}`, res);
        },
        error: (err) => {
          console.error(`❌ Failed to pin user ${userId}`, err);
        },
      });
    };


  const handleLeaveMeeting = (isConfirm = false) => {
    ZoomMtg.leaveMeeting({
      confirm: isConfirm,
      success: () => {
        // console.log("Meeting left successfully");
        setStatus("You left the meeting.");
        setShowObserver(false);
        const zmmtgRoot = document.getElementById("zmmtg-root");
        if (zmmtgRoot) zmmtgRoot.style.display = "none";
        // navigate("/", { replace: true });
        // window.location.href = "/";
      },
      error: (err) => {
        console.error("Error leaving meeting:", err);
        setError("Failed to leave meeting");
      },
    });
  };

  useDeviceLogoutListener(user?.id, localStorage.getItem("login_token"), logout, handleLeaveMeeting);

  useEffect(() => {
     const goOnline = () => setUserStatus("Online", user?.id);
      const goOffline = () => setUserStatus("Offline", user?.id);
      goOnline();
      window.addEventListener("beforeunload", goOffline);
      return () => {
        window.removeEventListener("beforeunload", goOffline);
        goOffline();
      };
  }, [user]);



  /** ✅ Step 1: Ask for microphone permission */
  const requestMicrophonePermission = useCallback(async () => {
    try {
      setStatus("Requesting microphone permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop()); // stop after permission granted
      // console.log("Microphone permission granted");
      return true;
    } catch (err) {
      console.warn("Microphone permission denied:", err);
      alert(
        "Microphone access is required to join the meeting. Please allow it and reload the page."
      );
      return false;
    }
  }, []);



  /** ✅ Step 2: Fetch meeting data (unchanged logic) */
  const fetchMeetingData = useCallback(async () => {
    const isDocumentPictureInPictureSupported = () => 'documentPictureInPicture' in window;
    console.log("is pip", isDocumentPictureInPictureSupported());
    if (!meetingId) {
      setError("Meeting ID missing");
      return;
    }
    setError(null);
    setIsJoining(true);
    setStatus("Fetching meeting details...");

    try {
      const token = localStorage.getItem("login_token") || "";
      const data = await send(
        `${import.meta.env.VITE_APP_API_URL}/meeting/view`,
        { 
          encodedmeetingId:encodedmeetingId,source:"web", login_token:token
         }
      );
      if(!data.success){
        throw new Error(data.message || "Failed to get meeting")
      }
      if (!data.data.sdk_token)
        throw new Error("SDK token missing from API response");
      setMeeting(data.data);
      setStatus("Meeting data loaded.");
    } catch (err) {
      console.error("Error fetching meeting:", err);
      setError(err.message || "Unknown error");
      setStatus("");
    } finally {
      setIsJoining(false);
    }
  }, [meetingId]);


  /** ✅ Step 3: Start meeting (unchanged) */
  const startMeeting = useCallback(
    (token) => {
      if(!meeting || !meetingId || !user || !userName || !userEmail) return ;
      setStatus("Initializing Zoom meeting...");
      const leaveUrl = import.meta.env.VITE_APP_APP_URL;

      const zmmtgRoot = document.getElementById("zmmtg-root");
      if (zmmtgRoot) zmmtgRoot.style.display = "block";
      let zoomMeetingNumber = meeting.zoom_meeting_id;
      let meetingConfig = {
            meetingNumber: zoomMeetingNumber,
            userName:meeting.screen_name,
            userEmail,
            sdkKey: meeting.sdk_key,
            signature: token,
            passWord: meeting.meeting_password,
            success: () => {
              setStatus("Meeting joined successfully.");
              setShowObserver(true);
              setIsJoining(false);
              setIsInMeeting(true);
            },
            error: (joinErr) => {
              console.error("Failed to join meeting:", joinErr);
              setError(joinErr.errorMessage || "Failed to join meeting");
              setIsJoining(false);
              setStatus("");
            },
        };
      // console.log("meetingConfig", meetingConfig);
      ZoomMtg.init({
        leaveUrl,
        disableZoomLogo: true,
        screenShare: false,
        disableZoomPhone: true,
        meetingInfo: [],
        disablePreview: true,
        isSupportChat: false,
        disableRecord: true,
        leaveOnPageUnload: false,
        defaultView: "gallery",
        debug: true,
        videoDrag: false,
        success: () => {
          setStatus("Joining Zoom meeting...");
          ZoomMtg.join(meetingConfig);
        },
        error: (initErr) => {
          console.error("Failed to initialize Zoom SDK:", initErr);
          setError(initErr.errorMessage || "Failed to initialize Zoom SDK");
          setIsJoining(false);
          setStatus("");
        },
      });
    },
    [meeting, meetingId, user, userName, userEmail]
  );

  



  /** ✅ Step 4: Run permission check before fetching */
  useEffect(() => {
    (async () => {
      const allowed = await requestMicrophonePermission();
      if (allowed) fetchMeetingData();
    })();
  }, [fetchMeetingData, requestMicrophonePermission]);

  useEffect(() => {
    if (meeting?.sdk_token) {
      startMeeting(meeting.sdk_token);
    }
  }, [meeting, startMeeting]);

  useEffect(() => {
  if (!isInMeeting) return;
  const interval = setInterval(() => {
    if (document.title !== "John TV Live") {
      document.title = "John TV Live";
    }
  }, 500);

  return () => clearInterval(interval);
}, [isInMeeting]);




  if (loading) return <p>Loading user info...</p>;
  if (!user) return <p>Please log in to join the meeting.</p>;

  return (
    <HelmetProvider>
      <Helmet>
        <title>John TV Live</title>
      </Helmet>
      <div className="App">
        <main>
          <h1>John Tv Streaming...</h1>
          {isJoining && (
            <div className="d-flex align-items-center justify-content-center">
              <div className="spinner-border text-primary me-2" role="status" />
              <strong>{status || "Loading..."}</strong>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              <p>Error: {error}</p>
              <button className="btn btn-danger" onClick={fetchMeetingData}>
                Retry
              </button>
            </div>
          )}

          {!isJoining && !error && <p>{status || "Joining meeting..."}</p>}
        </main>

        {showObserver && <HideNonVideoParticipants />}
        <ChangeZoomLoadingText />
        <ChangeZoomWaitingText />
        <MeetingAction
          isInMeeting={isInMeeting}
          handleLeaveMeeting={handleLeaveMeeting}
          ZoomMtg={ZoomMtg}
        />
          <ZoomVideoClickHandler
            isInMeeting={isInMeeting}
            onVideoDouble={handleVideoDouble}
          />

      </div>
    </HelmetProvider>
  );
}

export default MeetingStart;
