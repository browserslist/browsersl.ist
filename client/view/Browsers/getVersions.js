const MIN_COVERAGE_GROUP = 0

export default function getVersions(versionsInput) {
  let versions = Object.entries(versionsInput)
    .sort(([versionA], [versionB]) => versionB - versionA)
    .reduce(groupZeroCoverageVersions, [])

  return versions
}

function groupZeroCoverageVersions(acc, currentItem, i, arr) {
  let prevItem = acc[acc.length - 1] || {}
  let [version, coverage] = currentItem
  // Ignore versions like a `Safari TP`, diapasones of minor versions with `-` and `null` for Node.js
  let isNumericVersion = !isNaN(version)

  if (
    coverage === MIN_COVERAGE_GROUP &&
    prevItem.coverage === MIN_COVERAGE_GROUP &&
    isNumericVersion
  ) {
    prevItem.coverage += coverage
    prevItem.version.push(version)

    if (prevItem.version?.length > 1 && arr.length === i + 1) {
      prevItem.version = formatVersionGroups(prevItem.version)
    }
  } else {
    if (prevItem.version?.length > 1) {
      prevItem.version = formatVersionGroups(prevItem.version)
    }

    acc.push({
      version: [version],
      coverage
    })
  }

  return acc
}

function formatVersionGroups(verArray) {
  return [verArray[verArray.length - 1], verArray[0]].join('-')
}
