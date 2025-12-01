import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Title from '../Title';

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
  isSubmitDisabled: false,
  isSaveDisabled: false,
  title: 'Registration',
};

describe('<Title/>', () => {
  it('renders', () => {
    render(<Title {...props} />);
    expect(screen.getByText(/Registration/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /Save/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /Submit/i,
      })
    ).toBeInTheDocument();
  });

  it('disables the submit button', () => {
    render(<Title {...props} isSubmitDisabled />);

    expect(
      screen.getByRole('button', {
        name: /Submit/i,
      })
    ).toBeDisabled();
  });

  it('disables the save button', () => {
    render(<Title {...props} isSaveDisabled />);

    expect(
      screen.getByRole('button', {
        name: /Save/i,
      })
    ).toBeDisabled();
  });
});
