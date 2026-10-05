// Loads .env for local development. Must be imported before anything that reads process.env.
// In Docker the file is absent (variables come from docker compose), so a missing file is ignored.
try {
  process.loadEnvFile();
} catch {
  // no .env file – rely on the existing environment
}
