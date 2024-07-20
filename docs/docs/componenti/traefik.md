# Traefik

**Traefik** is edge router that makes deploying microservices simple.
It acts as a dynamic HTTP reverse proxy and load balancer.
Traefik integrates with Docker enabling automatic and seamless configuration changes.

The `traefik.toml` file contains the main configurations for all orchestration. More about custom configurations can be found [on the official documentation](https://doc.traefik.io/traefik/providers/docker/)

## Dynamic Configuration

Traefik automatically discovers services and adapts to changes in your infrastructure in real-time, just by adding this label to any services of a docker compose:

```yaml
labels:
    - "traefik.enable=true"
```

Then, you can specify routing options:

```yaml
- "traefik.http.routers.my_custom_routing.rule=Host(`example.com`)"
- "traefik.http.routers.my_custom_routing.entrypoints=websecure"
```

Or other rules for middlewares or loadbalancers.

## HTTPS and SSL Termination

In this project two entrypoinst are available: `web` (aka `http`) and `websecure` (aka `https`). An auto-redirect to HTTPS is set in the `traefik.toml` file.

```yaml
[entryPoints.web.http.redirections]
    [entryPoints.web.http.redirections.entryPoint]
        to = "websecure"
        scheme = "https"
```

Key and Cert files are dynamically loaded through `dyn/certs.toml` file.
Keys could be copied inside the traefik container using volume binding:

```yaml
volumes:
    - .keys:/etc/certs
```

Traefik can automatically manages HTTPS certificates using Let's Encrypt ACME challenges, see [the docs](https://doc.traefik.io/traefik/https/acme/)

## Metrics and Monitoring

Traefik supports monitoring and metric, eventually through integration with Prometheus, Grafana, Datadog, and other tools.

By default, a monitoring dasboboard is exposed in `localhost` on [`http://localhost:8080/dashboard/`](http://localhost:8080/dashboard/). The dashboard can be disabled by editing the `traefik.toml` file:

```toml
[api]
  dashboard = false
```

Logs are outputted in `stdout`, `docker logs` will capture the `stdout` and store all in internal files.
If you're not attached to `docker compose` outputs, you can retrive logs using `docker logs traefik` command.
Format of Traefik logs are personalized in the `traefik.toml` file:

```toml
[log]
  level = "INFO"

[accessLog]
  [accessLog.fields.headers]
    defaultMode = "keep"
    [accessLog.fields.headers.names]
        RequestAddr = "keep"
        RequestHost = "keep"
        "User-Agent" = "drop"
```

See [the official documentation](https://doc.traefik.io/traefik/observability/logs/) to customize logs format and storage.
