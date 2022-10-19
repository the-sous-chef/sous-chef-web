# Sous Chef Web
Your personal kitchen assistant

## Contributing

### Requirements
- [volta](https://volta.sh/) (Used to manage our node environments)
- [Docker](https://docs.docker.com/get-docker/)


It is recommended to install the extensions recommended [here](https://github.com/the-sous-chef/kitchen-sink/blob/master/.vscode/extensions.json) if you are not working from within the monorepo (kitchen-sink).

### Setup
`npm install`

Copy `.env.template` as `.env`. A developer can help you obtain the correct secrets to fill out your env file.

### Running

`docker-compose up`

To force a rebuild, run `docker-compose up --build`
