# Voting app

## Tech stack

- BE: NestJs
- FE: Vite + ReactJs + Tailwind
- Database: Redis, just for experiment. You can use Postgrest or MySQL instead

## Features

- The host can create a topic and add options. They can also set the maximum number of participants.
- After creating the poll, the host sends its ID to other users so they can join and add their own options.
- Only the host can start and end the poll.
- After the poll ends, a screen displays the results.

## Flows

### Poll module

- Poll controller extract the topic and the number of votes for each voter in request body and send it to the Poll service
- Poll service
  - Create a pollId and userId
  - Tell Redis to save the poll
  - Create a JWT from userId and poll data
  - Send poll data and JWT to Poll Controller
- Poll Repository: connect to redis and return data to Poll service
