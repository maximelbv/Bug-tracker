const api = 'http://greenvelvet.alwaysdata.net/bugTracker/api';
let logoutBtn = document.querySelector('.logoutBtn');
let addBtn = document.querySelector('.addButton');

if (localStorage.getItem('status') !== 'loggedIn') {
    location.replace('login.html')
}

async function getUser(userId) {

    const token = localStorage.getItem('token');

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
        if (result.result.status !== 'done') {
            console.log(result.result.message);
        } else {
            let name = result.result.user[userId];
            console.log(name);
            return name;
        }
    }
    catch (err) { console.log(err) };
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
            if (confirm('Vous allez être déconnecté, voulez vous poursuivre?')) {
                localStorage.removeItem('status');
                localStorage.removeItem('token');
                location.reload();
            } else {return false}
        }
    }
    catch (err) { console.log(err) };
    
}

async function deleteBug (id) {

    const token = localStorage.getItem('token');
    const bugId = id;
    try {
        const response = await fetch(`${api}/delete/${token}/${bugId}`, {
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

        if (result.result.status !== 'done') {
            console.log(result.result.message);
        } else if (result.result.status == 'done'){
            console.log(result.result.message);
            location.reload();
        }
    }
    catch (err) { console.log(err) };
}

async function changeState (id, nState) {

    const token = localStorage.getItem('token');
    const bugId = id;
    const newState = nState;

    try {
        const response = await fetch(`${api}/state/${token}/${bugId}/${newState}`, {
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

        if (result.result.status !== 'done') {
            console.log(result.result.message);
        } else if (result.result.status == 'done') {
            console.log(result);
            console.log(nState);
            // location.reload();
        }
    }
    catch (err) { console.log(err) };
}

async function displayBugs () {

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    try {
        const response = await fetch(`${api}/list/${token}/${userId}`, {
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

        if (result.result.status !== 'done') {
            console.log(result.result.message);
        } else {

            let table = document.querySelector('.tableBody');

            let bugList = result.result.bug;
            
            for (let bug of bugList) {
                console.log(bug);

                let row = document.createElement('tr');
                row.classList.add('tableUnit');
                table.appendChild(row);
                
                // TITLE & DESC
                let desc = document.createElement('td');
                desc.classList.add('tableUnitDesc');
                row.appendChild(desc);
                
                let descTitle = document.createElement('p');
                descTitle.innerText = bug.title;
                descTitle.classList.add('tableUnitDescTitle');
                desc.appendChild(descTitle);
                
                let descDesc = document.createElement('p');
                descDesc.innerText = bug.description;
                descDesc.classList.add('tableUnitDescDesc');
                desc.appendChild(descDesc);
                
                // DATE
                const returnDate = () => {
                    const time = bug.timestamp * 1000
                    const format = {
                        day: 'numeric',
                        month: "2-digit",
                        year: "numeric"
                    }
                    return (new Date(time).toLocaleString('fr', format))
                }

                let date = document.createElement('td');
                date.innerText = returnDate();
                date.classList.add('tableUnitDate');
                row.appendChild(date);
                
                // DEVELOPER NAME
                let devName = document.createElement('td');
                devName.innerText = getUser(bug.user_id);
                devName.classList.add('tableUnitDate');
                row.appendChild(devName);
                
                
                //STATE INPUT
                let stateInputCtn = document.createElement('td');
                stateInputCtn.classList.add('tableUnitState');
                row.appendChild(stateInputCtn);
                
                let stateInput = document.createElement('select');
                stateInput.setAttribute('name', 'state');
                stateInput.setAttribute('id', 'stateList');
                stateInputCtn.appendChild(stateInput);
                
                let opt1 = document.createElement('option');
                opt1.setAttribute('value', '0');
                opt1.innerText = 'À traiter';
                stateInput.appendChild(opt1);
                
                let opt2 = document.createElement('option');
                opt2.setAttribute('value', '1');
                opt2.innerText = 'En cours';
                stateInput.appendChild(opt2);
                
                let opt3 = document.createElement('option');
                opt3.setAttribute('value', '2');
                opt3.innerText = 'Terminé';
                stateInput.appendChild(opt3);


                let currentState = stateInput.options[stateInput.selectedIndex].value;
                console.log(currentState);
                stateInput.setAttribute('onchange', `console.log(${bug.id}, ${currentState})`);
                stateInput.setAttribute('onchange', `changeState(${bug.id}, ${currentState})`);

                // DELETE BUTTON
                let deleteCtn = document.createElement('td');
                deleteCtn.classList.add('tableUnitDelete');
                row.appendChild(deleteCtn);
                
                let deleteBtn = document.createElement('button');
                deleteBtn.classList.add('actionButtonTwo', 'deleteButton');
                deleteBtn.setAttribute('id', bug.id);
                deleteBtn.setAttribute('onclick', `deleteBug(${bug.id})`);
                deleteCtn.appendChild(deleteBtn);
                
                let deleteImg = document.createElement('img');
                deleteImg.setAttribute('src', './media/icons/cross.png');
                deleteImg.setAttribute('alt', 'delete button icon');
                deleteImg.setAttribute('width', '12px');
                deleteBtn.appendChild(deleteImg);

                let deleteTxt = document.createElement('p');
                deleteTxt.innerText = 'Supprimer';
                deleteBtn.appendChild(deleteTxt);

            }

        }
    }
    catch (err) { console.log(err) };
}

logoutBtn.addEventListener('click', logout);
addBtn.addEventListener('click', () => {location.replace('reportABug.html')});
displayBugs();