// @flow
const visuallyHideIntercom = (hide: boolean) => {
  const intercomElement = document.getElementsByClassName(
    'intercom-lightweight-app'
  )[0];

  // check if intercom element actually exists
  if (intercomElement) {
    if (hide) {
      intercomElement.style.display = 'none';
    }

    if (!hide) {
      intercomElement.style.display = 'initial';
    }
  }
};

export default visuallyHideIntercom;
