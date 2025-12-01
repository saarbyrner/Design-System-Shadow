import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  storeFake,
  renderWithProvider,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';

import {
  mockedIssueContextValue,
  MockedIssueContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/IssueContext/utils/mocks';
import { occurrenceTypeEnumLike } from '@kitman/modules/src/Medical/issues/src/enumLikes';
import IssueHeader from '@kitman/modules/src/Medical/issues/src/components/IssueHeader';

const store = storeFake({
  globalApi: {},
  medicalApi: {},
  medicalSharedApi: {},
  medicalHistory: {},
});

const defaultProps = {
  t: i18nextTranslateStub(),
  onEnterEditMode: jest.fn(),
  editActionDisabled: false,
};

const renderComponent = ({
  props = defaultProps,
  permissions = DEFAULT_CONTEXT_VALUE.permissions,
} = {}) =>
  renderWithProvider(
    <PermissionsContext.Provider
      value={{
        permissions: {
          ...permissions,
        },
        permissionsRequestStatus: 'SUCCESS',
      }}
    >
      <MockedIssueContextProvider issueContext={mockedIssueContextValue}>
        <IssueHeader {...props} />
      </MockedIssueContextProvider>
    </PermissionsContext.Provider>,
    store
  );

describe('<IssueHeader />', () => {
  describe('IssueHeader', () => {
    it('renders the default view', async () => {
      renderComponent();

      expect(
        screen.queryByRole('button', { name: 'Edit' })
      ).not.toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');

      expect(listItems[0]).toHaveTextContent(
        `Type: ${occurrenceTypeEnumLike.recurrence}`
      );
      expect(listItems[1]).toHaveTextContent('Squad: First Team');
      expect(listItems[2]).toHaveTextContent('Added on: Feb 10, 2022');
      expect(listItems[3]).toHaveTextContent('Added by: Hugo Beuzeboc');
    });

    it('renders the action buttons with the correct permissions', async () => {
      renderComponent({
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          medical: {
            issues: {
              canEdit: true,
            },
          },
        },
      });

      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });
  });

  describe('EditView', () => {
    it('renders the edit view when clicked', async () => {
      const user = userEvent.setup();

      renderComponent({
        permissions: {
          ...DEFAULT_CONTEXT_VALUE.permissions,
          medical: {
            issues: {
              canEdit: true,
            },
          },
        },
      });

      const editButton = screen.getByRole('button', { name: 'Edit' });

      expect(editButton).toBeInTheDocument();

      await user.click(editButton);

      expect(
        screen.getByRole('button', { name: 'Discard changes' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });
  });
});
