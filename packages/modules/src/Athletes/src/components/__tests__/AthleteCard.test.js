import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AthleteCard from '../AthleteCard';

describe('<AthleteCard />', () => {
  const props = {
    id: 1,
    avatarUrl: 'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
    title: 'John Doe',
    t: i18nextTranslateStub(),
  };

  it('renders the component', () => {
    render(<AthleteCard {...props} />);
    const athleteCard = screen.getByTestId('AthleteCard');
    expect(athleteCard).toBeInTheDocument();
    expect(athleteCard.querySelector('.textLink')).toHaveTextContent(
      'John Doe'
    );
  });

  it('displays the correct label when the availability is available', () => {
    render(<AthleteCard {...props} availability="available" />);
    const athleteCard = screen.getByTestId('AthleteCard');
    expect(athleteCard.querySelector('.athleteCard__label')).toHaveTextContent(
      'Available'
    );
  });

  it('does not display the corner when the availability is available', () => {
    render(<AthleteCard {...props} availability="available" />);
    const athleteCard = screen.getByTestId('AthleteCard');
    expect(
      athleteCard.querySelector('.athleteCard__corner')
    ).not.toBeInTheDocument();
  });

  it('displays the correct label when the availability is returning', () => {
    render(<AthleteCard {...props} availability="returning" />);
    const athleteCard = screen.getByTestId('AthleteCard');
    expect(athleteCard.querySelector('.athleteCard__label')).toHaveTextContent(
      'Available (Returning from injury/illness)'
    );
  });

  it('displays the corner with the correct style when the availability is returning', () => {
    render(<AthleteCard {...props} availability="returning" />);
    const athleteCardCorner = screen
      .getByTestId('AthleteCard')
      .querySelector('span.athleteCard__corner');

    expect(athleteCardCorner).toBeInTheDocument();
    expect(athleteCardCorner).toHaveClass('athleteCard__corner--returning');
  });

  it('displays the correct label when the availability is injured', () => {
    render(<AthleteCard {...props} availability="injured" />);
    const athleteCard = screen.getByTestId('AthleteCard');
    expect(athleteCard.querySelector('.athleteCard__label')).toHaveTextContent(
      'Available (Injured/Ill)'
    );
  });

  it('displays the corner with the correct style when the availability is injured', () => {
    render(<AthleteCard {...props} availability="injured" />);
    const athleteCardCorner = screen
      .getByTestId('AthleteCard')
      .querySelector('span.athleteCard__corner');

    expect(athleteCardCorner).toBeInTheDocument();
    expect(athleteCardCorner).toHaveClass('athleteCard__corner--injured');
  });

  it('displays the correct label when the availability is unavailable', () => {
    render(<AthleteCard {...props} availability="unavailable" />);
    const athleteCard = screen.getByTestId('AthleteCard');
    expect(athleteCard.querySelector('.athleteCard__label')).toHaveTextContent(
      'Unavailable'
    );
  });

  it('displays the corner with the correct style when the availability is unavailable', () => {
    render(<AthleteCard {...props} availability="unavailable" />);
    const athleteCardCorner = screen
      .getByTestId('AthleteCard')
      .querySelector('span.athleteCard__corner');

    expect(athleteCardCorner).toBeInTheDocument();
    expect(athleteCardCorner).toHaveClass('athleteCard__corner--unavailable');
  });
});
