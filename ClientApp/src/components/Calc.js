import React, { Component } from 'react';
//import { render } from "react-dom";
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle  } from "@fortawesome/free-regular-svg-icons";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { faEquals } from "@fortawesome/free-solid-svg-icons";
import { CalcService ,MOK} from '../services/CalcService';
import './Calc.css'
const MapHistory = new Map();
export class Calc extends Component {
  static displayName = Calc.name;

  constructor(props) {
    super(props);
    this.svc = CalcService;
    this.state = {
      argX: 0,
      argY: 0,
      operation: '+',
      operations: [], // string[],
      history : [], //CalcDto[]
      result: '',
      error: '',
      selestedId : -1
    };
    console.log('Calc::constructor');
  }

  async componentDidMount() {
    const _operations = [...await this.svc.getOperations$()];// (...); // Using await to get the result of async func
    this.setState({
      operations: [..._operations],
      history: [...MapHistory.values()]
    });
    debugger;
    this.setState({
      argX: 5,
      argY: 6,
      operation: '*'
    });
     const { argX, argY, operation } = this.state;
    // alert(idx);
    this.handleCalc$(argX, argY, operation).then(
      result => {
              console.log('onButtonCalc ret:' + result);
        }
     );
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

  // onButtonCalc = (e,idx) => {
  //   const { argX, argY, operation } = this.state;
  //   // alert(idx);
  //   this.handleCalc$(argX, argY, operation).then(
  //     result => {
  //             console.log('onButtonCalc ret:' + result);
  //       }
  //    );
  // }

  handleCalc$ =  async (e) =>  {
    const { argX, argY, operation } = this.state;
 
    const ret$ = await this.svc.calcByServer$(+argX, +argY, operation);

    if (!!ret$ && !!ret$.dto && !!ret$.dto && !ret$.error) {
      
        MapHistory.set(+ret$.dto.id, ret$.dto);
        this.setState({
          history: [...MapHistory.values()], //CalcDto[]
          result: ret$.dto.result,
          error: ''
        });
        
        console.log('Result=' +  this.state.result);
        console.log('CalcDto=');
        console.dir(ret$.dto);

        console.log('History=');
        console.dir(this.state.history);

    } else {
      this.setState({
        result: 'N/A',
        error: ret$.error
      });
  
    }
    return this.state.result;
  }
  

    
  handleRemoveRow = async (e,id) => {
    const _ft = MapHistory.delete(+id);
    if (_ft) {
      this.setState({
            history : [...MapHistory.values()], //CalcDto[]
            result: '',
            error: ''
        });       
    }
     
  }
    
  onEditRow = (e,id) => {
    const _op =  MapHistory.get(+id);
    if (_op) {
      this.setState({
          selestedId : _op.id,
          argX: _op.argX,
          argY: _op.argY,
          operation: _op.operation,
          result: _op.result,
          error: ''
      });
    }
  }
  
  render = () => {
    console.log('Calc::render()');
    //let { error, argX, argY, operation } = this.state;
    // const _tableContents = this.state.loading
    //   ? <p><em>Loading...</em></p>
    //   : this.renderOperationTable(); 
    //let  selestedId  = this.state.selestedId;
    //let { selestedId, argX, argY, operation } = this.state;
    const rowColor = (idx) => (+idx === +this.state.selestedId) ? "cyan" : "red";
 

     const _errorBanner = this.state.error
      ? <h5><Form.Label style={{ color: 'red' }}>{this.state.error}</Form.Label></h5>
      : <br />;

    return (
      <div>
        { (MOK) ? <h4>MOK MODE !!!</h4> : null}
        <Form inline >

          <Form.Group  controlId="inpArgX" >
            <Form.Label>{this.state.argX}:</Form.Label>
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
            <Form.Label>ArgY:</Form.Label>
            <Form.Control className="args" type="number" value={ this.state.argY}
                onChange={(e) => this.setState({ argY: e.target.value })} />
          </Form.Group>
          &nbsp;&nbsp;
          <Form.Group controlId="btnResult">
            <Button variant="primary" className="btnSubm"
              type="button" onClick={async () => {
                await this.handleCalc$();
              }} >
              <FontAwesomeIcon icon={faEquals} /> 
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

        <div>
          <h3 id="tabelLabel" >Calculation's History</h3>
          <table className='table table-striped' aria-labelledby="tabelLabel">
            <thead>
              <tr>
                <th>ID</th>
                <th>HISTORY</th>
                <th>Select</th>
                <th>Delete</th>
    
              </tr>
            </thead>
            <tbody>
              {this.state.history.map(dto =>
                <tr key={dto.id} style={{ color : rowColor(dto.id)}}>
                  <td>{dto.id}</td>
                  <td>
                    {`${dto.argX} ${dto.operation} ${dto.argY} = ${dto.result}`}
                  </td>
                  <td >
                    {/* <Button variant="light" className="btnSubm" type="button" onClick={(e) => this.onRemoveRow(e, { dto.id })} >
                    <FontAwesomeIcon icon={faTimesCircle} />
                    </Button>
                     */}
                    <FontAwesomeIcon icon={faTimesCircle} />
                  </td>
                  <td onClick={this.onEditRow(dto.id)}>
                    {/* <Button variant="light" className="btnSubm" type="button" onClick={(e)=>this.onEditRow(e,dto.id)} >
                      <FontAwesomeIcon icon={faArrowAltCircleRight} />
                    </Button> */}
                     <FontAwesomeIcon icon={faArrowAltCircleRight} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
     
      </div >
    );
  }


  
  // renderOperationTable = () => {
  //   let  selestedId  = this.state.selestedId;
  //   //let { selestedId, argX, argY, operation } = this.state;
  //   const rowColor = (idx) => (idx === selestedId) ? "cyan" : "red";
 
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
