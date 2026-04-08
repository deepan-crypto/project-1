const Jimp = require('jimp');

async function padImage() {
  try {
    // Read the original image
    console.log('Reading image...');
    const image = await Jimp.read('./assets/images/ican.png');
    
    // Android adaptive icons use a 108dp canvas with a 66dp safe zone.
    // The icon must fit within the inner ~61% to avoid being clipped by masks.
    // Using a 2.0x padding factor keeps the logo well inside the safe zone.
    const paddingFactor = 2.0;
    
    const newWidth = Math.round(image.bitmap.width * paddingFactor);
    const newHeight = Math.round(image.bitmap.height * paddingFactor);
    const newSize = Math.max(newWidth, newHeight);
    
    console.log(`Original size: ${image.bitmap.width}x${image.bitmap.height}`);
    console.log(`New size: ${newSize}x${newSize}`);
    
    // Create a new blank canvas with the new size (white background to match)
    const canvas = new Jimp(newSize, newSize, 0xFFFFFFFF); 
    
    // Center the original image on the new canvas.
    // Apply a slight upward shift (-3% of canvas) to visually center the logo,
    // compensating for the stem that extends below the circular part.
    const x = Math.round((newSize - image.bitmap.width) / 2);
    const yOffset = Math.round(newSize * -0.03);
    const y = Math.round((newSize - image.bitmap.height) / 2) + yOffset;
    
    console.log(`Pasting at x: ${x}, y: ${y}`);
    canvas.composite(image, x, y);
    
    await canvas.writeAsync('./assets/images/adaptive-icon.png');
    console.log('Successfully created adaptive-icon.png');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

padImage();
