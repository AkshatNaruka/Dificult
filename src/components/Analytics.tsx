'use client';

import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { TestHistory } from '@/store/playerStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsProps {
  testHistory: TestHistory[];
}

type TimeRange = '7d' | '30d' | '90d' | 'all';
export default function Analytics({ testHistory }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [showAccuracy, setShowAccuracy] = useState(false);

  const filteredData = useMemo(() => {
    const now = new Date();
    let filterDate: Date;
    
    switch (timeRange) {
      case '7d':
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        filterDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        filterDate = new Date(0);
    }

    return testHistory
      .filter(test => new Date(test.date) >= filterDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-50); // Keep last 50 tests for performance
  }, [testHistory, timeRange]);

  const chartData = useMemo(() => {
    const labels = filteredData.map((test, index) => {
      const date = new Date(test.date);
      return `Test ${index + 1}\n${date.toLocaleDateString()}`;
    });

    const wpmData = filteredData.map(test => test.wpm);
    const accuracyData = filteredData.map(test => test.accuracy);

    const datasets = [
      {
        label: 'WPM',
        data: wpmData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
        yAxisID: 'y',
      }
    ];

    if (showAccuracy) {
      datasets.push({
        label: 'Accuracy (%)',
        data: accuracyData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
        fill: true,
        yAxisID: 'y1',
      });
    }

    return {
      labels,
      datasets,
    };
  }, [filteredData, showAccuracy]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Typing Performance Over Time',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#374151',
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: (context: TooltipItem<'line'>[]) => {
            const test = filteredData[context[0].dataIndex];
            const date = new Date(test.date);
            return `Test ${context[0].dataIndex + 1} - ${date.toLocaleString()}`;
          },
          afterLabel: (context: TooltipItem<'line'>) => {
            const test = filteredData[context.dataIndex];
            return [
              `Mode: ${test.mode}`,
              `Duration: ${test.duration}s`,
              `Characters: ${test.charactersTyped}`,
              `XP Gained: ${test.xpGained}`
            ];
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Tests',
          color: '#6b7280',
        },
        ticks: {
          color: '#6b7280',
          maxRotation: 45,
          callback: function(value: string | number, index: number) {
            // Show fewer labels on smaller screens
            if (filteredData.length > 10 && index % Math.ceil(filteredData.length / 8) !== 0) {
              return '';
            }
            return `Test ${index + 1}`;
          },
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Words Per Minute (WPM)',
          color: '#3b82f6',
        },
        ticks: {
          color: '#3b82f6',
        },
        grid: {
          color: 'rgba(59, 130, 246, 0.1)',
        },
      },
      y1: showAccuracy ? {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Accuracy (%)',
          color: '#22c55e',
        },
        ticks: {
          color: '#22c55e',
          min: 0,
          max: 100,
        },
        grid: {
          drawOnChartArea: false,
        },
      } : undefined,
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;

    const wpmValues = filteredData.map(t => t.wpm);
    const accuracyValues = filteredData.map(t => t.accuracy);
    
    const avgWpm = wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length;
    const avgAccuracy = accuracyValues.reduce((a, b) => a + b, 0) / accuracyValues.length;
    const maxWpm = Math.max(...wpmValues);
    const minWpm = Math.min(...wpmValues);
    
    // Calculate improvement (compare first quarter vs last quarter)
    const quarterSize = Math.max(1, Math.floor(filteredData.length / 4));
    const firstQuarter = wpmValues.slice(0, quarterSize);
    const lastQuarter = wpmValues.slice(-quarterSize);
    
    const firstAvg = firstQuarter.reduce((a, b) => a + b, 0) / firstQuarter.length;
    const lastAvg = lastQuarter.reduce((a, b) => a + b, 0) / lastQuarter.length;
    const improvement = lastAvg - firstAvg;

    return {
      avgWpm: Math.round(avgWpm),
      avgAccuracy: Math.round(avgAccuracy * 10) / 10,
      maxWpm: Math.round(maxWpm),
      minWpm: Math.round(minWpm),
      improvement: Math.round(improvement * 10) / 10,
      totalTests: filteredData.length,
    };
  }, [filteredData]);

  if (testHistory.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Yet</h3>
          <p className="text-gray-600">Complete some typing tests to see your analytics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">📊 Performance Analytics</h2>
        
        <div className="flex flex-wrap gap-2">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          
          {/* Show Accuracy Toggle */}
          <button
            onClick={() => setShowAccuracy(!showAccuracy)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showAccuracy
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {showAccuracy ? '✓' : '+'} Accuracy
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="text-xs text-blue-600 font-medium">Avg WPM</div>
            <div className="text-lg font-bold text-blue-900">{stats.avgWpm}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="text-xs text-green-600 font-medium">Avg Accuracy</div>
            <div className="text-lg font-bold text-green-900">{stats.avgAccuracy}%</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
            <div className="text-xs text-purple-600 font-medium">Best WPM</div>
            <div className="text-lg font-bold text-purple-900">{stats.maxWpm}</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
            <div className="text-xs text-orange-600 font-medium">Tests</div>
            <div className="text-lg font-bold text-orange-900">{stats.totalTests}</div>
          </div>
          <div className={`p-3 rounded-lg border ${
            stats.improvement >= 0 
              ? 'bg-emerald-50 border-emerald-100' 
              : 'bg-red-50 border-red-100'
          }`}>
            <div className={`text-xs font-medium ${
              stats.improvement >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              Improvement
            </div>
            <div className={`text-lg font-bold ${
              stats.improvement >= 0 ? 'text-emerald-900' : 'text-red-900'
            }`}>
              {stats.improvement >= 0 ? '+' : ''}{stats.improvement}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="text-xs text-gray-600 font-medium">Range</div>
            <div className="text-lg font-bold text-gray-900">{stats.minWpm}-{stats.maxWpm}</div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white p-4 rounded-xl border border-gray-200" style={{ height: '400px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Recent Tests Table */}
      {filteredData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-2 text-gray-600 font-medium">Date</th>
                  <th className="pb-2 text-gray-600 font-medium">Mode</th>
                  <th className="pb-2 text-gray-600 font-medium">WPM</th>
                  <th className="pb-2 text-gray-600 font-medium">Accuracy</th>
                  <th className="pb-2 text-gray-600 font-medium">Duration</th>
                  <th className="pb-2 text-gray-600 font-medium">XP</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(-10).reverse().map((test) => (
                  <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 text-gray-900">
                      {new Date(test.date).toLocaleDateString()}
                    </td>
                    <td className="py-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded capitalize">
                        {test.mode}
                      </span>
                    </td>
                    <td className="py-2 font-mono font-semibold text-blue-600">
                      {test.wpm}
                    </td>
                    <td className="py-2 font-mono font-semibold text-green-600">
                      {test.accuracy.toFixed(1)}%
                    </td>
                    <td className="py-2 text-gray-600">
                      {test.duration}s
                    </td>
                    <td className="py-2 font-semibold text-purple-600">
                      +{test.xpGained}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}