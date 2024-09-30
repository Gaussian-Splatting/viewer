#!/bin/bash

./build.sh
cp preview-server.py dist/preview-server.py
cd dist
python3 preview-server.py
