import numpy as np
import pandas as pd
import pickle
import json
from google.cloud import storage
from io import BytesIO
import os 
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="priovax-fcb9ade902f9.json"
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials
cred = credentials.Certificate('requirements.json')
firebase_admin.initialize_app(cred)

def predict(request):
    request_json = request.get_json(silent=True)
    request_args = request.args

    if request_json and 'clinic_id' in request_json:
        clinic_id = request_json['clinic_id']
    elif request_args and 'clinic_id' in request_args:
        clinic_id = request_args['clinic_id']
    else:
        clinic_id = None
    
    ## Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        ## Allows GET requests from any origin with the Content-Type
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    ## Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    db = firestore.client()
    storage_client = storage.Client()

    docs = db.collection(u'users').document(clinic_id).collection(u'patient_data').stream()

    rows_list = []

    for doc in docs:
        rows_list.append(doc.to_dict())

    print(rows_list)
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

    docs = db.collection(u'users').document(clinic_id).collection(u'patient_data').stream()

    for doc, probability in zip(docs, prediction[:, 1]):
        docsRef = db.collection(u'users').document(clinic_id).collection(u'patient_data').document(doc.id)
        docsRef.update({'probability': probability})

    return ('Hello World!', 201, headers) 
