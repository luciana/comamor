/* eslint-disable import/first */
import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import Amplify from 'aws-amplify';
import './App.css';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import getUserMedia from 'get-user-media-promise';
import MicrophoneStream from 'microphone-stream';
import Cookies from 'universal-cookie';
import { FaMicrophone, FaConfluence, FaRegSun, FaSun} from 'react-icons/fa';
/*import { NavLink } from "react-router-dom";*/
Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

function Home() {
  const [textToInterpret, setTextToInterpret] = useState("");
  useEffect(()=>{
    const cookiestored = new Cookies();
    console.log(`stored cookie ${cookiestored.get('comamor_cookie_data')}`);
    const cookie = new Cookies();
    cookie.set('comamor_cookie_data','cookie data',{path: '/'});    
  },[]);

  function SpeechToText(props) {
    const [response] = useState("");
    function AudioRecorder(props) {      
      const [recording, setRecording] = useState(false);
      const [micStream, setMicStream] = useState();
      const [audioBuffer] = useState(
        (function() {
          let buffer = [];
          function add(raw) {
            buffer = buffer.concat(...raw);
            return buffer;
          }
          function newBuffer() {
            console.log("resetting buffer");
            buffer = [];
          }
  
          return {
            reset: function() {
              newBuffer();
            },
            addData: function(raw) {
              return add(raw);
            },
            getData: function() {
              return buffer;
            }
          };
        })()
      );

      async function startRecording() {
        console.log('start recording');
        audioBuffer.reset();
        const micStream = new MicrophoneStream();

        getUserMedia({ video: false, audio: true })
        .then(function(stream) {

          micStream.setStream(stream);          
          micStream.on('data', function(chunk) {
            var raw = MicrophoneStream.toRaw(chunk)
            if (raw == null) {
              return;
            }
            audioBuffer.addData(raw);
          });

          micStream.on('format', function(format) {
            console.log("Mic Stream on format" , format);
          });

          setRecording(true);
          setMicStream(micStream);
          
        });
      }
  
      async function stopRecording() {
        console.log('stop recording');
        const { finishRecording } = props;
  
        micStream.stop();
        setMicStream(null);
        setRecording(false);
  
        const resultBuffer = audioBuffer.getData();
  
        if (typeof finishRecording === "function") {       
          finishRecording(resultBuffer);
        }
      }
  
      return (
        <div className="audioRecorder">
          <div>
            {recording && <button onClick={stopRecording} className="button round white" ><FaMicrophone className="famic recording" /></button>}
            {!recording && <button onClick={startRecording} className="button round white"><FaMicrophone className='famic'/></button>}
          </div>
        </div>
      );
    }
  
    function convertFromBuffer(bytes) {
      setTextToInterpret('Traduzindo audio...');
  
      Predictions.convert({
        transcription: {
          source: {
            bytes
          },
          language: "pt-BR", //other options are "en-GB", "fr-FR", "fr-CA", "es-US"
        },
      }).then(({ transcription: { fullText } }) => setTextToInterpret(fullText))
        .catch(err => setTextToInterpret(JSON.stringify(err, null, 2)))
    }
  
    return (
     
      <div>         
        <AudioRecorder finishRecording={convertFromBuffer} />          
        <span>{response}</span>        
      </div>
    );
  }

  function TextInterpretation() {
    const [response, setResponse] = useState("")
  
  function interpretFromPredictions() {
    Predictions.interpret({
      text: {
        source: {
          text: textToInterpret,
        },
        type: "ALL"
      }
    }).then(result => setResponse(JSON.stringify(result, null, 2)))
      .catch(err => setResponse(JSON.stringify(err, null, 2)))
  }

  function setText(event) {
    console.log("set Text", event.target.value);
    setTextToInterpret(event.target.value);
  }

  return (   
    <div>  
     <div>    
        <div className="inner white curve w-65"> 
          <div className="">Relate os acontecimentos</div>
          <textarea rows="5" cols="35" defaultValue={textToInterpret} onChange={setText}></textarea>          
          <div>
            <button className="button" onClick={interpretFromPredictions}>
            <div>
              <FaConfluence className="faconfluence"/>
              <span>Interpretar o dia</span>
            </div>
          </button>     
          </div>    
        </div>        
      </div>
      <div>{response}</div> 
    </div>
  );
}

function DateDisplay(){
    return (
      <div className="date">
        <span> Hoje: {new Date().toLocaleString()}</span>      
      </div>
    );
}

function RelatorioDoDia(){
  return ( 
    <div className="outer">
      <div className="inner curve white w-75">
       <h2> <FaRegSun className="faregsun"/>  Manhã </h2>
      <label htmlFor="manha-remedios-text">Remédios</label><br />
      <textarea rows="2" cols="35"></textarea> 
      <label htmlFor="manha-refeicao-text">Refeição</label>
      <textarea rows="2" cols="35"></textarea> 
      <label htmlFor="manha-higiene-text">Higiene</label>
      <textarea rows="2" cols="35"></textarea> 
      <label htmlFor="manha-atividade-text">Atividade</label>
      <textarea rows="2" cols="35"></textarea> <br />
      <label htmlFor="manha-humor-select">Qual o comportamento?</label>
        <select name="manha-humor" id="humor-select">
            <option value=""></option>
            <option value="aborrecido">Aborrecido</option>
            <option value="agitado">Agitado</option>
            <option value="agressivo">Agressivo</option>
            <option value="concentrado">Concentrado</option>
            <option value="disperso">Disperso</option>
            <option value="feliz">Feliz</option>   
            <option value="sonolento">Sonolento</option>          
            <option value="tranquilo">Tranquilo</option>
        </select>
      </div>
    </div>   
  );
}

function RelatorioDaTarde() {
  return ( 
   <div className="outer">
      <div className="inner curve white w-75">
       <h2> <FaSun className="fasun"/>  Tarde </h2>
      <label htmlFor="tarde-remedios-text">Remédios</label><br />
      <textarea rows="2" cols="35"></textarea> 
      <label htmlFor="tarde-refeicao-text">Refeição</label>
      <textarea rows="2" cols="35"></textarea> 
      <label htmlFor="tarde-higiene-text">Higiene</label>
      <textarea rows="2" cols="35"></textarea> 
      <label htmlFor="tarde-atividade-text">Atividade</label>
      <textarea rows="2" cols="35"></textarea> <br />
      <label htmlFor="tarde-humor-select">Qual o comportamento?</label>
        <select name="tarde-humor" id="humor-select">
            <option value=""></option>
            <option value="aborrecido">Aborrecido</option>
            <option value="agitado">Agitado</option>
            <option value="agressivo">Agressivo</option>
            <option value="concentrado">Concentrado</option>
            <option value="disperso">Disperso</option>
            <option value="feliz">Feliz</option>   
            <option value="sonolento">Sonolento</option>          
            <option value="tranquilo">Tranquilo</option>
        </select>
      </div>
    </div>
  );
}

function AssistantNames(){
  return (
    <div>
      <p>Cuidadora</p>
      <input type="radio" id="1" name="cuidadora_do_dia" value="1" />
      <label  htmlFor="1">Miriam Sobrenome</label>
      <input type="radio" id="2" name="cuidadora_do_dia" value="2" />
      <label  htmlFor="2">Samira Sobrenome</label>
    </div>
  )
}

function VitalCollection(){
  return (
    <div className="outer">
    <div className="inner curve white highlight w-25">
      <label htmlFor="name" className="block">Pressão Arterial</label>
      <input id="pressao" placeholder="120/80" name="pressao" maxLength="10" size="6"  /> mmHg
    </div>
    <div className="inner curve white highlight w-25">
     <label htmlFor="name" className="block">Saturação</label>
      <input id="saturacao" placeholder="95" name="saturacao" maxLength="10" size="6"  /> SpO<span className="tiny">2%</span>
    </div>
     <div className="inner curve white highlight w-25">
      <label htmlFor="name" className="block">Temperatura</label>
      <input id="temperatura" placeholder="37" name="temperatura" maxLength="10" size="6"  /> &deg;C
      </div> 
    </div>  
  )
}

  return (
    <div className="home">
      <div className="container">
        <div className="row my-5">
          <div className="col-lg-5">
            <div className="App-header">        
                <img src={logo} className="App-logo" alt="logo" /> 
                <h1> Diario do Papai </h1>
                 <DateDisplay />
            </div>

          </div>
          <div className="col-lg-7">
             <AssistantNames />
             <VitalCollection />
             <RelatorioDoDia />
             <RelatorioDaTarde />
             <div>
              <div className="aligned"> {TextInterpretation()} </div> 
              <div className="aligned"> <SpeechToText />  </div>
              </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;