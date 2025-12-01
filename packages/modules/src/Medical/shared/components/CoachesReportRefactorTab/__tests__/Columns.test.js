import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  athleteFormatter,
  openIssuesFormatter,
  handleOnCellClick,
  getColumns,
} from '../components/Columns';
import { cellNotBeingEditedValue } from '../utils/utils';

// Mock serevices and components
jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: (key) => key,
}));

jest.mock('@kitman/components', () => ({
  TextLink: jest.fn(({ text, href, kitmanDesignSystem }) => (
    <a
      href={href}
      data-testid="text-link"
      data-kitman-design-system={kitmanDesignSystem}
    >
      {text}
    </a>
  )),
}));

const mockRowData = {
  id: 1,
  athlete: {
    avatar_url: 'test.jpg',
    fullname: 'Ryan Giggs',
    position: 'Forward',
  },
  player_id: 'JD123',
  open_injuries_illnesses: ['Sprained Ankle', 'Flu'],
  most_recent_coaches_note: 'Needs improvement on passing.',
  updated_by: 'Jane Smith',
  availability_status: {
    availability: 'Available',
  },
};

describe('athleteFormatter', () => {
  it('renders the athlete avatar and name with a link', () => {
    render(athleteFormatter({ row: mockRowData }));
    const avatar = screen.getByRole('img');
    const link = screen.getByTestId('text-link');
    const position = screen.getByText('JD123 - Forward');

    expect(avatar).toHaveAttribute('src', 'test.jpg');
    expect(link).toHaveAttribute('href', '/medical/athletes/1');
    expect(link).toHaveAttribute('data-kitman-design-system', 'true');
    expect(link).toHaveTextContent('Ryan Giggs');
    expect(position).toBeInTheDocument();
  });

  it('renders the athlete name and position without player ID', () => {
    const rowDataWithoutPlayerId = { ...mockRowData, player_id: null };
    render(athleteFormatter({ row: rowDataWithoutPlayerId }));
    const position = screen.getByText('Forward');
    expect(position).toBeInTheDocument();
  });
});

describe('openIssuesFormatter', () => {
  it('returns the array of open injuries/illnesses', () => {
    const issues = openIssuesFormatter({ row: mockRowData });
    expect(issues).toEqual(['Sprained Ankle', 'Flu']);
  });

  it('returns an empty array if open_injuries_illnesses is null or undefined', () => {
    const rowDataWithoutIssues = {
      ...mockRowData,
      open_injuries_illnesses: null,
    };
    const issuesNull = openIssuesFormatter({ row: rowDataWithoutIssues });
    expect(issuesNull).toEqual([]);

    const rowDataWithoutIssuesUndefined = {
      ...mockRowData,
      open_injuries_illnesses: undefined,
    };
    const issuesUndefined = openIssuesFormatter({
      row: rowDataWithoutIssuesUndefined,
    });
    expect(issuesUndefined).toEqual([]);
  });
});

describe('handleOnCellClick', () => {
  let mockSetEditingCellId;
  let mockSetRichTextEditorIsInFocus;

  beforeEach(() => {
    mockSetEditingCellId = jest.fn();
    mockSetRichTextEditorIsInFocus = jest.fn();
  });

  it('sets the editingCellId and clears rich text focus if a different cell is clicked', () => {
    const editingCellId = 2;
    handleOnCellClick(
      { row: { id: 1 } },
      editingCellId,
      mockSetEditingCellId,
      mockSetRichTextEditorIsInFocus
    );
    expect(mockSetEditingCellId).toHaveBeenCalledWith(1);
    expect(mockSetRichTextEditorIsInFocus).toHaveBeenCalledWith(false);
  });

  it('does not change editingCellId or rich text focus if the same cell is clicked', () => {
    const editingCellId = 1;
    handleOnCellClick(
      { row: { id: 1 } },
      editingCellId,
      mockSetEditingCellId,
      mockSetRichTextEditorIsInFocus
    );
    expect(mockSetEditingCellId).not.toHaveBeenCalled();
    expect(mockSetRichTextEditorIsInFocus).not.toHaveBeenCalled();
  });
});

describe('getColumns', () => {
  let mockSetRichTextEditorIsInFocus;
  let mockSetEditingCellId;
  let mockRenderNoteCell;
  const mockHandleOnCellClick = jest.fn();

  beforeEach(() => {
    mockSetRichTextEditorIsInFocus = jest.fn();
    mockSetEditingCellId = jest.fn();
    mockRenderNoteCell = jest.fn((isEditing, content) => (
      <div data-testid={isEditing ? 'editing-note-cell' : 'note-cell'}>
        {content}
      </div>
    ));
    mockHandleOnCellClick.mockClear();
  });

  const getRenderedNoteCell = (row, editingCellId, rowSelectionModel = []) => {
    const columns = getColumns({
      setRichTextEditorIsInFocus: mockSetRichTextEditorIsInFocus,
      editingCellId,
      canViewInjuries: true,
      canViewAvailabilityStatus: true,
      setEditingCellId: mockSetEditingCellId,
      rowSelectionModel,
      renderNoteCell: mockRenderNoteCell,
    });
    const noteColumn = columns.find(
      (col) => col.field === 'most_recent_coaches_note'
    );
    return noteColumn.renderCell({ row });
  };

  it('returns an array of columns with correct headers and renderers', () => {
    const columns = getColumns({
      setRichTextEditorIsInFocus: mockSetRichTextEditorIsInFocus,
      editingCellId: cellNotBeingEditedValue,
      canViewInjuries: true,
      canViewAvailabilityStatus: true,
      setEditingCellId: mockSetEditingCellId,
      rowSelectionModel: [],
      renderNoteCell: mockRenderNoteCell,
    });

    expect(columns.length).toBe(5); // Athlete, Availability, Injuries, Note, Updated by

    // Athlete Column
    expect(columns[0].field).toBe('athlete');
    expect(columns[0].headerName).toBe('Athlete');
    expect(columns[0].renderCell).toBe(athleteFormatter);

    // Availability Status Column
    expect(columns[1].field).toBe('availability_status');
    expect(columns[1].headerName).toBe('Availability status');
    expect(columns[1].renderCell).toBeDefined();

    // Open Injury/ Illness Column
    expect(columns[2].field).toBe('open_injuries_illnesses');
    expect(columns[2].headerName).toBe('Open Injury/ Illness');
    expect(columns[2].renderCell).toBe(openIssuesFormatter);

    // Note Column
    expect(columns[3].field).toBe('most_recent_coaches_note');
    expect(columns[3].headerName).toBe('Note');
    expect(columns[3].renderCell).toBeDefined();

    // Updated by Column
    expect(columns[4].field).toBe('updated_by');
    expect(columns[4].headerName).toBe('Updated by');
  });

  it('does not include Availability column when canViewAvailabilityStatus is false', () => {
    const columns = getColumns({
      setRichTextEditorIsInFocus: mockSetRichTextEditorIsInFocus,
      editingCellId: cellNotBeingEditedValue,
      canViewInjuries: true,
      canViewAvailabilityStatus: false,
      setEditingCellId: mockSetEditingCellId,
      rowSelectionModel: [],
      renderNoteCell: mockRenderNoteCell,
    });
    expect(columns.length).toBe(4);
    expect(
      columns.find((col) => col.field === 'availability_status')
    ).toBeUndefined();
  });

  it('includes Availability column when canViewAvailabilityStatus is true', () => {
    const columns = getColumns({
      setRichTextEditorIsInFocus: mockSetRichTextEditorIsInFocus,
      editingCellId: cellNotBeingEditedValue,
      canViewInjuries: true,
      canViewAvailabilityStatus: true,
      setEditingCellId: mockSetEditingCellId,
      rowSelectionModel: [],
      renderNoteCell: mockRenderNoteCell,
    });
    expect(columns.length).toBe(5);
    expect(
      columns.find((col) => col.field === 'availability_status')
    ).not.toBeUndefined();
  });

  it('does not include Open Injury/ Illness column when canViewInjuries is false', () => {
    const columns = getColumns({
      setRichTextEditorIsInFocus: mockSetRichTextEditorIsInFocus,
      editingCellId: cellNotBeingEditedValue,
      canViewInjuries: false,
      canViewAvailabilityStatus: true,
      setEditingCellId: mockSetEditingCellId,
      rowSelectionModel: [],
      renderNoteCell: mockRenderNoteCell,
    });
    expect(columns.length).toBe(4);
    expect(
      columns.find((col) => col.field === 'open_injuries_illnesses')
    ).toBeUndefined();
  });

  it('includes Open Injury/ Illness column when canViewInjuries is true', () => {
    const columns = getColumns({
      setRichTextEditorIsInFocus: mockSetRichTextEditorIsInFocus,
      editingCellId: cellNotBeingEditedValue,
      canViewInjuries: true,
      canViewAvailabilityStatus: true,
      setEditingCellId: mockSetEditingCellId,
      rowSelectionModel: [],
      renderNoteCell: mockRenderNoteCell,
    });
    expect(columns.length).toBe(5);
    expect(
      columns.find((col) => col.field === 'open_injuries_illnesses')
    ).not.toBeUndefined();
  });

  it('renders the note cell content directly when in editing mode', () => {
    render(getRenderedNoteCell(mockRowData, mockRowData.id));
    expect(screen.getByTestId('editing-note-cell')).toHaveTextContent(
      mockRowData.most_recent_coaches_note
    );
  });
});
