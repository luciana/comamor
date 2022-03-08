import React from "react";
import { NavLink } from "react-router-dom";
import './App.css';


function Navigation() {

  function DateDisplay(){
    return (
      <div className="date">
        <span><small> Hoje: {new Date().toLocaleString("pt-BR")}</small></span>      
      </div>
    );
}
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/" >
          <div className="row">
          <div className=""> Diario do Papai     </div>
          <div className="px-3"> <DateDisplay /></div>         
      </div>
          </NavLink>
          <div>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/result">
                  Análise
                </NavLink>
              </li>
              
            
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;