import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import App from '../App';
import graphDummyData from '../../../resources/graphDummyData';

const storeFake = (state) => ({
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: () => ({ ...state }),
});

describe('Injury Metric Contributing Factors App Container', () => {
  let store;

  const ownProps = {
    canManageIssues: true,
    canViewIssues: true,
    positionGroupsById: {
      25: 'Forward',
      26: 'Back',
      27: 'Other',
    },
    bodyAreasById: {
      1: 'Ankle',
      2: 'Buttock/pelvis',
      3: 'Chest',
    },
  };

  beforeEach(() => {
    store = storeFake({
      contributingFactors: {
        graphData: graphDummyData,
      },
    });
  });

  const renderComponent = () => {
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <App {...ownProps} />
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders', () => {
    renderComponent();
    const expectedTitle =
      graphDummyData.dashboard_header.injury_risk_variable_name;
    expect(
      screen.getByRole('heading', { name: expectedTitle })
    ).toBeInTheDocument();
  });
});
