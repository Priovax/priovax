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

  const value = {
    addPatient,
    deletePatient,
    getPatients,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
