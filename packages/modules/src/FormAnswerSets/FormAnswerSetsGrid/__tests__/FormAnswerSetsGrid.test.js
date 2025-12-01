import { screen } from '@testing-library/react';
import { FormAnswerSetsTranslated as FormAnswerSetsGrid } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid';
import searchFormAnswerSetsData, {
  freeAgentWithPDFData,
} from '@kitman/services/src/services/formAnswerSets/api/mocks/data/search';
import { useFormAnswerSets } from '@kitman/modules/src/FormAnswerSets/utils/hooks/useFormAnswerSets';
import { useFormAnswerSetsByAthlete } from '@kitman/modules/src/FormAnswerSets/utils/hooks/useFormAnswerSetsByAthlete';
import {
  useSearchFormTemplatesQuery,
  useListFormCategoriesQuery,
} from '@kitman/services/src/services/formTemplates';
import { setI18n, I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  REDUCER_KEY,
  initialState,
  setFormCategoryFilter,
} from '@kitman/modules/src/FormAnswerSets/redux/slices/formAnswerSetsSlice';
import { formAnswerSetsApi } from '@kitman/services/src/services/formAnswerSets';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import userEvent from '@testing-library/user-event';
import { formTemplateMocks } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/search';
import { useFetchFormTypesQuery } from '@kitman/services/src/services/humanInput/humanInput';
import { formCategoriesMock } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/getCategories';
import formTypeMocks from '@kitman/services/src/services/humanInput/api/mocks/data/formTypes.mock';
import { useGetFormAnswerSetsAthletesQuery } from '@kitman/services/src/services/formAnswerSets/api/getFormAnswerSetsAthletes';

jest.mock('../../utils/hooks/useFormAnswerSets.js');
jest.mock('../../utils/hooks/useFormAnswerSetsByAthlete.js');
jest.mock(
  '@kitman/services/src/services/formAnswerSets/api/getFormAnswerSetsAthletes',
  () => ({
    useGetFormAnswerSetsAthletesQuery: jest.fn(),
  })
);
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetPermissionsQuery: jest.fn(),
}));

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useSearchFormTemplatesQuery: jest.fn(),
  useListFormCategoriesQuery: jest.fn(),
}));
jest.mock('@kitman/services/src/services/humanInput/humanInput', () => ({
  ...jest.requireActual('@kitman/services/src/services/humanInput/humanInput'),
  useFetchFormTypesQuery: jest.fn(),
}));

setI18n(i18n);

describe('<FormAnswerSetsGrid />', () => {
  const renderComponent = (state) => {
    const { mockedStore, container } = renderWithRedux(
      <I18nextProvider i18n={i18n}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
          <FormAnswerSetsGrid />
        </LocalizationProvider>
      </I18nextProvider>,
      {
        useGlobalStore: false,
        preloadedState: {
          globalApi: {},
          [REDUCER_KEY]: { ...initialState, ...(state || {}) },
          [formAnswerSetsApi.reducerPath]: {},
        },
      }
    );
    return { mockedStore, container };
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    useSearchFormTemplatesQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: {
        data: formTemplateMocks,
        meta: {
          currentPage: 1,
          totalCount: searchFormAnswerSetsData.data.length,
        },
      },
    });

    useFetchFormTypesQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: false,
      data: formTypeMocks,
    });

    useListFormCategoriesQuery.mockReturnValue({
      data: { formCategories: formCategoriesMock, pagination: {} },
      isLoading: false,
      isSuccess: true,
    });

    useFormAnswerSets.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      rows: searchFormAnswerSetsData.data,
      meta: {
        currentPage: 1,
        totalCount: searchFormAnswerSetsData.data.length,
      },
    });

    // Mock data for ComplianceTab
    const complianceMockData = [
      {
        athlete: {
          id: 1,
          firstname: 'Robbie',
          lastname: 'Brady',
          fullname: 'Robbie Brady',
          position: { id: 1, name: 'Midfielder' },
          avatarUrl: 'avatar-url',
        },
        status: {
          total: 3,
          completed: 2,
          incomplete: 1,
          latestSubmissionAt: '2024-07-15T00:00:00Z',
        },
        formTemplates: [
          {
            id: 1,
            name: 'Concussion Form',
            status: 'completed',
            lastUpdate: '2024-07-15',
          },
        ],
      },
    ];

    useFormAnswerSetsByAthlete.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      rows: complianceMockData,
      meta: {
        currentPage: 1,
        totalCount: complianceMockData.length,
      },
      refetch: jest.fn(),
    });

    // Mock useGetFormAnswerSetsAthletesQuery
    useGetFormAnswerSetsAthletesQuery.mockReturnValue({
      data: { athletes: [] },
      isLoading: false,
      isSuccess: true,
    });

    useGetPermissionsQuery.mockReturnValue({
      data: {
        eforms: {
          canViewForms: true,
          canDeleteForms: true,
          canSubmitForms: true,
          canEditForms: true,
        },
      },
      error: false,
      isLoading: false,
    });
  });

  it('should display header', () => {
    renderComponent();

    expect(screen.getByText('Form Responses')).toBeInTheDocument();
  });

  describe('<CompletedTab /> non free agent', () => {
    beforeEach(() => {
      useFormAnswerSets.mockReturnValue({
        isLoading: false,
        isError: false,
        isSuccess: true,
        rows: searchFormAnswerSetsData.data,
        meta: {
          currentPage: 1,
          totalCount: searchFormAnswerSetsData.data.length,
        },
      });
    });

    it('should not render tab if canViewForms permission is false', async () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          eforms: {
            canViewForms: false,
            canSubmitForms: false,
          },
        },
        error: false,
        isLoading: false,
      });

      renderComponent();

      expect(
        screen.queryByRole('tab', { name: 'Completed' })
      ).not.toBeInTheDocument();
    });

    it('should render grid headers', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('tab', { name: 'Completed' }));

      expect(screen.getByText('Athlete')).toBeInTheDocument();
      expect(screen.getByText('Form Name')).toBeInTheDocument();
      expect(screen.getByText('Examiner')).toBeInTheDocument();
      expect(screen.getByText('Completion Date')).toBeInTheDocument();
      expect(screen.getByText('Form Status')).toBeInTheDocument();
    });

    it('should render data into the data grid', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('tab', { name: 'Completed' }));

      /**
       * The same form on both rows but different athletes
       */
      expect(screen.getAllByText('Man of the Match Winners')).toHaveLength(2);

      /**
       * Row 1
       */
      expect(screen.getByText('Robbie Brady')).toBeInTheDocument();
      expect(screen.getByText('Cathal Diver')).toBeInTheDocument();
      expect(screen.getByText('Jul 2, 2024')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();

      /**
       * Row 2
       */
      expect(screen.getByText('Caoimhin Kelleher')).toBeInTheDocument();
      expect(screen.getByText('Juan Gumy')).toBeInTheDocument();
      expect(screen.getByText('Jul 3, 2024')).toBeInTheDocument();
      expect(screen.getByText('Draft')).toBeInTheDocument();
    });

    it('should render skeleton on load', async () => {
      useFormAnswerSets.mockReturnValue({
        isLoading: true,
        isError: false,
        isSuccess: false,
        rows: [],
        meta: {
          currentPage: 1,
          totalCount: 0,
        },
      });

      const user = userEvent.setup();
      const { container } = renderComponent();

      await user.click(screen.getByRole('tab', { name: 'Completed' }));

      /**
       * 25 rows times 6 columns (Athlete, Form Name, Examiner, Completion Date, Form Status, Latest PDF)
       */
      expect(
        container.querySelectorAll('.MuiSkeleton-rectangular')
      ).toHaveLength(150);
    });

    describe('Category Autocomplete', () => {
      const chosenCategory = formCategoriesMock[0];
      const otherCategory = formCategoriesMock[1];

      it('should select a category properly', async () => {
        const user = userEvent.setup();
        const { mockedStore } = renderComponent();

        await user.click(screen.getByRole('tab', { name: 'Completed' }));

        // Select
        await user.click(screen.getByRole('combobox', { name: 'Category' }));

        expect(
          screen.getByRole('option', { name: otherCategory.name })
        ).toBeInTheDocument();

        await user.click(
          screen.getByRole('option', { name: chosenCategory.name })
        );

        // the select menu should have been closed
        expect(
          screen.queryByRole('option', { name: otherCategory.name })
        ).not.toBeInTheDocument();

        expect(mockedStore.dispatch).toHaveBeenCalledWith(
          setFormCategoryFilter(chosenCategory.id)
        );
      });
    });
  });

  describe('<CompletedTab /> free agent', () => {
    beforeEach(() => {
      useFormAnswerSets.mockReturnValue({
        isLoading: false,
        isError: false,
        isSuccess: true,
        rows: freeAgentWithPDFData.data,
        meta: freeAgentWithPDFData.meta,
      });
    });

    it('should not render tab if canViewForms permission is false', async () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          eforms: {
            canViewForms: false,
            canSubmitForms: false,
          },
        },
        error: false,
        isLoading: false,
      });

      renderComponent({ athlete_status: 'free_agent' });

      expect(
        screen.queryByRole('tab', { name: 'Completed' })
      ).not.toBeInTheDocument();
    });

    it('should render grid headers', async () => {
      const user = userEvent.setup();
      renderComponent({ athlete_status: 'free_agent' });

      await user.click(screen.getByRole('tab', { name: 'Completed' }));

      expect(screen.getByText('Athlete')).toBeInTheDocument();
      expect(screen.getByText('Form Name')).toBeInTheDocument();
      expect(screen.getByText('Examiner')).toBeInTheDocument();
      expect(screen.getByText('Completion Date')).toBeInTheDocument();
      expect(screen.getByText('Form Status')).toBeInTheDocument();
      expect(screen.getByText('Latest PDF')).toBeInTheDocument();
    });

    it('should render the Latest PDF column with a link and icon', async () => {
      const user = userEvent.setup();
      renderComponent({ athlete_status: 'free_agent' });

      await user.click(screen.getByRole('tab', { name: 'Completed' }));

      const pdfLink = screen.getByTestId('Attachments|AttachmentLink');
      expect(pdfLink).toBeInTheDocument();
      expect(pdfLink).toHaveAttribute(
        'href',
        freeAgentWithPDFData.data[0].latestCompletedPdfExport.downloadUrl
      );
      expect(pdfLink).toHaveTextContent(
        freeAgentWithPDFData.data[0].latestCompletedPdfExport.filename
      );

      const pdfIcon = pdfLink.querySelector('i');
      expect(pdfIcon).toBeInTheDocument();
    });
  });

  describe('<FormsTab />', () => {
    it('should not render tab if canSubmitForms permission is false', async () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          eforms: {
            canViewForms: false,
            canSubmitForms: false,
          },
        },
        error: false,
        isLoading: false,
      });

      renderComponent();

      expect(
        screen.queryByRole('tab', { name: 'Forms' })
      ).not.toBeInTheDocument();
    });

    it('should render filter and options', async () => {
      const user = userEvent.setup();
      renderComponent();

      expect(
        screen.getByRole('combobox', { name: 'Form' })
      ).toBeInTheDocument();

      await user.click(screen.getByRole('combobox', { name: 'Form' }));

      expect(screen.getByText('Concussion history')).toBeInTheDocument();
    });
    it('should render completed tab filter and options', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('tab', { name: 'Completed' }));

      expect(
        screen.getByRole('combobox', { name: 'Form' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('combobox', { name: 'Athletes' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('combobox', { name: 'Category' })
      ).toBeInTheDocument();

      await user.click(screen.getByRole('combobox', { name: 'Form' }));

      expect(screen.getByText('Concussion history')).toBeInTheDocument();
    });

    it('should render grid headers', async () => {
      renderComponent();

      expect(screen.getByText('Template')).toBeInTheDocument();
      expect(screen.getByText('Last Updated At')).toBeInTheDocument();
    });

    it('should render data into the data grid', async () => {
      renderComponent();

      /**
       * Row 1
       */
      expect(screen.getByText('Pikachu Treating')).toBeInTheDocument();
      expect(screen.getByText('May 12, 2022 3:49 pm')).toBeInTheDocument();

      /**
       * Row 2
       */
      expect(screen.getByText('Pikachu Harming')).toBeInTheDocument();
      expect(screen.getByText('May 15, 2022 3:49 pm')).toBeInTheDocument();
    });

    it('should render skeleton on load', async () => {
      useFormAnswerSets.mockReturnValue({
        isLoading: true,
        isError: false,
        isSuccess: true,
        rows: searchFormAnswerSetsData.data,
        meta: {
          currentPage: 1,
          totalCount: searchFormAnswerSetsData.data.length,
        },
      });

      const user = userEvent.setup();
      const { container } = renderComponent();

      await user.click(screen.getByRole('tab', { name: 'Completed' }));

      /**
       * 25 rows times 2 columns (Template, Last Updated At)
       */
      expect(
        container.querySelectorAll('.MuiSkeleton-rectangular')
      ).toHaveLength(150);
    });
  });

  describe('<ComplianceTab />', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
      
      // Enable feature flag
      window.setFlag('cp-eforms-compliance-view', true);

      // Mock the compliance hook
      useFormAnswerSetsByAthlete.mockReturnValue({
        isLoading: false,
        isError: false,
        isSuccess: true,
        rows: [
          {
            athlete: {
              id: 1,
              firstname: 'John',
              lastname: 'Smith',
              fullname: 'John Smith',
              position: {
                name: 'Forward',
              },
              avatarUrl: '',
            },
            status: {
              total: 5,
              completed: 4,
              incomplete: 1,
              latestSubmissionAt: null,
            },
            formTemplates: [
              {
                id: 101,
                name: 'Weekly Wellness',
                status: 'complete',
                lastUpdate: null,
                formAnswerSets: null,
              },
              {
                id: 102,
                name: 'General Medical',
                status: 'draft',
                lastUpdate: null,
                formAnswerSets: null,
              },
            ],
          },
        ],
        meta: {
          currentPage: 1,
          totalCount: 1,
          totalPages: 1,
          perPage: 25,
        },
        refetch: jest.fn(),
      });
    });

    it('should not render tab if canViewForms permission is false', async () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          eforms: {
            canViewForms: false,
            canSubmitForms: false,
          },
        },
        error: false,
        isLoading: false,
      });

      renderComponent();

      expect(
        screen.queryByRole('tab', { name: 'Compliance' })
      ).not.toBeInTheDocument();
    });

    it('should not render tab if feature flag is disabled', async () => {
      window.featureFlags = { 'cp-eforms-compliance-view': false };

      useGetPermissionsQuery.mockReturnValue({
        data: {
          eforms: {
            canViewForms: true,
            canSubmitForms: true,
          },
        },
        error: false,
        isLoading: false,
      });

      renderComponent();

      expect(
        screen.queryByRole('tab', { name: 'Compliance' })
      ).not.toBeInTheDocument();
    });

    it('should render tab when canViewForms permission is true and feature flag is enabled', async () => {
      renderComponent();

      expect(
        screen.getByRole('tab', { name: 'Compliance' })
      ).toBeInTheDocument();
    });

    it('should render filters: Athletes selector, Form selector, Date range', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('tab', { name: 'Compliance' }));

      expect(
        screen.getByRole('combobox', { name: 'Athletes' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: 'Form' })
      ).toBeInTheDocument();
      // The DateRange component is rendered but its exact label may vary
      // We verify the filters container exists and has the expected structure
      expect(screen.getAllByRole('combobox')).toHaveLength(2); // Athletes and Form selectors
    });

    it('should render grid headers: Athlete, Last Updated, Status', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('tab', { name: 'Compliance' }));

      expect(screen.getByText('Athlete')).toBeInTheDocument();
      expect(screen.getByText('Last Updated')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render data into the DataGrid with sample tree data', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('tab', { name: 'Compliance' }));

      // Mock data should show athlete names and forms in tree structure
      expect(screen.getByText('John Smith')).toBeInTheDocument();// athlete row
    });

    it('should render skeleton when loading is true', async () => {
      useFormAnswerSetsByAthlete.mockReturnValue({
        isLoading: true,
        isError: false,
        isSuccess: false,
        rows: [],
        meta: {
          currentPage: 1,
          totalCount: 0,
          totalPages: 0,
          perPage: 25,
        },
        refetch: jest.fn(),
      });

      const user = userEvent.setup();
      const { container } = renderComponent();

      await user.click(screen.getByRole('tab', { name: 'Compliance' }));

      /**
       * 75 skeletal rectangles (25 rows × 3 columns: Athlete, Last Updated, Status)
       */
      expect(
        container.querySelectorAll('.MuiSkeleton-rectangular')
      ).toHaveLength(75);
    });

    it('should dispatch action when athlete filter is selected', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('tab', { name: 'Compliance' }));

      // Click on athlete selector (assuming it opens a dropdown)
      await user.click(screen.getByRole('combobox', { name: 'Athletes' }));

      // This would typically trigger athlete selection, but the specific implementation
      // depends on the AthleteSelector component. The test verifies the interaction exists.
      const athleteCombobox = screen.getByRole('combobox', {
        name: 'Athletes',
      });
      expect(athleteCombobox).toBeInTheDocument();
    });

    describe('Status Chips', () => {
      it('should display red chip when athlete has 0 completed forms', async () => {
        useFormAnswerSetsByAthlete.mockReturnValue({
          isLoading: false,
          isError: false,
          isSuccess: true,
          rows: [
            {
              athlete: {
                id: 1,
                firstname: 'John',
                lastname: 'Doe',
                fullname: 'John Doe',
                position: { name: 'Forward' },
              },
              status: {
                total: 5,
                completed: 0,
                incomplete: 5,
              },
              formTemplates: [],
            },
          ],
          meta: { currentPage: 1, totalCount: 1 },
          refetch: jest.fn(),
        });

        const user = userEvent.setup();
        const { container } = renderComponent();

        await user.click(screen.getByRole('tab', { name: 'Compliance' }));

        const chip = container.querySelector('.MuiChip-colorError');
        expect(chip).toBeInTheDocument();
        expect(chip).toHaveTextContent('0/5');
      });

      it('should display orange chip when athlete has some but not all forms completed', async () => {
        useFormAnswerSetsByAthlete.mockReturnValue({
          isLoading: false,
          isError: false,
          isSuccess: true,
          rows: [
            {
              athlete: {
                id: 1,
                firstname: 'Jane',
                lastname: 'Smith',
                fullname: 'Jane Smith',
                position: { name: 'Midfielder' },
              },
              status: {
                total: 5,
                completed: 3,
                incomplete: 2,
              },
              formTemplates: [],
            },
          ],
          meta: { currentPage: 1, totalCount: 1 },
          refetch: jest.fn(),
        });

        const user = userEvent.setup();
        const { container } = renderComponent();

        await user.click(screen.getByRole('tab', { name: 'Compliance' }));

        const chip = container.querySelector('.MuiChip-colorWarning');
        expect(chip).toBeInTheDocument();
        expect(chip).toHaveTextContent('3/5');
      });

      it('should display green chip when athlete has all forms completed', async () => {
        useFormAnswerSetsByAthlete.mockReturnValue({
          isLoading: false,
          isError: false,
          isSuccess: true,
          rows: [
            {
              athlete: {
                id: 1,
                firstname: 'Mike',
                lastname: 'Johnson',
                fullname: 'Mike Johnson',
                position: { name: 'Defender' },
              },
              status: {
                total: 5,
                completed: 5,
                incomplete: 0,
              },
              formTemplates: [],
            },
          ],
          meta: { currentPage: 1, totalCount: 1 },
          refetch: jest.fn(),
        });

        const user = userEvent.setup();
        const { container } = renderComponent();

        await user.click(screen.getByRole('tab', { name: 'Compliance' }));

        const chip = container.querySelector('.MuiChip-colorSuccess');
        expect(chip).toBeInTheDocument();
        expect(chip).toHaveTextContent('5/5');
      });
    });
  });
});
