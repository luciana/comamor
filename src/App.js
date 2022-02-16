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

Amplify.configure({
  // To get the AWS Credentials, you need to configure 
  // the Auth module with your Cognito Federated Identity Pool
  "Auth": {
      "identityPoolId": "us-east-1_wRtFXFgdL",
      "region": "us-east-1"
  },
  "predictions": {
      "convert": {         
          "transcription": {
              "region": "us-east-1",
              "proxy": false,
              "defaults": {
                  "language": "en-US"
              }
          }
      },
      "identify": {
          "identifyText": {
              "proxy": false,
              "region": "us-east-1",
              "defaults": {
                  "format": "PLAIN"
              }
          },
          "identifyEntities": {
              "proxy": false,
              "region": "us-east-1",
              "celebrityDetectionEnabled": true,
              "defaults": {
                  "collectionId": "identifyEntities8b89c648-test",
                  "maxEntities": 50
              }
          },
          "identifyLabels": {
              "proxy": false,
              "region": "us-east-1",
              "defaults": {
                  "type": "LABELS"
              }
          }
      },
      "interpret": {
          "interpretText": {
              "region": "us-east-1",
              "proxy": false,
              "defaults": {
                  "type": "ALL"
              }
          }
      }
  }
});

function App() {
  function SpeechToText(props) {
    const [response, setResponse] = useState("");
  
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
          language: "en-US", // other options are "en-GB", "fr-FR", "fr-CA", "es-US"
        },
      }).then(({ transcription: { fullText } }) => setResponse(fullText))
        .catch(err => setResponse(JSON.stringify(err, null, 2)))
    }
    
  
    return (
      <div className="Text">
        <div>
          <h1>Quais as novidades?</h1>
          <AudioRecorder finishRecording={convertFromBuffer} />          
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
    </div>
  );
}

export default App;
