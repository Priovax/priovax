import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CsvReader from "./CsvReader";
import { styled } from "@material-ui/core/styles";
import { useStore } from "../contexts/StoreContext";

const CustomContent = styled(DialogContent)({
  overflowY: "unset",
});

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { batchPatients } = useStore();

  const [patients, setPatients] = useState([]);

  const handleOnDrop = data => {
    setPatients(data.map(record => record.data));
  };

  const handleSubmit = () => {
    batchPatients(patients)
      .then(() => {
        setPatients([]);
        handleClose();
      })
      .catch(err => console.log(err));
  };
  const handleOnRemoveFile = data => {
    setPatients([]);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Upload CSV
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Upload Patient Data</DialogTitle>
        <CustomContent>
          <DialogContentText>
            Upload your patient data via csv below. Please follow the format ID,
            Firstname, Lastname, Age, Conditions...
          </DialogContentText>
          <CsvReader
            handleOnDrop={handleOnDrop}
            handleOnRemoveFile={handleOnRemoveFile}
          ></CsvReader>
        </CustomContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={patients.length <= 0}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
