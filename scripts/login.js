const api = 'http://greenvelvet.alwaysdata.net/bugTracker/api';

async function login() {

    let username = document.getElementById('authFormUsernameLog').value;
    let password = document.getElementById('authFormPasswordLog').value;

    console.log(username,'+', password)

    try {
        const response = await fetch(`${api}/login/${username}/${password}`, {
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

document.getElementById('loginSubmit').addEventListener('click', login);