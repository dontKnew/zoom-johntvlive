import { useEffect, useState } from "react";
import CalendarIcon from "./CalendarIcon";
import LogoutIcon from "./LogoutIcon";
import LockIcon from "./LockIcon";
import VideoIcon from "./VideoIcon";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import useDeviceLogoutListener from "./useDeviceLogoutListener";
import setUserStatus from "./setUserStatus";
import { onDisconnect, set, ref } from "firebase/database";
import useEncryptedApi from "./Helper/EncryptedAPI";


function MeetingList() {

  const { user, loading, logout, token } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const {send} = useEncryptedApi();

  useDeviceLogoutListener(user?.id, localStorage.getItem("login_token"), logout);

  useEffect(() => {
    // console.log("Auth user:", user);
    const fetchMeetings = async () => {
      setFetchLoading(true);
      setFetchError(null);
      const login_token = localStorage.getItem("login_token");
      if (!login_token) {
        setFetchError("No login token found");
        setFetchLoading(false);
        return;
      }
      try {
        const data = await send(
            `${import.meta.env.VITE_APP_API_URL}/meeting/list`,
            {
                login_token,
                source: "web"
            }
        );
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch meetings");
        }
        // console.log("Meetings data array:", data.data); 
        setMeetings(data.data || []); // Assuming API returns meetings array in data.meetings
      } catch (error) {
        // alert(error.message);
        setFetchError(error.message);
        console.error(error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchMeetings();

    // status update
      const goOnline = () => setUserStatus("Online", user?.id);
      const goOffline = () => setUserStatus("Offline", user?.id);
      goOnline();
      window.addEventListener("beforeunload", goOffline);
      return () => {
        window.removeEventListener("beforeunload", goOffline);
        goOffline();
      };
    // end status update

  }, [user]);

  const logoutAccount = () => {
    signOut(auth);
    logout();
  };
  if (loading || fetchLoading) return <p>Loading...</p>;
  if (!user) return <p>No User Found</p>;
  


  return (
    <div className="meeting-container">
      {/* Header */}
      <header className="meeting-header">
        <div>
          <h1>Welcome..!</h1>
          <p className="subtitle">{user.username}</p>
          <p className="days-left">
            <span className="calendar-icon"><CalendarIcon /></span> {user.balance_coins} Days left
          </p>
        </div>
        <div className="header-icons">
          <Link to="/change-password" className="icon-btn"><LockIcon /></Link>
          <button onClick={logoutAccount} className="icon-btn bg-danger logout"><LogoutIcon /></button>
        </div>
      </header>
      <hr />

      {/* Meetings List */}
      <div className="meeting-card-container">
        <div className="meeting-card bg-white">
          {meetings.length === 0 ? (
            <p>No meetings available</p>
          ) : (
            meetings.map((meeting) => (
              <Link to={`live/${btoa(meeting.meeting_id)}`} key={meeting.meeting_id} className="testing-btn text-center">
                <span className="video-icon me-2"><VideoIcon /></span>
                {meeting.meeting_name}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MeetingList;
