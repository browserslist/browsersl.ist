// stars.json is created on `postinstall` step
import { githubStars, npmDownloads } from '../../data/stats.json'

document.querySelector('[data-id="badge-gh-stars"]').textContent = githubStars

document.querySelector('[data-id="badge-npm-downloads"]').textContent =
  npmDownloads
