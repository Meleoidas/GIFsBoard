let lastTimestamp = 0;
let initialized = false;

function pollEvent() {
  fetch('/latest-event')
    .then(res => res.json())
    .then(data => {
      if (data && data.ts) {
        if (!initialized) {
          lastTimestamp = data.ts;
          initialized = true;
        } else if (data.ts > lastTimestamp) {
          lastTimestamp = data.ts;

          if(data.img && data.audio){
            const gif = document.createElement('img');
            gif.src = data.img;
            document.body.appendChild(gif);

            gif.style.position = 'absolute';
            gif.style.left = '50%';
            gif.style.top = '120%';
            gif.style.height = '100px';
            gif.style.transform = 'translate(-50%, -50%)';
            void gif.offsetWidth;

            const audio = new Audio(data.audio);
            audio.addEventListener('loadedmetadata', () => {
              gif.style.transition = `top ${audio.duration}s cubic-bezier(0,.5,0,1.55), transform ${audio.duration}s cubic-bezier(0,.5,0,1.55), height ${audio.duration}s cubic-bezier(0,.5,0,1.55)`;
              audio.play();

              gif.style.top = '50%';
              gif.style.transform = 'translate(-50%, -50%)';
              gif.style.height = '400px'

              setTimeout(() => {
                gif.style.top = '120%';
                gif.style.transform = 'translate(-50%, -50%)';
                gif.style.height = '100px';
              }, audio.duration*1000);

              setTimeout(() => {
                gif.remove();
              }, audio.duration*1000*2);
            });
          } else if (data.audio) {
            const audio = new Audio(data.audio);
            audio.play();
          } else if (data.img) {

            const gif = document.createElement('img');
            gif.src = data.img;
            document.body.appendChild(gif);

            gif.style.position = 'absolute';
            gif.style.left = '50%';
            gif.style.top = '50%';
            gif.style.height = '400px';
            gif.style.transform = 'translate(-50%, -50%)';
            void gif.offsetWidth;

            gif.style.transition = `opacity 1s cubic-bezier(0,.5,0,1.55)`;

            setTimeout(() => {
              gif.style.opacity = 0;
            }, 1*1000);

            setTimeout(() => {
              gif.remove();
            }, 1*1000*2);
          }
        }
      }
    })
    .finally(() => setTimeout(pollEvent, 250));
}

pollEvent();