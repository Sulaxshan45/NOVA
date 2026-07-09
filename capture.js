import puppeteer from 'puppeteer-core';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  console.log("Starting server...");
  const server = exec('node server.js');
  
  await delay(3000); // wait for server to start

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: "new"
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log("Navigating to Nova app...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'assets/nova_screenshot.png' });
  console.log("Screenshot saved to assets/nova_screenshot.png");
  
  console.log("Navigating to flowcharts...");
  await page.goto(`file:///${path.join(__dirname, 'flowcharts.html').replace(/\\/g, '/')}`, { waitUntil: 'networkidle2' });
  await delay(2000); // Wait for mermaid to render
  
  const appWorkflow = await page.$('#app-workflow');
  await appWorkflow.screenshot({ path: 'assets/app_workflow.png' });
  console.log("Screenshot saved to assets/app_workflow.png");

  const codingWorkflow = await page.$('#coding-workflow');
  await codingWorkflow.screenshot({ path: 'assets/coding_workflow.png' });
  console.log("Screenshot saved to assets/coding_workflow.png");

  await browser.close();
  server.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
