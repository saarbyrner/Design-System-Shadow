import { Provider } from 'react-redux';
import { screen } from '@testing-library/react';

import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import getInjuryData from '@kitman/modules/src/AthleteInjury/utils/InjuryData';
import { getBlankNote } from '../../utils';

import NotesContainer from '../../containers/Notes';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('Notes Container', () => {
  let store;

  beforeEach(() => {
    window.featureFlags = {};

    store = storeFake({
      IssueData: getInjuryData(),
      ModalData: {
        formType: 'INJURY',
      },
      CurrentNote: getBlankNote(),
    });
    store.dispatch = jest.fn();
  });

  it('renders and sets props correctly', () => {
    renderWithUserEventSetup(
      <Provider store={store}>
        <NotesContainer t={i18nextTranslateStub()} />
      </Provider>
    );

    expect(screen.getByText('Injury Note')).toBeInTheDocument();
    expect(screen.getAllByTestId('note-item').length).toBe(
      store.getState().IssueData.notes.length
    );
  });
});
