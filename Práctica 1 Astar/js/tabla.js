let mode = null;
let messageElement = null;
let escenario = [];
let tablaElement = null, filasElement = null, colsElement = null;
let filas = 10, columnas = 10, alturaM = 1000, alturaA = 1000;

let nAbiertos = []; //Lista de abiertos.
let nCerrados = []; //Lista de cerrados

let inicio = null; //punto de inicio
let fin = null; // fin (meta)
let path = [];
let waypoints = [], currentWaypoint = 0;
let peligro = [];

function onPageLoad() {
    messageElement = document.getElementById('msg');
    alturaMontania = document.getElementById('alturaMontania');
    alturaAvion = document.getElementById('alturaAvion');
    filasElement = document.getElementById('filasElement');
    colsElement = document.getElementById('colsElement');
    alturaMontania.value = alturaM;
    alturaAvion.value = alturaA;
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
            //cell.innerHTML = "#";
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
            inicio = fin = null;
            nAbiertos = [];
            nCerrados = [];
            path = [];
            waypoints = [];
            currentWaypoint = 0;
            peligro = [];
            drawTable(filas, columnas);
            break;
        } case 'comenzar': {
            if(inicio === null || fin === null) {
                messageElement.innerText = 'Debes definir un inicio y un final.';
                return;
            }
            nAbiertos.push(inicio);
            //console.log(search());
            console.log(waypoints);
            const result = search();
            if(result.length === 0) {
              messageElement.innerText = 'No hay camino posible.';
              return;
            }
            result.forEach((n) => {
              const cell = getCell(n.x, n.y);
              pintar(cell, 'table-info');
            });
            break;
        }
    }
}

function cellClick(x, y) {
    console.log("cellClick", x, y);
    messageElement.innerText = "";
    const cell = getCell(x, y);
    const nodo = escenario[x][y];
    if(mode === 'prohibido') {
      if(!nodo.prohibido) {
        nodo.prohibido = true;
        pintar(cell, 'table-danger');
      }
    } else if(mode === 'inicio') {
        if(inicio !== null) {
            messageElement.innerText = 'Ya has definido el inicio.';
            return;
        }
        pintar(cell, 'table-primary');
        inicio = nodo;
    } else if(mode === 'meta') {
        if(fin !== null) {
            messageElement.innerText = 'Ya has definido el final.';
            return;
        }
        pintar(cell, 'table-success');
        fin = nodo;
        console.log("fin", fin);
    } else if(mode === 'borrar') {
        removeColors(cell);
        if(nodo.prohibido) nodo.prohibido = false;
        if(nodo.waypoint) nodo.waypoint = false;
        if(nodo.peligro) nodo.peligro = false;
        if(nodo.montania) nodo.montania = false;
        if(nodo === inicio) inicio = null;
        if(nodo == fin) fin = null;
    } else if(mode === 'waypoint') {
      if(!nodo.waypoint) {
        nodo.waypoint = true;
        pintar(cell, 'table-warning');
        waypoints.push(nodo);
      }
    } else if(mode === 'peligro') {
      pintar(cell, 'table-dark');
      nodo.peligro = true;
      peligro.push(nodo);
    }else if(mode === 'montania') {
      pintar(cell, 'table-secondary');
      nodo.montania = true;
    }

}
function pintar(celda, color) {
  removeColors(celda);
  celda.classList.add(color);
}
function removeColors(cell) {
    cell.classList.remove('table-danger');
    cell.classList.remove('table-primary');
    cell.classList.remove('table-success');
    cell.classList.remove('table-dark');
    cell.classList.remove('table-warning');
    cell.classList.remove('table-secondary');
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

function heuristic(position0, position1) {
  console.log("heuristic", position0, position1);
  let d1 = Math.abs(position1.x - position0.x);
  let d2 = Math.abs(position1.y - position0.y);

  return d1 + d2;
}

function search() {
    //init();
    while (nAbiertos.length > 0) {
      //assumption lowest index is the first one to begin with
      let lowestIndex = 0;
      for (let i = 0; i < nAbiertos.length; i++) {
        if (nAbiertos[i].f < nAbiertos[lowestIndex].f) {
          lowestIndex = i;
        }
      }
      let actual = nAbiertos[lowestIndex];
      let _fin;
      if(waypoints.length === 0 || waypoints.length === currentWaypoint) {
        _fin = fin;
      } else {
        if(waypoints[currentWaypoint] == actual) currentWaypoint++;
        if(waypoints.length === currentWaypoint) _fin = fin;
        else _fin = waypoints[currentWaypoint];
      }
      if (actual === fin) {
        let temp = actual;
        path.push(temp);
        while (temp.padre) {
          path.push(temp.padre);
          temp = temp.padre;
        }
        console.log("DONE!");
        // devuelve el camino trazado.
        return path.reverse();
      }
  
      //remove current from openSet
      nAbiertos.splice(lowestIndex, 1);
      //add current to closedSet
      nCerrados.push(actual);
  
      let contiguos = actual.contiguos;
  
      for (let i = 0; i < contiguos.length; i++) {
        let contiguo = contiguos[i];
        if(contiguo.prohibido) continue;
        if (!nCerrados.includes(contiguo)) {
          let possibleG = actual.g + 1;
  
          if (!nAbiertos.includes(contiguo)) {
            nAbiertos.push(contiguo);
          } else if (possibleG >= contiguo.g) {
            continue;
          }
  
          contiguo.g = possibleG;
          contiguo.h = heuristic(contiguo, _fin);
          if(contiguo.peligro) contiguo.h += 1.5;
          contiguo.f = contiguo.g + contiguo.h;
          contiguo.padre = actual;
        }
      }
    }
  
    //no solution by default
    return [];
  }

function Nodo(x, y) {
    this.x = x; //posicion x
    this.y = y; //posicion y
    this.f = 0; //coste total funcion
    this.g = 0; //coste desde el inicio hasta el punto actual
    this.h = 0; //coste heurístico estimado del punto actual a la meta
    this.contiguos = []; // puntos contiguos al actual
    this.padre = undefined; // punto anterior al punto actual.
    this.prohibido = false;
    this.waypoint = false;
    this.peligro = false;
    this.montania = false;
  
    // actualizar los contiguos de un punto
    this.actualizarContiguos = function (grid) {
      let i = this.x;
      let j = this.y;
      if (i < columnas - 1) {
        this.contiguos.push(grid[i + 1][j]);
      }
      if (i > 0) {
        this.contiguos.push(grid[i - 1][j]);
      }
      if (j < filas - 1) {
        this.contiguos.push(grid[i][j + 1]);
      }
      if (j > 0) {
        this.contiguos.push(grid[i][j - 1]);
      }

      //diagonales:
      if (i > 0 && j > 0) {
        this.contiguos.push(grid[i - 1][j - 1]); // superior izquierda
      }
      if (i > 0 && j < columnas - 1) {
        this.contiguos.push(grid[i - 1][j + 1]); // superior derecha
      }
      if (i < filas - 1 && j > 0) {
        this.contiguos.push(grid[i + 1][j - 1]); // inferior izquierda
      }
      if (i < filas - 1 && j < columnas - 1) {
        this.contiguos.push(grid[i + 1][j + 1]); // inferior derecha
      }
    };
  }