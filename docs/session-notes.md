# Session Notes

## Where we left off

Completed Phases 1-4 fully. Phase 5 (Ingress) is partially done.

### Phase 5 status
- Ingress Controller installed via `minikube addons enable ingress`
- `k8s/ingress.yaml` written and applied, routing `hit-counter.local` to the kubecounted Service
- Using `minikube tunnel` + `curl -H "Host: hit-counter.local" http://127.0.0.1` instead of editing `/etc/hosts`
- **Next step:** add a second service (`hello`) using the stock `nginx` image, then add a second rule to `ingress.yaml` for `hello.local` — to demonstrate host-based routing through a single Ingress Controller

### Key context
- minikube is the local K8s cluster
- Images must be built inside minikube's Docker env: `eval $(minikube docker-env)` then `docker build -t kubecounted .`
- `imagePullPolicy: Never` is set in `app-deployment.yaml` so K8s uses the local image
- Redis URL is passed via ConfigMap (`k8s/configmap.yaml`) as `REDIS_URL=redis://redis:6379`
- App has readiness and liveness probes on `GET /health`
- App Service is type `NodePort`
