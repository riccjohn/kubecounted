# kubecounted

A simple hit counter API built with Express and Redis, used as a vehicle for learning Docker and Kubernetes.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [minikube](https://minikube.sigs.k8s.io/docs/start/) (for Kubernetes)

## Running with Docker Compose

Starts the Express app and Redis together:

```bash
docker compose up --build
```

The app will be available at `http://localhost:3000`.

### Stopping

```bash
docker compose down
```

## Running with Kubernetes (minikube)

Before deploying to minikube, you need to build the image inside minikube's Docker environment. By default your Docker CLI talks to Docker Desktop — this command points it at minikube's daemon instead:

```bash
eval $(minikube docker-env)
```

This only affects the current terminal session. To revert:

```bash
eval $(minikube docker-env --unset)
```

Then build the image:

```bash
docker build -t kubecounted .
```

### Starting the cluster

```bash
minikube start
```

### Deploying

```bash
kubectl apply -f k8s/
```

### Checking status

```bash
kubectl get pods
```

### Ingress

Enable the ingress addon (one-time setup):

```bash
minikube addons enable ingress
```

Add the following entries to `/etc/hosts`:

```
$(minikube ip)  hit-counter.local
```

The app will then be available at `http://hit-counter.local`.

### Stopping

```bash
kubectl delete -f k8s/
minikube stop
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Returns the current hit count and hostname |
| POST | `/hit` | Increments the hit count |
| POST | `/reset` | Resets the hit count to 0 |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
