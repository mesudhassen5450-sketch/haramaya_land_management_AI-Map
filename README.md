# Haramaya Land Management System (HLMS)

The Haramaya Land Management System is a comprehensive digital platform designed for Haramaya Wereda and Sub-city administrations. It streamlines property tax assessment, land registration, GIS visualization, and citizen self-service.

## Core Features

- **Digital Land Registration**: Efficiently register and document land parcels.
- **Property Tax Management**: Transparent assessment and history center for citizens.
- **Citizen Portal**: Personal dashboard for managing assets, disputes, and digital certificates.
- **GIS Integration**: High-precision spatial mapping for boundary management.
- **Bilingual Support**: Fully localized in English and Afan Oromo.

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Visualization**: Recharts, Lucide Icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your Supabase credentials.

4. Start Development Server:
   ```sh
   npm run dev
   ```

## Deployment on Vercel

To deploy this project on Vercel, follow these steps:

### 1. Push to GitHub
Ensure your latest changes are pushed to a GitHub repository.

### 2. Import Project to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **New Project** and import your GitHub repository.

### 3. Configure Project
- **Framework Preset**: Vite (detected automatically).
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. Environment Variables
You MUST add the following environment variables in the Vercel dashboard:
- `VITE_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase Anonymous/Publishable Key.

### 5. Deploy
Click **Deploy**. Vercel will build the project and provide a live URL.

> [!NOTE]
> The `vercel.json` file in the root ensures that client-side routing (React Router) works correctly by rewriting all requests to `index.html`.

## Deployment on Netlify

To deploy this project on Netlify, follow these steps:

### 1. Push to GitHub
Ensure your latest changes are pushed to a GitHub repository.

### 2. Import Project to Netlify
1. Log in to [Netlify](https://www.netlify.com).
2. Click **Add new site** > **Import an existing project**.
3. Connect your GitHub account and select the repository.

### 3. Configure Build Settings
- **Base directory**: `02`
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 4. Environment Variables
In the Netlify dashboard, go to **Site settings** > **Environment variables** and add:
- `VITE_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase Anonymous/Publishable Key.

### 5. Deploy
Click **Deploy site**. Netlify will build and host your application.

> [!NOTE]
> The `netlify.toml` file in the `02` folder automatically handles these build settings and ensures client-side routing works for Single Page Applications (SPA).

## Administrative Features

HLMS includes a modular administrative dashboard for:
- GIS Spatial Updates
- Property Valuation Adjustments
- Dispute Mediation
- Revenue Reporting

## License

All rights reserved. Haramaya Wereda Administration.
