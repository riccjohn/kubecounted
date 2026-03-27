# Platform Engineering Learning Path

A hands-on learning path using a simple **Hit Counter API** as the vehicle for building platform engineering skills. The app itself is trivial — the infrastructure is the point.

---

## The Project

A small API with three endpoints:

- `GET /` — returns the current hit count and the hostname of the serving instance
- `POST /hit` — increments the counter in Redis and returns the new value
- `POST /reset` — resets the counter to zero

The app connects to Redis for shared state. Build it in whatever language you're comfortable with (Node/Express is a solid default).

---

## Phase 1: Docker Fundamentals

**Goal:** Containerize the app and run it locally with Redis.

### Steps

1. Write the app with a hardcoded Redis connection (`localhost:6379`)
2. Write a `Dockerfile`:
   - Use a multi-stage build (one stage for dependency install, one for the final image)
   - Learn the difference between `CMD` and `ENTRYPOINT`
   - Keep the final image small (use `node:alpine` or `node:slim` as your base)
3. Write a `docker-compose.yml` that runs both the app and Redis
4. Verify the app connects to Redis using Docker's internal DNS (hostname `redis`)

### Checkpoint

- `docker-compose up` starts both containers
- `curl http://localhost:3000/` returns a JSON response with count and hostname
- `curl -X POST http://localhost:3000/hit` increments the count
- `curl -X POST http://localhost:3000/reset` resets it
- Restarting the app container preserves the count (Redis holds the state)

### Concepts Learned

- Dockerfile authoring and layer caching
- Multi-container networking with Compose
- Separation of stateless app from stateful storage

---

## Phase 2: Kubernetes Basics

**Goal:** Deploy the same app to a local K8s cluster.

### Setup

Install **minikube** or **kind** (Kubernetes in Docker) for a local cluster.

### Steps

1. Write a **Deployment** manifest for the app (1 replica to start)
2. Write a **Service** manifest to expose the app within the cluster
3. Write a Deployment and Service for Redis
4. Move the Redis connection URL into a **ConfigMap** and reference it as an environment variable in your app Deployment
5. Use `kubectl apply -f` to deploy everything

### Checkpoint

- `kubectl get pods` shows app and Redis pods in `Running` state
- `kubectl logs <app-pod>` shows clean startup logs
- You can reach the app via the Service (use `kubectl port-forward` or a NodePort)
- The app reads the Redis URL from the ConfigMap, not a hardcoded value

### Concepts Learned

- K8s resource types: Deployment, Service, ConfigMap
- `kubectl` basics: `get`, `logs`, `describe`, `apply`, `port-forward`
- Declarative configuration (YAML manifests)
- Debugging a `CrashLoopBackOff` (you'll probably hit one — that's the point)

---

## Phase 3: Scaling & Load Balancing

**Goal:** See horizontal scaling and load balancing in action.

### Steps

1. Scale the app to 3 replicas: `kubectl scale deployment hit-counter --replicas=3`
2. Hit the `GET /` endpoint in a loop and observe the hostname rotating:
   ```bash
   for i in $(seq 1 20); do curl -s http://localhost:30000/ | jq .; done
   ```
3. Hit `POST /hit` repeatedly and confirm the count is consistent across all pods (shared Redis)
4. Kill a pod manually with `kubectl delete pod <name>` and watch K8s replace it automatically

### Checkpoint

- Curling the endpoint shows different hostnames across requests
- The hit count is consistent regardless of which pod responds
- Deleted pods are automatically recreated within seconds

### Concepts Learned

- Horizontal scaling and replica sets
- Round-robin load balancing via Services
- Self-healing: K8s reconciliation loop
- Stateless app design (shared state via external store)

---

## Phase 4: Health Checks & Resilience

**Goal:** Teach K8s how to know whether your app is healthy.

### Steps

1. Add a `GET /health` endpoint to your app that:
   - Returns `200` if the app can reach Redis
   - Returns `503` if the Redis connection is down
2. Add a **readiness probe** to your Deployment manifest pointing at `/health`
3. Add a **liveness probe** as well (can use the same endpoint)
4. Test by killing the Redis pod:
   - App pods should transition to `Not Ready`
   - K8s should stop routing traffic to them
   - When Redis comes back, pods should recover automatically

### Checkpoint

- `kubectl describe pod <name>` shows the probe configuration
- Killing Redis causes app pods to show `0/1 Ready`
- Traffic stops flowing to unhealthy pods
- Recovery is automatic once Redis is restored

### Concepts Learned

- Readiness vs. liveness probes (and when to use each)
- Graceful degradation under dependency failure
- How K8s uses health checks to manage traffic routing

---

## Phase 5: Ingress & Routing

**Goal:** Expose the app externally with proper HTTP routing.

### Steps

1. Install an Ingress Controller in your cluster (nginx-ingress works well with minikube)
2. Write an **Ingress** manifest that routes `hit-counter.local` to your app Service
3. Add a second trivial service (even just a static "hello world" nginx container) and route `hello.local` to it via the same Ingress
4. Update your `/etc/hosts` file to point both hostnames at your minikube IP

### Checkpoint

- `curl http://hit-counter.local` reaches the hit counter app
- `curl http://hello.local` reaches the second service
- Both go through the same Ingress Controller on the same IP/port

### Concepts Learned

- Ingress resources vs. Ingress Controllers
- Host-based and path-based routing
- How a single entry point routes to multiple backend services

---

## Phase 6: CI/CD Pipeline

**Goal:** Automate building, pushing, and deploying on every code push — and understand *why* each step exists.

---

### Part A: Image Build & Push

1. Push your project to GitHub
2. Set up a **GitHub Actions** workflow (`.github/workflows/deploy.yml`) that triggers on push to `main`
3. The workflow should: check out the code, authenticate with GitHub Container Registry (GHCR), build the Docker image, and push it

**Tagging strategy to figure out:** How should you tag the image? Consider that you want to be able to trace any running container back to the exact commit that built it — and also have a convenient "latest" pointer. What are the tradeoffs of deploying by one tag vs. the other?

**Things to research:**
- How GitHub Actions authenticates with GHCR (hint: there's a built-in token that means you don't need to create manual secrets for this part)
- The `docker/build-push-action` marketplace action
- How to reference git metadata (like the commit SHA) inside a workflow file

### Checkpoint A
- Pushing to `main` triggers the workflow automatically
- The Actions tab shows a passing green build
- Your image appears in GHCR with the tags you chose

---

### Part B: Automated Deployment

This is where most tutorials go quiet. Getting the new image *into* the cluster automatically is the harder, more interesting problem.

**Option 1 — kubectl from CI (simple, good for learning)**

Extend your workflow with a second job that runs after the build succeeds and updates the running deployment to use the newly built image tag.

**Things to research and figure out:**
- How do you give GitHub Actions access to your cluster? Your kubeconfig is a secret — how do you store and use it safely?
- What `kubectl` command updates a running deployment to use a new image without rewriting the whole manifest?
- How do you make the pipeline *wait* for the rollout to finish, and fail loudly if it doesn't? (This is important — a pipeline that exits immediately after issuing the deploy command gives you false confidence)

**Option 2 — GitOps with ArgoCD (stretch, but worth knowing about)**

Instead of CI *pushing* changes to the cluster, ArgoCD *pulls* desired state from your git repo and reconciles the cluster to match. This is a fundamentally different mental model worth understanding even if you don't implement it right now.

**Things to research:** What problem does GitOps solve that the push-based model doesn't? What would you need to change about how your manifests are stored?

### Checkpoint B
- A code push triggers a build *and* a deploy automatically — no manual steps
- The pipeline fails visibly if the rollout doesn't complete successfully
- You can look at a running pod and trace it back to the exact commit that built it

---

### Concepts Learned

- GitHub Actions workflow structure (jobs, steps, triggers, secrets)
- Container image tagging strategies and why immutable tags matter
- The difference between "CI" (build/test) and "CD" (deploy) and where the boundary is
- Rolling updates in K8s — watch pods cycle with `kubectl get pods -w` while a deploy is in progress
- Push-based vs. pull-based (GitOps) deployment models
- Why `rollout status` is the difference between knowing a deploy succeeded and just hoping it did

---

## Phase 7: Observability (Stretch)

**Goal:** Build monitoring and dashboards for your services.

### Steps

1. Install **Prometheus** and **Grafana** into your cluster using Helm
2. Add a `/metrics` endpoint to your app (use `prom-client` for Node.js) exposing:
   - Total request count (by endpoint and method)
   - Request latency histogram
   - Current Redis connection status
3. Configure Prometheus to scrape your app pods
4. Build a Grafana dashboard showing:
   - Requests per second across pods
   - Latency percentiles (p50, p95, p99)
   - Pod health status

### Checkpoint

- `curl http://<app-pod>:3000/metrics` returns Prometheus-format metrics
- Prometheus targets page shows your pods as `UP`
- Grafana dashboard updates in real time as you generate traffic

### Concepts Learned

- Prometheus metric types (counters, histograms, gauges)
- Helm chart installation and configuration
- Building dashboards that a team could actually use on-call

---

## Suggested Timeline

| Phase | Estimated Time | Priority |
|-------|---------------|----------|
| Phase 1: Docker | 1 weekend | Essential |
| Phase 2: K8s Basics | 1 weekend | Essential |
| Phase 3: Scaling | 1 evening | Essential |
| Phase 4: Health Checks | 1 evening | Essential |
| Phase 5: Ingress | 1 evening | Important |
| Phase 6: CI/CD | 1 weekend | Important |
| Phase 7: Observability | 1–2 weekends | Stretch |

---

## What Comes After

Once you've completed this path, natural next steps include:

- **Helm charts** — templatize your manifests so they're reusable and configurable per environment
- **GitOps with ArgoCD** — instead of pushing deployments from CI, let ArgoCD pull desired state from your git repo
- **Terraform** — provision the underlying cloud infrastructure (VPCs, managed databases, the K8s cluster itself)
- **Service mesh (Istio/Linkerd)** — fine-grained traffic management and mutual TLS between services
- **Internal developer platform** — use Backstage or a similar tool to give other teams a self-service portal on top of everything you've built