const api = 'http://greenvelvet.alwaysdata.net/bugTracker/api';
let form = document.getElementById('authForm');

async function signup(e) {

    e.preventDefault();

    let username = document.getElementById('authFormUsernameSignup').value;
    let password = document.getElementById('authFormPasswordSignup').value;
    let passwordValidation = document.getElementById('authFormPasswordConfirm').value;

    let regexUsername = new RegExp('^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$');
    let regexPassword = new RegExp('"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"');

    document.querySelector('.errorCtn').innerHTML = '';
    if (passwordValidation !== password) {
        let wrongVerif = document.createElement('p').innerText = 'Les mots de passe ne correspondent pas';
        document.querySelector('.errorCtn').append(wrongVerif);
    } 
    if (!regexUsername.test(username)) {
        let wrongUsername = document.createElement('p').innerText = 'Mauvais format d\'identifiant';
        document.querySelector('.errorCtn').append(wrongUsername);
    } 
    if (!regexPassword.test(password)) {
        let wrongPassword = document.createElement('p').innerText = 'Mauvais format de mot de passe.';
        document.querySelector('.errorCtn').append(wrongPassword);
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
                localStorage.setItem('status', 'loggedIn');
                localStorage.setItem('token', result.result.token);
                localStorage.setItem('userId', result.result.id);
                location.replace('index.html');
            }
            console.log(result);
            return result;
        }
        catch(err) {console.log(err)}
    }
}

form.addEventListener('submit', signup);