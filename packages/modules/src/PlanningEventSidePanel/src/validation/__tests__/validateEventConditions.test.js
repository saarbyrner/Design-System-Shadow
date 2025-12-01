import validateEventConditions from '../validateEventConditions';

describe('validateEventConditions', () => {
  const expectedTempInvalid = {
    temperature: {
      isInvalid: true,
    },
  };
  const expectedHumidityInvalid = {
    humidity: {
      isInvalid: true,
    },
  };

  const expectedTempValid = {
    temperature: {
      isInvalid: false,
    },
  };

  const expectedHumidityValid = {
    humidity: {
      isInvalid: false,
    },
  };

  it('validates correct data without issues', () => {
    const data = {
      temperature: '10',
      humidity: 30,
    };

    const result = validateEventConditions(data, 'C');
    expect(result).toEqual({
      ...expectedTempValid,
      ...expectedHumidityValid,
    });
  });

  it('validates a reasonable negative temperature is ok', () => {
    const data = {
      temperature: '-10',
    };

    const result = validateEventConditions(data, 'C');
    expect(result).toEqual({
      ...expectedTempValid,
      ...expectedHumidityValid,
    });
  });

  it('invalidates a negative humidity', () => {
    const data = {
      humidity: -5,
    };

    const result = validateEventConditions(data, 'C');
    expect(result).toEqual({
      ...expectedTempValid,
      ...expectedHumidityInvalid,
    });
  });

  it('validates temperature is not a decimal number', () => {
    const data = {
      temperature: '10.5',
    };

    const result = validateEventConditions(data, 'C');
    expect(result).toEqual({
      ...expectedTempInvalid,
      ...expectedHumidityValid,
    });
  });

  it('validates humidity can be a decimal number', () => {
    const data = {
      humidity: 50.25,
    };

    const result = validateEventConditions(data, 'C');
    expect(result).toEqual({
      ...expectedTempValid,
      ...expectedHumidityValid,
    });
  });

  it('validates high temperatures and high humidities', () => {
    const celsiusValid = {
      temperature: '60',
      humidity: 100,
    };

    const celsiusInvalid = {
      temperature: '80',
      humidity: 101,
    };

    const fahrenValid = {
      temperature: '80',
      humidity: 99.9,
    };

    const fahrenInvalid = {
      temperature: '150',
      humidity: 100.1,
    };

    expect(validateEventConditions(celsiusValid, 'C')).toEqual({
      ...expectedTempValid,
      ...expectedHumidityValid,
    });
    expect(validateEventConditions(celsiusInvalid, 'C')).toEqual({
      ...expectedTempInvalid,
      ...expectedHumidityInvalid,
    });
    expect(validateEventConditions(fahrenValid, 'F')).toEqual({
      ...expectedTempValid,
      ...expectedHumidityValid,
    });
    expect(validateEventConditions(fahrenInvalid, 'F')).toEqual({
      ...expectedTempInvalid,
      ...expectedHumidityInvalid,
    });
  });

  it('validates low temperatures and low humidities', () => {
    const celsiusValid = {
      temperature: '-80',
      humidity: 0,
    };

    const celsiusInvalid = {
      temperature: '-120',
      humidity: -1,
    };

    const fahrenValid = {
      temperature: '-120',
      humidity: 0.5,
    };

    const fahrenInvalid = {
      temperature: '-150',
      humidity: -0.5,
    };

    expect(validateEventConditions(celsiusValid, 'C')).toEqual({
      ...expectedTempValid,
      ...expectedHumidityValid,
    });
    expect(validateEventConditions(celsiusInvalid, 'C')).toEqual({
      ...expectedTempInvalid,
      ...expectedHumidityInvalid,
    });
    expect(validateEventConditions(fahrenValid, 'F')).toEqual({
      ...expectedTempValid,
      ...expectedHumidityValid,
    });
    expect(validateEventConditions(fahrenInvalid, 'F')).toEqual({
      ...expectedTempInvalid,
      ...expectedHumidityInvalid,
    });
  });

  it('accepts undefined and NaN', () => {
    const dataUndefFar = {
      temperature: undefined,
      humidity: undefined,
    };

    const dataUndefCel = {
      temperature: undefined,
      humidity: undefined,
    };

    const dataNaNF = {
      temperature: NaN,
      humidity: NaN,
    };

    const dataNaNC = {
      temperature: NaN,
      humidity: NaN,
    };

    expect(validateEventConditions(dataUndefFar, 'F')).toEqual({
      ...expectedTempValid,
      ...expectedHumidityValid,
    });
    expect(validateEventConditions(dataUndefCel, 'C')).toEqual({
      ...expectedTempValid,
      ...expectedHumidityValid,
    });
    expect(validateEventConditions(dataNaNF, 'F')).toEqual({
      ...expectedTempValid,
      ...expectedHumidityValid,
    });
    expect(validateEventConditions(dataNaNC, 'C')).toEqual({
      ...expectedTempValid,
      ...expectedHumidityValid,
    });
  });
});
