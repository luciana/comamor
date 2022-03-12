import React, { Component } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer  } from 'recharts';

export default class SentimentLineChart extends Component {

  render() {
    console.log('INFO: Sentiment Line Chart data', this.props.value);
    
   
    return (
      <div style={{ width: '100%' }}>
        <ResponsiveContainer width="100%" aspect={2}>
        <LineChart data={this.props.value} margin={{ right: 0 }}>
            <CartesianGrid />
            <XAxis dataKey="name" 
                interval={'preserveStartEnd'} />
            <YAxis></YAxis>
            <Legend />
            <Tooltip />
            <Line dataKey="positivo"
                stroke="green" activeDot={{ r: 8 }} />
            <Line dataKey="negativo"
                stroke="red" activeDot={{ r: 8 }} />
            <Line dataKey="neutro"
                stroke="gray" activeDot={{ r: 8 }} />
            <Line dataKey="mixed"
                stroke="blue" activeDot={{ r: 8 }} />
        </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}