const api = 'http://greenvelvet.alwaysdata.net/bugTracker/api';
returnHomeBtn = document.querySelector('.homeButton');
let logoutBtn = document.querySelector('.logoutBtn');

if (sessionStorage.getItem('status') !== 'loggedIn') {
    location.replace('login.html')
}

async function logout() {

    const token = sessionStorage.getItem('token');

    try {
        const response = await fetch(`${api}/logout/${token}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result)
        if (result.result.status !== 'done') {
            console.log(token);
            console.log(result.result.message);
        } else {
            sessionStorage.removeItem('status');
            sessionStorage.removeItem('token');
            location.reload();
        }
    }
    catch (err) { console.log(err) };

}

logoutBtn.addEventListener('click', logout);
returnHomeBtn.addEventListener('click', () => {location.replace('index.html')});