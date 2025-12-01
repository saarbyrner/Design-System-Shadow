import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Modal from '../index';

describe('ConfirmationModal', () => {
  const t = i18nextTranslateStub();
  const dialogText = 'dialogText';
  const defaultProps = {
    t,
    isModalOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    isLoading: false,
    dialogContent: <>{dialogText}</>,
    translatedText: {
      title: 'title',
      actions: {
        ctaButton: 'CTA',
        cancelButton: 'Cancel',
      },
    },
  };

  const renderComponent = (props = defaultProps) => {
    render(<Modal {...props} />);
  };

  const getConfirmButton = () =>
    screen.getByRole('button', {
      name: defaultProps.translatedText.actions.ctaButton,
    });

  const getCancelButton = () =>
    screen.getByRole('button', {
      name: defaultProps.translatedText.actions.cancelButton,
    });

  it('should render properly', () => {
    renderComponent();

    // title
    expect(
      screen.getByRole('heading', { name: defaultProps.translatedText.title })
    ).toBeInTheDocument();

    // content
    expect(screen.getByText(dialogText)).toBeInTheDocument();

    // actions
    expect(getConfirmButton()).toBeInTheDocument();
    expect(getCancelButton()).toBeInTheDocument();
  });

  it('should trigger the action callbacks', async () => {
    const user = userEvent.setup();
    renderComponent();

    const confirmButton = getConfirmButton();
    expect(confirmButton).toBeEnabled();
    await user.click(confirmButton);
    expect(defaultProps.onConfirm).toHaveBeenCalled();

    const cancelButton = getCancelButton();
    expect(cancelButton).toBeEnabled();
    await user.click(cancelButton);
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should render the cancel button as disabled when loading and a spinner instead of a confirm text', () => {
    renderComponent({ ...defaultProps, isLoading: true });

    expect(getCancelButton()).toBeDisabled();
    expect(
      screen.queryByRole('button', {
        name: defaultProps.translatedText.actions.ctaButton,
      })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should disable the cta button if disableCtaButton is true', () => {
    renderComponent({ ...defaultProps, disableCtaButton: true });
    expect(getConfirmButton()).toBeDisabled();
  });

  it('should not disable the cta button if disableCtaButton is false', () => {
    renderComponent({ ...defaultProps, disableCtaButton: false });
    expect(getConfirmButton()).toBeEnabled();
  });

  describe('CTA button tooltip', () => {
    it('should render tooltip on hover if tooltip text is provided', async () => {
      renderComponent({
        ...defaultProps,
        translatedText: {
          ...defaultProps.translatedText,
          actions: {
            ...defaultProps.translatedText.actions,
            ctaButtonTooltip: 'Example tooltip text',
          },
        },
      });
      await userEvent.hover(getConfirmButton());
      expect(await screen.findByRole('tooltip')).toHaveTextContent(
        'Example tooltip text'
      );
    });

    it('should not render tooltip on hover if tooltip text is not provided', async () => {
      renderComponent();
      await userEvent.hover(getConfirmButton());
      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });
});
