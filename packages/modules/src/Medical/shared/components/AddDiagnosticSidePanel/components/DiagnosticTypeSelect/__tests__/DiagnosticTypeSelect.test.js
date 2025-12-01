import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import DiagnosticTypeSelect from '..';

describe('<DiagnosticTypeSelect />', () => {
  const props = {
    diagnosticIndex: 0,
    label: 'Mock label',
    value: null,
    formState: {},
    onTypeChange: jest.fn(),
    shouldDisableEditing: jest.fn(),
  };

  it('renders the label', () => {
    render(<DiagnosticTypeSelect {...props} />);

    expect(screen.getByLabelText('Mock label')).toBeInTheDocument();
  });

  // it('calls onTypeChange prop when user selects', async () => {
  //   render(<DiagnosticTypeSelect {...props} />);
  //   // Click to open select
  //   await userEvent.click(screen.getByRole('textbox'));
  //   // Click to choose item
  //   await userEvent.click(screen.getByText('choice label 2'));

  //   await expect(props.choiceOnChange).toHaveBeenCalledTimes(1);
  // });

  // it('Shows optional text when not required', async () => {
  //   const { container } = render(
  //     <DiagnosticTypeSelect
  //       {...props}
  //       question={{ ...props.question, required: false }}
  //     />
  //   );

  //   expect(
  //     container.getElementsByClassName('kitmanReactSelect__optionalFieldText')
  //   ).toHaveLength(1);
  // });

  it('renders invalid CSS when invalid', async () => {
    const { container } = render(<DiagnosticTypeSelect {...props} invalid />);

    expect(
      container.getElementsByClassName('kitmanReactSelect--invalid')
    ).toHaveLength(1);
  });
});
