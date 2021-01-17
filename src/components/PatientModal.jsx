import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { styled } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import Conditions from "./Conditions";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useStore } from "../contexts/StoreContext";

const CustomContent = styled(DialogContent)({
  overflowY: "unset",
});

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    width: "25ch",
    marginRight: theme.spacing(1),
    marginTop: 0,
  },
  ageField: {
    width: "10ch",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "end",
  },
  formControl: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(1),
    minWidth: 120,
  },
}));

const conditions = [
  "diabetes",
  "neuro",
  "hypertension",
  "cancer",
  "ortho",
  "respiratory",
  "cardiacs",
  "kidney",
  "blood",
  "prostate",
  "thyroid",
];

export default function FormDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { addPatient } = useStore();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("");

  const [checked, setChecked] = React.useState([]);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleSubmit = () => {
    const conditions = {};
    checked.forEach(function (v) {
      conditions[v] = 1;
    });
    addPatient({
      priority: null,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      age: age,
      gender_binary: gender,
      blood: 0,
      cancer: 0,
      cardiacs: 0,
      diabetes: 0,
      hypertension: 0,
      kidney: 0,
      neuro: 0,
      ortho: 0,
      prostate: 0,
      respiratory: 0,
      thyroid: 0,
      ...conditions,
    })
      .then(() => {
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setAge("");
        setGender("");
        setChecked([]);
        handleClose();
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        className="mr-2"
        onClick={handleClickOpen}
      >
        Create Patient
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create new patient</DialogTitle>
        <CustomContent>
          <DialogContentText>
            Register a new patient with first name, last name and any
            pre-existing conditions
          </DialogContentText>

          <form noValidate autoComplete="off">
            <div className={classes.inputWrapper}>
              <TextField
                id="standard-basic"
                label="First Name"
                margin="normal"
                className={classes.textField}
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
              <TextField
                id="standard-basic"
                label="Last Name"
                margin="normal"
                className={classes.textField}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
            <div className={classes.inputWrapper}>
              <TextField
                id="standard-basic"
                label="Phone Number"
                margin="normal"
                className={classes.textField}
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
              <TextField
                id="standard-basic"
                label="Age"
                margin="normal"
                type="number"
                className={classes.ageField}
                value={age}
                onChange={e => setAge(parseInt(e.target.value))}
              />
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className={classes.ageField}
                >
                  <MenuItem value={0}>Male</MenuItem>
                  <MenuItem value={1}>Female</MenuItem>
                </Select>
              </FormControl>
            </div>
            <Conditions
              items={conditions}
              handleToggle={handleToggle}
              checked={checked}
            ></Conditions>
          </form>
        </CustomContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
