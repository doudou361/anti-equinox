const sharp = require('sharp');
const fs = require('fs');

async function compress() {
  try {
    const info = await sharp('public/logo.png')
      .resize(300)
      .webp({ quality: 80 })
      .toFile('public/logo.webp');
    console.log('Successfully compressed logo.png to logo.webp:', info);
  } catch (err) {
    console.error('Error compressing image:', err);
  }
}

compress();
