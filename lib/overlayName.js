import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export async function overlayNameOnCertificate(fullName) {
  const templatePath = path.join(process.cwd(), 'public', 'template.png');
  
  // Get template dimensions
  const metadata = await sharp(templatePath).metadata();
  const width = metadata.width;
  const height = metadata.height;
  
  // Create SVG text overlay
  // Adjust these values to position the name correctly
  const fontSize = 105;
  const textY = height * 0.449; // Position at 37.5% from top (where the line is)
  
  const svgText = `
    <svg width="${width}" height="${height}">
      <text 
        x="50%" 
        y="${textY}" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="black" 
        text-anchor="middle" 
        dominant-baseline="middle">
        ${fullName}
      </text>
    </svg>
  `;
  
  // Overlay text on template
  const buffer = await sharp(templatePath)
    .composite([{
      input: Buffer.from(svgText),
      top: 0,
      left: 0
    }])
    .png()
    .toBuffer();
  
  return buffer;
}