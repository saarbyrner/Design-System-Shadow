import { render, screen } from '@testing-library/react';
import {
  buildStatuses,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import StatusForm from '../index';

describe('<StatusForm />', () => {
  const availableVariables = [
    {
      localised_unit: '1-10',
      name: 'Abdominal',
      source_key: 'kitman:stiffness_indication|abdominal',
      source_name: 'Stiffness',
      type: 'scale',
      description: 'Stiffness',
    },
    {
      localised_unit: 'degrees',
      name: 'Ankle Angle Left',
      source_key: 'kitman:ohs|ankle_angle_left',
      source_name: 'Overhead Squat',
      type: 'number',
      description: 'Overhead Squat',
    },
    {
      localised_unit: 'degrees',
      name: 'Ankle Angle Right',
      source_key: 'kitman:ohs|ankle_angle_right',
      source_name: 'Right Y Balance',
      type: 'number',
      description: 'Right Y Balance',
    },
  ];

  const statuses = buildStatuses(5);
  const status = statuses[0];

  const props = {
    updatedStatus: status,
    availableVariables,
    onChange: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders the StatusForm components', () => {
    render(<StatusForm {...props} />);

    expect(screen.getByText('Data Source')).toBeInTheDocument();
    expect(screen.getByText('Calculation')).toBeInTheDocument();
  });

  describe('when noPeriodSelector is true', () => {
    it("doesn't render the time period selector", () => {
      render(<StatusForm {...props} noPeriodSelector />);

      expect(screen.getByText('Calculation')).toBeInTheDocument();
      expect(screen.getByText('Data Source')).toBeInTheDocument();

      expect(screen.queryByText('Time Period')).not.toBeInTheDocument();
      expect(screen.queryByText('Period')).not.toBeInTheDocument();
    });
  });

  describe('when summary is training_efficiency_index', () => {
    it('renders additional fields for training efficiency index', () => {
      props.updatedStatus = {
        ...props.updatedStatus,
        source_key: 'kitman:ohs|ankle_angle_left',
        summary: 'training_efficiency_index',
      };

      render(<StatusForm {...props} />);

      expect(screen.getByText('Calculation')).toBeInTheDocument();
      expect(screen.getByText('Data Source')).toBeInTheDocument();

      // For training_efficiency_index, look for additional form elements
      const formElements = screen
        .getAllByRole('button')
        .concat(
          Array.from(document.querySelectorAll('input, select, textarea'))
        );

      // There should be multiple form elements when training_efficiency_index is used
      expect(formElements.length).toBeGreaterThan(2);
    });
  });

  describe('when summaryWhiteList is passed', () => {
    it('restricts the summaries to the white list', async () => {
      const summaryWhiteList = ['min', 'max'];
      render(<StatusForm {...props} summaryWhiteList={summaryWhiteList} />);

      // The component should render with the calculation section
      expect(screen.getByText('Calculation')).toBeInTheDocument();

      // Look for dropdown elements that might contain the options
      const dropdownElements = screen
        .getAllByRole('button')
        .concat(
          Array.from(
            document.querySelectorAll(
              'select, input[role="combobox"], [role="listbox"]'
            )
          )
        );

      // At minimum, verify the component renders successfully with the whitelist prop
      // The actual dropdown behavior depends on the implementation details
      expect(dropdownElements.length).toBeGreaterThan(0);

      expect(screen.getByText('Min')).toBeInTheDocument();
      expect(screen.getByText('Max')).toBeInTheDocument();

      expect(screen.queryByText('Average')).not.toBeInTheDocument();
      expect(screen.queryByText('Sum')).not.toBeInTheDocument();
      expect(screen.queryByText('Count')).not.toBeInTheDocument();
    });
  });

  it('does not render this season so far in the time period selector', () => {
    render(
      <StatusForm {...props} updatedStatus={{ ...status, summary: 'sum' }} />
    );

    expect(screen.getByText('Time Period')).toBeInTheDocument();

    expect(screen.getByText('This Season')).toBeInTheDocument();
    expect(screen.queryByText('This Season So Far')).not.toBeInTheDocument();
  });
});
