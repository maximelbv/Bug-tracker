const api = 'http://greenvelvet.alwaysdata.net/bugTracker/api';
returnHomeBtn = document.querySelector('.homeButton');
let logoutBtn = document.querySelector('.logoutBtn');

let errorCtn = document.querySelector('.errorCtn');

let wrongTitle = document.createElement('p');
let wrongDesc = document.createElement('p');
wrongTitle.innerText = 'Veuillez saisir un titre entre 3 et 100 charactères';
wrongDesc.innerText = 'Veuillez saisir une description entre 3 et 500 charactères';

if (localStorage.getItem('status') !== 'loggedIn') {
    location.replace('login.html')
}

async function logout() {

    const token = localStorage.getItem('token');

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
            localStorage.removeItem('status');
            localStorage.removeItem('token');
            location.reload();
        }
    }
    catch (err) { console.log(err) };

}

async function addReport(e) {

    e.preventDefault();

    console.log('ok');

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const title = document.getElementById('title').value;
    const description = document.getElementById('desc').value;
    
    const regexTitle = new RegExp('^.{3,100}$');
    const regexDesc = new RegExp('^.{3,500}$');

    document.querySelector('.errorCtn').innerHTML = '';

    try {
        
        if (regexTitle.test(title) && regexDesc.test(description)) {
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
        else if (!regexTitle.test(title) && !regexDesc.test(description)) {
            errorCtn.append(wrongTitle, wrongDesc);
        }  
        else if (!regexTitle.test(title)) {
            errorCtn.append(wrongTitle);
        } 
        else if (!regexDesc.test(description)) {
            errorCtn.append(wrongDesc);
        } 

    }
    catch (err) { console.log(err) }
}

logoutBtn.addEventListener('click', logout);
returnHomeBtn.addEventListener('click', () => {location.replace('index.html')});
document.querySelector('.reportForm').addEventListener('submit', addReport);