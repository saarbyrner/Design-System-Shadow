import { screen, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import PrintView from '..';
import { mockedIssueContextValue } from '../../../../../../shared/contexts/IssueContext/utils/mocks';

describe('<PrintView />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const mockStore = storeFake({
    addWorkersCompSidePanel: {
      claimInformation: {
        sideName: 'Left',
        bodyAreaName: 'Head',
      },
    },
  });

  it('should render WorkersComp as expected', () => {
    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <PrintView
            issue={mockedIssueContextValue}
            t={i18nextTranslateStub()}
          />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByTestId('WorkersComp|Printable')).toBeInTheDocument();
  });
});
