import React, { Component } from 'react';
import './../App.css';

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
    }

    render() { 

   
      return (
      <div>
        {/* <div className="my-5 container outer">
            <h2> Histórico de Anotações </h2>              
            <div className="row inner curve white" >
                  <div className="row strong">                 
                  <div className="col-md-3 text font-weight-bold">Dia</div>
                  <div className="col-sm text font-weight-bold">Cuidadora</div>
                  <div className="col-sm text font-weight-bold ">Em Conclusão</div>
                  <div className="col-sm text font-weight-bold">Pressão</div>
                  <div className="col-sm text font-weight-bold">Saturação</div>
                  <div className="col-sm text font-weight-bold">Temperatura</div>                                       
                  <div className="col-sm text font-weight-bold"></div>  
                  <div className="col-sm text font-weight-bold"></div>  
            </div>        
            {this.props.notes.map(note => (                  
            <div className="row" key={note.id || note.title}>                
                  <div className="col-md-3 text">{note.title}</div>
                  <div className="col-sm text">{note.cuidadora_do_dia}</div>
                  <div className="col-sm text">{this.parseSentimentData(note.sentiment)}</div>
                  <div className="col-sm text">{note.pressao} mmHg</div>
                  <div className="col-sm text">{note.saturacao} SpO<span className="tiny">2%</span></div>
                  <div className="col-sm text">{note.temperatura} &deg;C</div>
                  <div className="col-sm text"><button onClick={() => this.props.deleteNote(note)}>Deletar nota</button>  </div>                 
                  <div className="col-sm text"><button onClick={() => this.props.selectNote(note)}>Editar nota</button>  </div>
                  </div>                            
                ))}
            </div>           
        </div> */}

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
                  <th scope="col" className="text font-weight-bold">Humor da Tarde</th>
                  <th scope="col" className="text font-weight-bold">Humor da Noite</th>
                  <th scope="col" className="text font-weight-bold">Observacoes</th>                                          
                  <th scope="col" className="text font-weight-bold"></th>  
                  <th scope="col" className="text font-weight-bold"></th> 
                  <th scope="col" className="text font-weight-bold"></th> 
            </tr>       
           </thead>
           <tbody>
              {this.props.notes.map(note => (                  
                <tr key={note.id || note.title}>                
                  <th scope="row"><small>{note.title}</small></th>
                  <td className="text"><small>{this.nomeDaCuidadora(note.cuidadora_do_dia)}</small></td>
                  <td className="text"><small>{this.parseSentimentData(note.sentiment)}</small></td>
                  <td className="text"><small>{note.pressao} mmHg</small></td>
                  <td className="text"><small>{note.saturacao} SpO<span className="tiny">2%</span></small></td>
                  <td className="text"><small>{note.temperatura} &deg;C</small></td>
                  <td className="text"><small>{note.manha_humor_select}</small></td>   
                  <td className="text"><small>{note.tarde_humor_select}</small></td>   
                  <td className="text"><small>{note.noite_humor_select}</small></td>   
                  <td className="text"><small>{note.acontecimentos}</small></td>   
                  <td className="text"><small><button onClick={() => this.props.deleteNote(note)}>Deletar nota</button> </small> </td>                 
                  <td className="text"><small><button onClick={() => this.props.selectNote(note)}>Editar nota</button> </small> </td>
                  <td className="text"><small><button onClick={() => this.props.selectNote(note)}>Abrir nota</button> </small> </td>
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