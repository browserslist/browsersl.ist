export function isEmptyConfig(config) {
  let configWithoutComments = config.replace(/#[^\n]*/g, '').trim()

  return configWithoutComments.length === 0
}
