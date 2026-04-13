---
name: audiera-lyrics
description: Audiera lyrics generation — create song lyrics from a theme, idea, or inspiration.
user-invocable: true
metadata: {"openclaw":{"emoji":"✍️","homepage":"https://ai.audiera.fi","primaryEnv":"AUDIERA_API_KEY","requires":{"env":["AUDIERA_API_KEY"]}}}
---

# Audiera Lyrics Generation

You have access to Audiera's lyrics generation API.

## Authentication

All requests require the `AUDIERA_API_KEY` environment variable, passed as a Bearer token:

```
Authorization: Bearer $AUDIERA_API_KEY
```

## Capability

### Generate Lyrics

When the user asks to write, generate, or create lyrics, call the lyrics API.

**Endpoint:** `POST https://ai.audiera.fi/api/skills/lyrics`

**Request:**
```json
{
  "inspiration": "<user's theme, idea, or inspiration>"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "lyrics": "<generated lyrics>"
  }
}
```

**Example flow:**
- User: "Write lyrics about summer love"
- Extract the theme: "summer love"
- Call the API with `{"inspiration": "summer love"}`
- Return the generated lyrics to the user

## Output Rules

After a successful lyrics API call:
- Use `data.lyrics` as the final answer body
- Return the generated lyrics text directly to the user
- Do not summarize, paraphrase, shorten, or rewrite the lyrics
- Do not replace the generated lyrics with your own version
- If the user asked for lyrics only, the response should primarily contain the full lyrics from `data.lyrics`
- You may add a very short intro line such as `Here are the lyrics:`, but the main content must be the exact lyrics returned by the API

## Error Handling

If the API returns `success: false`, show the `message` field to the user. Common errors:
- 401: Invalid API key — ask the user to check their AUDIERA_API_KEY
- 403: Insufficient permissions — the API key needs `lyrics_generate` scope
- 400: Missing required parameters
