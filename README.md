# Voting app

## Tech stack

- BE: NestJs + socket.io
- FE: Vite + ReactJs + Tailwind + Socket.io
- Database: Redis, just for experiment. You can use Postgrest or MySQL instead

## Features

- The host can create a topic and add options. They can also set the maximum number of participants.
- After creating the poll, the host sends its ID to other users so they can join and add their own options.
- Users join the poll via Websocket.
- If users have closed the tab, they can re-join via `pollId` and receive the current state of the poll
- Only the host can start and end the poll.
- After the poll ends, a screen displays the results.

## Flows

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
- Websocket authentication: we want to ensure that only the user with JWT token can connect. In this case, we use an adapter
  - Handle the authentication using socket io middleware
  - Handle CORS. Of course, we can set CORS directly in the gateway but we aren't able to get the CLIENT_HOST from .env file. By using adapter, we can extract the environment variable from ConfigService
