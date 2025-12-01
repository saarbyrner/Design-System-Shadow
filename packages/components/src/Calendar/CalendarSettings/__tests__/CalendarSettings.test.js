/* eslint-disable jest/no-conditional-expect */
/** @typedef {import ("../index").TranslatedProps} TranslatedProps */
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { renderWithProvider } from '../../__tests__/helpers';
import {
  calendarSettingsTabHref,
  settingsButtonTestId,
  weekStartDays,
} from '../utils/consts';
import CalendarSettings from '../index';
import { mockWeekStartDay } from '../../__tests__/consts';

describe('CalendarSettings', () => {
  const togglePanelMock = jest.fn();

  /** @type {TranslatedProps} */
  const props = {
    isPanelOpen: true,
    t: i18nextTranslateStub(),
    togglePanel: togglePanelMock,
  };

  it('should render the sliding panel correctly', () => {
    renderWithProvider(<CalendarSettings {...props} />);
    expect(screen.getByText('Calendar Settings')).toBeInTheDocument();
  });

  it('should call the toggePanel function upon clicking on the icon', async () => {
    renderWithProvider(<CalendarSettings {...props} />);
    await userEvent.click(screen.getByTestId('panel-close-button'));
    await waitFor(() => {
      expect(togglePanelMock).toHaveBeenCalled();
    });
  });

  it('should render the weekday select button, and it should work properly', async () => {
    renderWithProvider(<CalendarSettings {...props} />);
    const select = screen.getByLabelText('Start week on');
    selectEvent.openMenu(select);
    weekStartDays.forEach((day) => {
      if (day === mockWeekStartDay) {
        expect(screen.getAllByText(day).length).toBe(2);
      } else expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('should render the time pickers', async () => {
    const component = renderWithProvider(<CalendarSettings {...props} />);
    expect(component.container.querySelectorAll('.rc-time-picker').length).toBe(
      2
    );
  });

  it('should render the default event time input', async () => {
    const component = renderWithProvider(<CalendarSettings {...props} />);
    const inputContainer = component.getByTestId('InputNumeric');
    expect(inputContainer).toBeInTheDocument();
  });

  it('should render the save button and a link to the calendar settings tab', () => {
    renderWithProvider(<CalendarSettings {...props} />);
    expect(screen.getByText('Save')).toBeInTheDocument();
    const anchorEl = screen.getByTestId(settingsButtonTestId);
    expect(anchorEl).toHaveAttribute('href', calendarSettingsTabHref);
    expect(anchorEl.children.length).toBe(1);
  });
});
