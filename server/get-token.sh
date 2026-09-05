#!/bin/bash

API_KEY="AIzaSyANJvoNkN2Y_nx2kGbHPVwtmf1KJ9lbrWw
"

read -p "Email: " EMAIL
read -s -p "Password: " PASSWORD
echo

RESPONSE=$(curl -s -X POST \
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$API_KEY" \
  -H "Content-Type: application/json" \
  --data "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"returnSecureToken\":true}")

TOKEN=$(echo "$RESPONSE" | node -pe \
  "JSON.parse(require('fs').readFileSync(0,'utf8')).idToken || ''")

if [ -z "$TOKEN" ]; then
  echo "Login failed:"
  echo "$RESPONSE"
  exit 1
fi

echo
echo "Token generated successfully."
echo
echo "Run:"
echo "export TOKEN='$TOKEN'"
