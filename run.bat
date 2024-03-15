@echo off
start powershell -NoProfile -ExecutionPolicy Bypass -Command "npm run dev" -NoNewWindow -Wait
start powershell -NoProfile -ExecutionPolicy Bypass -Command "npm run backend" -NoNewWindow -Wait