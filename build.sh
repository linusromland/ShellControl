#!/bin/bash

## Install dependencies
npm run install-all

# Build the api
cd apps/api
npm run build
npm run package

# Build electron
cd ../client
npm run build
