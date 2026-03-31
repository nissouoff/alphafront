const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const PREVIEW_URL = 'http://localhost:3000/template/cosmetic?preview=true';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'previews');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'cosmetic.png');

const TEMPLATES = [
  {
    id: 'cosmetic',
    url: 'http://localhost:3000/template/cosmetic?preview=true',
    output: path.join(OUTPUT_DIR, 'cosmetic.png'),
  },
];

async function captureScreenshot(url, outputPath, width = 400, height = 250) {
  const executablePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  ];

  let executablePath = null;
  for (const p of executablePaths) {
    if (fs.existsSync(p)) {
      executablePath = p;
      break;
    }
  }

  if (!executablePath) {
    console.error('Chrome not found. Please install Chrome.');
    process.exit(1);
  }

  console.log(`Launching Chrome from: ${executablePath}`);
  console.log(`Capturing: ${url}`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });

  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.screenshot({
      path: outputPath,
      fullPage: false,
    });

    console.log(`Screenshot saved to: ${outputPath}`);
  } catch (error) {
    console.error(`Error capturing ${url}:`, error.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const template of TEMPLATES) {
    await captureScreenshot(template.url, template.output, 400, 600);
  }

  console.log('Done!');
}

main().catch(console.error);
