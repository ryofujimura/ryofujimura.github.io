#!/usr/bin/env node
/* Applies storage-cors.json to the Firebase/GCS bucket (fixes browser getBlob/fetch CORS). */
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local")
  if (!fs.existsSync(p)) return
  const text = fs.readFileSync(p, "utf8")
  for (const line of text.split("\n")) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const i = t.indexOf("=")
    if (i < 1) continue
    const key = t.slice(0, i).trim()
    let val = t.slice(i + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

loadEnvLocal()

const bucket =
  process.env.STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

if (!bucket) {
  console.error(
    "Missing bucket: set STORAGE_BUCKET or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in .env.local",
  )
  process.exit(1)
}

const corsFile = path.join(process.cwd(), "storage-cors.json")
if (!fs.existsSync(corsFile)) {
  console.error("Missing storage-cors.json in project root")
  process.exit(1)
}

const gsUrl = `gs://${bucket.replace(/^gs:\/\//, "")}`
console.log(`Applying CORS to ${gsUrl} …`)
execSync(`gsutil cors set "${corsFile}" "${gsUrl}"`, { stdio: "inherit" })
console.log("Done. Propagation can take a few minutes.")
