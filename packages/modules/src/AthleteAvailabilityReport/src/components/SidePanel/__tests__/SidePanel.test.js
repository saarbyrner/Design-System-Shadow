import { render, screen, within } from '@testing-library/react';
import SidePanel from '../index';
import {
  athleteData,
  expandedAthleteData,
} from '../../../../utils/dummyAthleteData';

describe('Availability Report <SidePanel /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      athletes: athleteData(),
      expandedAthleteData: {},
      timeRangeStart: '2019-11-01T00:00:00Z',
      timeRangeEnd: '2019-11-09T23:59:59Z',
      orgTimeZone: 'Europe/Dublin',
      t: (key) => key,
      sessionDataByAthleteId: {},
    };
  });

  const renderComponent = (extraProps) => {
    render(<SidePanel {...props} {...extraProps} />);
  };

  it('renders the correct number of rows', () => {
    renderComponent();
    expect(screen.getAllByTestId('siderow-wrapper')).toHaveLength(3);
  });

  it('renders the correct missed days and percentage', () => {
    renderComponent();
    const firstAthleteRow = screen.getAllByTestId('siderow-wrapper')[0];
    const cell = within(firstAthleteRow).getByTestId('sidecell');
    expect(within(cell).getByText('3 / 9')).toBeInTheDocument();
    expect(within(cell).getByText('(33%)')).toBeInTheDocument();
  });

  describe('when the expandedAthleteId is defined', () => {
    const expandedDummyData = {
      ...expandedAthleteData(),
      illnesses: [
        {
          availabilities: [],
          duration: '1 day',
          end: null,
          id: 123456,
          start: '27 Jul 2019',
          title: 'Flu',
          type: 'illness',
        },
      ],
    };

    it('renders the correct number of expanded rows', () => {
      renderComponent({
        expandedAthleteData: { [expandedDummyData.id]: expandedDummyData },
      });
      const firstAthlete = screen.getAllByTestId('siderow-wrapper')[0];
      expect(within(firstAthlete).getAllByTestId('siderow')).toHaveLength(3);
    });

    it('renders the correct missed days and percentage', () => {
      renderComponent({
        expandedAthleteData: { [expandedDummyData.id]: expandedDummyData },
      });
      const firstAthleteRow = screen.getAllByTestId('siderow-wrapper')[0];
      const cells = within(firstAthleteRow).getAllByTestId('sidecell');
      expect(within(cells[1]).getByText('5 / 9')).toBeInTheDocument();
      expect(within(cells[1]).getByText('(56%)')).toBeInTheDocument();
    });
  });
});
