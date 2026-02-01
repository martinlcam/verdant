# UrbanHeat - Climate Resilience Dashboard

A modern, interactive dashboard for visualizing urban heat islands and planning green infrastructure interventions in Canadian cities.

![UrbanHeat Dashboard](https://via.placeholder.com/1200x600/10b981/ffffff?text=UrbanHeat+Dashboard)

## Features

### Heat Mapping
- **Interactive heat map** with satellite thermal data overlays
- **Heat zone visualization** with severity indicators (low, moderate, high, extreme)
- **Temperature differential analysis** showing urban vs. rural temperature differences
- **NDVI vegetation index** display for each data point

### City Analytics
- **10 Canadian cities** pre-configured (Toronto, Montreal, Vancouver, Calgary, Ottawa, Edmonton, Winnipeg, Quebec City, Hamilton, Halifax)
- **Real-time statistics** including:
  - Urban/rural temperature comparison
  - Heat island intensity metrics
  - Hotspot zone counts
  - Green coverage percentages
  - Vulnerable population estimates

### Green Infrastructure Recommendations
- **AI-powered suggestions** for optimal green infrastructure placement
- **Project types include**: Urban parks, green roofs, tree planting, cool pavements, bioswales, permeable surfaces, water features
- **Impact projections** showing estimated temperature reduction
- **Cost-benefit analysis** with priority scoring

### Time-Series Analysis
- **12-month temperature trends** visualization
- **Time slider control** for historical data exploration
- **Seasonal pattern analysis**

### Data Export
- **CSV reports** for heat zone data
- **JSON export** for full data sets
- **Map snapshots** for presentations

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI primitives
- **State Management**: Zustand
- **Data Visualization**: Recharts
- **Mapping**: Leaflet with React-Leaflet
- **Icons**: Lucide React
- **Utilities**: date-fns, clsx, tailwind-merge

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd verdant

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
verdant/
├── app/
│   ├── globals.css      # Global styles and Leaflet overrides
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main dashboard page
├── components/
│   ├── analytics/       # Charts and statistics components
│   │   ├── HeatZoneList.tsx
│   │   ├── ImpactProjections.tsx
│   │   ├── StatsCards.tsx
│   │   └── TemperatureChart.tsx
│   ├── controls/        # User interaction controls
│   │   └── TimeSlider.tsx
│   ├── export/          # Data export functionality
│   │   └── ExportPanel.tsx
│   ├── layout/          # Layout components
│   │   ├── DashboardShell.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── map/             # Map visualization
│   │   └── HeatMap.tsx
│   ├── recommendations/ # Green infrastructure recommendations
│   │   └── RecommendationsPanel.tsx
│   └── ui/              # Reusable UI primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── select.tsx
│       ├── slider.tsx
│       ├── tabs.tsx
│       └── tooltip.tsx
├── lib/
│   ├── data.ts          # Mock data generators
│   ├── store.ts         # Zustand state management
│   └── utils.ts         # Utility functions
├── types/
│   └── index.ts         # TypeScript type definitions
└── public/              # Static assets
```

## Future Enhancements

### Phase 2: Real Data Integration
- NASA Landsat API integration for real thermal imagery
- NOAA weather data for current conditions
- Municipal sensor network connections

### Phase 3: AI/ML Features
- Machine learning models for heat pattern prediction
- Automated green space recommendations
- Climate scenario modeling

### Phase 4: Collaboration
- User accounts and saved views
- Multi-user collaboration
- Report generation for city planning

## Data Sources (Planned)

- **NASA Landsat Program**: Thermal infrared bands for surface temperature
- **NOAA Climate Data**: Historical weather patterns and forecasts
- **USGS EarthExplorer**: Satellite imagery and elevation data
- **OpenStreetMap**: Base maps and infrastructure data
- **Environment Canada**: Canadian weather and climate data

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- NASA for satellite imagery data programs
- NOAA for climate data accessibility
- OpenStreetMap contributors for base mapping data
- The React and Next.js communities for excellent tooling
