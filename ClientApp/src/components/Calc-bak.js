import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle  } from "@fortawesome/free-regular-svg-icons";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { Form, Button } from 'react-bootstrap';
import { CalcService ,MOK} from '../services/CalcService';


import './Calc.css'
export class Calc extends Component {
  static displayName = Calc.name;

 
  constructor(props) {
    super(props);
    this.svc = CalcService;
   
    this.state = {
     // id: 0, // Unique in session ID may be ysed to delete and navigate
      argX: 0,
      argY: 0,
      operation:'',
      operations: [],
  //    result: '',
      history: [],//Array of CalcDto
      selectedId : -1, //CalcDto
      error: '',
      loading: true
     };
   
  }
  componentWillUnmount() {
 //   CalcOperation.saveCalcState(this, this.state.status);
  }
//
  //
  componentDidMount() {
    debugger;
    // let _history = this.svc.getHistory();
    const _selected = this.svc.getSelectedDto();//dto
     
    this.setState({
      selectedId : _selected?.id || -1, //CalcDto
      history: [...this.svc.getHistory()],+
      operations: [...this.svc.getOperations()],
      loading : false,
    });

    if (_selected) {
       this.bindToDto(_selected);
    }

  }


  onCalcButton = () => {
    this.setState({ loading: true });
    this.calcByService();
  }

  async calcByService() {
    const { argX, argY, operation } = { ...this.state }
     const {res,err,id} = await this.calcByServer(
      argX, argY, operation
    );
    if (!err) {
       this.setState({
        result : res,
        error: '',
        selectedId: id,
        loading: false

      })    
    } else {
 
      this.setState({
        result : 'N/A',
        error: err,
        selectedId: -1,
        loading: false

      })
    }
  }

  handleRemoveRow = (idx) =>  {
    if (this.svc.getById(idx)) {
      const rows = this.svc.removeById(idx);
      this.setState({
        history: [...rows],
        selectedId: -1
      });
    }
  }
  
  handleEditRow = (idx) => (e) => {
    const dto = this.svc.setSelectedDto(idx);
    if (dto) {
      this.bindToDto(dto);
      
    }
  }

  bindToDto = (dto) =>{ //CalcDto
    if (dto ) {
    
      this.setState({
        selectedId: dto.id,
        argX: dto.argX,
        argY: dto.argY,
        operation: dto.operation
      });
    }
  }
  createSelectItems = () => {
    let items = [];
    const opers = this.state.operations;
    for (let i = 0; i < opers.length; i++) {
       items.push(<option key={i} value={opers[i]}>{opers[i]}</option>)
    }
    return items;
  }

  
//================ RENDER PART ===============================
  
  render() {
   const _selectItems = this.createSelectItems();
   const _tableContents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderOperationTable(); 

   return (
     <div>
       { (MOK) ? <h4>MOK MODE !!!</h4> : null}
        <Form inline >
           <div class="form-group" controlId="inpArgX" mb-1>
            <Form.Label>ArgX:</Form.Label>
            <Form.Control className="args" type="number" value={this.state.argX}
              onChange={(e) => this.setState({ argX: e.target.value })} />
          </div>
          &nbsp;&nbsp;
          <Form.Group controlId="selectOperation">
            <Form.Control as="select" className="args" value={this.state.operation}
              onChange={(e) => this.setState({ operation: e.target.value })}>
              {_selectItems}
            </Form.Control>
          </Form.Group>
          &nbsp;&nbsp;
          <Form.Group controlId="inpArgY">
            <Form.Label>ArgY:</Form.Label>
            <Form.Control className="args" type="number" value={this.state.argY}
              onChange={(e) => this.setState({ argY: e.target.value })} />
          </Form.Group>
          &nbsp;&nbsp;
          <Button variant="primary" className="btnSubm" type="button" onClick={this.onCalcButton} >
            &nbsp; = &nbsp;
          </Button>
          &nbsp;&nbsp;
          <Form.Group controlId="labResult">
            <Form.Label>{this.state.result }</Form.Label>
            {/* <Form.Control className="args" type="number" value={this.state.argY}
              onChange={(e) => this.setState({ argY: e.target.value })} /> */}
          </Form.Group>
        </Form>
        <div>
          <br />
         <label>X:{this.state.argX}|OP{this.state.operation}|Y:{this.state.argY}={this.state.result}</label>
          <br />
        </div>
        <div>
          <h3 id="tabelLabel" >Calculation's History</h3>
          {_tableContents}
        </div>
      </div>
   
    );
  }

  renderOperationTable = () => {
    const _history = this.state.history;
   // const _selectedId = this.state.selectedId;
    return (
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
          {_history.map(dto =>
            <tr key={dto.id}>
              <td>{dto.id}</td>
              <td>
                {`${dto.argX} ${dto.operation} ${dto.argY} = ${dto.result}`}
              </td>
              <td onClick={this.handleRemoveRow(dto.id)}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </td>
              <td onClick={this.handleEditRow(dto.id)}>
                <FontAwesomeIcon icon={faArrowAltCircleRight} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

}
