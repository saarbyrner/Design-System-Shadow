import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  defaultMedicalPermissions,
  MockedPermissionContextProvider,
} from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import DeleteAttachmentContainer from '@kitman/modules/src/Medical/procedures/src/components/ProcedureOverviewTab/components/ProcedureDetails/components/DeleteAttachment/DeleteAttachmentContainer';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

describe('<DeleteProcedureAttachmentModal/>', () => {
  let store;
  const dispatchSpy = sinon.spy();

  beforeEach(() => {
    i18nextTranslateStub();
    store = storeFake({
      medicalApi: {},
      medicalHistory: {},
    });
    store.dispatch = dispatchSpy;
  });

  const props = {
    t: () => {},
    attachmentTitle: 'Test File',
    attachmentId: 83,
  };

  describe('[permissions] permissions.medical.attachments.canRemove', () => {
    beforeEach(() => {
      window.featureFlags['remove-attachments'] = true;
    });

    afterEach(() => {
      window.featureFlags['remove-attachments'] = false;
    });

    it('renders the actions buttons when permission is true', async () => {
      act(() => {
        render(
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                medical: {
                  ...defaultMedicalPermissions,
                  attachments: {
                    canRemove: true,
                  },
                },
              },
            }}
          >
            <Provider store={store}>
              <DeleteAttachmentContainer {...props} isOpen />
            </Provider>
          </MockedPermissionContextProvider>
        );
      });

      expect(screen.getByText('Delete Test File?')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Do you really want to delete this attachment? This process cannot be undone.'
        )
      ).toBeInTheDocument();

      // Check for modal action buttons
      const cancelButton = screen.getByRole('button', {
        name: 'Cancel',
        hidden: true,
      });

      const archiveButton = screen.getByRole('button', {
        name: 'Delete',
        hidden: true,
      });

      expect(cancelButton).toBeInTheDocument();
      expect(archiveButton).toBeInTheDocument();
    });
  });
});
