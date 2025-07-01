import fetch from 'node-fetch';
import fs from 'fs';

const form = new FormData();
form.append('image', fs.createReadStream('./tu-foto.jpg'));

fetch('https://hf.space/embed/TachibanaYoshino/AnimeGANv2/+/api/predict/', {
  method: 'POST',
  body: form
})
.then(res => res.json())
.then(data => {
  console.log('Resultado:', data);
});