const api = 'http://greenvelvet.alwaysdata.net/bugTracker/api';
let form = document.getElementById('authForm');

async function signup(e) {

    e.preventDefault();

    let username = document.getElementById('authFormUsernameSignup').value;
    let password = document.getElementById('authFormPasswordSignup').value;
    let passwordValidation = document.getElementById('authFormPasswordConfirm').value;

    let errorCtn = document.querySelector('.errorCtn');

    let regexUsername = new RegExp('^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$');
    let regexPassword = new RegExp('^.{8,20}$');

    let wrongVerif = document.createElement('p')
    let wrongUsername = document.createElement('p')
    let wrongPassword = document.createElement('p')
    wrongVerif.innerText = 'Les mots de passe ne correspondent pas';
    wrongUsername.innerText = 'Veuillez entrer un nom d\'utilisateur entre 8 et 20 charactères';
    wrongPassword.innerText = 'Veuillez utiliser un mot de passe entre 8 et 20 charactères';

    try {

        errorCtn.innerHTML = '';

        if (password !== passwordValidation) {
            errorCtn.append(wrongVerif)
        } else if (regexUsername.test(username) && regexPassword.test(password)) {
            
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
                errorCtn.innerHTML = `<p class='errorMsg'>${result.result.message}</p>`
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
        else if (!regexUsername.test(username) && !regexPassword.test(password)){
            errorCtn.append(wrongUsername, wrongPassword)
        } else if (!regexUsername.test(username)) {
            errorCtn.append(wrongUsername)
        } else if (!regexPassword.test(password)) {
            errorCtn.append(wrongPassword)
        }
    }
    catch(err) {console.log(err)}
}

form.addEventListener('submit', signup);