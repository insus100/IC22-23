let mode = null;
let messageElement = null;
let escenario = [];
let tablaElement = null, filasElement = null, colsElement = null;
let filas = 10, columnas = 10;

let openSet = []; //Lista de abiertos.
let closedSet = []; //Lista de cerrados

let inicio = null; //punto de inicio
let fin = null; // fin (meta)
let path = [];

function onPageLoad() {
    messageElement = document.getElementById('msg');
    filasElement = document.getElementById('filasElement');
    colsElement = document.getElementById('colsElement');
    filasElement.value = filas;
    colsElement.value = columnas;
    tablaElement = document.getElementById('tabla');
    drawTable(filas, columnas);
}

function drawTable(f, c) {
    tablaElement.innerHTML = "";
    escenario = new Array(f);
    for(let i = 0; i < f; i++) {
        escenario[i] = new Array(c);
        let row = tablaElement.insertRow(i);
        for(let j = 0; j < c; j++) {
            let cell = row.insertCell(j); //insert cells to each row
            cell.innerHTML = "#";
            cell.id = `${i}-${j}`;
            cell.addEventListener('click', function(){
                cellClick(i, j);
            });
            escenario[i][j] = new Nodo(i, j);
        }
    }

    for (let i = 0; i < f; i++) {
        for (let j = 0; j < c; j++) {
          escenario[i][j].actualizarContiguos(escenario);
        }
      }
}
function buttonClick(_mode) {
    mode = _mode;
    console.log("buttonClick", mode);
    switch(mode) {
        case 'prohibido': {
            break;
        }
        case 'reset': {
            drawTable(filas, columnas);
            break;
        } case 'comenzar': {
            if(inicio === null || fin === null) {
                messageElement.innerText = 'Debes definir un inicio y un final.';
                return;
            }
            break;
        }
    }
}

function cellClick(x, y) {
    console.log("cellClick", x, y);
    messageElement.innerText = "";
    const cell = getCell(x, y);
    if(mode === 'prohibido') {
        removeColors(cell);
        cell.classList.add('table-danger');
    } else if(mode === 'inicio') {
        if(inicio !== null) {
            messageElement.innerText = 'Ya has definido el inicio.';
            return;
        }
        removeColors(cell);
        cell.classList.add('table-primary');
        inicio = cell;
    } else if(mode === 'meta') {
        if(fin !== null) {
            messageElement.innerText = 'Ya has definido el final.';
            return;
        }
        removeColors(cell);
        cell.classList.add('table-success');
        fin = cell;
    } else if(mode === 'borrar') {
        removeColors(cell);
        if(cell === inicio) inicio = null;
        if(cell == fin) fin = null;
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

function filasColsChange() {
    filas = filasElement.value;
    columnas = colsElement.value;
    if(filas > 0 && columnas > 0)
        drawTable(filas, columnas);
}

function Nodo(x, y) {
    this.x = x; //posicion x
    this.y = y; //posicion y
    this.f = 0; //coste total funcion
    this.g = 0; //coste desde el inicio hasta el punto actual
    this.h = 0; //coste heurístico estimado del punto actual a la meta
    this.contiguos = []; // puntos contiguos al actual
    this.padre = undefined; // punto anterior al punto actual.
  
    // update neighbors array for a given grid point
    this.actualizarContiguos = function (grid) {
      let i = this.x;
      let j = this.y;
      if (i < cols - 1) {
        this.contiguos.push(grid[i + 1][j]);
      }
      if (i > 0) {
        this.contiguos.push(grid[i - 1][j]);
      }
      if (j < rows - 1) {
        this.contiguos.push(grid[i][j + 1]);
      }
      if (j > 0) {
        this.contiguos.push(grid[i][j - 1]);
      }
    };
  }