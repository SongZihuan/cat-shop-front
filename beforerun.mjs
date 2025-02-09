import dotenv from 'dotenv'
import { resolve } from 'path'
import fs from 'fs'

if (process.argv[2] === '--mode') {
  dotenv.config({
    path: resolve(process.cwd(), '.env.' + (process.argv[3] || 'development-simulation'))
  })
} else {
  dotenv.config({
    path: resolve(process.cwd(), '.env.development-simulation')
  })
}

console.log('process.env.VITE_SIMULATION =', process.env.VITE_SIMULATION)

const tsconfig =
  process.env.VITE_SIMULATION === 'true'
    ? fs.readFileSync('tsconfig.simulation.json', 'utf-8')
    : fs.readFileSync('tsconfig.real.json', 'utf-8')

fs.writeFileSync('tsconfig.json', tsconfig)
