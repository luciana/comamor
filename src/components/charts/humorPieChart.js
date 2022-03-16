import React, { PureComponent } from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell, ResponsiveContainer } from 'recharts';



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0022FE', '#eeD1AA', '#FFEE28', '#AA8042', '#000000'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default class HumorPieChart extends PureComponent {
  
  render() {
    return (
    <ResponsiveContainer width="100%" aspect={2}>
        <PieChart >
        <Legend />   
        <Tooltip />
          <Pie 
            data={this.props.value}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="comportamento"
            label
          >
            {this.props.value.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
