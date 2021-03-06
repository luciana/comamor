/* eslint-disable import/first */
import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import {Modal, Button} from 'react-bootstrap';
import { Amplify, API, I18n } from 'aws-amplify';
import AmplifyI18n from "amplify-i18n"
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import './styles/authenticate.css';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';
import getUserMedia from 'get-user-media-promise';
import MicrophoneStream from 'microphone-stream';
import { FaMicrophone, FaCalendarAlt, FaRegSun, FaNotesMedical, FaSun, FaUserAlt, FaStar} from 'react-icons/fa';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation, updateNote as updateNoteMutation } from './graphql/mutations';
import { Translations } from "@aws-amplify/ui-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

Amplify.configure(awsconfig);
//Amplify.addPluggable(new AmazonAIPredictionsProvider());
const locales = ["en", "pt-BR"]
AmplifyI18n.configure(locales)
I18n.setLanguage('pt-BR');

/*https://github.com/aws-amplify/amplify-js/blob/main/packages/amplify-ui-components/src/common/Translations.ts*/
I18n.putVocabulariesForLanguage("pt-BR", {
  'Confirm Password': 'Confirmar Senha',
  'User does not exist.': 'Essa conta não existe.',
  'Incorrect username or password.': 'Email e senha incorretos.',
  [Translations.SIGN_IN_TEXT]: "Entre",
  [Translations.SIGN_IN_HEADER_TEXT]: "Entre na sua conta",
  [Translations.SIGN_IN_ACTION]: 'Entrar',
  [Translations.FORGOT_PASSWORD_TEXT]: 'Esqueci a senha',
  [Translations.EMPTY_USERNAME]: "A valid email address must be provided",
  [Translations.CREATE_ACCOUNT_TEXT]:'Crie uma conta',
  [Translations.SIGN_UP_PASSWORD_PLACEHOLDER]: 'Senha',
  [Translations.SIGN_UP_SUBMIT_BUTTON_TEXT]:'Criar conta',
  [Translations.SIGN_OUT]: 'Sair',
  [Translations.SEND_CODE]: 'Mandar Codigo',
  [Translations.CONFIRM_SIGN_UP_RESEND_CODE]: 'Mandar Codigo novament',
  [Translations.EMAIL_PLACEHOLDER]:'Seu endereço de email'
});

const initialFormState = { 
                          title: new Date().toLocaleString(), 
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
                          sentiment: '',
                          author: ''}


function Entry() {
  const [textToInterpret, setTextToInterpret] = useState("");
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  console.log('form initial state', formData);
  const [comportamentoType, setComportamentoType] = useState([{ label: "Loading ...", value: "" }]);
  const [loading, setLoading] = useState(true);
  const [sentiment, setSentiment] = useState("")
  const [sentimentObject, setSentimentObject] = useState("")
  const [errors, setErrors] = useState([]);
  const [show, setShow] = useState("");
  const [showNote, setShowNote] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShowNote = () => setShowNote(true); 
  const handleCloseNote = () => setShowNote(false);
  const acontecimentoField = useRef(null)
  const [author, setAuthor] = useState(null);
  const [noteID, setNoteID] = useState(null);
  function handleFocus(){ acontecimentoField.current.focus()}
  const [startDate, setStartDate] = useState(new Date());

  useEffect(()=>{
    let unmounted = false;

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


  function isEditing(){
    return notes.findIndex(i => i.id === noteID) > 0
  }

  function nomeDaCuidadora(id){
      if ( id === '1' || id === 1 ) return 'Mirian';
      if ( id === '2' || id === 2) return 'Samira';
      if ( id === '3' || id === 3) return 'Sub';
  }

  function handleSubmit(e) {  
      console.log("handleSubmit");
      if (e.target.checkValidity()) {
          e.preventDefault()
          console.log("form data from form submit", formData);               
          if(!isEditing()){
            console.log("CREATE NOTE");
            createNote();
          }else{
            console.log("UPDATE NOTE");
            const noteSelected = notes[notes.findIndex(i => i.id === noteID)]
            console.log('note to be updated' , noteSelected);
            if (noteSelected){
                updateNote(noteSelected);  
            }
          }
          
        } else {
          console.log("form data not valid", formData);
          setErrors(formData);
          e.preDefault()
          e.stopPropagation()
      }
  }
  
  function handleChange(e){
    e.persist();   
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if ( !!errors ) { setErrors([]);}
  };

  function handleDateChange(date){
    console.log('date', date.toLocaleString());
    setStartDate(date);
    setFormData({ ...formData, 'title': date.toLocaleString() });
    if ( !!errors ) { setErrors([]);}
   
  }


  async function fetchNotes() {
    try{
      const apiData = await API.graphql({ query: listNotes });
      setNotes(apiData.data.listNotes.items);
     } catch (err) {
       console.log("ERROR: Fetching Notes")
       setErrors(err.errors[0].message );
       }
  }

   async function createNote() {
      if (formValidation() !== 0 ) { return; }
      console.log("create note with this form data", formData);
      try{
        const createdNote = await API.graphql({ query: createNoteMutation, variables: { input: formData } });
       /* console.log("created new note", createdNote.data.createNote);*/
        setNotes([ ...notes, createdNote.data.createNote ]);             
        /*console.log("NOTE ID after creation" , createdNote.data.createNote.id);*/
        setNoteID(createdNote.data.createNote.id);
      
      }catch (err) {
        console.log("ERROR: creating notes", err);
        if(err.errors){
          if(err.errors[0]){
              console.log("ERROR: creating notes", err.errors[0]);
              if(err.errors[0].message) setErrors(err.errors[0].message );              
          }   
        }else{
          console.log("ERROR: creating notes", err);
          setErrors(err);
        }      
      } finally { 
        handleClose(); 
      }
  }

  async function deleteNote({ id }) {
    try{
      const newNotesArray = notes.filter(note => note.id !== id);
      setNotes(newNotesArray);
      await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
    } catch (err) {
      console.log("ERROR: deleting notes", err);
       if(err.errors[0]){
          console.log("ERROR: deleting notes", err.errors[0]);
          if(err.errors[0].message) setErrors(err.errors[0].message );              
        }
      }
  }

  async function openNote(note){
    
    console.log("open this note", note);
    console.log("show modal", showNote);
    handleShowNote();

    return(
       <div>          
          <Modal show={showNote} 
                onHide={handleClose} 
                animation={false}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
              <h3 className="modal-header text-dark">Resumo de Anotações</h3>
              <div className="modal-body">
              
              <p className="text-dark text-bold"> Cuidadora do dia: {nomeDaCuidadora(note.cuidadora_do_dia)}</p>
              <h4 className="text-dark">Sinais Vitais</h4>
              <p className="text-dark"> Pressão Arterial: {note.pressao} mmHg</p>   
              <p className="text-dark"> Saturação: {note.saturacao} SpO2%</p>   
              <p className="text-dark"> Temperatura: {note.temperatura} &deg;C </p>   

              <h4 className="text-dark">Pela Manhã</h4>
              <p className="text-dark"> Remedios: {note.manha_remedios_text}</p>   
              <p className="text-dark"> Refeição: {note.manha_refeicao_text}</p>   
              <p className="text-dark"> Higiene: {note.manha_higiene_text} </p>  
              <p className="text-dark"> Atividade: {note.manha_atividade_text}</p> 
              <p className="text-dark"> Comportamento: {note.manha_humor_select}</p> 

              <h4 className="text-dark">A Tarde</h4>
              <p className="text-dark"> Remedios: {note.tarde_remedios_text}</p>   
              <p className="text-dark"> Refeição: {note.tarde_refeicao_text}</p>   
              <p className="text-dark"> Higiene: {note.tarde_higiene_text} </p>  
              <p className="text-dark"> Atividade: {note.tarde_atividade_text}</p> 
              <p className="text-dark"> Comportamento: {note.tarde_humor_select}</p> 

              <h4 className="text-dark">A Noite</h4>
              <p className="text-dark"> Remedios: {note.noite_remedios_text}</p>   
              <p className="text-dark"> Refeição: {note.noite_refeicao_text}</p>   
              <p className="text-dark"> Higiene: {note.noite_higiene_text} </p>  
              <p className="text-dark"> Atividade: {note.noite_atividade_text}</p> 
              <p className="text-dark"> Comportamento: {note.noite_humor_select}</p> 

              <div className="text-dark"> 
                <span className="text-bold"> Outras observações: </span> 
                <span>{note.acontecimentos}</span> 
              </div>

              <p className="text-dark"> Em conclusão, o paciente teve um dia <span>{sentiment} </span></p>                      

              <div className="py-2 text-dark"> De autoria de <span className="text-dark"> {author} </span></div>

             

              </div>
               <div className="modal-footer">
                <Button variant="secondary" onClick={handleCloseNote}>Cancelar</Button>            
               </div>
           
          </Modal>
        </div>

    );
  }
  async function selectNote(note){
      const id = note.id;

      if(id){           
        const index = notes.findIndex(i => i.id === note.id)
        const notes1 = [...notes]     
        delete  notes1[index].patient;
        delete  notes1[index].comments;
        delete notes1[index].createdAt;
        delete notes1[index].updatedAt
        console.log(" notes1", notes1);
        setNotes( notes1 )  
        console.log('selected note', notes1);    
        const thenote= notes1[index];     
        setNoteID(thenote.id);
        setTextToInterpret(thenote.acontecimentos);
        setStartDate(Date.parse(thenote.title))
        setFormData({ title: thenote.title, 
                        patientID: 1,
                        cuidadora_do_dia: thenote.cuidadora_do_dia,
                        pressao:thenote.pressao,
                        saturacao: thenote.saturacao,
                        temperatura:thenote.temperatura,
                        manha_remedios_text: thenote.manha_remedios_text,
                        manha_refeicao_text: thenote.manha_refeicao_text,
                        manha_higiene_text: thenote.manha_higiene_text,
                        manha_atividade_text: thenote.manha_atividade_text,
                        manha_humor_select: thenote.manha_humor_select,
                        tarde_remedios_text: thenote.tarde_remedios_text,
                        tarde_refeicao_text: thenote.tarde_refeicao_text,
                        tarde_higiene_text: thenote.tarde_higiene_text,
                        tarde_atividade_text: thenote.tarde_atividade_text,
                        tarde_humor_select: thenote.tarde_humor_select,
                        noite_remedios_text: thenote.noite_remedios_text,
                        noite_refeicao_text: thenote.noite_refeicao_text,
                        noite_higiene_text: thenote.noite_higiene_text,
                        noite_atividade_text: thenote.noite_atividade_text,
                        noite_humor_select: thenote.noite_humor_select,
                        acontecimentos:thenote.acontecimentos,                         
                        sentiment: thenote.sentimen
                       } );
      }
  }

   async function updateNote( note ) {
    console.log("note from updateNote", note  );
   
    try{
      const index = notes.findIndex(i => i.id === note.id)
      console.log("index of note to be updatd", index);
      const notes1 = [...notes]
      // delete  notes1[index].patient;
      // delete  notes1[index].comments;
      // delete notes1[index].createdAt;
      // delete notes1[index].updatedAt;
      console.log("retrieved note to be updated", notes1[index]);
      let noteToBeUpdated = formData;
      noteToBeUpdated.id = notes1[index].id;
      setFormData(noteToBeUpdated);
    
      console.log("note to be updated", noteToBeUpdated);  
      await API.graphql({ query: updateNoteMutation, variables: { input:  noteToBeUpdated }});
      alert("Anotações salvas");
    } catch (err) {
      console.log("ERROR: updating notes", err);
      alert("Houve um problem editando esta note. Por favor comunique ao administrador.")
      if(err.errors){
       if(err.errors[0]){
          console.log("ERROR: updating notes", err.errors[0]);
          if(err.errors[0].message) setErrors(err.errors[0].message );              
        }
      }else{
        console.log("ERROR: updating notes", err);
        setErrors(err);
      }
    } finally { 
        handleClose(); 
      }
  }


  
 
  function ShowSaveNoteButton(){
    function interpretFromPredictions(event) {
          event.preventDefault();
          if (formValidation() !== 0 ) { return; }
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
          setFormData({ ...formData, 'sentiment': null});  
          handleShow();
          Predictions.interpret({
            text: {
              source: {
                text: dataToSentiment,
              },
              type: "ALL"
            }
          }).then(result => {
                console.log("INFO: Sentiment Result", result);
                const sentiment_string = JSON.stringify(result, null, 2);
                let s = JSON.parse(sentiment_string);     
                let sentimentObject = s.textInterpretation.sentiment; 
                let sentimentObjectString = JSON.stringify(sentimentObject, null, 2);   
                let sentiment_p = sentimentObject.predominant;                                  
                setSentiment(sentiment_p);                
                setSentimentObject(sentimentObjectString);          
                setFormData({ ...formData, 'sentiment': sentimentObjectString});  
               
                              
          }).catch(err => 
              { 
                console.log("ERROR: Houve um problema. tente novamente connectando com AWS. logging sentiment error", JSON.stringify(err, null, 2));               
                setFormData({ ...formData, 'sentiment': null});  
                handleShow();
              })
    }

    function ShowSentimentInReview(props) {
        const sentiment = props.sentiment;
        console.log('sentiment returned' , props.sentiment);
        if (sentiment || sentiment !== '' || sentiment != null) {
          return <p className="text-dark"> Em conclusão, o paciente teve um dia <span>{sentiment} </span></p> ;
        }
        return;
    }

   

    return(
      <div className="py-1">
        <div> <button type="button" className="btn btn-warning" onClick={interpretFromPredictions}> Prevê e Salvar Anotações</button>  </div>
        <div>          
          <Modal show={show} 
                onHide={handleClose} 
                animation={false}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
              <h3 className="modal-header text-dark">Resumo de Anotações</h3>
              <div className="modal-body">
              <p className="text-dark text-bold"> Dia: {formData.title}</p>
              <p className="text-dark text-bold"> Cuidadora do dia: {nomeDaCuidadora(formData.cuidadora_do_dia)}</p>
              <h4 className="text-dark">Sinais Vitais</h4>
              <p className="text-dark"> Pressão Arterial: {formData.pressao} mmHg</p>   
              <p className="text-dark"> Saturação: {formData.temperatura} SpO2%</p>   
              <p className="text-dark"> Temperatura: {formData.temperatura} &deg;C </p>   

              <h4 className="text-dark">Pela Manhã</h4>
              <p className="text-dark"> Remedios: {formData.manha_remedios_text}</p>   
              <p className="text-dark"> Refeição: {formData.manha_refeicao_text}</p>   
              <p className="text-dark"> Higiene: {formData.manha_higiene_text} </p>  
              <p className="text-dark"> Atividade: {formData.manha_atividade_text}</p> 
              <p className="text-dark"> Comportamento: {formData.manha_humor_select}</p> 

              <h4 className="text-dark">A Tarde</h4>
              <p className="text-dark"> Remedios: {formData.tarde_remedios_text}</p>   
              <p className="text-dark"> Refeição: {formData.tarde_refeicao_text}</p>   
              <p className="text-dark"> Higiene: {formData.tarde_higiene_text} </p>  
              <p className="text-dark"> Atividade: {formData.tarde_atividade_text}</p> 
              <p className="text-dark"> Comportamento: {formData.tarde_humor_select}</p> 

              <h4 className="text-dark">A Noite</h4>
              <p className="text-dark"> Remedios: {formData.noite_remedios_text}</p>   
              <p className="text-dark"> Refeição: {formData.noite_refeicao_text}</p>   
              <p className="text-dark"> Higiene: {formData.noite_higiene_text} </p>  
              <p className="text-dark"> Atividade: {formData.noite_atividade_text}</p> 
              <p className="text-dark"> Comportamento: {formData.noite_humor_select}</p> 

              <div className="text-dark"> 
                <span className="text-bold"> Outras observações: </span> 
                <span>{formData.acontecimentos}</span> 
              </div>

              <ShowSentimentInReview sentiment={sentiment} />        

              <div className="py-2 text-dark"> De autoria de <span className="text-dark"> {author} </span></div>

              </div>
               <div className="modal-footer">
                <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                <Button variant="success" onClick={handleSubmit}>Salvar Anotações do dia</Button>
               </div>
           
          </Modal>
        </div>

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


 

  function SpeechToText(props) {
    
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
        handleFocus(); /*set focus on aconteciments field */
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
            {recording && <button name="stop recording" onClick={stopRecording} className="button round  recording" ><FaMicrophone className="famic" /></button>}
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
        .catch(err => {
          console.log("ERROR: Could not translate audio to text", JSON.stringify(err, null, 2));
          setTextToInterpret("");
         })
    }
  
    return (     
      <div>         
        <AudioRecorder finishRecording={convertFromBuffer} />                        
      </div>
    );
  }


  function formValidation(){

      if (!formData.cuidadora_do_dia ) {setErrors("Por favor, selecione uma cuidadora");return; }
      if (!formData.pressao ) {setErrors("Por favor, anote a pressão arterial do paciente");return; }
      // eslint-disable-next-line 
      const regex = new RegExp('^[0-9]{1,3}\/[0-9]{1,3}$');    
      if (!regex.test(formData.pressao)) {setErrors("Por favor, anote a pressão arterial do paciente no seguinte formato nnn/nn - 3 números / 2 números");return; }
      if (!formData.saturacao ) {setErrors("Por favor, anote a saturação de oxigênio do paciente");return; }
      if (isNaN(formData.saturacao)) {setErrors("Por favor, digite um número para registrar a saturação de oxigênio do paciente");return; }
      if (!formData.temperatura ) {setErrors("Por favor, anote a temperatura corporal do paciente");return; }
      if (isNaN(formData.temperatura)) {setErrors("Por favor, digite um número para registrar a temperatura do paciente");return; }     
      /* if (!formData.manha_humor_select ) {setErrors("Por favor, selecione como o paciente se comportou durante a manhã?");return; }
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
            !formData.noite_refeicao_text ) {setErrors("Precisamos de mais informação no turno da noite");return; }*/
      return 0;
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
            <label htmlFor="acontecimentos">Observações:</label><br />
            <textarea id="acontecimentos" 
                      ref={acontecimentoField}
                      className="form-control" rows="5" cols="35" 
                      defaultValue={textToInterpret} 
                      onChange={setText}></textarea>          
               
          </div>        
        </div>       
      </div>
    );
  }

  function DateDisplay(){
      return (
        <div className="date">
          <span> Hoje: {new Date().toLocaleString("pt-BR")}</span>      
        </div>
      );
  }

  function RelatorioDoDia(){
    return ( 
      <div className="outer">
        <div className="inner curve white">
        <h3> <FaRegSun className="faregsun"/>Manhã </h3>
        <label htmlFor="manha_remedios_text">Remédios</label><br />
        <textarea id="manha_remedios_text" 
                  name="manha_remedios_text"
                  className="form-control" rows="2" cols="35"
                  defaultValue={formData.manha_remedios_text}                           
                  onChange={e => handleChange(e)} 
                  ></textarea> 
        <label htmlFor="manha_refeicao_text">Refeição</label>
        <textarea id="manha_refeicao_text" 
                  name="manha_refeicao_text"
                  className="form-control" rows="2" cols="35"
                  defaultValue={formData.manha_refeicao_text}
                  onChange={e => handleChange(e)} 
                  ></textarea> 
        <label htmlFor="manha_higiene_text">Higiene</label>
        <textarea id="manha_higiene_text"
                  name="manha_higiene_text"
                  className="form-control" rows="2" cols="35"
                  defaultValue={formData.manha_higiene_text}
                  onChange={e => handleChange(e)} 
                  ></textarea> 
        <label htmlFor="manha_atividade_text">Atividade</label>
        <textarea id="manha_atividade_text"
                  name="manha_atividade_text"
                  className="form-control" rows="2" cols="35"
                  defaultValue={formData.manha_atividade_text}
                  onChange={e => handleChange(e)} 
                  ></textarea> <br />
        <div className="form-group">
          <label htmlFor="manha_humor_select">Qual o comportamento?</label>
          <select disabled={loading}
                  className="form-control" 
                  name="manha_humor_select" 
                  id="manha_humor_select"                           
                  onChange={e => handleChange(e)}   
                  value = {formData.manha_humor_select  }               
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
                  name="tarde_remedios_text"
                  className="form-control" rows="2" cols="35"
                  defaultValue={formData.tarde_remedios_text}
                  onChange={e => handleChange(e)} 
                ></textarea> 
        <label htmlFor="tarde_refeicao_text">Refeição</label>
        <textarea id="tarde_refeicao_text" 
                  name="tarde_refeicao_text"
                  className="form-control" rows="2" cols="35"
                  defaultValue={formData.tarde_refeicao_text}
                  onChange={e => handleChange(e)} 
                ></textarea> 
        <label htmlFor="tarde_higiene_text">Higiene</label>
        <textarea id="tarde_higiene_text" 
                  name="tarde_higiene_text"
                  className="form-control" rows="2" cols="35"
                  defaultValue={formData.tarde_higiene_text}
                  onChange={e => handleChange(e)} 
        ></textarea> 
        <label htmlFor="tarde_atividade_text">Atividade</label>
        <textarea id="tarde_atividade_text" 
                  name="tarde_atividade_text"
                  className="form-control" rows="2" cols="35"
                  defaultValue={formData.tarde_atividade_text}
                  onChange={e => handleChange(e)} 
                 ></textarea> <br />
        <div className="form-group">
          <label htmlFor="tarde_humor_select">Qual o comportamento?</label>
          <select className="form-control" 
                  name="tarde_humor_select" 
                  id="tarde_humor_select"                 
                  onChange={e => handleChange(e)}
                  value = {formData.tarde_humor_select  }      
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
                  name="noite_remedios_text" 
                  className="form-control"  rows="2" cols="35"
                  defaultValue={formData.noite_remedios_text}
                  onChange={e => handleChange(e)}
                  ></textarea> 
        <label htmlFor="noite_refeicao_text">Refeição</label>
        <textarea id="noite_refeicao_text"  
                  name="noite_refeicao_text" 
                  className="form-control" rows="2" cols="35"
                  defaultValue={formData.noite_refeicao_text}
                  onChange={e => handleChange(e)}
                  ></textarea> 
        <label htmlFor="noite_higiene_text">Higiene</label>
        <textarea id="noite_higiene_text" 
                  name="noite_higiene_text" 
                  className="form-control"  rows="2" cols="35"
                  defaultValue={formData.noite_higiene_text}
                  onChange={e => handleChange(e)}                  ></textarea> 
        <label htmlFor="noite_atividade_text">Atividade</label>
        <textarea id="noite_atividade_text"  
                  name="noite_atividade_text" 
                  className="form-control" rows="2" cols="35"
                  defaultValue={formData.noite_atividade_text}
                  onChange={e => handleChange(e)} 
                  ></textarea> <br />
        <div className="form-group ">
          <label htmlFor="noite_humor_select">Qual o comportamento?</label>
          <select className="form-control" 
                  name="noite_humor_select" 
                  id="noite_humor_select"                 
                  onChange={e => handleChange(e)} 
                  value = {formData.noite_humor_select  }                     
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
        <fieldset  >
        <div className="form-check form-check-inline">       
          <input className="form-check-input"  
                type="radio"  
                name="cuidadora_do_dia" 
                value="1"     
                required="required"      
                checked = {(formData.cuidadora_do_dia === 1) || null}                
                onChange={e => handleChange(e)}                    
                />
          <label  className="form-check-label" htmlFor="1"> Miriam</label>
        </div>
        <div className="form-check form-check-inline">       
          <input className="form-check-input"  
                type="radio"  
                name="cuidadora_do_dia" 
                value="2"
                required="required"     
                checked = {(formData.cuidadora_do_dia === 2) || null}   
                onChange={e => handleChange(e)}  
                />
          <label  className="form-check-label" htmlFor="2"> Samira</label>
        </div>
        <div className="form-check form-check-inline">       
          <input className="form-check-input"  
                type="radio"  
                name="cuidadora_do_dia" 
                value="3"
                required="required"     
                checked = {(formData.cuidadora_do_dia === 3) || null}   
                onChange={e => handleChange(e)}  
                />
          <label  className="form-check-label" htmlFor="3"> Sub</label>
        </div>
        </fieldset>
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
                  placeholder="12/8"    
                  required="required"            
                  defaultValue={formData.pressao}                                
                  name="pressao" maxLength="10" size="6"
                   onChange={e => handleChange(e)}  />
          <label className="block" htmlFor="saturacao" >Saturação (SpO<span className="tiny">2%</span> )</label>
          <input className="form-control" 
                  id="saturacao"                 
                  placeholder="95" name="saturacao" maxLength="10" size="6"
                  defaultValue={formData.saturacao}                 
                  required="required"    
                  type='number' inputMode='numeric' pattern="[0-9]*"  
                   onChange={e => handleChange(e)} />
          <label className="block" htmlFor="name">Temperatura (&deg;C)</label>
          <input className="form-control" 
                  id="temperatura"                 
                  placeholder="37" 
                  required="required" 
                  step="any" 
                  type='number' inputMode='numeric' pattern="[0-9]*"    
                  name="temperatura" maxLength="10" size="6"  
                  defaultValue={formData.temperatura}
                  onChange={e => handleChange(e)}  /> 
          </div>
        </div> 
      </div>  
    )
  }


  function DateStarted(){
    return (
      <div className="outer">
        <div className="inner curve white">
        <h3> <FaCalendarAlt className="facalendaralt"/>  Anotações do dia </h3>
        <div className="form-group was-validated">       
          <div className="form-check form-check-inline">       
              <DatePicker className="form-check-input" 
                          required="required"      
                          selected={startDate}                          
                          onChange={(date:Date) => handleDateChange(date)} 
                          dateFormat="dd/MM/yyyy"                                                  
                          name="startDatePicker"
              />             
            </div>
          </div>
        </div>
      </div>
    )
  }

  function DataForm(){
    return (
      <form className="form" name="formEntry" id="formEntry" alt="the form fields"> 
        <input type="hidden" value='1' name="patientID" id="patientID" readOnly />   
        <input type="hidden"  value={startDate} name="title" id="title"  onChange={e => handleChange(e)}  readOnly />
        <input type="hidden" value={author || ""} name="author" id="author" readOnly />  
                <div> {DateStarted()} </div>
                <div> {AssistantNames()} </div> 
                <div> {VitalCollection()} </div>          
                <div> {RelatorioDoDia()} </div>
                <div> {RelatorioDaTarde()} </div>
                <div> {RelatorioDaNoite()} </div>
              <div>
                <div className="aligned"> {TextInterpretation()} </div> 
                <div className="aligned"> <SpeechToText />  </div>
              </div>
              <div>               
                <input type="hidden"  
                      defaultValue={sentimentObject} 
                      name="sentiment"                      
                      id="sentiment"   />         
              </div>         
              <ShowSaveNoteButton />
        </form>
    );
  }



  
  return (
      <div className="entry container">
        <div className="row my-5">
          <div className="col-lg-5">
            <div className="App-header">        
                <img src={logo} className="App-logo" alt="logo" /> 
                <h1> Diario do Papai </h1>
                 <DateDisplay />
            </div>
          </div>
          <div className="col-lg-7">                  
            <div> {DataForm()} </div>            
          </div>
        </div>         
      </div>
  );
}

export default Entry;