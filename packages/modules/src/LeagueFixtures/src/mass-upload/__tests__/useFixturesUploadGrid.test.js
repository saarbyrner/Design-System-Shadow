import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent, screen } from '@testing-library/react';

import {
  buildRowData,
  getDataTypeGuideline,
  getLabels,
} from '@kitman/modules/src/shared/MassUpload/utils';
import downloadCsvTemplate from '@kitman/modules/src/shared/MassUpload/New/utils/downloadCsvTemplate';
import { useFixturesUploadColumnValues } from '../useFixturesUploadColumnValues';
import { massUploadFixturesColumns } from '../common/columns';
import { getGuidelines } from '../components/FixturesRuleset/guidelines';
import {
  createListValidator,
  createIntegerValidator,
  createDateValidator,
  createBooleanValidator,
  createEmailValidator,
} from '../common/utils';
import useFixturesUploadGrid from '../useFixturesUploadGrid';

jest.mock('../useFixturesUploadColumnValues');
jest.mock('../common/columns', () => ({
  massUploadFixturesColumns: [{ field: 'Match ID', headerName: 'Match ID' }],
}));
jest.mock('../components/FixturesRuleset/guidelines');
jest.mock('../common/utils');
jest.mock(
  '@kitman/modules/src/shared/MassUpload/New/utils/downloadCsvTemplate'
);
jest.mock('@kitman/modules/src/shared/MassUpload/utils');
jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: jest.fn((key) => key),
}));

describe('useFixturesUploadGrid', () => {
  const mockParsedCsv = [{ 'Match ID': '123', 'Home Team': 'Team A' }];
  const mockColumnValues = {
    clubs: ['Team A', 'Team B'],
    squads: ['First Team'],
    competitions: ['League 1'],
    timezones: ['Europe/London'],
    tvChannels: ['Sky Sports'],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useFixturesUploadColumnValues.mockReturnValue(mockColumnValues);
    buildRowData.mockReturnValue([
      { id: 0, 'Match ID': '123', 'Home Team': 'Team A' },
    ]);
    getGuidelines.mockReturnValue([
      { type: 'Date', guidelines: ['YYYY-MM-DD'] },
    ]);
    getLabels.mockReturnValue({ generalFormatGuide: 'General Format Guide' });
    getDataTypeGuideline.mockImplementation((guideline) => (
      <div key={guideline.type}>{guideline.type}</div>
    ));

    createListValidator.mockImplementation(() => () => null);
    createIntegerValidator.mockImplementation(() => () => null);
    createDateValidator.mockImplementation(() => () => null);
    createBooleanValidator.mockImplementation(() => () => null);
    createEmailValidator.mockImplementation(() => () => null);
  });

  it('should return the initial grid configuration and state', () => {
    const { result } = renderHook(() =>
      useFixturesUploadGrid({ parsedCsv: mockParsedCsv })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);

    expect(result.current.grid.id).toBe('FixturesUploadGrid');
    expect(result.current.grid.columns).toEqual(massUploadFixturesColumns);
    expect(result.current.grid.rows).toEqual([
      { id: 0, 'Match ID': '123', 'Home Team': 'Team A' },
    ]);

    expect(buildRowData).toHaveBeenCalledTimes(1);
    expect(buildRowData).toHaveBeenCalledWith(
      expect.any(Function),
      mockParsedCsv,
      expect.any(Object),
      massUploadFixturesColumns,
      true
    );
  });

  it('should construct a validation object with correct validators', () => {
    renderHook(() => useFixturesUploadGrid({ parsedCsv: mockParsedCsv }));

    expect(createListValidator).toHaveBeenCalledWith(
      mockColumnValues.competitions,
      { isRequired: true }
    );
    expect(createListValidator).toHaveBeenCalledWith(mockColumnValues.clubs, {
      isRequired: true,
    });
    expect(createListValidator).toHaveBeenCalledWith(
      mockColumnValues.timezones,
      {
        customMessage: 'Invalid timezone',
        isRequired: true,
      }
    );
    expect(createIntegerValidator).toHaveBeenCalledWith({
      isRequired: true,
    }); // For Duration
    expect(createEmailValidator).toHaveBeenCalledWith({
      isRequired: false,
    });
    expect(createBooleanValidator).toHaveBeenCalledWith({
      isRequired: false,
    });
    expect(createDateValidator).toHaveBeenCalled();
  });

  it('should re-calculate rows when parsedCsv input changes', () => {
    const newParsedCsv = [{ 'Match ID': '456', 'Home Team': 'Team C' }];
    const { rerender } = renderHook(
      ({ parsedCsv }) => useFixturesUploadGrid({ parsedCsv }),
      {
        initialProps: { parsedCsv: mockParsedCsv },
      }
    );

    expect(buildRowData).toHaveBeenCalledTimes(1);

    rerender({ parsedCsv: newParsedCsv });

    expect(buildRowData).toHaveBeenCalledTimes(2);
    expect(buildRowData).toHaveBeenLastCalledWith(
      expect.any(Function),
      newParsedCsv,
      expect.any(Object),
      massUploadFixturesColumns,
      true
    );
  });

  it('should provide a ruleset with a functioning download template link', () => {
    const { result } = renderHook(() =>
      useFixturesUploadGrid({ parsedCsv: mockParsedCsv })
    );

    render(result.current.ruleset);

    const downloadLink = screen.getByText('League fixtures import.');
    expect(downloadLink).toBeInTheDocument();

    fireEvent.click(downloadLink);

    expect(downloadCsvTemplate).toHaveBeenCalledTimes(1);
    expect(downloadCsvTemplate).toHaveBeenCalledWith(
      'League_Fixtures_Import_Template',
      'league_game'
    );
  });
});
