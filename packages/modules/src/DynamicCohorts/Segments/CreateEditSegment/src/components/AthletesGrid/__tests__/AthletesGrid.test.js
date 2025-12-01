import { screen } from '@testing-library/react';
import { paginatedAthletesResponse } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/searchAthletes';
import {
  defaultStore,
  renderTestComponent,
} from '@kitman/modules/src/DynamicCohorts/shared/testUtils';
import { useSearchAthletesQuery } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';
import AthletesGrid from '../AthletesGrid';

jest.mock(
  '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi'
);

describe('<AthletesGrid />', () => {
  beforeEach(() => {
    useSearchAthletesQuery.mockReturnValue({
      data: paginatedAthletesResponse,
      isSuccess: true,
      isLoading: false,
      isError: false,
    });
  });

  it('renders the headers', async () => {
    renderTestComponent(defaultStore, <AthletesGrid />);
    expect(await screen.findByText('Athletes')).toBeInTheDocument();
  });

  it('renders the table data', () => {
    renderTestComponent(defaultStore, <AthletesGrid />);
    paginatedAthletesResponse.athletes.forEach(({ name }) => {
      // link with athletes name
      expect(
        screen.getByRole('link', {
          name,
        })
      ).toBeInTheDocument();

      // avatar
      expect(
        screen.getByRole('img', {
          name,
        })
      ).toBeInTheDocument();
    });
  });
});
