set -e

if [ ! -d ./node_modules ]; then
  printf "Installing alibabacloud Iot Device SDK...\n"
  npm install
fi

node index.js