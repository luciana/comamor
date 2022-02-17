import React from "react";
import graph from './sentiment-analysis-graph.png';

function Result() {
  return (
    <div className="result">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-7">          
             <img src={graph} className="img-fluid rounded mb-4 mb-lg-0" alt="sentiment analysis" /> 
          </div>
          <div className="col-lg-5">
            <h1 className="font-weight-light">Results</h1>
            <p>
              Nosso pai tem demencia frontal. Uma doenca muito triste para ele e para a familia.
              Por amor nos criamos esse sisterma para poder entender e adaptar as mudancas de humor do meu pai.
              Esse sistema usa Inteligencia Articifical para relatar as mudancas de humor durante o tempo.
            </p>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;