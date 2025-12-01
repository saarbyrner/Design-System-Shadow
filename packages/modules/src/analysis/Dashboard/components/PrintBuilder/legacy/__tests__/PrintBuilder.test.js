import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { emptySquadAthletes } from '../../../utils';
import PrintBuilder from '../index';

describe('Analytical Dashboard <PrintBuilder /> component', () => {
  const props = {
    close: jest.fn(),
    widgets: [
      {
        id: 123,
      },
      {
        id: 456,
      },
    ],
    dashboardPrintLayout: [
      {
        i: '1',
        x: 0,
        y: 0,
        h: 5,
        w: 6,
        maxH: 7,
        minH: 2,
        maxW: 6,
        minW: 1,
      },
      {
        i: '2',
        x: 0,
        y: 0,
        h: 5,
        w: 6,
        maxH: 7,
        minH: 2,
        maxW: 6,
        minW: 1,
      },
    ],
    dashboardName: 'Test Dashboard',
    orgName: 'Test org',
    squadName: 'Test squad',
    userName: 'Test User',
    squadAthletes: emptySquadAthletes,
    squads: [],
    annotationTypes: [{ organisation_annotation_type_id: 1 }],
    printPaperSize: 'a_4',
    printOrientation: 'landscape',
    currentUser: { id: 1, name: 'Test User' },
    onUpdateDashboardPrintLayout: jest.fn(),
    onUpdatePrintOrientation: jest.fn(),
    onUpdatePrintPaperSize: jest.fn(),
    t: (key) => key,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    renderWithStore(<PrintBuilder {...props} />);

    expect(screen.getByText('Print Layout')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Print')).toBeInTheDocument();
  });

  it('calls the correct action when the back button is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore(<PrintBuilder {...props} />);

    const backButton = screen.getByText('Back');
    await user.click(backButton);

    expect(props.close).toHaveBeenCalledTimes(1);
  });

  it('calls the correct action when the print orientation is changed', async () => {
    const user = userEvent.setup();
    renderWithStore(<PrintBuilder {...props} />);

    const portraitRadioLabel = screen.getByText('Portrait');
    await user.click(portraitRadioLabel);

    expect(props.onUpdatePrintOrientation).toHaveBeenCalledTimes(1);
    expect(props.onUpdatePrintOrientation).toHaveBeenCalledWith('portrait', 0);
  });

  it('calls the correct action when the paper size is changed', async () => {
    const user = userEvent.setup();
    renderWithStore(<PrintBuilder {...props} />);

    const paperTypeDropdownButton = screen.getByRole('button', { name: /A4/i });
    await user.click(paperTypeDropdownButton);

    const usLetterOption = screen.getByText('US Letter');
    await user.click(usLetterOption);

    expect(props.onUpdatePrintPaperSize).toHaveBeenCalledWith('us_letter');
  });
});
