# 📬 Gmail & Bills Agent — Beginner Setup Guide

Welcome! This guide walks you through **every single step** to get your Gmail agent running.
No experience needed. Take it one step at a time.

---

## 🗺️ What We're Building

A Claude Code agent that:
1. Reads your Gmail inbox
2. Labels and organizes emails automatically
3. Finds bill/invoice emails and extracts the key info (amount, due date, sender)
4. Shows you a summary — **you always decide what happens next**

---

## 📋 Prerequisites (Things to Install First)

Before anything else, you need three things on your computer:

### 1. Node.js
This is the engine that runs the Gmail connector.
- Go to: https://nodejs.org
- Download the **LTS version** (the one that says "Recommended for most users")
- Install it like any normal app

To check it worked, open your Terminal and type:
```bash
node --version
```
You should see something like `v20.x.x`. ✅

### 2. Claude Code
This is the AI agent tool from Anthropic.
- Open your Terminal and run:
```bash
npm install -g @anthropic-ai/claude-code
```
- When finished, type `claude` to check it works

### 3. A Google Cloud Account (free)
You need this to get permission to read your Gmail.
- Go to: https://console.cloud.google.com
- Sign in with your Google account (the same one as your Gmail)

---

## 🔑 Step 1: Get Gmail API Credentials

This is the trickiest part — but just follow these steps exactly.

**In Google Cloud Console:**

1. Click **"Select a project"** at the top → **"New Project"**
2. Name it `gmail-agent` → click **Create**
3. In the left menu, go to **APIs & Services → Library**
4. Search for **"Gmail API"** → click it → click **Enable**
5. Go to **APIs & Services → OAuth consent screen**
   - Choose **External** → click Create
   - Fill in App name: `Gmail Agent`
   - Fill in your email for support
   - Scroll down and click **Save and Continue** (skip the rest)
   - On the last screen, click **Back to Dashboard**
6. Go to **APIs & Services → Credentials**
   - Click **+ Create Credentials → OAuth client ID**
   - Application type: **Desktop app**
   - Name: `gmail-agent-client`
   - Click **Create**
7. A popup shows your **Client ID** and **Client Secret**
   - Click **Download JSON** — save this file safely!
   - Open the JSON file and find `client_id` and `client_secret` — you'll need these next

---

## 🔧 Step 2: Configure Your Project

1. Copy the file `.env.example` in this folder to `.env`:
```bash
cp .env.example .env
```

2. Open `.env` in any text editor and fill in your values:
```
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
```

3. Run the auth helper to get your refresh token:
```bash
node setup-auth.js
```
It will open your browser — log in and allow access. Then paste the code back into the terminal.
Your `.env` file will be updated automatically with the refresh token.

---

## 🚀 Step 3: Start Claude Code

Navigate to this project folder in your terminal:
```bash
cd path/to/gmail-agent
```

Then start Claude Code:
```bash
claude
```

Claude Code will automatically pick up the `.mcp.json` file in this folder and connect to Gmail!

---

## 💬 Step 4: Talk to Your Agent

Once Claude Code is running, try these prompts:

**To see what's in your inbox:**
```
Show me the last 10 emails in my inbox
```

**To find bills:**
```
Find any emails that look like bills or invoices from the last 30 days
```

**To organize:**
```
Label all emails from my bank as "Finance"
```

**To get a bill summary:**
```
List all bills I need to pay, with amounts and due dates if you can find them
```

---

## ⚠️ Safety Rules (Built Into the Agent)

The agent will **never**:
- Pay anything automatically
- Delete emails without asking you first
- Take any action it hasn't explained to you first

You are always in control. The agent only does what you approve.

---

## 🆘 Troubleshooting

**"command not found: claude"**
→ Close and reopen your terminal after installing Claude Code

**"MCP server not connected"**
→ Make sure your `.env` file has all three values filled in

**Gmail API errors**
→ Make sure you enabled the Gmail API in Step 1 (point 4)

**Still stuck?**
→ Ask Claude Code itself! Type: `what's wrong with my MCP setup?`
