import React from "react";
import classnames from "classnames";

import "components/Button.scss";

export default function Button(props) {
  const buttonClass = classnames("button", {
    "button--confirm": props.confirm,
    "button--danger": props.danger
  });

  let buttonClick = props.onClick

  if (props.disabled) {
    buttonClick = "";
  };
  
 
  return <button onClick={buttonClick} className={buttonClass}>{props.children}</button>;
}

