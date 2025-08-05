<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

### ABAS V3 Project Set up

Follow the steps below to set up the project:

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Prep:

1. Clone this repository to your host computer
2. Make sure that Docker is installed and your host has enough system memory to run and support containers, images and volumes

## Step 1

1. Navigate to the root directory of the clone project repo.
2. Copy the `.env` template example, open bash terminal, run:
```bash
$ cp .env.example .env
```
3. Next, build and start the containers of docker in bash terminal:
```bash
$ docker-compose up --build -d
```
4. This step builds your NestJs aap's Docker image, pulls necessary images in docker-compose.yml (e.g., postgres,pgadmin). This will also start all the services ( nest.js, postgres, etc) in the background.

> **Note:** `npm install` is already added in docker file so when running `docker-compose up --build -d` it is be included already.

## Step 2: Migrate and Seed the Database

1. Run Prisma migration (inside the running container or docker terminal): 
```bash
$ docker exec -it nestjs-app npx prisma migrate dev --name init-build
```
2. Seed the database, run:
```bash
$ docker exec -it nestjs-app npx prisma db seed
```
3. If ever you want to reset your migration along with the seed file(optional), run: 
```bash
$ docker exec -it nestjs-app npx prisma migrate reset
```

## Step 3: Accessing the system
1. First, open bash terminal, run: 
```bash
$ docker-compose up
```
2. Access Endpoints: 
- Access Prisma Studio for database GUI

 - Open [http://localhost:5555](http://localhost:5555) in your browser.

> **Note:** make sure prisma client is generated.

- Access pgAdmin

 - Open [http://localhost:8080](http://localhost:8080) in your browser.

  - Login with:
   - **Email:** `admin@admin.com`
   - **Password:** `admin`

  - Add a new server:
   - **Host name/address:** `postgres`
   - **Port:** `5432`
   - **Username:** `postgres`
   - **Password:** `postgres`

> **Note:** `postgres` is the service name defined in `docker-compose.yml`, not `localhost`. Docker Compose allows internal service resolution by name.

- Access Swagger API Docs

 - Visit http://localhost:3000/api/documentation

- Access with Postman API

 - Copy this endpoint http://localhost:3000 in postman new request
 - Navigate through the controller endpoints provided in postman testing workspace

## Compile and run the project

```bash
# Install dependencies (local dev only)
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Optional commands for docker simulation, at your convenience: 

1. Stop and remove Containers, Networks and Volumes, run:
```bash
$ docker-compose down -v
```
 - -v ensures named volumes like pgdata, pgadmin_data, and node_modules are also removed. 
 - This gives you a clean environment, like a new developer's first run.

> **Note:** `postgres` is the service name defined in `docker-compose.yml`, not `localhost`. Docker Compose allows internal service resolution by name.
2. Rebuild and Start Everything Fresh
```bash
$ docker-compose up --build -d
```
 - This rebuilds the nestjs-app image using your Dockerfile, pulls fresh images if needed, starts all services in detached mode (-d).
3. Verify Everything Is Running
```bash
$ docker-compose ps
```
4. Re-run Prisma Migration and Seeding
```bash
$ docker exec -it nestjs-app npx prisma migrate dev --name init-build
$ docker exec -it nestjs-app npx prisma db seed
```
4. Regenerate prisma client
```bash
$ npx prisma generate
```

## Optional: Simulate as a New Dev

1. You could even remove your local .env and recreate it:
```bash
$ rm .env
$ cp .env.example .env
```
  - This helps test whether your .env.example file is truly sufficient for onboarding.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
