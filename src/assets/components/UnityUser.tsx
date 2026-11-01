import React, { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
function UnityUser({ unityRef, setIsUnityReady }) {
  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "/unity_user/Build/jogador.loader.js",
    dataUrl: "/unity_user/Build/jogador.data",
    frameworkUrl: "/unity_user/Build/jogador.framework.js",
    codeUrl: "/unity_user/Build/jogador.wasm",
    companyName: "DefaultCompany",
    productName: "RondaOnlineBr",
    productVersion: "1.0",
    disableKeyboard: true,
  });
  const [isUnityLoading, setIsUnityLoading] = useState(true);
  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => setIsUnityLoading(false), 3000);
      setIsUnityReady(true);
    }
  }, [isLoaded, setIsUnityReady]);
  useEffect(() => {
    if (unityRef && isLoaded) {
      unityRef.current = {
        SendMessage: (obj, method, message) => {
          if (sendMessage) {
            sendMessage(obj, method, message);
          } else {
            console.error("sendMessage não está disponível.");
          }
        },
      };
    }
  }, [unityRef, sendMessage, isLoaded]);
  return (
    <Unity
      className="unity-canvas"
      unityProvider={unityProvider}
      devicePixelRatio={window.devicePixelRatio}
    />
  );
}
export default UnityUser;