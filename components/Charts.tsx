import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: ChartData[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  title?: string;
}

interface BarChartProps {
  data: ChartData[];
  height?: number;
  horizontal?: boolean;
  showValues?: boolean;
  title?: string;
}

interface PieChartProps {
  data: ChartData[];
  size?: number;
  title?: string;
}

const { width: screenWidth } = Dimensions.get('window');

// Line Chart Component
export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  color = '#3498DB',
  showGrid = true,
  showLabels = true,
  title,
}) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  const chartWidth = screenWidth - 80;
  const pointWidth = chartWidth / (data.length - 1 || 1);

  const points = data.map((item, index) => {
    const x = 40 + index * pointWidth;
    const y = height - 40 - ((item.value - minValue) / range) * (height - 60);
    return { x, y, ...item };
  });

  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.chartTitle}>{title}</Text>}
      <View style={[styles.chart, { height }]}>
        {/* Grid lines */}
        {showGrid && (
          <View style={styles.gridContainer}>
            {[0, 1, 2, 3, 4].map(i => (
              <View
                key={i}
                style={[
                  styles.gridLine,
                  { bottom: (i * (height - 60)) / 4 + 40 },
                ]}
              />
            ))}
          </View>
        )}

        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          {[0, 1, 2, 3, 4].map(i => {
            const value = minValue + (range * (4 - i)) / 4;
            return (
              <Text key={i} style={styles.axisLabel}>
                {Math.round(value)}
              </Text>
            );
          })}
        </View>

        {/* Line path */}
        <View style={styles.lineContainer}>
          {points.map((point, index) => {
            if (index === 0) return null;
            const prevPoint = points[index - 1];
            const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
            const length = Math.sqrt(
              Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
            );
            return (
              <View
                key={index}
                style={[
                  styles.line,
                  {
                    left: prevPoint.x,
                    top: prevPoint.y,
                    width: length,
                    backgroundColor: color,
                    transform: [{ rotate: `${angle}rad` }],
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Points */}
        {points.map((point, index) => (
          <View
            key={index}
            style={[
              styles.point,
              {
                left: point.x - 4,
                top: point.y - 4,
                backgroundColor: color,
              },
            ]}
          />
        ))}

        {/* X-axis labels */}
        {showLabels && (
          <View style={styles.xAxisLabels}>
            {points.map((point, index) => (
              <Text
                key={index}
                style={[styles.xAxisLabel, { left: point.x - 20 }]}>
                {point.label}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

// Bar Chart Component
export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  horizontal = false,
  showValues = true,
  title,
}) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const chartWidth = screenWidth - 80;
  const barSpacing = 8;
  const barWidth = (chartWidth - barSpacing * (data.length + 1)) / data.length;

  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.chartTitle}>{title}</Text>}
      <View style={[styles.chart, { height }]}>
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * (height - 60);
            return (
              <View
                key={index}
                style={[
                  styles.barWrapper,
                  { width: barWidth, marginLeft: index === 0 ? barSpacing : 0 },
                ]}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: item.color || '#3498DB',
                    },
                  ]}>
                  {showValues && (
                    <Text style={styles.barValue}>{Math.round(item.value)}</Text>
                  )}
                </View>
                <Text style={styles.barLabel} numberOfLines={1}>
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// Pie Chart Component (Simple version using stacked circles)
export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 160,
  title,
}) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.chartTitle}>{title}</Text>}
      <View style={styles.pieContainer}>
        <View style={[styles.pieChart, { width: size, height: size }]}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

            // For visual representation, we'll use a simpler approach
            // showing segments as colored sections
            return (
              <View
                key={index}
                style={[
                  styles.pieSegment,
                  {
                    backgroundColor: item.color || `hsl(${index * 60}, 70%, 60%)`,
                    width: size,
                    height: size / data.length,
                  },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.pieLegend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor:
                      item.color || `hsl(${index * 60}, 70%, 60%)`,
                  },
                ]}
              />
              <Text style={styles.legendText}>
                {item.label}: {Math.round((item.value / total) * 100)}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// Progress Ring Component (for single metrics)
interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  value?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 12,
  color = '#50C878',
  label,
  value,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressValue = Math.min(100, Math.max(0, progress));

  return (
    <View style={[styles.progressRing, { width: size, height: size }]}>
      <View
        style={[
          styles.progressRingBackground,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: '#e0e0e0',
          },
        ]}
      />
      <View
        style={[
          styles.progressRingFill,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            transform: [{ rotate: '-90deg' }],
          },
        ]}
      />
      <View style={styles.progressRingContent}>
        {value && <Text style={styles.progressValue}>{value}</Text>}
        {label && <Text style={styles.progressLabel}>{label}</Text>}
      </View>
    </View>
  );
};

// Heatmap Calendar Component (for streak tracking)
interface HeatmapProps {
  data: { date: string; value: number }[];
  weeks?: number;
  title?: string;
}

export const HeatmapCalendar: React.FC<HeatmapProps> = ({
  data,
  weeks = 12,
  title,
}) => {
  const cellSize = 12;
  const cellGap = 2;

  const getDayColor = (value: number) => {
    if (value === 0) return '#ebedf0';
    if (value <= 25) return '#c6e48b';
    if (value <= 50) return '#7bc96f';
    if (value <= 75) return '#239a3b';
    return '#196127';
  };

  // Generate grid for past N weeks
  const grid: any[] = [];
  const today = new Date();
  for (let week = 0; week < weeks; week++) {
    const weekData: any[] = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (weeks - week) * 7 + day);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = data.find(d => d.date === dateStr);
      weekData.push({
        date: dateStr,
        value: dayData?.value || 0,
      });
    }
    grid.push(weekData);
  }

  return (
    <View style={styles.chartContainer}>
      {title && <Text style={styles.chartTitle}>{title}</Text>}
      <View style={styles.heatmapContainer}>
        {grid.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.heatmapWeek}>
            {week.map((day: any, dayIndex: number) => (
              <View
                key={dayIndex}
                style={[
                  styles.heatmapCell,
                  {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: getDayColor(day.value),
                    marginRight: cellGap,
                    marginBottom: cellGap,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.heatmapLegend}>
        <Text style={styles.heatmapLegendText}>Less</Text>
        {[0, 25, 50, 75, 100].map((val, i) => (
          <View
            key={i}
            style={[
              styles.heatmapLegendCell,
              { backgroundColor: getDayColor(val) },
            ]}
          />
        ))}
        <Text style={styles.heatmapLegendText}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  chart: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    position: 'relative',
  },
  gridContainer: {
    position: 'absolute',
    left: 40,
    right: 20,
    top: 20,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 20,
    bottom: 40,
    width: 35,
    justifyContent: 'space-between',
  },
  axisLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
  },
  lineContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  line: {
    position: 'absolute',
    height: 3,
  },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  xAxisLabels: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 30,
  },
  xAxisLabel: {
    position: 'absolute',
    fontSize: 10,
    color: '#666',
    width: 40,
    textAlign: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    paddingBottom: 30,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  pieContainer: {
    alignItems: 'center',
  },
  pieChart: {
    borderRadius: 1000,
    overflow: 'hidden',
    marginBottom: 16,
  },
  pieSegment: {
    // Simplified pie representation
  },
  pieLegend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  progressRing: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingBackground: {
    position: 'absolute',
  },
  progressRingFill: {
    position: 'absolute',
  },
  progressRingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  heatmapContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  heatmapWeek: {
    flexDirection: 'column',
  },
  heatmapCell: {
    borderRadius: 2,
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  heatmapLegendText: {
    fontSize: 11,
    color: '#666',
    marginHorizontal: 4,
  },
  heatmapLegendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginHorizontal: 2,
  },
});
