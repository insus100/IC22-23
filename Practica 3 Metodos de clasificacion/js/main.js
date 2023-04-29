const algorismos = {
    kmedias: {
        tolerancia: 0.01,
        pesoExponencial: 2
    },
    lloyd: {
        tolerancia: 0.0000000001,
        maxIteraciones: 10,
        razonAprendizaje: 0.1
    }
}
let nombreAtribElem, nombreJuegoElem;
let nombreAtrib, nombreJuego;
let tablaElem, divTablaElem;
let errorMsgElem;
let datos = {}, ejemplo = {};
let resultado;
let sol = [];
const centrosIniciales = [[4.6, 3.0, 4.0, 0.0], [6.8, 3.4, 4.6, 0.7]];
function onPageLoad() {
    nombreAtribElem = document.getElementById("nomAtrib");
    nombreJuegoElem = document.getElementById("nomJuego");
    tablaElem = document.getElementById("table");
    errorMsgElem = document.getElementById('msg');
    divTablaElem = document.getElementById('results');
    nombreAtribElem.addEventListener('change', (event) => {
        datos = {};
        readTextFile(event);
    });
    nombreJuegoElem.addEventListener('change', (event) => {
        ejemplo = {};
        readTextFile(event, 1);
    });
    
}

function readTextFile(event, type = 0)//type 0 lee atributos, type 1 lee propiedades
{
    const fileList = event.target.files;
    if (fileList.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            const result = event.target.result;
            //console.log(result);
            //console.log(typeof result);
            errorMsgElem.innerText = "";
            if (type === 0) {
                let result2 = result.replace(/(?:\r|\r|)/g, '');
                let rows = result2.split('\n');
                rows.forEach(e => {
                    const row = e.split(",");
                    const v = [parseFloat(row[0]), parseFloat(row[1]), parseFloat(row[2]), parseFloat(row[3])];
                    if (!datos[row[4]]) datos[row[4]] = [];
                    datos[row[4]].push(v);
                });
                console.log(datos);
            } else {
                if (Object.keys(datos).length === 0) {
                    nombreJuegoElem.value = "";
                    errorMsgElem.innerText = 'Debes seleccionar primero el fichero de clases';
                    return;
                }
                const row = result.split(",");
                ejemplo[row[4]] = [parseFloat(row[0]), parseFloat(row[1]), parseFloat(row[2]), parseFloat(row[3])];
                console.log(ejemplo);
            }
        })
        reader.readAsText(fileList[0]);
    }
}

function buttonClick(mode) {
    divTablaElem.innerHTML = '';
    divTablaElem.classList.add('hide');
    //console.log("buttonClick", mode);
    if (mode === 'kmedias') {
        let arr = []
        Object.keys(datos).forEach(k => {
            arr = arr.concat(datos[k]);
        });
        //console.log(arr);
        kmedias(arr, centrosIniciales, 2, 0.01, 2);
    } else if (mode === 'bayes') {
        exec_bayes();
    } else if (mode === 'lloyd') {

    }
}

function exec_bayes() {
    const b = new Bayes(4);//4 tamaño del vector de datos
    Object.keys(datos).forEach(k => {//k es el nombre de la clase
        datos[k].forEach(arr => b.add_x(arr, k));
    });
    //console.log(b);
    console.log("Carga finalizada Bayes.");
    b.training();
    for(let c in b.get_classes()) {
        console.log("Clase", c);
        divTablaElem.innerHTML += `<h1>${c}</h1>`
        divTablaElem.innerHTML += `<table class="table table-bordered table-striped table-dark table-sm mb-3" id="tabla-${c}-1"></table>`;
        divTablaElem.innerHTML += `<table class="table table-bordered table-striped table-dark table-sm mb-3" id="tabla-${c}-2"></table>`;
        generateTable(document.getElementById(`tabla-${c}-1`), [b.get_class(c).get_m_vector()])
        generateTable(document.getElementById(`tabla-${c}-2`), b.get_class(c).get_c_matrix())
        console.log("M: ", b.get_class(c).get_m_vector());
        console.log("C: ", b.get_class(c).get_c_matrix());
        console.log("---------------------------------");
    }
    divTablaElem.classList.remove('hide');
    const testName = Object.keys(ejemplo)[0];

    console.log("\n>>> Clasificación Bayes \n");
    console.log("Test 1:");
    console.log(ejemplo[testName], " clasificado como clase ", b.classify(ejemplo[testName]));

    divTablaElem.innerHTML += `<h5>Clasificación Bayes:</h5>`;
    divTablaElem.innerHTML += `<h5>[${ejemplo[testName]}] clasificado como clase: ${b.classify(ejemplo[testName])}</h5>`;
    /*console.log("\nTest 2:");
    console.log(test2, " clasificado como clase ", bayes.classify(test2));
    console.log("\nTest 3:");
    console.log(test3, " clasificado como clase ", bayes.classify(test3));
    console.log("\n");*/

}


function generateTable(table, data) {
    for (let vector of data) {
        let row = table.insertRow();
        for (num of vector) {
            let cell = row.insertCell();
            let text = document.createTextNode(num);
            cell.appendChild(text);
        }
    }
}
/*function asignarFila(m, row, value) {
    for (let j = 0; j < m[row].length; j++) {
        m[row][j] = value;
    }
}

function _p(x, v, i, j, b, clases) {
    const exp = 1 / (b - 1);

    const d = _d(x, v, i, j);
    if (d === 0.0) {
        return 1.0;
    }

    let num = Math.pow((1 / d), exp);
    let den = 0;
    for (let r = 0; r < clases; r++) {
        den += Math.pow((1 / _d(x, v, r, j)), exp);
    }
    return num / den;
}

function _d(x, v, i, j) {
    let sum = 0;
    for (let k = 0; k < x.length; k++) {
        sum += Math.pow((x[k][j] - v[i][j]), 2);
    }
    return sum;
}

function kmedias(x, v, b, epsilon, clases) {
    let done = false;
    while (!done) {
        let u = Array.from(new Array(clases), _ => Array(x[0].length).fill(0));
        let new_v = Array.from(new Array(v.length), _ => Array(v[0].length).fill(0));

        for (let i = 0; i < clases; i++) {
            let num = 0, den = 0;
            for (let j = 0; j < x[0].length; j++) {
                let p = _p(x, v, i, j, b, clases)
                u[i][j] = p;
                let aux = p ** b;
                for (let k = 0; k < x.length; k++) {num += aux * x[k][j];}
                den += aux
            }
            asignarFila(new_v, i, (num / den));
        }

        let max_delta = 0.0;
        for (let i = 0; i < clases; i++) {
            let sum = 0;
            for (let k = 0; k < v[i].length; k++) {
                sum += Math.pow(v[i][k] - new_v[i][k], 2);
            }
            let delta = Math.sqrt(sum);
            console.log("delta", delta);
            max_delta = Math.max(max_delta, delta)
        }
        console.log("centros:", v);
        console.log("nuevos centros:", new_v);
        console.log("matriz de pertenencia:", u);
        console.log("max_delta", max_delta);

        v = new_v
        if(max_delta <= epsilon || isNaN(max_delta))
        {
            done = true;
            //console.log(v);
        }
    }
    console.log(v);
    return v;
}*/