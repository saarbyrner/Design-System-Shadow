// @flow

const isValidTemperature = (
  inputVal: string | number,
  temperatureUnit: 'F' | 'C'
) => {
  let isInputValid = true;
  const parsedVal =
    typeof inputVal === 'number' ? inputVal : parseInt(inputVal, 10);

  if (temperatureUnit === 'C') {
    isInputValid = parsedVal <= 70 && parsedVal >= -100;
  } else {
    isInputValid = parsedVal <= 140 && parsedVal >= -148;
  }
  return isInputValid;
};

export default isValidTemperature;
