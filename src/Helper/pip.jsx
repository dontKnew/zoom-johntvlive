let pipWindow;

const enterPictureInPicture = async (videoContainer) => {
  console.log("🚀 enterPictureInPicture called");
  console.log("📌 videoContainer:", videoContainer);

  if (
    window.document.pictureInPictureEnabled &&
    "documentPictureInPicture" in window
  ) {
    console.log("👍 PiP supported by browser");

    try {
      console.log("🪟 Requesting PiP window...");
      pipWindow = await window.documentPictureInPicture.requestWindow();
      console.log("✅ PiP window created:", pipWindow);

      const placeholder = document.createElement("div");
      placeholder.textContent = "🔁 Element moved to PiP window";
      placeholder.id = "PiP-placeholder";

      if (videoContainer) {
        console.log("🎨 Copying styles to PiP window...");

        Array.from(document.styleSheets).forEach((styleSheet, i) => {
          console.log(`📄 Stylesheet [${i}] processing...`);
          try {
            Array.from(styleSheet.cssRules).forEach((rule, index) => {
              const style = document.createElement("style");
              style.textContent = rule.cssText;
              pipWindow.document.head.appendChild(style);
            });
          } catch (err) {
            console.warn("⚠️ Couldn't read stylesheet (CORS blocked):", styleSheet.href);
          }
        });

        console.log("⚙️ Moving video to PiP window...");
        videoContainer.parentNode?.insertBefore(placeholder, videoContainer);
        pipWindow.document.body.appendChild(videoContainer);
        console.log("🎥 Video element transferred successfully.");
      } else {
        console.warn("⚠️ No videoContainer provided.");
      }
    } catch (error) {
      console.error("❌ Failed to enter Picture-in-Picture:", error);
    }
  } else {
    console.warn("🚫 Picture-in-Picture not supported by browser.");
  }
};


const leavePictureInPicture = async (videoContainer) => {
  console.log("↩️ leavePictureInPicture called");
  console.log("📌 videoContainer:", videoContainer);

  const placeholder = document.getElementById("PiP-placeholder");
  console.log("📍 placeholder found:", placeholder);

  try {
    if (placeholder && videoContainer) {
      console.log("🔁 Restoring video back to DOM...");
      placeholder.parentNode?.replaceChild(videoContainer, placeholder);

      console.log("🪟 Closing PiP window...");
      await pipWindow.close();
      pipWindow = undefined;

      console.log("✅ Exited Picture-in-Picture and restored layout.");
    } else {
      console.warn("⚠️ Missing placeholder or videoContainer");
    }
  } catch (error) {
    console.error("❌ Failed to leave Picture-in-Picture:", error);
  }
};

export { enterPictureInPicture, leavePictureInPicture };
