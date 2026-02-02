# Hobbies Site

A simple landing page for the hobbies subdomain.

## Setup Instructions

### 1. Add Your Image
Replace `images/hobby.jpg` with your actual image.

### 2. Create the Firebase Hosting Site
In Firebase Console or via CLI, add a new hosting site:

```bash
firebase hosting:sites:create ryof-hobbies
```

### 3. Connect Your Subdomain
In Firebase Console:
1. Go to Hosting
2. Click on the `ryof-hobbies` site
3. Click "Add custom domain"
4. Enter your subdomain: `hobbies.yourdomain.com`
5. Follow the DNS verification steps

### 4. Deploy
```bash
npm run deploy:hobbies
```

Or deploy both sites at once:
```bash
npm run deploy:all
```

## Customization
Edit `index.html` to change the text, styling, or add more content.
