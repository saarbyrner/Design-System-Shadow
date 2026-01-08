import { render, screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { requestIdLocalStorageKey } from '@kitman/common/src/consts/services';
import AppStatus from '../index';
import { requestIdErrorMessage } from '../consts';

describe('<AppStatus />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    status: 'success',
    t: i18nT,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('excludes the appstatus from the print view', () => {
    const { container } = render(<AppStatus {...props} />);
    expect(container.getElementsByClassName('d-print-none')).toHaveLength(1);
  });

  it('If status is success, show success message', () => {
    const { container } = render(<AppStatus {...props} />);
    expect(container.getElementsByClassName('appStatus--success')).toHaveLength(
      1
    );
  });

  describe('If status is error', () => {
    beforeAll(() => {
      window.featureFlags['updated-error-screen'] = true;
    });

    afterAll(() => {
      window.featureFlags['updated-error-screen'] = false;
    });

    it('will show an error message with Request ID', async () => {
      localStorage.setItem(requestIdLocalStorageKey, '1234');
      const { container } = render(<AppStatus {...props} status="error" />);
      expect(container.getElementsByClassName('appStatus--error')).toHaveLength(
        1
      );
      expect(
        screen.getByText(new RegExp(requestIdErrorMessage, 'i'))
      ).toBeInTheDocument();
    });

    it('will show an error message without Request ID, because it does not exist', async () => {
      const { container } = render(<AppStatus {...props} status="error" />);
      expect(container.getElementsByClassName('appStatus--error')).toHaveLength(
        1
      );
      expect(
        screen.queryByText(new RegExp(requestIdErrorMessage, 'i'))
      ).not.toBeInTheDocument();
    });
  });

  it('If status is confirm, show confirm message', () => {
    const { container } = render(<AppStatus {...props} status="confirm" />);
    expect(container.getElementsByClassName('appStatus--confirm')).toHaveLength(
      1
    );
  });

  it('If status is confirmWithTitle, show confirm message', () => {
    const { container } = render(
      <AppStatus {...props} status="confirmWithTitle" />
    );
    expect(
      container.getElementsByClassName('appStatus--confirmWithTitle')
    ).toHaveLength(1);
  });

  it('If status is confirm and a message for confirm is provided, show that message', () => {
    render(<AppStatus {...props} status="confirm" message="Custom message" />);
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('If status is loading, show that message with secondary message if passed', () => {
    render(
      <AppStatus
        {...props}
        status="loading"
        message="Custom message"
        secondaryMessage="Secondary message"
      />
    );
    expect(screen.getByText('Custom message')).toBeInTheDocument();
    expect(screen.getByText('Secondary message')).toBeInTheDocument();
  });

  it('If confirm clicked, and custom action provided, call custom action', async () => {
    const confirmAction = jest.fn();
    render(
      <AppStatus {...props} confirmAction={confirmAction} status="confirm" />
    );
    await userEvent.click(screen.getByText(/Yes I'm sure/i));
    expect(confirmAction).toHaveBeenCalled();
  });

  describe('when status is warning', () => {
    it('shows a confirm message', () => {
      const { container } = render(<AppStatus {...props} status="warning" />);
      expect(
        container.getElementsByClassName('appStatus--warning')
      ).toHaveLength(1);
    });

    it('shows a message when message for confirm is provided', () => {
      render(
        <AppStatus {...props} status="warning" message="Custom message" />
      );
      expect(screen.getByText('Custom message')).toBeInTheDocument();
    });

    it('calls custom action when confirm is clicked and custom action is provided', async () => {
      const confirmAction = jest.fn();
      render(
        <AppStatus {...props} status="warning" confirmAction={confirmAction} />
      );
      await userEvent.click(screen.getByRole('button', { name: 'Delete All' }));
      expect(confirmAction).toHaveBeenCalled();
    });

    it('calls the close modal callback', async () => {
      const hideConfirmationCallback = jest.fn();

      render(
        <AppStatus
          {...props}
          status="warning"
          hideConfirmation={hideConfirmationCallback}
        />
      );
      await userEvent.click(screen.getByText(/Cancel/i));
      expect(hideConfirmationCallback).toHaveBeenCalled();
    });
  });

  it('If status is loading, show message', () => {
    const { container } = render(<AppStatus {...props} status="loading" />);
    expect(container.getElementsByClassName('appStatus--saving')).toHaveLength(
      1
    );
    expect(screen.getByText('Saving...')).toBeInTheDocument();

    // can provide custom saving message
    props.message = 'Custom loading message';
    render(<AppStatus {...props} />);
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  it('calls the close modal callback on confirm status', async () => {
    const closeModalCallback = jest.fn();
    render(
      <AppStatus
        status="confirm"
        close={closeModalCallback}
        confirmAction={closeModalCallback}
        t={i18nT}
      />
    );
    await userEvent.click(screen.getByText(/Yes I'm sure/i));
    expect(closeModalCallback).toHaveBeenCalled();
  });

  it('If status is validationError, show validation error message', () => {
    const { container } = render(
      <AppStatus {...props} status="validationError" />
    );
    expect(
      container.getElementsByClassName('appStatus--validationError')
    ).toHaveLength(1);
  });

  it('If status is validationError and a message for the error is provided, show that message', () => {
    render(
      <AppStatus {...props} status="validationError" message="Custom message" />
    );
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('If status is validationError and a text for the button is provided, show that text', () => {
    render(
      <AppStatus {...props} status="validationError" message="Custom message" />
    );
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  describe('When close props is not defined', () => {
    const { location } = window;

    beforeEach(() => {
      delete window.location;
      window.location = { reload: jest.fn() };
    });

    afterEach(() => {
      window.location = location;
    });

    it('reloads the page when clicking the button "Go back and try again"', async () => {
      render(<AppStatus status="error" t={i18nT} />);
      await userEvent.click(screen.getByText(/Go back and try again/i));
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it('embeds the loader in his container if isEmbed is true', () => {
    const { container } = render(<AppStatus {...props} isEmbed />);
    expect(container.getElementsByClassName('appStatus--embed')).toHaveLength(
      1
    );
  });

  describe('When the user presses escape', () => {
    let hideConfirmationCallback;

    beforeEach(() => {
      hideConfirmationCallback = jest.fn();
    });

    it('closes the modal and the status is confirm', () => {
      const { container } = render(
        <AppStatus
          status="confirm"
          hideConfirmation={hideConfirmationCallback}
          t={i18nT}
        />
      );
      fireEvent.keyDown(container, {
        key: 'Escape',
        code: 'Escape',
        charCode: 27,
      });
      expect(hideConfirmationCallback).toHaveBeenCalled();
    });

    it('closes the modal and the status is warning', () => {
      const { container } = render(
        <AppStatus
          status="warning"
          hideConfirmation={hideConfirmationCallback}
          t={i18nT}
        />
      );
      fireEvent.keyDown(container, {
        key: 'Escape',
        code: 'Escape',
        charCode: 27,
      });
      expect(hideConfirmationCallback).toHaveBeenCalled();
    });
  });

  describe('When the user presses escape and the status is not confirm', () => {
    it('does not close the modal', () => {
      const hideConfirmationCallback = jest.fn();

      const { container } = render(
        <AppStatus
          status="success"
          hideConfirmation={hideConfirmationCallback}
          t={i18nT}
        />
      );
      fireEvent.keyDown(container, {
        key: 'Escape',
        code: 'Escape',
        charCode: 27,
      });
      expect(hideConfirmationCallback).not.toHaveBeenCalled();
    });
  });

  describe('when status is message', () => {
    it('shows a message and a header', () => {
      const { container } = render(
        <AppStatus
          {...props}
          status="message"
          header="My Header"
          message="My Message"
        />
      );

      expect(
        container.getElementsByClassName('appStatus--message')
      ).toHaveLength(1);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'My Header'
      );
      expect(screen.getByText('My Message')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Continue' })
      ).toBeInTheDocument();
    });

    it('shows the correct button text when confirmButtonText is set', () => {
      render(
        <AppStatus
          {...props}
          status="message"
          header="My Header"
          message="My Message"
          confirmButtonText="Button Text"
        />
      );

      expect(
        screen.getByRole('button', { name: 'Button Text' })
      ).toBeInTheDocument();
    });
  });
});
