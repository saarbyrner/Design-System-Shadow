import { render, screen } from '@testing-library/react';
import {
  buildAthletes,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import Sidebar from '../../components/Sidebar';

jest.mock('../../containers/AthleteInfo', () => ({
  __esModule: true,
  default: ({ athlete }) => <div data-testid="athlete">{athlete.fullname}</div>,
}));

describe('AthleteSidebar Component', () => {
  const props = {
    groupedAthletes: {
      unavailable: buildAthletes(3),
      injured: buildAthletes(5),
      returning: buildAthletes(1),
      available: buildAthletes(2),
    },
    orderedGroup: ['unavailable', 'injured', 'returning', 'available'],
    groupingLabels: {
      unavailable: 'Unavailable',
      available: 'Available',
      injured: 'Available (Injured)',
      returning: 'Available (Returning from injury)',
      screened: 'Screened Today',
      not_screened: 'Not Screened Today',
    },
    t: i18nextTranslateStub(),
  };

  it('renders', () => {
    const { container } = render(<Sidebar {...props} />);
    expect(
      container.querySelector('.athleteStatusSidebar')
    ).toBeInTheDocument();
  });

  it('displays correct headings', () => {
    render(<Sidebar {...props} />);
    expect(
      screen.getByText(props.groupingLabels.unavailable)
    ).toBeInTheDocument();
    expect(screen.getByText(props.groupingLabels.injured)).toBeInTheDocument();
    expect(
      screen.getByText(props.groupingLabels.returning)
    ).toBeInTheDocument();
    expect(
      screen.getByText(props.groupingLabels.available)
    ).toBeInTheDocument();
  });

  it('displays correct number of athletes', () => {
    const { container } = render(<Sidebar {...props} />);
    const athleteDivs = container.querySelectorAll(
      '.athleteStatusSidebar__athlete'
    );
    expect(athleteDivs.length).toBe(11);
  });
});
