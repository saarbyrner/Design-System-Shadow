import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../index';
import {
  athleteData,
  expandedAthleteData,
} from '../../../../utils/dummyAthleteData';

describe('Availability Report <SideBar /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      athletes: athleteData(),
      canViewIssues: true,
      canViewAbsence: true,
      expandedAthleteData: {},
      onExpandAthleteClick: jest.fn(),
      t: (key) => key,
      rightShadowPos: 0,
    };
  });

  const renderComponent = (extraProps) => {
    const user = userEvent.setup();
    render(<Sidebar {...props} {...extraProps} />);
    return { user };
  };

  it('renders the correct number of athlete rows', () => {
    renderComponent();
    expect(screen.getAllByTestId('sidebar-row')).toHaveLength(3);
  });

  it('renders an arrow if the athlete has issues causing availability change', () => {
    renderComponent();
    expect(screen.getAllByTestId('icon-next-right')).toHaveLength(2);
  });

  describe('when an athlete has issues causing change in availability', () => {
    it('renders a clickable athlete name', () => {
      renderComponent();
      expect(screen.getByText('Jon Doe')).toBeInTheDocument();
      expect(screen.getByText('Charles Baston')).toBeInTheDocument();
    });
  });

  describe('when the athlete has issues', () => {
    it('renders a clickable athlete name', () => {
      renderComponent();
      expect(screen.getByText('Jon Doe')).toBeInTheDocument();
      expect(screen.getByText('Charles Baston')).toBeInTheDocument();
    });

    it('calls the correct callback when the athlete name is clicked', async () => {
      const { user } = renderComponent();
      await user.click(screen.getByText('Jon Doe'));
      expect(props.onExpandAthleteClick).toHaveBeenCalledWith('33925');
    });
  });

  describe('when there are expandedAthleteIds', () => {
    it('renders the correct number of expanded rows', () => {
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
      renderComponent({
        expandedAthleteData: { [expandedDummyData.id]: expandedDummyData },
      });
      const expandedRows = screen.getAllByTestId('sidebar-row');
      // 3 main rows + 3 expanded rows
      expect(expandedRows).toHaveLength(6);
    });
  });

  describe('when the issue is clicked', () => {
    const expandedDummyData = {
      ...expandedAthleteData(),
      illnesses: [
        {
          availabilities: [
            'status_1',
            'status_1',
            'status_1',
            'status_1',
            'status_1',
            'status_2',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
          ],
          duration: '19 days',
          end: null,
          id: 123456,
          start: '27 Jul 2019',
          title: 'Flu',
          type: 'illness',
        },
      ],
    };

    it('links to the correct page when the issue is absence', () => {
      renderComponent({
        expandedAthleteData: { [expandedDummyData.id]: expandedDummyData },
      });
      expect(
        screen.getByText('International Duty').closest('a')
      ).toHaveAttribute('href', '/athletes/33925/absences');
    });

    it('links to the correct page when the issue is injury', () => {
      renderComponent({
        expandedAthleteData: { [expandedDummyData.id]: expandedDummyData },
      });
      expect(
        screen
          .getByText(
            'Ankle Apophysitis/ avulsion fracture to calcaneus ( Severs Dx) [Left]'
          )
          .closest('a')
      ).toHaveAttribute('href', '/athletes/33925/injuries');
    });

    it('links to the correct page when the issue is illness', () => {
      renderComponent({
        expandedAthleteData: { [expandedDummyData.id]: expandedDummyData },
      });
      expect(screen.getByText('Flu').closest('a')).toHaveAttribute(
        'href',
        '/athletes/33925/illnesses'
      );
    });
  });

  describe('when the user does not have the canViewIssues permission', () => {
    const expandedDummyData = {
      ...expandedAthleteData(),
      illnesses: [
        {
          availabilities: [
            'status_1',
            'status_1',
            'status_1',
            'status_1',
            'status_1',
            'status_2',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
            'available',
          ],
          duration: '19 days',
          end: null,
          id: 123456,
          start: '27 Jul 2019',
          title: 'Flu',
          type: 'illness',
        },
      ],
    };

    beforeEach(() => {
      props.canViewIssues = false;
    });

    it('renders static "Issue" for injuries and illnesses titles', () => {
      renderComponent({
        expandedAthleteData: { [expandedDummyData.id]: expandedDummyData },
      });
      expect(
        screen.queryByText(
          'Ankle Apophysitis/ avulsion fracture to calcaneus ( Severs Dx) [Left]'
        )
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Flu')).not.toBeInTheDocument();
      expect(screen.getAllByText('Medical Issue')).toHaveLength(2);
    });
  });

  describe('when the user does not have the canViewAbsence permission', () => {
    const expandedDummyData = {
      ...expandedAthleteData(),
    };

    beforeEach(() => {
      props.canViewAbsence = false;
    });

    it('renders static "Absence" for absence titles', () => {
      renderComponent({
        expandedAthleteData: { [expandedDummyData.id]: expandedDummyData },
      });
      expect(screen.getByText('Absence')).toBeInTheDocument();
    });
  });
});
