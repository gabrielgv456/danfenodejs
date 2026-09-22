# danfenodejs

HTTP service that converts Brazilian NF-e / NFC-e XML into a DANFE PDF and returns it as base64. Conversion only — no authentication.

Repository: [gabrielgv456/danfenodejs](https://github.com/gabrielgv456/danfenodejs)

## Requirements

- Node.js (LTS recommended)
- npm

## Installation

```bash
git clone https://github.com/gabrielgv456/danfenodejs.git
cd danfenodejs
npm install
```

## Run

```bash
npm run dev
```

Starts Express on port **8090** (`src/server.js`). Production: `npm start`.

## Docker

### Local

```bash
docker compose up -d --build
```

Service on port **8090** (`PORT=8080 docker compose up -d` to remap).

### Production deploy (GitHub Actions → AWS VPS)

Push to `master` builds the image on GitHub (not on the VPS), pushes to **GHCR**, then SSHs into the VPS to `pull` + `up -d`.

**GitHub Actions secrets** (`Settings → Secrets and variables → Actions`):

| Secret | Required | Description |
| --- | --- | --- |
| `VPS_HOST` | yes | VPS IP or hostname |
| `VPS_USER` | yes | SSH user (`ubuntu`, `ec2-user`, …) |
| `VPS_SSH_PRIVATE_KEY` | yes | Private key (full PEM) matching `~/.ssh/authorized_keys` on the VPS |
| `VPS_DEPLOY_PATH` | yes | Absolute path on the VPS for `docker-compose.yml` (e.g. `/opt/danfe`) |
| `VPS_PORT` | no | SSH port (default `22`) |
| `GHCR_TOKEN` | if package is private | PAT with `read:packages` so the VPS can `docker pull` from GHCR |

`GITHUB_TOKEN` is provided automatically for pushing the image (needs `packages: write` — already set in the workflow).

**One-time VPS setup:**

```bash
sudo mkdir -p /opt/danfe
# install Docker + Compose plugin
# add the deploy public key to ~/.ssh/authorized_keys for VPS_USER
```

Optional: make the GHCR package public (`Package settings → Change visibility`) so you can skip `GHCR_TOKEN`.

```bash
# logs on VPS
cd /opt/danfe && docker compose logs -f danfe
```

## API

### `POST /danfeGenerator`

Converts an authorized NF-e (model 55) or NFC-e (model 65) XML into a DANFE PDF.

**Request body (JSON):**

```json
{
  "xml": "<nfeProc>...</nfeProc>",
  "NFe": "44-digit-access-key",
  "profile": "tenant-or-folder-id",
  "model": "NFE",
  "logoBase64": "optional",
  "positionYEmitDataNFe": 0,
  "positionYLogoNFe": 0
}
```

| Field | Required | Description |
| --- | --- | --- |
| `xml` | yes | Full NF-e / NFC-e XML string |
| `NFe` | yes | Access key (kept for API compatibility / logging) |
| `profile` | yes | Client/tenant id (kept for API compatibility / logging) |
| `model` | yes | `"NFE"` (DANFE A4 via danfe-woj) or `"NFCE"` (cupom via pdfmake) |
| `logoBase64` | no | Emitente logo (NF-e only) |
| `positionYEmitDataNFe` | no | Vertical adjust for emitente block (NF-e) |
| `positionYLogoNFe` | no | Vertical adjust for logo (NF-e) |

**Success response:**

```json
{
  "success": true,
  "danfe": "<base64 pdf>"
}
```

**Error response:**

```json
{
  "success": false,
  "error": "message"
}
```

Conversion is **in-memory**: XML is parsed from the request body and the PDF is returned as base64. Nothing is persisted under `media/`.

## Project structure

```text
danfenodejs/
├── src/
│   ├── server.js              ← Express entry (port 8090)
│   ├── routes/
│   │   └── routes.js          ← POST /danfeGenerator
│   ├── factories/             ← HTTP handler + XML→DANFE field mappers
│   ├── services/              ← XML parse + PDF generate (in-memory)
│   ├── media/                 ← fonts and logos only
│   └── utils/
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `nodemon src/server.js` | Development server with reload |
| `start` | `node src/server.js` | Production server (used by Docker) |

There is no CLI entrypoint; use the HTTP API above.

## License

MIT. See the [LICENSE](LICENSE) file for details.
