import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as jsPDFlib from 'jspdf';
import html2canvas from 'html2canvas';
import {
  DERIVED_PAGES_FROM_MOCKS,
  MOCK_LAYOUTS,
} from '../../__tests__/mockData';
import { PAGE_DIMENSIONS_MM } from '../../constants';
import { renderWithContext } from './testUtils';
import PDFRender from '../PDFRender';

const mockAddPage = jest.fn();
const mockAddImage = jest.fn();
const mockDownloadPdf = jest.fn();
const mockPDFOutput = jest.fn();
const CANVAS_RESOLVE = '<canvas />';
const URI_STRING_MOCK = 'uristringmock';
jest.mock('jspdf', () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => {
      return {
        addPage: mockAddPage,
        addImage: mockAddImage,
        output: mockPDFOutput.mockReturnValue(URI_STRING_MOCK),
        save: mockDownloadPdf,
      };
    }),
  };
});

jest.mock('html2canvas', () => {
  return jest.fn().mockResolvedValue(CANVAS_RESOLVE);
});

// Mocking this component as there is no need to test this within the scope of the component
jest.mock('../../../../containers/WidgetRenderer', () => {
  return () => <>WidgetRenderer</>;
});

describe('PrintBuilder|<PDFRender />', () => {
  const i18nT = i18nextTranslateStub();
  const defaultProps = {
    t: i18nT,
    pages: DERIVED_PAGES_FROM_MOCKS,
    dashboardPrintLayout: MOCK_LAYOUTS[0],
    pageWidth: PAGE_DIMENSIONS_MM.a4.short,
    pageHeight: PAGE_DIMENSIONS_MM.a4.long,
    squads: [],
    annotationTypes: [],
    appliedSquadAthletes: {},
    pivotedDateRange: {},
    pivotedTimePeriod: null,
    pivotedTimePeriodLength: null,
    currentUser: {},
    squadAthletes: {},
    dashboardTitle: 'Print Test Dashboard',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct amount of layouts', async () => {
    const { container } = renderWithContext(<PDFRender {...defaultProps} />);

    await waitFor(() => {
      expect(container.getElementsByClassName('react-grid-layout').length).toBe(
        DERIVED_PAGES_FROM_MOCKS.length
      );
      expect(container.getElementsByClassName('react-grid-item').length).toBe(
        MOCK_LAYOUTS[0].length
      );
    });
  });

  it('renders a PDF Preview with Download button', async () => {
    renderWithContext(<PDFRender {...defaultProps} />);

    expect(screen.queryByText('PDF Preview')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Download PDF' })
    ).toBeInTheDocument();
  });

  describe('when rendering', () => {
    it('renders a loading spinner for the duration of the pdf creation', async () => {
      renderWithContext(<PDFRender {...defaultProps} />);

      await userEvent.click(
        screen.getByRole('button', { name: 'Download PDF' })
      );

      await waitFor(() => {
        expect(screen.queryByText('Creating PDF')).toBeInTheDocument();
      });
    });

    it('calls the jspdf save when the Download PDF button is clicked', async () => {
      renderWithContext(<PDFRender {...defaultProps} />);

      await userEvent.click(
        screen.getByRole('button', { name: 'Download PDF' })
      );

      await waitFor(() => {
        expect(jsPDFlib.jsPDF).toHaveBeenCalledWith({
          orientation: 'portrait',
          unit: 'px',
          format: [PAGE_DIMENSIONS_MM.a4.short, PAGE_DIMENSIONS_MM.a4.long],
        });
      });

      expect(mockDownloadPdf).toHaveBeenCalledWith('Print Test Dashboard.pdf');
    });

    it('calls the html2canvas for each page of an element when the Download PDF button is clicked', async () => {
      renderWithContext(<PDFRender {...defaultProps} />);

      await userEvent.click(
        screen.getByRole('button', { name: 'Download PDF' })
      );

      await waitFor(() => {
        // converts each page to a canvas element
        expect(html2canvas).toHaveBeenCalledTimes(
          DERIVED_PAGES_FROM_MOCKS.length
        );
      });
    });
  });
});
