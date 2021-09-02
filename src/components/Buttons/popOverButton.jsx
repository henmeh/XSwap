import React from "react";
import MyImage from "../Image/image";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import 'bootstrap/dist/css/bootstrap.min.css';


const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function TokenSelectButton(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [buttonText, setButtonText] = React.useState({img: "", title: props.title});

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTokenChoice = (_token, _chain, _status) => {
    props.tokenChoice(_token, _chain, _status);
    setButtonText({img: _token.logoURI, title: _token.symbol});
  };


  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const sortedList = props.tokens.sort((a, b) => (a.symbol > b.symbol) ? 1 : -1);

  const listItems = sortedList.map((token) => (
      <li key={token.address}>
      <div className="d-grid gap-2">
        <button className="btn btn-outline-light text-dark" onClick={() => handleTokenChoice(token, props.chain, props.status)}>
          <MyImage image = {token.logoURI} alt="-" marginRight= {10} height= {25}/>
          {token.symbol}
        </button>
        </div>
      </li>
    ));

  return (
    <>
      <Button
        aria-describedby={id}
        variant="contained"
        color="primary"
        onClick={handleClick}
        style={{maxWidth: '250px', maxHeight: '50px', minWidth: '250px', minHeight: '50px'}}
      >
        {buttonText.img != "" ? <MyImage image = {buttonText.img} alt="-" marginRight= {10} height={25} /> : null}
        {buttonText.title}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Typography className={classes.typography} component={'span'} variant={'body2'}>
            <ul className="list-group"> {listItems} </ul>    
        </Typography>
      </Popover>
    </>
  );
}
