// Firebase v10+ modular CDN imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// Firebase configuration provided by user
const firebaseConfig = {
    apiKey: "AIzaSyCVBV58Blk3DUgERNADbx3tREKx7Ux-0zs",
    authDomain: "medaware-fd462.firebaseapp.com",
    projectId: "medaware-fd462",
    storageBucket: "medaware-fd462.firebasestorage.app",
    messagingSenderId: "873284760937",
    appId: "1:873284760937:web:2a582e934b1d35b251b9f8",
    measurementId: "G-3ZFQ9Y19S2"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Elements
const form = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const toSignupLink = document.getElementById('to-signup');
const toSigninLink = document.getElementById('to-signin');
const toSignupRow = document.getElementById('to-signup-row');
const toSigninRow = document.getElementById('to-signin-row');
const googleBtn = document.getElementById('google-btn');
const statusEl = document.getElementById('status');
const confirmGroup = document.getElementById('confirm-group');
const confirmInput = document.getElementById('confirmPassword');
const titleEl = document.getElementById('form-title');
const forgotLink = document.getElementById('forgot-password');
// No subtitle on the new UI

let mode = 'signin'; // 'signin' | 'signup'

function setMode(next){
    mode = next;
    const isSignIn = mode === 'signin';
    submitBtn.textContent = isSignIn ? 'Sign in' : 'Create account';
    titleEl.textContent = isSignIn ? 'LOGIN' : 'CREATE ACCOUNT';
    confirmGroup.style.display = isSignIn ? 'none' : '';
    // Show the opposite-action link
    if(toSignupRow && toSigninRow){
        toSignupRow.style.display = isSignIn ? '' : 'none';
        toSigninRow.style.display = isSignIn ? 'none' : '';
    }
    if(isSignIn){
        confirmInput.value = '';
    }
    status('');
}

function status(message, type){
    statusEl.textContent = message || '';
    statusEl.className = 'status' + (type ? ` ${type}` : '');
}

if(toSignupLink){
    toSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        setMode('signup');
    });
}
if(toSigninLink){
    toSigninLink.addEventListener('click', (e) => {
        e.preventDefault();
        setMode('signin');
    });
}

if(forgotLink){
    forgotLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        if(!email){
            status('Enter your email first, then click “Forgot Password?”.', 'error');
            return;
        }
        try{
            await sendPasswordResetEmail(auth, email);
            status('Password reset email sent. Check your inbox.', 'success');
        }catch(err){
            status(friendlyError(err), 'error');
        }
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput?.value || '';
    if(!email || !password || (mode === 'signup' && !confirm)){
        status('Please fill in all fields', 'error');
        return;
    }
    if(mode === 'signup' && password !== confirm){
        status('Passwords do not match.', 'error');
        return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = mode === 'signin' ? 'Signing in…' : 'Creating…';
    status('');
    try{
        if(mode === 'signin'){
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        // onAuthStateChanged will handle redirect
    } catch (err){
        const msg = friendlyError(err);
        status(msg, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = mode === 'signin' ? 'Sign in' : 'Create account';
    }
});

googleBtn.addEventListener('click', async () => {
    googleBtn.disabled = true;
    googleBtn.textContent = 'Opening Google…';
    status('');
    try{
        await signInWithPopup(auth, googleProvider);
        // onAuthStateChanged will handle redirect
    } catch(err){
        status(friendlyError(err), 'error');
        googleBtn.disabled = false;
        googleBtn.textContent = 'Continue with Google';
    }
});

onAuthStateChanged(auth, (user) => {
    if(user){
        window.location.href = 'dashboard.html';
    }
});

function friendlyError(err){
    const code = err?.code || '';
    switch(code){
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            return 'Invalid email or password.';
        case 'auth/email-already-in-use':
            return 'Email already in use. Try signing in instead.';
        case 'auth/popup-closed-by-user':
            return 'Google sign-in was closed before completing.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        default:
            return err?.message || 'Something went wrong. Please try again.';
    }
}

// Optional sign out exposure for debugging on this page
window.__signOut = () => signOut(auth);


