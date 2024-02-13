const generated = document.querySelector('#generated');
const giveNew = document.querySelector('#giveNew');
const list = document.querySelector('#list');
let JSONdata;

const init = async () => {
    await fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            JSONdata = data;
        });

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    JSONdata.element.forEach(element => {
        const row = document.createElement('li')
        const deleteButton = document.createElement('button');
        const paragraph = document.createElement('p');
        deleteButton.innerText = 'X';
        // the value of the button is the index of the element
        deleteButton.value = JSONdata.element.indexOf(element).toString();
        const valueToDelete = deleteButton.value;
        deleteButton.addEventListener('click', async () => {
            await fetch('/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({value: valueToDelete}),
            }).then(() => {
                list.removeChild(row);
            }).catch(err => console.error(err));
        });
        paragraph.textContent = element.toString();
        row.appendChild(deleteButton);
        row.appendChild(paragraph);
        list.appendChild(row);
    })
}

init().then(r => console.log('Initial data:', r));

giveNew.addEventListener('click', async () => {
    let json = ""
    await fetch('data.json')
        .then(response => response.json())
        .then(data => {
            JSONdata = data;
        });

    if (generated.value !== '') {
        let temp = {}
        temp.value = generated.value;
        generated.value = '';

        json += JSON.stringify(temp);
        console.log('Sending data:', json);
    }

    await fetch('/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json,
    });

    await init()
});