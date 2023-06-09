import { existsSync } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { parse } from 'node:path'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const CACHE = {}

export async function getFileData(filePath, shouldBeCached = false) {
  shouldBeCached = shouldBeCached && IS_PRODUCTION

  if (shouldBeCached && filePath in CACHE) {
    return CACHE[filePath]
  }

  if (!existsSync(filePath)) {
    let error = new Error('Not Found')
    error.httpStatus = 404
    throw error
  }

  let { ext, name } = parse(filePath.pathname)
  let { size } = await stat(filePath)
  let data = await readFile(filePath)

  let fileData = {
    data,
    ext,
    name,
    size
  }

  if (shouldBeCached) {
    CACHE[filePath] = fileData
  }

  return fileData
}
