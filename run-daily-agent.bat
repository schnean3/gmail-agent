@echo off
REM ============================================================
REM  Gmail Agent — Daily Automation Script
REM  This file is run automatically by Windows Task Scheduler
REM  every morning. It runs Claude Code with your daily tasks.
REM ============================================================

REM --- Configuration ---
REM Change this path if your gmail-agent folder is somewhere else
set PROJECT_DIR=C:\Claude Code\gmail-agent

REM Where to save the daily log files (one file per day)
set LOG_DIR=C:\Claude Code\gmail-agent\logs

REM --- Setup ---
REM Create the logs folder if it doesn't exist yet
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM Build today's log filename e.g. digest-2026-04-24.txt
set TODAY=%DATE:~6,4%-%DATE:~3,2%-%DATE:~0,2%
set LOG_FILE=%LOG_DIR%\digest-%TODAY%.txt

REM --- Run the agent ---
echo ============================================================ >> "%LOG_FILE%"
echo  Gmail Agent — Daily Run >> "%LOG_FILE%"
echo  Started: %DATE% %TIME% >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"
echo. >> "%LOG_FILE%"

REM This is the key command: runs Claude Code silently with your task prompt
REM --print means "run this task and exit" (no interactive session)
cd /d "%PROJECT_DIR%"
claude --print < "%PROJECT_DIR%\daily-task.txt" >> "%LOG_FILE%" 2>&1

echo. >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"
echo  Finished: %DATE% %TIME% >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"

REM --- Done ---
REM The output is saved in your logs folder
REM You can open it any time to see what the agent did
