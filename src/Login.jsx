import { useState } from "react";
import Logo from "/images/a_logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ref, set } from "firebase/database";
import {getFingerprintId} from "./Helper/getFingerprintId";

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
    const { setLoginToken, isTokenSavedOnLogin, getUser } = useAuth();
    const { send } = useEncryptedApi();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        setError(null);

        try {
            const device_id = await getFingerprintId();
            const data = await send(
                `${import.meta.env.VITE_APP_API_URL}/login`,
                {username, password, source: "web", android_id:device_id, device_type:'web'}
            );

            if (!data.success) {
                throw new Error(data.message || "Invalid username or password");
            }

            const email = `${data.user.username}@gmail.com`;
            await firebaseSignIn(email, data.user.codeFB);
            const result = await saveUserData(data.user.id, data.login_token, auth.currentUser.uid);

            if (!result) {
                throw new Error("SAVE_USER_FAILED");
            }

            setLoginToken(data.login_token);
            getUser(data.login_token);
            navigate("/", { replace: true });

        } catch (err) {
            console.warn("error ", err.message)
            if(err.message==='Demo user Account is Expired!'){
                navigate("/demo-expired", {replace:true});
                return;
            }
            if(err.message==='Demo Account already used'){
                navigate("/demo-already-used", {replace:true});
                return;
            }
            console.warn(err, "error me");
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    const firebaseSignIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential" || error.code === "auth/invalid-email") {
                const newUser = await createUserWithEmailAndPassword(auth, email, password);
                return newUser;
            } else if (error.code === "auth/wrong-password") {
                throw new Error("Wrong password. Try again.");
            } else {
                throw error;
            }
        }
    };
    const saveUserData = async (panel_user_id, deviceId, userId) => {
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
        <form className="login-body" onSubmit={handleLogin}>
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

                {error && (
                    <p className="text-center" style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <div className="button-container">
                    <button
                        className="button"
                        type="submit"   // 🔥 important
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </div>
        </form>


    );
}

export default Login;
