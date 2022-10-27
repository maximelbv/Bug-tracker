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

async function addReport(e) {

    e.preventDefault();

    console.log('ok');

    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');

    const title = document.getElementById('title').value;
    const description = document.getElementById('desc').value;
    console.log(token, userId)

    try {
        const response = await fetch(`${api}/add/${token}/${userId}`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                title: title,
                description: description,
            })
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.result.status === 'failure') {
            document.querySelector('.errorCtn').innerHTML = `<p class='errorMsg'>${result.result.message}</p>`
        }

        if (result.result.status === 'done') {
            console.log(result.result);
            console.log('done');
            document.querySelector('.main').innerHTML = 
            `
            <div class='animCtn'>
                <lottie-player 
                    class='validationAnim' 
                    src="./media/anim/validation.json" 
                    background="transparent" 
                    speed="1"
                    autoplay
                ></lottie-player>
            </div>
            `
            setTimeout(() => {location.replace('index.html')}, 1500);
        }

    }
    catch (err) { console.log(err) }
}

logoutBtn.addEventListener('click', logout);
returnHomeBtn.addEventListener('click', () => {location.replace('index.html')});
document.querySelector('.reportForm').addEventListener('submit', addReport);