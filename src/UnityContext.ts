// UnityContext.js
import { createContext } from 'react';

export const UnityContext = createContext({
  unityRef: null,
  isUnityReady: true,
});
export default UnityContext;