## [verdant](https://verdant-delta-ashen.vercel.app/) 

**Fighting urban heat islands through data-driven green infrastructure planning.**

Urban areas experience higher temperatures overtime creating dangerous conditions for millions of residents. Vulnerable communities suffer the most by facing higher energy costs, increased health risks, and degraded quality of life.

**Verdant empowers cities to combat with actionable climate intelligence.**

## Our Mission

We believe every city deserves the tools to build a cooler, greener future. Verdant transforms complex satellite and sensor data into clear recommendations for where to plant trees, build parks, install green roofs, and implement cooling infrastructure. Verdant strives to help communities choose the best areas to build infrastructure to reduce environmental degradation and the effect of climate change.

**The goal is simple:** reduce urban temperatures, protect vulnerable populations, and make cities livable for generations to come.

## What verdant Does

- **Visualizes heat patterns** across Canadian cities using satellite thermal data
- **Identifies hotspots** where residents face the greatest heat exposure
- **Recommends green infrastructure** with projected cooling effects and cost estimates
- **Tracks progress** with historical temperature trends and impact projections

## Data & Methodology

Verdant is a climate resilience dashboard that visualizes urban heat using real NASA POWER temperature data. To estimate heat-island intensity, verdant compares temperatures at a city’s center coordinates (“urban”) to a nearby “rural reference” point located ~50 km north of the city center. This offset acts as a simple baseline outside the dense core; the temperature difference (urban − rural) is shown as the heat-island signal, alongside trends and infrastructure recommendations.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)


## Tech Stack

Next.js 16 · React 19 · TailwindCSS · Leaflet · Recharts · Zustand






