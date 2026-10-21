module.exports = {
  apps: [
    {
      name: "mian-tailor",
      script: ".next/standalone/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        HOSTNAME: "0.0.0.0",
        PORT: 3000,
      },
    },
  ],
};
