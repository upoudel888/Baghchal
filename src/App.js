import './App.css';

import React from 'react';
import {HashRouter,Routes,Route,Navigate} from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';

import { Canvas,Status,Navbar,Footer} from './Components'
import {BaghchalProvider} from './BaghchalContext';



function App() {


  return (
    <HelmetProvider>
    <HashRouter basename='/'>
    <Navbar></Navbar>
    <div className="baghchal-app">
    <BaghchalProvider>
      <Routes>
        <Route path = "/" exact element={<Navigate to = '/baghchal/rules'/>}replace/>
  
        <Route path = "/baghchal" exact element = {
          <><Canvas showRules = {false}/><Status/></> 
        }/>
        <Route path = "/baghchal/rules" exact element = {
          <><Canvas showRules = {true}/><Status/></> 
        }/>
      </Routes>
    </BaghchalProvider>
    </div> 
    <Footer></Footer>

    </HashRouter>
    </HelmetProvider>
  );
}

export default App;
