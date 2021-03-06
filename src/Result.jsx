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
import { HashLink as Link } from 'react-router-hash-link';

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


    // Selected Month  filter
    const [selectedMonth, setSelectedMonth] = useState("");


    
  useEffect(()=>{
    fetchNotes();  
    var filteredData = filterByMonth(notes);
    console.log('filtered data', filteredData);
    setNotes(filteredData);
  },[selectedMonth]);
 
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
 
const filterByMonth = (notes) => {
  // Avoid filter for empty string
  if (!selectedMonth) {
    return notes;
  }

  console.log("selected Month", selectedMonth);
  const filteredMonths = notes.filter(
    (item) => (new Date(item.title).getMonth() -1 ) === selectedMonth
  )
  
  return filteredMonths;
};

const handleMonthChange = (event) => {
  const inputMonth = Number(event.target.id);

  console.log("inputMonth", inputMonth);
  console.log("selectedMonth", selectedMonth);
  if (inputMonth === selectedMonth) {
    setSelectedMonth("");
  } 
  else {
    console.log("set select month" , inputMonth);
    setSelectedMonth(inputMonth);
  }
};

  function getMedicationChartData(){
    let remedioTimeLinetDataLocal = [];
    const medications = [
                      {name: "Ass", variations: ["Ass", "ass"]},
                      {name: "Benicar", variations: ["Benicar Anlo 20mg", "Benicar", "Benicard"]},
                      {name: "Canabidiol", variations: ["Canabidiol", "Tetra", "Carmem"]},  
                      {name: "Cocichimil", variations: ["Cocichimil"]},                                     
                      {name: "Donila Duo 10/20", variations: ["donila dua", "Donila Duo 10/20", "Donila Duo 10/20mg", "Donila Duo.", "Donilla Duo", "Donila Duo", "DonilaDuo", "Doniladua", "Donila dua"]}, 
                      {name: "Esc", variations: ["Esc 10 mg", "esc 20mg", "Esc", "Esc 20 mg"]},
                      {name: "Luftal", variations: ["Luftal"]},  
                      {name: "Rivotril", variations: ["Rivotril"]},
                      {name: "Resfenol", variations: ['Resfenol']},
                      {name: "Razapina", variations: ["Razapina", "razapina"]},
                      {name: "Vitamin D", variations: ["vitamina D"]},
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

        
          let sentimentObjectString = JSON.parse(item.sentiment, null, 2);           
          let sentiment_p = sentimentObjectString.predominant;  
          object_remedio.behavior = sentiment_p;  

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
          object_remedio.name = item.title;

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

        if (object_remedio.manha.length > 0 || object_remedio.tarde.length > 0 || object_remedio.noite.length > 0  ){
          remedioTimeLinetDataLocal.push(object_remedio);
        }
        
        
      }

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
   // console.log("lineChartDataLocal", lineChartSentimenttData);
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
    for (var j in res_manha){     
      if ( j ){
      var object1 = {};     
      object1.name = j;
      object1.comportamento = res_manha[j];      
      barChartManhaDataLocal.push(object1);}
    };
    for (var k1 in res_tarde){     
      if ( k1 ){
      var obj = {};     
      obj.name = k1;
      obj.comportamento = res_tarde[k1];      
      barChartTardeDataLocal.push(obj);}
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
    if ( id === '3' || id === 3) return 'Sub';
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
    //console.log("vitals chart Data - saturacao", saturationChartVitalsData);

  }

  return (
    <div className="result">
      <div className="container">
       <h1 className="font-weight-light">An??lise</h1>
        <p>
              Nosso pai tem dem??ncia frontal. Uma doen??a muito triste para ele e para a fam??lia.
              Por amor n??s criamos esse sisterma para poder entender e adaptar as mudancas de humor e oscila????es de comportamento.
        </p>
        <div>
          <div><strong>Reports</strong></div>
          <div className="my-3">            
            <Link to="/result#comporatmentoTag" className="link-primary">An??lise de Comportamento</Link> ||  
            <Link to="/result#humorTag" className="link-primary">An??lise de Humor</Link> ||  
            <Link to="/result#pressureTag" className="link-primary">An??lise de Press??o Arterial</Link> ||  
            <Link to="/result#saturationTag" className="link-primary">An??lise de Satura????o de Oxig??nio</Link>    ||          
            <Link to="/result#temperatureTag" className="link-primary">An??lise de Temperatura Corporal</Link> ||  
            <Link to="/result#medicationTag" className="link-primary">Cronograma de Medicamento</Link> ||  
            <Link to="/result#cuidadorasTag" className="link-primary">Cuidadoras</Link>
          </div>
           <div><strong>Filtro</strong></div>
            <div id="Month-options" onClick={handleMonthChange}>
              <div
                className={selectedMonth === 2 ? "active-option" : "filter-option"}
                id="2"
              >
                February, 2022
              </div>
              <div
                className={selectedMonth === 3 ? "active-option" : "filter-option"}
                id="3"
              >
                March, 2022
              </div>
              <div
                className={selectedMonth === 4 ? "active-option" : "filter-option"}
                id="4"
              >
                April, 2022
              </div>
            </div>

        </div>
        <div className="row align-items-center my-5" id= "humorTag">
          <div className="col-lg-12">                      
            <h1 className="text-heading">
              An??lise de Humor
            </h1>
            {lineChartSentimenttData.length > 0 && 
             <SentimentLineChart value={lineChartSentimenttData}/>
            }
          </div>          
        </div>
      </div>  

      <div className="container" id= "pressureTag">
        <div className="row align-items-center my-5">
          <div className="col-lg-12">                                             
            <h1 className="text-heading">
              An??lise de Press??o Arterial 
            </h1>
            { composedChartVitalsData.length > 0 &&
             <VitalsComposedChart value={composedChartVitalsData} />
             }
                  
          </div>
        </div>
      </div>
      <div className="container" id= "saturationTag">
        <div className="row align-items-center my-5">
          <div className="col-lg-12">                                             
            <h1 className="text-heading">
              An??lise de Satura????o de Oxig??nio ( SpO2% )
            </h1>
            { saturationChartVitalsData.length > 0 &&
             <SaturationLineChart value={saturationChartVitalsData} />
            }
                  
          </div>
        </div>
      </div>
      <div className="container" id= "temperaturTag">
        <div className="row align-items-center my-5">
          <div className="col-lg-12">                                             
            <h1 className="text-heading">
              An??lise de Temperatura Corporal ( &deg;C )
            </h1>
            { temperatureChartVitalsData.length > 0 &&
             <TemperatureLineChart value={temperatureChartVitalsData} />
            }
                  
          </div>
        </div>
      </div>
      

      <div className="container" id= "comporatmentoTag">
        <div className="row align-items-center py-5 my-5">
          <div className="col-lg-6">                      
            <h1 className="text-heading">
              An??lise de Comportamento do dia inteiro
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
              An??lise de Comportamento da Manh??
            </h1>                   
            {barChartHumorManhaData.length > 0 &&
             <HumorPieChart value={barChartHumorManhaData} />             
            }
          </div>   
          <div className="col-lg-6">
            <h1 className="text-heading">
              An??lise de Comportamento da Tarde
            </h1>                                  
            {barChartHumorTardeData.length > 0 &&            
             <HumorPieChart value={barChartHumorTardeData} />             
            }
          </div>       
        </div>
      </div>

      

      <div className="container" id= "cuidadorasTag">
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
       <div className="container" id= "medicationTag">
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