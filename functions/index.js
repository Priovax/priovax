const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const VONAGE_API_KEY = functions.config().vonage.key;
const VONAGE_API_SECRET = functions.config().vonage.secret;
const VONAGE_BRAND_NAME = functions.config().vonage.brand;

const Vonage = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET,
});

const from = VONAGE_BRAND_NAME;
const text = "A text message sent using the Vonage SMS API";

exports.notify = functions.https.onCall((data, context) => {
  console.log(data.phone_number);
  vonage.message.sendSms(from, data.phone_number, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
});
