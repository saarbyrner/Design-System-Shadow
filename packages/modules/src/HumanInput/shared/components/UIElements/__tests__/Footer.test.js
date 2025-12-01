import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Footer from '../Footer';

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
  onClickNext: jest.fn(),
  onClickPrevious: jest.fn(),
  isNextDisabled: false,
  isPreviousDisabled: false,
};

describe('<Footer/>', () => {
  it('renders', () => {
    render(<Footer {...props} />);
    expect(
      screen.getByRole('button', {
        name: /Back/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /Next/i,
      })
    ).toBeInTheDocument();
  });

  it('disables the navigation', () => {
    render(<Footer {...props} isNextDisabled isPreviousDisabled />);
    expect(
      screen.getByRole('button', {
        name: /Back/i,
      })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', {
        name: /Next/i,
      })
    ).toBeDisabled();
  });
});
