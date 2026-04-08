const Jimp = require('jimp');

async function padImage() {
  try {
    // Read the original image
    console.log('Reading image...');
    const image = await Jimp.read('./assets/images/ican.png');
    
    // Android adaptive icons use a 108dp canvas with a 72dp visible area.
    // The ratio is 108/72 = 1.5, so the logo should occupy ~67% of the canvas.
    const paddingFactor = 1.5;
    
    const newWidth = Math.round(image.bitmap.width * paddingFactor);
    const newHeight = Math.round(image.bitmap.height * paddingFactor);
    const newSize = Math.max(newWidth, newHeight);
    
    console.log(`Original size: ${image.bitmap.width}x${image.bitmap.height}`);
    console.log(`New size: ${newSize}x${newSize}`);
    
    // Create a new blank canvas with white background
    const canvas = new Jimp(newSize, newSize, 0xFFFFFFFF); 
    
    // Center the original image on the new canvas
    const x = Math.round((newSize - image.bitmap.width) / 2);
    const y = Math.round((newSize - image.bitmap.height) / 2);
    
    console.log(`Pasting at x: ${x}, y: ${y}`);
    canvas.composite(image, x, y);
    
    await canvas.writeAsync('./assets/images/adaptive-icon.png');
    console.log('Successfully created adaptive-icon.png');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

padImage();
