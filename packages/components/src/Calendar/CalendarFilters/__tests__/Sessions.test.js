import { screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { createStoreMock } from '@kitman/modules/src/CalendarPage/src/containers/__tests__/store';
import { renderWithProvider } from '../../__tests__/helpers';
import Sessions from '../Sessions';
import { calendarFiltersMock } from '../../__tests__/consts';
import { numberOfActiveFiltersTestId } from '../AccordionTitle/utils/consts';
import { useGetSessionTypesQuery } from '../redux/services/filters';

jest.mock('../redux/services/filters', () => ({
  ...jest.requireActual('../redux/services/filters'),
  useGetSessionTypesQuery: jest.fn(),
}));

describe('Sessions', () => {
  const t = i18nextTranslateStub();
  const props = { t };

  const mockSessionTypes = ['Catapult', 'Fitbit', 'GPS'];
  const mockFilters = {
    ...calendarFiltersMock,
    session_type_names: ['Catapult'],
  };

  const numberOfInitialActiveFilters = mockFilters.session_type_names.length;

  const store = createStoreMock({
    optimizedCalendarFilters: mockFilters,
  });

  beforeEach(() => {
    useGetSessionTypesQuery.mockReturnValue({
      data: mockSessionTypes,
    });
  });

  it('should render properly', () => {
    renderWithProvider(<Sessions {...props} />, store);

    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should count the number of active filters properly', async () => {
    renderWithProvider(<Sessions {...props} />, store);

    expect(
      await screen.findByTestId(numberOfActiveFiltersTestId)
    ).toHaveTextContent(numberOfInitialActiveFilters.toString());
  });
});
