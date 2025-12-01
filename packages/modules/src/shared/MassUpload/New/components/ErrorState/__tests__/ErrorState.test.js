import { render, screen } from '@testing-library/react';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import { getErrorStateTemplateConfig } from '@kitman/modules/src/shared/MassUpload/New/utils';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import ErrorState from '../index';

jest.mock('@kitman/common/src/hooks/useLocationAssign');

describe('<ErrorState />', () => {
  const mockProps = {
    expectedFields: ['A', 'B', 'C'],
    optionalExpectedFields: ['D'],
    providedFields: ['A', 'B', 'D'],
    importType: 'some_import',
    onUploadAgain: jest.fn(),
  };

  it('should render error message with missing columns if expectedFields does not match provided fields', () => {
    render(<ErrorState {...mockProps} />);

    expect(screen.getByText('Missing column(s): C')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Try again' })
    ).toBeInTheDocument();
  });

  it('should render error message with additional columns if expectedFields does not match provided fields', () => {
    render(
      <ErrorState
        {...mockProps}
        providedFields={[...mockProps.expectedFields, 'E']}
      />
    );

    expect(
      screen.getByText('Please remove additional column(s): E')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Try again' })
    ).toBeInTheDocument();
  });

  it('should render custom errors if passed', () => {
    render(
      <ErrorState
        {...mockProps}
        customErrors={{
          errors: ['Custom error message 1', 'Custom error message 2'],
          isSuccess: true,
        }}
      />
    );

    expect(screen.getByText('Custom error message 1')).toBeInTheDocument();
    expect(screen.getByText('Custom error message 2')).toBeInTheDocument();
  });

  it('should call onUploadAgain on click of Upload again button', async () => {
    const { user } = renderWithUserEventSetup(<ErrorState {...mockProps} />);
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(mockProps.onUploadAgain).toHaveBeenCalled();
  });

  describe('Download template', () => {
    const { title, templateUrl } =
      getErrorStateTemplateConfig().growth_and_maturation;

    it('should not render download template prompt if importType not part of importTypesWithTemplate', () => {
      render(<ErrorState {...mockProps} />);
      expect(
        screen.queryByText('Download a CSV file template for')
      ).not.toBeInTheDocument();
    });

    it('should render download template prompt if importType part of importTypesWithTemplate', () => {
      render(
        <ErrorState
          {...mockProps}
          importType={IMPORT_TYPES.GrowthAndMaturation}
        />
      );

      expect(
        screen.getByText('Download a CSV file template for')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: title,
        })
      ).toBeInTheDocument();
    });

    it('should call useLocationAssign with correct url on click of download template', async () => {
      const mockUseLocationAssign = jest.fn();
      useLocationAssign.mockReturnValue(mockUseLocationAssign);
      const { user } = renderWithUserEventSetup(
        <ErrorState
          {...mockProps}
          importType={IMPORT_TYPES.GrowthAndMaturation}
        />
      );

      await user.click(
        screen.getByRole('button', {
          name: title,
        })
      );

      expect(mockUseLocationAssign).toHaveBeenCalledWith(templateUrl);
    });
  });
});
