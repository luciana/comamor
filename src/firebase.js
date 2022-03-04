import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from 'firebase/messaging';

export const initializeFirebase = () => {
  const firebaseConfig = {
      apiKey: "AIzaSyCJxSB2whFj0G5zefOjYgfNyKaxmvrMff8",
      authDomain: "diariodopapai-29d0a.firebaseapp.com",
      projectId: "diariodopapai-29d0a",
      storageBucket: "diariodopapai-29d0a.appspot.com",
      messagingSenderId: "519099789051",
      appId: "1:519099789051:web:3b28305f9c615b9a780a5e"
    };
  initializeApp(firebaseConfig);
  //const messaging = getMessaging();
}

export const requestForToken = () => {
    const messaging = getMessaging();
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


export const askForPermissioToReceiveNotifications = async (registration) => {
  try {
  
    const messaging = getMessaging();
      // await onMessage(notification => {
      //     console.log('Notification received!', notification);
      //     //message.info(notification?.data?.title + ':' + notification?.data?.body)
      // });
  
      const registration = await navigator.serviceWorker
          .register('firebase-messaging-sw.js', {scope: "/", updateViaCache: 'none'})
          .then((registration) => {
             // console.log('INFO: firebase service worker registration', registration);
              return registration;
          }).catch(err => {
            console.log('An error occurred while registering. ', err);
          });

      await Notification.requestPermission().then((callBack) => {
          console.log("permisison callback", callBack)
      }).catch(err => {
          console.log('An error occurred while requesting permission. ', err);
      });


      return await getToken(messaging, { vapidKey: 'BMqhW4j5yfY4N0zjlJti_qiF4_mEoT9Zr8Vbkf5bWrG4SzgkJF2WyUTNjygf4waGfM2wCZQCSQJQywaftSM60_M',
                                        serviceWorkerRegistration: registration })
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
  
  } catch (error) {
      console.error(error);
  }}

