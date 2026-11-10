# Bandcamp merch sync

Copies the merch from <https://discardedband.bandcamp.com/merch> into Firestore
(`site_content/merch`) once a day. The website's Merch page reads it from there,
and every product links back to Bandcamp, where people order.

Runs on GitHub Actions: [`.github/workflows/sync-merch.yml`](../../.github/workflows/sync-merch.yml).

## One-time setup

1. Firebase console → Project settings → **Service accounts** → **Generate new private key**.
   A `.json` file downloads. Keep it private; it can write to the whole Firebase project.
2. GitHub repo → Settings → Secrets and variables → Actions → **New repository secret**.
   Name: `FIREBASE_SERVICE_ACCOUNT`. Value: the entire contents of that `.json` file.
3. GitHub repo → Actions → **Sync Bandcamp merch** → **Run workflow**.
   The items show up on the site and under Admin → Merch.
4. Delete the downloaded `.json` file from your computer (GitHub keeps the secret).

After that it runs every day at 04:23 UTC. Changes on Bandcamp (new shirt, new
price, sold out) appear on the site after the next run, or straight away with
**Run workflow**.

## When something goes wrong

- **The run fails / Admin → Merch shows an error.** The site keeps showing the last
  good list. If the error says no items were found, Bandcamp probably changed its
  page: save the merch page (Ctrl+S, "HTML only") over `fixtures/merch-page.html`,
  run `npm test`, and adjust `parseMerch.js` until the tests pass.
- **"Last synced" gets old.** GitHub pauses scheduled workflows in public repos after
  60 days without any commits or pushes. Re-enable it on the workflow's page in the
  Actions tab.

## Running it yourself

```bash
cd scripts/merch-sync
npm ci
npm test             # parser tests against the saved Bandcamp page
npm run dry-run      # reads Bandcamp and prints the items, saves nothing
```
