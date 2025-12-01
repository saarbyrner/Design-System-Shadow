import { screen, act } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useAdditionalUsersForm from '@kitman/modules/src/AdditionalUsers/shared/hooks/useAdditionalUsersForm';
import {
  useCreateAdditionalUserMutation,
  useUpdateAdditionalUserMutation,
} from '@kitman/modules/src/AdditionalUsers/shared/redux/services';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import {
  useGetSquadsQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import AdditionalUsersForm from '../AdditionalUsersForm';

jest.mock('@kitman/common/src/hooks/useLocationAssign');

jest.mock(
  '@kitman/modules/src/AdditionalUsers/shared/hooks/useAdditionalUsersForm'
);

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetSquadsQuery: jest.fn(),
  useGetActiveSquadQuery: jest.fn(),
}));

jest.mock('@kitman/modules/src/AdditionalUsers/shared/redux/services', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/AdditionalUsers/shared/redux/services'
  ),
  useCreateAdditionalUserMutation: jest.fn(),
  useUpdateAdditionalUserMutation: jest.fn(),
}));

const props = {
  t: i18nextTranslateStub(),
};

const onCreateAdditionalUser = jest.fn();
const onUpdateAdditionalUser = jest.fn();
const locationAssign = jest.fn();

const renderComponent = async (component, { mode, userType, id }) => {
  useAdditionalUsersForm.mockReturnValue({
    isLoading: false,
    hasFailed: false,
    isSuccess: false,
    id,
    userType,
    mode,
  });

  useGetSquadsQuery.mockReturnValue({
    availableSquads: [
      { value: 1, label: 'Gryffindor' },
      { value: 2, label: 'Ravenclaw' },
    ],
  });

  useGetActiveSquadQuery.mockReturnValue({
    data: {
      name: 'Gryffindor',
      id: 1,
    },
  });

  useCreateAdditionalUserMutation.mockReturnValue([
    onCreateAdditionalUser.mockReturnValue(Promise.resolve()),
  ]);
  useUpdateAdditionalUserMutation.mockReturnValue([
    onUpdateAdditionalUser.mockReturnValue(Promise.resolve()),
  ]);

  useLocationAssign.mockReturnValue(locationAssign);

  await act(async () => {
    renderWithProviders(component);
  });
};

const expectFormElementsToBeInTheDocument = ({ userType, mode }) => {
  expect(screen.getByLabelText('First name')).toBeInTheDocument();
  expect(screen.getByLabelText('Last name')).toBeInTheDocument();
  expect(screen.getByLabelText('Language')).toBeInTheDocument();
  expect(screen.getByLabelText('DOB (optional)')).toBeInTheDocument();
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Role')).toBeInTheDocument();
  expect(screen.getByLabelText('Squad')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

  if (userType === 'scout') {
    expect(screen.getByLabelText('Organization')).toBeInTheDocument();
  } else {
    expect(screen.queryByLabelText('Organization')).not.toBeInTheDocument();
  }

  if (mode === 'EDIT') {
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  } else {
    expect(screen.queryByLabelText('Status')).not.toBeInTheDocument();
  }
};

describe('<AdditionalUsersForm />', () => {
  describe('New additional user is a scout', () => {
    beforeEach(async () => {
      useAdditionalUsersForm.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: false,
        id: null,
        userType: 'scout',
        mode: 'NEW',
      });
      await renderComponent(<AdditionalUsersForm {...props} />, {
        mode: 'NEW',
        userType: 'scout',
        id: null,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('Renders the correct form elements', () => {
      expect.assertions(11);
      expectFormElementsToBeInTheDocument({ mode: 'NEW', userType: 'scout' });
    });
    it('Preselects role as scout and save button is disabled', () => {
      expect(screen.queryByTestId('additional-user-role')).toHaveTextContent(
        'Scout'
      );
      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    it('Enables the save button and calls the onCreateAdditionalUser mutation with the correct params when all the fields are completed', async () => {
      const user = userEvent.setup();

      await user.type(screen.getByLabelText('First name'), 'Harry');
      await user.type(screen.getByLabelText('Last name'), 'Potter');

      const dateOfBirthField = screen.getByLabelText('DOB (optional)');
      await user.click(dateOfBirthField);
      await user.type(dateOfBirthField, '12/10/1994');

      await user.click(screen.getByLabelText('Language'));
      await user.click(screen.getByText('English'));

      await user.type(screen.getByLabelText('Email'), 'harry@gryffindor.com');

      await user.click(screen.getByLabelText('Squad'));
      await user.click(screen.getByText('Gryffindor'));

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeEnabled();

      await user.click(saveButton);

      expect(onCreateAdditionalUser).toHaveBeenCalledTimes(1);
      expect(onCreateAdditionalUser).toHaveBeenCalledWith({
        is_active: true,
        type: 'scout',
        firstname: 'Harry',
        lastname: 'Potter',
        email: 'harry@gryffindor.com',
        date_of_birth: '1994-12-10T00:00:00+00:00',
        locale: 'en',
        primary_squad: 1,
        assign_squad_ids: [1],
      });
    });
  });
  describe('New additional user is an official', () => {
    beforeEach(async () => {
      await renderComponent(<AdditionalUsersForm {...props} />, {
        mode: 'NEW',
        userType: 'official',
        id: null,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('Renders the correct form elements', () => {
      expect.assertions(11);
      expectFormElementsToBeInTheDocument({
        mode: 'NEW',
        userType: 'official',
      });
    });
    it('does not show the status field when creating a new official', () => {
      expect(screen.queryByLabelText('Status')).not.toBeInTheDocument();
    });

    it('Enables the save button and calls the onCreateAdditionalUser mutation with the correct params when all the fields are completed', async () => {
      const user = userEvent.setup();

      await user.type(screen.getByLabelText('First name'), 'Harry');
      await user.type(screen.getByLabelText('Last name'), 'Potter');

      const dateOfBirthField = screen.getByLabelText('DOB (optional)');
      await user.click(dateOfBirthField);
      await user.type(dateOfBirthField, '12/10/1994');

      await user.click(screen.getByLabelText('Language'));
      await user.click(screen.getByText('English'));

      await user.type(screen.getByLabelText('Email'), 'harry@gryffindor.com');

      await user.click(screen.getByLabelText('Squad'));
      await user.click(screen.getByText('Gryffindor'));

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeEnabled();

      await user.click(saveButton);

      expect(onCreateAdditionalUser).toHaveBeenCalledTimes(1);
      expect(onCreateAdditionalUser).toHaveBeenCalledWith({
        is_active: true,
        type: 'official',
        firstname: 'Harry',
        lastname: 'Potter',
        email: 'harry@gryffindor.com',
        date_of_birth: '1994-12-10T00:00:00+00:00',
        locale: 'en',
        primary_squad: 1,
        assign_squad_ids: [1],
      });
    });
  });

  describe('Editing an existing scout', () => {
    beforeEach(async () => {
      await renderComponent(<AdditionalUsersForm {...props} />, {
        mode: 'EDIT',
        userType: 'scout',
        id: 1,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('Renders the correct form elements', () => {
      expect.assertions(11);
      expectFormElementsToBeInTheDocument({ mode: 'EDIT', userType: 'scout' });
    });
    it('shows the status field and the organization field when editing a scout', async () => {
      expect(screen.getByLabelText('Status')).toBeInTheDocument();
      expect(screen.getByLabelText('Organization')).toBeInTheDocument();
    });

    it('Enables the save button and calls the onUpdateAdditionalUser mutation with the correct params when all the fields are completed', async () => {
      const user = userEvent.setup();

      await user.type(screen.getByLabelText('First name'), 'Harry');
      await user.type(screen.getByLabelText('Last name'), 'Potter');

      const dateOfBirthField = screen.getByLabelText('DOB (optional)');
      await user.click(dateOfBirthField);
      await user.type(dateOfBirthField, '12/10/1994');

      await user.click(screen.getByLabelText('Language'));
      await user.click(screen.getByText('English'));

      await user.type(screen.getByLabelText('Email'), 'harry@gryffindor.com');

      await user.click(screen.getByLabelText('Squad'));
      await user.click(screen.getByText('Gryffindor'));

      await user.type(screen.getByLabelText('Organization'), 'Hogwarts');

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeEnabled();

      await user.click(saveButton);

      expect(onUpdateAdditionalUser).toHaveBeenCalledTimes(1);
      expect(onUpdateAdditionalUser).toHaveBeenCalledWith({
        id: 1,
        user: {
          is_active: true,
          firstname: 'Harry',
          lastname: 'Potter',
          email: 'harry@gryffindor.com',
          date_of_birth: '1994-12-10T00:00:00+00:00',
          locale: 'en',
          primary_squad: 1,
          assign_squad_ids: [1],
          type: 'scout',
          additional_model_attributes: [
            {
              attribute_name: 'third_party_scout_organisation',
              value: 'Hogwarts',
            },
          ],
        },
      });
    });
  });

  describe('Editing an existing official', () => {
    beforeEach(async () => {
      await renderComponent(<AdditionalUsersForm {...props} />, {
        mode: 'EDIT',
        userType: 'official',
        id: 1,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('Renders the correct form elements', () => {
      expect.assertions(11);
      expectFormElementsToBeInTheDocument({
        mode: 'EDIT',
        userType: 'official',
      });
    });
    it('shows the status field and does not show the organisation field when editing an official', async () => {
      expect(screen.getByLabelText('Status')).toBeInTheDocument();
      expect(screen.queryByLabelText('Organization')).not.toBeInTheDocument();
    });

    it('Enables the save button and calls the onUpdateAdditionalUser mutation with the correct params when all the fields are completed', async () => {
      const user = userEvent.setup();

      await user.type(screen.getByLabelText('First name'), 'Harry');
      await user.type(screen.getByLabelText('Last name'), 'Potter');

      const dateOfBirthField = screen.getByLabelText('DOB (optional)');
      await user.click(dateOfBirthField);
      await user.type(dateOfBirthField, '12/10/1994');

      await user.click(screen.getByLabelText('Language'));
      await user.click(screen.getByText('English'));

      await user.type(screen.getByLabelText('Email'), 'harry@gryffindor.com');

      await user.click(screen.getByLabelText('Squad'));
      await user.click(screen.getByText('Gryffindor'));

      await user.click(screen.getByText('Active'));

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeEnabled();

      await user.click(saveButton);

      expect(onUpdateAdditionalUser).toHaveBeenCalledTimes(1);
      expect(onUpdateAdditionalUser).toHaveBeenCalledWith({
        id: 1,
        user: {
          is_active: true,
          firstname: 'Harry',
          lastname: 'Potter',
          email: 'harry@gryffindor.com',
          date_of_birth: '1994-12-10T00:00:00+00:00',
          locale: 'en',
          primary_squad: 1,
          assign_squad_ids: [1],
          type: 'official',
        },
      });
    });
  });
});
