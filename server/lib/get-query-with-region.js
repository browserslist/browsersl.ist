import browserslist from 'browserslist'

export default function getQueryWithRegion(query, region) {
  let queryParsed = browserslist.parse(query)
  let queryParsedModified = queryParsed.map(expression => {
    if (expression.type === 'popularity') {
      return {
        compose: expression.compose,
        place: region,
        popularity: expression.popularity,
        query: [expression.query, 'in', region].join(' '),
        sign: expression.sign,
        type: 'popularity_in_place'
      }
    }
    return expression
  })

  return getQueryFromQueryParsed(queryParsedModified)
}

function getQueryFromQueryParsed(browserslistParsed) {
  return browserslistParsed.reduce(
    (updatedQuery, { query: currentQuery, compose }, i) => {
      // The first parsed query always contains `or`
      if (i === 0) {
        return currentQuery
      } else {
        return [updatedQuery, compose, currentQuery].join(' ')
      }
    },
    ''
  )
}
