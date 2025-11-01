import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const registrationToken = "USER_FCM_TOKEN"; // Ye user ka token hoga
const message = {
  notification: {
    title: "New Update!",
    body: "Your booking is confirmed 🎉",
  },
  token: registrationToken,
};

admin.messaging().send(message)
  .then((response) => {
    console.log("Message sent successfully:", response);
  })
  .catch((error) => {
    console.error("Error sending message:", error);
  });
