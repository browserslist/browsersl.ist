import fs from 'fs'
import path from 'path'

export default function getFileData(filePath) {
  let { name, ext } = path.parse(filePath.pathname)

  let readFile = (res, rej) => {
    fs.access(filePath, fs.constants.F_OK, errorAccess => {
      if (errorAccess) {
        rej({ status: 404, message: 'Not Found' })
      }

      fs.stat(filePath, (errorStats, { size }) => {
        if (errorStats) {
          rej({ status: 500, message: 'Internal Server Error' })
        }

        fs.readFile(filePath, (errorRead, data) => {
          if (errorRead) {
            rej({ status: 500, message: 'Internal Server Error' })
          }

          res({
            name,
            ext,
            size,
            data
          })
        })
      })
    })
  }

  return new Promise(readFile)
}
