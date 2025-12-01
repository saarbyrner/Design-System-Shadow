import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { data as mockSquads } from '@kitman/services/src/mocks/handlers/getPermittedSquads';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import CalendarFilters from '../index';
import { useGetSquadsQuery } from '../redux/services/filters';
import { renderWithProvider } from '../../__tests__/helpers';
import { getAllTranslatedTexts } from '../utils/helpers';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetActiveSquadQuery: jest.fn(),
}));

jest.mock('../redux/services/filters', () => ({
  ...jest.requireActual('../redux/services/filters'),
  useGetSquadsQuery: jest.fn(),
}));

describe('<CalendarFilters />', () => {
  const t = i18nextTranslateStub();

  const {
    filters: { typesTitle, squadsTitle },
    attendees: { athletes, staff },
    location,
    games,
  } = getAllTranslatedTexts(t);

  const togglePanelMock = jest.fn();
  const props = {
    isPanelOpen: true,
    togglePanel: togglePanelMock,
    t,
  };
  const currentSquad = mockSquads[2];

  beforeEach(() => {
    useGetActiveSquadQuery.mockReturnValue({
      data: {
        ...currentSquad,
        owner_id: 1234,
      },
      isSuccess: true,
    });

    useGetSquadsQuery.mockReturnValue({ data: mockSquads });
  });

  it('renders all fields properly', () => {
    renderWithProvider(<CalendarFilters {...props} />);
    expect(screen.getByText(typesTitle)).toBeInTheDocument();
    expect(screen.getByText(squadsTitle)).toBeInTheDocument();
    expect(screen.getByText(athletes.label)).toBeInTheDocument();
    expect(screen.getByText(staff.label)).toBeInTheDocument();
    expect(screen.getByText(location.title)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: new RegExp(games.title),
      })
    ).toBeInTheDocument(); // "Games" is also an event type, so this is more exact
  });

  it('should trigger the togglePanel callback', async () => {
    renderWithProvider(<CalendarFilters {...props} />);
    await userEvent.click(screen.getByTestId('panel-close-button'));
    expect(togglePanelMock).toHaveBeenCalled();
  });

  it('should have the user current squad as selected and disabled', async () => {
    renderWithProvider(<CalendarFilters {...props} />);
    const checkboxText = screen.getByText(currentSquad.name);
    const checkbox = checkboxText.parentElement.querySelector('input');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toBeChecked();
  });
});
