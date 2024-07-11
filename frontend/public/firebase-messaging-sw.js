importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

// Initialize Firebase app
firebase.initializeApp(defaultConfig);
const messaging = firebase.messaging();

//Listens for background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  //customise notification
  const notificationJs = JSON.parse(payload.data.notification);
  const notificationTitle = notificationJs.title;
  const notificationOptions = {
    body: notificationJs.body,
    icon: notificationJs.icon || "https://dgya0msbvt7mc.cloudfront.net/logo128.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});