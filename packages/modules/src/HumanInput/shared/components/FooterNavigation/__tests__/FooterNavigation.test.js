import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import FooterNavigation from '../FooterNavigation';

describe('FooterNavigation', () => {
  const props = {
    canNavigateBack: true,
    canNavigateForward: true,
    onBackTriggered: jest.fn(),
    onForwardTriggered: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('renders', () => {
    render(<FooterNavigation {...props} />);

    const backButton = screen.getByRole('button', { name: 'Back' });
    const nextButton = screen.getByRole('button', { name: 'Next' });

    expect(backButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('calls callback on back button clicked', async () => {
    render(<FooterNavigation {...props} />);
    const backButton = screen.getByRole('button', { name: 'Back' });
    expect(backButton).toBeEnabled();

    await userEvent.click(backButton);
    expect(props.onBackTriggered).toHaveBeenCalled();
  });

  it('calls callback on Next button clicked', async () => {
    render(<FooterNavigation {...props} />);
    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeEnabled();
    await userEvent.click(nextButton);
    expect(props.onForwardTriggered).toHaveBeenCalled();
  });

  it('disables buttons based on props', async () => {
    render(
      <FooterNavigation
        {...props}
        canNavigateBack={false}
        canNavigateForward={false}
      />
    );
    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeDisabled();

    const backButton = screen.getByRole('button', { name: 'Back' });
    expect(backButton).toBeDisabled();
  });
});
