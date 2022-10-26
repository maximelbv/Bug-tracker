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

    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    
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
                // table.append(`
                // <tr class="tableUnit">
                //     <td class="tableUnitDesc">
                //         <p class="tableUnitDescTitle">Title</p>
                //         <p class="tableUnitDescDesc">Description</p>
                //     </td>
                //     <td class="tableUnitDate">date</td>
                //     <td class="tableUnitName">developer</td>
                //     <td class="tableunitState">
                //         <select name="state" id="stateList">
                //             <option value="À traiter">À traiter</option>
                //             <option value="En cours">En cours</option>
                //             <option value="Terminé">Terminé</option>
                //         </select>
                //     </td>
                //     <td class="tableUnitDelete">
                //         <button class="actionButtonTwo deleteButton"> 
                //             <img src="./media/icons/cross.png" alt="cross delete icon" width="12px">
                //             <p>Supprimer</p>
                //         </button>
                //     </td>
                // </tr>
                // `)
            }

        }
    }
    catch (err) { console.log(err) };
}

logoutBtn.addEventListener('click', logout);
displayBugs();