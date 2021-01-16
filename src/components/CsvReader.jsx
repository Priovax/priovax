import React, { useState } from "react";
import { CSVReader } from "react-papaparse";

export default function CsvReader(props) {
  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  return (
    <>
      <CSVReader
        onDrop={props.handleOnDrop}
        onError={handleOnError}
        addRemoveButton
        onRemoveFile={props.handleOnRemoveFile}
        config={{ header: true }}
      >
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>
    </>
  );
}
