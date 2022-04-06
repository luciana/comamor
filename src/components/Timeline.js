import React, { Component } from 'react';
import { FaRegSun, FaSun, FaStar} from 'react-icons/fa';

class TimelineChart extends Component {
  render () {
    console.log('INFO: Medication timeline data', this.props.value);
  return (
    <table className="table">
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col"><FaRegSun /> Manhã</th>
        <th scope="row"><FaSun /> Tarde</th>
        <th scope="row"><FaStar /> Noite</th>
        
      </tr>      
    </thead>
    <tbody>
    {this.props.value.map((med, index) => (    
      <tr key="{med.name}-{index}">      
        <th  scope="row"><small>{new Date(med.name).toLocaleDateString()}</small></th>
        <td><small>{(med.manha).join('\r\n')}</small></td>
        <td><small>{(med.tarde).join('\r\n')}</small></td>
        <td><small>{(med.noite).join('\r\n')}</small></td>
      </tr>   
      ))}  
    </tbody>
  </table>

  /*  <table className="table">
    <thead>
      <tr key='{med.name}-date'>
        <th scope="col"></th>
        {this.props.value.map((med, index) => ( <th scope="col"> {med.name} </th> ))};
      </tr>      
    </thead>
    <tbody>
      <tr>
        <th scope="row"><FaRegSun /></th>
        {this.props.value.map(med => (<td>{med.manha}</td>))};
       
      </tr>
      <tr>
        <th scope="row"><FaSun /></th>
        {this.props.value.map(med => (<td>{med.tarde}</td>))};
      </tr>
      <tr>
        <th scope="row"><FaStar /></th>
        {this.props.value.map(med => (<td>{med.noite}</td>))};
      </tr>
    </tbody>
  </table>*/
  );
  }
}

export default TimelineChart
