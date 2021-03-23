import React from "react";

function Input({ placeholder, style ,onKeyDown}, ref) {
  return (
  <input 
  onKeyDown={onKeyDown}
  ref={ref} 
  type = "text"
  placeholder={placeholder} 
  style={style}></input>
  );
}
const forwardedRef = React.forwardRef(Input);
export default forwardedRef;