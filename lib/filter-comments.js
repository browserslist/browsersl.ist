export function filterComments(config) {
  return config.replace(/#[^\n]*/g, '').trim()
}
