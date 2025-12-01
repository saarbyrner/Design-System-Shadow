import { Provider } from 'react-redux';
import { screen } from '@testing-library/react';

import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import athleteData from '@kitman/modules/src/AthleteAvailabilityList/utils/dummyAthleteData';

import AddNoteModal from '../AddNoteModal';

jest.mock('@kitman/modules/src/AddNoteModal/RelevantIssueList', () => ({
  RelevantIssueListTranslated: () => <div>RelevantIssueList</div>,
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('AddNoteModal', () => {
  const athletes = athleteData();
  let store;

  beforeEach(() => {
    window.featureFlags = {};

    store = storeFake({
      noteModal: {
        athlete: athletes[0],
        athleteInjuries: [],
        athleteIllnesses: [],
        noteData: {
          date: '',
          type: 'injury',
          note: '',
          restricted: false,
          psych_only: false,
          relevantIssueIds: [],
        },
        requestStatus: {
          status: null,
          message: null,
        },
        isModalOpen: true,
        noteMedicalTypeOptions: [
          { isGroupOption: true, name: 'Allergy' },
          { name: 'Allergy', key_name: 'Allergy' },
        ],
      },
      issueStaticData: {
        injuryOsicsPathologies: [],
        illnessOsicsPathologies: [],
        sides: [],
      },
      appStatus: {
        status: null,
        message: null,
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders the component', () => {
    renderWithUserEventSetup(
      <Provider store={store}>
        <AddNoteModal t={i18nextTranslateStub()} />
      </Provider>
    );
    expect(screen.getByText('Add Note')).toBeInTheDocument();
  });
});
