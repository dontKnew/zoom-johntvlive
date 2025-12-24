import { useEffect } from "react";
import setUserStatus from "./setUserStatus";

const useUserStatus = (user) => {
  useEffect(() => {
    // Set user online when component mounts
    setUserStatus("Online");
    // Handler to set offline when leaving page
    const handleOffline = () => setUserStatus("Offline");

    // User closes tab / refreshes page
    window.addEventListener("beforeunload", handleOffline);

    // Optional: detect when tab is hidden (user switches tabs)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handleOffline();
      } else {
        setUserStatus("Online");
      }
    });

    // Cleanup
    return () => {
      handleOffline(); // set offline on component unmount
      window.removeEventListener("beforeunload", handleOffline);
    };
  }, [user]);
};

export default useUserStatus;
