#!/usr/bin/env bash
# Prints a line every ten seconds, six times, then exits. Each line reaches Claude as a notification.
for i in 1 2 3 4 5 6; do
  echo "heartbeat $i of 6"
  sleep 10
done
