# 🚀 UNEEDWHAT DEPLOYMENT GUIDE

> Complete guide for deploying uneedwhat to production environments

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Migration](#database-migration)
4. [Deployment Strategies](#deployment-strategies)
5. [Infrastructure Setup](#infrastructure-setup)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript compilation successful (`npm run build`)
- [ ] Code coverage above 80%
- [ ] Security audit passed (`npm audit`)
- [ ] Dependencies updated and audited
- [ ] All environment variables documented
- [ ] Secrets not committed to repository
- [ ] API documentation up to date

### Infrastructure & Security
- [ ] SSL/TLS certificates obtained and validated
- [ ] Database backups configured and tested
- [ ] Redis persistence enabled
- [ ] Firewall rules configured
- [ ] Rate limiting enabled
- [ ] CORS whitelist set correctly
- [ ] API keys and secrets generated and stored securely
- [ ] Database encryption enabled
- [ ] Log aggregation configured
- [ ] Error monitoring (Sentry) configured
- [ ] CDN configured for static assets
- [ ] Email service tested and configured

### Performance
- [ ] Load testing completed
- [ ] Database indexes optimized
- [ ] Redis caching strategy implemented
- [ ] API response times acceptable
- [ ] Frontend bundle size optimized
- [ ] Image optimization applied
- [ ] Database connection pooling configured

### Documentation
- [ ] Deployment runbook created
- [ ] Rollback procedures documented
- [ ] Architecture diagram updated
- [ ] API changes documented
- [ ] Database schema changes documented
- [ ] Environment variables documented

---

## Environment Setup

### 1. Production Environment Variables

Create `.env.production` in the backend directory:

```bash
# Application
NODE_ENV=production
APP_NAME=uneedwhat
APP_PORT=3000

# Database (RDS/Cloud SQL recommended)
DATABASE_HOST=prod-db.c.example.com
DATABASE_PORT=5432
DATABASE_NAME=uneedwhat_prod
DATABASE_USER=db_user
DATABASE_PASSWORD=<secure-password>
DATABASE_SSL=true
DATABASE_POOL_MIN=10
DATABASE_POOL_MAX=30

# Redis (ElastiCache/Cloud Memorystore recommended)
REDIS_HOST=prod-redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=<secure-password>
REDIS_TLS=true

# Security
JWT_SECRET=<random-64-char-string>
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=<random-64-char-string>
JWT_REFRESH_EXPIRATION=30d

# Email Service
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASSWORD=<sendgrid-api-key>
MAIL_FROM=noreply@uneedwhat.com

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<aws-access-key>
AWS_SECRET_ACCESS_KEY=<aws-secret-key>
AWS_S3_BUCKET=uneedwhat-prod-uploads
AWS_S3_CDN_URL=https://cdn.uneedwhat.com

# Error Tracking
SENTRY_DSN=<sentry-dsn>
SENTRY_ENVIRONMENT=production

# Monitoring
DATADOG_API_KEY=<datadog-api-key>
LOG_LEVEL=info

# CORS
CORS_ORIGIN=https://uneedwhat.com,https://www.uneedwhat.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Features
ENABLE_FILE_UPLOAD=true
ENABLE_VIDEO_INTERVIEW=true
ENABLE_NOTIFICATION_EMAIL=true
```

### 2. Frontend Environment Variables

Create `.env.production` in the frontend directory:

```bash
VITE_APP_NAME=uneedwhat
VITE_API_URL=https://api.uneedwhat.com/api/v1
VITE_API_TIMEOUT=30000
VITE_WS_URL=wss://api.uneedwhat.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_SENTRY_DSN=<sentry-dsn>
```

### 3. Secure Credential Management

**Using Docker Secrets (Swarm):**
```bash
echo "secure-password" | docker secret create db_password -
```

**Using Kubernetes Secrets:**
```bash
kubectl create secret generic uneedwhat-secrets \
  --from-literal=database-password=secure-password \
  --from-literal=jwt-secret=random-string \
  --from-literal=jwt-refresh-secret=random-string
```

**Using AWS Systems Manager Parameter Store:**
```bash
aws ssm put-parameter \
  --name /uneedwhat/prod/db-password \
  --value "secure-password" \
  --type SecureString
```

---

## Database Migration

### Pre-Migration Backup

```bash
# Backup production database
pg_dump -h prod-db.c.example.com -U db_user -d uneedwhat_prod > backup-$(date +%Y%m%d-%H%M%S).sql

# Verify backup
pg_restore --list backup-YYYYMMDD-HHMMSS.sql | head -20
```

### Run Migrations

```bash
# Connect to production database
export DATABASE_HOST=prod-db.c.example.com
export DATABASE_NAME=uneedwhat_prod
export DATABASE_USER=db_user
export DATABASE_PASSWORD=<password>

# Run pending migrations
npm run db:migrate

# Verify migrations
npm run db:migrate:show

# Optional: seed data (only if new environment)
npm run db:seed
```

### Post-Migration Verification

```bash
# Check table structure
psql -h prod-db.c.example.com -U db_user -d uneedwhat_prod -c "\dt"

# Verify data integrity
psql -h prod-db.c.example.com -U db_user -d uneedwhat_prod -c "SELECT COUNT(*) FROM users;"

# Check indexes
psql -h prod-db.c.example.com -U db_user -d uneedwhat_prod -c "\di"
```

---

## Deployment Strategies

### Strategy 1: Blue-Green Deployment

**Least risk deployment strategy**

```bash
#!/bin/bash
# Deploy to "green" environment while "blue" is live

# 1. Deploy to green environment
docker pull uneedwhat:latest
docker tag uneedwhat:latest uneedwhat:green
docker-compose -f docker-compose.green.yml up -d

# 2. Run smoke tests on green
bash scripts/smoke-tests.sh http://green.uneedwhat.com

# 3. If successful, switch traffic
docker-compose -f docker-compose.blue.yml stop
docker rename uneedwhat-blue-frontend uneedwhat-blue-frontend-old
docker rename uneedwhat-green-frontend uneedwhat-frontend

# 4. Update load balancer to point to new environment
# (This would be infrastructure-specific)

# 5. Keep old environment for quick rollback
docker-compose -f docker-compose.blue.yml up -d
```

### Strategy 2: Canary Deployment

**Gradual rollout to percentage of users**

```bash
#!/bin/bash
# Deploy to 10% of users first, then increase

# 1. Deploy new version
docker pull uneedwhat:v2.0.0
docker tag uneedwhat:v2.0.0 uneedwhat:latest-staging

# 2. Update load balancer to send 10% traffic to new version
# Configure in nginx/load balancer:
upstream backend_new {
  server backend-v2:3000 weight=1;  # 10% traffic
}
upstream backend_old {
  server backend-v1:3000 weight=9;  # 90% traffic
}

# 3. Monitor metrics
# - Error rates
# - Response times
# - User complaints
# - Resource usage

# 4. Gradually increase traffic
# 10% -> 25% -> 50% -> 100%

# 5. If issues detected, rollback immediately
docker-compose up -d --no-deps backend-v1
```

### Strategy 3: Rolling Deployment

**Kubernetes-native gradual deployment**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: uneedwhat-backend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: uneedwhat-backend
  template:
    metadata:
      labels:
        app: uneedwhat-backend
    spec:
      containers:
      - name: backend
        image: uneedwhat:v2.0.0
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 3000
          initialDelaySeconds: 60
          periodSeconds: 30
```

Deploy:
```bash
kubectl apply -f deployment.yaml
kubectl rollout status deployment/uneedwhat-backend
```

---

## Infrastructure Setup

### AWS Deployment

#### 1. ECS (Elastic Container Service)

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name uneedwhat-prod

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster uneedwhat-prod \
  --service-name uneedwhat-backend \
  --task-definition uneedwhat-backend:1 \
  --desired-count 3 \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=3000
```

#### 2. RDS Setup

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier uneedwhat-prod \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 100 \
  --storage-type gp2 \
  --multi-az \
  --backup-retention-period 30 \
  --enable-cloudwatch-logs-exports postgresql
```

#### 3. ElastiCache Setup

```bash
# Create Redis cluster
aws elasticache create-replication-group \
  --replication-group-description "uneedwhat-redis" \
  --engine redis \
  --cache-node-type cache.t3.medium \
  --engine-version 7.0 \
  --num-cache-clusters 2 \
  --automatic-failover-enabled
```

### Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace uneedwhat-prod

# Create secrets
kubectl create secret generic uneedwhat-secrets \
  --from-literal=db-password=<password> \
  --from-literal=jwt-secret=<secret> \
  -n uneedwhat-prod

# Deploy services
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml

# Verify deployment
kubectl get all -n uneedwhat-prod
kubectl logs -f deployment/uneedwhat-backend -n uneedwhat-prod
```

---

## Post-Deployment

### 1. Smoke Tests

```bash
#!/bin/bash
# scripts/smoke-tests.sh

API_URL=${1:-https://api.uneedwhat.com}

echo "Running smoke tests against $API_URL"

# Test API health
echo "✓ Testing API health..."
curl -f $API_URL/api/v1/health || exit 1

# Test authentication
echo "✓ Testing authentication..."
curl -f -X POST $API_URL/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' || exit 1

# Test job listing
echo "✓ Testing job listing..."
curl -f $API_URL/api/v1/jobs || exit 1

# Test database connectivity
echo "✓ Testing database..."
curl -f $API_URL/api/v1/admin/health/db || exit 1

echo "✅ All smoke tests passed!"
```

### 2. Database Verification

```bash
# Verify data integrity
psql -c "SELECT COUNT(*) as user_count FROM users;"
psql -c "SELECT COUNT(*) as job_count FROM jobs;"

# Check for locked tables
psql -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# Verify indexes
psql -c "\di"
```

### 3. Performance Baseline

```bash
# Record baseline metrics
curl https://api.uneedwhat.com/api/v1/admin/metrics/baseline

# Compare with previous baseline
# Monitor in Grafana/Datadog for the first hour
```

### 4. Enable Monitoring

```bash
# Enable APM
export DD_TRACE_ENABLED=true
export DD_ENV=production
export DD_VERSION=v2.0.0

# Enable log aggregation
docker-compose --profile logging up -d

# Configure alerts
# - High error rate (>1%)
# - Response time > 1s
# - Database connection errors
# - Redis connection errors
```

---

## Monitoring & Maintenance

### Key Metrics to Monitor

```yaml
Backend Metrics:
  - Request latency (p50, p95, p99)
  - Error rate
  - Database query time
  - Redis hit rate
  - CPU usage
  - Memory usage
  - Disk usage
  - Active connections

Frontend Metrics:
  - Page load time
  - Time to interactive
  - Cumulative layout shift
  - First input delay
  - Core web vitals
  - Error rate
  - User sessions

Database Metrics:
  - Query execution time
  - Connection pool usage
  - Slow queries
  - Disk space
  - Cache hit ratio
  - Transaction duration

Infrastructure Metrics:
  - Container restarts
  - Deployment frequency
  - Lead time for changes
  - Change failure rate
  - Mean time to recovery
```

### Log Patterns to Watch

```bash
# High error rate
grep "ERROR" logs/backend.log | wc -l

# Slow queries
grep "duration:" logs/backend.log | grep "duration: [1-9][0-9]{3,}" | head -10

# Database connection issues
grep "Connection refused" logs/backend.log

# Authentication failures
grep "Unauthorized" logs/backend.log

# Rate limiting
grep "429 Too Many Requests" logs/backend.log
```

---

## Rollback Procedures

### Immediate Rollback (< 5 minutes)

```bash
#!/bin/bash
# scripts/rollback.sh

VERSION_TO_ROLLBACK_TO=${1:-v1.9.0}

echo "Rolling back to version $VERSION_TO_ROLLBACK_TO..."

# Stop current version
docker-compose down

# Restore from backup
docker pull uneedwhat:$VERSION_TO_ROLLBACK_TO
docker-compose -f docker-compose.yml up -d

# Verify
sleep 10
curl -f http://localhost:3000/api/v1/health || exit 1

echo "✅ Rollback completed successfully"
```

### Database Rollback

```bash
#!/bin/bash
# For schema changes

# Restore from backup
pg_restore -h prod-db.example.com \
  -U db_user \
  -d uneedwhat_prod \
  backup-YYYYMMDD-HHMMSS.sql

# Verify
psql -h prod-db.example.com \
  -U db_user \
  -d uneedwhat_prod \
  -c "SELECT version();"
```

### Kubernetes Rollback

```bash
# View rollout history
kubectl rollout history deployment/uneedwhat-backend -n uneedwhat-prod

# Rollback to previous version
kubectl rollout undo deployment/uneedwhat-backend -n uneedwhat-prod

# Rollback to specific revision
kubectl rollout undo deployment/uneedwhat-backend \
  --to-revision=2 \
  -n uneedwhat-prod

# Check rollback status
kubectl rollout status deployment/uneedwhat-backend -n uneedwhat-prod
```

---

## Troubleshooting

### High Memory Usage

```bash
# Check memory consumption
docker stats uneedwhat-backend

# Identify memory leaks
node --inspect=0.0.0.0:9229 app.js

# Force garbage collection
curl -X POST http://localhost:3000/api/v1/admin/gc

# Restart container
docker restart uneedwhat-backend
```

### Database Connection Errors

```bash
# Check connection pool
psql -c "SELECT count(*) as connection_count FROM pg_stat_activity;"

# Increase pool size in .env
DATABASE_POOL_MAX=40

# Restart backend service
docker-compose restart backend
```

### Redis Connection Issues

```bash
# Check Redis connectivity
redis-cli -h redis.example.com ping

# Check memory usage
redis-cli info memory

# Clear cache if needed (last resort)
redis-cli FLUSHALL

# Restart Redis
docker-compose restart redis
```

### API Response Timeouts

```bash
# Check slow queries
psql -c "SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Identify missing indexes
SELECT schemaname, tablename, indexname FROM pg_indexes WHERE tablename = 'applications';

# Enable query logging
SET log_min_duration_statement = 1000;  # 1 second
```

### Frontend Build Issues

```bash
# Clear build cache
rm -rf frontend/dist
npm run build:frontend

# Check bundle size
npm run analyze

# Optimize images
npm run optimize:images
```

---

## Success Criteria

After deployment, verify:

- ✅ All health checks passing
- ✅ No error rate spike
- ✅ Response times within baseline
- ✅ Database queries executing normally
- ✅ Redis cache working
- ✅ Email notifications sending
- ✅ File uploads working
- ✅ Real-time notifications flowing
- ✅ WebSocket connections stable
- ✅ User authentication functional

---

## Support & Escalation

**For deployment issues:**
1. Check logs: `docker-compose logs -f backend`
2. Verify databases: Connect to PostgreSQL and Redis
3. Run smoke tests: `bash scripts/smoke-tests.sh`
4. Check recent changes: `git log --oneline -10`
5. Contact DevOps team if issues persist

**Emergency contacts:**
- On-call DevOps: [contact info]
- Database Admin: [contact info]
- Security Team: [contact info]

---

Last Updated: June 2024 | Version: 1.0.0
