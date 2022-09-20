const WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/'

const WIKIPEDIA_LINKS = {
  and_chr: 'Google_Chrome#Android',
  and_ff: 'Firefox_for_Android',
  and_qq: 'QQ_browser',
  and_uc: 'UC_Browser',
  android: 'List_of_features_in_Android#AndroidBrowser',
  baidu: 'Baidu_Browser',
  bb: 'BlackBerry#Software',
  chrome: 'Google_Chrome',
  edge: 'Microsoft_Edge',
  firefox: 'Mozilla_Firefox',
  ie: 'Internet_Explorer',
  ie_mob: 'Internet_Explorer_Mobile',
  ios_saf: 'Safari_(web_browser)',
  kaios: 'KaiOS',
  node: 'Node.js',
  op_mini: 'Opera_Mini',
  op_mob: 'Opera_Mobile',
  opera: 'Opera_(web_browser)',
  safari: 'Safari_(web_browser)',
  samsung: 'Samsung_Internet'
}

for (let browser in WIKIPEDIA_LINKS) {
  WIKIPEDIA_LINKS[browser] = WIKIPEDIA_URL + WIKIPEDIA_LINKS[browser]
}

export default WIKIPEDIA_LINKS
