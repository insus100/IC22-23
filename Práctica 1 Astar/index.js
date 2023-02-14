const express = require("express");
const path = require("path");


const app = express();
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, (err) => {
    if(err) console.log(err);
    else console.log(`Servidor arrancado en el puerto ${3000}`);
});

app.get('/', (req, res) => {
    console.log('Se logió wey');
});