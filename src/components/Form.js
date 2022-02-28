import React, { Component } from 'react';
import './../App.css';
import { FaRegSun } from 'react-icons/fa'

class Form extends Component {

    handleChange= e => {
        e.persist();   
        this.setState({ [e.target.name]: e.target.value })
        /* if ( !!errors ) { setErrors([]);} */
    };

   /* formValidation = () => {
        if (!this.state.cuidadora_do_dia ) {setErrors("Por favor, selecione uma cuidadora");return; }
        if (!this.state.pressao ) {setErrors("Por favor, anote a pressão arterial do paciente");return; }
        if (!this.state.saturacao ) {setErrors("Por favor, anote a saturação de oxigênio do paciente");return; }
        if (isNaN(this.state.saturacao)) {setErrors("Por favor, digite um número para registrar a saturação de oxigênio do paciente");return; }
        if (!this.state.temperatura ) {setErrors("Por favor, anote a temperatura corporal do paciente");return; }
        if (isNaN(this.state.temperatura)) {setErrors("Por favor, digite um número para registrar a temperatura do paciente");return; }     
        if (!this.state.manha_humor_select ) {setErrors("Por favor, selecione como o paciente se comportou durante a manhã?");return; }
        if (!this.state.tarde_humor_select ) {setErrors("Por favor, selecione como o paciente se comportou durante a tarde?");return; }
        if (!this.state.noite_humor_select ) {setErrors("Por favor, selecione como o paciente se comportou durante a noite?");return; }
        if (!this.state.manha_atividade_text && 
            !this.state.manha_higiene_text && 
            !this.state.manha_remedios_text &&         
            !this.state.manha_refeicao_text ) {setErrors("Precisamos de mais informação no turno da manhã");return; }
        if (!this.state.tarde_atividade_text && 
            !this.state.tarde_higiene_text && 
            !this.state.tarde_remedios_text &&
            !this.state.tarde_refeicao_text ) {setErrors("Precisamos de mais informação no turno da tarde");return; }
        if (!this.state.noite_atividade_text && 
            !this.state.noite_higiene_text && 
            !this.state.noite_remedios_text &&
            !this.state.noite_refeicao_text ) {setErrors("Precisamos de mais informação no turno da noite");return; }
        return 0;
    }*/

  render() {
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
                          sentiment: ''}

    
        this.setState({initialFormState});
        console.log('form initial state from /FORMS', this.state);
 
        return (
            <div className="outer">
                <div className="inner curve white">
                    <h3> <FaRegSun className="faregsun"/>  Manhã </h3>
                    <label htmlFor="manha_remedios_text">Remédios</label><br />
                    <textarea id="manha_remedios_text" 
                            name="manha_remedios_text"
                            className="form-control" rows="2" cols="35"
                            defaultValue={this.state.manha_remedios_text}                           
                            onChange={e => this.handleChange(e)} 
                            ></textarea> 
                    <label htmlFor="manha_refeicao_text">Refeição</label>
                    <textarea id="manha_refeicao_text" 
                            name="manha_refeicao_text"
                            className="form-control" rows="2" cols="35"
                            defaultValue={this.state.manha_refeicao_text}
                            onChange={e => this.handleChange(e)} 
                            ></textarea> 
                    <label htmlFor="manha_higiene_text">Higiene</label>
                    <textarea id="manha_higiene_text"
                            name="manha_higiene_text"
                            className="form-control" rows="2" cols="35"
                            defaultValue={this.state.manha_higiene_text}
                            onChange={e => this.handleChange(e)} 
                            ></textarea> 
                    <label htmlFor="manha_atividade_text">Atividade</label>
                    <textarea id="manha_atividade_text"
                            name="manha_atividade_text"
                            className="form-control" rows="2" cols="35"
                            defaultValue={this.state.manha_atividade_text}
                            onChange={e => this.handleChange(e)} 
                            ></textarea> <br />
                    <div className="form-group was-validated">
                        <label htmlFor="manha_humor_select">Qual o comportamento?</label>
                        <select disabled={this.props.loading}
                                className="form-control" 
                                name="manha_humor_select" 
                                id="manha_humor_select"    
                                required="required"         
                                onChange={e => this.handleChange(e)}             
                                >               
                                {this.props.comportamentoType.map(({ label, value }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}     
                        </select>
                    </div>
                </div>
            </div>  
        )
  }
}

export default Form