
if not exist node_modules (
    rem Installing alibabacloud Iot Device SDK...
    npm install
    node index.js
) else (
    node index.js
)
