import React from "react";
import { CSVReader } from "react-papaparse";

export default function CsvReader(props) {
  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = data => {
    console.log("---------------------------");
    console.log(data);
    console.log("---------------------------");
  };
  return (
    <>
      <CSVReader
        onDrop={props.handleOnDrop}
        onError={handleOnError}
        addRemoveButton
        onRemoveFile={handleOnRemoveFile}
        config={{ header: true }}
      >
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>
    </>
  );
}
