import path from 'node:path'
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const CACHE = {}

export default async function getFileData(filePath, shouldBeCached = false) {
  shouldBeCached = shouldBeCached && IS_PRODUCTION

  if (shouldBeCached && filePath in CACHE) {
    return CACHE[filePath]
  }

  if (!existsSync(filePath)) {
    let error = new Error('Not Found')
    error.httpStatus = 404
    throw error
  }

  let { name, ext } = path.parse(filePath.pathname)
  let { size } = await fs.stat(filePath)
  let data = await fs.readFile(filePath)

  let fileData = {
    name,
    ext,
    size,
    data
  }

  if (shouldBeCached) {
    CACHE[filePath] = fileData
  }

  return fileData
}
