# Tickety 🎫

> A simple webapp for purchasing and validating tickets. Made it because i was sick and didn't have much to do.

## Features

- Buy single or day pass tickets
- Charge credits
- Validate tickets

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. Clone the repo
```bash
git clone https://github.com/GeorgievIliyan/Tickety.git
cd tickety
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file:
```bash
MONGODB_URI=<your-mongo-secret>
AUTH_SECRET=<secure-key-for-auth>
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Database:** MongoDB
- **Authentication:** Auth.js
- **UI:** shadcn/ui
- **Styling:** Tailwind CSS

## Project structure

```
├── app/
│   ├── api/
│   ├── login/
│   ├── register/
│   ├── validate/
│   ├── balance/
│   └── tickets/
├── components/
├── lib/
│   └── mongodb.ts
└── auth.ts
```

## API routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/register` | POST |  |
| `/api/generate-ticket` | POST |  |
| `/api/validate-ticket` | POST |  |
| `/api/delete-ticket` | DELETE |  |
| `/api/add-credits` | POST |  |
| `/api/info` | GET |  |

## Development

```bash
npm run dev
npm run build
npm run start
```

## License

[GNU (GPL v3)](https://www.gnu.org/licenses/gpl-3.0.en.html)