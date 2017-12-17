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

### DATABASE_HOST
Database server name or IP address
### DATABASE_PORT
Database server port number
### DATABASE_NAME
Database name
### DATABASE_USER
Database user name
### DATABASE_PASSWORD
Database user password

### GOOGLE_API_KEY
Used for shortening URLs for the graph images.
You can get a key at https://developers.google.com/url-shortener/v1/getting_started#APIKey

### SLACK_TOKEN
The Slack api token for the team you want to run invest-bot in.
See https://api.slack.com/

## Setup

Query for setting up database schema coming soon™.
