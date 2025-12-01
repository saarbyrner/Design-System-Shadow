// @flow
import { createContext } from 'react';

export const defaultTimezones = {
  orgTimezone: 'UTC',
};

const TimezonesContext = createContext<{ orgTimezone: string }>(
  defaultTimezones
);

export default TimezonesContext;
