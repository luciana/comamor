import React, { Component } from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';

export default class HumorBarChart extends Component {

  state = { activeIndex: 0 }
   handleClick=(data, index)=>{
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    console.log('INFO: Humor Bar Chart data', this.props.value);
    const { data } = this.props.value;


    const activeItem = data[this.state.activeIndex];
   
    return (
      <div style={{ width: '100%' }}>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={data}>
            <Bar dataKey="comportamento" onClick={this.handleClick}>
              {data.map((entry, index) => (
                <Cell cursor="pointer" fill={index === this.state.activeIndex ? '#82ca9d' : '#8884d8'} key={`cell-${index}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="content">{`Humor "${activeItem.name}": ${activeItem.comportamento}`}</p>
      </div>
    );
  }
}