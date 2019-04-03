set -e

if [ ! -d ./node_modules ]; then
  printf "Installing Aliyun Iot Device SDK...\n"
  npm install
fi

node index.js