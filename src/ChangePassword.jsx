import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "/images/a_logo.png";
import { useAuth } from "./AuthContext";
import { EncryptedAPI } from "./Helper/EncryptedAPI";
function ChangePassword() {
  const { user, Authloading, logout } = useAuth();
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!oldPwd || !newPwd || !confirmPwd) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPwd !== confirmPwd) {
      setError("Please enter same password");
      return;
    }
    const loginToken = localStorage.getItem("login_token");

    if (!loginToken) {
      setError("User is not authenticated.");
      return;
    }

    const data = {
      old_password: oldPwd,
      new_password: newPwd,
      login_token: loginToken,
      source:"web"
    };

    setLoading(true);

    try {
      const enc = new EncryptedAPI();
      const json = await enc.send(import.meta.env.VITE_APP_API_URL+"/change-password", data);
      if (!json.success) {
        setError(json.message || "Failed to change password.");
      } else {
        setSuccess("Password changed successfully!");
        // Optionally clear inputs
        setOldPwd("");
        setNewPwd("");
        setConfirmPwd("");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (Authloading) return <p>Loading...</p>;
  if (!user) return <p>No User Found</p>;

  return (
    <div className="login-body">
      <div className="box">
        <div className="header">
          <img src={Logo} alt="Logo" width={250} />
        </div>
        <div className="login-input">
          <input
            type="password"
            name="old"
            placeholder="Old Password"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
          />
          <input
            type="password"
            name="new"
            placeholder="New Password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />
          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <div className="button-container">
          <button className="button Change" onClick={handleChangePassword} disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </div>
        <div className="button-container">
          <Link to="/" className="button back">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
