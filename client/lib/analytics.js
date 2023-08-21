import Plausible from 'plausible-tracker'

let { trackEvent, trackPageview } = Plausible({
  domain: 'browsersl.ist'
})

trackPageview()

export { trackEvent }
