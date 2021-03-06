// CAMERA

/*
Implementation of Matt West's excellent "Accessing the Device Camera with getUserMedia" article found at http://blog.teamtreehouse.com/accessing-the-device-camera-with-getusermedia
*/

function runCamera(){
  document.querySelector('.take-photo').addEventListener('click', function(){
    // Normalize the various vendor prefixed versions of getUserMedia.
    navigator.getUserMedia = (navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia);

    // open up the section
    document.querySelector('.video-container').style.maxHeight = "420px";


    // Check that the browser supports getUserMedia.
    if (navigator.getUserMedia) {
      // Request the camera.
      navigator.getUserMedia({ video: true }, function(localMediaStream) {
        // Get a reference to the video element on the page.
        var vid = document.getElementById('camera-stream');

        // Create an object URL for the video stream and use this
        // to set the video source.
        vid.src = window.URL.createObjectURL(localMediaStream);

        var snapshotButton = document.querySelector('button#snapshot');

        // Put variables in global scope to make them available to the browser console.
        var video = window.video = document.querySelector('video');
        var canvas = window.canvas = document.querySelector('canvas');
        canvas.width = 480;
        canvas.height = 360;

        snapshotButton.onclick = function() {
          //capture the image onto the canvas
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width,
              canvas.height);
          document.querySelector('.image-capture').src = canvas.toDataURL();
          uploadImage(document.querySelector('.image-capture'));

          // stop media
          localMediaStream.getTracks()[0].stop()
        };
        }, function(err) {
          // Log the error to the console.
          console.log('The following error occurred when trying to use getUserMedia: ' + err);
        }
      );
    } else {
      alert('Sorry, your browser does not support getUserMedia');
    };
  });
}
