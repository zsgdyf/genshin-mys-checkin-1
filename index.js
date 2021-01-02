const MysClient = require('./src/mys/client');

const sleep = (ms = Math.floor((1 + Math.random()) * 5000)) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  // mys
  for (const cookie of (process.env.COOKIE || '').split('#')) {
    if (!cookie) continue;

    const mysClient = new MysClient(cookie);

    const roles = await mysClient.getRoles();
    await sleep();

    for (const role of roles) {
      await mysClient.sign(role);
      await sleep();
    }
  }

  if (global.failed) process.exit(1);
})();
