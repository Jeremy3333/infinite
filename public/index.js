const generated = document.querySelector('#generated');
const giveNew = document.querySelector('#giveNew');
const newFus = document.querySelector('#newFus');
const list = document.querySelector('#list');
const fus = document.querySelector('#fus');
const fusion = document.querySelector('#fusion');
let JSONdata;

const init = async () => {
    await fetch('/api/data/element')
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

    await addFusionElements();
    await addNextFusionElements();
}

const addFusionElements = async () => {
    let i = 0;
    JSONdata.fusion.forEach(fusion => {
        for(let j = i; j < fusion; j++){
            const row = document.createElement('li')
            const paragraph1 = document.createElement('p');
            const paragraph2 = document.createElement('p');

            paragraph1.textContent = JSONdata.element[i].toString();
            paragraph2.textContent = JSONdata.element[j].toString();
            row.appendChild(paragraph1);
            row.appendChild(paragraph2);
            fus.appendChild(row);
        }
        i++;
    });
}

const addNextFusionElements = async () => {
    let id = -1;
    let count = 0;

    if(JSONdata.fusion.length > 0){
        while (id < 0 && count < JSONdata.element.length) {
            if(JSONdata.fusion[count] < JSONdata.element.length){
                id = JSONdata.fusion[count];
            }
            if(count >= JSONdata.fusion.length)
            {
                id = count;
            }
            count++;
        }
        count--;
        id--;
    } else {
        id = 0;
    }


    if(id >= JSONdata.element.length - 1){
        count++;
        if(count >= JSONdata.fusion.length){
            JSONdata.fusion.push(JSONdata.fusion.length);
        }
        id = JSONdata.fusion[count];
    } else {
        id++;
    }


    fusion.firstChild.textContent = JSONdata.element[count].toString();
    fusion.lastChild.textContent = JSONdata.element[id].toString();

    return count;
}

init().then(r => console.log('Initial data:', r));

giveNew.addEventListener('click', async () => {
    let json = ""

    if (generated.value !== '') {
        let temp = {}
        temp.value = generated.value;
        generated.value = '';

        json += JSON.stringify(temp);
        console.log('Sending data:', json);
    }

    await fetch('/api/data/element', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json,
    });

    await init()
});

newFus.addEventListener('click', async () => {
    await fetch('data.json')
        .then(response => response.json())
        .then(data => {
            JSONdata = data;
        });

    console.log(JSONdata);

    await addNextFusionElements();

    let count = await addNextFusionElements();

    await fetch('/api/data/fusion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({value: count}),
    });

    while (fus.firstChild) {
        fus.removeChild(fus.firstChild);
    }
    await fetch('data.json')
        .then(response => response.json())
        .then(data => {
            JSONdata = data;
        });

    await addNextFusionElements()

    await addFusionElements();
});