import { updateBrowsersStats, updateGlobalCoverageBar, updateVersions } from './view/showStats.js';

const API_HOST = 'http://localhost:5000/api';

function initForm() {
  const form = document.getElementById('query_form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    updateStatsView(formData.get('query'));
  })
  const textarea = document.getElementById('query_text_area');
  textarea.addEventListener('keypress', (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      updateStatsView(textarea.value);
    }
  })
}

initForm();

async function updateStatsView(query) {
  const {
    browsers,
    versions
  } = await getData(query);
  updateBrowsersStats(browsers);
  updateGlobalCoverageBar(browsers);
  updateVersions(versions);
}

async function getData(query) {
    // TODO Handling errors: 400 status and connection errors
    let response = await fetch(`${API_HOST}?q=${encodeURIComponent(query)}`)
    return await response.json();
}
