import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
        <h2>
          <p>Welcome to Andrey Dergachev first React/NetCore 5 SPA @2021</p>
        </h2>
        <ul>
         <li><a href='http://localhost:5000/swagger/index.html'>Swagger to test API</a></li>
       </ul>
        {/* <p>To help you get started, we have also set up:</p> */}
        {/* <ul>
          <li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li>
          <li><strong>Development server integration</strong>. In development mode, the development server from <code>create-react-app</code> runs in the background automatically, so your client-side resources are dynamically built on demand and the page refreshes when you modify any file.</li>
          <li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and your <code>dotnet publish</code> configuration produces minified, efficiently bundled JavaScript files.</li>
        </ul> */}
        {/* <p>The <code>ClientApp</code> subdirectory is a standard React application based on the <code>create-react-app</code> template. If you open a command prompt in that directory, you can run <code>npm</code> commands such as <code>npm test</code> or <code>npm install</code>.</p> */}
       <p>
        <code>
        # This project is the React based WEB site
        In subdirectory ..\..\Doc contained technical developement task 
        ## There is only one functional to calculate in the sever the simplest arythmetical
        expression.
    
       </code>
     </p>
        <p><code>
        ## Files React:

        - App.js standard application starer for react
        - Layout.jsx and NavMenu also is standard Menu and  Layout functionalities
        </code></p>

        <p><code>
        ## Files for Calculator frontend
        - Calculator.jsx is page of  react, having dialogto enter Arguments and operations. Also displays last calc result.
        - CalculatorTable.jsx - table viewer for calculation history . This component is a child of Calculator page
        </code></p>
        <p>
          
     
        ## Services
        - CalculatorsService.js is a singleton with events and syncronic API . Contains the NgRx subjets to oerform synchrony requests in async manner
        -JsonHttpServer - service to perform Http calls.
        </p>
        
      
      </div>
     
    );
  }
}
