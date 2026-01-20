# Killer Function - Expired Email Cleanup

This Appwrite function automatically deletes expired emails and messages from the database.

## Features

- Deletes expired messages (where `expiresAt < current time`)
- Deletes expired mails (where `expiresAt < current time`)
- Related messages are automatically deleted when mails are deleted (cascade delete)
- Processes up to 100 records per execution to prevent timeouts
- Provides detailed logging and response statistics

## Setup as Cron Job

### 1. Deploy the Function

```bash
# From the project root
cd functions/killer
npm install
```

Then deploy using Appwrite CLI:

```bash
appwrite deploy function
```

Or deploy via the Appwrite Console.

### 2. Configure Cron Schedule

In the Appwrite Console:

1. Go to **Functions** → **killer**
2. Navigate to **Settings** → **Schedule**
3. Set the cron expression based on your needs:
   - Every hour: `0 * * * *`
   - Every 6 hours: `0 */6 * * *`
   - Every day at midnight: `0 0 * * *`
   - Every day at 3 AM: `0 3 * * *`

### 3. Set Required Permissions

Ensure the function has an API key with the following scopes:

- `databases.read`
- `databases.write`

The API key should be passed in the `x-appwrite-key` header or configured in the function settings.

## Environment Variables

The function uses the following auto-populated environment variables:

- `APPWRITE_FUNCTION_API_ENDPOINT` - Appwrite API endpoint
- `APPWRITE_FUNCTION_PROJECT_ID` - Your project ID

## Manual Execution

You can manually trigger the function at any time:

- Via Appwrite Console: Functions → killer → Execute
- Via API: `POST /v1/functions/{functionId}/executions`

## Response Format

```json
{
  "success": true,
  "deletedMails": 5,
  "deletedMessages": 23,
  "timestamp": "2026-01-20T12:00:00.000Z"
}
```

## Batch Processing

The function processes up to 100 mails and 100 messages per execution. If you have more expired records, they will be processed in the next scheduled run.

To increase the batch size, modify the `Query.limit()` value in the code.

## ⚙️ Configuration

| Setting           | Value         |
| ----------------- | ------------- |
| Runtime           | Node (18.0)   |
| Entrypoint        | `src/main.js` |
| Build Commands    | `npm install` |
| Permissions       | `any`         |
| Timeout (Seconds) | 15            |
