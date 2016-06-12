function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

function uploadImage(selector){
    let dataURL = document.querySelector('canvas').toDataURL();
    let blob = dataURItoBlob(dataURL);
    let fd = new FormData();
    fd.append("image", blob);
    fd.append('test', 'data');
    let ajax = new XMLHttpRequest();
    ajax.open( 'POST', '/upload', true );
    //ajax.setRequestHeader ("ENCTYPE", "multipart/form-data");

    ajax.onload = () => {
        if( ajax.status >= 200 && ajax.status < 400 ){
            let data = JSON.parse( ajax.responseText );
            let errorCount = 0;
            let loadFunc = function(){
                let imageWrapper = document.querySelector('.image-capture--clip-mask');
                imageWrapper.removeChild(imageWrapper.querySelector('img'));
                imageWrapper.appendChild(this);
            }
            let errorFunc = function (path){
                if (errorCount < 30){
                    errorCount++;
                    setTimeout(function(){
                        getImage(path)
                    }, 1000);
                }
            }

            let getImage = function(path){
                try{
                    let image = new Image();
                    image.src = 'http://'+path;
                    image.onload = loadFunc;
                    image.classList.add('image-capture');
                    //as
                    image.onerror = function(){
                        errorFunc(path)
                    };
                }catch(e){
                    console.log(e);
                    e.stopPropagation();
                }
            }
            getImage(data.path);
        }else{
            alert( 'Error. Please, contact the webmaster!' );   
        }
    }
    ajax.onerror = () => {
        alert( 'Error. Please, try again!' );
    };
    ajax.send( fd );
}