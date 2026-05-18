#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cleanup() {
  echo
  echo "Stopping DoGood dev servers..."
  jobs -p | xargs -r kill
}

trap cleanup EXIT INT TERM

echo "Starting DoGood backend on http://localhost:4000"
(cd "$ROOT_DIR/backend" && npm run dev) &

echo "Starting DoGood frontend on http://localhost:5173"
(cd "$ROOT_DIR/frontend" && npm run dev -- --host 0.0.0.0) &

echo
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:4000"
echo "Press Ctrl+C to stop both servers."
echo

wait
