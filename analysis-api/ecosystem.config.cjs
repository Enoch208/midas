module.exports = {
  apps: [
    {
      name: "midas-analysis-api",
      cwd: "/root/midas/analysis-api",
      script: "python3",
      args: "-m uvicorn app:app --host 0.0.0.0 --port 8080",
      interpreter: "none",
      env: {
        ANALYSIS_API_KEY: "",
      },
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
