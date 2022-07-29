import { updateBrowsersStats, updateGlobalCoverageBar, updateToolsVersions, hideStatsPlaceholder } from './view/showStats.js';

const API_HOST = 'http://localhost:5000/api';

const form = document.getElementById('query_form');
const textarea = document.getElementById('query_text_area');
const errorMessage = document.getElementById('error_message');

  function initForm() {
  form.addEventListener('submit', async (e) => {
    if(!form.checkValidity()) {
      return;
    }
    const formData = new FormData(form);
    const query = formData.get('query')
    e.preventDefault();
    form.classList.add('Form--justSend');
    textarea.addEventListener('input', () => {
      form.classList.remove('Form--justSend');
    }, {
      once: true,
    })
    updateStatsView(query);
  })
  textarea.addEventListener('keypress', (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  })
}

initForm();

async function updateStatsView(query) {
  let response;
  try {
    response = await fetch(`${API_HOST}?q=${encodeURIComponent(query)}`)
  } catch (error) {}

  const data = await response.json();

  if (!response.ok) {
    renderError(data.message);
    return false;
  }

  const {
    browsers,
    versions,
  } = data;

  hideStatsPlaceholder();
  updateBrowsersStats(browsers);
  updateGlobalCoverageBar(browsers);
  updateToolsVersions(versions);

  return true;
}


function renderError(message) {
  errorMessage.innerHTML = message.split('.')[0];
  form.classList.add('Form--serverError');
  textarea.addEventListener('input', () => {
    form.classList.remove('Form--serverError');
  }, {
    once: true,
  })
}

// document.addEventListener('DOMContentLoaded', () => {
//   const urlParams = new URLSearchParams(window.location.search);
//
//   if (urlParams.get('query')) {
//
//   }
// })
