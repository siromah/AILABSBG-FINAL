const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'cloudflared-url.txt');

// Start static server
const server = spawn('npx', ['serve', '-l', '3000', 'dist/client'], {
  cwd: __dirname,
  shell: true,
  stdio: 'ignore'
});

console.log('Static server starting on port 3000...');

setTimeout(() => {
  console.log('Starting cloudflared tunnel...');
  const tunnel = spawn(
    path.join(process.env.USERPROFILE || process.env.HOME, 'cloudflared.exe'),
    ['tunnel', '--url', 'http://localhost:3000'],
    { shell: true }
  );

  let urlFound = false;

  tunnel.stdout.on('data', (data) => {
    const text = data.toString();
    console.log(text);

    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match && !urlFound) {
      urlFound = true;
      fs.writeFileSync(logFile, match[0]);
      console.log('\n✅ URL SAVED:', match[0]);
    }
  });

  tunnel.stderr.on('data', (data) => {
    const text = data.toString();
    console.error(text);

    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match && !urlFound) {
      urlFound = true;
      fs.writeFileSync(logFile, match[0]);
      console.log('\n✅ URL SAVED:', match[0]);
    }
  });

  tunnel.on('exit', (code) => {
    console.log('Tunnel exited with code', code);
    process.exit(code);
  });
}, 4000);

process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});
