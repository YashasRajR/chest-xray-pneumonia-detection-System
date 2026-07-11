#!/bin/bash
set -e

echo "Building React Frontend..."
cd Frontend/web-page
npm install
npm run build
cd ../..

echo "Installing Backend Dependencies..."
cd Backend
pip install -r requirements.txt
cd ..

echo "Build Complete!"
