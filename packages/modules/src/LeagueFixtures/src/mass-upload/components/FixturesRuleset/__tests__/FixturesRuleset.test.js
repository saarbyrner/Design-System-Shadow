import { render, screen } from '@testing-library/react';

import { getDataTypeGuideline } from '@kitman/modules/src/shared/MassUpload/utils';
import downloadCsvTemplate from '@kitman/modules/src/shared/MassUpload/New/utils/downloadCsvTemplate';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import userEvent from '@testing-library/user-event';
import { getGuidelines } from '../guidelines';
import FixturesRuleset from '../index';

jest.mock('@kitman/common/src/utils/i18n', () => ({
  t: jest.fn((key) => key),
}));

jest.mock('@kitman/modules/src/shared/MassUpload/utils', () => ({
  getDataTypeGuideline: jest.fn((guideline) => (
    <div key={guideline.type}>{guideline.type} Guideline</div>
  )),
  getLabels: jest.fn(() => ({ generalFormatGuide: 'General Format Guide' })),
}));

jest.mock('../guidelines', () => ({
  getGuidelines: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/shared/MassUpload/New/utils/downloadCsvTemplate'
);

describe('FixturesRuleset', () => {
  const acceptedDateFormats = ['DD/MM/YYYY HH:mm'];
  const mockGuidelines = [
    { type: 'Date', guidelines: ['Guideline 1 for Date'] },
    { type: 'Text', guidelines: ['Guideline 1 for Text'] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    getGuidelines.mockReturnValue(mockGuidelines);
  });

  it('should render all instructional text, labels, and guidelines correctly', () => {
    render(<FixturesRuleset acceptedDateFormats={acceptedDateFormats} />);

    // Check for static text content
    expect(
      screen.getByText(
        /To avoid errors make sure you are importing the correct template file type/
      )
    ).toBeInTheDocument();
    expect(screen.getByText('League fixtures import.')).toBeInTheDocument();
    expect(screen.getByText('General Format Guide:')).toBeInTheDocument();

    expect(getGuidelines).toHaveBeenCalledTimes(1);
    expect(getGuidelines).toHaveBeenCalledWith({ acceptedDateFormats });

    expect(getDataTypeGuideline).toHaveBeenCalledTimes(mockGuidelines.length);
    expect(getDataTypeGuideline).toHaveBeenCalledWith(mockGuidelines[0]);
    expect(getDataTypeGuideline).toHaveBeenCalledWith(mockGuidelines[1]);

    expect(screen.getByText('Date Guideline')).toBeInTheDocument();
    expect(screen.getByText('Text Guideline')).toBeInTheDocument();
  });

  it('should call downloadCsvTemplate with correct arguments when the download link is clicked', async () => {
    render(<FixturesRuleset acceptedDateFormats={acceptedDateFormats} />);

    const user = userEvent.setup();
    const downloadLink = screen.getByTestId('download-fixtures-template');
    expect(downloadLink).toBeInTheDocument();

    await user.click(downloadLink);

    expect(downloadCsvTemplate).toHaveBeenCalledTimes(1);

    expect(downloadCsvTemplate).toHaveBeenCalledWith(
      'League_Fixtures_Import_Template',
      IMPORT_TYPES.LeagueGame
    );
  });
});
