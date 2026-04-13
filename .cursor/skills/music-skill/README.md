# Audiera Music Skill

This repository contains the `audiera-music` skill.

## Install

Clone the repository locally:

```bash
git clone https://github.com/audiera/music-skill.git ~/Projects/skills/music-skill
```

## Capability

Use this skill to generate complete songs with vocals from lyrics or inspiration.

**Endpoints:**
- `POST https://ai.audiera.fi/api/skills/music`
- `GET https://ai.audiera.fi/api/skills/music/{taskId}`

## OpenClaw Config

All skills-related configuration lives under `skills` in `~/.openclaw/openclaw.json`.

You can also clone this repository into OpenClaw's local `skills` directory and then load the required environment variables through OpenClaw's skill configuration.

### Recommended skill entry

```json
{
  "skills": {
    "entries": {
      "audiera-music": {
        "enabled": true,
        "env": {
          "AUDIERA_API_KEY": "sk_audiera_your_key_here"
        }
      }
    }
  }
}
```

Since this skill declares `AUDIERA_API_KEY` as its primary env var, you can also use OpenClaw's `apiKey` helper:

```json
{
  "skills": {
    "entries": {
      "audiera-music": {
        "enabled": true,
        "apiKey": {
          "source": "env",
          "provider": "default",
          "id": "AUDIERA_API_KEY"
        }
      }
    }
  }
}
```

### Load from a local directory

Point `skills.load.extraDirs` at the repository's `skills` directory:

```json
{
  "skills": {
    "load": {
      "extraDirs": [
        "~/Projects/skills/music-skill/skills"
      ],
      "watch": true,
      "watchDebounceMs": 250
    }
  }
}
```

### Sandboxed runs

When a session is sandboxed, skill processes run inside Docker and do not inherit the host `process.env`. In that case, put `AUDIERA_API_KEY` under:

- `agents.defaults.sandbox.docker.env`
- or per-agent `agents.list[].sandbox.docker.env`

## Configure API Key

Provide your API key as:

```bash
export AUDIERA_API_KEY="sk_audiera_your_key_here"
```

Recommended scope:
- `music_generate`

## Support

- Website: https://ai.audiera.fi
- Issues: https://github.com/audiera/music-skill/issues
