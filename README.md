<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Notes

Application is deployed at [Heroku](https://gjg-leaderboard.herokuapp.com/)  
Swagger docs for API are served at [/api](https://gjg-leaderboard.herokuapp.com/api)  
Developer docs are in the repository under `docs/` directory and also on [github-pages](https://hamzali.github.io/gjg-leaderboard/)

- NestJS with Typescript is selected for backend framework because types makes life easier and strong structure helps maintainability
- CQRS and Event patterns are used to reduce code coupling and increase readiblity/maintainability
- MongoDB is used as a data source because it plays nice with both NodeJS and also increases development velocity.
- Redis is used for fast data access and leaderboard's sorted and dynamic behaviour.

## Solutions & Future Works

- **application**
  - I choosed User, Score and Leaderboard as my domain objects.
  - I used Redis **Sorted Set** data structure for storing/managing both global and local leaderboard data.
  - I used MongoDB for static storage for User and Score.
  - I used Mongo ObjectId for unique User id instead of generating guid.
  - I mostly used events to communicate between the domain objects in order to reduce the coupling
  - I updated the rank value of the user in the database only when it is read through /user/profile/guid endpoint
  - Leaderboards are always updated because it is served through Redis Sorted Set.
  - Reading all users and scores endpoints are added for debug purposes therefor they do not details such as pagination, filter, updated ranks, etc. because these were out of the case scope
- **deployment**
  - I used Heroku for application deployment.
  - I used Mlab Heroku add-on for MongoDB.
  - I used Heroku Redis add-on for Redis.
  - I dockerized the application and created a compose file for local or custom deployments.
- **development**
  - NestJS tools are used for project scaffolding and structure.
  - TSLint and Prettier are used for code sanity.
  - Angular commit convention is used for commit messages.
  - Docker is used for local development.
  - Inline comments are used for code documentation and generated an html doc automatically with typedoc

## Configuration

- `REDIS_SETUP` environment variable can be set to `true` to in order to clean and re calculate the redis state on startup

### Connection Params

- `MONGODB_URI`
- `REDIS_URL`

## Test Scripts

I used axios and faker in order to simulate the random mutations
In order to populate the application with user and leaderboard data user the `test.js` script  
run: `node test.js <app_base_url> <user_count> <submit_score_count> <step_count>`

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
