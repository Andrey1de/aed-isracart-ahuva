import React, { Component } from 'react';
//import { render } from "react-dom";


//const MapHistory = new Map();
export class About extends Component {
  static displayName = About.name;


  // constructor(props) {
  //   super(props);
  // }

  componentWillUnmount = () => {
     //To unsubscribe Events from server
    
  }
 

 
  render = () => {
     
    return (
      <div  className="tableFrame">
        <div>
        <h2>
          <p>Welcome to Andrey Dergachev first React/NetCore 5 SPA @2021</p>
        </h2>
  

          <p>
             This project is the React based WEB site In subdirectory
            <code>..\..\Doc</code> contained technical developement task
           There is only one functional to calculate in the sever the simplest arythmetical expression.
          </p>
 
       

          <ul>  Files React:
            <li>
             <code>App.js</code> standard application starer for react
            </li>
            <li>
              <code>Layout.jsx</code> and <code>NavMenu.jsx</code> also is standard Menu and Layout functionalities
            </li>
          </ul>
 
          <ul> Files for Calculator:
            <li>
              <code>Calculator.jsx</code> is page of react, having dialogto enter Arguments and operations.
            </li>
            <li>
               <code>CalculatorTable.jsx</code> - table viewer for calculation history .
                This component is a child of Calculator page
            </li>
          </ul>

          <ul>
            <li>
              <code>CalculatorsService.js</code> is a singleton with events and syncronic API .
              Contains the <code>NgRx</code> subjets to oerform synchrony requests in async manner
            </li>
            <li>
              <code>JsonHttpServer.jsx</code> - service to perform Http calls.
            </li>
          </ul>
        </div>
 
        <footer >
    
         
        </footer>
        </div>
    );
  }




}
