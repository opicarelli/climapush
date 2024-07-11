// DEVICE_TOKEN="cwTpxZxjxTtsUzh59mPu-2:APA91bH8eur1ibquYz-BDB5lSxFG07JUsgaLR-9teBSE0AWkc5QiDvZgybe5c1DSuTRs6LS6BraDR5ck25tT5stcTPxJcZmZmrzrNMev8Fl-v6NspfQZTgVf3CJ096KKDvaU-lzuysPn" node scripts/sendMessageToDevice.js

require("dotenv").config();
const https = require("https");
const { google } = require("googleapis");

const HOST = "fcm.googleapis.com";
const PATH = "/v1/projects/" + process.env.REACT_APP_FIREBASE_PROJECT_ID + "/messages:send";
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const SCOPES = [MESSAGING_SCOPE];

const firebaseConfig = {
    privateKey: process.env.REACT_APP_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.REACT_APP_FIREBASE_CLIENT_EMAIL,
};

function getAccessToken() {
    return new Promise(function (resolve, reject) {
        const jwtClient = new google.auth.JWT(
            firebaseConfig.clientEmail,
            null,
            firebaseConfig.privateKey,
            SCOPES,
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}

function sendFcmMessage(fcmMessage) {
    getAccessToken().then(function (accessToken) {
        console.log(accessToken);
        const options = {
            hostname: HOST,
            path: PATH,
            method: "POST",
            // [START use_access_token]
            headers: {
                Authorization: "Bearer " + accessToken,
            },
            // [END use_access_token]
        };

        console.log(options);
        const request = https.request(options, function (resp) {
            resp.setEncoding("utf8");
            resp.on("data", function (data) {
                console.log("Message sent to Firebase for delivery, response:");
                console.log(data);
            });
        });

        request.on("error", function (err) {
            console.log("Unable to send message to Firebase");
            console.log(err);
        });

        request.write(JSON.stringify(fcmMessage));
        request.end();
    });
}

const deviceToken = process.env.DEVICE_TOKEN;

sendFcmMessage({
    message: {
        token: deviceToken,
        notification: {
            title: "Teste 002",
            body: "Mensagem 002",
        },
        webpush: {
            notification: {
                title: "FCM Web Notification 2",
                body: "Notification from FCM API 2",
            },
        },
        // data: {
        //     key1: "value1",
        //     key2: "value2",
        //     key3: "value3",
        // },
        // android: {
        //     notification: {
        //         title: "FCM Android Notification",
        //         body: "Notification from FCM API to Android App",
        //     },
        // },
    },
});


/**
 * Sample to get token
 * getAccessToken().then((token) => {console.log(token)});
 */

/* Sample to send message by CURL
curl "https://fcm.googleapis.com/fcm/send" -d '{
  "message": {
    "token": "<DEVIDE_TOKEN>",
    "android": {
        "notification": {
            "title": "FCM Web Notification",
            "body": "Notification from FCM API",
        },
    },
  }
}' \
-i \
-H "Application/json" \
-H "Content-type: application/json" \
-H "Authorization: Bearer <ACCESS_TOKEN>"
*/
