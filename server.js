const app = require("express")()
const uid = require("uid")
const fs = require("fs")
app.use(require("express-fileupload")({ createParentPath: true }));
app.get("/", (req, res) => { res.sendFile(__dirname + "/Public/index.html") })
app.get("/index.js", (req, res) => { res.sendFile(__dirname + "/Public/index.js") })
app.get("/canvasParticles.js", (req, res) => { res.sendFile(__dirname + "/Public/canvasParticles.js") })
app.get("/index.css", (req, res) => { res.sendFile(__dirname + "/Public/index.css") })

let queue = [], dict = {}

setInterval(() => {
    while(queue[0]!==undefined && queue[0][1]<Date.now()-10000) {
        console.log(1, queue, dict);
        fs.rmdirSync(__dirname+"/uploads/"+queue[0][0], { recursive: true })
        dict[queue[0][0]] = undefined
        queue.shift()
        console.log(2, queue, dict);
    }
}, 60000)

app.post("/upload", (req, res) => {
    name = uid.uid(4)
    queue.push([name, Date.now()])
    dict[name] = req.files.filetoupload.name
    req.files.filetoupload.mv(__dirname+"/uploads/"+name)
    res.status(201).send(name)
})

app.get("*", (req, res) => {
    console.log(req.url);
    let url = req.url.substring(1);
    if(fs.existsSync(__dirname+"/uploads/"+url))
        res.download(__dirname+"/uploads/"+url, dict[url])
    else
        res.status(404).send()
    console.log(__dirname+"/uploads/"+url);
})

app.listen(3000)
