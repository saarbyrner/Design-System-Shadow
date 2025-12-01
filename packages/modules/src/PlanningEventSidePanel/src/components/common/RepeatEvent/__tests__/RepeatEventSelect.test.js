/** @typedef {import('../RepeatEventSelect').TranslatedProps} TranslatedProps */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment-timezone';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import getRecurrencePreferences from '@kitman/services/src/services/planning/getRecurrencePreferences';
import { data } from '@kitman/services/src/mocks/handlers/planningHub/getRecurrencePreferences';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';

import RepeatEventSelect from '../RepeatEventSelect';
import { getDefaultOption } from '../utils/options-helpers';
import { getModalBaseTranslations } from '../RepeatEventCustomConfigModal/utils/helpers';
import {
  createRRuleFromModalConfig,
  getDefaultCustomConfig,
  interpolateRRuleIntoDisplayableText,
} from '../RepeatEventCustomConfigModal/utils/config-helpers';

jest.mock('@kitman/services/src/services/planning/getRecurrencePreferences');

describe('<RepeatEventSelect />', () => {
  const t = i18nextTranslateStub();
  const eventDate = moment(new Date(2023, 11, 4)); // December 4th, 2023, a Monday

  /** @type {TranslatedProps} */
  const props = {
    t,
    eventDate,
    onChange: jest.fn(),
    selectedRecurrencePreferences: [],
    eventType: 'custom_event',
  };

  const defaultState = {
    preloadedState: { eventsPanel: { mode: 'EDIT' } },
    useGlobalStore: false,
  };

  const defaultConfig = getDefaultCustomConfig(eventDate);
  defaultConfig.repeatEvery.interval = 2;
  const rruleConfig = createRRuleFromModalConfig(defaultConfig, eventDate);

  it('renders', () => {
    renderWithRedux(<RepeatEventSelect {...props} />, defaultState);
    expect(screen.getByText(getDefaultOption(t).label)).toBeInTheDocument();
  });

  it('opens the custom config modal', async () => {
    const user = userEvent.setup();
    renderWithRedux(<RepeatEventSelect {...props} />, defaultState);

    await user.click(screen.getByLabelText('Repeats'));
    await user.click(screen.getByText('Custom'));

    const translations = getModalBaseTranslations(t);
    Object.values(translations).forEach((translatedText) => {
      expect(screen.getByText(translatedText)).toBeInTheDocument();
    });
  });

  it("displays the custom config passed as a prop as the select's value", async () => {
    renderWithRedux(
      <RepeatEventSelect {...props} value={rruleConfig} />,
      defaultState
    );

    expect(
      screen.getByText(interpolateRRuleIntoDisplayableText(rruleConfig, t))
    ).toBeInTheDocument();
  });

  describe('<RepeatEventSelect />', () => {
    beforeEach(() => {
      getRecurrencePreferences.mockReturnValue(data);
    });

    it('should not render if eventType !== session_event', () => {
      renderWithRedux(
        <RepeatEventSelect {...props} value={rruleConfig} />,
        defaultState
      );

      expect(
        screen.queryByText(
          'Choose the fields to copy for all repeated sessions'
        )
      ).not.toBeInTheDocument();
      expect(screen.queryAllByRole('checkbox').length).toEqual(0);
    });

    it('should not render if eventType is session_event but there is no value', () => {
      renderWithRedux(
        <RepeatEventSelect {...props} eventType="session_event" value={null} />,
        defaultState
      );

      expect(
        screen.queryByText(
          'Choose the fields to copy for all repeated sessions'
        )
      ).not.toBeInTheDocument();
      expect(screen.queryAllByRole('checkbox').length).toEqual(0);
    });

    it('should not render if eventType is session_event and there is a value', async () => {
      renderWithRedux(
        <RepeatEventSelect
          {...props}
          eventType="session_event"
          value={rruleConfig}
        />,
        defaultState
      );

      expect(
        await screen.findByText(
          'Choose the fields to copy for all repeated sessions'
        )
      ).toBeInTheDocument();
      expect(screen.getAllByRole('checkbox').length).toEqual(
        data.preferences.length
      );
    });
  });
});
