# PollPro

This is a small real-time voting app that allows user to connect to a room, submit their nomination and their vote.

## Tech stack

- BE:
  - NestJs
  - Socket.io
- FE:
  - Vite
  - ReactJs
  - Tailwind
  - Socket.io
- Database: Redis, just for experiment. You can use Postgrest or MySQL instead

## Demo

https://github.com/user-attachments/assets/1cca2b31-7f15-4bfb-8dc3-c8e58430a952

## How to run the project in development mode

- Duplicate the `example.env` files in the 'client' and 'server' folder and rename the duplicates to `.env`.
- Update the app ports in the `.env` file if needed to avoid port conflicts on your local machine.
- Run `pnpm install` in the root folder
- Open docker desktop or start your docker service. We need docker to run Redis
- Run `pnpm dev` to start project

## How to run the project using docker locally

- Duplicate the `example.env` file in the 'client' folder and `docker-example.env` file in 'server' folder and rename the duplicates to `.env.production`.
- Run 'docker-compose up'

## Features

- The host can create a topic and add nomination. They can also set the maximum number of participants.
- After creating the poll, the host sends its ID to other users so they can join and add their own nomination.
- Users join the poll via Websocket only if the poll hasn't started yet
- If users have closed the tab, they can re-join via `pollId` and receive the current state of the poll
- Only the host can start, end or cancel the poll. When the host cancel the poll, all the participants will be kicked out of the poll
- After the poll ends, a screen displays the results.

## BE Architecture

### Auth module

- This module is used to return the participant data when they connect to a poll

### Poll module

- Poll controller extract the topic and the number of votes for each voter in request body and send it to the Poll service
- Poll service
  - Create a pollId and userId
  - Tell Redis to save the poll
  - Create a JWT from userId and poll data. The JWT is used is authorized the user, in case they lost the connection and want to rejoin the poll
  - Send poll data and JWT to Poll Controller
- Poll Repository: connects to redis (create poll, join poll) and returns data to Poll service

### Websocket

- Poll gateway are in charged of handling websocket connection. We are using Socket.io in this project
- Websocket authentication: we want to ensure that only the user with JWT token can connect. In this case, we use an adapter to:
  - Handle the authentication using socket io middleware
  - Handle CORS. Of course, we can set CORS directly in the gateway but we aren't able to get the CLIENT_HOST from .env file. By using adapter, we can extract the environment variable from ConfigService

## How the app works

The app only has APIs for creating and joining the poll. Other events will be implemented by Websocket

- Create Poll
  - Call 'create poll' API
  - API returns created poll
  - Save access token to local storage
  - Move to waiting room
  - Init socket using access token from local storage
- Join Poll: similar to create poll, except for using 'join poll' API
- Connect to the poll
  - User connects to the poll with token (via WS)
  - Socket.io Adapter verifies and extracts token to get 'userId', 'userName', 'pollId'
  - Update the poll by adding participants
- Delete participant, delete nomination, start, cancel or end the poll
  - These events are guarded and only admin can implement them.
  - For example, admin sends a delete event
  - Poll WS guard verifies and extract token to see if the user is admin
  - If not, throw error

## What I learnt

- How to use RedisJSON
- How to apply Websocket in NestJs
- Dockerize a pnpm workspace project
  - Connect to redis inside 'server' container: we can't use 'localhost' here because 'localhost' inside 'server' container is different from 'localhost' in the host machine. In development mode, where docker is not used, 'server' and 'redis' use the same localhost, which is the host machine. But in Docker environment, in order for 2 services to connect to each other directly, we need to use service name. Docker sets up a internal DNS system where service names in the docker-compose file can be used as hostnames. So the 'server' container should have referred to the redis container by the service name or container name
