
import React, { PureComponent } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
} from 'recharts';

export default class VitalsComposedChart extends PureComponent {
  render() {
    console.log('INFO: Vitals Composed Chart data', this.props.value);

    return (
      <ResponsiveContainer width="100%" aspect={2}>
        <ComposedChart      
          data={this.props.value}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="systolic" barSize={20} fill="#413ea0" />
          <Bar dataKey="diastolic" barSize={20} fill="#cc42a0" />
          <Line type="monotone" dataKey="saturation" stroke="#ff7300" />
          <Scatter dataKey="temperature" fill="red" />
        </ComposedChart>
    </ResponsiveContainer>
    );
  }
}
