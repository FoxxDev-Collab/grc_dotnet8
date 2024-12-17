A comprehensive Governance, Risk, and Compliance (GRC) and Risk Management Framework (RMF) platform designed to help organizations manage their security compliance and assessment processes.

## Features

- Risk Management
- Incident Management
- Asset Management
- Business Continuity Plans
- Compliance Management
- Data Privacy
- Project Management/POA&Ms
- Online Assessments
- Interactive Reports
- Compliance Progress Tracking
- Port, Protocol, and Service Tracking
- Hardware/Software Inventory
- Evidence/Artifact Management
- Complete Audit Capabilities

## Tech Stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- Backend: NestJS, TypeScript, Prisma ORM
- Database: PostgreSQL
- Caching: Redis (planned)
- Containerization: Docker

## Getting Started

### Prerequisites

- Node.js 20.x or later
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/securecenter-grc.git
   cd securecenter-grc
   ```

2. Copy the environment file and update the values:
   ```bash
   cp .env.example .env
   ```

3. Start the development environment:
   ```bash
   docker-compose up -d
   ```

4. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api

### Development

- Frontend development server:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

- Backend development server:
  ```bash
  cd backend
  npm install
  npm run start:dev
  ```

## Project Structure

```
grc-platform/
├── frontend/           # Next.js frontend application
├── backend/           # NestJS backend application
├── docker/            # Docker configuration files
├── docker-compose.yml # Container orchestration
├── .env.example      # Environment variable template
└── README.md         # Project documentation
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.