# Sakshi Platform - Advanced Analytics Implementation

## Overview

This guide provides complete implementation for advanced analytics dashboards and reporting systems for the Sakshi platform. These dashboards enable data-driven decision making across all aspects of the business.

---

## 📊 Analytics Architecture

### Technology Stack
- **Frontend:** React + TypeScript
- **Charts:** Chart.js + React-Chartjs-2
- **Data Visualization:** D3.js for custom visualizations
- **Real-time Updates:** WebSockets or Server-Sent Events
- **Export:** jsPDF for PDF reports, xlsx for Excel
- **Date Handling:** date-fns

### Key Dashboards
1. **Executive Dashboard** - High-level business metrics
2. **Operations Dashboard** - Cafe operations and efficiency
3. **Marketing Dashboard** - Customer acquisition and retention
4. **Impact Dashboard** - Social and environmental metrics
5. **Financial Dashboard** - Revenue, costs, profitability
6. **Inventory Dashboard** - Stock levels and waste tracking

---

## 🎯 Dashboard Implementations

### 1. Executive Dashboard

```typescript
// client/src/pages/analytics/ExecutiveDashboard.tsx
import React, { useState } from 'react';
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
  Filler,
} from 'chart.js';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <i className={`fas fa-${icon} text-${color}-600 text-2xl`}></i>
      </div>
      <span className={`text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
      </span>
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const ExecutiveDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock data - replace with actual API calls
  const kpis = [
    { title: 'Total Revenue', value: '₹8.2L', change: 12.5, icon: 'rupee-sign', color: 'green' },
    { title: 'Active Users', value: '2,847', change: 8.3, icon: 'users', color: 'blue' },
    { title: 'Orders Today', value: '142', change: -3.2, icon: 'shopping-cart', color: 'purple' },
    { title: 'Avg Order Value', value: '₹285', change: 5.7, icon: 'chart-line', color: 'orange' },
  ];

  // Revenue trend data
  const revenueTrendData = {
    labels: Array.from({ length: 30 }, (_, i) => format(subDays(new Date(), 29 - i), 'MMM dd')),
    datasets: [
      {
        label: 'Revenue',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30000) + 20000),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Pricing tier distribution
  const pricingTierData = {
    labels: ['Community', 'Fair', 'Supporter'],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  // Top menu items
  const topMenuData = {
    labels: ['Satvic Bowl', 'Green Smoothie', 'Quinoa Salad', 'Veggie Wrap', 'Fruit Platter'],
    datasets: [
      {
        label: 'Orders',
        data: [245, 198, 176, 154, 132],
        backgroundColor: '#10b981',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Executive Dashboard</h1>
          <p className="text-gray-600">Real-time overview of business performance</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium ${
                timeRange === range
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Trend */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
            <Line
              data={revenueTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `₹${context.parsed.y.toLocaleString()}`,
                    },
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      callback: (value) => `₹${(value as number / 1000).toFixed(0)}K`,
                    },
                  },
                },
              }}
              height={300}
            />
          </div>

          {/* Pricing Tier Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing Tier Distribution</h2>
            <Doughnut
              data={pricingTierData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.label}: ${context.parsed}%`,
                    },
                  },
                },
              }}
              height={300}
            />
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Menu Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Menu Items</h2>
            <Bar
              data={topMenuData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
              height={300}
            />
          </div>

          {/* Impact Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Impact Metrics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Meals Served</p>
                  <p className="text-2xl font-bold text-gray-900">12,847</p>
                </div>
                <i className="fas fa-utensils text-green-600 text-3xl"></i>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">CO₂ Saved</p>
                  <p className="text-2xl font-bold text-gray-900">2.4 tonnes</p>
                </div>
                <i className="fas fa-leaf text-blue-600 text-3xl"></i>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Meals Sponsored</p>
                  <p className="text-2xl font-bold text-gray-900">1,245</p>
                </div>
                <i className="fas fa-heart text-purple-600 text-3xl"></i>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Farmers Supported</p>
                  <p className="text-2xl font-bold text-gray-900">48</p>
                </div>
                <i className="fas fa-tractor text-orange-600 text-3xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
```

### 2. Operations Dashboard

```typescript
// client/src/pages/analytics/OperationsDashboard.tsx
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

const OperationsDashboard: React.FC = () => {
  // Inventory levels
  const inventoryData = {
    labels: ['Vegetables', 'Fruits', 'Grains', 'Spices', 'Oils', 'Nuts'],
    datasets: [
      {
        label: 'Current Stock (kg)',
        data: [45, 32, 78, 12, 25, 18],
        backgroundColor: '#10b981',
      },
      {
        label: 'Minimum Required (kg)',
        data: [50, 30, 80, 15, 20, 15],
        backgroundColor: '#ef4444',
      },
    ],
  };

  // Waste tracking
  const wasteData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Food Waste (kg)',
        data: [2.3, 1.8, 2.1, 1.5, 2.7, 3.2, 2.9],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
      },
      {
        label: 'Composted (kg)',
        data: [2.3, 1.8, 2.1, 1.5, 2.7, 3.2, 2.9],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      },
    ],
  };

  // Staff efficiency
  const staffData = [
    { name: 'Priya', role: 'Chef', ordersCompleted: 142, avgTime: '12 min', rating: 4.8 },
    { name: 'Raj', role: 'Chef', ordersCompleted: 138, avgTime: '13 min', rating: 4.7 },
    { name: 'Anita', role: 'Server', ordersServed: 245, avgTime: '8 min', rating: 4.9 },
    { name: 'Kiran', role: 'Server', ordersServed: 238, avgTime: '9 min', rating: 4.8 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Operations Dashboard</h1>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Orders in Queue</h3>
              <i className="fas fa-clock text-orange-600"></i>
            </div>
            <p className="text-3xl font-bold text-gray-900">8</p>
            <p className="text-sm text-gray-500 mt-1">Avg wait: 15 min</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Tables Occupied</h3>
              <i className="fas fa-chair text-blue-600"></i>
            </div>
            <p className="text-3xl font-bold text-gray-900">18/25</p>
            <p className="text-sm text-gray-500 mt-1">72% occupancy</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Waste Today</h3>
              <i className="fas fa-trash-alt text-red-600"></i>
            </div>
            <p className="text-3xl font-bold text-gray-900">2.1kg</p>
            <p className="text-sm text-green-600 mt-1">↓ 15% vs yesterday</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Staff On Duty</h3>
              <i className="fas fa-users text-green-600"></i>
            </div>
            <p className="text-3xl font-bold text-gray-900">8/10</p>
            <p className="text-sm text-gray-500 mt-1">2 on break</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Inventory Levels */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Levels</h2>
            <Bar
              data={inventoryData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Kilograms' },
                  },
                },
              }}
              height={300}
            />
          </div>

          {/* Waste Tracking */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Waste Tracking</h2>
            <Line
              data={wasteData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Kilograms' },
                  },
                },
              }}
              height={300}
            />
          </div>
        </div>

        {/* Staff Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Staff Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffData.map((staff, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.role === 'Chef' ? staff.ordersCompleted : staff.ordersServed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.avgTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{staff.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboard;
```

---

## 📈 Report Generation

### PDF Report Generator

```typescript
// server/services/reports/pdf-generator.ts
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportData {
  title: string;
  period: string;
  sections: ReportSection[];
}

export interface ReportSection {
  title: string;
  type: 'kpi' | 'table' | 'chart';
  data: any;
}

export const generatePDFReport = (data: ReportData): Buffer => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.text(data.title, 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.text(data.period, 20, yPosition);
  yPosition += 15;

  // Sections
  data.sections.forEach((section) => {
    doc.setFontSize(16);
    doc.text(section.title, 20, yPosition);
    yPosition += 10;

    if (section.type === 'kpi') {
      // Render KPIs
      section.data.forEach((kpi: any) => {
        doc.setFontSize(12);
        doc.text(`${kpi.label}: ${kpi.value}`, 20, yPosition);
        yPosition += 7;
      });
    } else if (section.type === 'table') {
      // Render table
      autoTable(doc, {
        startY: yPosition,
        head: [section.data.headers],
        body: section.data.rows,
      });
      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    yPosition += 10;

    // Add new page if needed
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });

  return Buffer.from(doc.output('arraybuffer'));
};
```

### Excel Report Generator

```typescript
// server/services/reports/excel-generator.ts
import * as XLSX from 'xlsx';

export interface ExcelReportData {
  sheets: ExcelSheet[];
}

export interface ExcelSheet {
  name: string;
  data: any[][];
}

export const generateExcelReport = (data: ExcelReportData): Buffer => {
  const workbook = XLSX.utils.book_new();

  data.sheets.forEach((sheet) => {
    const worksheet = XLSX.utils.aoa_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  });

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
};
```

---

## 🔄 Real-time Updates

### WebSocket Setup

```typescript
// server/services/websocket.ts
import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });
});

export const broadcastUpdate = (event: string, data: any) => {
  const message = JSON.stringify({ event, data });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Broadcast when new order is placed
export const notifyNewOrder = (order: any) => {
  broadcastUpdate('new_order', order);
};

// Broadcast when metrics update
export const notifyMetricsUpdate = (metrics: any) => {
  broadcastUpdate('metrics_update', metrics);
};
```

### Client-side WebSocket

```typescript
// client/src/hooks/useRealTimeMetrics.ts
import { useEffect, useState } from 'react';

export const useRealTimeMetrics = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const { event: eventType, data } = JSON.parse(event.data);
      
      if (eventType === 'metrics_update') {
        setMetrics(data);
      }
    };

    return () => ws.close();
  }, []);

  return metrics;
};
```

---

## 📊 Custom Visualizations with D3.js

### Impact Visualization

```typescript
// client/src/components/analytics/ImpactVisualization.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ImpactData {
  category: string;
  value: number;
  target: number;
}

const ImpactVisualization: React.FC<{ data: ImpactData[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };

    svg.selectAll('*').remove();

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.value, d.target)) || 100])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([margin.top, height - margin.bottom])
      .padding(0.3);

    // Target bars (light)
    svg.selectAll('.target-bar')
      .data(data)
      .join('rect')
      .attr('class', 'target-bar')
      .attr('x', margin.left)
      .attr('y', d => y(d.category)!)
      .attr('width', d => x(d.target) - margin.left)
      .attr('height', y.bandwidth())
      .attr('fill', '#e5e7eb');

    // Actual bars (colored)
    svg.selectAll('.actual-bar')
      .data(data)
      .join('rect')
      .attr('class', 'actual-bar')
      .attr('x', margin.left)
      .attr('y', d => y(d.category)!)
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', '#10b981')
      .transition()
      .duration(1000)
      .attr('width', d => x(d.value) - margin.left);

    // Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

  }, [data]);

  return <svg ref={svgRef} width={600} height={400}></svg>;
};

export default ImpactVisualization;
```

---

## 🎯 Next Steps

1. **Install dependencies** for charts and reports
2. **Implement dashboards** using the code above
3. **Connect to real data** via tRPC APIs
4. **Set up WebSocket** for real-time updates
5. **Add export functionality** for PDF/Excel reports
6. **Create scheduled reports** (daily, weekly, monthly)
7. **Add user permissions** for different dashboard access
8. **Optimize performance** with data caching
9. **Add mobile responsiveness** for all dashboards
10. **Create custom visualizations** for unique metrics

---

**Advanced analytics system ready to implement!** 📊📈

This provides complete dashboards for data-driven decision making across all aspects of the Sakshi platform.
