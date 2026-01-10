# Interaction Backups

This directory contains automatically backed up interaction data from Render.

## Setup Automatic Backup

1. Go to GitHub repository Settings → Secrets and variables → Actions
2. Add a new secret:
   - Name: `RENDER_URL`
   - Value: Your Render app URL (e.g., `https://your-app.onrender.com`)

3. The GitHub Action will automatically run daily at 2 AM UTC (10 AM Taiwan time)

## Manual Backup

You can also manually trigger the backup:
1. Go to Actions tab in GitHub
2. Select "Backup Student Interactions"
3. Click "Run workflow"

## Files

- `interactions-YYYY-MM-DD.xlsx` - Daily backup files
- Each file contains all interactions up to that date
