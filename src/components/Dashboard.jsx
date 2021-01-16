import { DataGrid } from "@material-ui/data-grid";

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useStore } from "../contexts/StoreContext";
import { Link, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CsvModal from "./CsvModal";
import PatientModal from "./PatientModal";

const columns = [
  { field: "id", headerName: "#", width: 70 },
  { field: "priority", headerName: "Priority", width: 130 },
  { field: "first_name", headerName: "First name", width: 130 },
  { field: "last_name", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
  { field: "gender_binary", headerName: "Gender", width: 130 },
  { field: "blood", headerName: "Blood", width: 130 },
  { field: "cancer", headerName: "Cancer", width: 130 },
  { field: "cardiacs", headerName: "Cardiacs", width: 130 },
  { field: "diabetes", headerName: "Diabetes", width: 130 },
  { field: "hypertension", headerName: "Hypertension", width: 130 },
  { field: "kidney", headerName: "Kidney", width: 130 },
  { field: "neuro", headerName: "Neuro", width: 130 },
  { field: "ortho", headerName: "Ortho", width: 130 },
  { field: "prostate", headerName: "Prostate", width: 130 },
  { field: "respiratory", headerName: "Respiratory", width: 130 },
  { field: "thyroid", headerName: "Thyroid", width: 130 },
];

// const rows = [
//   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
//   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
//   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
//   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
//   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
//   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
//   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
//   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
//   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
// ];

export default function DataTable() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const { getPatients, batchPatients } = useStore();
  const history = useHistory();

  const [rows, setRows] = useState([]);
  //const [columns, setColumns] = useState([]);

  useEffect(() => {
    getPatients().onSnapshot(querySnapshot => {
      const temp = querySnapshot.docs.map((doc, index) => {
        return { id: index + 1, ...doc.data() };
      });
      setRows(temp);
    });
  }, []);

  return (
    <>
      <div style={{ height: "70vh", width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={25} />
      </div>

      <div className="w-100 d-flex align-items-center mt-2">
        <PatientModal></PatientModal>
        <CsvModal></CsvModal>
      </div>
    </>
  );
}
