import * as reduxHooks from 'react-redux';

import { screen, render } from '@testing-library/react';
import { MOCK_REGISTRATION_SQUAD } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import SquadHeader from '..';

jest.mock('@kitman/common/src/hooks/useLocationSearch');

const props = {
  isLoading: false,
  squad: MOCK_REGISTRATION_SQUAD,
  t: i18nextTranslateStub(),
};

describe('<SquadHeader />', () => {
  beforeEach(() => {
    jest.spyOn(reduxHooks, 'useDispatch').mockReturnValue(jest.fn());
    jest.spyOn(reduxHooks, 'useSelector').mockImplementation(() => MODES.VIEW);

    jest.clearAllMocks();
    useLocationSearch.mockReturnValue(new URLSearchParams());
  });

  it('renders correctly without URL parameters', () => {
    render(<SquadHeader {...props} />);
    expect(screen.getByRole('img', { name: 'LA Galaxy' })).toHaveAttribute(
      'src',
      'https://kitman-staging.imgix.net/kitman_logo_full_bleed.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=96&h=96'
    );
    expect(
      screen.queryByRole('button', { name: 'Back' })
    ).not.toBeInTheDocument();
  });

  it('renders back link when URL parameters are present', () => {
    useLocationSearch.mockReturnValue(new URLSearchParams({ id: '1' }));
    render(<SquadHeader {...props} />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  it('displays squad statistics correctly', () => {
    render(<SquadHeader {...props} />);
    expect(screen.getByText('Club')).toBeInTheDocument();
    expect(screen.getByText('LA Galaxy')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Guadeloupe')).toBeInTheDocument();
    expect(screen.getByText('Staff')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Players')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
