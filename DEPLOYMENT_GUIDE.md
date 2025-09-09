# GitHub Pages Deployment Troubleshooting Guide

## Quick Fixes (Try these first)

### Option 1: Manual GitHub Pages Setup (Recommended)
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **"Deploy from a branch"**
5. Choose **main** (or master) branch
6. Select **/ (root)** folder
7. Click **Save**
8. Wait 2-3 minutes and check the provided URL

### Option 2: Use GitHub Actions (if you prefer automation)

**Step 1: Enable GitHub Pages with Actions**
1. Go to Settings → Pages
2. Under **Source**, select **"GitHub Actions"**
3. Save the settings

**Step 2: Choose one workflow file**
I've created 3 different workflow files. Use only ONE of them:

- `deploy.yml` - Modern approach (try this first)
- `static.yml` - Alternative modern approach
- `gh-pages.yml` - Older, more reliable approach

**Delete the other two workflow files** to avoid conflicts.

## Common Issues and Solutions

### Issue 1: "Pages build and deployment" failing
**Solution:** 
- Go to Settings → Pages
- Change source from "GitHub Actions" to "Deploy from a branch"
- Select your main branch and / (root) folder

### Issue 2: 404 Error when visiting the site
**Causes:**
- Wrong branch selected
- Files not in root directory
- Case sensitivity issues

**Solution:**
- Ensure `index.html` is in the root of your repository
- Check that the branch name matches (main vs master)
- Verify all files are committed and pushed

### Issue 3: Workflow permissions error
**Solution:**
1. Go to Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Save

### Issue 4: API Key not working
**Note:** The API key is hardcoded in the JavaScript file, which is fine for this demo. In production, you'd want to use environment variables, but for GitHub Pages static hosting, this approach works.

## Testing Your Deployment

Once deployed, test these features:
1. Enter a valid stock symbol (e.g., AAPL)
2. Check that real data loads (not demo data)
3. Verify the chart displays correctly
4. Test the prediction functionality
5. Ensure the game progresses through multiple days

## Recommended Deployment Steps

1. **First, try the manual approach** (Option 1 above) - it's the most reliable
2. If you need automation, use the GitHub Actions approach
3. Keep only one workflow file in `.github/workflows/`
4. Make sure your repository is public (required for free GitHub Pages)

## File Structure Check
Your repository should have this structure:
```
/
├── index.html
├── styles.css
├── script.js
├── README.md
├── package.json
├── .gitignore
└── .github/
    └── workflows/
        └── (one of the yml files)
```

## Still Having Issues?

1. Check the Actions tab in your repository for error details
2. Ensure your repository is public
3. Try deleting all workflow files and use manual deployment
4. Check that you're pushing to the correct branch (main or master)

The game should work perfectly once deployed - it's been tested and includes all the required functionality!