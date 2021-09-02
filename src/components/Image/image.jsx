import React from "react";

export default function MyImage(props) {

  return (
    <>
      <img src={props.image} alt={props.alt} style={{height: props.height, marginRight:props.marginRight}}/>
    </>
  );
}
