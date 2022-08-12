import path from 'node:path'
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const cache = {}

export default function getFileData(filePath, shouldBeCached = false) {
  shouldBeCached = shouldBeCached && IS_PRODUCTION

  let readFile = async (resolve, reject) => {
    let fileData

    if (shouldBeCached && filePath in cache) {
      resolve(cache[filePath])
      return
    }

    if (!existsSync(filePath)) {
      reject({ status: 404, message: 'Not Found' })
      return
    }

    try {
      let { name, ext } = path.parse(filePath.pathname)
      let { size } = await fs.stat(filePath)
      let data = await fs.readFile(filePath)

      fileData = {
        name,
        ext,
        size,
        data
      }
    } catch (error) {
      reject({ status: 500, message: 'Internal Server Error' })
      return
    }

    if (shouldBeCached) {
      cache[filePath] = fileData
    }

    resolve(fileData)
  }

  return new Promise(readFile)
}
