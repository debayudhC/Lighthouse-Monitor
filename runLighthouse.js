import { launch } from 'chrome-launcher';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import lighthouse from 'lighthouse';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runLighthouse(url, reportDir) {
  const chrome = await launch({ chromeFlags: ['--headless'] });
  const options = { logLevel: 'info', output: 'html', onlyCategories: ['performance'], port: chrome.port };
  const runnerResult = await lighthouse(url, options);

  // Create directory if it doesn't exist
  if (!existsSync(reportDir)) {
    mkdirSync(reportDir, { recursive: true });
  }

  // Save the HTML report to a file
  const reportHtml = runnerResult.report;
  const reportPath = join(reportDir, 'lighthouse-report.html');
  writeFileSync(reportPath, reportHtml);

  console.log(`Report is done for ${runnerResult.lhr.finalUrl}`);
  console.log(`Performance score was ${runnerResult.lhr.categories.performance.score * 100}`);

  await chrome.kill();
}

async function runLighthouseForMultipleSites(urls) {
  for (const url of urls) {
    const domain = new URL(url).hostname.replace(/\./g, '_');
    const reportDir = join(__dirname, 'lighthouse-reports', domain);
    await runLighthouse(url, reportDir);
  }
}

const urls = [
  'https://example.com',
  'https://example.org',
  'https://example.net'
];

runLighthouseForMultipleSites(urls);
