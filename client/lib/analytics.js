import Plausible from 'plausible-tracker'

let { trackEvent, trackPageview } = Plausible({
  apiHost: 'https://lens.hplush.dev',
  domain: 'browsersl.ist'
})

trackPageview()

export { trackEvent }
