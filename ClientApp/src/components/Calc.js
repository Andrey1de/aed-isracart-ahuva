import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import './Calc.css'
export class Calc extends Component {
  static displayName = Calc.name;

  constructor(props) {
    super(props);
    this.state = {
      argX: 0,
      argY: 0,
      operation: '-',
      operations: ['+', '-', '*', '/'],
      result: ''
    };

  }

  createSelectItems = () => {
    let items = [];
    let opers = this.state.operations || [];
    for (let i = 0; i <= this.state.operations.length; i++) {
      let op = opers[i];
      items.push(<option key={i} value={opers[i]}>{opers[i]}</option>)

    }
    return items;
  }
  // createSelectItems = () => {
  //   let items = this.state.operations.map(op => {
  //     <option value={op} >{op}</option>
  //   });
  //   return items;
  // }


  render() {
    return (
      <div>
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
              {this.createSelectItems()}
            </Form.Control>
          </Form.Group>
          &nbsp;&nbsp;
          <Form.Group controlId="inpArgY">
            <Form.Label>ArgY:</Form.Label>
            <Form.Control className="args" type="number" value={this.state.argY}
              onChange={(e) => this.setState({ argY: e.target.value })} />
          </Form.Group>

          <Button variant="primary" type="submit" >
            =
          </Button>
        </Form>
        <br />
        <label>X:{this.state.argX}|OP{this.state.operation}|Y:{this.state.argY}</label>
      </div >
    );
  }
}
