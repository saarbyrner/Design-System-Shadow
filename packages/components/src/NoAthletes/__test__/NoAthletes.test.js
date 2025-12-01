import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import NoAthletes from '..';

describe('<NoAthletes />', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  it('renders correctly when no Athletes passed', () => {
    render(<NoAthletes {...props} />);

    expect(
      screen.getByText(
        '#sport_specific__There_are_no_athletes_within_this_squad'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '#sport_specific__Do_you_want_to_add_an_Athlete_to_this_squad?'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/settings/athletes/new'
    );
  });
});
