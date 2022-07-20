import './App.css';

import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';

import { Canvas,Status,Navbar,Footer} from './Components'
import {BaghchalProvider} from './BaghchalContext';



function App() {


  return (
    <HelmetProvider>
    <BrowserRouter basename='/'>
    <Navbar></Navbar>
    <div className="baghchal-app">
    <BaghchalProvider>
      <Routes>
        <Route path = "/" exact element={
          <>
          <Canvas showRules = {false}/>
          <Status showRules = {false}/>
        </> 
        }/>
  
        <Route path = "/baghchal" exact element = {
          <>
            <Canvas showRules = {false}/>
            <Status showRules = {false}/>
          </> 
        }/>
        <Route path = "/baghchal/rules" exact element = {
          <>
            <Canvas showRules = {true}/>
            <Status showRules = {true}/>
          </> 
        }/>
      </Routes>
    </BaghchalProvider>
    </div> 
    <Footer></Footer>

    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
