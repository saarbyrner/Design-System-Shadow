import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import * as reactRedux from 'react-redux';
import PrintBuilderContainer from '../PrintBuilder';
import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
} from '../../redux/services/dashboard';

jest.mock('../../redux/services/dashboard', () => ({
  useGetPermittedSquadsQuery: jest.fn(),
  useGetSquadAthletesQuery: jest.fn(),
}));

describe('PrintBuilder Container', () => {
  let mockDispatch;
  let initialState;

  beforeEach(() => {
    mockDispatch = jest.fn();

    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    useGetPermittedSquadsQuery.mockReturnValue({
      data: [],
    });

    useGetSquadAthletesQuery.mockReturnValue({
      data: { position_groups: [] },
    });

    initialState = {
      dashboard: {
        toast: [],
        widgets: [
          {
            id: 1,
            rows: 2,
            cols: 2,
            vertical_position: 0,
            horizontal_position: 0,
            print_rows: 1,
            print_cols: 2,
            print_vertical_position: 1,
            print_horizontal_position: 1,
            rows_range: [2, 3],
            cols_range: [1, 2],
          },
        ],
        dashboardPrintLayout: [
          {
            i: '1',
            x: 1,
            y: 1,
            w: 2,
            h: 1,
            minH: 2,
            maxH: 3,
            minW: 1,
            maxW: 2,
          },
        ],
        activeDashboard: {
          id: 99,
          name: 'Test Dashboard',
          print_paper_size: 'a_4',
          print_orientation: 'portrait',
        },
      },
      dashboardApi: {},
      printBuilder: {
        isOpen: false,
      },
      staticData: {
        containerType: 'TEST',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders the PrintBuilder component with correct elements', () => {
    renderWithRedux(<PrintBuilderContainer />, {
      preloadedState: initialState,
      useGlobalStore: false,
    });

    expect(screen.getByText('Print Layout')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Print' })).toBeInTheDocument();
  });

  it('dispatches the correct actions when onUpdatePrintOrientation is called', async () => {
    const user = userEvent.setup();

    renderWithRedux(<PrintBuilderContainer />, {
      preloadedState: initialState,
      useGlobalStore: false,
    });

    const orientationButton = screen.getByText('Landscape');
    await user.click(orientationButton);

    const expectedAction = {
      type: 'UPDATE_PRINT_ORIENTATION',
      payload: {
        printOrientation: 'landscape',
      },
    };

    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches the correct actions when onUpdatePrintPaperSize is called', async () => {
    const user = userEvent.setup();

    renderWithRedux(<PrintBuilderContainer />, {
      preloadedState: initialState,
      useGlobalStore: false,
    });

    const paperSizeButton = screen.getByText('US Letter');
    await user.click(paperSizeButton);

    const expectedAction = {
      type: 'UPDATE_PRINT_PAPER_SIZE',
      payload: {
        printPaperSize: 'us_letter',
      },
    };

    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });
});
