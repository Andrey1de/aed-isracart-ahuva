import React, { Component } from 'react';
//import { render } from "react-dom";
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle  } from "@fortawesome/free-regular-svg-icons";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { CalculatorService as Svc} from '../services/CalculatorService';
import './CalculatorTable.css';

//const MapHistory = new Map();
export class CalculatorTable extends Component {
  static displayName = CalculatorTable.name;


  constructor(props) {
    super(props);
      this.state = {
      history: [], // CalcDto[],
      selectedId: -1,
    };
    this.EvHistory = Svc.EvHistory();
    this.EvSelect = Svc.EvSelect();

    this.subscriptions = [];
    console.log('CalculatorTable::constructor');
  }

  componentWillUnmount = () => {
     //To unsubscribe Events from server
    this.subscriptions.map(sub => sub.unsubscribe());
  }
 
  componentDidMount = async () => {
    //To subcribe Events from server
   
    const sub1 = this.EvHistory.subscribe((n) => this.onEvHistory(n));
    const sub2 = this.EvSelect.subscribe((id) => this.onEvSelect(id));

    this.subscriptions = [sub1, sub2];
      
    const _history = [...await Svc.loadHistory$()];
    this.setState({
      history: [..._history]
    });
  }

  
  onEvSelect = (id) => {
    if (this.setState.selectedId !== +id) {
        this.setState({ selectedId: +id });
    }
  }

  onEvHistory = (n) => {
      this.setState({ history: [...Svc.getHistory()]  });
  }

  handleSelectRow = (e, id) => {
    this.setState({ selectedId: +id });
    Svc.setSelected(id);
  }

  handleRemoveRow = (e, id) => {
      Svc.removeHistoryRow(id);
  }
    
 
  render = () => {
    console.log('Calc::render()');
    const rowColor = (idx) => (+idx === +this.state.selectedId) ? "navy" : "black";
    const rowBkColor = (idx) => (+idx === +this.state.selectedId) ? "lightgray" : "white";
 
   
    return (
      <div>
        <h3 id="tabelLabel" >Calculation's History</h3>
        <table className='table ' aria-labelledby="tabelLabel">
            <thead>
              <tr>
                <th>ID</th>
                <th>HISTORY</th>
                <th>Delete</th>
                <th>Select</th>
       
              </tr>
            </thead>
            <tbody>
              {this.state.history.map(dto =>
                <tr key={dto.id} style={{ color: rowColor(dto.id) , background : rowBkColor(dto.id)}}>
                  <td>{dto.id}</td>
                  <td>
                    {`${dto.argX} ${dto.operation} ${dto.argY} = ${dto.result}`}
                  </td>
                  <td >
                    <Button variant="alarm" className="btnSubm" type="button"
                      onClick={(e) => this.handleRemoveRow(e, dto.id )} >
                      <FontAwesomeIcon icon={faTimesCircle} size="lg"/>
                    </Button>
                    
                 
                  </td>
                  <td>
                    <Button variant="light" className="btnSubm" type="button"
                        onClick={(e) => this.handleSelectRow(e, dto.id)} >
                      <FontAwesomeIcon icon={faArrowAltCircleRight} size="lg"/>
                    </Button>
                    
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
    );
  }




}
