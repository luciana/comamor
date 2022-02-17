import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import getUserMedia from 'get-user-media-promise';
import MicrophoneStream from 'microphone-stream';
import { FaMicrophone, FaConfluence, FaUserAlt} from 'react-icons/fa';
Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

function App() {

const [textToInterpret, setTextToInterpret] = useState("");

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
          language: "pt-BR", // other options are "en-GB", "fr-FR", "fr-CA", "es-US"
        },
      }).then(({ transcription: { fullText } }) => setTextToInterpret(fullText))
        .catch(err => setTextToInterpret(JSON.stringify(err, null, 2)))
    }
  
    return (
      <div className="Text">
        <div>         
          <AudioRecorder finishRecording={convertFromBuffer} />          
          <p>{response}</p>        
        </div>
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
    <div className="text">            
        <div className="inner white curve"> 
          <div className="text">Como foi o dia hoje?</div>
          <textarea rows="6" cols="35" defaultValue={textToInterpret} onChange={setText}></textarea>  
        </div>           
         <div className="block"> 
          <button className="button" onClick={interpretFromPredictions}>
          <div>
            <FaConfluence className="faconfluence"/>
            <span>Interpreta o humor do dia</span>
          </div>
          </button>      
        </div>  
       <div> <p>{response}</p></div>  
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

function AssistantNames(){
  return (
    <div className="outer">
    <div className="inner">
      <button className="button curve user">
            <div>
              <FaUserAlt className="fauser"/>
              <span>Miriam Sobrenome</span>
            </div>
      </button> 
    </div>
     <div className="inner">
      <button className="button curve user">
            <div>
              <FaUserAlt className="fauser"/>
              <span>Samira Sobrenome</span>
            </div>
      </button> 
      </div> 
    </div>  
  )
}

function VitalCollection(){
  return (
    <div className="outer">
    <div className="inner curve white highlight">
      <label htmlFor="name" className="block">Pressão Arterial</label>
      <input id="pressao" placeholder="120/80" name="pressao" maxLength="10" size="6"  /> mmHg
    </div>
    <div className="inner curve white highlight">
     <label htmlFor="name" className="block">Saturação</label>
      <input id="saturacao" placeholder="95" name="saturacao" maxLength="10" size="6"  /> SpO<span className="tiny">2%</span>
    </div>
     <div className="inner curve white highlight">
      <label htmlFor="name" className="block">Temperatura</label>
      <input id="temperatura" placeholder="37" name="temperatura" maxLength="10" size="6"  /> &deg;C
      </div> 
    </div>  
  )
}
  return (
    <div className="App">
      <header className="App-header">        
        <img src={logo} className="App-logo" alt="logo" /> 
        <h1> Diario do Papai </h1>
      </header>
      <section>
      <DateDisplay />
      </section>
      <section>
      <AssistantNames />
      </section>
      <section>
      <VitalCollection />
      </section>
      <section>  

      <div className="">
        <div className="aligned"> {TextInterpretation()} </div> 
        <div className="aligned"> <SpeechToText />  </div>
        </div>
      </section>
    </div>
  );
}

export default App;
