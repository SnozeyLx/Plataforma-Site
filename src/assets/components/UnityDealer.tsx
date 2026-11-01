import React, { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
function UnityDealer({ unityRef, setIsUnityReady }) {
  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "/unity_dealer/Build/dealer.loader.js",
    dataUrl: "/unity_dealer/Build/dealer.data",
    frameworkUrl: "/unity_dealer/Build/dealer.framework.js",
    codeUrl: "/unity_dealer/Build/dealer.wasm",
    companyName: "RondaCompany",
    productName: "RondaProject",
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
      unityProvider={unityProvider}
      devicePixelRatio={window.devicePixelRatio}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        outline: "none",
      }}
    />
  );
}
export default UnityDealer;