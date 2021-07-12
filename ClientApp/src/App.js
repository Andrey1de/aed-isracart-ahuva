import React, { Component } from 'react';

import { Route } from 'react-router';
import { Layout } from './components/Layout';
//import { Home } from './components/Home';
import { CalculatorPage } from './components/CalculatorPage';

import { About } from './components/About';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={About} />
        <Route path='/calc' component={CalculatorPage} />
        <Route path="/swagger" render={() => (window.location = "http://localhost:5000/swagger")} />

      </Layout>
    );
  }
}
