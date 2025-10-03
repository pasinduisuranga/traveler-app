import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [analytics, setAnalytics] = useState({
    bookingTrends: [],
    revenueData: [],
    experiencePerformance: [],
    customerDemographics: {},
    sustainabilityMetrics: {},
    topExperiences: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/api/providers/1/analytics?range=${timeRange}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock data
      setAnalytics({
        bookingTrends: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 42],
        revenueData: [1020, 1615, 1275, 2125, 1870, 2550, 2380, 2975, 2720, 3400, 3230, 3570],
        experiencePerformance: [
          { name: 'Sinharaja Trek', bookings: 24, revenue: 2040, rating: 4.8 },
          { name: 'Whale Watching', bookings: 18, revenue: 2160, rating: 4.5 },
          { name: 'Bird Watching', bookings: 8, revenue: 600, rating: 4.7 }
        ],
        customerDemographics: {
          ageGroups: { '18-25': 15, '26-35': 35, '36-45': 25, '46-55': 15, '56+': 10 },
          countries: { 'USA': 30, 'UK': 20, 'Germany': 15, 'Australia': 12, 'Others': 23 },
          groupTypes: { 'Solo': 25, 'Couple': 35, 'Family': 20, 'Group': 20 }
        },
        sustainabilityMetrics: {
          carbonOffset: 156.5,
          localEconomyContribution: 3240,
          conservationDonations: 648,
          travelersEducated: 156,
          plasticEliminated: 234
        },
        topExperiences: [
          { id: 1, title: 'Sinharaja Trek', bookings: 24, growth: 15 },
          { id: 2, title: 'Whale Watching', bookings: 18, growth: 8 },
          { id: 3, title: 'Bird Watching', bookings: 8, growth: 12 }
        ]
      });
    }
  };

  const bookingChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Bookings',
      data: analytics.bookingTrends,
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Revenue ($)',
      data: analytics.revenueData,
      backgroundColor: '#2196f3',
      borderColor: '#1976d2',
      borderWidth: 1
    }]
  };

  const demographicsChartData = {
    labels: Object.keys(analytics.customerDemographics.ageGroups || {}),
    datasets: [{
      label: 'Age Distribution',
      data: Object.values(analytics.customerDemographics.ageGroups || {}),
      backgroundColor: [
        '#ff6384',
        '#36a2eb',
        '#ffce56',
        '#4bc0c0',
        '#9966ff'
      ]
    }]
  };

  return (
    <div className="page-container">
      <h2 className="page-title">📊 Advanced Analytics</h2>

      {/* Time Range Selector */}
      <div className="analytics-controls card">
        <div className="time-range-buttons">
          <button 
            className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            This Week
          </button>
          <button 
            className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            This Month
          </button>
          <button 
            className={`range-btn ${timeRange === 'quarter' ? 'active' : ''}`}
            onClick={() => setTimeRange('quarter')}
          >
            This Quarter
          </button>
          <button 
            className={`range-btn ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            This Year
          </button>
        </div>
        <button className="button secondary">Export Report</button>
      </div>

      {/* Key Performance Indicators */}
      <div className="kpi-grid">
        <div className="kpi-card card">
          <div className="kpi-icon">📈</div>
          <div className="kpi-content">
            <h3>42</h3>
            <p>Total Bookings</p>
            <span className="kpi-change positive">+23.5%</span>
          </div>
        </div>
        <div className="kpi-card card">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <h3>$3,840</h3>
            <p>Total Revenue</p>
            <span className="kpi-change positive">+18.2%</span>
          </div>
        </div>
        <div className="kpi-card card">
          <div className="kpi-icon">⭐</div>
          <div className="kpi-content">
            <h3>4.6/5</h3>
            <p>Avg Rating</p>
            <span className="kpi-change positive">+0.2</span>
          </div>
        </div>
        <div className="kpi-card card">
          <div className="kpi-icon">🌍</div>
          <div className="kpi-content">
            <h3>156</h3>
            <p>Travelers</p>
            <span className="kpi-change positive">+12.8%</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card card">
          <h3>Booking Trends</h3>
          <div className="chart-container">
            <Line data={bookingChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-card card">
          <h3>Revenue by Month</h3>
          <div className="chart-container">
            <Bar data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-card card">
          <h3>Customer Age Distribution</h3>
          <div className="chart-container">
            <Pie data={demographicsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-card card">
          <h3>Top Countries</h3>
          <div className="country-list">
            {Object.entries(analytics.customerDemographics.countries || {}).map(([country, percentage]) => (
              <div key={country} className="country-row">
                <span className="country-name">{country}</span>
                <div className="country-bar">
                  <div 
                    className="country-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="country-percentage">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Performance */}
      <div className="experience-performance card">
        <h3>Experience Performance</h3>
        <div className="performance-table">
          <div className="table-header">
            <span>Experience</span>
            <span>Bookings</span>
            <span>Revenue</span>
            <span>Rating</span>
            <span>Growth</span>
          </div>
          {analytics.experiencePerformance.map((exp, index) => (
            <div key={index} className="table-row">
              <span className="exp-name">{exp.name}</span>
              <span className="exp-bookings">{exp.bookings}</span>
              <span className="exp-revenue">${exp.revenue}</span>
              <span className="exp-rating">{exp.rating} ⭐</span>
              <span className="exp-growth positive">+{analytics.topExperiences[index]?.growth || 0}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainability Impact */}
      <div className="sustainability-impact-analytics card">
        <h3>🌱 Sustainability Impact Metrics</h3>
        <div className="impact-metrics-grid">
          <div className="impact-metric">
            <div className="metric-icon">🌿</div>
            <div className="metric-info">
              <h4>{analytics.sustainabilityMetrics.carbonOffset} kg</h4>
              <p>Carbon Offset</p>
            </div>
          </div>
          <div className="impact-metric">
            <div className="metric-icon">💵</div>
            <div className="metric-info">
              <h4>${analytics.sustainabilityMetrics.localEconomyContribution}</h4>
              <p>Local Economy Contribution</p>
            </div>
          </div>
          <div className="impact-metric">
            <div className="metric-icon">🏞️</div>
            <div className="metric-info">
              <h4>${analytics.sustainabilityMetrics.conservationDonations}</h4>
              <p>Conservation Donations</p>
            </div>
          </div>
          <div className="impact-metric">
            <div className="metric-icon">🎓</div>
            <div className="metric-info">
              <h4>{analytics.sustainabilityMetrics.travelersEducated}</h4>
              <p>Travelers Educated</p>
            </div>
          </div>
          <div className="impact-metric">
            <div className="metric-icon">♻️</div>
            <div className="metric-info">
              <h4>{analytics.sustainabilityMetrics.plasticEliminated} kg</h4>
              <p>Plastic Eliminated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="customer-insights card">
        <h3>Customer Insights</h3>
        <div className="insights-grid">
          <div className="insight-item">
            <h4>Group Types</h4>
            {Object.entries(analytics.customerDemographics.groupTypes || {}).map(([type, percentage]) => (
              <div key={type} className="insight-bar">
                <span>{type}</span>
                <div className="bar">
                  <div className="fill" style={{ width: `${percentage}%` }}></div>
                </div>
                <span>{percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;