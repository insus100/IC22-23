let nombreAtribElem, nombreJuegoElem;
let nombreAtrib, nombreJuego;
let divTablaElem, tablaElem;
let errorMsgElem;
let atributos = [];
let juego = [];
let resultado;
let sol = [];
function onPageLoad(){
    nombreAtribElem = document.getElementById("nomAtrib");
    nombreJuegoElem = document.getElementById("nomJuego");
    divTablaElem = document.getElementById("divTabla");
    errorMsgElem = document.getElementById('msg');
    nombreAtribElem.addEventListener('change', (event)=> readTextFile(event, atributos));
    nombreJuegoElem.addEventListener('change', (event)=> readTextFile(event, juego, 1));
}

function readTextFile(event, dataObj, type = 0)//type 0 lee atributos, type 1 lee propiedades
{
    const fileList = event.target.files;
    if(fileList.length > 0){
         const reader = new FileReader();
         reader.addEventListener('load', (event) => {
                const result = event.target.result;
                //console.log(result);
                //console.log(typeof result);
                errorMsgElem.innerText = "";
                if(type === 0) {
                    atributos = result.split(",");
                    //let a = [];
                    atributos.forEach((e, i) => atributos[i] = e.replace(/(?:\r\n|\r|\n)/g, ''));
                    console.log(atributos);
                } else {
                    if(atributos.length === 0) {
                        nombreJuegoElem.value = "";
                        errorMsgElem.innerText = 'Debes seleccionar primero el fichero de atributos';
                        return;
                    }
                    let result2 = result.replace(/(?:\r|\r|)/g, '');
                    let rows = result2.split('\n');
                    rows = rows.filter((str) => str !== '');
                    rows.forEach((e, i) => {
                        const row = e.split(",");
                        const obj = {};
                        atributos.forEach((a, i) => obj[a] = row[i]);
                        dataObj.push(obj);
                    });
                    console.log(juego);
                }

         })
         reader.readAsText(fileList[0]);
    }
}

function buttonClick(mode) {
    if(mode === 'iniciar') {
        iniciar();
    }
}


function iniciar() {
    if(atributos.length === 0 || juego.length === 0) {
        errorMsgElem.innerText = 'Debes seleccionar los ficheros de atributos y de juego.';
        return;
    }
    resultado = atributos[atributos.length - 1];
    sol = [];
    id3(0);
}

function entropia(x) {
    if (x === 0) {
        return 0
    }
    return -x * Math.log2(x)
}


function id3(numLlamadas) {
    let cols = atributos.length;
    let rows = juego.length;

    if(cols === 2) return

    let merito = {};
    let numeroAtrs = {};
    let si = {};
    let no = {};

    for(let atr of atributos) {
        if(atr === resultado) continue;
        numeroAtrs[atr] = {};
        si[atr] = {};
        no[atr] = {};
        for(let row = 0; row < rows; row++) {
            let valor = juego[row][atr];
            if(numeroAtrs[atr][valor]) numeroAtrs[atr][valor] += 1;
            else numeroAtrs[atr][valor] = 1;

            if(juego[row][resultado] === 'no') {
                if(no[atr][valor]) no[atr][valor] += 1;
                else no[atr][valor] = 1;
            } else if(juego[row][resultado] === 'si') {
                if(si[atr][valor]) si[atr][valor] += 1;
                else si[atr][valor] = 1;
            }

            if(!si[atr][valor]) si[atr][valor] = 0;
            if(!no[atr][valor]) no[atr][valor] = 0;
        }

        merito[atr] = 0;
        for(let key in numeroAtrs[atr]) {
            merito[atr] += numeroAtrs[atr][key] / rows * (entropia(si[atr][key] / (si[atr][key] + no[atr][key]))
                + entropia(no[atr][key] / (si[atr][key] + no[atr][key])));
        }
    }

    let minimo = Object.values(merito)[0];
    let min_key = Object.keys(merito)[0];
    for(let value in merito) {
        if(merito[value] < minimo) {
            min_key = value;
            minimo = merito[value];
        }
    }
    sol.push(min_key);

    //pintar tablas
    pintarTablas(merito, numeroAtrs, si, no, min_key, minimo, numLlamadas);

    //se elimina el atributo con menor merito.
    /*let columna_a_borrar = atributos[0];
    for (const [columna, c] of atributos.entries()) {
        if(c === minimo) {
            columna_a_borrar = c;
            break;
        }
    }*/

    atributos = atributos.filter(value => {
        return value != min_key
    })
    for(let row = 0; row < rows; row++) {
        delete juego[row][min_key];
    }

    id3(numLlamadas + 1);
}

function pintarTablas(merito, numeroAtrs, si, no, min_key, minimo, numLlamadas) {
    divTablaElem.innerHTML += `<table class="table table-bordered table-striped table-dark table-sm mb-3" id="tabla-${numLlamadas}"></table>`;
    tablaElem = document.getElementById(`tabla-${numLlamadas}`);
    generateTableHead(tablaElem, atributos);
    generateTable(tablaElem, juego);
    let htmlCode = '';
    for(let atr of atributos) {
        if(atr === resultado) continue;
        htmlCode += `<table class="table table-bordered table-dark table-sm"><thead align="center"><tr>`;
        htmlCode += `<th scope="col" colspan="${Object.keys(numeroAtrs[atr]).length}">${atr}</th></tr></thead>`;
        htmlCode += `<tbody align="center"><tr>`;
        for(let val in numeroAtrs[atr]) {
            htmlCode += '<td><i>' + val + " = " + numeroAtrs[atr][val] + '</i></td>'
        }
        htmlCode += `</tr><tr>`;

        let j = 1
        for(let val in si[atr]) {
            htmlCode += '<td>p' + j + " = " + si[atr][val] + "/" + numeroAtrs[atr][val] + '</td>'
            j += 1
        }
        htmlCode += `</tr><tr>`;

        j = 1
        for(let val in no[atr]) {
            htmlCode += '<td>n' + j + " = " + no[atr][val] + "/" + numeroAtrs[atr][val] + '</td>'
            j += 1
        }
        htmlCode += '</tr>'
        htmlCode += '</tbody></table>'
    }

    //if(atributos.length > 2) {
        htmlCode += '<h2>Méritos</h2>'
        let N = 0
        for(let atr of atributos) {
            if(atr === resultado) continue;
            for(let val in numeroAtrs[atr]) {
                N += numeroAtrs[atr][val]
            }
            htmlCode += '<p>Mérito(' + atr + ') = '
            for(let val in numeroAtrs[atr]) {
                if(Object.keys(numeroAtrs[atr])[Object.keys(numeroAtrs[atr]).length - 1] != val) {
                    htmlCode += numeroAtrs[atr][val] + "/" + N + ' infor (' + si[atr][val] + '/' + numeroAtrs[atr][val] + ', ' + no[atr][val] + '/' + numeroAtrs[atr][val] + ') + '
                }
                else {
                    htmlCode += numeroAtrs[atr][val] + "/" + N + ' infor (' + si[atr][val] + '/' + numeroAtrs[atr][val] + ', ' + no[atr][val] + '/' + numeroAtrs[atr][val] + ') = '
                }
            }
            htmlCode += merito[atr].toFixed(2)
            htmlCode += '</p>'
        }
        htmlCode += '<br><h5 align="center"><i>Escogemos ' + min_key + ' porque tiene el menor mérito (' + minimo.toFixed(2) + ')</i></h5>'
        htmlCode += '<br>'
        htmlCode += '<hr style="height:2px;border-width:0;color:black;background-color:black">'
        htmlCode += '<br>'

        if(atributos.length === 3) {
            htmlCode += '<br><h5 align="center"><i>Los atributos mínimos del árbol: ' + sol + '</i></h5>'
        }
    /*}
    else {
        htmlCode += '<br><h5 align="center"><i>Los atributos mínimos del árbol: ' + sol + '</i></h5>'
    }*/
    divTablaElem.innerHTML += htmlCode;
}
function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }
  
function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}