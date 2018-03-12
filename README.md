
# Origami Registry UI

Get information about Origami components, services, and repositories.

⚠️ This is a work in progress ⚠️

[![Build status](https://img.shields.io/circleci/project/Financial-Times/origami-registry-ui.svg)][ci]
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)][license]


## Table Of Contents

  * [Requirements](#requirements)
  * [Running Locally](#running-locally)
  * [Configuration](#configuration)
  * [Operational Documentation](#operational-documentation)
  * [Testing](#testing)
  * [Deployment](#deployment)
  * [Monitoring](#monitoring)
  * [Trouble-Shooting](#trouble-shooting)
  * [License](#license)


## Requirements

Running Origami Registry UI requires [Node.js] 8.x and [npm].


## Running Locally

Before we can run the application, we'll need to install dependencies:

```sh
npm install
```

In order to bundle the JS and CSS that the application will be using locally, we will then need to run:

```sh
make build
```

Run the application in development mode with:

```sh
make run-dev
```

Now you can access the app over HTTP on port `8080`: [http://localhost:8080/](http://localhost:8080/)


## Configuration

We configure Origami Registry UI using environment variables. In development, configurations are set in a `.env` file. In production, these are set through Heroku config. Further documentation on the available options can be found in the [Origami Service documentation][service-options].

### Required everywhere

  * `NODE_ENV`: The environment to run the application in. One of `production`, `development` (default), or `test` (for use in automated tests).
  * `PORT`: The port to run the application on.
  * `REPO_DATA_API_KEY`: The [Repo Data] API key to use when authenticating with that service.
  * `REPO_DATA_API_SECRET`: The [Repo Data] API secret to use when authenticating with that service.

### Required in Heroku

  * `CMDB_API_KEY`: The CMDB API key to use when updating health checks and the application runbook (TODO not implemented yet)
  * `FASTLY_PURGE_API_KEY`: A Fastly API key which is used to purge URLs (when somebody POSTs to the `/purge` endpoint) (TODO not implemented yet)
  * `GRAPHITE_API_KEY`: The FT's internal Graphite API key.
  * `PURGE_API_KEY`: The API key to require when somebody POSTs to the `/purge` endpoint. This should be a non-memorable string, for example a UUID (TODO not implemented yet)
  * `REGION`: The region the application is running in. One of `QA`, `EU`, or `US`
  * `RELEASE_LOG_API_KEY`: The change request API key to use when creating and closing release logs
  * `RELEASE_LOG_ENVIRONMENT`: The Salesforce environment to include in release logs. One of `Test` or `Production`
  * `SENTRY_DSN`: The Sentry URL to send error information to.

### Required locally

  * `GRAFANA_API_KEY`: The API key to use when using Grafana push/pull

### Headers

The service can also be configured by sending HTTP headers, these would normally be set in your CDN config:

  * `FT-Origami-Service-Base-Path`: The base path for the service, this gets prepended to all paths in the HTML and ensures that redirects work when the CDN rewrites URLs.


## Operational Documentation

TODO everything in this section is a lie until we make the `operational-documentation` folder

The source documentation for the [runbook] and healthcheck endpoints ([EU][healthcheck-eu]/[US][healthcheck-us]) are stored in the `operational-documentation` folder. These files are pushed to CMDB upon every promotion to production. You can push them to CMDB manually by running the following command:

```sh
make cmdb-update
```


## Testing

The tests are split into unit tests and integration tests. To run tests on your machine you'll need to install [Node.js] and run `make install`. Then you can run the following commands:

```sh
make test              # run all the tests
make test-unit         # run the unit tests
make test-integration  # run the integration tests
```

You can run the unit tests with coverage reporting, which expects 90% coverage or more:

```sh
make test-unit-coverage verify-coverage
```

The code will also need to pass linting on CI, you can run the linter locally with:

```sh
make verify
```

We run the tests and linter on CI, you can view [results on CircleCI][ci]. `make test` and `make lint` must pass before we merge a pull request.


## Deployment

The production ([EU][heroku-production-eu]/[US][heroku-production-us]) and [QA][heroku-qa] applications run on [Heroku]. We deploy continuously to QA via [CircleCI][ci], you should never need to deploy to QA manually. We use a [Heroku pipeline][heroku-pipeline] to promote QA deployments to production.

You can promote either through the Heroku interface, or by running the following command locally:

```sh
make promote
```


## Monitoring

  * [Grafana dashboard][grafana]: graph memory, load, and number of requests
  * [Pingdom check (Production EU)][pingdom-eu]: checks that the EU production app is responding
  * [Pingdom check (Production US)][pingdom-us]: checks that the US production app is responding
  * [Sentry dashboard (Production)][sentry-production]: records application errors in the production app
  * [Sentry dashboard (QA)][sentry-qa]: records application errors in the QA app
  * [Splunk (Production)][splunk]: query application logs


## Trouble-Shooting

We've outlined some common issues that can occur in the running of the Origami Registry UI:

### What do I do if memory usage is high?

For now, restart the Heroku dynos:

```sh
heroku restart --app origami-registry-ui-eu
heroku restart --app origami-registry-ui-us
```

If this doesn't help, then a temporary measure could be to add more dynos to the production applications, or switch the existing ones to higher performance dynos.

### What if I need to deploy manually?

If you _really_ need to deploy manually, you should only do so to QA (production deploys should always be a promotion). Use the following command to deploy to QA manually:

```sh
make deploy
```


## License

The Financial Times has published this software under the [MIT license][license].



[ci]: https://circleci.com/gh/Financial-Times/origami-registry-ui
[grafana]: http://grafana.ft.com/dashboard/db/origami-registry-ui
[healthcheck-eu]: https://endpointmanager.in.ft.com/manage/TODO
[healthcheck-us]: https://endpointmanager.in.ft.com/manage/TODO
[heroku-pipeline]: https://dashboard.heroku.com/pipelines/c206786a-73a4-4cbc-90dc-58db19255704
[heroku-production-eu]: https://dashboard.heroku.com/apps/origami-registry-ui-eu
[heroku-production-us]: https://dashboard.heroku.com/apps/origami-registry-ui-us
[heroku-qa]: https://dashboard.heroku.com/apps/origami-registry-ui-qa
[heroku]: https://heroku.com/
[license]: http://opensource.org/licenses/MIT
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[pingdom-eu]: https://my.pingdom.com/newchecks/checks#check=4254051
[pingdom-us]: https://my.pingdom.com/newchecks/checks#check=4254126
[production-url]: https://registry.origami.ft.com/
[repo-data]: https://origami-repo-data.ft.com/
[runbook]: https://dewey.in.ft.com/view/system/origami-registry-ui
[sentry-production]: https://sentry.io/nextftcom/registry-ui-production
[sentry-qa]: https://sentry.io/nextftcom/registry-ui-qa
[service-options]: https://github.com/Financial-Times/origami-service#options
[splunk]: https://financialtimes.splunkcloud.com/en-US/app/search/search?q=app%3Dorigami-registry-ui-*
