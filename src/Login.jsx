import { useState } from "react";
import Logo from "/images/a_logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ref, set } from "firebase/database";

import { auth, db } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
} from "firebase/auth";
import useEncryptedApi from "./Helper/EncryptedAPI";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {setLoginToken, isTokenSavedOnLogin, getUser} = useAuth();
    const { send } = useEncryptedApi();

   const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
        const data = await send(
            `${import.meta.env.VITE_APP_API_URL}/login`,
            {
                username,
                password,
                source: "web"
            }
        );

        if (!data.success) {
            throw new Error(data.message || "Invalid username or password");
        }

        const email = `${data.user.username}@gmail.com`;

        await firebaseSignIn(email, data.user.codeFB);

        const result = await saveUserData(
            data.user.id,
            data.login_token,
            auth.currentUser.uid
        );

        if (!result) {
            throw new Error("SAVE_USER_FAILED");
        }

        setLoginToken(data.login_token);
        getUser(data.login_token);
        navigate("/", { replace: true });

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};


const firebaseSignIn = async (email, password) => {
  try {
    // console.log("Facebook login with email:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // console.log("2Facebook login with email:", email);
    return userCredential.user;
  } catch (error) {
    if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential" || error.code === "auth/invalid-email") {
      const newUser = await createUserWithEmailAndPassword(auth, email, password);
      // console.log("3Facebook login with email:", email);
      return newUser;
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Wrong password. Try again.");
    } else {
      throw error;
    }
  }
};
const saveUserData = async (panel_user_id, deviceId, userId) => {
  //console.log("Saving user data to Realtime Database:", { panel_user_id, deviceId, userId });
  const userRef = ref(db, "users/" + panel_user_id);
  const userData = {
    deviceId: deviceId,
    uid: userId,
    panel_user_id: panel_user_id,
    status: "Online",
  };
 set(userRef, userData)
  .then(() => {
    // console.log("✅ Data saved successfully");
  })
  .catch((err) => {
    console.error("❌ Failed to save data:", err);
  });
  // console.log("User data saved successfully.");
  return true; 
};


    return (
        <div className="login-body">
            <div className="box">
                <div className="header">
                    <img src={Logo} alt="Logo" width={250} />
                </div>
                <div className="login-input">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="text-center" style={{ color: "red" }}>{error}</p>}
                <div className="button-container">
                    <button
                        className="button"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </div>
        </div>
        
    );
}

export default Login;
