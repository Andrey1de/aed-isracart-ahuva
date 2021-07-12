import React, { Component } from 'react';
//import { render } from "react-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle  } from "@fortawesome/free-regular-svg-icons";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { Calculator } from './Calculator';
import { CalculatorTable } from './CalculatorTable';

import './CalculatorPage.css';


export class CalculatorPage extends Component {
static displayName = CalculatorPage.name;

  render = () => {
     
    return (
        <div className="root">
            <div className="work">
            
                <div className="left" >
                    <h1 style={{ textAlign: "center" }}>Calculator</h1>

                     <Calculator></Calculator> 
                    <div className="leftFooter">

                        <u><h2 style={{ textAlign: "center" }}> Agenda for Calculator Page</h2></u>
                        <p>
                            <FontAwesomeIcon icon={faTimesCircle} size="2x" color="red" />
                            <strong>
                                DELETE when user presses this button - the calculation
                                will be deleted (both in server and client);
                            </strong>
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faArrowAltCircleRight} size="2x" color="green" />
                            <strong>
                                UPDATE when user presses this button - the calculation will be
                                show in the above inputs and when the user change the value ,
                                it will be updated also in the calculation history.
                            </strong>    
                        </p>

                    </div>

                </div>
                <div className="right">
                    <h1 style={{ textAlign: "center" }}>Table</h1>
                       <CalculatorTable></CalculatorTable>
 

                </div>

            </div>


       </div>

    );
  }




}
