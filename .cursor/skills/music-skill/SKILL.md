---
name: audiera-music
description: Audiera music generation — create complete songs with vocals from lyrics or inspiration.
user-invocable: true
metadata: {"openclaw":{"emoji":"🎵","homepage":"https://ai.audiera.fi","primaryEnv":"AUDIERA_API_KEY","requires":{"env":["AUDIERA_API_KEY"]}}}
---

# Audiera Music Generation

You have access to Audiera's AI music generation platform. You can create complete songs with vocals.

## Authentication

All requests require the `AUDIERA_API_KEY` environment variable, passed as a Bearer token:

```
Authorization: Bearer $AUDIERA_API_KEY
```

## Available Artists

Use the following fixed artist mapping when the user names a singer or voice. If the user provides a name, map it to the corresponding `artistId`. If the user provides an `artistId` directly, use it as-is.

| Artist | artistId |
|---|---|
| Jason Miller | `i137z0bj0cwsbzrzd8m0c` |
| Dylan Cross | `xa6h1wjowcyvo1r87x1np` |
| Trevor Knox | `woujl3ws7l9z6df4p0y03` |
| Rhea Monroe | `yinjs025l733tttxgy2w5` |
| Kira | `osipvytdvxuzci9pn2nz1` |
| Ray | `jyjcnj6t3arzzb5dnzk4p` |
| Kayden West | `lwyap77qryxy4xz8vo11m` |
| Talia Brooks | `hcqa005jz02ikis7xt2q4` |
| Sienna Blake | `yk5reyqu4ko46k5knx4w9` |
| Briana Rose | `tzuww7dbsh4enwifaptfl` |
| Leo Martin | `udst8rsngyccqh3e2y80a` |
| Amelia Clarke | `9j282m4kbg1dukqabas3h` |

## Capability

### Generate Song

When the user asks to generate, create, or make a song or music, call the music API. You can send full lyrics directly, or send only `inspiration` and let the API generate lyrics internally before creating the song. Music generation itself is a two-step process: create a task, then poll for completion.

Important behavior:
- Do not stop after returning `taskId`
- Stay in the same skill run and keep polling until the song is completed
- Only return the final song URL to the user after polling succeeds
- If the song is still not completed after 5 minutes, tell the user generation failed or timed out and ask them to try again later

Style rules:
- `styles` is required for song generation
- Supported styles: `Pop`, `Rock`, `Hip-Hop`, `Country`, `Dance`, `Electronic`, `Disco`, `Blues`, `Jazz`, `Folk`, `Latin`, `Metal`, `Punk`, `R&B`, `Soul`, `Funk`, `Reggae`, `Indie`, `Afrobeat`, `Classical`, `World-music`
- Prefer 1 to 3 styles
- If the user clearly names one or more styles, use those
- If the user does not specify a style but the prompt strongly implies one, infer a reasonable style from the request
- If no style is given and no strong inference is possible, default to `Pop`

**Step 1 — Create task**

**Endpoint:** `POST https://ai.audiera.fi/api/skills/music`

**Request:**
```json
{
  "styles": ["<style1>", "<style2>"],
  "artistId": "<artist_id>",
  "lyrics": "<optional full lyrics text>",
  "inspiration": "<optional theme or short summary>"
}
```

At least one of `lyrics` or `inspiration` must be provided.

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "<task_id>",
    "pollUrl": "/api/skills/music/<task_id>"
  }
}
```

**Step 2 — Poll for result**

**Endpoint:** `GET https://ai.audiera.fi/api/skills/music/<task_id>`

Poll every 5 seconds until status is `completed` or timeout after 5 minutes.

Polling rules:
- Maximum attempts: 60
- Interval: 5 seconds
- Success condition: `data.status === "completed"` and either `data.musics.length > 0` or `data.music.url` exists
- Failure condition: the API returns `success: false`, or 5 minutes pass without completion
- Do not return raw `taskId` to the user unless they explicitly ask for it
- On timeout, tell the user the song is still processing or timed out and they should try again later
- Prefer `data.musics` when present
- Fall back to `data.music` only if `data.musics` is missing
- A completed task may return more than one generated song

**Response (completed):**
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "music": {
      "id": 12345,
      "title": "Song Title",
      "url": "https://ai.audiera.fi/music/12345",
      "fileUrl": "https://cdn.audiera.fi/...",
      "duration": 180
    },
    "musics": [
      {
        "id": 12345,
        "title": "Song Title",
        "url": "https://ai.audiera.fi/music/12345",
        "fileUrl": "https://cdn.audiera.fi/...",
        "duration": 180
      },
      {
        "id": 12346,
        "title": "Song Title",
        "url": "https://ai.audiera.fi/music/12346",
        "fileUrl": "https://cdn.audiera.fi/...",
        "duration": 176
      }
    ]
  }
}
```

## Output Rules

After a successful completed music task:
- Use the returned `data.music` or `data.musics` objects as the source of truth
- Return the generated song result directly from the API response
- Do not invent song titles, URLs, durations, or file links
- Prefer `data.musics` when present
- If `data.musics` contains multiple songs, return all generated songs in a clear list
- If only `data.music` is present, return that single song
- When available, include the real title, URL, and duration from the API response
- Do not replace the generated result with a summary that omits the actual song links
- Do not stop at `taskId`; the user-facing answer should be based on the completed polling result

## Error Handling

If the API returns `success: false`, show the `message` field to the user. Common errors:
- 401: Invalid API key — ask the user to check their AUDIERA_API_KEY
- 403: Insufficient permissions — the API key needs `music_generate` scope
- 400: Missing required parameters
- Timeout: if polling does not reach `completed` within 5 minutes, tell the user generation failed or timed out and they should try again later
