class Vector4 {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}
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
let divTablaElem, tablaElem;
let errorMsgElem;
let datos = {}, ejemplo = {};
let resultado;
let sol = [];
const centrosIniciales = [[4.6, 3.0, 4.0, 0.0], [6.8, 3.4, 4.6, 0.7]];
function onPageLoad() {
    nombreAtribElem = document.getElementById("nomAtrib");
    nombreJuegoElem = document.getElementById("nomJuego");
    divTablaElem = document.getElementById("divTabla");
    errorMsgElem = document.getElementById('msg');
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
    //console.log("buttonClick", mode);
    if (mode === 'kmedias') {
        let arr = []
        Object.keys(datos).forEach(k => {
            arr = arr.concat(datos[k]);
        });
        //console.log(arr);
        kmedias(arr, centrosIniciales, 2, 0.01, 2);
    } else if (mode === 'bayes') {

    } else if (mode === 'lloyd') {

    }
}

function _p(x, v, i, j, b, clases) {
    let exp = 1 / (b - 1)

    let d = _d(x, v, i, j)
    if (d == 0.0) { return 1.0; }

    let num = (1 / d) ** exp;
    let den = 0;
    for (let r = 0; r < clases; r++) {
        den += (1 / _d(r, j)) ** exp;
    }
    return num / den
}

function _d(x, v, i, j) {
    let sum = 0;
    for (let k = 0; k < x.length; k++)
        sum += (x[k][j] - v[i]) ** 2;

    return sum;
}

function asignarFila(m, row, value) {
    for (let j = 0; j < m[row].length; j++) {
        m[row][j] = value;
    }
}
function kmedias(x, v, b, epsilon, clases) {
    let done = false;
    while (!done) {
        let u = Array.from(new Array(x.length), _ => Array(x[0].length).fill(0));
        let new_v = Array.from(new Array(v.length), _ => Array(v[0].length).fill(0));

        for (let i = 0; i < clases; i++) {
            let num = 0, den = 0;
            for (let j = 0; j < x.length; j++) {
                let p = _p(x, v, i, j, b, clases)
                u[i, j] = p
                let aux = p ** b
                for (let k = 0; k < x.length; k++) num += aux * x[k][j];
                den += aux
            }
            asignarFila(new_v, i, (num/den));
        }

        let max_delta = 0;
        for (let i = 0; i < clases; i++) {
            let delta = Math.sqrt(
                new_v[i].map((val, j) => Math.pow(v[i][j] - val, 2))
                         .reduce((acc, curr) => acc + curr, 0)
              );
            console.log("delta", delta);
            max_delta = Math.max(max_delta, delta)
        }
        console.log("centros:", v);
        console.log("nuevos centros:", new_v);
        console.log("matriz de pertenencia:", u);
        console.log("max_delta", max_delta);

        v = new_v
        if(max_delta <= epsilon)
        {
            console.log(v);
            done = true;
        }
            
    }
}