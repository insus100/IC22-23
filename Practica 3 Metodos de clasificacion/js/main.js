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
const centrosIniciales = [new Vector4(4.6, 3.0, 4.0, 0.0), new Vector4(6.8, 3.4, 4.6, 0.7)];
function onPageLoad(){
    nombreAtribElem = document.getElementById("nomAtrib");
    nombreJuegoElem = document.getElementById("nomJuego");
    divTablaElem = document.getElementById("divTabla");
    errorMsgElem = document.getElementById('msg');
    nombreAtribElem.addEventListener('change', (event)=> {
        datos = {};
        readTextFile(event);
    });
    nombreJuegoElem.addEventListener('change', (event)=> {
        ejemplo = {};
        readTextFile(event, 1);
    });
}

function readTextFile(event, type = 0)//type 0 lee atributos, type 1 lee propiedades
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
                    let result2 = result.replace(/(?:\r|\r|)/g, '');
                    let rows = result2.split('\n');
                    rows.forEach(e => {
                        const row = e.split(",");
                        const v = new Vector4(parseFloat(row[0]), parseFloat(row[1]), parseFloat(row[2]), parseFloat(row[3]));
                        if(!datos[row[4]]) datos[row[4]] = [];
                        datos[row[4]].push(v);
                    });
                    console.log(datos);
                } else {
                    if(Object.keys(datos).length === 0) {
                        nombreJuegoElem.value = "";
                        errorMsgElem.innerText = 'Debes seleccionar primero el fichero de clases';
                        return;
                    }
                    const row = result.split(",");
                    ejemplo[row[4]] = new Vector4(parseFloat(row[0]), parseFloat(row[1]), parseFloat(row[2]), parseFloat(row[3]));
                    console.log(ejemplo);
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