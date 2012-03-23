#!/bin/sh

anvil -b build.json

mv ./lib/browser/postal.when.node.js ./lib/node/postal.when.js
rm ./lib/browser/postal.when.node*

cp ./lib/browser/postal.when.js ./example/amd/js