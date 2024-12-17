# SecureCenter GRC/RMF Frontend

This is the frontend application for SecureCenter GRC/RMF, a comprehensive platform for managing Authority to Operate (ATO) processes.

## Features

- Dual authentication flows (Service Provider & Client)
- Role-based access control
- Dashboard with key metrics
- Document management
- Control assessment tracking
- Organization management

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- API Integration with Backend Services

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   │   ├── admin/         # Service provider auth
│   │   │   ├── login/     # Admin login
│   │   │   └── register/  # Admin registration
│   │   └── client/        # Client organization auth
│   │       ├── login/     # Client login
│   │       └── register/  # Client registration
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── layout.tsx     # Dashboard layout with navigation
│   │   └── dashboard/     # Main dashboard page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── lib/                   # Utility functions and API client
│   └── api.ts            # API integration utilities
├── middleware.ts         # Authentication middleware
└── public/              # Static assets
```

## Authentication Flows

The application supports two distinct authentication flows:

1. **Service Provider Authentication**
   - For organizations providing ATO as a Service
   - Access to management and assessment features
   - Located at `/auth/admin/login`
   - Registration at `/auth/admin/register`

2. **Client Authentication**
   - For organizations seeking ATO
   - Access to documentation and submission features
   - Located at `/auth/client/login`
   - Registration at `/auth/client/register`

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Development

### API Integration

The `lib/api.ts` file contains the API client for interacting with the backend services. All API calls should be made through this utility to ensure consistent error handling and authentication.

### Authentication

Authentication is handled through JWT tokens stored in cookies. The middleware ensures protected routes are only accessible to authenticated users and directs users to the appropriate login flow based on their role.

### Styling

The application uses Tailwind CSS for styling with a custom theme configuration. The theme colors and other design tokens are defined in the `tailwind.config.ts` file.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

[MIT License](LICENSE)
