import vonage
import nexmo
import os
from os.path import join, dirname
from dotenv import load_dotenv\
    
dotenv_path = join(dirname(__file__), "../.env")
load_dotenv(dotenv_path)

VONAGE_API_KEY = "32528ffd"
VONAGE_API_SECRET = "vBxKCoVup6RBQ3CF"
VONAGE_BRAND_NAME = "15062654636"
TO_NUMBER = "16478937552"

client = vonage.Client(key=VONAGE_API_KEY, secret=VONAGE_API_SECRET)
sms = vonage.Sms(client)

print(VONAGE_API_KEY)

responseData = sms.send_message(
    {
        "from": VONAGE_BRAND_NAME,
        "to": TO_NUMBER,
        "text": 'Your COVID-19 vaccine is ready! You can come during the week of May 10th 2021 - May 14th 2021 to get vaccinate. If this week works for, please reply with "YES" with the time you\'d like to come. Otherwise, please reply "NO" and you will be rescheduled for another period.',
    }
)

if responseData["messages"][0]["status"] == "0":
    print("Message sent successfully.")
else:
    print(f"Message failed with error: {responseData['messages'][0]['error-text']}")

""" 
client = nexmo.Client(key=VONAGE_API_KEY, secret=VONAGE_API_SECRET)

client.send_message({
    'from': VONAGE_BRAND_NAME,
    'to': TO_NUMBER,
    'text': 'Your COVID-19 vaccine is ready! You can come during the week of May 10th 2021 - May 14th 2021 to get vaccinate. If this week works for, please reply with "YES" with the time you\'d like to come. Otherwise, please reply "NO" and you will be rescheduled for another period.', 
})
 """