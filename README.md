# kubecounted

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white)

A Redis-backed hit counter API built with Express, used as a vehicle for learning Docker and Kubernetes — multi-replica deployments, ConfigMaps, health probes, and Ingress routing.

## What this covers

- **Docker** — multi-stage build to keep the production image minimal; Docker Compose for local development
- **Kubernetes** — Deployments, Services, ConfigMaps, multi-replica scaling, and self-healing
- **Health probes** — readiness and liveness probes backed by a real `/health` endpoint that checks Redis connectivity
- **Ingress** — host-based routing via a single nginx Ingress Controller (`hit-counter.local` and `hello.local`)
- **CI** — GitHub Actions workflow that builds and pushes the image to GHCR on every push to `main`, tagged by commit SHA for traceability

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

### Starting the cluster

```bash
minikube start
```

### Local development

Build the image inside minikube's Docker environment so the cluster can find it locally without pulling from a registry:

```bash
eval $(minikube docker-env)
docker build -t kubecounted .
```

`eval $(minikube docker-env)` only affects the current terminal session. To revert:

```bash
eval $(minikube docker-env --unset)
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

Start a tunnel to expose the cluster on `127.0.0.1` (keep this running in a separate terminal):

```bash
minikube tunnel
```

Then access the services using the `Host` header:

```bash
curl -H "Host: hit-counter.local" http://127.0.0.1
curl -H "Host: hello.local" http://127.0.0.1
```

### Stopping

```bash
kubectl delete -f k8s/
minikube stop
```

## CI / Image Publishing

Pushing to `main` triggers a GitHub Actions workflow that builds the Docker image and pushes it to GitHub Container Registry (GHCR) tagged with both `latest` and the commit SHA. To pick up a new image in your local cluster, restart the affected pods:

```bash
kubectl rollout restart deployment/kubecounted
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Returns the current hit count and hostname |
| GET | `/health` | Returns `200 OK` if Redis is reachable, `503` otherwise |
| POST | `/hit` | Increments the hit count |
| POST | `/reset` | Resets the hit count to 0 |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
