let mode = null;
let messageElement = null;
let escenario = [];
let tablaElement = null, filasElement = null, colsElement = null, alturaMontania = null, alturaAvion = null;
let filas = 10, columnas = 10, alturaM = 0, alturaA = 0;

let nAbiertos = []; //Lista de abiertos.
let nCerrados = []; //Lista de cerrados

let gInicio = null; //punto de inicio
let gFin = null; // fin (meta)
let path = [];
let waypoints = [];
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
            gInicio = gFin = null;
            nAbiertos = [];
            nCerrados = [];
            path = [];
            waypoints = [];
            peligro = [];
            drawTable(filas, columnas);
            break;
        } case 'comenzar': {
            if(gInicio === null || gFin === null) {
                messageElement.innerText = 'Debes definir un inicio y un final.';
                return;
            }
            nAbiertos.push(gInicio);
            //console.log(search());
            //console.log(waypoints);
            const result = waypoints.length === 0 ? search(gFin) : searchWaypoint();
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
    //console.log("cellClick", x, y);
    messageElement.innerText = "";
    const cell = getCell(x, y);
    const nodo = escenario[x][y];
    if(mode === 'prohibido') {
      if(nodo.waypoint) {
        messageElement.innerText = 'No puedes poner un waypoint aquí.';
        return;
      }
      if(!nodo.prohibido) {
        nodo.prohibido = true;
        pintar(cell, 'table-danger');
      }
    } else if(mode === 'inicio') {
        if(gInicio !== null) {
          messageElement.innerText = 'Ya has definido el inicio.';
          return;
        }
        if(nodo.waypoint) {
          messageElement.innerText = 'No puedes poner un waypoint en el inicio.';
          return;
        }
        pintar(cell, 'table-primary');
        gInicio = nodo;
    } else if(mode === 'meta') {
        if(gFin !== null) {
            messageElement.innerText = 'Ya has definido el final.';
            return;
        }
        if(nodo.waypoint) {
          messageElement.innerText = 'No puedes poner un waypoint en la meta.';
          return;
        }
        pintar(cell, 'table-success');
        gFin = nodo;
        console.log("fin", gFin);
    } else if(mode === 'borrar') {
        removeColors(cell);
        if(nodo.prohibido) nodo.prohibido = false;
        if(nodo.waypoint) {
          nodo.waypoint = false;
          waypoints.splice(waypoints.indexOf(nodo), 1);
        }
        if(nodo.peligro) nodo.peligro = false;
        if(nodo.montania) nodo.montania = false;
        if(nodo === gInicio) gInicio = null;
        if(nodo == gFin) gFin = null;
    } else if(mode === 'waypoint') {
      if(gInicio !== null && gInicio == nodo || gFin !== null && gFin == nodo || nodo.prohibido || nodo.peligro || nodo.montania) {
        messageElement.innerText = 'No puedes poner un waypoint aquí.';
        return;
      }
      if(!nodo.waypoint) {
        nodo.waypoint = true;
        pintar(cell, 'table-warning');
        waypoints.push(nodo);
      }
    } else if(mode === 'peligro') {
      if(nodo.waypoint) {
        messageElement.innerText = 'No puedes poner un waypoint aquí.';
        return;
      }
      pintar(cell, 'table-dark');
      nodo.peligro = true;
      peligro.push(nodo);
    }else if(mode === 'montania') {
      if(nodo.waypoint) {
        messageElement.innerText = 'No puedes poner un waypoint aquí.';
        return;
      }
      if(alturaA === 0 || alturaM === 0) {
        messageElement.innerText = 'Debes definir la altura del avión y de las montañas.';
        return;
      }
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
    if(filas > 50) {
      filas = 50;
      filasElement.value = 50;
    } 
    if(columnas > 50) {
      columnas = 50;
      colsElement.value = 50;
    }
    if(filas > 0 && columnas > 0)
        drawTable(filas, columnas);
}

function alturaChange(){
  alturaM = alturaMontania.value;
  alturaA = alturaAvion.value;
}

function heuristic(position0, position1) {
  //console.log("heuristic", position0, position1);
  let d1 = Math.abs(position1.x - position0.x);
  let d2 = Math.abs(position1.y - position0.y);

  return d1 + d2;
}

function search(fin) {
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
        if(alturaM !== 0 && alturaA !== 0 && contiguo.montania && alturaA <= alturaM) continue;
        if (!nCerrados.includes(contiguo)) {
          let possibleG = actual.g + 1;
  
          if (!nAbiertos.includes(contiguo)) {
            nAbiertos.push(contiguo);
          } else if (possibleG >= contiguo.g) {
            continue;
          }
  
          contiguo.g = possibleG;
          contiguo.h = heuristic(contiguo, fin);
          if(contiguo.peligro) contiguo.h += 1.1;
          contiguo.f = contiguo.g + contiguo.h;
          contiguo.padre = actual;
        }
      }
    }
  
    //no solution by default
    return [];
}

function searchWaypoint() {//cada vez que se llame al algoritmo hay que reiniciar nabiertos y ncerrados
  console.log(waypoints);
  let sol = [];
  waypoints.push(gFin)
  let meta = nextWayPoint(gInicio);
  waypoints.splice(waypoints.indexOf(meta), 1);//borramos el waypoint seleccionado (el mas cercano al nodo actual)
  let aux = search(meta);//hasta el primer waypoint
  if(aux.length === 0)
    return [];
  sol = aux;

  let inicio = null;
  while(waypoints.length > 0) {
    inicio = meta;
    inicio.reset();
    meta = nextWayPoint(inicio);
    meta.reset();
    waypoints.splice(waypoints.indexOf(meta), 1);
    nAbiertos = [inicio];
    nCerrados = [];
    path = [];
    aux = search(meta);

    if(aux.length !== 0) {
      aux.splice(0, 1);//se borra el inicio que ya estaba como meta en sol
      sol = sol.concat(aux);
    } else {
      return [];
    }
  }
  return sol;
}

function nextWayPoint(_inicio) {
  if(waypoints.length > 0) {
    let minDistance = heuristic(waypoints[0], _inicio);
    let minIndex = 0;
    for(let i = 0; i < waypoints.length; i++) {
      if(minDistance > heuristic(waypoints[i], _inicio)
        && waypoints[i] !== gFin) {
          minDistance = heuristic(waypoints[i], _inicio);
          minIndex = i;
        }
    }
    return waypoints[minIndex];
  }
  return null;
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

    this.reset = function() {
      this.g = 0;
      this.h = 0;
      this.padre = undefined;
    }
  }