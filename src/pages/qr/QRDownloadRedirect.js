import React, { useEffect, useRef } from "react";
import { supabase } from "../../supabase";

// A lightweight redirect page that logs QR/CTA hits and then forwards
// to the actual APK download URL. This works for both scans and clicks.
const QRDownloadRedirect = () => {
  const executedRef = useRef(false);

  useEffect(() => {
    const logAndRedirect = async () => {
      try {
        const APK_FILE_ID =
          process.env.REACT_APP_APK_FILE_ID ||
          "180IOw_8JfQqodo_gpOeVnaYZaoXZ92du";
        const apkUrl = `https://drive.google.com/uc?export=download&id=${APK_FILE_ID}`;

        // Guard against double-invocation in React StrictMode (dev)
        const SESSION_KEY = "qr_redirect_log_in_progress";
        if (
          executedRef.current ||
          sessionStorage.getItem(SESSION_KEY) === "1"
        ) {
          window.location.replace(apkUrl);
          return;
        }
        executedRef.current = true;
        sessionStorage.setItem(SESSION_KEY, "1");

        const userAgent = navigator.userAgent || "";
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
        const deviceType = isMobile ? "Mobile" : "Desktop";

        await supabase.from("qr_download_events").insert({
          device_type: deviceType,
          user_agent: userAgent.slice(0, 500),
          referrer: document.referrer || null,
        });

        window.location.replace(apkUrl);
      } catch (e) {
        // If logging fails, still redirect
        const APK_FILE_ID =
          process.env.REACT_APP_APK_FILE_ID ||
          "180IOw_8JfQqodo_gpOeVnaYZaoXZ92du";
        const apkUrl = `https://drive.google.com/uc?export=download&id=${APK_FILE_ID}`;
        window.location.replace(apkUrl);
      }
    };

    logAndRedirect();
  }, []);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h3>Preparing your download…</h3>
      <p>Please wait a moment while we redirect you to the APK.</p>
    </div>
  );
};

export default QRDownloadRedirect;
