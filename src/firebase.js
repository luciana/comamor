import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCJxSB2whFj0G5zefOjYgfNyKaxmvrMff8",
    authDomain: "diariodopapai-29d0a.firebaseapp.com",
    projectId: "diariodopapai-29d0a",
    storageBucket: "diariodopapai-29d0a.appspot.com",
    messagingSenderId: "519099789051",
    appId: "1:519099789051:web:3b28305f9c615b9a780a5e"
  };
  
  // Initialize Firebase
initializeApp(firebaseConfig);
const messaging = getMessaging();

export const requestForToken = () => {
    return getToken(messaging, { vapidKey: 'BMqhW4j5yfY4N0zjlJti_qiF4_mEoT9Zr8Vbkf5bWrG4SzgkJF2WyUTNjygf4waGfM2wCZQCSQJQywaftSM60_M' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('INFO: current token for client: ', currentToken);
          // Perform any other neccessary action with the token
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
};

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {    
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });