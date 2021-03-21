import React, { useState } from "react";
import "./App.scss";
import NameTag from "./components/nameTag";
import Item from "./components/item/item";

// const makeGreen = (BaseComponent) => (props) => {
//   const addGreen = {
//     style: {
//       color: "green",
//     },
//   };
//   const newProps = {
//     ...props,
//     ...addGreen,
//   };
//   return <BaseComponent {...newProps} />;
// };
// const removeInline = (BaseComponent) => (props) => {
//   const newProps = { ...props };
//   delete newProps.style;
//   return <BaseComponent {...newProps} />;
// };

//const GreenNameTag = makeGreen(NameTag);
//const CleanNameTag = removeInline(NameTag);
const initialNames = [
  //{ firstName: "john", lastName: "wick" }
]; 
const initialList = [
  {name:"tomato", calorie:"200"},
  {name:"banana", calorie:"150"},
  {name:"cherry", calorie:"100"},
]; 

function App() {
  const [names] = useState(initialNames);
  const [list, setList] = useState(initialList);
  const [editable, setEditable] =  useState(false)
function removeUnhealthyHandle  (e) {
e.preventDefault()
const filterdList = list.filter(v => v.calorie <= 150);
setList(filterdList);
}

function removeItemhandle (e){
  console.dir(e.target.name);

  const filterdList2 = list.filter(v => v.name !== e.target.name);
  setList(filterdList2);
}
function makeEditableHandle(){
 setEditable(true);
}
  return (
    <div className="App">
      <header className="App-header">
      
          <h1 >Grocery list</h1>
        {list.map(  (v,k) => {
          return <Item key={`${k}${v.name}${v.calorie}`} 
          item={v}  
          onClick = {removeItemhandle}
          editable={editable}
          onDoubleClick={makeEditableHandle}
          >

          </Item>;
        })}
        <button onClick={removeUnhealthyHandle} 
        className="remove-button"
        >
        remove unhealthy</button>
      </header>
    </div>
  );
}
export default App;
