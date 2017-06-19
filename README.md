# invest-bot
Slack bot for getting information on your investment

## Commands

### Start
```
npm start
```

### Test
```
npm test
```

### Integration Test
```
DATABASE_URL={set_actual_url_here} ava **/*.integration.js
```

### Lint
```
npm run lint
```

## Environment variables

### DATABASE_URL
URL for the postgres database in the format
```
postgres://USERNAME:PASSWORD@IP:PORT/DATABASE_NAME
```

SSL must be enabled on the database.
### GOOGLE_API_KEY
Used for shortening URLs for the graph images.
You can get a key at https://developers.google.com/url-shortener/v1/getting_started#APIKey

### SLACK_TOKEN
The Slack api token for the team you want to run invest-bot in.
See https://api.slack.com/
### BOT_NAME
This is the name used for interacting with the bot.
The default value is `investbot`.

## Setup

Query for setting up database schema coming soon™.
