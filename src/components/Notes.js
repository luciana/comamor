import React, { Component } from 'react';
import './../App.css';
import { FaRegTrashAlt } from 'react-icons/fa';

class Notes extends Component {

    
    parseSentimentData = (sentiment_string) => {
        if (!sentiment_string) return;
        try{
            let s = JSON.parse(sentiment_string);        
            if(!s.predominant) return;  
            return s.predominant; 
        }catch(err){
        console.log("ERROR: can't parse the sentiment object in the database", sentiment_string);
        return;
        }      
    }
    updateFilter = filter => this.setState({ filter })

    nomeDaCuidadora  = (id) => {
      if ( id === 1 ) return 'Mirian';
      if ( id === 2 ) return 'Samira';
      if ( id === 3 ) return 'Sub';
    }



    render() { 

   
      return (
      <div>
       

        <div className="table-responsive">
        <table className="table table-light table-striped table-hover table-borderless table-sm align-middle">
           <thead className="table-success">
           <tr>                          
                  <th scope="col" className="text font-weight-bold">Dia</th>
                  <th scope="col" className="text font-weight-bold">Cuidadora</th>
                  <th scope="col" className="text font-weight-bold ">Em Conclusão</th>
                  <th scope="col" className="text font-weight-bold">Pressão</th>
                  <th scope="col" className="text font-weight-bold">Saturação</th>
                  <th scope="col" className="text font-weight-bold">Temperatura</th>
                  <th scope="col" className="text font-weight-bold ">Humor Manha</th>
                  <th scope="col" className="text font-weight-bold">Humor Tarde</th>
                  <th scope="col" className="text font-weight-bold">Humor Noite</th>
                  <th scope="col" className="text font-weight-bold">Observações</th>                                          
                  <th scope="col" className="text font-weight-bold"></th>  
                  <th scope="col" className="text font-weight-bold"></th> 
                  <th scope="col" className="text font-weight-bold"></th> 
            </tr>       
           </thead>
           <tbody>
              {this.props.notes.map(note => (                  
                <tr key={note.id || note.title}>                
                  <th scope="row"><small>{new Date(note.title).toLocaleString().split(',')[0]}</small></th>
                  <td className="text"><small>{this.nomeDaCuidadora(note.cuidadora_do_dia)}</small></td>
                  <td className="text"><small>{this.parseSentimentData(note.sentiment)}</small></td>
                  <td className="text"><small>{note.pressao} mmHg</small></td>
                  <td className="text"><small>{note.saturacao} SpO<span className="tiny">2%</span></small></td>
                  <td className="text"><small>{note.temperatura} &deg;C</small></td>
                  <td className="text"><small>{note.manha_humor_select}</small></td>   
                  <td className="text"><small>{note.tarde_humor_select}</small></td>   
                  <td className="text"><small>{note.noite_humor_select}</small></td>   
                  <td className="text"><small>{note.acontecimentos}</small></td>   
                  <td className="text"><button className="btn btn-danger" onClick={() => this.props.deleteNote(note)}><FaRegTrashAlt /></button></td>                 
                  <td className="text"><small><button className="btn btn-success" onClick={() => this.props.selectNote(note)}>Editar</button> </small> </td>
                  <td className="text"></td>
                </tr>                            
                ))}            
           </tbody>
        </table>
        </div>
      </div>
    )
  }
}

export default Notes