const api = 'http://greenvelvet.alwaysdata.net/bugTracker/api';

// BUTTONS
let switchButtons = document.getElementsByClassName("switchButton");
let completeListBtn = document.querySelector('.completeListFilter');
let treatListBtn = document.querySelector('.treatListFilter');
let addBtn = document.querySelector('.addButton');
let logoutBtn = document.querySelector('.logoutBtn');

// USER INFOS
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');

let displayFetch = `${api}/list/${token}/0`;

// check if the user is authenticated
if (localStorage.getItem('status') !== 'loggedIn') {
    location.replace('login.html')
}

// Filters
let addSelectClass = function(){
    removeSelectClass();
    this.classList.add('selected');	
}

let removeSelectClass = function(){
    for (button of switchButtons) {
        button.classList.remove('selected')
    }
}

for (button of switchButtons) {
    button.addEventListener("click",addSelectClass);
    button.addEventListener("click",() => {
        if (completeListBtn.classList.contains('selected')) {
            displayFetch = `${api}/list/${token}/0`;
            displayBugs();
        } else if (treatListBtn.classList.contains('selected')) {
            displayFetch = `${api}/list/${token}/${userId}`;
            displayBugs();
        }
    });
}

// misc functions
async function ping () {
    const response = await fetch(`${api}/ping`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    
    if (result.result.ready !== 'true') {
        console.log('API status : OK');
    }
}

async function logout() {

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
        if (result.result.status !== 'done') {
            console.log(result.result.message);
        } else {
            localStorage.removeItem('status');
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            location.reload();
        }
    }
    catch (err) { console.log(err) };
    
}

// CRUD functions (create function is in 'reportABug.js')
async function deleteBug (id) {

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

        if (result.result.status !== 'done') {
            console.log(result.result.message);
        } else if (result.result.status == 'done'){
            console.log(result.result.message);
            alert('Bug supprim??');
            location.reload();
        }
    }
    catch (err) { console.log(err) };
}

async function changeState (id, nState) {

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

        if (result.result.status !== 'done') {
            console.log(result.result.message);
        } else if (result.result.status == 'done') {
            location.reload();
        }
    }
    catch (err) { console.log(err) };
}

async function displayBugs () {

    document.querySelector('.tableBody').innerHTML = '';

    try {

        const response = await fetch(displayFetch, {
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

            let allCount = 0;
            let inProgressCount = 0;
            let completedCount = 0;

            let table = document.querySelector('.tableBody');

            let bugList = result.result.bug;

            
            for (let bug of bugList) {

                let username;

                // get the name of the user with the user_id of the bug
                try {
                    const userId = bug.user_id;
                    const response = await fetch(`${api}/users/${token}`, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                        },
                    })

                    if (!response.ok) {
                        throw new Error(`Error! status: ${response.status}`);
                    }
                    const result = await response.json();
                    if (result.result.status !== 'done') {
                        console.log(result.result.message);
                    } else {
                        username = result.result.user[userId];
                    }
                }
                catch (err) { console.log(err) };

                // create elements
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
                devName.innerText = username;
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
                stateInput.setAttribute('disabled', 'disabled');
                if (bug.user_id === userId) {
                    stateInput.removeAttribute('disabled', 'disabled');
                }
                
                let opt1 = document.createElement('option');
                opt1.setAttribute('value', '0');
                if (bug.state == opt1.value) {
                    opt1.setAttribute('selected', 'selected')
                }
                opt1.innerText = '?? traiter';
                stateInput.appendChild(opt1);
                
                let opt2 = document.createElement('option');
                opt2.setAttribute('value', '1');
                if (bug.state == opt2.value) {
                    opt2.setAttribute('selected', 'selected')
                }
                opt2.innerText = 'En cours';
                stateInput.appendChild(opt2);
                
                let opt3 = document.createElement('option');
                opt3.setAttribute('value', '2');
                if (bug.state == opt3.value) {
                    opt3.setAttribute('selected', 'selected')
                }
                opt3.innerText = 'Termin??';
                stateInput.appendChild(opt3);

                // DELETE BUTTON

                if (bug.user_id === userId) {
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
    
                    let deleteTxt = document.createElement('span');
                    deleteTxt.innerText = 'Supprimer';
                    deleteBtn.appendChild(deleteTxt);
                }

                // -------------------------------------------

                stateInput.addEventListener('change',() => changeState(bug.id, stateInput.options[stateInput.selectedIndex].value));

                allCount++;
                if (bug.state === '1') { inProgressCount++ };
                if (bug.state === '2') { completedCount++ };

            }
            document.getElementById('allCount').innerText = allCount;
            document.getElementById('inProgressCount').innerText = inProgressCount;
            document.getElementById('completedCount').innerText = completedCount;
        }
    }
    catch (err) { console.log(err) };
}

logoutBtn.addEventListener('click', logout);
addBtn.addEventListener('click', () => {location.replace('reportABug.html')});
displayBugs();