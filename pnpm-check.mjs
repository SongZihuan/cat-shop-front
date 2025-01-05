if (process.env.npm_execpath && process.env.npm_execpath.includes('pnpm')) {
  process.exit(0)
} else if (process.env.npm_config_user_agent && process.env.npm_config_user_agent.includes('pnpm')) {
  process.exit(0)
} else {
  console.log('Please install pnpm first. And run the project use pnpm.')
  process.exit(1)
}
