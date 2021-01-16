import React, { useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const StoreContext = React.createContext();

export function useStore() {
  return useContext(StoreContext);
}

export function StoreProvider({ children }) {
  const { currentUser } = useAuth();

  function addPatient(patient) {
    return db
      .collection("users")
      .doc(currentUser.uid)
      .collection("patient_data")
      .add({
        ...patient,
      });
  }

  function deletePatient(email, password) {
    return;
  }

  function getPatients() {
    console.log(currentUser.uid);
    return db
      .collection("users")
      .doc(currentUser.uid)
      .collection("patient_data");
  }

  function batchPatients(patients) {
    const batch = db.batch();
    console.log("pat", patients);

    patients.forEach(patient => {
      const collectionRef = db
        .collection("users")
        .doc(currentUser.uid)
        .collection("patient_data")
        .doc();
      batch.set(collectionRef, patient);
    });

    return batch.commit();
  }

  const value = {
    addPatient,
    deletePatient,
    getPatients,
    batchPatients,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
