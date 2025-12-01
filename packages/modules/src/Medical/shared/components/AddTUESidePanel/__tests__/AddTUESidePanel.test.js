import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEnrichedAthletesIssues from '@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues';
import AddTUESidePanel from '../index';

jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/modules/src/Medical/shared/hooks/useEnrichedAthletesIssues');

const mockedUseEnrichedAthletesIssues = useEnrichedAthletesIssues;

describe('<AddTUESidePanel />', () => {
  const props = {
    isOpen: true,
    squadAthletes: [
      {
        label: 'Squad A Name',
        options: [
          {
            value: 1,
            label: 'Athlete 1 Name',
          },
          {
            value: 2,
            label: 'Athlete 2 Name',
          },
        ],
      },
    ],
    onClose: jest.fn(),
    onFileUploadStart: jest.fn(),
    onFileUploadSuccess: jest.fn(),
    onFileUploadFailure: jest.fn(),
    initialDataRequestStatus: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    medicalApi: {},
  });

  it('calls fetchAthleteIssues with the correct parameters when the athlete is changed', async () => {
    const fetchAthleteIssues = jest.fn().mockResolvedValue([]);
    mockedUseEnrichedAthletesIssues.mockReturnValue({
      enrichedAthleteIssues: [],
      fetchAthleteIssues,
    });

    render(
      <Provider store={store}>
        <AddTUESidePanel {...props} isAthleteSelectable />
      </Provider>
    );

    const athleteSelector = screen.getByLabelText('Athlete');
    await selectEvent.select(athleteSelector, 'Athlete 1 Name');

    expect(fetchAthleteIssues).toHaveBeenCalledWith({
      selectedAthleteId: 1,
      useOccurrenceIdValue: false,
      includeDetailedIssue: false,
      issueFilter: null,
      includeIssue: true,
      includeGrouped: true,
    });
  });
});
