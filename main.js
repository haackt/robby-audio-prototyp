const record_btn = document.querySelector('#record');
const stop_btn = document.querySelector('#stop');
const data = document.querySelector('#data');

let recorder;
let chunks = [];

record_btn.addEventListener('click', async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.mediaDevices
      .getUserMedia(
        // constraints - only audio needed for this app
        {
          audio: true,
        }
      )

      // Success callback
      .then((stream) => {
        recorder = new MediaRecorder(stream);
        recorder.start();
        console.log('recorder started');

        recorder.ondataavailable = (e) => {
          console.log('data is available');
          chunks.push(e.data);
          console.log(chunks);
        };

        recorder.onstop = (e) => {
          var audioblob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
          const audiourl = URL.createObjectURL(audioblob);
          const audio = new Audio(audiourl);
          audio.play();
          chunks = [];
        };
      })

      // Error callback
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  } else {
    console.log('getUserMedia not supported on your browser!');
  }
});

stop_btn.addEventListener('click', () => {
  recorder.stop();
  console.log('recorder stopped');
});

setInterval(() => {
  recorder.stop();
  recorder.start();
}, 1000);
