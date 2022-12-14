const api = 'http://greenvelvet.alwaysdata.net/bugTracker/api';
let form = document.getElementById('authForm');

async function login(e) {

    e.preventDefault();

    let username = document.getElementById('authFormUsernameLog').value;
    let password = document.getElementById('authFormPasswordLog').value;

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

        if (result.result.status === 'failure') {
            document.querySelector('.errorCtn').innerHTML = `<p class='errorMsg'>${result.result.message}</p>`
        }

        if (result.result.status === 'done') {
            localStorage.setItem('status', 'loggedIn');
            localStorage.setItem('token', result.result.token);
            localStorage.setItem('userId', result.result.id);
            location.replace('index.html');
        }
        return result;
    }
    catch(err) {console.log(err)}
    
}

form.addEventListener('submit', login);