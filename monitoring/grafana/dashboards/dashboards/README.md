# Bundled Grafana Dashboards

Grafana auto-loads every `*.json` file in this folder (see
`../dashboards.yml` — the dashboard provider with `allowUiUpdates: true`).

## Bundled dashboards

| File | Dashboard | Panels |
|------|-----------|--------|
| `overview.json` | **OpenPay Overview** | Hyperswitch up/down, Kill Bill up/down, total services up |

## Adding your own

1. Build/export a dashboard in Grafana: **Dashboards → New → Add visualization**
   (or import a template from https://grafana.com/grafana/dashboards).
2. Export as JSON: **Share → Export → Save JSON to file**.
3. Drop the file here, e.g. `my-dashboard.json`.
4. Restart Grafana (or wait ≤30s — the provider reloads automatically):

```bash
docker compose restart grafana
```

## File format (quick reference)

A dashboard is a single JSON document. Key blocks:

- `title` / `uid` — dashboard name and unique ID
- `panels[]` — each panel is a visualization (`type`: `stat`, `timeseries`, `bargauge`, ...)
- `panels[].targets[].expr` — the PromQL query per panel
- `templating` — dropdown variables (e.g. service selector)
- `time` — default time range

## Data sources

- **Prometheus** — `http://prometheus:9090` (metrics), registered via
  `../../datasources/prometheus.yml`.
- **Loki** — for logs in Explore; source: `http://loki:3100`.
