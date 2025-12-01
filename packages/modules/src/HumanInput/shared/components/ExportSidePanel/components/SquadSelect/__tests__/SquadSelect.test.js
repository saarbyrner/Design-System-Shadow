import { render, screen } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data as squadAthletes } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { useGetSquadAthletesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import SquadSelect from '..';

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
  value: [],
  onUpdate: jest.fn(),
};

jest.mock('@kitman/common/src/redux/global/services/globalApi');

describe('<Select/>', () => {
  beforeEach(() => {
    useGetSquadAthletesQuery.mockReturnValue({
      data: squadAthletes,
      error: false,
      isLoading: false,
    });
  });

  it('renders with squads options', async () => {
    render(<SquadSelect {...props} />);

    expect(screen.getByLabelText('Squad/Roster')).toBeInTheDocument();

    selectEvent.openMenu(screen.getByLabelText('Squad/Roster'));

    expect(screen.getByText('Squads')).toBeInTheDocument();
    expect(screen.getByText('International Squad')).toBeInTheDocument();
    expect(screen.getByText('Some Squad')).toBeInTheDocument();
  });
});
