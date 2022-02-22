/* eslint-disable import/first */
import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Amplify, API } from 'aws-amplify';
import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import getUserMedia from 'get-user-media-promise';
import MicrophoneStream from 'microphone-stream';
import Cookies from 'universal-cookie';
import { FaMicrophone, FaRegSun, FaNotesMedical, FaSun, FaUserAlt, FaStar} from 'react-icons/fa';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());
const initialFormState = { title: new Date().toLocaleString(), 
                          patientID: '1',
                          cuidadora_do_dia: null,
                          pressao:'',
                          saturacao: null,
                          temperatura:null,
                          manha_remedios_text: '',
                          manha_refeicao_text: '',
                          manha_higiene_text: '',
                          manha_atividade_text: '',
                          manha_humor_select: '',
                          tarde_remedios_text: '',
                          tarde_refeicao_text: '',
                          tarde_higiene_text: '',
                          tarde_atividade_text: '',
                          tarde_humor_select: '',
                          noite_remedios_text: '',
                          noite_refeicao_text: '',
                          noite_higiene_text: '',
                          noite_atividade_text: '',
                          noite_humor_select: '',
                          acontecimentos:'',
                          sentiment_predominant: '',
                          sentiment: ''}
function Home() {
  const [textToInterpret, setTextToInterpret] = useState("");
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [comportamentoType, setComportamentoType] = useState([{ label: "Loading ...", value: "" }]);
  const [loading, setLoading] = React.useState(true);
  const [sentimentResponse, setSentimentResponse] = useState("")
  const [errors, setErrors] = useState([]);
  
  
  useEffect(()=>{
    let unmounted = false;

    /* Save cookie data */
    const cookiestored = new Cookies();
    console.log(`stored cookie ${cookiestored.get('comamor_cookie_data')}`);
    const cookie = new Cookies();
    cookie.set('comamor_cookie_data','cookie data',{path: '/'});    

    /* Get Notes information from GraphQL db ( AWS AppSync )*/
    fetchNotes();

    /* Get ComportamentoType from an URL ( future )*/
    
    async function getcomportamentoType() {
      /* const response = await fetch("<api_url_to_get_comportamentoType>"); */
      /*const body = await response.json();*/
      const body = [  { name: '' },
                      { name: "Aborrecido"},
                      { name: "Agitado" },
                      { name: "Agressivo" },
                      { name: "Concentrado"},
                      { name: "Disperso" },
                      { name: "Feliz"},
                      { name: "Sonolento" },
                      { name: "Tranquilo" }];
      if (!unmounted) {
        setComportamentoType(body.map(({ name }) => ({ label: name, value: name })));
        setLoading(false);
      }
    }

    getcomportamentoType();
    return () => {
      unmounted = true;
    };
  },[]);


   function handleSubmit(e) {
    
      if (e.target.checkValidity()) {
          e.preventDefault()
          console.log("form data", formData);
        } else {
          console.log("form data not valid");
          e.preDefault()
          e.stopPropagation()
      }

  }

  async function fetchNotes() {
    try{
      const apiData = await API.graphql({ query: listNotes });
      setNotes(apiData.data.listNotes.items);
     } catch (err) {setErrors(err.errors[0].message );}
  }

   async function createNote() {
    if (!formData.cuidadora_do_dia ) {setErrors("Por favor, selecione uma cuidadora");return; }
    if (!formData.pressao ) {setErrors("Por favor, anote a pressão arterial do paciente");return; }
    if (!formData.saturacao ) {setErrors("Por favor, anote a saturação de oxigênio do paciente");return; }
    if (!formData.temperatura ) {setErrors("Por favor, anote a temperatura corporal do paciente");return; }
    if (!formData.manha_humor_select ) {setErrors("Por favor, selecione como o paciente se comportou durante a manhã?");return; }
    if (!formData.tarde_humor_select ) {setErrors("Por favor, selecione como o paciente se comportou durante a tarde?");return; }
    if (!formData.noite_humor_select ) {setErrors("Por favor, selecione como o paciente se comportou durante a noite?");return; }
    if (!formData.manha_atividade_text && 
          !formData.manha_higiene_text && 
          !formData.manha_remedios_text &&         
          !formData.manha_refeicao_text ) {setErrors("Precisamos de mais informação no turno da manhã");return; }
     if (!formData.tarde_atividade_text && 
          !formData.tarde_higiene_text && 
          !formData.tarde_remedios_text &&
          !formData.tarde_refeicao_text ) {setErrors("Precisamos de mais informação no turno da tarde");return; }
     if (!formData.noite_atividade_text && 
          !formData.noite_higiene_text && 
          !formData.noite_remedios_text &&
          !formData.noite_refeicao_text ) {setErrors("Precisamos de mais informação no turno da noite");return; }
    
      setErrors([]);
      try{
        await API.graphql({ query: createNoteMutation, variables: { input: formData } });
        setNotes([ ...notes, formData ]);
        setFormData(initialFormState);
      } catch (err) {setErrors(err.errors[0].message );
      } finally { setFormData(initialFormState); }
  }

  async function deleteNote({ id }) {
    try{
      const newNotesArray = notes.filter(note => note.id !== id);
      setNotes(newNotesArray);
      await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
    } catch (err) {setErrors(err.errors[0].message );}
  }


  function ShowSaveNoteButton(){
    return(
      <div className="py-1">
        <button className="btn btn-success" onClick={interpretFromPredictions}>Salvar anotações do dia</button>

        <div>           
          {errors.length > 0 &&                 
            <div className="py-1 my-2 alert alert-danger alert-dismissible fade show">
              <strong>Erro!</strong> {errors}
              <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
            </div>
          } 
        </div>
        
      </div>
    );
  }
  function ShowNotes(){
     return (                     
          <div className="my-5 container outer">
              <h2> Histórico de Anotações </h2>              
              <div className="row inner curve white" >
                  <div className="row strong">
                  <div className="col-md-3 text font-weight-bold">Dia</div>
                  <div className="col-sm text font-weight-bold">Cuidadora</div>
                  <div className="col-sm text font-weight-bold ">Em Geral</div>
                  <div className="col-sm text font-weight-bold">Pressão</div>
                  <div className="col-sm text font-weight-bold">Saturação</div>
                  <div className="col-sm text font-weight-bold">Temperatura</div>  
                   <div className="col-sm text font-weight-bold"></div>  
                </div>        
                {notes.map(note => ( 
                  <div className="row" key={note.id || note.title}>
                  <div className="col-md-3 text">{note.title}</div>
                  <div className="col-sm text">{note.cuidadora_do_dia}</div>
                  <div className="col-sm text">{note.sentiment_predominant}</div>
                  <div className="col-sm text">{note.pressao}</div>
                  <div className="col-sm text">{note.saturacao}</div>
                  <div className="col-sm text">{note.temperatura}</div>
                  <div className="col-sm text"><button onClick={() => deleteNote(note)}>Deletar nota</button>  </div>
                  </div>             
                ))}
              </div>
            </div>
        
      );
  }

  function Login(){

    return (
     <Authenticator>
          {({ signOut, user }) => (
            <div className="container">
              <span className="text"> Olá {user.username}, seja bem vinda(o)!</span>
              <button onClick={signOut}>Sair</button>
            </div>
          )}
      </Authenticator>
    );
  }

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
            {recording && <button name="stop recording" onClick={stopRecording} className="button round white" ><FaMicrophone className="famic recording" /></button>}
            {!recording && <button name="start recording"  onClick={startRecording} className="button round white"><FaMicrophone className='famic'/></button>}
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



  
  function interpretFromPredictions() {
      let dataToSentiment = formData.manha_atividade_text + ' ' +                                                       
                            formData.manha_higiene_text + ' ' +
                            formData.manha_atividade_text + ' ' +
                            formData.manha_humor_select + ' ' +                                                   
                            formData.tarde_higiene_text + ' ' +
                            formData.tarde_atividade_text + ' ' +
                            formData.tarde_humor_select + ' ' +                           
                            formData.noite_higiene_text + ' ' +
                            formData.noite_atividade_text + ' ' +
                            formData.noite_humor_select + ' ' +
                            formData.acontecimentos;
      console.log("Data to analyze sentiment ", dataToSentiment);
      Predictions.interpret({
        text: {
          source: {
            text: dataToSentiment,
          },
          type: "ALL"
        }
      }).then(result => {
             setSentimentFormFields(JSON.stringify(result, null, 2))
             createNote()
      })
     
        .catch(err => setSentimentResponse(JSON.stringify(err, null, 2)))
  }

  function setSentimentFormFields(data){          
      let s = JSON.parse(data);     
      let sentiment = s.textInterpretation.sentiment;      
      let sentiment_value = JSON.stringify(sentiment, null, 2);
      console.log("sentiment_value",sentiment_value);
      let sentiment_p = sentiment.predominant;     
      setFormData({ ...formData, 'sentiment': sentiment_value});
      setFormData({ ...formData, 'sentiment_predominant': sentiment_p});
      setSentimentResponse(sentiment_p);
      return(
          <div>
            <input type="hidden"  value={sentiment_value} name="sentiment" id="sentiment" readOnly  />
            <input type="hidden"  value={sentiment_p} name="sentiment_predominant" id="sentiment_predominant" readOnly  />
          </div>
      );

  }


  function TextInterpretation() {
    function setText(event) {
      console.log("set Text", event.target.value);
      setTextToInterpret(event.target.value);
      setFormData({ ...formData, 'acontecimentos': event.target.value});
    }

    return (   
      <div>  
      <div className="outer">    
          <div className="inner white curve">           
            <label htmlFor="acontecimentos">Relate os acontecimentos</label><br />
            <textarea id="acontecimentos" 
                      className="form-control" rows="5" cols="35" 
                      defaultValue={textToInterpret} 
                      onChange={setText}></textarea>          
               
          </div>        
        </div>
        <div>{sentimentResponse}</div> 
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
        <div className="inner curve white">
        <h3> <FaRegSun className="faregsun"/>  Manhã </h3>
        <label htmlFor="manha_remedios_text">Remédios</label><br />
        <textarea id="manha_remedios_text" 
                  className="form-control" rows="2" cols="35"
                  value={formData.manha_remedios_text}                
                  onChange={e => setFormData({ ...formData, 'manha_remedios_text': e.target.value})}     
                  ></textarea> 
        <label htmlFor="manha_refeicao_text">Refeição</label>
        <textarea id="manha_refeicao_text" 
                  className="form-control" rows="2" cols="35"
                  value={formData.manha_refeicao_text}
                  onChange={e => setFormData({ ...formData, 'manha_refeicao_text': e.target.value})} 
                  ></textarea> 
        <label htmlFor="manha_higiene_text">Higiene</label>
        <textarea id="manha_higiene_text"
                  className="form-control" rows="2" cols="35"
                  value={formData.manha_higiene_text}
                  onChange={e => setFormData({ ...formData, 'manha_higiene_text': e.target.value})} 
                  ></textarea> 
        <label htmlFor="manha_atividade_text">Atividade</label>
        <textarea id="manha_atividade_text"
                    className="form-control" rows="2" cols="35"
                    value={formData.manha_atividade_text}
                    onChange={e => setFormData({ ...formData, 'manha_atividade_text': e.target.value})} 
                    ></textarea> <br />
        <div className="form-group was-validated">
          <label htmlFor="manha_humor_select">Qual o comportamento?</label>
          <select disabled={loading}
                  className="form-control" 
                  name="manha_humor_select" 
                  id="manha_humor_select"    
                  required="required"         
                  onChange={e => setFormData({ ...formData, 'manha_humor_select': e.target.value})}                
                  >               
                  {comportamentoType.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}     
          </select>
        </div>
        </div>
      </div>   
    );
  }

  function RelatorioDaTarde() {
    return ( 
    <div className="outer">
        <div className="inner curve white">
        <h3> <FaSun className="fasun"/>  Tarde </h3>
        <label htmlFor="tarde_remedios_text">Remédios</label><br />
        <textarea id="tarde_remedios_text" 
                  className="form-control" rows="2" cols="35"
                  value={formData.tarde_remedios_text}
                  onChange={e => setFormData({ ...formData, 'tarde_remedios_text': e.target.value})} 
                  ></textarea> 
        <label htmlFor="tarde_refeicao_text">Refeição</label>
        <textarea id="tarde_refeicao_text" 
                  className="form-control" rows="2" cols="35"
                  value={formData.tarde_refeicao_text}
                  onChange={e => setFormData({ ...formData, 'tarde_refeicao_text': e.target.value})} 
                  ></textarea> 
        <label htmlFor="tarde_higiene_text">Higiene</label>
        <textarea id="tarde_higiene_text" 
                  className="form-control" rows="2" cols="35"
                  value={formData.tarde_higiene_text}
                  onChange={e => setFormData({ ...formData, 'tarde_higiene_text': e.target.value})} 
                  ></textarea> 
        <label htmlFor="tarde_atividade_text">Atividade</label>
        <textarea id="tarde_atividade_text" 
                  className="form-control" rows="2" cols="35"
                  value={formData.tarde_atividade_text}
                  onChange={e => setFormData({ ...formData, 'tarde_atividade_text': e.target.value})} 
                  ></textarea> <br />
        <div className="form-group was-validated">
          <label htmlFor="tarde_humor_select">Qual o comportamento?</label>
          <select className="form-control" 
                  name="tarde_humor_select" 
                  id="tarde_humor_select"
                  required="required"  
                  onChange={e => setFormData({ ...formData, 'tarde_humor_select': e.target.value})}                
                  >               
                  {comportamentoType.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}     
          </select>
        </div>
        </div>
      </div>
    );
  }

  function RelatorioDaNoite() {
    return ( 
    <div className="outer">
        <div className="inner curve white">
        <h3> <FaStar className="fastar"/>  Noite </h3>
        <div className="form-group">
        <label htmlFor="noite_remedios_text">Remédios</label><br />
        <textarea id="noite_remedios_text" 
                  className="form-control"  rows="2" cols="35"
                  value={formData.noite_remedios_text}
                  onChange={e => setFormData({ ...formData, 'noite_remedios_text': e.target.value})} 
                  ></textarea> 
        <label htmlFor="noite_refeicao_text">Refeição</label>
        <textarea id="noite_refeicao_text"  
                  className="form-control" rows="2" cols="35"
                  value={formData.noite_refeicao_text}
                  onChange={e => setFormData({ ...formData, 'noite_refeicao_text': e.target.value})} 
                  ></textarea> 
        <label htmlFor="noite_higiene_text">Higiene</label>
        <textarea id="noite_higiene_text" 
                  className="form-control"  rows="2" cols="35"
                  value={formData.noite_higiene_text}
                  onChange={e => setFormData({ ...formData, 'noite_higiene_text': e.target.value})} 
                  ></textarea> 
        <label htmlFor="noite_atividade_text">Atividade</label>
        <textarea id="noite_atividade_text"  
                  className="form-control" rows="2" cols="35"
                  value={formData.noite_atividade_text}
                  onChange={e => setFormData({ ...formData, 'noite_atividade_text': e.target.value})} 
                  ></textarea> <br />
        <div className="form-group was-validated">
          <label htmlFor="noite_humor_select">Qual o comportamento?</label>
          <select className="form-control" 
                  name="noite_humor_select" 
                  id="noite_humor_select"
                  required="required"  
                  onChange={e => setFormData({ ...formData, 'noite_humor_select': e.target.value})}                
                  >               
                  {comportamentoType.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))} 
          </select>
          </div>
        </div>
        </div>
      </div>
    );
  }

  function AssistantNames(){
    return (
      <div className="outer">
        <div className="inner curve white">
        <h3> <FaUserAlt className="fauseralt"/>  Cuidadoras </h3>
        <div className="form-group was-validated">
        <div className="form-check form-check-inline">       
          <input className="form-check-input"  
                type="radio"  
                name="cuidadora_do_dia" 
                value="1"     
                required="required"            
                onChange={e => setFormData({ ...formData, 'cuidadora_do_dia': e.target.value})} 
                />
          <label  className="form-check-label" htmlFor="1"> Miriam Sobrenome</label>
        </div>
        <div className="form-check form-check-inline">       
          <input className="form-check-input"  
                type="radio"  
                name="cuidadora_do_dia" 
                value="2"
                required="required"     
                onChange={e => setFormData({ ...formData, 'cuidadora_do_dia': e.target.value})} />
          <label  className="form-check-label" htmlFor="2"> Samira Sobrenome</label>
        </div>
        </div>
      </div>
      </div>
    )
  }

  function VitalCollection(){
    return (

      <div className="outer">
        <div className="inner curve white">
          <h3> <FaNotesMedical className="fanotesmedical"/>  Sinais Vitais </h3>
          <div className="form-group was-validated">
          <label htmlFor="pressao" className="block">Pressão Arterial ( mmHg )</label>
          <input className="form-control" 
                  id="pressao"                 
                  placeholder="120/80"    
                  required="required"            
                  defaultValue={formData.pressao}                 
                  name="pressao" maxLength="10" size="6"
                  onChange={e => setFormData({ ...formData, 'pressao': e.target.value})}  />
          <label className="block" htmlFor="saturacao" >Saturação (SpO<span className="tiny">2%</span> )</label>
          <input className="form-control" 
                  id="saturacao"                 
                  placeholder="95" name="saturacao" maxLength="10" size="6"
                  defaultValue={formData.saturacao}                 
                  required="required"     
                  onChange={e => setFormData({ ...formData, 'saturacao': e.target.value})}  />
          <label className="block" htmlFor="name">Temperatura (&deg;C)</label>
          <input className="form-control" 
                  id="temperatura"                 
                  placeholder="37" 
                  required="required"     
                  name="temperatura" maxLength="10" size="6"  
                  defaultValue={formData.temperatura}
                  onChange={e => setFormData({ ...formData, 'temperatura': e.target.value})}  /> 
          </div>
        </div> 
      </div>  
    )
  }

  function DataForm(){
    return (
      <form className="" onSubmit={handleSubmit} >     
        <input type="hidden" value='1' name="patientID" id="patientID" readOnly />   
        <input type="hidden"  value={new Date().toLocaleString()} name="title" id="title" readOnly  />
                <div> {AssistantNames()} </div> 
                <div> {VitalCollection()} </div>          
                <div> {RelatorioDoDia()} </div>
                <div> {RelatorioDaTarde()} </div>
                <div> {RelatorioDaNoite()} </div>
              <div>
                <div className="aligned"> {TextInterpretation()} </div> 
                <div className="aligned"> <SpeechToText />  </div>
                </div>            
              <ShowSaveNoteButton />
        </form>
    );
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
            <Login />
            <div> {DataForm()} </div>             
          </div>
        </div>
         <ShowNotes />
      </div>
    </div>
  );
}

export default withAuthenticator(Home);