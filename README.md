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

# Enviroment variables avaliable

| name                            | description                                                 |
| ------------------------------- | ----------------------------------------------------------- |
| `MONGODB_HOST`                  | Host with a mongo instance running, may include port number |
| `MONGODB_DATABASE`              | Database to use                                             |
| `MONGODB_USERNAME` _(optional)_ | Username to access database                                 |
| `MONGODB_PASSWORD` _(optional)_ | Password to access database                                 |

# Build and run with `docker`

Build docker image.

```sh
docker build . -t aeolus/simulator
```

Run a docker container with the newly built image and link the external port 5700 to container port 8080.

```sh
docker run -d -p 5700:8080 aeolus/simulator
```

To add enviroment variables, add `--env VARIABLE=VALUE` for each enviroment variable to use.
