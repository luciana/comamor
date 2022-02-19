import React, { } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const lineData = [
    {
        name: '18/02/2022',
        positivo: 0.8,
        negativo: 0.1,
        mixed: 0.0,
        neutro: 0.1

    },
    {
        name: '19/02/2022',
        positivo: 0.5,
        negativo: 0.3,
        mixed: 0.1,
        neutro: 0.1
    },
    {
       name: '20/02/2022',
        positivo: 0.3,
        negativo: 0.2,
        mixed: 0.4,
        neutro: 0.1
    },
    {
        name: '21/02/2022',
        positivo: 0.2,
        negativo: 0.8,
        mixed: 0.0,
        neutro: 0.0
    },
    {
        name: '22/02/2022',
        positivo: 0.6,
        negativo: 0.1,
        mixed: 0.2,
        neutro: 0.1
    },
    {
       name: '23/02/2022',
        positivo: 0.9,
        negativo: 0.1,
        mixed: 0.0,
        neutro: 0.0
    },
    {
       name: '24/02/2022',
        positivo: 0.3,
        negativo: 0.2,
        mixed: 0.4,
        neutro: 0.1
    },
    {
        name: '25/02/2022',
        positivo: 0.7,
        negativo: 0.1,
        mixed: 0.1,
        neutro: 0.1
    },
    {
        name: '26/02/2022',
        positivo: 0.6,
        negativo: 0.2,
        mixed: 0.1,
        neutro: 0.1
    },
    {
       name: '27/02/2022',
        positivo: 0.9,
        negativo: 0.0,
        mixed: 0.0,
        neutro: 0.1
    },
];



const barData = [
  {name: 'aborrecido', comportamento: 50},
  {name: 'agitado', comportamento: 30},
  {name: 'agressivo', comportamento: 200},
  {name: 'concentrado', comportamento: 100},
  {name: 'disperso', comportamento: 50},
  {name: 'feliz', comportamento: 30},
  {name: 'sonolento', comportamento: 80},
  {name: 'tranquilo', comportamento: 120}  
];

function Result() {
 
  return (
    <div className="result">
      <div className="container">
       <h1 className="font-weight-light">Análise</h1>
        <p>
              Nosso pai tem demência frontal. Uma doença muito triste para ele e para a família.
              Por amor nós criamos esse sisterma para poder entender e adaptar as mudancas de humor e oscilações de comportamento.
        </p>
        <div className="row align-items-center my-5">
          <div className="col-lg-7">                      
            <h1 className="text-heading">
              Analysis de Humor
            </h1>
            <ResponsiveContainer width="100%" aspect={2}>
                <LineChart data={lineData} margin={{ right: 0 }}>
                    <CartesianGrid />
                    <XAxis dataKey="name" 
                        interval={'preserveStartEnd'} />
                    <YAxis></YAxis>
                    <Legend />
                    <Tooltip />
                    <Line dataKey="positivo"
                        stroke="green" activeDot={{ r: 8 }} />
                    <Line dataKey="negativo"
                        stroke="red" activeDot={{ r: 8 }} />
                    <Line dataKey="neutro"
                        stroke="gray" activeDot={{ r: 8 }} />
                    <Line dataKey="mixed"
                        stroke="blue" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="col-lg-5">           
            <p>
              Esse grafico usa Inteligencia Articifical para relatar as mudancas de humor durante o tempo.
            </p>
           
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-7">                      
            <h1 className="text-heading">
              Analysis de Comportamento
            </h1>
            <ResponsiveContainer width="100%" aspect={2}>
                <BarChart width={600} height={600} data={barData}>
                    <Bar dataKey="comportamento" fill="green" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis />
                </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="col-lg-5">            
            <p>
                Esse grafico usa Inteligencia Articifical para relatar os comportamentos durante um periodo determinado.
            </p>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;