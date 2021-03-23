import React, { useEffect, useRef } from "react";
import Input from "./components/Input";
import "./App.scss";

const inputStyle = {
  width: "400px",
  height: "40px",
  fontSize: "30px",
  marginBottom: "10px",
};
function App() {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);

  useEffect(() => {
    lastNameRef.current.focus();
  }, []);

  function firstNameKeyDown(e) {
    if (e.key === "Enter") {
      console.log("first name entered")
      lastNameRef.current.focus();
    }
  }

  function lastNameKeyDown(e) {
    if (e.key === "Enter") {
      firstNameRef.current.focus();
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>UseRefs Hooks</h1>
        <Input
          ref={firstNameRef}
          placeholder="first name"
          style={inputStyle}
          onKeyDown={firstNameKeyDown}
        ></Input>
        <Input
          ref={lastNameRef}
          placeholder="last name"
          style={inputStyle}
          onKeyDown={lastNameKeyDown}
        ></Input>
      </header>
    </div>
  );
}
export default App;
