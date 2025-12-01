import { render, screen, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { dataInCamelCase } from '@kitman/services/src/mocks/handlers/imports/genericImport';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import { useGetImportJobsQuery } from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';
import GrowthAndMaturationApp from '../index';

jest.mock('@kitman/modules/src/shared/MassUpload/redux/massUploadApi');

describe('GrowthAndMaturationApp', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
  };

  const dataWithCorrectImportType = {
    ...dataInCamelCase,
    data: [
      {
        ...dataInCamelCase.data[0],
        importType: `${IMPORT_TYPES.GrowthAndMaturation}_import`,
      },
      {
        ...dataInCamelCase.data[1],
        importType: `${IMPORT_TYPES.GrowthAndMaturation}_import`,
      },
      {
        ...dataInCamelCase.data[1],
        importType: `${IMPORT_TYPES.Baselines}_import`,
      },
    ],
  };

  beforeEach(() => {
    useGetImportJobsQuery.mockReturnValue({
      data: dataWithCorrectImportType,
      isError: false,
      isLoading: false,
      isSuccess: true,
      status: 'fulfilled',
    });
  });

  it('should render as expected', async () => {
    render(<GrowthAndMaturationApp {...defaultProps} />);

    // Title
    await waitFor(() => {
      expect(screen.getByText('Growth and maturation')).toBeInTheDocument();
    });
    // Headers
    expect(screen.getByText('Test name')).toBeInTheDocument();
    expect(screen.getByText('Last edited')).toBeInTheDocument();
    expect(screen.getByText('Results submitted')).toBeInTheDocument();
    // Tests
    expect(
      screen.getByText('Growth and maturation assessments')
    ).toBeInTheDocument();
    expect(screen.getByText('Khamis-Roche baselines')).toBeInTheDocument();
  });

  it('should map submissions to table', async () => {
    render(<GrowthAndMaturationApp {...defaultProps} />);

    expect(
      screen.getByText('Growth and maturation assessments')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Sep 25, 2023 2:38 PM by John Doe')
    ).toBeInTheDocument(); // Last edited
    expect(screen.getByText('2')).toBeInTheDocument(); // Results submitted

    expect(screen.getByText('Khamis-Roche baselines')).toBeInTheDocument();
    expect(
      screen.getByText('Sep 15, 2023 2:38 PM by Paul Smith')
    ).toBeInTheDocument(); // Last edited
    expect(screen.getByText('1')).toBeInTheDocument(); // Results submitted
  });
});
