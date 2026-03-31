const puppeteer = require('puppeteer-core');

const SCREENSHOTS_DIR = './public/screenshots';

const templates = [
  {
    id: 'cosmetic-landing',
    name: 'Landing Page Cosmétiques',
    url: 'http://localhost:3000/template/cosmetic',
    filename: 'cosmetic-landing.png'
  }
];

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  for (const template of templates) {
    try {
      console.log(`Capturing: ${template.name}...`);
      await page.goto(template.url, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.screenshot({
        path: `${SCREENSHOTS_DIR}/${template.filename}`,
        fullPage: true
      });
      console.log(`✓ Saved: ${template.filename}`);
    } catch (error) {
      console.error(`✗ Error capturing ${template.name}:`, error.message);
    }
  }

  await browser.close();
  console.log('Done!');
}

captureScreenshots();
