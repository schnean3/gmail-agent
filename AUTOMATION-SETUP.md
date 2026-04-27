# Setting Up Weekly Automation — Windows Task Scheduler

Follow these steps once and the agent will run every Monday at 7:00 AM automatically.

---

## Step 1 — Copy the files into your gmail-agent folder

Copy these two files into `C:\Claude Code\gmail-agent\`:
- `run-daily-agent.bat`
- `daily-task.txt`

---

## Step 2 — Test it manually first

Before scheduling, make sure it works by double-clicking `run-daily-agent.bat`.

Wait 1-2 minutes. Then check if a file appeared in:
`C:\Claude Code\gmail-agent\logs\`

Open the file — you should see your email summary inside. ✅

If it worked, continue to Step 3.

---

## Step 3 — Open Task Scheduler

1. Press the **Windows key**
2. Type `Task Scheduler`
3. Click it to open

---

## Step 4 — Create a new task

1. On the right side, click **"Create Basic Task..."**
2. Name: `Gmail Agent Weekly Run`
3. Description: `Runs Claude Code every Monday to organize Gmail and find bills`
4. Click **Next**

---

## Step 5 — Set the schedule

1. Trigger: choose **Weekly**
2. Click **Next**
3. Start time: `07:00:00`
4. Recur every `1` weeks
5. Check only **Monday** (uncheck all other days)
6. Click **Next**

---

## Step 6 — Set the action

1. Action: **Start a program**
2. Click **Next**
3. Program/script: click Browse and find your file:
   `C:\Claude Code\gmail-agent\run-daily-agent.bat`
4. Start in (optional): `C:\Claude Code\gmail-agent`
5. Click **Next**

---

## Step 7 — Finish

1. Check **"Open the Properties dialog when I click Finish"**
2. Click **Finish**
3. In the Properties window that opens:
   - Go to the **General** tab
   - Check **"Run whether user is logged on or not"**
   - Check **"Run with highest privileges"**
4. Click **OK** — it may ask for your Windows password

---

## Step 8 — Check your weekly digest

Every Monday morning a summary is saved here:
`C:\Claude Code\gmail-agent\logs\`

Named like: `digest-2026-04-28.txt`

You'll also receive it by email at schnean3@gmail.com at 7:00 AM. 📬

---

## To temporarily stop the automation

Open Task Scheduler → find `Gmail Agent Weekly Run` → right-click → **Disable**

To restart it: right-click → **Enable**
