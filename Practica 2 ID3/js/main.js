let nombreAtribElem, nombreJuegoElem;
let nombreAtrib, nombreJuego;
let errorMsgElem;
let atributos = [];
let juego = [];
function onPageLoad(){
    nombreAtribElem = document.getElementById("nomAtrib");
    nombreJuegoElem = document.getElementById("nomJuego");
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

}