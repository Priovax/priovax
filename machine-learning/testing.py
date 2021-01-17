from firebase_admin import firestore, storage
from firebase_admin import credentials
import firebase_admin
import numpy as np
import pandas as pd
import pickle
from flask import Flask, jsonify
import json
from google.cloud import storage
from io import BytesIO
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./priovax-fcb9ade902f9.json"
cred = credentials.Certificate('./requirements.json')
firebase_admin.initialize_app(cred)


db = firestore.client()
storage_client = storage.Client()

docs = db.collection(u'users').document('WNv0bSXn8TaRABAxQEnhTwPagHE3').collection(u'patient_data').stream()

rows_list = []

for doc in docs:
    rows_list.append(doc.to_dict())

df_patient = pd.DataFrame(data=rows_list)

# Rearrange columns to alphabetical
df_patient = df_patient.drop(columns=['first_name', 'last_name', 'phone_number'])
df_patient = df_patient[['age', 'blood', 'cancer', 'cardiacs', 'chronic_disease', 'diabetes', 'gender_binary', 'hypertension', 'kidney', 'neuro', 'ortho', 'prostate', 'respiratory', 'thyroid']]

bucket = storage_client.bucket('prediction_model21')
blob = bucket.blob('model.pkl')

pickle_in = BytesIO(blob.download_as_bytes())
model = pickle.load(pickle_in)

np.set_printoptions(suppress=True)
prediction = model.predict_proba(df_patient)

docs = db.collection(u'users').document('WNv0bSXn8TaRABAxQEnhTwPagHE3').collection(u'patient_data').stream()

for doc, probability in zip(docs, prediction[:, 1]):
    docsRef = db.collection(u'users').document('WNv0bSXn8TaRABAxQEnhTwPagHE3').collection(u'patient_data').document(doc.id)
    docsRef.update({'probability': probability})

print(prediction)
