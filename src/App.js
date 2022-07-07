import './App.css';

import React from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'

import { Canvas,Status,Navbar} from './Components'
import {BaghchalProvider} from './BaghchalContext';



function App() {
  return (
    <Router>
    <Navbar></Navbar>
      <BaghchalProvider>
        <Routes>
          <Route path = "/" exact element = {
            <div clgit assName="baghchal-app">
              <Canvas/>
              <Status/>  
            </div>         
          }/>
          <Route path = "/Baghchal" exact element = {
            <div className="baghchal-app">
              <Canvas/>
              <Status/>  
            </div>         
          }/>
        </Routes>
      </BaghchalProvider>
    </Router>

  );
}

export default App;
