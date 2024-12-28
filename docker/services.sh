#!/bin/bash

/workdir/tools/net-tools/loop-socat.sh & > /dev/null 2>&1
/workdir/tools/net-tools/loop-slip-tap.sh & > /dev/null 2>&1
cd /gateway-http-server-redis && bun run main.ts
/bin/bash
