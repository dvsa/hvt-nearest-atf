# hvt-nearest-atf

A Serverless Node Express lambda (NearestAtfFunction) for showing nearest ATF centres with their availability.


## Requirements

- [node v18.16.0](https://nodejs.org/en/download/releases/)
- [Docker](https://www.docker.com/get-started)
- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)


## Run Locally

1. Follow build steps in [hvt-data](https://gitlab.mot.dvsacloud.uk/hvtesting/hvt-data/) to prepare local dataset
1. [hvt-geolocation]() and [hvt-read-api](https://gitlab.mot.dvsacloud.uk/hvtesting/hvt-read-api/) must be running
1. `npm i`
1. `cp .env.development .env`
1. `npm run build:dev`
1. `npm run start:dev`
1. Go to `http://localhost:3007/` on browser

### Run and watch Locally

As steps above but instead of `build:dev`
- `npm run watch:dev`

and in a separate terminal, run

- `npm run start:dev`

Note: only `.ts` files are being watched. Any changes to template `njk` files will not be watched so will not rebuilt.

## Debug Locally (VS Code only)

1. Run lambdas in debug mode: `npm run start:dev -- -d 5858`
1. Add a breakpoint to the lambda being tested (`src/controllers/index.controller.ts`)
1. Run the debug config from VS Code that corresponds to lambda being tested (`NearestAtfFunction`)
1. Go to `http://localhost:3007/` on browser


## Tests

- The [Jest](https://jestjs.io/) framework is used to run tests and collect code coverage
- To run the tests, run the following command within the root directory of the project: `npm test`
- Coverage results will be displayed on terminal and stored in the `coverage` directory
    - The coverage requirements can be set in `jest.config.js`


## Build for Production

1. `npm i`
1. add environment variables to `.env`
1. `npm run build:prod`
1.  Zip file and minified assets and can be found in `./dist/`


## Logging

By using a utility wrapper (`src/util/logger`) surrounding `console.log`, the `awsRequestId` and a "correlation ID" is output with every debug/info/warn/error message.

For this pattern to work, every service/lambda must forward their correlation ID to subsequent services via a header e.g. `X-Correlation-Id`. 

In practice, the first lambda invoked by an initial request will not have received the `X-Correlation-Id` header, so its `correlationId` gets defaulted to its `lambdaRequestId`.
This `correlationId` should then be used when invoking subsequent lambdas via the `X-Correlation-Id` header.
Every lambda called subsequently will then check for that `X-Correlation-Id` header and inject it into their logs.

This shows an example of what the log looks like from the first invoked lambda:
```
2020-09-10T17:03:04.891Z	5ff37fce-5ace-114c-9120-a1406cc8d11d	INFO	{"apiRequestId":"c6af9ac6-7b61-11e6-9a41-93e8deadbeef","correlationId":"5ff37fce-5ace-114c-9120-a1406cc8d11d","message":"Here's a gnarly info message from lambda 1 - notice how my correlationId has been set to my lambdaRequestId?"}
```
This shows an example of what the logs look like from the second invoked lambda (called via the first lambda):
```
2020-09-10T17:05:31.627Z	32ff455b-057d-1dd7-98b8-7034bf182dc8	INFO	{"apiRequestId":"d9222e0a-6bd9-49e0-84dd-ffe0680bd141","correlationId":"5ff37fce-5ace-114c-9120-a1406cc8d11d","message":"Here's a gnarly info message from lambda 2 - notice how my correlationId is the same as the lambda 1"}
```
