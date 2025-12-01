import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { athletesMocked } from '../../utils/mocks';
import AthletesList from '../AthletesList';

describe('<AthletesList />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    athletes: athletesMocked,
    t: i18nT,
  };

  it('renders the AthleteCards with the correct content', () => {
    render(<AthletesList {...props} />);
    const athleteData = props.athletes.map((a) => {
      //  Availability substitutions in component switch statement
      let availability;
      switch (a.availability) {
        case 'available':
          availability = 'Available';
          break;
        case 'unavailable':
          availability = 'Unavailable';
          break;
        case 'injured':
          availability = 'Available (Injured/Ill)';
          break;
        case 'returning':
          availability = 'Available (Returning from injury/illness)';
          break;
        default:
          availability = a.availability;
          break;
      }
      return { name: a.fullname, availability };
    });

    const athleteList = screen.getByTestId('AthletesList');
    const athleteCards = athleteList.querySelectorAll('.athleteCard');
    expect(athleteList).toBeInTheDocument();
    expect(athleteCards).toHaveLength(5);

    athleteCards.forEach((_, i) => {
      //  Link
      expect(athleteCards[i].querySelector('a')).toHaveAttribute(
        'href',
        `/athletes/${i + 1}`
      );
      //  Image
      expect(athleteCards[i].querySelector('img')).toHaveAttribute(
        'src',
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png'
      );
      //  Image alt text = athlete name
      expect(athleteCards[i].querySelector('img')).toHaveAttribute(
        'alt',
        athleteData[i].name
      );
      //  Athlete name displayed
      expect(
        athleteCards[i].querySelector('.athleteCard__title')
      ).toHaveTextContent(athleteData[i].name);
      //  Availability status
      expect(athleteCards[i].querySelector('p')).toHaveTextContent(
        athleteData[i].availability
      );
    });
  });
});
