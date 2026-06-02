# Docker Deployment Guide

## Prerequisites
- Docker and Docker Compose installed
- `.env.local` file with `GEMINI_API_KEY` set
- Firebase configuration (handled by environment)

## Build the Docker Image

```bash
# Build the image with a tag
docker build -t eglaptop:latest .

# Or use docker-compose to build
docker-compose build
```

## Run Locally (for testing)

```bash
# Using docker-compose (recommended)
docker-compose up -d

# Or run the image directly
docker run -p 3000:3000 \
  --env-file .env.local \
  eglaptop:latest
```

## Verify the Container

```bash
# Check if the container is running
docker ps

# View logs
docker logs <container-id>

# Test the health check
curl http://localhost:3000/api/health
```

## Deploy to Production

### Option 1: Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag eglaptop:latest your-username/eglaptop:latest

# Push to registry
docker push your-username/eglaptop:latest
```

### Option 2: Private Registry (AWS ECR, GCP, etc.)

```bash
# Login to your registry
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Tag the image
docker tag eglaptop:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/eglaptop:latest

# Push to registry
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/eglaptop:latest
```

### Option 3: Kubernetes (K8s)

Create a deployment manifest (`k8s-deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: eglaptop
spec:
  replicas: 3
  selector:
    matchLabels:
      app: eglaptop
  template:
    metadata:
      labels:
        app: eglaptop
    spec:
      containers:
      - name: eglaptop
        image: your-registry/eglaptop:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXT_PUBLIC_GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: gemini-api-key
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: eglaptop-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: eglaptop
```

Deploy with:
```bash
kubectl apply -f k8s-deployment.yaml
```

## Environment Variables

Required environment variables for production:

```env
NODE_ENV=production
NEXT_PUBLIC_GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_API_KEY=<your-gemini-api-key>
```

Set these in your deployment platform's environment configuration.

## Best Practices

1. **Use secrets management** - Store API keys in your platform's secret manager, not in `.env` files
2. **Health checks** - The docker-compose config includes health checks; ensure your orchestrator is configured similarly
3. **Resource limits** - Set appropriate CPU and memory limits:
   ```yaml
   resources:
     requests:
       memory: "256Mi"
       cpu: "250m"
     limits:
       memory: "512Mi"
       cpu: "500m"
   ```
4. **Logging** - Configure centralized logging (e.g., ELK stack, CloudWatch, Stackdriver)
5. **Monitoring** - Set up monitoring for container health and performance

## Troubleshooting

**Port already in use:**
```bash
# Change the port mapping in docker-compose.yml or run:
docker run -p 3001:3000 eglaptop:latest
```

**Out of memory:**
```bash
# Increase Docker's memory limit or set container memory limits
docker run -m 512m eglaptop:latest
```

**Build fails:**
```bash
# Clear Docker cache and rebuild
docker build --no-cache -t eglaptop:latest .
```
