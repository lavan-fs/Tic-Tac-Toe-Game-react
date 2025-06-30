const { exec } = require('child_process');
const path = require('path');

// Directory where your React app lives
const projectDir = path.join(__dirname, 'tic-tac-toe');
// Surge domain (replace with your actual domain)
const surgeDomain = 'lavan-fs-tic-tac-toe.surge.sh';

function runCommand(cmd, cwd) {
  return new Promise((resolve, reject) => {
    const proc = exec(cmd, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
  });
}

async function orchestrate() {
  try {
    console.log('--- Building the project ---');
    await runCommand('npm install', projectDir);
    await runCommand('npm run build', projectDir);
    console.log('--- Build successful! Deploying to Surge... ---');
    await runCommand(`npx surge ./build ${surgeDomain}`, projectDir);
    console.log('--- Deployment successful! ---');
  } catch (err) {
    console.error('Orchestration failed:', err);
    process.exit(1);
  }
}

orchestrate(); 