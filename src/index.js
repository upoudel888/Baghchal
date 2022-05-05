import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Baghchal from './modules/baghchal.js'



let game = new Baghchal();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App game = {game}/>
  </React.StrictMode>
);


