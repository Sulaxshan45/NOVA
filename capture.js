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
  
  await delay(3000);

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: "new"
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log("Navigating to Nova app login...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'assets/nova_login.png' });
  
  console.log("Clicking guest login...");
  try {
    await page.click('#btn-login-guest');
    await delay(3000); // Wait for dashboard to load
    await page.screenshot({ path: 'assets/nova_home.png' });
    console.log("Screenshot saved to assets/nova_home.png");
    
    // Try to click the first project to see project interface
    // In Nova, clicking a project card usually opens it
    const projectCards = await page.$$('.card, .project-card, div[onclick*="openProject"]');
    if (projectCards.length > 0) {
       await projectCards[0].click();
       await delay(3000);
       await page.screenshot({ path: 'assets/nova_project.png' });
       console.log("Screenshot saved to assets/nova_project.png");
    } else {
       // just click project data nav
       await page.click('#nav-projectdata').catch(()=>console.log("No nav-projectdata"));
       await delay(2000);
       await page.screenshot({ path: 'assets/nova_project.png' });
    }
  } catch(e) {
    console.log("Could not navigate further: ", e.message);
  }
  
  console.log("Navigating to flowcharts...");
  await page.goto(`file:///${path.join(__dirname, 'flowcharts.html').replace(/\\/g, '/')}`, { waitUntil: 'networkidle2' });
  await delay(2000);
  
  const appWorkflow = await page.$('#app-workflow');
  if(appWorkflow) await appWorkflow.screenshot({ path: 'assets/app_workflow.png' });

  const codingWorkflow = await page.$('#coding-workflow');
  if(codingWorkflow) await codingWorkflow.screenshot({ path: 'assets/coding_workflow.png' });

  await browser.close();
  server.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
