const express = require('express');
const app = express();
const path = require('path'); 
const fs = require('fs');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

 
app.get('/', function(req,res){
    fs.readdir(`./files`, function(err, files){
        res.render("index", {files: files});
    })
})

app.get('/files/:filename', function(req, res) {
    const filePath = `./files/${req.params.filename}`;
    fs.readFile(filePath, 'utf-8', function(err, filedata) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading the file');
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

app.get('/edit/:filename', function(req, res) {
    res.render('edit', {filename: req.params.filename})
    
});

app.post('/edit', function(req, res) {
    const previousName = req.body.Previous;
    const newName = req.body.New;

    fs.rename(`./files/${previousName}`, `./files/${newName}`, function(err) {
        
        res.redirect("/");
    });
});

app.delete('/delete/:filename', function(req, res) {
    const filename = req.params.filename;

    fs.unlink(`./files/${filename}`, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting file');
        }
        res.sendStatus(200); // Send a 200 OK response if deletion is successful
    });
});

app.post('/create', function(req,res){
fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){
res.redirect("/")
});
    })




app.listen(3000);