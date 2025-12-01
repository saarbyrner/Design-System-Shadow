const setScaleValue = (value, scaleEl) => {
  scaleEl.find('input[type="hidden"]').val(value);
  scaleEl.find('li').removeClass('active');
  if (value === 0) {
    scaleEl.find('input[type="hidden"]').val('');
  } else {
    scaleEl.find(`li[data-value="${value}"]`).addClass('active');
  }
};

const initScale = (scaleEl) => {
  // If the value of the input already exist, update the value in the interface
  const initialValue = scaleEl.find('input[type="hidden"]').val();
  if (initialValue) {
    setScaleValue(initialValue, scaleEl);
  }

  // eslint-disable-next-line func-names
  scaleEl.find('.scale li').on('click', function () {
    const value = $(this).data('value');
    setScaleValue(value, scaleEl);
  });

  scaleEl
    .parent()
    .find('a.js-clear_scale')
    .on('click', () => {
      setScaleValue(0, scaleEl);
      return false;
    });
};

export default initScale;
