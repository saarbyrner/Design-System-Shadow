import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import * as formSelectors from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';

import useUpdateSection from '@kitman/modules/src/LeagueOperations/shared/hooks/useUpdateSection';
import useManageSection from '../hooks/useManageSection';

import Actions from '../components/Actions';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors'
);

jest.mock('../hooks/useManageSection');
jest.mock('@kitman/modules/src/LeagueOperations/shared/hooks/useUpdateSection');

const props = {
  t: i18nT,
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  formStateSlice: {
    structure: {
      form_template_version: {
        form_elements: [],
      },
    },
    config: {
      mode: 'VIEW',
    },
  },
  'LeagueOperations.registration.api.requirement.section': {},
  'LeagueOperations.registration.slice.requirements': {
    panel: {
      status: 'rejected_organisation',
    },
    approval: {
      status: 'pending_organisation',
      annotation: 'well bai',
    },
  },
  globalApi: {},
});

const renderWithProviders = ({ mode = 'VIEW' }) => {
  formSelectors.getModeFactory.mockReturnValue(() => mode);
  render(
    <Provider store={defaultStore}>
      <Actions {...props} />
    </Provider>
  );
};

const defaultUseUpdateSectionMock = {
  isLoading: false,
  isError: false,
  onUpdate: () => {},
};

const defaultUseManageSectionMock = {
  isSectionValid: false,
  isSectionEditable: false,
  isSectionApprovable: false,
  onToggleMode: () => {},
};

describe('<Actions/>', () => {
  describe('VIEW Mode', () => {
    beforeEach(() => {
      useUpdateSection.mockReturnValue(defaultUseUpdateSectionMock);
    });
    describe('isSectionEditable', () => {
      test('true', () => {
        useManageSection.mockReturnValue({
          ...defaultUseManageSectionMock,
          isSectionEditable: true,
        });
        renderWithProviders({ mode: 'VIEW' });
        const edit = screen.getByRole('button', { name: 'Edit' });
        expect(edit).toBeInTheDocument();
      });
      test('false', () => {
        useManageSection.mockReturnValue(defaultUseManageSectionMock);
        renderWithProviders({ mode: 'VIEW' });
        expect(() => screen.getByRole('button', { name: 'Edit' })).toThrow();
      });
    });
  });

  describe('EDIT Mode', () => {
    describe('isSectionEditable', () => {
      beforeEach(() => {
        useUpdateSection.mockReturnValue(defaultUseUpdateSectionMock);
      });
      test('true', () => {
        useManageSection.mockReturnValue({
          ...defaultUseManageSectionMock,
          isSectionEditable: true,
        });
        renderWithProviders({ mode: 'EDIT' });
        const save = screen.getByRole('button', { name: 'Save' });
        const cancel = screen.getByRole('button', { name: 'Cancel' });
        expect(save).toBeInTheDocument();
        expect(cancel).toBeInTheDocument();
      });
      test('false', () => {
        useManageSection.mockReturnValue(defaultUseManageSectionMock);
        renderWithProviders({ mode: 'EDIT' });
        expect(() => screen.getByRole('button', { name: 'Save' })).toThrow();
        expect(() => screen.getByRole('button', { name: 'Cancel' })).toThrow();
      });
    });

    describe('async issues', () => {
      beforeEach(() => {
        useManageSection.mockReturnValue({
          ...defaultUseManageSectionMock,
          isSectionEditable: true,
        });
      });
      it('disables the save button when isLoading', () => {
        useUpdateSection.mockReturnValue({
          ...defaultUseUpdateSectionMock,
          isLoading: true,
        });
        renderWithProviders({ mode: 'EDIT' });
        const save = screen.getByRole('button', { name: 'Save' });
        expect(save).toBeDisabled();
      });
      it('disables the button when isError', () => {
        useUpdateSection.mockReturnValue({
          ...defaultUseUpdateSectionMock,
          isError: true,
        });
        renderWithProviders({ mode: 'EDIT' });
        const save = screen.getByRole('button', { name: 'Save' });
        expect(save).toBeEnabled();
      });
    });
  });

  describe('APPROVAL flow', () => {
    beforeEach(() => {
      useUpdateSection.mockReturnValue(defaultUseUpdateSectionMock);
      useManageSection.mockReturnValue({
        ...defaultUseManageSectionMock,
        isSectionApprovable: true,
        isSubmitStatusDisabled: false,
      });
    });
    describe('isSectionApprovable', () => {
      test('true', () => {
        useManageSection.mockReturnValue({
          ...defaultUseManageSectionMock,
          isSectionApprovable: true,
        });
        renderWithProviders({});
        const submit = screen.getByRole('button', { name: 'Submit' });
        expect(submit).toBeInTheDocument();
      });
      test('false', () => {
        useManageSection.mockReturnValue(defaultUseManageSectionMock);
        renderWithProviders({});
        expect(() => screen.getByRole('button', { name: 'Submit' })).toThrow();
      });

      test('disabled', () => {
        useManageSection.mockReturnValue({
          ...defaultUseManageSectionMock,
          isSectionApprovable: true,
          isSubmitStatusDisabled: true,
        });
        renderWithProviders({});
        const submit = screen.getByRole('button', { name: 'Submit' });
        expect(submit).toBeDisabled();
      });
    });
  });
});
