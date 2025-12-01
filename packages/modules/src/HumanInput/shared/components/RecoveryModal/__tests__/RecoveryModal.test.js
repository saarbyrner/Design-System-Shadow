import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { initializeRepeatableGroupsValidation } from '@kitman/modules/src/HumanInput/hooks/helperHooks/usePopulateFormState';
import i18n from '@kitman/common/src/utils/i18n';

import {
  onHideRecoveryModal,
  onUpdateField,
} from '../../../redux/slices/formStateSlice';
import { onUpdateValidation } from '../../../redux/slices/formValidationSlice';
import RecoveryModal from '..';

jest.mock(
  '@kitman/modules/src/HumanInput/hooks/helperHooks/usePopulateFormState',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/HumanInput/hooks/helperHooks/usePopulateFormState'
    ),
    initializeRepeatableGroupsValidation: jest.fn(),
  })
);

setI18n(i18n);

const mockElement1 = { id: 101, config: { text: 'Text Input' } };
const mockElement2 = { id: 102, config: { text: 'Number Input' } };
const mockElement3 = { id: 103, config: { text: 'Unchanged Input' } };

const mockStructure = {
  form_template_version: {
    id: 'form-template-1',
    updated_at: '2025-10-29T10:00:00.000Z',
    form_elements: [mockElement1, mockElement2, mockElement3],
  },
  form: {
    id: 1,
  },
  athlete: {
    id: 123,
  },
};

const basePreloadedState = {
  formStateSlice: {
    form: {
      101: 'server value',
      102: 5,
      103: 'same value',
    },
    elements: {},
    structure: { athlete: { id: 123 } },
    config: {
      showRecoveryModal: false,
      localDraft: null,
    },
  },
};

describe('RecoveryModal', () => {
  let user;
  let mockLocalStorage;

  beforeEach(() => {
    user = userEvent.setup();
    // Mock localStorage
    mockLocalStorage = {
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  it('should not render when showRecoveryModal is false', () => {
    renderWithRedux(<RecoveryModal />, {
      preloadedState: basePreloadedState,
      useGlobalStore: false,
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  describe('when a local draft is present', () => {
    const preloadedStateWithDraft = {
      formStateSlice: {
        ...basePreloadedState.formStateSlice,
        structure: mockStructure,
        config: {
          showRecoveryModal: true,
          localDraft: {
            timestamp: '2025-10-29T11:00:00.000Z',
            data: {
              101: 'local draft value', // Changed
              102: 10, // Changed
              103: 'same value', // Unchanged
            },
          },
        },
      },
    };

    it('should render the modal with correct content and timestamps', () => {
      renderWithRedux(<RecoveryModal />, {
        preloadedState: preloadedStateWithDraft,
        useGlobalStore: false,
      });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Unsaved changes found')).toBeInTheDocument();
      expect(screen.getByText('Restore local version')).toBeInTheDocument();
      expect(screen.getByText('Discard')).toBeInTheDocument();

      // Check for formatted timestamps
      const localTimestamp = new Date(
        '2025-10-29T11:00:00.000Z'
      ).toLocaleString();
      const serverTimestamp = new Date(
        '2025-10-29T10:00:00.000Z'
      ).toLocaleString();

      expect(
        screen.getByText(localTimestamp, { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.getByText(serverTimestamp, { exact: false })
      ).toBeInTheDocument();
    });

    it('should dispatch onHideRecoveryModal and clear localStorage when discard is clicked', async () => {
      const { mockedStore } = renderWithRedux(<RecoveryModal />, {
        preloadedState: preloadedStateWithDraft,
        useGlobalStore: false,
      });

      const discardButton = screen.getByRole('button', { name: 'Discard' });
      await user.click(discardButton);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'autosave_form_1_123'
      );
      expect(mockedStore.dispatch).toHaveBeenCalledWith(onHideRecoveryModal());
    });

    it('should dispatch actions only for changed fields when restore is clicked', async () => {
      const { mockedStore } = renderWithRedux(<RecoveryModal />, {
        preloadedState: preloadedStateWithDraft,
        useGlobalStore: false,
      });

      const restoreButton = screen.getByRole('button', {
        name: 'Restore local version',
      });
      await user.click(restoreButton);

      // Wait for the restore process to complete
      await waitFor(() => {
        expect(mockedStore.dispatch).toHaveBeenCalledWith(
          onHideRecoveryModal()
        );
      });

      // Check that actions were dispatched only for the 2 changed fields
      // Verify that onUpdateField and onUpdateValidation were dispatched for each changed field
      expect(mockedStore.dispatch).toHaveBeenCalledWith(
        onUpdateField({ 101: 'local draft value' })
      );
      expect(mockedStore.dispatch).toHaveBeenCalledWith(
        onUpdateValidation({ 101: { status: 'VALID', message: null } })
      );

      expect(mockedStore.dispatch).toHaveBeenCalledWith(
        onUpdateField({ 102: 10 })
      );
      expect(mockedStore.dispatch).toHaveBeenCalledWith(
        onUpdateValidation({ 102: { status: 'VALID', message: null } })
      );

      // Ensure actions were not dispatched for the unchanged field
      expect(mockedStore.dispatch).not.toHaveBeenCalledWith(
        onUpdateField({ 103: 'same value' })
      );
      expect(mockedStore.dispatch).not.toHaveBeenCalledWith(
        onUpdateValidation(expect.objectContaining({ 103: expect.any(Object) }))
      );

      // Ensure no other validation helpers were called
      expect(initializeRepeatableGroupsValidation).not.toHaveBeenCalled();

      // Verify localStorage was cleared
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        'autosave_form_1_123'
      );
    });
  });
});
