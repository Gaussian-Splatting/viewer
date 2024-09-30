#!/bin/bash

# install the dependencies
git submodule update --init 
# npm install 

# Build the dependencies
cd ./lib/GaussianSplats3D/
npm install
npm run build-library
cd ../..

# Build the viewer
vite build
