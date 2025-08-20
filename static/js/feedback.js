export function showLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.add('open');
}

export function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.remove('open');
}

export function showToast(message, type = 'info', timeout = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = '';
  toast.classList.add('toast', type, 'show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, timeout);
}

