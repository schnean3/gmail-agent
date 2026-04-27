/**
 * setup-auth.js
 *
 * This script helps you get a Google OAuth refresh token.
 * Run it once with: node setup-auth.js
 *
 * It will:
 * 1. Open your browser to Google's login page
 * 2. Ask you to paste the code Google gives you
 * 3. Save your refresh token to the .env file automatically
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ─── Load .env file ────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, ".env");

if (!fs.existsSync(envPath)) {
  console.error('\n❌  No .env file found. Please copy .env.example to .env first:\n');
  console.error('    cp .env.example .env\n');
  console.error('Then fill in your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.\n');
  process.exit(1);
}

function loadEnv(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").split("\n");
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    env[key.trim()] = rest.join("=").trim();
  }
  return env;
}

const envVars = loadEnv(envPath);
const CLIENT_ID = envVars.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = envVars.GOOGLE_CLIENT_SECRET;

if (!CLIENT_ID || CLIENT_ID.includes("your-client-id")) {
  console.error('\n❌  GOOGLE_CLIENT_ID is not set in your .env file.');
  console.error('    Please follow Step 1 in the README.md to get your credentials.\n');
  process.exit(1);
}

if (!CLIENT_SECRET || CLIENT_SECRET.includes("your-client-secret")) {
  console.error('\n❌  GOOGLE_CLIENT_SECRET is not set in your .env file.');
  console.error('    Please follow Step 1 in the README.md to get your credentials.\n');
  process.exit(1);
}

// ─── OAuth Setup ────────────────────────────────────────────────────────────────
const REDIRECT_URI = "http://localhost:3456";
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://www.googleapis.com/auth/gmail.modify",
].join(" ");

const authUrl =
  `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${encodeURIComponent(CLIENT_ID)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log("\n🔐  Gmail Agent — Authentication Setup\n");
console.log("Opening your browser to Google login...\n");
console.log("If it doesn't open automatically, paste this URL in your browser:\n");
console.log(authUrl + "\n");

// Try to open the browser
try {
  const platform = process.platform;
  if (platform === "darwin") execSync(`open "${authUrl}"`);
  else if (platform === "win32") execSync(`start "" "${authUrl}"`);
  else execSync(`xdg-open "${authUrl}"`);
} catch {
  // Browser open failed — user will paste URL manually
}

// ─── Local server to catch the OAuth redirect ──────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:3456");
  const code = url.searchParams.get("code");

  if (!code) {
    res.writeHead(400);
    res.end("No code found. Please try again.");
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
    <html><body style="font-family:sans-serif;padding:40px;text-align:center">
      <h2>✅ Authentication successful!</h2>
      <p>You can close this tab and return to the terminal.</p>
    </body></html>
  `);

  server.close();

  // Exchange code for tokens
  console.log("\n✅  Authorization code received. Getting your refresh token...\n");

  const tokenResponse = await exchangeCodeForTokens(code);

  if (!tokenResponse.refresh_token) {
    console.error("❌  No refresh token received. Try revoking app access at");
    console.error("    https://myaccount.google.com/permissions and running this again.\n");
    process.exit(1);
  }

  // Save to .env
  let envContent = fs.readFileSync(envPath, "utf8");
  if (envContent.includes("GOOGLE_REFRESH_TOKEN=")) {
    envContent = envContent.replace(
      /GOOGLE_REFRESH_TOKEN=.*/,
      `GOOGLE_REFRESH_TOKEN=${tokenResponse.refresh_token}`
    );
  } else {
    envContent += `\nGOOGLE_REFRESH_TOKEN=${tokenResponse.refresh_token}\n`;
  }
  fs.writeFileSync(envPath, envContent);

  console.log("🎉  Success! Your .env file has been updated with your refresh token.");
  console.log("\nYou can now start Claude Code from this folder:\n");
  console.log("    claude\n");
  process.exit(0);
});

server.listen(3456, () => {
  // Server listening, waiting for redirect
});

// ─── Token exchange helper ─────────────────────────────────────────────────────
function exchangeCodeForTokens(code) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }).toString();

    const options = {
      hostname: "oauth2.googleapis.com",
      path: "/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Failed to parse token response: " + data));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}
