import { ResponsiveContainer, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { AGENCY_PARAMETERS } from '../../data/mockData';

export default function AgencyRadarChart({ entrepreneurs = [], height = 350 }) {
  const data = AGENCY_PARAMETERS.map(param => {
    const entry = { parameter: param.label };
    entrepreneurs.forEach((e, i) => {
      entry[`score${i}`] = e.agencyScore[param.key];
    });
    entry.fullMark = 5;
    return entry;
  });

  const colors = ['#E97451', '#F59E0B', '#10B981'];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="#E7E5E4" />
        <PolarAngleAxis dataKey="parameter" tick={{ fontSize: 12, fill: '#57534E' }} />
        <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10, fill: '#A8A29E' }} />
        {entrepreneurs.map((e, i) => (
          <Radar
            key={e.id}
            name={e.name}
            dataKey={`score${i}`}
            stroke={colors[i]}
            fill={colors[i]}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        ))}
        {entrepreneurs.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
