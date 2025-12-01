import { screen } from '@testing-library/react';

import { generalData as locations } from '@kitman/services/src/mocks/handlers/planning/getEventLocations';
import { data as venueTypes } from '@kitman/services/src/mocks/handlers/getVenueTypes';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { createStoreMock } from '@kitman/modules/src/CalendarPage/src/containers/__tests__/store';
import { renderWithProvider } from '../../../__tests__/helpers';
import Location from '../index';
import { calendarFiltersMock } from '../../../__tests__/consts';
import { getLocationTranslatedTexts } from '../../utils/helpers';
import {
  useGetVenueTypesQuery,
  useGetEventLocationsQuery,
} from '../../redux/services/filters';
import { numberOfActiveFiltersTestId } from '../../AccordionTitle/utils/consts';

jest.mock('../../redux/services/filters', () => ({
  ...jest.requireActual('../../redux/services/filters'),
  useGetVenueTypesQuery: jest.fn(),
  useGetEventLocationsQuery: jest.fn(),
}));

describe('Location', () => {
  const t = i18nextTranslateStub();
  const props = { t };
  const translations = getLocationTranslatedTexts(t);

  const numberOfInitialActiveFilters =
    calendarFiltersMock.locationNames.length +
    calendarFiltersMock.venueTypes.length;

  const store = createStoreMock({
    optimizedCalendarFilters: calendarFiltersMock,
  });
  beforeEach(() => {
    useGetVenueTypesQuery.mockReturnValue({
      data: venueTypes,
    });
    useGetEventLocationsQuery.mockReturnValue({
      data: locations,
    });
  });
  it('should render properly', () => {
    renderWithProvider(<Location {...props} />, store);

    expect(screen.getByText(translations.title)).toBeInTheDocument();
  });

  it('should count the number of active filters properly', async () => {
    renderWithProvider(<Location {...props} />, store);

    expect(
      await screen.findByTestId(numberOfActiveFiltersTestId)
    ).toHaveTextContent(numberOfInitialActiveFilters);
  });

  test('the select displays selected locations properly', async () => {
    renderWithProvider(<Location {...props} />, store);

    const gameLocationText = calendarFiltersMock.locationNames[0].label;

    const tagOptionText = screen.getByTestId('TextTag');

    expect(tagOptionText).toBeInTheDocument();
    expect(tagOptionText).toHaveTextContent(gameLocationText);
  });
});
