let nombreAtribElem, nombreJuegoElem;
let nombreAtrib, nombreJuego;

function onPageLoad(){
    nombreAtribElem = document.getElementById("nomAtrib");
    nombreJuegoElem = document.getElementById("nomJuego");
    nombreAtribElem.addEventListener('change', (event)=> readTextFile(event));
    nombreJuegoElem.addEventListener('change', (event)=> readTextFile(event));
}

function readTextFile(event)
{
    const fileList = event.target.files;
    if(fileList.length > 0){
         const reader = new FileReader();
         reader.addEventListener('load', (event) => {
             const result = event.target.result;
             console.log(result);
         })
         reader.readAsText(fileList[0]);
    }
}