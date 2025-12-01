import { Provider } from 'react-redux';
import { screen } from '@testing-library/react';

import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import getInjuryData from '@kitman/modules/src/AthleteInjury/utils/InjuryData';
import bamicGrades from '@kitman/modules/src/AthleteInjury/resources/bamicGrades';

import IssueDetailsContainer from '../../containers/IssueDetails';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('Issue Details Container', () => {
  let store;

  beforeEach(() => {
    window.featureFlags = {};

    store = storeFake({
      ModalData: {
        athleteName: 'John Do',
        osicsPathologyOptions: [{ id: 'OSICS1', title: 'OSICS One' }],
        osicsClassificationOptions: [
          { id: 'CLASS1', title: 'Classification One' },
        ],
        bodyAreaOptions: [{ id: 'AREA1', title: 'Area One' }],
        sideOptions: [{ id: 'SIDE1', title: 'Side One' }],
        activityGroupOptions: [],
        gameOptions: [],
        trainingSessionOptions: [],
        positionGroupOptions: [],
        injuryStatusOptions: [],
        initialEventsOrder: [],
        issueTypeOptions: [],
        formType: 'INJURY',
        has_recurrence: true,
      },
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
      IssueData: getInjuryData(),
    });
    store.dispatch = jest.fn();
  });

  it('renders and sets props correctly', () => {
    renderWithUserEventSetup(
      <Provider store={store}>
        <IssueDetailsContainer t={i18nextTranslateStub()} />
      </Provider>
    );

    expect(screen.getByText('Pathology')).toBeInTheDocument();
    expect(screen.getByText('Classification')).toBeInTheDocument();
    expect(screen.getByText('Body Area')).toBeInTheDocument();
    expect(screen.getByText('Side')).toBeInTheDocument();
  });
});
