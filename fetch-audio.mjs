import fs from 'fs';
fetch('https://freesound.org/people/liecio/sounds/257596/')
  .then(r=>r.text())
  .then(t=>{
    const m = t.match(/property="og:audio" content="(.*?)"/);
    if(m) {
      console.log('Found:', m[1]);
      fetch(m[1]).then(r=>r.arrayBuffer()).then(b=>{
        fs.writeFileSync('public/calming-rain.mp3', Buffer.from(b));
        console.log('Saved to public/calming-rain.mp3');
      });
    } else {
      console.log('Not found');
    }
  });
