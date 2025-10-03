import React, { useEffect, useRef } from "react";
import { supabase } from "../../supabase";

const QRDownloadRedirect = () => {
  const executedRef = useRef(false);

  useEffect(() => {
    const logAndRedirect = async () => {
      try {
        const APK_FILE_ID =
          process.env.REACT_APP_APK_FILE_ID ||
          "1bPPv2J6Q3G_ohSx1x4vGFlXtYKR4kuaK";
        const apkUrl = `https://drive.google.com/uc?export=download&id=${APK_FILE_ID}`;

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
        const APK_FILE_ID =
          process.env.REACT_APP_APK_FILE_ID ||
          "1bPPv2J6Q3G_ohSx1x4vGFlXtYKR4kuaK";
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
