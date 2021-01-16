import { DataGrid } from "@material-ui/data-grid";

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CsvModal from "./CsvModal";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "priority", headerName: "priority", width: 130 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
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
  const history = useHistory();

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleOnDrop = data => {
    console.log("---------------------------");
    console.log(data);

    setRows(
      data.map(record => {
        console.log(record);
        const { ID, ...rest } = record.data;
        return {
          id: ID,
          ...rest,
        };
      })
    );

    setColumns(
      Object.keys(data[0].data).map(key => {
        console.log(key.length);
        return { field: key, headerName: key, width: key.length * 10 + 50 };
      })
    );
    console.log(rows);
    console.log("---------------------------");
  };

  return (
    <>
      <div style={{ height: "70vh", width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={50} />
      </div>

      <div className="w-100  mt-2">
        <CsvModal handleOnDrop={handleOnDrop}></CsvModal>
      </div>
    </>
  );
}
