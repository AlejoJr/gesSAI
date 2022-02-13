import React, {useState} from "react";
//import imgLoading from '../images/loader.gif';
//import Spinner from 'react-bootstrap/Spinner';
import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
    return (
        /*<Spinner animation="border" variant="primary"/>*/
        <CircularProgress color="primary" />
        /*<div className="img-loading">
            <img src={imgLoading} height="200" width="200" alt="Imagen Loading"/>
        </div>*/
    )
}

function Message(props) {
    const [open, setOpen] = useState(props.isActive);
    const vertical = 'top'
    const horizontal = 'right'

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };


    const action = (
        <>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small"/>
            </IconButton>
        </>
    );
    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={8000}
                onClose={handleClose}
                action={action}
                anchorOrigin={{vertical, horizontal}}
            >
                <Alert onClose={handleClose} severity={props.severity} sx={{width: '100%'}}>
                    {props.message}
                </Alert>
            </Snackbar>
        </>
    )
}


//<<--| D A T O S - D E L - U S U A R I O - E N - S E S S I O N |-->>

function GetToken() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
}

function GetIdUser() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.id;
}

function GetUsername() {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.username;
}

export {Loading, Message, GetToken, GetIdUser, GetUsername};