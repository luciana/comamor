import React, { useState, useEffect } from "react";
import { API } from 'aws-amplify';
import { listNotes } from './graphql/queries';
import HumorBarChart from './components/charts/humorBarChart';
import HumorPieChart from './components/charts/humorPieChart';
import SentimentLineChart from './components/charts/sentimentLineChart';
import CuidadoraPieChart from './components/charts/cuidadoraPieChart';
import VitalsComposedChart from './components/charts/vitalsComposedChart';
import SaturationLineChart from './components/charts/saturationLineChart';
import TemperatureLineChart from './components/charts/temperatureLineChart';
import TimelineChart from './components/Timeline';

function Result() {
 
  const [notes, setNotes] = useState([]);
  const [lineChartSentimenttData, setLineChartSentimentData] = useState([]);
  const [barChartHumorData, setBarChartHumorData] = useState({});
  const [barChartHumorManhaData, setBarChartHumorManhaData] = useState({});
  const [barChartHumorTardeData, setBarChartHumorTardeData] = useState({});
  const [pieChartCuidadoraData, setPieChartCuidadoraData] = useState([]);
  const [composedChartVitalsData, setComposedChartVitalsData] = useState([]);
  const [saturationChartVitalsData, setSaturationChartVitalsData] = useState([]);
  const [temperatureChartVitalsData, setTemperatureChartVitalsData] = useState([]);
  const [medicationTimeline, setMedicationTimeline] = useState([]);
    
  useEffect(()=>{
    fetchNotes();
  },[]);
 
  useEffect(()=>{   
    getSentimentChartData();
    getHumorChartData();  
    getCuidadoraChartData();   
    getVitalsChartData();
    getMedicationChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function uniq(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}
 
  function getMedicationChartData(){
    let remedioTimeLinetDataLocal = [];
    const medications = [
                      {name: "Ass", variations: ["Ass", "ass"]},
                      {name: "Benicar", variations: ["Benicar", "Benicard"]},
                      {name: "Canabidiol", variations: ["Canabidiol", "Tetra", "Carmem"]},  
                      {name: "Cocichimil", variations: ["Cocichimil"]},                                     
                      {name: "Donila Duo 10/20", variations: ["Donila Duo 10/20", "Donila Duo", "DonilaDuo", "Doniladua", "Donila dua"]}, 
                      {name: "Esc", variations: ["Esc 10 mg", "Esc", "Esc 20 mg"]},
                      {name: "Luftal", variations: ["Luftal"]},  
                      {name: "Rivotril", variations: ["Rivotril"]},
                      {name: "Risperidona", variations: ["Risperidona", "Resperidona"]},
                      {name: "Rosuvastatina", variations: ["Rosuvastatina"]}
                     ];    
            

    if ( notes ){
      for( const item of notes ){
        let object_remedio ={}
        let remedioTardeTimeLinetDataLocal = [];       
        let remedioManhaTimeLinetDataLocal =[];
        let remedioNoiteTimeLinetDataLocal = [];

        if ( item.manha_remedios_text.length > 0 ){            
          object_remedio.name = item.title.split(',')[0];  

          for ( const medication of medications){

            let med = medication.name;
            let a_variations = medication.variations;
            //console.log('med for' , med);
            //console.log(' in ', item.manha_remedios_text);

            for ( const index in a_variations ){
              //console.log('looking for variation' , a_variations[index] );
              if (item.manha_remedios_text.includes(a_variations[index])) {
                //console.log('found variation' , a_variations[index] );
                remedioManhaTimeLinetDataLocal.push(med);
              }
            }           
          }                
        }
        object_remedio.manha = uniq(remedioManhaTimeLinetDataLocal);
       

        if ( item.tarde_remedios_text.length > 0 ){            
          object_remedio.name = item.title.split(',')[0];  

          for ( const medication of medications){

            let med = medication.name;
            let a_variations = medication.variations;
            //console.log('med for' , med);
            //console.log(' in ', item.tarde_remedios_text);

            for ( const index in a_variations ){
              //console.log('looking for variation' , a_variations[index] );
              if (item.tarde_remedios_text.includes(a_variations[index])) {
                //console.log('found variation' , a_variations[index] );
                remedioTardeTimeLinetDataLocal.push(med);
              }
            }           
          }                
        }
        object_remedio.tarde = uniq(remedioTardeTimeLinetDataLocal);

        if ( item.noite_remedios_text.length > 0 ){            
          object_remedio.name = item.title.split(',')[0];  

          for ( const medication of medications){

            let med = medication.name;
            let a_variations = medication.variations;
            //console.log('med for' , med);
            //console.log(' in ', item.noite_remedios_text);

            for ( const index in a_variations ){
              //console.log('looking for variation' , a_variations[index] );
              if (item.noite_remedios_text.includes(a_variations[index])) {
                //console.log('found variation' , a_variations[index] );
                remedioNoiteTimeLinetDataLocal.push(med);
              }
            }           
          }                
        }
        object_remedio.noite = uniq(remedioNoiteTimeLinetDataLocal);
        remedioTimeLinetDataLocal.push(object_remedio);
        
      }

      // data = [
      //   {
      //     manha: ['Benicar', 'Cocichimil', 'Donila Duo 10/20', 'Esc']
      //     name: "3/12/2022"
      //     noite: ['Cocichimil']
      //     tarde: ['Ass']]
    //        }
      // ]
      setMedicationTimeline(remedioTimeLinetDataLocal);
      //console.log("remedio manha data", medicationTimeline);
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
    let barChartManhaDataLocal = [];
    let barChartTardeDataLocal = [];
    let barChartDataLocalObject = { data:[], activeIndex: 0}
    var res = {};
    var res_manha = {};
    var res_tarde = {};

    notes.forEach(function(v) {
      res[v.manha_humor_select] = (res[v.manha_humor_select] || 0) + 1;
      res_manha[v.manha_humor_select] = ( res_manha[v.manha_humor_select] || 0) + 1;
      res[v.tarde_humor_select] = (res[v.tarde_humor_select] || 0) + 1;
      res_tarde[v.tarde_humor_select] = ( res_tarde[v.tarde_humor_select] || 0) + 1;
      res[v.noite_humor_select] = (res[v.noite_humor_select] || 0) + 1;
    });

    for (var k in res){     
      if ( k ){
      var object = {};     
      object.name = k;
      object.comportamento = res[k];      
      barChartDataLocal.push(object);}
    };
    for (var k in res_manha){     
      if ( k ){
      var object = {};     
      object.name = k;
      object.comportamento = res_manha[k];      
      barChartManhaDataLocal.push(object);}
    };
    for (var k in res_tarde){     
      if ( k ){
      var object = {};     
      object.name = k;
      object.comportamento = res_tarde[k];      
      barChartTardeDataLocal.push(object);}
    };
    barChartDataLocalObject.data = barChartDataLocal;
    setBarChartHumorData(barChartDataLocalObject); 
    setBarChartHumorManhaData(barChartManhaDataLocal); 
    setBarChartHumorTardeData(barChartTardeDataLocal); 
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
    let saturationLineChartVitalDataLocal = [];
    let tempLineChartVitalDataLocal = [];
  
    if ( notes ){      
      notes.forEach(item => {                
          let object = {};       
          let object_sat= {};
          let object_temp= {};
          if( item.saturacao !== 999) { 
            let systolic = item.pressao.split('/')[0];
            let diastolic = item.pressao.split('/')[1];
            object.name = item.title.split(',')[0];
            object.systolic = systolic;
            object.diastolic = diastolic;
            object_sat.name = item.title.split(',')[0];
            object_sat.saturation = item.saturacao;
            object_temp.name = item.title.split(',')[0];
            object_temp.temperature = item.temperatura;        
            composedChartVitalDataLocal.push(object);     
            saturationLineChartVitalDataLocal.push(object_sat);  
            tempLineChartVitalDataLocal.push(object_temp);  
          }; 
      });     
    }
    setComposedChartVitalsData(composedChartVitalDataLocal);
    setSaturationChartVitalsData(saturationLineChartVitalDataLocal);
    setTemperatureChartVitalsData(tempLineChartVitalDataLocal);
   // console.log("vitals chart Data", composedChartVitalsData);
    console.log("vitals chart Data - saturacao", saturationChartVitalsData);

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
              Análise de Humor
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
              Análise de Pressão Arterial 
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
              Análise de Saturação de Oxigênio ( SpO2% )
            </h1>
            { saturationChartVitalsData.length > 0 &&
             <SaturationLineChart value={saturationChartVitalsData} />
            }
                  
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-12">                                             
            <h1 className="text-heading">
              Análise de Temperatura Corporal ( &deg;C )
            </h1>
            { temperatureChartVitalsData.length > 0 &&
             <TemperatureLineChart value={temperatureChartVitalsData} />
            }
                  
          </div>
        </div>
      </div>
      

      <div className="container">
        <div className="row align-items-center py-5 my-5">
          <div className="col-lg-6">                      
            <h1 className="text-heading">
              Análise de Comportamento do dia inteiro
            </h1>
            {typeof barChartHumorData != "undefined"  &&  barChartHumorData.data && barChartHumorData.data.length > 0 &&
             <HumorBarChart value={barChartHumorData} />             
            }
          </div>   
          <div className="col-lg-6">                                 
            {typeof barChartHumorData != "undefined"  &&  barChartHumorData.data && barChartHumorData.data.length > 0 &&            
             <HumorPieChart value={barChartHumorData.data} />             
            }
          </div>       
        </div>
        <div className="row align-items-center py-5 my-5">
          <div className="col-lg-6">               
            <h1 className="text-heading">
              Análise de Comportamento da Manhã
            </h1>                   
            {barChartHumorManhaData.length > 0 &&
             <HumorPieChart value={barChartHumorManhaData} />             
            }
          </div>   
          <div className="col-lg-6">
            <h1 className="text-heading">
              Análise de Comportamento da Tarde
            </h1>                                  
            {barChartHumorTardeData.length > 0 &&            
             <HumorPieChart value={barChartHumorTardeData} />             
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
                Esse grafico mostra quantidade de vezes cada cuidadora cuidou do papai.
            </p>           
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-12">                      
            <h1 className="text-heading">
            Cronograma de Medicamentos
            </h1>
            { medicationTimeline.length > 0 &&
             <TimelineChart value={medicationTimeline} />
            }
          </div>         
        </div>
      </div>
   

    </div>
  )
}



export default Result;