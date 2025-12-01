import { renderHook } from '@testing-library/react-hooks';
import { render, fireEvent, screen } from '@testing-library/react';

import {
  buildRowData,
  getDataTypeGuideline,
  getLabels,
} from '@kitman/modules/src/shared/MassUpload/utils';

import { createListValidator } from '@kitman/modules/src/LeagueFixtures/src/mass-upload/common/utils';
import { getPlayerTypesOptions } from '@kitman/modules/src/KitMatrix/shared/utils';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import downloadCsvTemplate from '@kitman/modules/src/shared/MassUpload/New/utils/downloadCsvTemplate';
import { massUploadKitManagementColumns } from '@kitman/modules/src/KitMatrix/src/components/MassUpload/massUploadKitManagementColumns';
import { getKitManagementGuidelines } from '../../components/MassUpload/getKitManagementGuidelines';
import useKitMatrixUploadGrid from '../useKitMatrixUploadGrid';
import { useKitManagementUploadColumnValues } from '../useKitManagementUploadColumnValues';

jest.mock('../useKitManagementUploadColumnValues');
jest.mock('../../components/MassUpload/massUploadKitManagementColumns', () => ({
  massUploadKitManagementColumns: [
    { id: 'Type', row_key: 'Type' },
    { id: 'Club', row_key: 'Club' },
    { id: 'Season', row_key: 'Season' },
    { id: 'Kit name', row_key: 'Kit name' },
    { id: 'Kit Color', row_key: 'Kit Color' },
    { id: 'Jersey Color', row_key: 'Jersey Color' },
    { id: 'Jersey URL', row_key: 'Jersey URL' },
    { id: 'Shorts Color', row_key: 'Shorts Color' },
    { id: 'Shorts URL', row_key: 'Shorts URL' },
    { id: 'Socks Color', row_key: 'Socks Color' },
    { id: 'Socks URL', row_key: 'Socks URL' },
  ],
}));
jest.mock('../../components/MassUpload/getKitManagementGuidelines');
jest.mock('@kitman/modules/src/LeagueFixtures/src/mass-upload/common/utils');
jest.mock('@kitman/modules/src/shared/MassUpload/utils');
jest.mock('@kitman/modules/src/KitMatrix/shared/utils');
jest.mock(
  '@kitman/modules/src/shared/MassUpload/New/utils/downloadCsvTemplate'
);
jest.mock('@kitman/common/src/utils/i18n', () => ({
  __esModule: true,
  default: {
    t: jest.fn((key) => key),
  },
}));

describe('useKitMatrixUploadGrid', () => {
  const mockParsedCsv = [
    {
      Type: 'Player',
      Club: 'Club A',
      Season: '2024',
      'Kit name': 'Home Kit',
      'Kit Color': `${'#'}FF0000`,
      'Jersey Color': 'Red',
      'Jersey URL': 'https://example.com/jersey.jpg',
      'Shorts Color': 'Blue',
      'Shorts URL': 'https://example.com/shorts.jpg',
      'Socks Color': 'White',
      'Socks URL': 'https://example.com/socks.jpg',
    },
  ];

  const mockColumnValues = {
    clubs: ['Club A', 'Club B'],
    colors: ['Red', 'Blue', 'White'],
    seasons: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
    associations: ['Association A', 'Association B'],
  };

  const mockPlayerTypesOptions = [
    { label: 'Player', value: 'player' },
    { label: 'Goalkeeper', value: 'goalkeeper' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    useKitManagementUploadColumnValues.mockReturnValue(mockColumnValues);
    getPlayerTypesOptions.mockReturnValue(mockPlayerTypesOptions);
    buildRowData.mockReturnValue([
      {
        id: 0,
        Type: 'Player',
        Club: 'Club A',
        Season: '2024',
      },
    ]);
    createListValidator.mockImplementation(() => () => null);
    getKitManagementGuidelines.mockReturnValue([
      {
        label: 'Type',
        isRequired: true,
        acceptedValues: ['Player', 'Goalkeeper'],
      },
    ]);
    getDataTypeGuideline.mockImplementation((guideline) => (
      <div key={guideline.label}>{guideline.label} Guideline</div>
    ));
    getLabels.mockReturnValue({ generalFormatGuide: 'General Format Guide' });
  });

  it('should return the initial grid configuration and state', () => {
    const { result } = renderHook(() =>
      useKitMatrixUploadGrid({ parsedCsv: mockParsedCsv })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);

    expect(result.current.grid.id).toBe('KitMatrixUploadGrid');
    expect(result.current.grid.columns).toEqual({
      massUploadKitManagementColumns,
    });
    expect(result.current.grid.rows).toEqual([
      {
        id: 0,
        Type: 'Player',
        Club: 'Club A',
        Season: '2024',
      },
    ]);

    expect(buildRowData).toHaveBeenCalledTimes(1);
    expect(buildRowData).toHaveBeenCalledWith(
      expect.any(Function),
      mockParsedCsv,
      expect.any(Object),
      { massUploadKitManagementColumns },
      true
    );
  });

  it('should construct a validation object with correct validators', () => {
    renderHook(() => useKitMatrixUploadGrid({ parsedCsv: mockParsedCsv }));

    // Check that createListValidator is called for Type, Club, Season, Jersey Color, Shorts Color, Socks Color
    expect(createListValidator).toHaveBeenCalledWith(
      ['Player', 'Goalkeeper'], // playerTypesOptions mapped to labels
      { isRequired: true }
    );
    expect(createListValidator).toHaveBeenCalledWith(
      mockColumnValues.associations,
      { isRequired: true }
    );
    expect(createListValidator).toHaveBeenCalledWith(mockColumnValues.seasons, {
      isRequired: true,
    });
    expect(createListValidator).toHaveBeenCalledWith(mockColumnValues.colors, {
      isRequired: true,
    });
  });

  it('should re-calculate rows when parsedCsv input changes', () => {
    const newParsedCsv = [
      {
        Type: 'Goalkeeper',
        Club: 'Club B',
        Season: '2025',
      },
    ];
    const { rerender } = renderHook(
      ({ parsedCsv }) => useKitMatrixUploadGrid({ parsedCsv }),
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
      { massUploadKitManagementColumns },
      true
    );
  });

  it('should set isError to true when buildRowData sets malformed data', () => {
    buildRowData.mockImplementation((setMalformed) => {
      setMalformed(true);
      return [];
    });

    const { result } = renderHook(() =>
      useKitMatrixUploadGrid({ parsedCsv: mockParsedCsv })
    );

    expect(result.current.isError).toBe(true);
  });

  it('should use playerTypesOptions from getPlayerTypesOptions', () => {
    renderHook(() => useKitMatrixUploadGrid({ parsedCsv: mockParsedCsv }));

    expect(getPlayerTypesOptions).toHaveBeenCalled();
    expect(createListValidator).toHaveBeenCalledWith(
      mockPlayerTypesOptions.map((option) => option.label),
      { isRequired: true }
    );
  });

  it('should handle empty parsedCsv array', () => {
    buildRowData.mockReturnValue([]);

    const { result } = renderHook(() =>
      useKitMatrixUploadGrid({ parsedCsv: [] })
    );

    expect(result.current.grid.rows).toEqual([]);
    expect(buildRowData).toHaveBeenCalledWith(
      expect.any(Function),
      [],
      expect.any(Object),
      { massUploadKitManagementColumns },
      true
    );
  });

  it('should return emptyTableText in grid config', () => {
    const { result } = renderHook(() =>
      useKitMatrixUploadGrid({ parsedCsv: mockParsedCsv })
    );

    expect(result.current.grid.emptyTableText).toEqual(
      'No valid data was found in csv.'
    );
  });

  it('should render a ruleset component with a functioning download template link', () => {
    const { result } = renderHook(() =>
      useKitMatrixUploadGrid({ parsedCsv: mockParsedCsv })
    );

    render(result.current.ruleset);

    const downloadLink = screen.getByTestId('download-kit-management-template');
    expect(downloadLink).toBeInTheDocument();

    fireEvent.click(downloadLink);

    expect(downloadCsvTemplate).toHaveBeenCalledTimes(1);
    expect(downloadCsvTemplate).toHaveBeenCalledWith(
      'League_Kits_Import_Template',
      IMPORT_TYPES.KitMatrix
    );
  });

  it('should verify validation object has all required keys', () => {
    let validationObject;
    buildRowData.mockImplementation((setMalformed, csv, validation) => {
      validationObject = validation;
      return [];
    });

    renderHook(() => useKitMatrixUploadGrid({ parsedCsv: mockParsedCsv }));

    expect(validationObject).toHaveProperty('Type');
    expect(validationObject).toHaveProperty('Club');
    expect(validationObject).toHaveProperty('Season');
    expect(validationObject).toHaveProperty('Kit name');
    expect(validationObject).toHaveProperty('Kit Color');
    expect(validationObject).toHaveProperty('Jersey Color');
    expect(validationObject).toHaveProperty('Jersey URL');
    expect(validationObject).toHaveProperty('Shorts Color');
    expect(validationObject).toHaveProperty('Shorts URL');
    expect(validationObject).toHaveProperty('Socks Color');
    expect(validationObject).toHaveProperty('Socks URL');
  });
});
