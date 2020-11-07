// new CanvasBackground("background")

dropContainer = document.getElementById("da")

dropContainer.ondrop = function (evt) {
    // pretty simple -- but not for IE :(
    //`evt.preventDefault();
    fileInput = evt.dataTransfer;

    // If you want to use some of the dropped files
    const dT = new DataTransfer();
    dT.items.add(evt.dataTransfer.files[0]);
    fileInput.files = dT.files;

};