const Client = require('./src/client');

const sleep = (ms = Math.floor((1 + Math.random()) * 5000)) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  for (const cookie of process.env.COOKIE.split('#')) {
    const client = new Client(cookie);

    const roles = await client.getRoles();
    await sleep();

    for (const role of roles) {
      await client.sign(role);
      await sleep();
    }

    if (global.failed) process.exit(1);
  }
})();
