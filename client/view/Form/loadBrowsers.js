let lastRequest = 0

class ServerError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ServerError'
  }
}

export async function loadBrowsers(query, region) {
  if (!region) region = ''
  lastRequest += 1
  let request = lastRequest
  let response

  try {
    let urlParams = new URLSearchParams({ q: query, region })
    response = await fetch(`/api/browsers?${urlParams}`)

    if (request !== lastRequest) {
      return false
    }
  } catch (error) {
    throw new ServerError('Network error. Check that you are online.')
  }

  let data = await response.json()

  if (!response.ok) {
    if (data.message === 'Custom usage statistics was not provided') {
      throw new ServerError(
        `This website does not support in my stats queries yet. Run Browserslist
 <a href="https://github.com/browserslist/browserslist#custom-usage-data" class="Link">locally</a>.`
      )
    }

    if (response.status === 500) {
      throw new ServerError(
        `Server error. a class="Link" href="https://github.com/browserslist/browserl.ist">
  Report an issue</a> to our repository.`
      )
    }

    throw new ServerError(data.message)
  }

  return data
}
