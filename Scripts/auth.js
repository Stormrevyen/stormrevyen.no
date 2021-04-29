//TODO Få denne til å fungere! Får ikke til å oppgradere til spark plan på firebase!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/** Add admin
function addAdmin(email) {
const addAdminRole = functions.httpsCallable('addAdminRole');
addAdminRole(email).then(result => {
    console.log(result);
});
}*/


//** UI
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const setupUI = (user) => {
    if(user){
        /*db.collection('users').doc(user.uid).get().then(doc => {
            const html = `
                <li>Epost: ${user.email}</li>
                <li>Visningsnavn: ${user.displayname}</li>
                <li>Medlem: ${user.memberstate}</li>
                <li>Gruppetildeling: ${user.group}</li>
                <li>${doc.data().bio}</li>
            `;
            accountDetails.innerHTML = html;
        });*/
        
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        accountDetails.innerHTML = '';

        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}

//** Listen for auth status changes
auth.onAuthStateChanged(user => {
    if(user){
        user.getIdTokenResult().then(idTokenResult => {
            console.log(idTokenResult.claims.admin);
        });
        db.collection('posts').onSnapshot(snapshot => {
            setupUI(user);
            console.log('user logged in: ', user);
        });
    }else{
        setupUI();
        console.log('user logged out.');
    }
});

//** Signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    //sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            displayname: signupForm['signup-displayname'].value,
            bio: signupForm['signup-bio'].value,
            email: signupForm['signup-email'].value
        });
    }).then(() => {
        document.getElementById('popup-signup').style.display = 'none';
        signupForm.reset();
    });
});

//** Logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

function logoutFunc() {
    e.preventDefault();
    auth.signOut();
}

//** Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    //sign in user
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        document.getElementById('popup-login').style.display = 'none';
        loginForm.reset();
    });
});