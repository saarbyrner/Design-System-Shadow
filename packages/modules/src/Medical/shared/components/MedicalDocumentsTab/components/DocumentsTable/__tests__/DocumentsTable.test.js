import { render, screen } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import DocumentsTable from '@kitman/modules/src/Medical/shared/components/MedicalDocumentsTab/components/DocumentsTable';
import documentData from '@kitman/modules/src/Medical/shared/components/MedicalDocumentsTab/components/DocumentsTable/__tests__/mocks/documentsData';

describe('<DocumentsTable/>', () => {
  const baseProps = {
    onReachingEnd: jest.fn(),
    documents: documentData,
    isLoading: false,
    issueId: null,
    showPlayerColumn: true,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    i18nextTranslateStub();
  });

  test('renders table', () => {
    render(<DocumentsTable {...baseProps} />);
    expect(screen.getByText('Upload date')).toBeInTheDocument();
  });

  test('renders all columns', () => {
    render(<DocumentsTable {...baseProps} />);

    expect(screen.getByText('Player')).toBeInTheDocument();
    expect(screen.getByText('Title name')).toBeInTheDocument();
    expect(screen.getByText('File name')).toBeInTheDocument();
    expect(screen.getByText('Upload date')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Associated injury/illness')).toBeInTheDocument();
    expect(screen.getByText('Note')).toBeInTheDocument();
  });

  test('does not render player column', () => {
    render(<DocumentsTable {...baseProps} showPlayerColumn={false} />);
    expect(screen.queryByText('Player')).not.toBeInTheDocument();
    expect(screen.getByText('Title name')).toBeInTheDocument();
  });

  test('does not render player and injury columns when issueId present', () => {
    render(
      <DocumentsTable {...baseProps} showPlayerColumn={false} issueId={1} />
    );

    expect(screen.queryByText('Player')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Associated injury/illness')
    ).not.toBeInTheDocument();
  });

  test('renders rows for provided data', () => {
    render(<DocumentsTable {...baseProps} />);
    expect(document.querySelectorAll('.dataTable__tr').length).toBeGreaterThan(
      0
    );
  });
});
