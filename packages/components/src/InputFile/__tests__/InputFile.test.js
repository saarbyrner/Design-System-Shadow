import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import InputFile from '..';

describe('InputFile component', () => {
  let props;

  beforeEach(() => {
    props = {
      value: null,
      onChange: jest.fn(),
      errors: null,
      t: i18nextTranslateStub(),
    };
  });

  it('Shows the button to upload the file with default text', () => {
    render(<InputFile {...props} />);

    expect(screen.getByRole('button')).toHaveTextContent('Select a file');
  });

  it('Shows the button to upload the file with text from prop', () => {
    render(<InputFile {...props} text="Upload CSV" />);

    expect(screen.getByRole('button')).toHaveTextContent('Upload CSV');
  });

  it('Shows the filename when file exists', () => {
    render(<InputFile {...props} value={{ name: 'file.csv' }} />);

    expect(screen.getByTestId('InputFile')).toHaveTextContent('file.csv');
  });

  it('Triggers onChange with null when "X" icon is clicked', async () => {
    render(<InputFile {...props} value={{ name: 'file.csv' }} />);

    await userEvent.click(screen.getByTestId('InputFile|RemoveFile'));
    expect(props.onChange).toHaveBeenCalledTimes(1);
  });

  describe('when there are errors', () => {
    it('displays the correct error messages', () => {
      render(
        <InputFile
          {...props}
          errors={{
            messages: [
              'Row 1',
              'Clubid cannot be blank',
              'Injuryoccurrenceid cannot be blank',
            ],
            totalRows: 1,
            skippedRows: 1,
          }}
        />
      );

      expect(screen.getByTestId('InputFile|Errors')).toHaveTextContent(
        'The uploaded file contains errors and cannot be processed, no data has been added.1 of 1 rows contain errors.Row 1Clubid cannot be blankInjuryoccurrenceid cannot be blank'
      );
    });
  });
});
