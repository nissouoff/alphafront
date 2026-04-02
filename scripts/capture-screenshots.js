const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = './public/previews';

const templates = [
  {
    id: 'cosmetic',
    name: 'Glow Template',
    url: 'http://localhost:3000/template/cosmetic?preview=true',
    filename: 'cosmetic.png'
  },
  {
    id: 'skinova',
    name: 'Skinova Template',
    url: 'http://localhost:3000/template/skinova?preview=true',
    filename: 'skinova.png'
  }
];

async function captureScreenshots() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log('🚀 Starting screenshot capture...\n');

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  for (const template of templates) {
    try {
      console.log(`📸 Capturing: ${template.name}...`);
      console.log(`   URL: ${template.url}`);
      
      const page = await browser.newPage();
      
      await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
      
      await page.goto(template.url, { 
        waitUntil: 'networkidle0', 
        timeout: 60000 
      });
      
      await page.waitForTimeout(3000);
      
      const fullHeight = await page.evaluate(() => {
        return Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight,
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      });

      console.log(`   Page height: ${fullHeight}px`);
      
      await page.setViewport({ 
        width: 1280, 
        height: fullHeight,
        deviceScaleFactor: 2 
      });
      
      await page.waitForTimeout(1000);
      
      const screenshotPath = path.join(SCREENSHOTS_DIR, template.filename);
      
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        omitBackground: false
      });
      
      console.log(`   ✅ Saved: ${screenshotPath}\n`);
      
      await page.close();
      
    } catch (error) {
      console.error(`   ❌ Error capturing ${template.name}:`, error.message, '\n');
    }
  }

  await browser.close();
  console.log('✨ Done! All screenshots saved to public/previews/');
}

captureScreenshots().catch(console.error);
