const api = 'http://greenvelvet.alwaysdata.net/bugTracker/api';

async function signup() {

    let username = document.getElementById('authFormUsernameSignup').value;
    let password = document.getElementById('authFormPasswordSignup').value;
    let passwordValidation = document.getElementById('authFormPasswordConfirm').value;

    console.log(username,'+', password)

    if (passwordValidation !== password) {
        console.log('le mot de passe ne correspond pas');
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
            console.log(result);
            console.log('ok');
            return result;
        }
        catch(err) {console.log(err)}
    }
}

document.getElementById('signupSubmit').addEventListener('click', signup);