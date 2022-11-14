import './App.css';

import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';

import { Canvas,Status,Navbar,Footer} from './Components'
import {BaghchalProvider} from './BaghchalContext';



function App() {


  return (
    <HelmetProvider>
    <BrowserRouter>
  
      <Navbar></Navbar>

      <div className="baghchal-app">
        <BaghchalProvider>
          <Routes>
            <Route path = "/" exact element={
              <>
                <Canvas showRules = {true} isHomePage = {true}/>  {/*For landing page title --> in rules.js */}
                <Status showRules = {true}/>
              </> 
            }/>
      
            <Route path = "/Baghchal" exact element = {
              <>
                <Canvas showRules = {false} isHomePage = {false}/>
                <Status showRules = {false}/>
              </> 
            }/>
            <Route path = "/Baghchal/rules" exact element = {
              <>
                <Canvas showRules = {true} isHomePage = {false}/>
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
