/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import {Buffer} from 'buffer';
Buffer.from('anything','base64');

export { default as Navigation } from "./Navigation";
export { default as Footer } from "./Footer";
export { default as Home } from "./Home";
export { default as Result } from "./Result";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  Navigation,
  Footer,
  Home,
  Result
} from "./";

ReactDOM.render(
  <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/result" element={<Result />} />      
    </Routes>
    <Footer />
  </Router>,
   
  document.getElementById("root")
);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
