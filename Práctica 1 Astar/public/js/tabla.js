let mode = null;
let inicioSet = null, metaSet = null;
let messageElement = null
function onPageLoad() {
    messageElement = document.getElementById('msg');
}
function buttonClick(_mode) {
    mode = _mode;
    console.log("buttonClick", mode);
    switch(mode) {
        case 'prohibido': {

        }
    }
}

function cellClick(x, y) {
    console.log("cellClick", x, y);
    const cell = getCell(x, y);
    if(mode === 'prohibido') {
        removeColors(cell);
        cell.classList.add('table-danger');
    } else if(mode === 'inicio') {
        if(inicioSet !== null) {
            messageElement.innerText = 'Ya has definido el inicio.';
            return;
        }
        removeColors(cell);
        cell.classList.add('table-primary');
        inicioSet = cell;
    } else if(mode === 'meta') {
        if(metaSet !== null) {
            messageElement.innerText = 'Ya has definido el final.';
            return;
        }
        removeColors(cell);
        cell.classList.add('table-success');
        metaSet = cell;
    } else if(mode === 'borrar') {
        removeColors(cell);
        if(cell === inicioSet) inicioSet = null;
        if(cell == metaSet) metaSet = null;
    }
}

function removeColors(cell) {
    cell.classList.remove('table-danger');
    cell.classList.remove('table-primary');
    cell.classList.remove('table-success');
}

function getCell(x, y) {
    return document.getElementById(`${x}-${y}`);
}