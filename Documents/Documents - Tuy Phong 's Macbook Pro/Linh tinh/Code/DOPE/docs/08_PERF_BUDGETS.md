# 08_PERF_BUDGETS — Performance Targets + Downgrade Rules

## Core Promise
- **Perceived time-to-buy < 3s** (from seeing coin to "Order Sent")
- **Feedback < 100ms** for every user input

---

## Frame Rate Targets

### Target Devices
- Mid-tier Android (2020+): 60fps target
- Low-tier Android: 30fps acceptable
- iOS: 60fps target

### Budgets
| Screen | Target FPS | Max Frame Time |
|--------|------------|----------------|
| Deck swiping | 60 | 16ms |
| Hold animation | 60 | 16ms |
| PnL updates | 30 | 33ms |
| Activity list | 60 | 16ms |

---

## Load Time Budgets

### App Boot
| Metric | Target | Max |
|--------|--------|-----|
| First paint | < 500ms | 1s |
| Interactive | < 2s | 3s |
| First card visible | < 3s | 5s |

### Navigation
| Action | Target | Max |
|--------|--------|-----|
| Open Activity | < 300ms | 500ms |
| Open Settings | < 200ms | 300ms |
| Switch card | < 50ms | 100ms |

---

## Network Budgets

### API Latency (p95)
| Endpoint | Target | Max |
|----------|--------|-----|
| `/v1/health` | < 100ms | 200ms |
| `/v1/config` | < 100ms | 200ms |
| `/v1/deck/batch` | < 500ms | 1s |
| `/v1/trades/quote` | < 500ms | 1s |
| `/v1/trades/commit` | < 1.5s | 3s |
| `/v1/activity` | < 300ms | 500ms |

### WebSocket
| Metric | Target | Max |
|--------|--------|-----|
| Connection time | < 500ms | 1s |
| TRADE_UPDATE delivery | < 1s | 3s |
| PRICE_TICK latency | < 500ms | 1s |

---

## Bundle Size Budgets

### JavaScript
| Bundle | Target | Max |
|--------|--------|-----|
| Initial (critical) | < 100KB | 150KB |
| Total (lazy loaded) | < 500KB | 750KB |

### Assets
| Asset Type | Target | Max |
|------------|--------|-----|
| Card media (image) | < 100KB | 200KB |
| Card media (video) | < 500KB | 1MB |
| App icons | < 50KB | 100KB |

---

## Memory Budgets

### Heap Usage
| State | Target | Max |
|-------|--------|-----|
| Idle | < 50MB | 100MB |
| Active swiping | < 100MB | 150MB |
| Peak (media heavy) | < 150MB | 200MB |

### Card Buffer
- Keep 3 cards in memory (prev, current, next)
- Dispose cards >5 positions away
- Lazy load media

---

## Downgrade Rules

### Rule 1: Frame Drop Detection
If `dropped_frames > 10` in 1 second:
1. Reduce animation complexity
2. Disable video autoplay
3. Use static images only

### Rule 2: Memory Pressure
If heap > 150MB:
1. Aggressively dispose off-screen cards
2. Reduce image quality
3. Disable prefetching

### Rule 3: Network Degradation
If API latency p95 > 2s:
1. Show "Slow connection" indicator
2. Increase request timeout
3. Reduce polling frequency

### Rule 4: Media Load Failure
If media fails to load:
1. Show placeholder immediately
2. Retry once with lower quality
3. Fall back to static placeholder
4. Log `media_load_failure` event

---

## Measurement

### Client-Side
- Performance API for timing
- requestAnimationFrame for frame counting
- Memory API where available

### Server-Side
- Histogram for endpoint latencies
- p50, p95, p99 tracking
- Alerting on budget violations

### Telemetry
- `frame_drop` events (sampled)
- `media_load_failure` events
- `api_latency` per endpoint

---

## Testing

### Performance Tests
- Run on mid-tier test device before release
- Lighthouse CI for web vitals
- Memory profiling in dev

### Regression Prevention
- CI fails if bundle size exceeds max
- Visual regression for animations
- Latency tests in staging

