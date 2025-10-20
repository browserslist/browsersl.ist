// stars.json is created on `postinstall` step
import { githubStars } from '../../data/stats.json'

document.querySelector('[data-id="badge-gh-stars"]').textContent = githubStars
