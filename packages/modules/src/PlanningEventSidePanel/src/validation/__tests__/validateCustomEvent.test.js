import validateCustomEvent from '../validateCustomEvent';

describe('validateCustomEvent', () => {
  const inputEvent = {
    type: 'custom_event',
    // common fields
    duration: 90,
    local_timezone: 'timezone',
    start_time: '5:00',
  };
  it('requires an event type id', () => {
    const expected = validateCustomEvent(inputEvent);

    expect(expected.isValid).toBe(false);
    expect(expected.validation.custom_event_type.isInvalid).toBe(true);
  });

  it('correctly allows an event type id', () => {
    const input = {
      ...inputEvent,
      custom_event_type: { id: 3 },
    };

    const expected = validateCustomEvent(input);

    expect(expected.isValid).toBe(true);
    expect(expected.validation.custom_event_type.isInvalid).toBe(false);
  });
});
