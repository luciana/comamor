import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import getUserMedia from 'get-user-media-promise';
import MicrophoneStream from 'microphone-stream';
import { FaMicrophone} from 'react-icons/fa';
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
            {recording && <button onClick={stopRecording} className="button round" ><FaMicrophone className="mic recording" /></button>}
            {!recording && <button onClick={startRecording} className="button round"><FaMicrophone className='mic'/></button>}
          </div>
        </div>
      );
    }
  
    function convertFromBuffer(bytes) {
      console.log('converting text');
      setTextToInterpret('Converting text...');
  
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
          <h1>Como foi o dia hoje?</h1>
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
    setTextToInterpret(event.target.value);
  }

  return (
    <div className="Text">
      <div>       
        {/*<textarea rows="4" cols="50" value={textToInterpret} onChange={setText}></textarea> */}
        <textarea rows="4" cols="50" defaultValue={textToInterpret} onChange={setText}></textarea>
      </div>
      <div>
        <button onClick={interpretFromPredictions}>Interpreta o dia</button>      
      </div>
      <div>   <p>{response}</p> </div>
    </div>
  );
}

function DateDisplay(){
    return (
      <div className="date">
        <p> {new Date().toLocaleString()}</p>      
      </div>
    );
}

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" /> 
      </header>
      <section>
      <DateDisplay />
      </section>
      <section>     
      <SpeechToText />    
      </section>
      <section>
      <TextInterpretation />
      </section>
    </div>
  );
}

export default App;
