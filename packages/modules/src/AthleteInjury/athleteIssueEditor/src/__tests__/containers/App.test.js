import { Provider } from 'react-redux';
import { screen } from '@testing-library/react';

import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import getInjuryData from '@kitman/modules/src/AthleteInjury/utils/InjuryData';
import bamicGrades from '@kitman/modules/src/AthleteInjury/resources/bamicGrades';

import { getBlankNote } from '../../utils';
import AppContainer from '../../containers/App';

jest.mock('../../containers/AppStatus', () => () => <div>AppStatus</div>);
jest.mock('../../containers/IssueDetails', () => () => <div>IssueDetails</div>);
jest.mock('../../containers/InjuryOccurrence', () => () => (
  <div>InjuryOccurrence</div>
));
jest.mock('../../containers/AthleteAvailabilityHistory', () => () => (
  <div>AthleteAvailabilityHistory</div>
));
jest.mock('../../containers/Notes', () => () => <div>Notes</div>);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('App Container', () => {
  let store;

  beforeEach(() => {
    window.featureFlags = {};

    store = storeFake({
      ModalData: {
        athleteName: 'John Do',
        osicsPathologyOptions: [],
        osicsClassificationOptions: [],
        bodyAreaOptions: [],
        sideOptions: [],
        activityGroupOptions: [],
        gameOptions: [],
        trainingSessionOptions: [],
        positionGroupOptions: [],
        injuryStatusOptions: [],
        priorInjuryOptions: [],
        priorIllnessOptions: [],
        issueTypeOptions: [],
        formMode: 'EDIT',
        formType: 'INJURY',
        has_recurrence: true,
      },
      IssueData: {
        ...getInjuryData(),
        has_recurrence: true,
        is_first_occurrence: false,
      },
      CurrentNote: getBlankNote(),
      staticData: {
        bamicGrades,
        injuryOsics: [
          { id: 'AAAX', bamic: true },
          { id: 'AASX', bamic: true },
          { id: 'AAXX', bamic: false },
          { id: 'ACLX', bamic: null },
          { id: 'ACPX', bamic: true },
          { id: 'ACTX', bamic: true },
          { id: 'ACXX', bamic: null },
        ],
      },
      AppStatus: {
        status: 'success',
        message: 'Status message',
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders and sets props correctly', () => {
    renderWithUserEventSetup(
      <Provider store={store}>
        <AppContainer t={i18nextTranslateStub()} />
      </Provider>
    );

    expect(screen.getByText('John Do')).toBeInTheDocument();
    expect(screen.getByText('Edit Issue (Recurrence)')).toBeInTheDocument();
  });
});
