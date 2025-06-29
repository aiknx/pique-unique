const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/favicon.svg');
const outputPath = path.join(__dirname, '../public/favicon.ico');

// Read the SVG file
const svgBuffer = fs.readFileSync(inputPath);

// Convert SVG to PNG with 32x32 dimensions
sharp(svgBuffer)
  .resize(32, 32)
  .toFormat('png')
  .toBuffer()
  .then(pngBuffer => {
    // Convert PNG to ICO
    sharp(pngBuffer)
      .toFile(outputPath)
      .then(() => {
        console.log('Favicon generated successfully!');
      })
      .catch(err => {
        console.error('Error generating ICO:', err);
      });
  })
  .catch(err => {
    console.error('Error converting SVG:', err);
  }); 