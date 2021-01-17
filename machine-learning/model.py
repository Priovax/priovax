import numpy as np
import pandas as pd
import pickle
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_score, recall_score
from sklearn.utils import resample

import requests
import json

### Dropbase

# Setup
Database_REST_API = 'https://query.dropbase.io/jfDnFY7mFDtjRxWbgzEUp3'
Table_to_Query = 'covid_patient_data_for_ml'
Access_Key = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhYmFzZUlkIjoiamZEbkZZN21GRHRqUnhXYmd6RVVwMyIsImFjY2Vzc1Blcm0iOiJmdWxsIiwidG9rZW5JZCI6Ik5qZlRIY3pJM2lnMVBFcU0yeEg1blFoVzJ6T3VreXVaSHUwcHNOM3hWWUxBaDNkT3M2M2pTME5nQkVncXRxQ1kiLCJpYXQiOjE2MTA4NjUyMDcsImV4cCI6MTYxMTAzODAwNywiaXNzIjoiZHJvcGJhc2UuaW8iLCJzdWIiOiJaWW1SYXBicHNWOEZRN1A4a0hnU2U2In0.ypMrosQXuk3zV8A-0NfjsHZZt-XRwiPbS9VwIWYhOD0'

# GET request to fetch dataset
r = requests.get(Database_REST_API + "/" + Table_to_Query, headers = {"Authorization": Access_Key})

# Convert into dataframe
df = pd.read_json(json.dumps(r.json()))
df = df.drop("dropbase_id", 1)
df = df.drop("dropbase_ts", 1)


### Machine Learning

#DownSample Majority Class
df_majority = df[df.death_binary==0]
df_minority = df[df.death_binary==1]

df_train_minority = df_minority.head(int(df_minority.shape[0]*(0.6)))
df_test_minority = df_minority.tail(int(df_minority.shape[0]*(0.4)))
df_train_majority = df_majority.head(int(df_majority.shape[0]*(0.6)))
df_test_majority = df_majority.tail(int(df_majority.shape[0]*(0.4)))

# DownSample majority class
df_train_majority_downsampled = resample(df_train_majority, 
                                 replace=False,    # sample without replacement
                                 n_samples=df_train_minority.shape[0],     # to match minority class
                                 random_state=123) # reproducible results                          

# Combine minority class with downsampled majority class
df_test = pd.concat([df_test_majority, df_test_minority])
df_train = pd.concat([df_train_majority_downsampled, df_train_minority])

# Partition the training and testing data into features and target
X_train = df_train.drop(columns=["death_binary"])
y_train = df_train.death_binary

X_test = df_test.drop(columns=["death_binary"])
y_test = df_test.death_binary

# Grid Search
from sklearn.model_selection import GridSearchCV
# Dictionary of parameters to search
params_to_search = {
    'penalty': ['l1', 'l2'],
    'C': [0.001,.009,0.01,.09,1,5,10,25],
    'solver': ['liblinear', 'sag', 'saga'],
    'class_weight': ['balanced', None],
}

mdl = LogisticRegression(max_iter=5000)
optimized_logreg = GridSearchCV(mdl, params_to_search, scoring = ['recall', 'precision'], refit=False, cv=5)
optimized_logreg.fit(X_train, y_train)

cv_result_df = pd.DataFrame(optimized_logreg.cv_results_)
cv_result_df['mean_test_score'] = cv_result_df['mean_test_recall'] * cv_result_df['mean_test_precision']
highest_mean_score_index = cv_result_df.mean_test_score.argmax()

# Find the model parameters with the highest sum of precision and recall
best_model_params = cv_result_df.params.loc[highest_mean_score_index]

# Actual Model
logreg_model = LogisticRegression(**best_model_params, max_iter=5000)
logreg_model.fit(X_train, y_train)

########################### Purely for testing output, remove later
# Make a prediction 
y_pred = logreg_model.predict(X_test)
y_train_pred =  logreg_model.predict(X_train)

# Add accuracy
print(f"Train achieved a precision score of {precision_score(y_train, y_train_pred)} and a recall score of {recall_score(y_train, y_train_pred)}")
print(f"Test achieved a precision score of {precision_score(y_test, y_pred)} and a recall score of {recall_score(y_test, y_pred)}")
############################

# Saving model to disk
pickle.dump(logreg_model, open("model.pkl", 'wb'))