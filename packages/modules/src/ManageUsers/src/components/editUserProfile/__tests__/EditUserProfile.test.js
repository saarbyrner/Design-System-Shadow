import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFetchOrganisationPreferenceQuery } from '@kitman/common/src/redux/global/services/globalApi';
import sinon from 'sinon';
import EditUserProfile from '../index';

jest.mock('@kitman/common/src/redux/global/services/globalApi');

const mockedUseFetchOrganisationPreferenceQuery =
  useFetchOrganisationPreferenceQuery;

describe('<EditUserProfile />', () => {
  let props;

  beforeEach(() => {
    window.setFlag('cp-athlete-avatars-prevent-fas-avatar-upload', false);
    mockedUseFetchOrganisationPreferenceQuery.mockReturnValue({
      data: { value: false },
      isLoading: false,
    });

    props = {
      currentUser: {
        id: 1234,
        username: 'jondoe',
        firstname: 'Jon',
        lastname: 'Doe',
        email: 'jondoe@example.com',
        locale: 'en',
        avatar_url: 'https://example.com/avatar.jpg',
      },
      languages: [
        {
          value: 'en',
          label: 'English',
        },
        {
          value: 'de',
          label: 'German',
        },
      ],
      photoUploadStatus: 'IDLE',
      saveUserFormStarted: sinon.spy(),
      saveUserFormSuccess: sinon.spy(),
      saveUserFormFailure: sinon.spy(),
      t: (key) => key,
    };
  });

  afterEach(() => {
    mockedUseFetchOrganisationPreferenceQuery.mockClear();
  });

  it('renders', () => {
    render(<EditUserProfile {...props} />);
    expect(screen.getByText('Jon Doe')).toBeInTheDocument();
    expect(screen.getByText('jondoe')).toBeInTheDocument();
  });

  it('renders first language in the list', async () => {
    const updateProps = {
      ...props,
      currentUser: {
        id: 1,
        username: 'Jsmith',
        firstname: 'Jon',
        lastname: 'Smith',
        email: 'jsmith@example.com',
        locale: null,
      },
      languages: [
        {
          value: null,
          label: 'No selected language',
        },
        {
          value: 'en',
          label: 'English',
        },
      ],
    };
    render(<EditUserProfile {...updateProps} />);
    const selectedLocale = await screen.findByText('No selected language');
    expect(selectedLocale).toBeInTheDocument();
  });

  it('shows correct validation error when Firstname is blank', async () => {
    render(<EditUserProfile {...props} />);
    const firstNameField = screen.getByLabelText('First Name');

    fireEvent.change(firstNameField, { target: { value: '' } });
    fireEvent.blur(firstNameField);

    const errorSpan = await screen.findByText('A value is required');
    expect(errorSpan).toBeInTheDocument();
  });

  it('shows correct validation error when Lastname is blank', async () => {
    render(<EditUserProfile {...props} />);
    const lastNameField = screen.getByLabelText('Last Name');

    fireEvent.change(lastNameField, { target: { value: '' } });
    fireEvent.blur(lastNameField);

    const errorSpan = await screen.findByText('A value is required');
    expect(errorSpan).toBeInTheDocument();
  });

  it('shows correct validation error when Email is blank', async () => {
    render(<EditUserProfile {...props} />);
    const emailField = screen.getByLabelText('Email');

    fireEvent.change(emailField, { target: { value: '' } });
    fireEvent.blur(emailField);

    const errorSpan = await screen.findByText('A value is required');
    expect(errorSpan).toBeInTheDocument();
  });

  it('shows the upload photo button', () => {
    render(<EditUserProfile {...props} />);
    const uploadButton = screen.getByText('Upload photo');
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toBeEnabled();
  });

  describe('Saving the form', () => {
    let origXhr;
    let xhr;
    let requests;
    let server;

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      requests = [];
      xhr.onCreate = (req) => {
        requests.push(req);
      };
      server = sinon.fakeServer.create();
    });

    afterEach(() => {
      xhr.restore();
      window.XMLHttpRequest = origXhr;
      server.restore();
    });

    it('sends the correct request to the server and calls the correct callbacks', async () => {
      render(<EditUserProfile {...props} />);

      userEvent.type(screen.getByLabelText('First Name'), 'Jane');
      userEvent.type(screen.getByLabelText('Last Name'), 'Doe');
      userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');

      fireEvent.click(screen.getByText('Update Profile'));

      await waitFor(() => {
        expect(props.saveUserFormStarted.called).toBe(true);
      });

      server.requests[0].respond(
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({ success: true })
      );

      await waitFor(() => {
        expect(props.saveUserFormSuccess.called).toBe(true);
        expect(props.saveUserFormFailure.called).toBe(false);
      });
    });

    it('updates the errors if server validation fails', async () => {
      render(<EditUserProfile {...props} />);
      userEvent.type(screen.getByLabelText('First Name'), 'Jane');
      userEvent.type(screen.getByLabelText('Last Name'), 'Doe');
      userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');

      userEvent.type(screen.getByLabelText('Current Password'), 'currentWrong');
      userEvent.type(screen.getByLabelText('New Password'), 'pass');
      userEvent.type(
        screen.getByLabelText('Confirm New Password'),
        'newPassword'
      );

      fireEvent.click(screen.getByText('Update Profile'));

      await waitFor(() => {
        expect(props.saveUserFormStarted.called).toBe(true);
      });

      server.requests[0].respond(
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({
          success: false,
          errors: {
            existing_password: ['is incorrect'],
            password: [
              'is known to be insecure and may not be used is too short (minimum is 8 characters)',
            ],
            password_confirmation: [`doesn't match Password`],
          },
        })
      );

      await waitFor(() => {
        expect(screen.getByText('is incorrect')).toBeInTheDocument();
        expect(
          screen.getByText(
            'is known to be insecure and may not be used is too short (minimum is 8 characters)'
          )
        ).toBeInTheDocument();
        expect(screen.getByText(`doesn't match Password`)).toBeInTheDocument();

        expect(props.saveUserFormSuccess.called).toBe(false);
        expect(props.saveUserFormFailure.called).toBe(true);
      });
    });
  });

  describe('Feature Flag: cp-athlete-avatars-prevent-fas-avatar-upload', () => {
    it('hides the upload photo button when the flag and org preference are true', () => {
      window.setFlag('cp-athlete-avatars-prevent-fas-avatar-upload', true);
      mockedUseFetchOrganisationPreferenceQuery.mockReturnValue({
        data: { value: true },
        isLoading: false,
      });

      render(<EditUserProfile {...props} />);

      expect(screen.queryByText('Upload photo')).not.toBeInTheDocument();
    });

    it('shows the upload photo button when the flag is true but org preference is false', () => {
      window.setFlag('cp-athlete-avatars-prevent-fas-avatar-upload', true);
      mockedUseFetchOrganisationPreferenceQuery.mockReturnValue({
        data: { value: false },
        isLoading: false,
      });

      render(<EditUserProfile {...props} />);

      expect(screen.getByText('Upload photo')).toBeInTheDocument();
    });

    it('shows the upload photo button when the flag is false', () => {
      window.setFlag('cp-athlete-avatars-prevent-fas-avatar-upload', false);
      mockedUseFetchOrganisationPreferenceQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      render(<EditUserProfile {...props} />);

      expect(screen.getByText('Upload photo')).toBeInTheDocument();
    });
  });
});
