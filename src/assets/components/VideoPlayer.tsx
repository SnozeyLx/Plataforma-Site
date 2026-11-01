import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    let hls = null;
    const initHlsPlayer = () => {
      if (!videoRef.current) return;
      const video = videoRef.current;
      if (hls) {
        hls.destroy();
      }
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource("https://stream-akamai.castr.com/5b9352dbda7b8c769937e459/live_2361c920455111ea85db6911fe397b9e/index.fmp4.m3u8");
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS carregado");
          video.play().then(() => setIsPlaying(true)).catch(err => {
            console.error("Autoplay bloqueado:", err);
          });
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error("Erro fatal de rede. Tentando recuperar...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("Erro fatal de mídia. Tentando recuperar...");
                hls.recoverMediaError();
                break;
              default:
                console.error("Erro fatal desconhecido. Reiniciando HLS...");
                initHlsPlayer();
                break;
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = "https://stream-akamai.castr.com/5b9352dbda7b8c769937e459/live_2361c920455111ea85db6911fe397b9e/index.fmp4.m3u8";
        video.play().then(() => setIsPlaying(true)).catch(err => {
          console.error("Autoplay bloqueado:", err);
        });
      }
    };
    initHlsPlayer();
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef}  style={{ width: "100%" }} />
    </div>
  );
};
export default VideoPlayer;
