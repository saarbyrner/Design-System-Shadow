import { I18nextProvider, setI18n } from 'react-i18next';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';

import i18n from '@kitman/common/src/utils/i18n';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { formTemplateMocks } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/search';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { formMetaDataMockData } from '@kitman/modules/src/FormTemplates/shared/consts';
import { REDUCER_KEY as FORM_BUILDER_REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import {
  REDUCER_KEY as FORM_TEMPLATES_REDUCER_KEY,
  initialState as formTemplatesInitialState,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplatesSlice';
import { initialState as formBuilderInitialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import {
  useGetQuestionBanksQuery,
  useSearchFormTemplatesQuery,
  useGetCategoriesQuery,
  useDeleteFormTemplateMutation,
} from '@kitman/services/src/services/formTemplates';
import { formCategoriesMock } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/getCategories';

import { FormTemplatesTranslated as FormTemplates } from '../index';
import { getColumns } from '../utils/helpers';

setI18n(i18n);

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useSearchFormTemplatesQuery: jest.fn(),
  useGetQuestionBanksQuery: jest.fn(),
  useGetCategoriesQuery: jest.fn(),
  useDeleteFormTemplateMutation: jest.fn(),
}));

describe('<FormTemplates />', () => {
  let deleteFormTemplateMutation;

  beforeEach(() => {
    useGetCategoriesQuery.mockReturnValue({ data: formCategoriesMock });

    useDeleteFormTemplateMutation.mockReturnValue([
      deleteFormTemplateMutation,
      { isLoading: false },
    ]);

    useSearchFormTemplatesQuery.mockReturnValue({
      refetch: jest.fn(),
      data: {
        data: formTemplateMocks,
        meta: {
          currentPage: 1,
          totalCount: formTemplateMocks.length,
          nextPage: 0,
          prevPage: 0,
          totalPages: 1,
        },
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
    });

    useGetQuestionBanksQuery.mockReturnValue({
      data: [],
      isSuccess: true,
    });
  });

  const renderComponent = () => {
    const { mockedStore, container } = renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <FormTemplates />
      </I18nextProvider>,
      {
        useGlobalStore: false,
        preloadedState: {
          [FORM_BUILDER_REDUCER_KEY]: {
            ...formBuilderInitialState,
            metaData: formMetaDataMockData,
          },
          [FORM_TEMPLATES_REDUCER_KEY]: {
            ...formTemplatesInitialState,
          },
        },
      }
    );
    return {
      mockedStore,
      container,
    };
  };

  it('should display the table properly', () => {
    const { mockedStore } = renderComponent();

    // columns
    const columns = getColumns(mockedStore.dispatch, false, undefined);
    columns
      .filter((column) => column.headerName)
      .forEach((column) => {
        expect(
          screen.getByRole('columnheader', { name: column.headerName })
        ).toBeInTheDocument();
      });

    // rows
    formTemplateMocks.forEach((formTemplate) => {
      expect(
        screen.getByRole('cell', { name: formTemplate.name })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('cell', {
          name: formTemplate.formCategory.productArea,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('cell', { name: formTemplate.formCategory.name })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('cell', { name: formTemplate.editor.name })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('cell', { name: formTemplate.name })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('cell', {
          name: formatStandard({ date: moment(formTemplate.createdAt) }),
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('cell', {
          name: formatStandard({ date: moment(formTemplate.updatedAt) }),
        })
      ).toBeInTheDocument();
    });
  });

  it('should display the Create Form button and clicking on it should trigger the side panel dispatch', async () => {
    const user = userEvent.setup();

    const { mockedStore } = renderComponent();

    await user.click(screen.getByRole('button', { name: 'Create Form' }));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: `${FORM_TEMPLATES_REDUCER_KEY}/toggleIsFormTemplateDrawerOpen`,
    });
  });

  it('should show pagination', () => {
    const manyTemplates = [];
    for (let i = 1; i < 51; i++) {
      manyTemplates.push({ ...formTemplateMocks[0], id: i });
    }

    // Adjust the mock for useSearchFormTemplatesQuery for this test case
    useSearchFormTemplatesQuery.mockReturnValue({
      refetch: jest.fn(),
      data: {
        data: manyTemplates,
        meta: {
          currentPage: 1,
          totalCount: manyTemplates.length,
          totalPages: 3,
        }, // Example meta
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
    });

    renderComponent();

    const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
    const page1Button = screen.getByRole('button', { name: 'page 1' });
    expect(page1Button).toHaveAttribute('aria-current', 'true');
    expect(page2Button).not.toHaveAttribute('aria-current', 'true');
  });

  it('should show Header', () => {
    renderComponent();

    expect(screen.getByText('Form Templates')).toBeInTheDocument();
  });

  it('should show Skeleton if loading', () => {
    useSearchFormTemplatesQuery.mockReturnValue({
      refetch: jest.fn(),
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
    });

    const { container } = renderComponent();

    expect(container.querySelectorAll('.MuiSkeleton-rectangular')).toHaveLength(
      200
    );
  });

  it('should show the menu items when the more button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Find the action menu button
    const actionButtons = await screen.findAllByRole('menuitem', {
      name: /more/i,
    });
    const moreButton = actionButtons[0];

    await user.click(moreButton);
    // Find and click the 'Assign Athlete' menu item that appears
    const assignAthleteMenuItem = await screen.findByRole('menuitem', {
      name: /assign athlete/i,
    });
    expect(assignAthleteMenuItem).toBeInTheDocument();
    // Find and click the 'Edit' menu item that appears
    const editMenuItem = await screen.findByRole('menuitem', { name: /edit/i });
    expect(editMenuItem).toBeInTheDocument();
    // Find and click the 'Delete' menu item that appears
    const deleteMenuItem = await screen.findByRole('menuitem', {
      name: /delete/i,
    });
    expect(deleteMenuItem).toBeInTheDocument();
  });

  describe('Settings button', () => {
    const originalLocationAssign = window.location.assign;

    beforeEach(() => {
      // Mock window.location.assign
      Object.defineProperty(window, 'location', {
        value: {
          assign: jest.fn(),
        },
        writable: true,
      });

      window.getFlag = jest.fn().mockReturnValue(true);
    });

    afterEach(() => {
      window.location.assign = originalLocationAssign;
      jest.restoreAllMocks();
    });

    it('should display the Settings button and navigate on click when feature flag is ON', async () => {
      const user = userEvent.setup();

      renderComponent();

      const settingsButton = screen.getByTestId('SettingsOutlinedIcon');

      expect(settingsButton).toBeInTheDocument();

      await user.click(settingsButton);

      expect(window.location.assign).toHaveBeenCalledWith(
        '/forms/form_templates/settings'
      );
    });

    it('should not display the Settings button when feature flag is OFF', () => {
      window.getFlag = jest.fn().mockReturnValue(false);

      renderComponent();

      const settingsButton = screen.queryByTestId('SettingsOutlinedIcon');

      expect(settingsButton).not.toBeInTheDocument();
    });
  });
});
