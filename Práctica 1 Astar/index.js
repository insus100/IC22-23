const express = require("express");
const path = require("path");

let grid = {};
const app = express();
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, (err) => {
    if(err) console.log(err);
    else console.log(`Servidor arrancado en el puerto ${3000}`);
});

app.get('/:x/:y', (req, res) => {
    grid.x = parseInt(req.params.x);
    grid.y = parseInt(req.params.y);
    res.render(path.join(__dirname, 'views/tabla'), { grid:grid });
    console.log('Se logió wey');

});