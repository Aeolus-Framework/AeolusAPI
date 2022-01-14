# AeolusAPI

![Build Status](https://jenkins.aeolus.se/buildStatus/icon?job=aeolus-api)

An RESTful API modeling electricity price, production, and consumption based on wind speed

# Usage

First, install all dependencies

```sh
npm install
```

then you will be able to proceed with one of the actions below.

## Build

Then you will be able to build the project with:

```sh
npm run build
```

## Build and run

Then you will be able to build the project and then running it with:

```sh
npm run build && npm start
```

## Run unit tests

To run all unit tests defined in `/test/`, use:

```sh
npm test
```

## Develop

To rebuild and start the applicaiton when a file in the project is saved, use:

```sh
npm run dev
```

## Generate API documentation

To build the project and then generate openapi (swagger) documentation, use:

```sh
npm run docgen
```

# Enviroment variables avaliable

| name                              | description                                                 | default                |
| --------------------------------- | ----------------------------------------------------------- | ---------------------- |
| `MONGODB_HOST`                    | Host with a mongo instance running, may include port number |
| `MONGODB_DATABASE`                | Database to use                                             |
| `MONGODB_USERNAME` _(optional)_   | Username to access database                                 | _None_                 |
| `MONGODB_PASSWORD` _(optional)_   | Password to access database                                 | _None_                 |
| `JWT_ISSUER` _(optional)_         | Issuer to use when creating and verifying JWTs              | `"none"`               |
| `JWT_SECRET` _(optional)_         | Secret to use when creating and verifying JWTs              | `"123"`                |
| `SWAGGER_FILE` _(optional)_       | File to open-api swagger doc                                | `"./openapi_doc.json"` |
| `SIMULATOR_API_HOST` _(optional)_ | Hostname used to access simulator API                       | `"localhost"`          |
| `SIMULATOR_API_PORT` _(optional)_ | Port used to access simulator API                           | `5500`                 |

# Build and run with `docker`

Build docker image.

```sh
docker build . -t aeolus/api
```

Run a docker container with the newly built image and link the external port 5700 to container port 8080.

```sh
docker run -d -p 5700:8080 aeolus/api
```

To add enviroment variables, add `--env VARIABLE=VALUE` for each enviroment variable to use.
