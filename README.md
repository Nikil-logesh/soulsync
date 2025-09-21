# Mental Wellness App

## Overview
The Mental Wellness App is designed to provide users with tools and resources to enhance their mental well-being. The application consists of a Next.js frontend and a FastAPI backend, allowing for a seamless user experience and efficient data handling.

## Features
- **User-friendly interface**: Built with Next.js, providing a responsive and intuitive design.
- **Mental health resources**: Access to psychoeducational content and tools for mood tracking.
- **Real-time chat**: Engage with mental health professionals and peers.
- **Data privacy**: User data is handled with the utmost care, ensuring confidentiality and security.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- Python (version 3.8 or higher)
- Docker (for local development)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mental-wellness-app.git
   cd mental-wellness-app
   ```

2. Install frontend dependencies:
   ```
   cd apps/web
   npm install
   ```

3. Install backend dependencies:
   ```
   cd ../backend
   pip install -r requirements.txt
   ```

4. Set up Docker containers:
   ```
   docker-compose up
   ```

### Running the Application

- To run the frontend:
  ```
  cd apps/web
  npm run dev
  ```

- To run the backend:
  ```
  cd apps/backend
  uvicorn app.main:app --reload
  ```

## Directory Structure
- **apps/**: Contains the frontend and backend applications.
- **packages/**: Shared libraries and components.
- **data/**: Datasets and psychoeducational content.
- **scripts/**: Automation scripts for various tasks.
- **docs/**: Project documentation and API contracts.

## Contributing
We welcome contributions! Please read our [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.