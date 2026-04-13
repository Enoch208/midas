# Midas Analysis API

This service analyzes uploaded audio and returns:

- `bpm`
- `key`
- `durationSec`
- `genreHint`

## Run locally

```bash
cd analysis-api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8080
```

## Run with Docker

```bash
cd analysis-api
docker build -t midas-analysis-api .
docker run -p 8080:8080 -e ANALYSIS_API_KEY=your_secret midas-analysis-api
```

## Run with PM2

```bash
cd analysis-api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

If your project is not at `/root/midas/analysis-api`, update `cwd` in `ecosystem.config.cjs`.

To set auth key with PM2:

```bash
export ANALYSIS_API_KEY=your_secret
pm2 restart midas-analysis-api --update-env
```

You can also set it directly in `env` inside `ecosystem.config.cjs`.

## API

### Health

`GET /health`

### Analyze

`POST /analyze`

`multipart/form-data` with file field `stem`.

If `ANALYSIS_API_KEY` is set on the service, send:

`Authorization: Bearer <ANALYSIS_API_KEY>`

### Example

```bash
curl -X POST "http://localhost:8080/analyze" \
  -H "Authorization: Bearer your_secret" \
  -F "stem=@/path/to/track.wav"
```

Expected JSON:

```json
{
  "bpm": 122,
  "key": "A minor",
  "durationSec": 184,
  "genreHint": "Dark Drill"
}
```

## Frontend env wiring

In `frontend/.env`:

```env
ANALYSIS_API_URL=https://your-vps-domain/analyze
ANALYSIS_API_KEY=your_secret
```
