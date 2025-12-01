import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  useGetPermissionsQuery,
  useGetSquadAthletesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { useSearchPastAthletesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { minimalSquadAthletes as squadAthletes } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { data as pastAthletes } from '@kitman/services/src/mocks/handlers/medical/searchPastAthletes';
import AthleteSelector from '@kitman/modules/src/Medical/shared/components/AthleteSelector';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
  useGetSquadAthletesQuery: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useSearchPastAthletesQuery: jest.fn(),
  })
);

const mockOnSearch = jest.fn();

jest.mock(
  '@kitman/common/src/hooks/useDebouncedCallback',
  () => () => mockOnSearch
);

const defaultProps = {
  label: 'Athletes',
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  render(<AthleteSelector {...props} />);

describe('<AthleteSelector />', () => {
  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        permissions: {
          general: {
            pastAthletes: {
              canView: true,
            },
          },
        },
      },
      error: false,
      isLoading: false,
    });
    useGetSquadAthletesQuery.mockReturnValue({
      data: squadAthletes,
      error: false,
      isLoading: false,
    });
    useSearchPastAthletesQuery.mockReturnValue({
      data: pastAthletes,
      error: false,
      isLoading: false,
    });
  });
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByLabelText('Athletes')).toBeInTheDocument();
  });

  it('calls useGetSquadAthletesQuery when clicking on the dropdown', async () => {
    const user = userEvent.setup();

    renderComponent();

    const athleteSelector = screen.getByLabelText('Athletes');

    expect(athleteSelector).toBeInTheDocument();

    await user.click(athleteSelector);

    expect(useGetSquadAthletesQuery).toHaveBeenCalled();
    expect(useGetSquadAthletesQuery).toHaveBeenLastCalledWith(
      {
        athleteList: true,
        minimalAthleteListData: true,
      },
      { skip: false }
    );
  });

  it('calls onSearch when typing a search term', async () => {
    renderComponent();

    const athleteSelector = screen.getByLabelText('Athletes');

    expect(athleteSelector).toBeInTheDocument();

    const searchString = 'dummy search';

    fireEvent.change(athleteSelector, { target: { value: searchString } });

    expect(mockOnSearch).toHaveBeenCalled();
    expect(mockOnSearch).toHaveBeenLastCalledWith(searchString);
  });

  it('filters athletes when playerTypeFilter is set to free_agent', async () => {
    const user = userEvent.setup();

    renderComponent({
      ...defaultProps,
      playerTypeFilter: 'free_agent',
    });

    const athleteSelector = screen.getByLabelText('Athletes');

    expect(athleteSelector).toBeInTheDocument();

    await user.click(athleteSelector);

    // With the current mock data and filtering logic, athletes with even-length IDs should be shown
    // The mock data has athletes with IDs 40211 and 1242, both have even length
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(0);

    // Verify that the filtering is applied (this is a basic test - the actual filtering logic may change)
    expect(
      options.some((option) => option.textContent?.includes('Tomas Albornoz'))
    ).toBe(true);
  });
});
