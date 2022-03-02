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

    render() { 
      return (
        
        <div className="my-5 container outer">
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
        </div>
    )
  }
}

export default Notes