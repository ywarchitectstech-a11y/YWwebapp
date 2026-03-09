import React from 'react';
import styles from './LineChart.module.scss';

interface DataPoint {
  x: number;
  y: number;
}

interface LineChartProps {
  data: {
    today: DataPoint[];
    pending: DataPoint[];
    upcoming: DataPoint[];
  };
  yLabels?: number[];
  xLabels?: number[];
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data,
  yLabels = [200, 150, 100, 50, 25, 0],
  xLabels = [0, 25, 50, 100, 150, 200]
}) => {
  const width = 100;
  const height = 100;
  const padding = 5;
  
  const maxY = Math.max(...yLabels);
  const maxX = Math.max(...xLabels);
  
  const scaleX = (x: number) => (x / maxX) * (width - padding * 2) + padding;
  const scaleY = (y: number) => height - padding - (y / maxY) * (height - padding * 2);
  
  const createPath = (points: DataPoint[]) => {
    if (points.length === 0) return '';
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`)
      .join(' ');
  };

  return (
    <div className={styles.lineChart}>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.today}`} />
          <span>Today</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.pending}`} />
          <span>Pending</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.upcoming}`} />
          <span>Upcoming</span>
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        <div className={styles.yAxis}>
          {yLabels.map((label) => (
            <span key={label} className={styles.yLabel}>{label}</span>
          ))}
        </div>
        
        <div className={styles.chartArea}>
          <svg 
            className={styles.chartSvg} 
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {yLabels.map((label, i) => (
              <line
                key={`grid-${i}`}
                className={styles.gridLine}
                x1={padding}
                y1={scaleY(label)}
                x2={width - padding}
                y2={scaleY(label)}
              />
            ))}
            
            {/* Data lines */}
            <path className={`${styles.dataLine} ${styles.today}`} d={createPath(data.today)} />
            <path className={`${styles.dataLine} ${styles.pending}`} d={createPath(data.pending)} />
            <path className={`${styles.dataLine} ${styles.upcoming}`} d={createPath(data.upcoming)} />
            
            {/* Data points */}
            {data.today.map((point, i) => (
              <circle
                key={`today-${i}`}
                className={`${styles.dataPoint} ${styles.today}`}
                cx={scaleX(point.x)}
                cy={scaleY(point.y)}
                r={4}
              />
            ))}
            {data.pending.map((point, i) => (
              <circle
                key={`pending-${i}`}
                className={`${styles.dataPoint} ${styles.pending}`}
                cx={scaleX(point.x)}
                cy={scaleY(point.y)}
                r={4}
              />
            ))}
            {data.upcoming.map((point, i) => (
              <circle
                key={`upcoming-${i}`}
                className={`${styles.dataPoint} ${styles.upcoming}`}
                cx={scaleX(point.x)}
                cy={scaleY(point.y)}
                r={4}
              />
            ))}
          </svg>
        </div>
        
        <div className={styles.xAxis}>
          {xLabels.map((label) => (
            <span key={label} className={styles.xLabel}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineChart;
