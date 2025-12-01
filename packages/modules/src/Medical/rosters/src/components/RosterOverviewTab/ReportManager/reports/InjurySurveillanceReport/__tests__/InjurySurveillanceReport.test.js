import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { LocalizationProvider } from '@kitman/playbook/providers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {
  storeFake,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import { useGetPermittedSquadsQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { useFetchShortRulesetsQuery } from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import InjurySurveillanceReport from '..';

setI18n(i18n);

window.getFlag = jest.fn();

jest.mock(
  '@kitman/services/src/services/medical/exportInjurySurveillanceReport'
);

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical');
jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);

jest.mock('@kitman/services/src/services/medical', () => ({
  ...jest.requireActual('@kitman/services/src/services/medical'),
  useGetPermittedSquadsQuery: jest.fn(),
  exportInjurySurveillanceReport: jest.fn(),
}));

const store = storeFake({
  medicalApi: {
    useGetPermittedSquadsQuery: jest.fn(),
    exportInjurySurveillanceReport: jest.fn(),
  },
  conditionalFieldsApi: {
    useFetchShortRulesetsQuery: jest.fn(),
  },
});

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  render(
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Provider store={store}>
        <InjurySurveillanceReport {...props} />
      </Provider>
    </LocalizationProvider>
  );

describe('Logic Builder - Medical Report', () => {
  beforeEach(() => {
    useGetPermittedSquadsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'First Squad' },
        { id: 2, name: 'Second Squad' },
      ],
      isLoading: false,
      isSuccess: true,
    });
    useFetchShortRulesetsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'First Ruleset' },
        { id: 2, name: 'Second Ruleset' },
      ],
      isLoading: false,
      isSuccess: true,
    });
  });
  it('renders correctly', async () => {
    renderComponent();

    expect(
      screen.getByText('Logic Builder - Medical Report')
    ).toBeInTheDocument();
  });

  it('does not display sidepanel when isOpen is false', async () => {
    renderComponent({ ...defaultProps, isOpen: false });

    expect(
      screen.queryByText('Logic Builder - Medical Report')
    ).not.toBeInTheDocument();
  });

  it('displays correct options in sidepanel', async () => {
    renderComponent();

    expect(screen.getByLabelText('Squads')).toBeInTheDocument();
    expect(screen.getByLabelText('Rulesets')).toBeInTheDocument();
    expect(screen.getByLabelText('Date range')).toBeInTheDocument();
    expect(screen.queryByText('Include Past Players')).not.toBeInTheDocument();
    expect(screen.getByText('Anonymized report')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('displays include past players checkbox when flag is enabled', async () => {
    window.getFlag.mockImplementation((flag) => {
      if (flag === 'pm-logic-builder-export-past-players') {
        return true;
      }
      return window.getFlag(flag);
    });
    renderComponent();

    expect(screen.getByLabelText('Squads')).toBeInTheDocument();
    expect(screen.getByLabelText('Rulesets')).toBeInTheDocument();
    expect(screen.getByLabelText('Date range')).toBeInTheDocument();
    expect(screen.getByText('Include Past Players')).toBeInTheDocument();
    expect(screen.getByText('Anonymized report')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });
});
