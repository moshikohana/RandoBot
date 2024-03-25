# Discord Team Formation Bot

This Discord bot is designed to facilitate team formation within a Discord server. Users can join or leave teams by sending messages starting with a plus sign. When a team reaches the desired size, the bot randomly assigns users to different teams and announces the team assignments in the channel.

## Features

- Allows users to join or leave teams with simple commands.
- Automatically forms teams when the desired team size is reached.
- Randomly assigns users to teams for fairness.
- Provides visibility into the current status of team formation upon request.

## Installation

1. Clone this repository to your local machine:

   `git clone https://github.com/your_username/discord-plus-bot.git`

2. Install the dependencies:

   `npm install`

3. Create a .env file in the root directory and add your Discord bot token:

   `token=YOUR_DISCORD_BOT_TOKEN`

## Usage
To test the bot, use the following command:
    
```npm run test```

## Configuration

- `src/bot.js`: Configures Discord client and event handling.
- `src/events/messageCreate.js`: Handles message events and commands.
- `src/events/ready.js`: Handles bot initialization.
- `utils/functions.js`: Contains functions for command handling and team generation.
