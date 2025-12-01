import { VirtuosoMockContext } from 'react-virtuoso';
import selectEvent from 'react-select-event';
import { screen, waitFor } from '@testing-library/react';

import * as OrganisationContext from '@kitman/common/src/contexts/OrganisationContext';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetAllSquadAthletesQuery } from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import { data as squadAthletes } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { defaultBenchmarkReportParams } from '@kitman/modules/src/analysis/BenchmarkReport/components';
import { DEFAULT_BIO_BAND_RANGE } from '@kitman/modules/src/analysis/BenchmarkReport/consts';
import { render } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import Filters from '..';

jest.mock('@kitman/modules/src/analysis/BenchmarkReport/redux/service', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/analysis/BenchmarkReport/redux/service'
  ),
  useGetAllSquadAthletesQuery: jest.fn(),
}));
jest.mock('@kitman/common/src/hooks/useEventTracking');

const props = {
  t: i18nextTranslateStub(),
  updateBenchmarkReportParams: jest.fn(),
};

describe('<BenchmarkReport /> — <Filters />', () => {
  beforeAll(() => {
    useGetAllSquadAthletesQuery.mockReturnValue({
      data: squadAthletes,
      isFetching: false,
    });
  });

  const trackEventMock = jest.fn();

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  const getGenerateResultsButton = () =>
    screen.getByRole('button', {
      name: 'Generate results',
    });

  const clickGenerateResultsButton = async (user) => {
    await user.click(getGenerateResultsButton());
  };

  const clearDefaultOptions = async (user, isComparison = false) => {
    // Deselect filters with default values
    const seasonsFilter = screen.getAllByLabelText('Season(s)');
    selectEvent.openMenu(seasonsFilter[0]);
    await user.click(screen.getAllByText('Clear')[0]);

    if (isComparison) {
      selectEvent.openMenu(seasonsFilter[1]);
      await user.click(screen.getAllByText('Clear')[0]);
    }

    const testingWindowsFilter = screen.getAllByLabelText('Testing window(s)');
    selectEvent.openMenu(testingWindowsFilter[0]);
    await user.click(screen.getAllByText('Clear')[0]);

    if (isComparison) {
      selectEvent.openMenu(testingWindowsFilter[1]);
      await user.click(screen.getAllByText('Clear')[0]);
    }
  };

  it('renders the filter headings', () => {
    render(<Filters {...props} />);

    const firstHeading = screen.getByText('Select tests and time range');
    const secondHeading = screen.getByText('Select group demographics');

    expect(firstHeading).toBeVisible();
    expect(secondHeading).toBeVisible();
  });

  it('renders the <BenchmarkTests />', () => {
    render(<Filters {...props} />);

    const benchmarkTests = screen.getByLabelText('Benchmark test(s)');

    expect(benchmarkTests).toBeInTheDocument();
  });

  it('renders the <Seasons />', () => {
    render(<Filters {...props} />);

    const seasons = screen.getAllByLabelText('Season(s)');

    expect(seasons.length).toBe(1);
    expect(seasons[0]).toBeInTheDocument();
  });

  it('renders the <TestingWindows />', () => {
    render(<Filters {...props} />);

    const testingWindows = screen.getAllByLabelText('Testing window(s)');

    expect(testingWindows.length).toBe(1);
    expect(testingWindows[0]).toBeInTheDocument();
  });

  it('renders the <AgeGroups />', () => {
    render(<Filters {...props} />);

    const ageGroups = screen.getByLabelText('Age group(s)');

    expect(ageGroups).toBeInTheDocument();
  });

  it('doesn’t render the <BioBand />', () => {
    render(<Filters {...props} />);

    const bioBand = screen.queryByLabelText('Bio-band');

    expect(bioBand).not.toBeInTheDocument();
  });

  it('doesn’t render the <MaturationStatuses />', () => {
    render(<Filters {...props} />);

    const maturationStatuses = screen.queryByLabelText('Maturation status');

    expect(maturationStatuses).not.toBeInTheDocument();
  });

  it('renders the <Positions />', () => {
    render(<Filters {...props} />);

    const maturationStatuses = screen.getByLabelText('Position(s)');

    expect(maturationStatuses).toBeInTheDocument();
  });

  it('renders the ‘Clear All’ button', () => {
    render(<Filters {...props} />);

    const clearAllButton = screen.getByRole('button', { name: 'Clear All' });

    expect(clearAllButton).toBeInTheDocument();
  });

  it('calls `updateBenchmarkReportParams` when ‘Clear All’ button is clicked', async () => {
    const { user } = render(<Filters {...props} />);

    const clearAllButton = screen.getByRole('button', { name: 'Clear All' });

    await user.click(clearAllButton);

    expect(props.updateBenchmarkReportParams).toHaveBeenCalledTimes(1);
    expect(props.updateBenchmarkReportParams).toHaveBeenCalledWith(
      defaultBenchmarkReportParams
    );
  });

  it('renders the ‘Generate Results’ button', () => {
    render(<Filters {...props} />);

    expect(getGenerateResultsButton()).toBeInTheDocument();
  });

  it('calls `updateBenchmarkReportParams` when ‘Generate Results’ button is clicked if all the fields are valid', async () => {
    const { user } = render(<Filters {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });

    await clickGenerateResultsButton(user);
    expect(getGenerateResultsButton()).toBeDisabled();

    expect(props.updateBenchmarkReportParams).not.toHaveBeenCalled();

    // Select required fields
    const benchmarkTestFilter = screen.getByLabelText('Benchmark test(s)');
    selectEvent.openMenu(benchmarkTestFilter);
    await selectEvent.select(benchmarkTestFilter, 'metric_1');

    const seasonsFilter = screen.getByLabelText('Season(s)');
    selectEvent.openMenu(seasonsFilter);
    await selectEvent.select(seasonsFilter, '2019/2020');

    const testingWindowsFilter = screen.getByLabelText('Testing window(s)');
    selectEvent.openMenu(testingWindowsFilter);
    await waitFor(() => {
      expect(screen.getByText('Test Window 1')).toBeInTheDocument();
    });
    await selectEvent.select(testingWindowsFilter, 'Test Window 1');

    const ageGroupsFilter = screen.getByLabelText('Age group(s)');
    selectEvent.openMenu(ageGroupsFilter);
    await waitFor(() => {
      expect(screen.getByText('U10')).toBeInTheDocument();
    });
    await selectEvent.select(ageGroupsFilter, 'U10');

    await waitFor(() => {
      expect(getGenerateResultsButton()).toBeEnabled();
    });

    await clickGenerateResultsButton(user);

    const benchmarkReportParams = {
      training_variable_ids: [1],
      seasons: [2023, 2019],
      testing_window_ids: [5, 6],
      age_group_ids: [2],
      bio_band_range: DEFAULT_BIO_BAND_RANGE,
      maturation_status_ids: [],
      position_ids: [],
      national_results: true,
      club_results: false,
      compare_to: {
        athlete_ids: [],
        seasons: [],
        testing_window_ids: [],
      },
    };
    expect(props.updateBenchmarkReportParams).toHaveBeenCalledTimes(1);
    expect(props.updateBenchmarkReportParams).toHaveBeenCalledWith(
      benchmarkReportParams
    );
    expect(trackEventMock).toHaveBeenCalledWith(
      'Analysis — League Benchmark Reporting — Generate results',
      {
        ...benchmarkReportParams,
        AgeGroups: ['U10'],
        ComparedAgainst: {
          NumberOfAthletes: 0,
          Seasons: [],
          TestingWindows: ['Test Window 2', 'Test Window 3'],
        },
        IsCat1: false,
        MaturationStatuses: [],
        Positions: [],
        Seasons: ['2023/2024', '2019/2020'],
        TestingWindows: ['Test Window 2', 'Test Window 3'],
        TrainingVariables: ['metric_1'],
      }
    );
  });

  describe('when clubs are a CAT_1 club', () => {
    // CAT 1 clubs have permission to see national results and club results
    // as well as the Compare To options
    // So we render the filter options
    beforeEach(() => {
      jest.spyOn(OrganisationContext, 'useOrganisation').mockReturnValue({
        organisation: {
          benchmark_reporting: true,
        },
      });
    });

    it('renders <Clubs />', () => {
      render(<Filters {...props} />);

      const national = screen.getByText('National');
      const club = screen.getByText('My club');
      const compareToTitle = screen.queryByText(
        'Compare against my individual athletes'
      );
      const athletesLabel = screen.queryByText('Athlete(s)');
      const seasonsLabels = screen.getAllByLabelText('Season(s)');
      const testingWindowsLabels =
        screen.getAllByLabelText('Testing window(s)');
      const compareToClearButton = screen.queryByRole('button', {
        name: 'Clear',
      });

      expect(national).toBeInTheDocument();
      expect(club).toBeInTheDocument();
      expect(compareToTitle).toBeInTheDocument();
      expect(athletesLabel).toBeInTheDocument();
      expect(seasonsLabels.length).toBe(2);
      expect(testingWindowsLabels.length).toBe(2);
      expect(compareToClearButton).toBeInTheDocument();
    });
  });

  describe('when clubs are not a CAT_1 club', () => {
    beforeEach(() => {
      jest.spyOn(OrganisationContext, 'useOrganisation').mockReturnValue({
        organisation: {
          benchmark_reporting: false,
        },
      });
    });

    it('does not render <Clubs >', () => {
      render(<Filters {...props} />);

      const national = screen.queryByText('National');
      const club = screen.queryByText('My club');
      const compareToTitle = screen.queryByText(
        'Compare against my individual athletes'
      );
      const athletesLabel = screen.queryByText('Athlete(s)');
      const seasonsLabels = screen.getAllByLabelText('Season(s)');
      const testingWindowsLabels =
        screen.getAllByLabelText('Testing window(s)');
      const compareToClearButton = screen.queryByRole('button', {
        name: 'Clear',
      });

      expect(national).not.toBeInTheDocument();
      expect(club).not.toBeInTheDocument();
      expect(compareToTitle).not.toBeInTheDocument();
      expect(athletesLabel).not.toBeInTheDocument();
      expect(seasonsLabels.length).toBe(1);
      expect(testingWindowsLabels.length).toBe(1);
      expect(compareToClearButton).not.toBeInTheDocument();
    });
  });

  describe('filter validation', () => {
    describe('generic validations', () => {
      it('shows validation errors on required fields and disables button', async () => {
        const { user } = render(<Filters {...props} />);

        await clearDefaultOptions(user);

        await clickGenerateResultsButton(user);

        expect(
          screen.getByText('At least 1 test is required')
        ).toBeInTheDocument();
        expect(
          screen.getByText('At least 1 season is required')
        ).toBeInTheDocument();
        expect(
          screen.getByText('At least 1 testing window is required')
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            'An age is required if the "Any" bio-band option is selected'
          )
        ).toBeInTheDocument();
        expect(getGenerateResultsButton()).toBeDisabled();
      });
    });

    describe('CAT_1 club specific validations', () => {
      beforeEach(() => {
        jest.spyOn(OrganisationContext, 'useOrganisation').mockReturnValue({
          organisation: {
            benchmark_reporting: true,
          },
        });
      });

      it('shows no errors if an individual athlete is NOT selected', async () => {
        const { user } = render(<Filters {...props} />);

        await clearDefaultOptions(user);

        await clickGenerateResultsButton(user);

        expect(
          screen.queryByText('At least 1 season is required')
        ).toBeInTheDocument(); // would be 2 if compare to filter validations is triggered
        expect(
          screen.queryByText('At least 1 testing window is required')
        ).toBeInTheDocument(); // would be 2 if compare to filter validations is triggered
      });

      it('shows errors if an individual athlete is selected', async () => {
        const { user } = render(<Filters {...props} />, {
          wrapper: ({ children }) => (
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              {children}
            </VirtuosoMockContext.Provider>
          ),
        });

        await clearDefaultOptions(user, true);

        // Select an athlete
        selectEvent.openMenu(screen.getByLabelText('Athlete(s)'));
        await selectEvent.select(
          screen.getByLabelText('Athlete(s)'),
          'Some Squad'
        );
        await selectEvent.select(
          screen.getByLabelText('Athlete(s)'),
          'Athlete Three'
        );

        await clickGenerateResultsButton(user);

        expect(
          screen.queryByText('At least 1 season is required')
        ).toBeInTheDocument();
        expect(
          screen.queryByText('At least 1 testing window is required')
        ).toBeInTheDocument();
      });

      it('shows error if no club result option is selected', async () => {
        const { user } = render(<Filters {...props} />);

        await user.click(screen.getAllByRole('checkbox')[0]);
        await clickGenerateResultsButton(user);

        expect(
          screen.getByText(
            'At least 1 result type is required if no individual athletes are selected'
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('when ‘growth-and-maturation-area’ feature flag is on', () => {
    beforeEach(() => {
      window.setFlag('growth-and-maturation-area', true);
    });

    it('renders the <BioBand />', () => {
      render(<Filters {...props} />);

      const bioBand = screen.getByText('Bio-band');

      expect(bioBand).toBeInTheDocument();
    });

    it('renders the <MaturationStatuses />', () => {
      render(<Filters {...props} />);

      const maturationStatuses = screen.getByLabelText('Maturation status');

      expect(maturationStatuses).toBeInTheDocument();
    });

    afterAll(() => {
      window.setFlag('growth-and-maturation-area', false);
    });
  });
});
