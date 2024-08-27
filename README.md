Task Queue Application

Description:
A task queue application using Node.js, Redis, and Nginx with rate limiting and task processing features. This application demonstrates task queuing, processing, and logging using Redis as the task queue and Nginx as a reverse proxy.

Getting Started:

Prerequisites:
- Docker
- Docker Compose

Running the Application:
1. Clone the repository:
   git clone <repository-url>
   cd task-queue-app

2. Build and run the containers:
   docker-compose up --build

3. Access the application:
   - The application will be available at http://localhost.
   - Use the /api/v1/task endpoint to POST tasks.

Endpoints:
- POST /api/v1/task
  - Description: Adds a task to the queue and processes it.
  - Request Body:
    {
      "user_id": "123",
      "task_data": "sample data"
    }
  - Response:
    {
      "message": "Task queued successfully"
    }

Docker Setup:
The application uses Docker for containerization. The following services are defined in docker-compose.yml:
- app1 and app2: Node.js applications handling task processing.
- redis: Redis server used as the task queue.
- nginx: Nginx server used as a reverse proxy.

Configuration:
- Nginx Configuration: The Nginx configuration file is located at nginx.conf. It routes requests to the appropriate Node.js application based on the URL path.
- Redis Configuration: Redis is configured to listen on the default port 6379.

Logs:
Logs for task completion are stored in the logs directory. The log files are named task-completion-<user_id>.log.

Stopping the Application:
To stop the application and remove the containers, use:
docker-compose down

Troubleshooting:
- File Generation Issues: Ensure the logs directory exists and has the correct permissions. If running inside Docker, check that volume mounting is correctly configured.
- Redis Connection Errors: Ensure Redis is running and accessible at redis://redis:6379. Verify Redis container status with docker logs <redis_container_id>.

Contribution:
Contributions are welcome! Please create a pull request or open an issue to discuss changes.
