import React from 'react';
import styles from './DonutChart.module.scss';

interface DonutSegment {
  value: number;
  color: string;
  label: string;
  type: 'hot' | 'warm' | 'cold' | 'new';
}

interface DonutChartProps {
  data: DonutSegment[];
  centerLabel?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, centerLabel = 'Total' }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercent = 0;
  
  const segments = data.map((segment) => {
    const percent = segment.value / total;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativePercent * circumference;
    cumulativePercent += percent;
    
    return {
      ...segment,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className={styles.donutChart}>
      <div className={styles.chartWrapper}>
        <svg className={styles.chartSvg} viewBox="0 0 200 200">
          {segments.map((segment, index) => (
            <circle
              key={index}
              className={styles.segment}
              cx="100"
              cy="100"
              r={radius}
              stroke={segment.color}
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={segment.strokeDashoffset}
            />
          ))}
        </svg>
        <div className={styles.centerLabel}>
          <div className={styles.centerValue}>{total}</div>
          <div className={styles.centerText}>{centerLabel}</div>
        </div>
      </div>
      
      <div className={styles.legend}>
        {data.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <span className={`${styles.legendLabel} ${styles[item.type]}`}>
              {item.label}
            </span>
            <span className={`${styles.legendValue} ${styles[item.type]}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
