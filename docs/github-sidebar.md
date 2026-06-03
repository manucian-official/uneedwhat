# GitHub Sidebar Setup

GitHub renders the repository sidebar automatically. The project can prepare the signals, but GitHub decides when to show each block.

## Deployments

The `Deployments` block appears after workflows create deployment records. This repo includes:

- `.github/workflows/deploy-preview.yml` creates the `Preview` environment on pull requests.
- `.github/workflows/deploy-production.yml` creates the `Production` environment on `main` pushes.
- `.github/workflows/publish-npm.yml` creates the `npm` environment on releases or manual dispatch.

To make the production deployment link point to your real site, add a repository variable:

```text
Settings -> Secrets and variables -> Actions -> Variables
PRODUCTION_URL=https://your-domain.example
```

## Used by

The `Used by` block cannot be manually added. GitHub shows it when dependency graph data proves other repositories depend on your package.

For this project:

1. Publish the root npm package `misungtr`.
2. Enable dependency graph in repository settings.
3. Wait for other public repositories to add `misungtr` as a dependency.

The repo includes `package.json` and `publish-npm.yml` to prepare for this flow, but the count only appears after real downstream usage exists.

