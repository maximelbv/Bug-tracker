const api = 'http://greenvelvet.alwaysdata.net/bugTracker/api';

if (sessionStorage.getItem('status') !== 'loggedIn') {
    location.replace('login.html')
}

let logoutBtn = document.querySelector('.logoutBtn');

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


async function displayBugs () {
    
    try {
        const response = await fetch(`${api}/users/${token}`, {
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
    }
    catch (err) { console.log(err) };
}

logoutBtn.addEventListener('click', logout);
displayBugs();