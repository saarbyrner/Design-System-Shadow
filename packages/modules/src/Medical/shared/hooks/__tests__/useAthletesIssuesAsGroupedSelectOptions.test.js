import moment from 'moment-timezone';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import { useGetAthleteIssuesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import useAthletesIssuesAsGroupedSelectOptions from '../useAthletesIssuesAsGroupedSelectOptions';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalHistory: {},
  medicalApi: {
    useGetAthleteIssuesQuery: jest.fn(),
  },
});

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  useGetAthleteIssuesQuery: jest.fn(),
}));

describe('useAthletesIssuesAsGroupedSelectOptions', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    useGetAthleteIssuesQuery.mockReturnValue({
      data: {
        ...data.groupedIssues,
        recurrence_outside_system: false,
        continuation_outside_system: false,
      },
      error: false,
      isLoading: false,
    });
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  const props = {
    athleteId: 1,
  };

  it('returns the expected select options', async () => {
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = await renderHook(
      () => useAthletesIssuesAsGroupedSelectOptions(props),
      { wrapper }
    );

    const options = result.current.athleteIssuesOptions;
    expect(options).toHaveLength(2);

    expect(options[0].label).toEqual('Open injury/ illness');
    const openOptions = options[0].options;
    expect(openOptions).toHaveLength(5);
    const expectedOpen = [
      { value: 'Injury_1', label: 'Nov 11, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_2', label: 'Aug 6, 2020 - Asthma and/or allergy' },
      {
        value: 'Injury_3',
        label:
          'May 23, 2020 - Fracture tibia and fibula at ankle joint - [Right]',
      },
      { value: 'Injury_11', label: 'May 23, 2020 - Preliminary' },
      {
        value: 'Injury_400',
        label: 'May 23, 2020 - Acute Concussion [N/A]',
      },
    ];
    expect(openOptions).toEqual(expectedOpen);

    expect(options[1].label).toEqual('Prior injury/illness');
    const priorOptions = options[1].options;
    expect(priorOptions).toHaveLength(3);

    const expectedPrior = [
      {
        value: 'Injury_1',
        label:
          'Oct 27, 2020 - Fracture tibia and fibula at ankle joint - [Left]',
      },
      { value: 'Injury_2', label: 'Sep 13, 2020 - Ankle Fracture (Left)' },
      { value: 'Illness_3', label: 'Feb 4, 2020 - Emotional stress' },
    ];
    expect(priorOptions).toEqual(expectedPrior);
  });

  describe('[feature-flag] chronic-injury-illness is on', () => {
    beforeEach(() => {
      window.featureFlags['chronic-injury-illness'] = true;
    });

    afterEach(() => {
      window.featureFlags['chronic-injury-illness'] = false;
    });

    it('returns the expected chronic options', async () => {
      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = await renderHook(
        () => useAthletesIssuesAsGroupedSelectOptions(props),
        { wrapper }
      );

      const options = result.current.athleteIssuesOptions;
      expect(options).toHaveLength(3);
      expect(options[2].label).toEqual('Chronic Issues');
      const chronicOptions = options[2].options;
      expect(chronicOptions).toHaveLength(7);
      const expectedChronic = {
        label: 'Unique Open Chronic Title',
        value: 'ChronicInjury_1',
      };
      expect(chronicOptions[0]).toEqual(expectedChronic);
    });
  });

  describe('medical-fetch-shared-issues', () => {
    beforeEach(() => {
      window.featureFlags['medical-fetch-shared-issues'] = true;
    });
    afterEach(() => {
      window.featureFlags['medical-fetch-shared-issues'] = false;
    });

    it('adds limit_to_current_organisation = false when FF is ON', async () => {
      const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
      );

      await renderHook(() => useAthletesIssuesAsGroupedSelectOptions(props), {
        wrapper,
      });

      expect(useGetAthleteIssuesQuery).toHaveBeenCalledWith(
        {
          athleteId: 1,
          grouped: true,
          limitToCurrOrg: false,
        },
        { skip: false }
      );
    });
  });
});
