import { screen } from '@testing-library/react';

import { data as teams } from '@kitman/services/src/mocks/handlers/getTeams';
import { data as competitions } from '@kitman/services/src/mocks/handlers/getCompetitions';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { createStoreMock } from '@kitman/modules/src/CalendarPage/src/containers/__tests__/store';
import { renderWithProvider } from '../../__tests__/helpers';
import Games from '../Games';
import { calendarFiltersMock } from '../../__tests__/consts';
import { getGamesTranslatedTexts } from '../utils/helpers';
import { numberOfActiveFiltersTestId } from '../AccordionTitle/utils/consts';
import {
  useGetCompetitionsQuery,
  useGetOppositionsQuery,
} from '../redux/services/filters';

jest.mock('../redux/services/filters', () => ({
  ...jest.requireActual('../redux/services/filters'),
  useGetCompetitionsQuery: jest.fn(),
  useGetOppositionsQuery: jest.fn(),
}));

describe('Games', () => {
  const t = i18nextTranslateStub();
  const props = { t };
  const translations = getGamesTranslatedTexts(t);

  const numberOfInitialActiveFilters =
    calendarFiltersMock.oppositions.length +
    calendarFiltersMock.competitions.length;

  const store = createStoreMock({
    optimizedCalendarFilters: calendarFiltersMock,
  });
  beforeEach(() => {
    useGetOppositionsQuery.mockReturnValue({
      data: teams,
    });
    useGetCompetitionsQuery.mockReturnValue({
      data: competitions,
    });
  });

  it('should render properly', () => {
    renderWithProvider(<Games {...props} />, store);

    expect(screen.getByText(translations.title)).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBe(2);
  });

  test('the select opposition component works properly', async () => {
    renderWithProvider(<Games {...props} />, store);

    expect(
      await screen.findByTestId(numberOfActiveFiltersTestId)
    ).toHaveTextContent(numberOfInitialActiveFilters);
  });
});
