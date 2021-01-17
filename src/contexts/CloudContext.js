import React, { useContext } from "react";
import { cloud } from "../firebase";

const StoreContext = React.createContext();

export function useCloud() {
  return useContext(StoreContext);
}

export function CloudProvider({ children }) {
  function notifyPatients(phone_number, date) {
    //cloud function
    const notify = cloud.httpsCallable("notify");

    return notify({ phone_number: phone_number, date: date });
  }

  const value = {
    notifyPatients,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
