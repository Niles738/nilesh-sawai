
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FocusData, StudyStat } from '../types';

interface StudyStatsProps {
  stats: StudyStat[];
  focusData: FocusData[];
}

const StudyStats: React.FC<StudyStatsProps> = ({ stats, focusData }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-slate-800">Your Study Progress</h2>
        <button className="text-blue-600 text-sm font-semibold hover:underline">View Analytics</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-blue-600 font-bold text-lg">{stat.value}</div>
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{stat.label}</div>
            {stat.trend && (
              <div className={`text-[10px] mt-1 ${stat.trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}% vs last week
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={focusData}>
            <defs>
              <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4361ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4361ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="day" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#4361ee" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorFocus)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="text-[10px] text-center text-slate-400 mt-2 font-medium">Daily Focus Score Trend</div>
      </div>
    </div>
  );
};

export default StudyStats;
