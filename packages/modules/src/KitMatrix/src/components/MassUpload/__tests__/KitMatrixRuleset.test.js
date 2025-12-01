import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getDataTypeGuideline } from '@kitman/modules/src/shared/MassUpload/utils';
import downloadCsvTemplate from '@kitman/modules/src/shared/MassUpload/New/utils/downloadCsvTemplate';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import userEvent from '@testing-library/user-event';
import { getKitManagementGuidelines } from '../getKitManagementGuidelines';
import KitMatrixRuleset from '../KitMatrixRuleset';

jest.mock('@kitman/modules/src/shared/MassUpload/utils', () => ({
  getDataTypeGuideline: jest.fn((guideline) => (
    <div key={guideline.label}>{guideline.label} Guideline</div>
  )),
  getLabels: jest.fn(() => ({ generalFormatGuide: 'General Format Guide' })),
}));

jest.mock('../getKitManagementGuidelines', () => ({
  getKitManagementGuidelines: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/shared/MassUpload/New/utils/downloadCsvTemplate'
);

describe('KitMatrixRuleset', () => {
  const t = i18nextTranslateStub();
  const mockGuidelines = [
    {
      label: 'Type',
      isRequired: true,
      acceptedValues: ['Player', 'Goalkeeper'],
    },
    {
      label: 'Club',
      isRequired: true,
      acceptedValues: ['Format must be Full club name'],
    },
    {
      label: 'Season',
      isRequired: true,
      acceptedValues: ['Format must be year (ie - 2025)'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    getKitManagementGuidelines.mockReturnValue(mockGuidelines);
  });

  it('should render all instructional text, labels, and guidelines correctly', () => {
    render(<KitMatrixRuleset t={t} />);

    // Check for static text content
    expect(
      screen.getByText(
        /To avoid errors make sure you are importing the correct template file type/
      )
    ).toBeInTheDocument();
    expect(screen.getByText('League kits import.')).toBeInTheDocument();
    expect(screen.getByText('General Format Guide:')).toBeInTheDocument();

    expect(getKitManagementGuidelines).toHaveBeenCalledTimes(1);

    expect(getDataTypeGuideline).toHaveBeenCalledTimes(mockGuidelines.length);
    expect(getDataTypeGuideline).toHaveBeenCalledWith(mockGuidelines[0]);
    expect(getDataTypeGuideline).toHaveBeenCalledWith(mockGuidelines[1]);
    expect(getDataTypeGuideline).toHaveBeenCalledWith(mockGuidelines[2]);

    expect(screen.getByText('Type Guideline')).toBeInTheDocument();
    expect(screen.getByText('Club Guideline')).toBeInTheDocument();
    expect(screen.getByText('Season Guideline')).toBeInTheDocument();
  });

  it('should call downloadCsvTemplate with correct arguments when the download link is clicked', async () => {
    render(<KitMatrixRuleset t={t} />);

    const user = userEvent.setup();
    const downloadLink = screen.getByTestId('download-kit-management-template');
    expect(downloadLink).toBeInTheDocument();

    await user.click(downloadLink);

    expect(downloadCsvTemplate).toHaveBeenCalledTimes(1);

    expect(downloadCsvTemplate).toHaveBeenCalledWith(
      'League_Kits_Import_Template',
      IMPORT_TYPES.KitMatrix
    );
  });
});
