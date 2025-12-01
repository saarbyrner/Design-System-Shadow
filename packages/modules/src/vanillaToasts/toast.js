// @flow
import { rootTheme } from '@kitman/playbook/themes';

const createToast = (
  toastContainer: HTMLElement,
  message: string = 'No Message'
) => {
  // Toast container
  const toastWrapper = document.createElement('div');
  toastWrapper.classList.add('toastWrapper');
  toastWrapper.style.color = rootTheme.palette.error.dark;

  // Toast
  const toast = document.createElement('div');
  toast.classList.add('vanillaToast');
  toast.style.backgroundColor = rootTheme.palette.error.light2;

  // Message container
  const toastMessage = document.createElement('span');
  toastMessage.classList.add('toastMessage');
  toastMessage.textContent = message;

  // Close button (X)
  const closeButton = document.createElement('span');
  closeButton.classList.add('toast-close');
  closeButton.textContent = '×';
  closeButton.style.cursor = 'pointer';

  // Append the close button and message to the toast t
  toast.appendChild(closeButton);
  toast.appendChild(toastMessage);

  // Append the toast to the toast container
  toastWrapper.appendChild(toast);
  toastContainer.appendChild(toastWrapper);

  // Add class to show toast with staggered animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Close the toast when the close button is clicked
  closeButton.addEventListener('click', () => {
    toast.classList.remove('show');

    // Remove the toast container once the toast animation is finished
    setTimeout(() => {
      toastWrapper.remove();
    }, 1000);
  });
};

export const hideToast = () => {
  const toastWrapper = document.querySelector('.toastWrapper');
  if (toastWrapper) {
    toastWrapper.remove();
  }
};

const showToast = (message: string) => {
  let toastContainer = document.getElementById('toast-container');
  const toastMessage = document.querySelector('.toastMessage');
  const toastWrapper = document.querySelector('.toastWrapper');

  // Create a toast container if it doesn't exist
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body?.appendChild(toastContainer);
  }

  // If a toast already exists; update its text
  if (toastWrapper && toastMessage) {
    toastMessage.textContent = message;
  } else {
    createToast(toastContainer, message);
  }
};

export default showToast;
