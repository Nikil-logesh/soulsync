# Docker Commands for Mental Wellness App

## Basic Commands (After Docker Desktop is installed)

# 1. Build and start all services
docker-compose up --build

# 2. Run in background (detached mode)
docker-compose up -d --build

# 3. Stop all services
docker-compose down

# 4. View logs
docker-compose logs web
docker-compose logs -f web  # Follow logs

# 5. Build specific service
docker-compose build web

# 6. Start specific service
docker-compose up web

## Development Workflow

# 1. First time setup
docker-compose up --build

# 2. Make changes to code (auto-reload with volumes)
# Just edit your files, changes will reflect automatically

# 3. Rebuild after package.json changes
docker-compose down
docker-compose up --build

# 4. Clean rebuild (remove cache)
docker-compose down
docker system prune -a
docker-compose up --build

## Useful Commands

# Check running containers
docker ps

# Check all containers
docker ps -a

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# View container logs
docker logs <container_name>

# Execute commands inside container
docker exec -it <container_name> /bin/sh

# Check disk usage
docker system df

## Troubleshooting

# If port 3000 is busy
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# If Docker won't start
- Restart Docker Desktop
- Enable WSL 2
- Check Windows features (Hyper-V, Containers)

# If build fails
- Check Dockerfile syntax
- Verify all files exist
- Check .dockerignore

## Environment Files

# Use .env.docker for production settings
docker-compose --env-file .env.docker up

# Override environment variables
NEXT_PUBLIC_API_URL=http://localhost:3000 docker-compose up