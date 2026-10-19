#!/usr/bin/env node
// Writes one version into package.json.
//   node scripts/set-version.mjs 0.0.1-alpha.1
import { readFileSync, writeFileSync } from 'node:fs'

const [version] = process.argv.slice(2)
if (!/^\d+\.\d+\.\d+(-(alpha|beta)\.\d+)?$/.test(version ?? '')) throw new Error(`Invalid version '${version}'.`)

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
writeFileSync('package.json', JSON.stringify({ ...pkg, version }, null, 2) + '\n')
console.log(`version ${version}`)
