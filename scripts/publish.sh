#!/bin/sh

set -e

pnpm i --frozen-lockfile
pnpm update:version

pnpm build

cd dist/m-eleplus-crud
npm publish --provenance
cd -

# cd internal/eslint-config
# npm publish
# cd -

echo "✅ Publish completed"
