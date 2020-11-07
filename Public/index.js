new CanvasBackground("background")

dropContainer = document.getElementById("da")

document.getElementById("filetoupload").addEventListener("change", e => {
    document.getElementById("filename").innerHTML = e.target.files[0].name
})