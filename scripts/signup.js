const api = 'http://greenvelvet.alwaysdata.net/bugTracker/api';
let form = document.getElementById('authForm');

async function signup(e) {

    e.preventDefault();

    let username = document.getElementById('authFormUsernameSignup').value;
    let password = document.getElementById('authFormPasswordSignup').value;
    let passwordValidation = document.getElementById('authFormPasswordConfirm').value;

    if (passwordValidation !== password) {
        document.querySelector('.errorCtn').innerHTML = `<p class='errorMsg'>Le mot de passe ne correspond pas</p>`
    } else {
        try {
            const response = await fetch(`${api}/signup/${username}/${password}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.result.status === 'failure') {
                document.querySelector('.errorCtn').innerHTML = `<p class='errorMsg'>${result.result.message}</p>`
            }

            if (result.result.status === 'done') {
                sessionStorage.setItem('status', 'loggedIn');
                sessionStorage.setItem('token', result.result.token);
                location.replace('index.html');
            }
            console.log(result);
            return result;
        }
        catch(err) {console.log(err)}
    }
}

form.addEventListener('submit', signup);