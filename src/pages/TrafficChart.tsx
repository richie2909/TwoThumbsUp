// src/components/TrafficChart.tsx
import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const TrafficChart: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'views' | 'likes' | 'tags'>('views');
  const [chartData, setChartData] = useState<{
    views: ChartData<'line', number[], string>;
    likes: ChartData<'bar', number[], string>;
    tags: ChartData<'doughnut', number[], string>;
  }>({
    views: {
      labels: [],
      datasets: [],
    },
    likes: {
      labels: [],
      datasets: [],
    },
    tags: {
      labels: [],
      datasets: [],
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateRandomData = (min: number, max: number, count: number) => {
      return Array.from({ length: count }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
      );
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch this data from an API
        // For now, we'll use the current month to generate the last 7 days
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(today.getDate() - 6 + i);
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        });

        // Generate random data for views, likes, and uploads
        const viewsData = generateRandomData(50, 500, 7);
        const likesData = generateRandomData(10, 100, 7);
        const uploadsData = generateRandomData(1, 15, 7);

        // Get top 5 popular tags
        const tagLabels = ['Motivational', 'Inspirational', 'Success', 'Love', 'Wisdom'];
        const tagCounts = generateRandomData(5, 30, 5);

        setChartData({
          views: {
            labels: last7Days,
            datasets: [
              {
                label: 'Page Views',
                data: viewsData,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.4,
              }
            ],
          },
          likes: {
            labels: last7Days,
            datasets: [
              {
                label: 'Likes',
                data: likesData,
                backgroundColor: 'rgba(255,99,132,0.5)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
              },
              {
                label: 'Uploads',
                data: uploadsData,
                backgroundColor: 'rgba(54,162,235,0.5)',
                borderColor: 'rgba(54,162,235,1)',
                borderWidth: 1,
              }
            ],
          },
          tags: {
            labels: tagLabels,
            datasets: [
              {
                data: tagCounts,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)',
                  'rgba(153, 102, 255, 0.7)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
              },
            ],
          },
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const viewsOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Page Views',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const likesOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Likes & Uploads',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const tagsOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Popular Tags',
        font: {
          size: 16,
        },
      },
    },
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    switch (activeChart) {
      case 'views':
        return <Line data={chartData.views} options={viewsOptions} />;
      case 'likes':
        return <Bar data={chartData.likes} options={likesOptions} />;
      case 'tags':
        return <Doughnut data={chartData.tags} options={tagsOptions} />;
      default:
        return <Line data={chartData.views} options={viewsOptions} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-wrap gap-2 mb-4 border-b pb-3">
        <button
          onClick={() => setActiveChart('views')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeChart === 'views'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Page Views
        </button>
        <button
          onClick={() => setActiveChart('likes')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeChart === 'likes'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Likes & Uploads
        </button>
        <button
          onClick={() => setActiveChart('tags')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeChart === 'tags'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Popular Tags
        </button>
      </div>
      <div className="h-80">
        {renderChart()}
      </div>
    </div>
  );
};

export default TrafficChart;
 