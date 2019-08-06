#!/usr/bin/env bash
delay=3
while  ! nc -z rabbitmq 5672 && [[ "$delay" -lt  "380" ]] ; do sleep ${delay}; let delay="delay*5"; done
nodemon stooqWorker.js