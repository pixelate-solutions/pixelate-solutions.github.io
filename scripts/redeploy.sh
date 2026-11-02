#!/usr/bin/env bash
# Re-sync screenshots/résumé from ../assets, verify the build, scan for secrets, commit, and push.
# GitHub Actions (.github/workflows/deploy.yml) builds and publishes to Pages on every push to main.
set -euo pipefail
cd "$(dirname "$0")/.."
npm run sync-assets
npm run build
git add -A
if git diff --cached --quiet; then echo "Nothing changed."; exit 0; fi
if git diff --cached -U0 | grep -E '^\+' | grep -E 'sk_(live|test)_[A-Za-z0-9]{8,}|AIza[0-9A-Za-z_-]{20,}|ghp_[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY' ; then
  echo "Possible secret in staged changes. Aborting." >&2; exit 1
fi
git -c user.name="Joseph Morrison" -c user.email="pixelatesolutionsllc@gmail.com" commit -q -m "Sync portfolio assets

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push origin main
echo "Pushed. Live in ~1 minute at https://pixelate-solutions.github.io"
