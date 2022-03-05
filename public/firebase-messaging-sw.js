importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

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

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/android-chrome-192x192.png",
    data: {
      url: "https://main.d32uvie3c9lfuo.amplifyapp.com/"
    }
  };

  console.log(notificationTitle);
  console.log(notificationOptions);
  return self.registration.showNotification(notificationTitle,
    notificationOptions);

});

self.addEventListener('notificationclick', event => {
  console.log(event)
  const clickedNotification = event.notification;
  clickedNotification.close();
  clients.openWindow(event.notification.data.url)
  
});