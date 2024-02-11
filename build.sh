#!/bin/bash

START_TIME=$SECONDS
BUILD_LOGS_DIR="$PWD/build-logs"
BUILD_LOG_OUTPUT_FILE="$BUILD_LOGS_DIR/build-log-$(date +%Y-%m-%d-%H-%M-%S).log"

# Check so all required tools are installed
echo "Checking for required tools..."
if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: npm is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v pip)" ]; then
  echo 'Error: pip is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v makensis)" ]; then
  echo 'Error: makensis is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v pyinstaller)" ]; then
  echo 'Error: pyinstaller is not installed.' >&2
  exit 1
fi
echo "All required tools are installed."

# Create build logs directory
mkdir -p $BUILD_LOGS_DIR

## Install dependencies
echo "Installing dependencies..."
npm run install-all > $BUILD_LOG_OUTPUT_FILE 2>&1
echo "Dependencies installed."

# Build the api
echo "Building the api..."
cd apps/api
npm run build > $BUILD_LOG_OUTPUT_FILE 2>&1
npm run package > $BUILD_LOG_OUTPUT_FILE 2>&1
echo "Api built."

# Build client
echo "Building client..."
cd ../client
npm run build > $BUILD_LOG_OUTPUT_FILE 2>&1
echo "client built."

# Build the appManager
echo "Building appManager..."
cd ../appManager
pip install -U pyinstaller > $BUILD_LOG_OUTPUT_FILE 2>&1
pip install -r requirements.txt > $BUILD_LOG_OUTPUT_FILE 2>&1
rm -rf dist/*
rm -rf build/*
pyinstaller --onefile --noconsole main.py > $BUILD_LOG_OUTPUT_FILE 2>&1
echo "AppManager built."

# Move the built files to the dist folder
echo "Moving built files to dist folder..."
cd ../../
rm -rf dist/*
mkdir -p dist

## Move the API
mkdir -p dist/api
cp -r apps/api/release/main-win.exe dist/api/shellcontrol-api.exe 
mkdir -p dist/api/node_modules/sqlite3/build
cp -r apps/api/node_modules/sqlite3/build/Release/node_sqlite3.node dist/api/node_modules/sqlite3/build/node_sqlite3.node # Include sqlite3 node module

## Move the client
mkdir -p dist/client
cp -r apps/client/release/win-unpacked/* dist/client
mv dist/client/ShellControl.exe dist/client/shellcontrol-client.exe

## Move the appManager
mkdir -p dist/
cp -r apps/appManager/dist/main.exe dist/shellcontrol.exe
cp apps/appManager/icon.png dist/icon.png
echo "Built files moved to dist folder."

# Run NSIS to create installer
rm ShellControl-setup.exe
echo "Creating installer..."
makensis installer.nsi > $BUILD_LOG_OUTPUT_FILE 2>&1
echo "Installer created."

ELAPSED_TIME=$(($SECONDS - $START_TIME))
MINUTES=$((ELAPSED_TIME / 60))
SECONDS=$((ELAPSED_TIME % 60))
echo "Build completed in $MINUTES minutes and $SECONDS seconds."


