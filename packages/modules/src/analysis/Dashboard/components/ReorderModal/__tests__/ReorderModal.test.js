import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import * as useEventTrackingModule from '@kitman/common/src/hooks/useEventTracking';
import $ from 'jquery';
import ReorderModal from '..';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('Analytical dashboard <ReorderModal /> component', () => {
  const props = {
    containerType: 'AnalyticalDashboard',
    dashboard: {
      id: 13,
      name: 'dashboard name',
    },
    layout: [
      {
        i: '1',
        x: 0,
        y: 0,
        h: 1,
        w: 3,
        maxH: 1,
        minH: 1,
      },
      {
        i: '2',
        x: 0,
        y: 0,
        h: 1,
        w: 3,
        maxH: 1,
        minH: 1,
      },
      {
        i: '3',
        x: 0,
        y: 0,
        h: 1,
        w: 3,
        maxH: 1,
        minH: 1,
      },
    ],
    onApply: jest.fn(),
    onCloseModal: jest.fn(),
    isOpen: true,
    t: (text) => text,
    widgets: [
      {
        id: 1,
        rows: 6,
        cols: 1,
        vertical_position: 0,
        horizontal_position: 0,
        print_rows: 5,
        print_cols: 2,
        print_vertical_position: 1,
        print_horizontal_position: 1,
        rows_range: [6, 6],
        cols_range: [1, 1],
        widget_type: 'header',
        widget: {},
        widget_render: {
          widget_name: 'Header Widget',
        },
      },
      {
        id: 2,
        rows: 3,
        cols: 1,
        vertical_position: 1,
        horizontal_position: 0,
        print_rows: 4,
        print_cols: 2,
        print_vertical_position: 2,
        print_horizontal_position: 1,
        rows_range: [3, 3],
        cols_range: [1, 1],
        widget_type: 'athlete_profile',
        widget: {},
        widget_render: {},
      },
      {
        id: 3,
        rows: 6,
        cols: 3,
        vertical_position: 4,
        horizontal_position: 0,
        print_rows: 5,
        print_cols: 2,
        print_vertical_position: 3,
        print_horizontal_position: 1,
        rows_range: [1, 6],
        cols_range: [3, 5],
        widget_type: 'graph',
        widget: {
          configuration: {
            graph_group: '',
            graph_type: 'line',
          },
        },
        widget_render: {
          name: 'Graph Widget',
        },
      },
    ],
  };

  let mockTrackEvent;

  beforeEach(() => {
    mockTrackEvent = jest.fn();
    useEventTrackingModule.default.mockReturnValue({
      trackEvent: mockTrackEvent,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders', () => {
    renderWithStore(<ReorderModal {...props} />);

    expect(screen.getByText('Customise layout')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('renders the correct widget elements', () => {
    renderWithStore(<ReorderModal {...props} />);

    expect(screen.getByText('Header Widget')).toBeInTheDocument();
    expect(screen.getByText('Graph Widget')).toBeInTheDocument();
  });

  it('renders the correct name and img for header widgets', () => {
    renderWithStore(<ReorderModal {...props} />);

    expect(screen.getByText('Header Widget')).toBeInTheDocument();

    const images = screen.getAllByAltText('graph placeholder');
    const headerImage = images.find((img) =>
      img.src.includes('header-widget-placeholder.svg')
    );
    expect(headerImage).toBeInTheDocument();
  });

  it('renders the img for profile widgets', () => {
    renderWithStore(<ReorderModal {...props} />);

    const images = screen.getAllByAltText('graph placeholder');
    const profileImage = images.find((img) =>
      img.src.includes('profile-widget-placeholder.svg')
    );
    expect(profileImage).toBeInTheDocument();
  });

  it('renders the correct name and img for line graph widget', () => {
    renderWithStore(<ReorderModal {...props} />);

    expect(screen.getByText('Graph Widget')).toBeInTheDocument();

    const images = screen.getAllByAltText('graph placeholder');
    const graphImage = images.find((img) =>
      img.src.includes('line-graph-placeholder.svg')
    );
    expect(graphImage).toBeInTheDocument();
  });

  it('calls trackEvent with "Customise Analysis Dashboard Layout" when apply is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore(<ReorderModal {...props} />);

    const applyButton = screen.getByText('Apply');
    await user.click(applyButton);

    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Customise Analysis Dashboard Layout'
    );
  });

  it('applies the original layout and close the modal when clicking the cancel button', async () => {
    const user = userEvent.setup();
    const onCloseModalSpy = jest.fn();
    const testProps = { ...props, onCloseModal: onCloseModalSpy };

    renderWithStore(<ReorderModal {...testProps} />);

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(onCloseModalSpy).toHaveBeenCalledTimes(1);
  });

  describe('When applying the new layout and the request succeeds', () => {
    let ajaxSpy;

    beforeEach(() => {
      ajaxSpy = jest.spyOn($, 'ajax');
    });

    afterEach(() => {
      ajaxSpy.mockRestore();
    });

    it('applies the new layout', async () => {
      const user = userEvent.setup();
      const onApplySpy = jest.fn();
      const testProps = { ...props, onApply: onApplySpy };

      const mockDone = jest.fn((callback) => {
        callback();
        return { fail: jest.fn() };
      });

      ajaxSpy.mockReturnValue({
        done: mockDone,
        fail: jest.fn(),
      });

      renderWithStore(<ReorderModal {...testProps} />);

      const applyButton = screen.getByText('Apply');
      await user.click(applyButton);

      await waitFor(() => {
        expect(ajaxSpy).toHaveBeenCalledWith({
          method: 'POST',
          url: '/widgets/update_layout',
          contentType: 'application/json',
          data: expect.stringContaining(
            '"container_type":"AnalyticalDashboard"'
          ),
        });
      });

      await waitFor(() => {
        expect(onApplySpy).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 13,
            name: 'dashboard name',
          }),
          expect.any(Array)
        );
      });
    });
  });
});
