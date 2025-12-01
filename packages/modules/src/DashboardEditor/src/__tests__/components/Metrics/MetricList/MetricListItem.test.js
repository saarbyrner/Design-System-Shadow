import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { buildStatuses } from '@kitman/common/src/utils/test_utils';
import MetricListItem from '../../../../components/Metrics/MetricList/MetricListItem';

describe('Dashboard Editor <MetricListItem /> component', () => {
  let props;
  const statuses = buildStatuses(1);

  beforeEach(() => {
    window.featureFlags = {};
    props = {
      status: statuses[0],
      selected: false,
      isDisabled: false,
      t: (key) => key,
    };
  });

  it('renders', () => {
    render(<MetricListItem {...props} />);

    // Verify the list item renders
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('renders the status name and localised unit of the status', () => {
    render(<MetricListItem {...props} />);

    const statusName = document.querySelector('.statusList__name');
    expect(statusName).toHaveTextContent(
      `${props.status.name} (${props.status.localised_unit})`
    );
  });

  describe('When the status does not have a localised unit', () => {
    let customProps;

    beforeEach(() => {
      customProps = {
        ...props,
        status: {
          ...props.status,
          localised_unit: null,
        },
      };
    });

    it('does not render the localised unit of the status', () => {
      render(<MetricListItem {...customProps} />);

      const statusName = document.querySelector('.statusList__name');
      expect(statusName).toHaveTextContent(customProps.status.name);
      expect(statusName).not.toHaveTextContent('(');
    });
  });

  describe('When the status does not have a name', () => {
    let customProps;

    beforeEach(() => {
      customProps = {
        ...props,
        status: {
          ...props.status,
          name: null,
        },
      };
    });

    it('renders `New Metric` as the label', () => {
      render(<MetricListItem {...customProps} />);

      const statusName = document.querySelector('.statusList__name');
      expect(statusName).toHaveTextContent('New Metric');
    });
  });

  it('renders a reorder handle', () => {
    render(<MetricListItem {...props} />);

    expect(document.querySelector('.statusList__icon')).toBeInTheDocument();
  });

  it('fires a callback with the correct arguments when clicked', async () => {
    const user = userEvent.setup();
    const onStatusItemClickSpy = jest.fn();

    render(
      <MetricListItem {...props} onStatusItemClick={onStatusItemClickSpy} />
    );

    const listItem = screen.getByRole('listitem');
    await user.click(listItem);

    expect(onStatusItemClickSpy).toHaveBeenCalledWith(props.status.status_id);
  });

  describe('When status item is selected', () => {
    let customProps;

    beforeEach(() => {
      customProps = {
        ...props,
        selected: true,
      };
    });

    it('adds the "selected" classname to the status item', () => {
      render(<MetricListItem {...customProps} />);

      const listItem = document.querySelector('.statusList__item');
      expect(listItem).toHaveClass('selected');
    });
  });

  describe('When status item is disabled', () => {
    let customProps;
    const onStatusItemClickSpy = jest.fn();

    beforeEach(() => {
      customProps = {
        ...props,
        isDisabled: true,
      };
    });

    it('renders a disabled reorder handle', () => {
      render(
        <MetricListItem
          {...customProps}
          onStatusItemClick={onStatusItemClickSpy}
        />
      );

      const icon = document.querySelector('.statusList__icon');
      expect(icon).toHaveClass('disabled');
    });
  });
});
