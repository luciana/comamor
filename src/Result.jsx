import React, { useState, useEffect } from "react";
import { API } from 'aws-amplify';
import { listNotes } from './graphql/queries';
import HumorBarChart from './components/charts/humorBarChart';
import SentimentLineChart from './components/charts/sentimentLineChart';
import CuidadoraPieChart from './components/charts/cuidadoraPieChart';
import VitalsComposedChart from './components/charts/vitalsComposedChart';

function Result() {
 
  const [notes, setNotes] = useState([]);
  const [lineChartSentimenttData, setLineChartSentimentData] = useState([]);
  const [barChartHumorData, setBarChartHumorData] = useState({});
  const [pieChartCuidadoraData, setPieChartCuidadoraData] = useState([]);
  const [composedChartVitalsData, setComposedChartVitalsData] = useState([]);
  
  
  
  useEffect(()=>{
    fetchNotes();
  },[]);
 
  useEffect(()=>{   
    getSentimentChartData();
    getHumorChartData();  
    getCuidadoraChartData();   
    getVitalsChartData();

  },[notes]);

  async function fetchNotes() {
    try{
      const apiData = await API.graphql({ query: listNotes });
      const items = apiData.data.listNotes.items;
    
      items.sort(function(a, b) {
        var c = new Date(a.title);
        var d = new Date(b.title);
        return c-d;
      });
      items.reverse();
      setNotes(items);
      //console.log(' SORTED NOTES FROM RESULTS ', items);
       
      } catch (err) {
        console.log("ERROR: Fetching Notes from results")      
      }
  }

 

  function getSentimentChartData(){
    let lineChartDataLocal = [];
    if ( notes ){
      
      notes.forEach(item => {   
       
        if (item.sentiment){          
          let object = {};    
          let sentiment = JSON.parse(item.sentiment);
          object.name = item.title.split(',')[0];
          object.positivo = sentiment.positive;
          object.negativo = sentiment.negative;
          object.neutro = sentiment.neutral;
          object.mix = sentiment.mixed;
          // console.log("lineChartDataLocal object", object);

          lineChartDataLocal.push(object);
        }
      });     
    }  
    setLineChartSentimentData(lineChartDataLocal); 
    //console.log("lineChartDataLocal", lineChartSentimenttData);
  }

  function getHumorChartData(){
    let barChartDataLocal = [];
    let barChartDataLocalObject = { data:[], activeIndex: 0}
    var res = {};
    notes.forEach(function(v) {
      res[v.manha_humor_select] = (res[v.manha_humor_select] || 0) + 1;
    });
    notes.forEach(function(v) {
      res[v.tarde_humor_select] = (res[v.tarde_humor_select] || 0) + 1;
    });
    notes.forEach(function(v) {
      res[v.noite_humor_select] = (res[v.noite_humor_select] || 0) + 1;
    });

    for (var k in res){     
      if ( k ){
      var object = {};     
      object.name = k;
      object.comportamento = res[k];      
      barChartDataLocal.push(object);}
    };
    barChartDataLocalObject.data = barChartDataLocal;
    setBarChartHumorData(barChartDataLocalObject); 
    //console.log("BarChartHumorData", barChartHumorData);
  }

  function nomeDaCuidadora(id){
    if ( id === '1' || id === 1 ) return 'Mirian';
    if ( id === '2' || id === 2) return 'Samira';
  }

  function getCuidadoraChartData(){
    let pieChartDataLocal = [];
    var res = {};
    notes.forEach(function(v) {
      res[v.cuidadora_do_dia] = (res[v.cuidadora_do_dia] || 0) + 1;
    });

    for (var k in res){     
      if ( k ){
      var object = {};
      object.name = nomeDaCuidadora(k);
      object.value = res[k];      
      pieChartDataLocal.push(object);}
    };

    setPieChartCuidadoraData(pieChartDataLocal); 
    //console.log("pieChartData", pieChartCuidadoraData);
  }


  function getVitalsChartData(){

    let composedChartVitalDataLocal = [];
    // {
    //   name: "Day A",
    //   systolic: 120,
    //   diastolic: 80,
    //   saturation: 92,
    //   temperature: 36.5
    // },

    if ( notes ){      
      notes.forEach(item => {                
          let object = {};       
          if( item.saturacao !== 999) { 
            let systolic = item.pressao.split('/')[0];
            let diastolic = item.pressao.split('/')[1];
            object.name = item.title.split(',')[0];
            object.systolic = systolic*10;
            object.diastolic = diastolic*10;
            object.saturation = item.saturacao;
            object.temperature = item.temperatura;        
            composedChartVitalDataLocal.push(object);       
          }; 
      });     
    }
    setComposedChartVitalsData(composedChartVitalDataLocal);
   // console.log("vitals chart Data", composedChartVitalsData);

  }

  return (
    <div className="result">
      <div className="container">
       <h1 className="font-weight-light">Análise</h1>
        <p>
              Nosso pai tem demência frontal. Uma doença muito triste para ele e para a família.
              Por amor nós criamos esse sisterma para poder entender e adaptar as mudancas de humor e oscilações de comportamento.
        </p>
        <div className="row align-items-center my-5">
          <div className="col-lg-12">                      
            <h1 className="text-heading">
              Analysis de Humor
            </h1>
            {lineChartSentimenttData.length > 0 && 
             <SentimentLineChart value={lineChartSentimenttData}/>
            }
          </div>          
        </div>
      </div>   
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-12">                                             
            <h1 className="text-heading">
              Analysis de Sinais Vitais
            </h1>
            { composedChartVitalsData.length > 0 &&
             <VitalsComposedChart value={composedChartVitalsData} />
             }
                  
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-12">                      
            <h1 className="text-heading">
              Analysis de Comportamento
            </h1>
            {typeof barChartHumorData != "undefined"  &&  barChartHumorData.data && barChartHumorData.data.length > 0 &&
             <HumorBarChart value={barChartHumorData} />
            }
          </div>         
        </div>
      </div>
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-7">                      
            <h1 className="text-heading">
              Cuidadoras
            </h1>
           
             <CuidadoraPieChart value={pieChartCuidadoraData}/>
            
          </div>
          <div className="col-lg-5">            
            <p>
                Esse grafico mostra quantidade de vezes ao mes cade cuidadora cuidou do papai.
            </p>           
          </div>
        </div>
      </div>
   

    </div>
  )
}



export default Result;