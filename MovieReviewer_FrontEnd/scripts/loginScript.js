const API_MAIN_URL = "https://localhost:7199/";
const ALL_MOVIES_URL = API_MAIN_URL + "api/movies";
const LOGIN_URL = API_MAIN_URL + "login"
const CREATE_URL = API_MAIN_URL + "register"


let logOutButton = document.getElementById("logoutButton");
let loginForm = document.getElementById("LoginForm");
let createAccountForm = document.getElementById("CreateAccountForm");
const info = document.getElementById("output");
let bearerToken = "";

//Add eventlisteners
document.addEventListener("DOMContentLoaded", function (event) {
    DisplayInfo();
})

logOutButton.addEventListener("click", function (event) {
    event.preventDefault();
    logOut();
})

loginForm.addEventListener("submit", async function (event) {
    bearerToken = await Login(event);
});

createAccountForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    createNewAccount();
})


// --- ACCOUNT ---
async function Login(event) {
    event.preventDefault(); // Prevent default form submission behavior
    let userEmail = document.getElementById("email").value;
    let userPassword = document.getElementById("LoginPassword").value;

    const requestBody = JSON.stringify({
        "email": userEmail,
        "password": userPassword
    })

    try {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        });
        if (response.status != 200) {
            console.log("Error with reponse statis is: " + response.status)
            DisplayErrors(error, response.status);
            return;
        }
        //SUCCESS
        const data = await response.json();
        localStorage.setItem("userToken", data.accessToken);
        DisplayInfo();
        return data.accessToken;

    } catch (error) {
        console.log("Error with login: " + error)
        DisplayErrors(error);
    }

}

//Removes the user and tells them they're out
function logOut() {
    if (localStorage.getItem("userToken") != null) {
        localStorage.removeItem("userToken")
        bearerToken = "";
    }
    DisplayInfo()
}

async function createNewAccount() {
    let newUserEmail = document.getElementById("CreateEmailInput").value;
    let newUserPassword = document.getElementById("CreatePasswordInput").value;

    const requestBody = JSON.stringify({
        "email": newUserEmail,
        "password": newUserPassword
    })
    console.log(requestBody)

    try {
        const response = await fetch(CREATE_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        })
        //Error handling
        if (response.status != 200) {
            console.log("Error creating accoung with status: " + response.status)
        }
        //SUCCESS
        DisplayCreatedInfo(newUserEmail, newUserPassword);
    } catch (error) {
        console.log(error)
        DisplayErrors(error)
    }
}






//----- PRIVATE FUNCTIONS -----

//Display if the user is logged in or not on screen
function DisplayInfo() {
    if (localStorage.getItem("userToken") != null) {
        info.textContent = "You're logged in!";
        logOutButton.classList.remove("invisible")
    } else {
        info.textContent = "You're NOT logged in!";
        logOutButton.classList.add("invisible")
    }
}


//Shot error handling, possibly add more later works for now
function DisplayErrors(error, statusCode) {
    info.textContent = "There was an error logging in. status: " + statusCode;
}
function DisplayCreatedInfo(newEmail, newPassword) {
    info.textContent = "You've created a new account! " +
        "Info is displayed below for simpler testing: ";

    let testingEmail = document.getElementById("testingUserEmail");
    let testingPassword = document.getElementById("testingUserPassword");

    testingEmail.textContent = newEmail;
    testingPassword.textContent = newPassword;
}