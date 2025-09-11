# Firebase Auth Demo (No Build)

This is a minimal, stylish login/signup flow using Firebase Authentication with ES module CDN imports. Open the HTML files directly or serve with any static server.

## Files
- `index.html` — Login and Sign Up with Email/Password and Google
- `dashboard.html` — Protected page shown after successful login
- `main.js` — Auth logic
- `styles.css` — Styling

## Quick Start
1. Open `index.html` in your browser (double-click or serve statically).
2. Create an account or sign in with email/password, or use Google sign-in.
3. After authentication, you'll be redirected to `dashboard.html`.
4. Click "Sign out" to return to the login page.

## Notes
- Uses your provided Firebase config. You may restrict your API key in Firebase console.
- For Google sign-in, ensure the OAuth redirect domain (e.g., `http://localhost`) is added in Firebase Console → Auth → Settings.
- If opening directly from the file system, some browsers block popup sign-in. If Google popup is blocked, run a simple static server:

```bash
# PowerShell from repo root
python -m http.server 5500
# then open http://localhost:5500/index.html
```

## Customize
- Colors are controlled by CSS variables in `styles.css`.
- Light/dark mode reacts to system preference.
