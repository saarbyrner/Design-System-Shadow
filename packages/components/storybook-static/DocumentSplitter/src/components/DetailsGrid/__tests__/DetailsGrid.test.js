import { render, screen } from '@testing-library/react';
import DetailsGrid from '@kitman/components/src/DocumentSplitter/src/components/DetailsGrid';
import { GRID_ROW_FIELD_KEYS } from '@kitman/components/src/DocumentSplitter/src/shared/consts';

// Mock i18n for translation
jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: jest.fn((key) => key), // Simple mock that returns the key
}));

const defaultProps = {
  grid: {
    rows: [
      {
        id: 1,
        col1: 'Row 1 A',
        col2: 'Row 1 B',
      },
      {
        id: 2,
        col1: 'Row 2 C',
        col2: 'Row 2 D',
      },
    ],
    columns: [
      { field: 'col1', headerName: 'Column 1' },
      { field: 'col2', headerName: 'Column 2' },
    ],
    emptyTableText: 'Test no rows text',
    id: 'Document splitter details grid',
  },
  validationResults: {},
  validationFailed: false,
};

const renderComponent = (props = defaultProps) =>
  render(<DetailsGrid {...props} />);

describe('DetailsGrid', () => {
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('Column 1')).toBeInTheDocument();
    expect(screen.getByText('Column 2')).toBeInTheDocument();

    expect(screen.queryByText('Test no rows text')).not.toBeInTheDocument();

    expect(screen.getByText('Row 1 A')).toBeInTheDocument();
    expect(screen.getByText('Row 1 B')).toBeInTheDocument();
    expect(screen.getByText('Row 2 C')).toBeInTheDocument();
    expect(screen.getByText('Row 2 D')).toBeInTheDocument();
  });

  it('renders empty rows correctly', () => {
    renderComponent({
      ...defaultProps,
      grid: {
        ...defaultProps.grid,
        rows: [],
      },
    });

    expect(screen.getByText('Column 1')).toBeInTheDocument();
    expect(screen.getByText('Column 2')).toBeInTheDocument();
    expect(screen.getByText('Test no rows text')).toBeInTheDocument();
  });

  it('displays validation alert when validationFailed is true', () => {
    const expectedValidationMessage = 'Error: A valid page range is required';

    const validationResults = {
      [GRID_ROW_FIELD_KEYS.pages]: { 1: false },
    };

    renderComponent({
      ...defaultProps,
      validationFailed: true,
      validationResults,
    });

    expect(screen.getByText(expectedValidationMessage)).toBeInTheDocument();
  });

  it('does not display validation alert when validationFailed is false', () => {
    const expectedValidationMessage = 'Error: A valid page range is required';

    const validationResults = {
      [GRID_ROW_FIELD_KEYS.pages]: { 1: false },
    };

    renderComponent({
      ...defaultProps,
      validationFailed: false,
      validationResults,
    });

    expect(
      screen.queryByText(expectedValidationMessage)
    ).not.toBeInTheDocument();
  });
});
