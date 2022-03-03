importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

if ('serviceWorker' in navigator) {
    console.log('service worker');
    navigator.serviceWorker.register('./firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
    }

firebase.initializeApp({
    messagingSenderId: "519099789051",
    projectId: "diariodopapai-29d0a",
    authDomain: "diariodopapai-29d0a.firebaseapp.com",
    apiKey: "AIzaSyCJxSB2whFj0G5zefOjYgfNyKaxmvrMff8",
    appId: "1:519099789051:web:3b28305f9c615b9a780a5e",
    messagingSenderId: "519099789051",
  })

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', event => {
  console.log(event)
  return event;
});