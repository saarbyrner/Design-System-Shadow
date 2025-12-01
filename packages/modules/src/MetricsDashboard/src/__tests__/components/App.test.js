import { render } from '@testing-library/react';
import {
  buildAthletes,
  buildStatuses,
} from '@kitman/common/src/utils/test_utils';

jest.mock('react-i18next', () => ({
  withNamespaces: () => (Comp) => (p) => <Comp t={(k) => k} {...p} />,
}));
jest.mock('../../containers/Header', () => () => <div data-testid="header" />);
jest.mock('../../containers/ModalRoot', () => () => (
  <div data-testid="modal-root" />
));
jest.mock('../../components/AthleteStatusTable', () => () => (
  <div data-testid="athlete-status-table" />
));
jest.mock('@kitman/components', () => ({
  Dialogue: () => <div data-testid="dialogue" />,
  NoAthletes: () => <div data-testid="no-athletes" />,
}));
// eslint-disable-next-line import/first
import App from '../../components/App';

describe('App component', () => {
  const baseProps = () => ({
    athletes: buildAthletes(5),
    noSearchResults: false,
    statuses: buildStatuses(3),
    hideConfirmation: jest.fn(),
    t: (k) => k,
    confirmationMessage: { show: false, message: '', action: () => {} },
    dispatch: jest.fn(),
    isFilterShown: false,
  });

  it('renders the component', () => {
    const { container } = render(<App {...baseProps()} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders dashboard content when athletes present', () => {
    const { getByTestId, queryByTestId } = render(<App {...baseProps()} />);
    expect(getByTestId('header')).toBeInTheDocument();
    expect(getByTestId('dialogue')).toBeInTheDocument();
    expect(getByTestId('modal-root')).toBeInTheDocument();
    expect(queryByTestId('no-athletes')).not.toBeInTheDocument();
  });

  it('renders NoAthletes when no athletes', () => {
    const props = baseProps();
    props.athletes = [];
    const { getByTestId, queryByTestId } = render(<App {...props} />);
    expect(getByTestId('no-athletes')).toBeInTheDocument();
    expect(queryByTestId('header')).not.toBeInTheDocument();
  });
});
