import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';

import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { data as categoriesData } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/fetchGenericDocumentsCategories';
import { DocumentsHeaderTranslated as DocumentsHeader } from '..';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
}));

describe('<DocumentsHeader />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
    handleOnClosePanel: jest.fn(),
  };

  const localState = {
    genericDocumentsSlice: {
      genericDocumentsCategories: categoriesData,
    },
  };

  const addButtonText = 'Add';

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        settings: { canManageStaffUsers: true },
      },
    });
  });

  it('renders content of the documents header', () => {
    renderWithProviders(<DocumentsHeader {...props} />, {
      preloadedState: localState,
    });

    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: addButtonText })
    ).toBeInTheDocument();
  });

  it('renders content of the dropdowns filters', async () => {
    renderWithProviders(<DocumentsHeader {...props} />, {
      preloadedState: localState,
    });
    const statusFilter = screen.getByLabelText('Status');
    const categoryFilter = screen.getByLabelText('Category');

    expect(categoryFilter).toBeInTheDocument();
    expect(statusFilter).toBeInTheDocument();

    await userEvent.click(statusFilter);

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Expired')).toBeInTheDocument();
    expect(screen.getByText('Future')).toBeInTheDocument();

    await userEvent.click(categoryFilter);

    expect(screen.getByText('Certificate')).toBeInTheDocument();
    expect(screen.getByText('Qualification')).toBeInTheDocument();
  });

  it('does not show the add button if the user does not have edit permissions', () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        settings: { canManageStaffUsers: false },
      },
    });
    renderWithProviders(<DocumentsHeader {...props} />, {
      preloadedState: localState,
    });

    expect(
      screen.queryByRole('button', { name: addButtonText })
    ).not.toBeInTheDocument();
  });
});
