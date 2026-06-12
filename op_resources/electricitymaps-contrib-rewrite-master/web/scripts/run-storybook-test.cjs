const http = require('http');
const { spawn } = require('child_process');

const STORYBOOK_URL = 'http://127.0.0.1:6006';
const STORYBOOK_PORT = '6006';
const STARTUP_TIMEOUT_MS = 120000;
const POLL_INTERVAL_MS = 1000;
const withCoverage = process.argv.includes('--coverage');

const command = 'pnpm';
const useShell = process.platform === 'win32';
let storybookProcess;
let exiting = false;

function requestUrl(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      res.resume();
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
        resolve();
        return;
      }
      reject(new Error(`Unexpected status: ${res.statusCode}`));
    });

    req.on('error', reject);
    req.setTimeout(3000, () => {
      req.destroy(new Error('Request timed out'));
    });
  });
}

async function waitForStorybook() {
  const start = Date.now();
  while (Date.now() - start < STARTUP_TIMEOUT_MS) {
    try {
      await requestUrl(STORYBOOK_URL);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
  }

  throw new Error(`Storybook was not ready within ${STARTUP_TIMEOUT_MS / 1000}s`);
}

function stopStorybook() {
  if (!storybookProcess || storybookProcess.killed) {
    return Promise.resolve();
  }

  if (process.platform === 'win32') {
    return new Promise((resolve) => {
      const killer = spawn('taskkill', ['/pid', String(storybookProcess.pid), '/t', '/f'], {
        stdio: 'ignore',
      });

      killer.on('error', () => resolve());
      killer.on('exit', () => resolve());
    });
  }

  return new Promise((resolve) => {
    storybookProcess.once('exit', () => resolve());
    storybookProcess.kill('SIGTERM');
    setTimeout(() => {
      if (!storybookProcess.killed) {
        storybookProcess.kill('SIGKILL');
      }
    }, 3000);
  });
}

async function finish(exitCode) {
  if (exiting) {
    return;
  }
  exiting = true;
  await stopStorybook();
  process.exit(exitCode);
}

function runTestRunner() {
  return new Promise((resolve, reject) => {
    const args = ['exec', 'test-storybook', '--url', STORYBOOK_URL];
    if (withCoverage) {
      args.push('--coverage');
    }

    const testRunnerProcess = spawn(command, args, {
      stdio: 'inherit',
      shell: useShell,
    });

    testRunnerProcess.on('error', reject);
    testRunnerProcess.on('exit', (code) => resolve(code || 0));
  });
}

process.on('SIGINT', () => {
  void finish(130);
});

process.on('SIGTERM', () => {
  void finish(143);
});

storybookProcess = spawn(
  command,
  ['storybook', '--ci', '--port', STORYBOOK_PORT, '--no-open'],
  {
    stdio: 'inherit',
    shell: useShell,
  }
);

storybookProcess.on('error', async () => {
  await finish(1);
});

storybookProcess.on('exit', async (code) => {
  if (!exiting) {
    await finish(code || 1);
  }
});

void (async () => {
  try {
    await waitForStorybook();
    const exitCode = await runTestRunner();
    await finish(exitCode);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    await finish(1);
  }
})();
