auth.onAuthStateChanged(user => {
    if(user){
        setupUI(user);
        db.collection('users').doc(user.uid).get().then(doc => {
            console.log(doc.data().displayname + " has logged in!");
        })
        
    }else{
        setupUI('');
        console.log("logged out");
    }
});

//** UI
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const loginStatus = document.querySelector('#loginStatus');

const setupUI = (user) => {
    if(user){
        db.collection('users').doc(user.uid).get().then(doc => {
            if(doc.data().member == true){
                var memberstate = "Du er registrert som medlem i ";
            }else{
                var memberstate = "Du er IKKE registrert som medlem i ";
            }

            if(doc.data().group == undefined){
                var membergroup = "årets revy";
            }else{
                var membergroup = doc.data().group;
            }

            if(doc.data().styret == true){
                var styretstate = "REVYSTYRET"
            }else{
                var styretstate = "";
            }

            const account = `
                <h3>${doc.data().displayname}</h3>
                <h4>${user.email}</h4>
                <p>${memberstate} ${membergroup}!</p>
                <p>${styretstate}</p>
                <i>${doc.data().bio}</i>
            `;
            const status = `Logget inn som ${doc.data().displayname}`;

            accountDetails.innerHTML = account;
            loginStatus.innerHTML = status;
        });
        
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        accountDetails.innerHTML = '';

        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}

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
const logout = document.querySelectorAll('.logout').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut();
    });
});

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

//** Message
const messageForm = document.querySelector('#message-form');
var time = Date.now();
var date = new Date(time);
var dato = "0" + date.getDate();
var month = "0" + (date.getMonth() + 1);
var year = date.getFullYear()
var hours = date.getHours();
var minutes = "0" + date.getMinutes();
var formattedTime = dato.substr(-2) + "." + month.substr(-2) + "." + year + " - " + hours + ":" + minutes.substr(-2);


const sendMessage = (user) => {
    if(user){
        db.collection('users').doc(user.uid).get().then(doc => {
            db.collection('messages').add({
                title: messageForm['message-title'].value,
                content: messageForm['message-message'].value,
                author: doc.data().displayname,
                timestamp: formattedTime,
            }).then(() => {
                document.getElementById('popup-message').style.display = 'none';
                messageForm.reset();
            }).catch(err => {
                console.log(err.message);
            });
        });
    }else{
        console.log("Du må logge inn for å sende melding.")
    }
}

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});