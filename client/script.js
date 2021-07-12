// place an order only after login and all shopping cart cleared after order is placed sucessfully 
function displayHomePage() {
    document.getElementById('#').style.display = 'block';//body
    document.getElementById('#').style.display = 'none';//login form 
    document.getElementById('#').style.display = 'block';//logout
   
}

function displayLoginPage() {
    document.getElementById('#').style.display = 'none';//body
    document.getElementById('#').style.display = 'none';//logout
}

window.onload = function() {
    if (sessionStorage.getItem('accessToken')) {
        displayHomePage();
    } else {
        displayLoginPage();
    }

    document.getElementById('loginBtn').onclick = async function(event) {
        event.preventDefault();
        let result = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            })
        }).then(response => response.json());

        if (result.accessToken) {
            sessionStorage.setItem('accessToken', result.accessToken);
            displayHomePage();
        } else {
            document.getElementById('loginErrorMsg').textContent = result.error;
        }
    }
//removing accessTon will enable logout feature
    document.getElementById('logoutBtn').onclick = function(event) {
        sessionStorage.removeItem('accessToken');
        location.reload();
    }
