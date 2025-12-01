import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import ProcedureTypeSelect from '..';

// jest.mock('@kitman/modules/src/Medical/shared/hooks/useFavourites');

// We need to import the hook AFTER mocking it
// import useFavourites from '@kitman/modules/src/Medical/shared/hooks/useFavourites';

describe('<ProcedureTypeSelect />', () => {
  const props = {
    procedureIndex: 0,
    label: 'Mock label',
    placeholder: 'Mock placeholder...',
    value: null,
    formState: {},
    onTypeChange: jest.fn(),
  };

  it('renders the label', () => {
    render(<ProcedureTypeSelect {...props} />);

    expect(screen.getByLabelText('Mock label')).toBeInTheDocument();
  });

  // it('calls onTypeChange prop when user selects', async () => {
  //   useFavourites.mockReturnValue({
  //     favourites: {
  //       get: () => [{ label: 'choice label 2' }],
  //     },
  //   });

  //   render(<ProcedureTypeSelect {...props} />);
  //   // Click to open select
  //   await userEvent.click(screen.getByRole('textbox'));
  //   // Click to choose item
  //   await userEvent.click(screen.getByText('choice label 2'));

  //   await expect(props.onTypeChange).toHaveBeenCalledTimes(1);
  // });

  // it('Shows optional text when not required', async () => {
  //   const { container } = render(
  //     <ProcedureTypeSelect
  //       {...props}
  //       question={{ ...props.question, required: false }}
  //     />
  //   );

  //   expect(
  //     container.getElementsByClassName('kitmanReactSelect__optionalFieldText')
  //   ).toHaveLength(1);
  // });

  it('renders invalid CSS when invalid', async () => {
    const { container } = render(<ProcedureTypeSelect {...props} invalid />);

    expect(
      container.getElementsByClassName('kitmanReactSelect--invalid')
    ).toHaveLength(1);
  });
});
