import AthletesList from '@kitman/modules/src/Assessments/components/listView/AthletesList';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';

jest.mock('@kitman/common/src/hooks/useLocationSearch');

describe('AthletesList component', () => {
  const props = {
    athletes: [
      {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        fullname: 'John Doe',
        avatar_url: 'http://URL/athlete1',
        position_group: 'Forward',
      },
      {
        id: 2,
        firstname: 'Jane',
        lastname: 'Roe',
        fullname: 'Jane Roe',
        avatar_url: 'http://URL/athlete2',
        position_group: 'Forward',
      },
    ],
    onSelectAthleteId: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    useLocationSearch.mockReturnValue(new URLSearchParams());
  });

  it('renders a list of athletes', () => {
    render(<AthletesList {...props} />);
    const athleteList = screen.getByRole('list');
    expect(athleteList.childElementCount).toEqual(2);
    const athlete1 = athleteList.childNodes[0];
    expect(within(athlete1).getByRole('img')).toHaveAttribute(
      'src',
      'http://URL/athlete1'
    );
    expect(within(athlete1).getByText('John Doe')).toBeInTheDocument();
    expect(within(athlete1).getByText('Forward')).toBeInTheDocument();

    const athlete2 = athleteList.childNodes[1];
    expect(within(athlete2).getByRole('img')).toHaveAttribute(
      'src',
      'http://URL/athlete2'
    );
    expect(within(athlete2).getByText('Jane Roe')).toBeInTheDocument();
    expect(within(athlete2).getByText('Forward')).toBeInTheDocument();

    // first athlete should be selected
    expect(athlete1).toHaveClass('assessmentsAthletes__athlete--selected');
  });

  it('selects the athlete assessments when clicking an athlete', async () => {
    const user = userEvent.setup();
    render(<AthletesList {...props} />);
    const [, athlete2] = screen.getByRole('list').childNodes;
    await user.click(athlete2);
    expect(props.onSelectAthleteId).toHaveBeenCalledWith(2);
  });

  it('renders an athlete selected if athlete id sent as search parameter', () => {
    useLocationSearch.mockReturnValue(new URLSearchParams({ athleteId: '2' }));
    render(<AthletesList {...props} />);
    const [, athlete2] = screen.getByRole('list').childNodes;
    // second athlete should be selected
    expect(athlete2).toHaveClass('assessmentsAthletes__athlete--selected');
  });
});
