import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dishes = [
  "Dosa","Biryani","Paneer Butter Masala","Chole Bhature","Idli","Vada",
  "Samosa","Pav Bhaji","Paratha","Roti","Naan","Chapati","Aloo Gobi",
  "Dal Makhani","Rajma","Bhindi Masala","Egg Curry","Mutton Curry",
  "Chicken Curry","Fish Fry","Lassi","Falooda","Kulfi","Jalebi",
  "Kachori","Vada Pav","Sev Puri","Dabeli","Misal Pav","Poha","Upma",
  "Uttapam","Thali","Masala Chai"
];

const folder = path.join(__dirname, 'images');
if (!fs.existsSync(folder)) fs.mkdirSync(folder);

async function downloadImage(url, filepath) {
  const writer = fs.createWriteStream(filepath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function main() {
  for (let i = 0; i < dishes.length; i++) {
    const name = dishes[i].replace(/\s/g, ',');
    const url = `https://source.unsplash.com/400x300/?${name}&sig=${i}`;
    const filepath = path.join(folder, `${dishes[i].replace(/\s/g, '_')}.jpg`);
    console.log(`Downloading ${dishes[i]}...`);
    await downloadImage(url, filepath);
  }
  console.log('All images downloaded!');
}

main();
