import { screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { createStoreMock } from '@kitman/modules/src/CalendarPage/src/containers/__tests__/store';
import { data as squadAthletes } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { data as staffUsers } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import { renderWithProvider } from '../../__tests__/helpers';
import Attendees from '../Attendees';
import { calendarFiltersMock } from '../../__tests__/consts';
import { getAttendeesTranslatedTexts } from '../utils/helpers';
import { numberOfActiveFiltersTestId } from '../AccordionTitle/utils/consts';
import {
  useGetSquadAthletesQuery,
  useGetStaffUsersQuery,
} from '../redux/services/filters';

jest.mock('../redux/services/filters', () => ({
  ...jest.requireActual('../redux/services/filters'),
  useGetSquadAthletesQuery: jest.fn(),
  useGetStaffUsersQuery: jest.fn(),
}));

describe('Attendees', () => {
  const t = i18nextTranslateStub();
  const props = { t };

  const translations = getAttendeesTranslatedTexts(t);

  const numberOfInitialActiveFilters =
    calendarFiltersMock.athletes.length + calendarFiltersMock.staff.length;

  const store = createStoreMock({
    optimizedCalendarFilters: calendarFiltersMock,
  });
  beforeEach(() => {
    useGetSquadAthletesQuery.mockReturnValue({
      data: squadAthletes,
    });
    useGetStaffUsersQuery.mockReturnValue({
      data: staffUsers,
    });
  });
  it('should render properly', () => {
    renderWithProvider(<Attendees {...props} />, store);

    expect(screen.getByText(translations.title)).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBe(2);
  });

  it('should count the number of active filters properly', async () => {
    renderWithProvider(<Attendees {...props} />, store);

    expect(
      await screen.findByTestId(numberOfActiveFiltersTestId)
    ).toHaveTextContent(numberOfInitialActiveFilters);
  });
});
