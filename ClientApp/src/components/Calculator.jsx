import React, { Component } from 'react';
//import { render } from "react-dom";
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEquals } from "@fortawesome/free-solid-svg-icons";
import { CalculatorService as Svc ,MOK} from '../services/CalculatorService';
import './Calculator.css';
import { CalculatorTable } from './CalculatorTable';

//const MapHistory = new Map();
export class Calculator extends Component {
  static displayName = Calculator.name;

  constructor(props) {
    super(props);
   //   this.subscr1 = undefined;
    this.state = {
      argX: 0,
      argY: 0,
      operation: '+',
      operations: [], // string[], 
      result: '',
      error: '',
      selectedId: -1
    };
    this.subscriptions = [];
    this.EvCalcResult = Svc.EvCalcResult();
    this.EvSelect = Svc.EvSelect();
 
    console.log('Calculator::constructor');
  }

  async componentDidMount() {
 
    const sub1 = this.EvCalcResult.subscribe(dto => this.onEvCalcResult(dto));
    const sub2 = this.EvSelect.subscribe(id => this.onEvSelect(id));

    this.subscriptions = [sub1, sub2];
    
     this.setState({
      operations: [...await Svc.getOperations$()]
    });

  
  }

  componentWillUnmount() {
    this.subscriptions.map(sub => sub.unsubscribe());
    //this.subscr1?.unsubscribe();
  }

  onEvCalcResult = (dto) =>{
    if (dto &&  !dto.error) {
      this.setState({
        result: dto.result || 'N/A',
        error: '',
        selectedId: -1
      });
      
      console.log('Result=' +  this.state.result);
  
    } else {
      this.setState({
        result: 'N/A',
        error: dto.error,
        selectedId: -1
      });
  
    }

  }
  
  onEvSelect = (id) => {
    const dto = Svc.getSelectedDto(+id);
    if (dto) {
      this.setState({
        
        selectedId : dto.id,
        argX: dto.argX,
        argY: dto.argY,
        operation: dto.operation,
        result: dto.result,
        error: ''
    });
    } else {
      if (this.state.selectedId !== -1)
      {
        this.setState({selectedId : -1});
      }
    }
  }

   
 
  handleCalc = (e) => {
    //debugger;
    const { argX, argY, operation, selectedId } = this.state;
    Svc.toCalculate(+argX, +argY, operation, selectedId);
    if (selectedId !== -1)
    {
      this.setState({selectedId : -1});
    }
    e.preventDefault();
  }
   

  
 createSelectItems = () => {
    let items = [];
    let opers = this.state.operations || [];
    for (let i = 0; i <= this.state.operations.length; i++) {
      let op = opers[i];
      items.push(<option key={i} value={op}>{op}</option>)
    }
    return items;
  }


  render = () => {
    console.log('Calculator::render()');
    //let { error, argX, argY, operation } = this.state;
    // const _tableContents = this.state.loading

     const _errorBanner = this.state.error
      ? <h5><Form.Label style={{ color: 'red' }}>{this.state.error}</Form.Label></h5>
      : <br />;

    return (
      <div>
        { (MOK) ? <h4>MOK MODE !!!</h4> : null}
        <Form inline >

          <Form.Group  controlId="inpArgX" >
            <Form.Label>X:</Form.Label>
            <Form.Control className="args" type="number" value={ this.state.argX}
              onChange={(e) => this.setState({ argX: e.target.value })} />
          </Form.Group >
          &nbsp;&nbsp;
          <Form.Group controlId="selectOperation">
            <Form.Control as="select" className="args" value={ this.state.operation}
              onChange={(e) => this.setState({ operation: e.target.value })}>
              {this.createSelectItems()}
            </Form.Control>
          </Form.Group>
          &nbsp;&nbsp;
          <Form.Group controlId="inpArgY">
            <Form.Label>Y:</Form.Label>
            <Form.Control className="args" type="number" value={ this.state.argY}
                onChange={(e) => this.setState({ argY: e.target.value })} />
          </Form.Group>
          &nbsp;&nbsp;
          <Form.Group controlId="btnResult">
            <Button variant="primary" className="btnSubm"
              type="button" onClick={this.handleCalc}>
              <FontAwesomeIcon icon={faEquals} size="lg" /> 
            </Button>
            &nbsp;&nbsp;
            <Form.Label>{this.state.result }</Form.Label> 
          </Form.Group>
  
        </Form>
        <div>
          {_errorBanner}
        <br/>
        <Form.Label>X:{this.state.argX}|OP{this.state.operation}|Y:{this.state.argY}={this.state.result}</Form.Label>
        </div>

        <CalculatorTable></CalculatorTable>
      </div >
    );
  }


  
  // renderOperationTable = () => {
  //   let  selectedId  = this.state.selectedId;
  //   //let { selectedId, argX, argY, operation } = this.state;
  //   const rowColor = (idx) => (idx === selectedId) ? "cyan" : "red";
 
  //  // const _selectedId = this.state.selectedId;
  //   return (
  //     <table className='table table-striped' aria-labelledby="tabelLabel">
  //       <thead>
  //         <tr>
  //           <th>ID</th>
  //           <th>HISTORY</th>
  //           <th>Select</th>
  //           <th>Delete</th>
 
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {this.state.history.map(dto =>
  //           <tr key={dto.id} style={{ color : rowColor(dto.id)}}>
  //             <td>{dto.id}</td>
  //             <td>
  //               {`${dto.argX} ${dto.operation} ${dto.argY} = ${dto.result}`}
  //             </td>
  //             <td >
  //               <Button variant="light" className="btnSubm" type="button" onClick={this.onRemoveRow(dto.id)} >
  //                <FontAwesomeIcon icon={faTimesCircle} />
  //               </Button>
                 
  //             </td>
  //             <td onClick={this.onEditRow(dto.id)}>
  //               <Button variant="light" className="btnSubm" type="button" onClick={this.onEditRow(dto.id)} >
  //                 <FontAwesomeIcon icon={faArrowAltCircleRight} />
  //               </Button>
  //             </td>
  //           </tr>
  //         )}
  //       </tbody>
  //     </table>
  //   );
  // }

}
