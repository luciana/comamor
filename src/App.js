import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import getUserMedia from 'get-user-media-promise';
import MicrophoneStream from 'microphone-stream';
Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

function App() {
  function SpeechToText(props) {
    const [response, setResponse] = useState("");
    const [sentiment, setSentiment] = useState("");
   

    function AudioRecorder(props) {
      console.log("Audio Recorder", props);
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
          console.log('finishRecording function', resultBuffer);
          finishRecording(resultBuffer);
        }
      }
  
      return (
        <div className="audioRecorder">
          <div>
            {recording && <button onClick={stopRecording}>Stop recording</button>}
            {!recording && <button onClick={startRecording}>Start recording</button>}
          </div>
        </div>
      );
    }
  
    function convertFromBuffer(bytes) {
      console.log('converting text');
      setResponse('Converting text...');
  
      Predictions.convert({
        transcription: {
          source: {
            bytes
          },
          language: "pt-BR", // other options are "en-GB", "fr-FR", "fr-CA", "es-US"
        },
      }).then(({ transcription: { fullText } }) => setResponse(fullText))
        .catch(err => setResponse(JSON.stringify(err, null, 2)))
    }
    


    function AnalyzeSentiment(props){

      async function analizeMessage(){
           console.log('start analizing message');
            const { finishAnalyzing } = props;  

             const message = response;
             
            if (typeof finishAnalyzing === "function") {             
              finishAnalyzing(message);
            } 
                                
      };

       return (
        <div className="sentimentAnalysis">
          <div>
            {response && <button onClick={analizeMessage}>Como foi o seu dia</button>}           
          </div>
        </div>
      );
    }
 
    function convertToSentiment(textToInterpret){
       console.log('start interpreting message', textToInterpret);
      const textToInterpret1 = "Great day";
      Predictions.interpret({
        text: {
          source: {
            text: textToInterpret1,
          },
          type: "ALL"
        }
      })
      .then(result => setSentiment( result ))
      .catch(err => setSentiment(JSON.stringify(err, null, 2)))
    };
  
    return (
      <div className="Text">
        <div>
          <h1>Quais as novidades?</h1>
          <AudioRecorder finishRecording={convertFromBuffer} />          
          <p>{response}</p>
          <AnalyzeSentiment finishAnalyzing={convertToSentiment} />   
        </div>
      </div>
    );
  }

function TextInterpretation() {
  const [response, setResponse] = useState("Input some text and click enter to test")
  const [textToInterpret, setTextToInterpret] = useState("write some text here to interpret");

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
        <h3>Text interpretation</h3>
        <input value={textToInterpret} onChange={setText}></input>
        <button onClick={interpretFromPredictions}>test</button>
        <p>{response}</p>
      </div>
    </div>
  );
}

  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" /> 
      </header>
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
