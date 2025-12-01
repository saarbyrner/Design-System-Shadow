import {
  screen,
  render,
  waitFor,
  act,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import moment from 'moment-timezone';
import { Provider } from 'react-redux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  useGetAthleteDataQuery,
  useGetAncillaryEligibleRangesQuery,
  useGetPathologiesMultiCodingV2Query,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { data as mockAthleteData } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_athlete_list';
import getInjuryOnset from '@kitman/services/src/services/medical/getInjuryOnset';
import data from '@kitman/services/src/mocks/handlers/medical/osics/data.mock';
import {
  i18nextTranslateStub,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import { filterPathologiesMultiCodingV2Data } from '@kitman/services/src/mocks/handlers/medical/pathologies';
import { data as mockCodingSystemSides } from '@kitman/services/src/mocks/handlers/medical/getCodingSystemSides';
import { colors } from '@kitman/common/src/variables';
import getCodingSystemSides from '@kitman/services/src/services/medical/getCodingSystemSides';
import OSIICS15 from '../OSIICS15';

jest.mock('@kitman/services/src/services/medical/getCodingSystemSides');
jest.mock('@kitman/services/src/services/medical/getInjuryOnset');
jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAthleteDataQuery: jest.fn(),
    useGetAncillaryEligibleRangesQuery: jest.fn(),
    useGetPathologiesMultiCodingV2Query: jest.fn(),
  })
);

const WAIT_FOR_TIMEOUT = { timeout: 4000 };

const mockInjuryOnsetOptions = [
  {
    label: 'Acute',
    value: 3,
  },
  {
    label: 'Chronic',
    value: 4,
  },
  {
    label: 'Gradual',
    value: 5,
  },
  {
    label: 'Overuse',
    value: 1,
  },
  {
    label: 'Traumatic',
    value: 2,
  },
  {
    label: 'Other',
    value: 6,
    requiresText: true,
  },
];

const organisationCodingSystemData = {
  data: {
    coding_system: {
      id: 5,
      name: 'OSIICS-15',
      key: 'osiics_15',
    },
    coding_system_key: 'osiics_15',
  },
  isSuccess: true,
};

const mockSelectedCoding = {
  coding_system: {
    coding_system_pathology_id: 1392,
    groups: ['all_injuries'],
  },
};

const mockDetails = {
  supplementalPathology: null,
  examinationDate: '2025-07-14T23:00:00+01:00',
  occurrenceDate: '2025-06-23T00:00:00+01:00',
  bamic_grade_id: null,
  bamic_site_id: null,
  coding: {
    pathologies: [],
  },
  isBamic: false,
  secondaryPathologies: [],
};
const props = {
  isChronicCondition: false,
  athleteData: mockAthleteData,
  athleteId: 1,
  details: mockDetails,
  invalidFields: [],
  selectedAthlete: 7,
  t: i18nextTranslateStub(),
  codingSystemProps: {
    selectedCoding: mockSelectedCoding,
    onSelectCodingSystemPathology: jest.fn(),
    selectedCodingSystemPathology: {},
  },
  sideProps: {
    onSelectSide: jest.fn(),
    selectedSide: 21,
  },
  onsetProps: {
    selectedOnset: 4,
    onSelectOnset: jest.fn(),
    onsetFreeText: '',
    onUpdateOnsetFreeText: jest.fn(),
  },
  examinationDateProps: {
    selectedExaminationDate: moment('2021-03-02T13:00:00Z'),
    selectedDiagnosisDate: moment('2021-03-02T13:00:00Z'),
    onSelectExaminationDate: jest.fn(),
  },
};

const assertDropdownItemsMatchLegQuery = async () => {
  await waitFor(() => {
    expect(screen.getAllByRole('option')).toHaveLength(4);
    // Pathology included in resonse as its coding_system_body_region is related to Leg
    expect(screen.getAllByRole('option')[0]).toHaveTextContent(
      'Exercise-related iliac artery flow limitation - GVI'
    );
    // Pathology included in resonse as its coding_system_body_region is related to Leg
    expect(screen.getAllByRole('option')[1]).toHaveTextContent(
      'Popliteal artery entrapment - QV4'
    );
    expect(screen.getAllByRole('option')[2]).toHaveTextContent(
      'Leg Muscle Tear - LMT2'
    );
    expect(screen.getAllByRole('option')[3]).toHaveTextContent(
      'Leg Muscle Strain - LMS1'
    );
  });
};

// Gets id of pathology by pathology name
const getPathologyIdByName = (pathologyName, dataset) => {
  const foundItem = dataset.find(
    (item) => item.pathology.toLowerCase() === pathologyName.toLowerCase()
  );
  return foundItem?.id;
};

const renderComponent = (customProps) => {
  const fakeStore = storeFake({
    globalApi: {},
    medicalSharedApi: {
      useGetPathologiesMultiCodingV2Query: jest.fn(),
    },
  });

  return render(
    <Provider store={fakeStore}>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <OSIICS15 {...props} {...customProps} />
      </LocalizationProvider>
    </Provider>
  );
};

// Checks if an element (param1) has a style property (param2) that matches X (param3)  and can expect it to match or not match (param4)
const checkColorStyle = async (
  element,
  styleProperty,
  expectedValue,
  shouldMatch = true
) => {
  let assertionIsCorrect = false;

  await waitFor(() => {
    // Get the live, computed styles for the element.
    const styles = getComputedStyle(element);
    const styleValue = styles[styleProperty];

    if (shouldMatch) {
      // Assert that the color matches the expected value
      assertionIsCorrect = styleValue === expectedValue;

      expect(styleValue).toBe(expectedValue);
    } else {
      // Assert that the colour does NOT match the expected value
      assertionIsCorrect = styleValue !== expectedValue;

      expect(styleValue).not.toBe(expectedValue);
    }
  });
  return assertionIsCorrect;
};

describe('OSIICS15', () => {
  beforeEach(() => {
    useGetOrganisationQuery.mockReturnValue(organisationCodingSystemData);
    getInjuryOnset.mockResolvedValue(mockInjuryOnsetOptions);
    useGetAthleteDataQuery.mockReturnValue({
      data: {},
      error: false,
      isLoading: false,
    });
    getCodingSystemSides.mockResolvedValue(mockCodingSystemSides);
    useGetAncillaryEligibleRangesQuery.mockReturnValue({
      data: [],
    });
    // We need data object to be stable and not be a new array each react render
    // Because we are using Filter in the handler that returns a new array
    // We cannot call that or would get new data per render
    const legData = filterPathologiesMultiCodingV2Data({
      searchExpression: 'Leg',
    });
    useGetPathologiesMultiCodingV2Query.mockImplementation((params) => {
      return {
        data: params.searchExpression === 'Leg' ? legData : [],
        isError: false,
        isLoading: false,
        isFetching: false,
        isSuccess: true,
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Pathology Dropdown', () => {
    it('pathplogy selecor validation IS triggered when primary_pathology_id IS added to invalidFields', async () => {
      renderComponent({
        invalidFields: ['primary_pathology_id'],
      });
      const componentParent = screen.getAllByText('Pathologies')[0];
      const resultAsExpected = await checkColorStyle(
        componentParent,
        'color',
        'rgb(211, 47, 47)',
        true
      );

      expect(resultAsExpected).toBe(true);
    });

    it('pathplogy selecor validation is NOT triggered when primary_pathology_id is NOT added to invalidFields', async () => {
      renderComponent({
        invalidFields: [''],
      });

      const componentParent = screen.getAllByText('Pathologies')[0];
      const resultAsExpected = await checkColorStyle(
        componentParent,
        'color',
        'rgb(211, 47, 47)',
        false
      );

      expect(resultAsExpected).toBe(true);
    });

    it('renders the default message in the dropdown when no pathologies are present', async () => {
      const user = userEvent.setup();
      renderComponent();

      const input = screen.getByRole('combobox');

      // Menu not selected yet
      expect(
        screen.queryByText('Search by Pathology name or code')
      ).not.toBeInTheDocument();

      await user.click(input);

      expect(
        screen.queryByText('Search by Pathology name or code')
      ).toBeVisible();
    });

    it('renders the input with default option when no pathologies available', async () => {
      renderComponent();
      const dropdown = screen.getByLabelText('Pathologies');

      expect(screen.getAllByText('Pathologies')).toHaveLength(2);

      // Menu not selected yet
      expect(
        screen.queryByText('Search by Pathology name or code')
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('option')).not.toBeInTheDocument();

      // Menu shows default option after rendreing with no Pathologies data
      act(() => {
        selectEvent.openMenu(dropdown);
      });

      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('displays filtered options based on user input', async () => {
      const user = userEvent.setup();
      renderComponent();
      const input = screen.getByRole('combobox');

      // No options fetched until user inputs text
      expect(
        screen.queryByText('Leg Muscle Tear - LMT2')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Leg Muscle Strain - LMS1')
      ).not.toBeInTheDocument();

      // Search for pathologies related to Leg
      await user.click(input);
      fireEvent.change(input, { target: { value: 'Leg' } });

      // Expect to only receive related pathologies to search_expression param (user text input)
      await waitFor(
        () => expect(screen.getAllByRole('option')).toHaveLength(4),
        WAIT_FOR_TIMEOUT
      );

      expect(screen.getAllByRole('option')[0]).toHaveTextContent(
        'Exercise-related iliac artery flow limitation - GVI'
      );
      // Pathology included in resonse as its coding_system_body_region is related to Leg
      expect(screen.getAllByRole('option')[1]).toHaveTextContent(
        'Popliteal artery entrapment - QV4'
      );
      expect(screen.getAllByRole('option')[2]).toHaveTextContent(
        'Leg Muscle Tear - LMT2'
      );
      expect(screen.getAllByRole('option')[3]).toHaveTextContent(
        'Leg Muscle Strain - LMS1'
      );
    });

    it('calls the redux callback with the correct Pathology object when an option is selected', async () => {
      const user = userEvent.setup();
      renderComponent();
      const input = screen.getByRole('combobox');
      const dataFromService = data.coding_system_pathologies.osiics15;
      const pathologyIdForPoplitealArteryEntrapment = getPathologyIdByName(
        'Popliteal artery entrapment',
        dataFromService
      );

      fireEvent.click(input);
      fireEvent.change(input, { target: { value: 'Leg' } });

      await waitFor(
        () => expect(screen.getAllByRole('option')).toHaveLength(4),
        WAIT_FOR_TIMEOUT
      );

      await user.click(screen.getAllByRole('option')[1]); // Click 'Leg Muscle Strain'

      expect(pathologyIdForPoplitealArteryEntrapment).toBe(6784);
      expect(
        props.codingSystemProps.onSelectCodingSystemPathology
      ).toHaveBeenCalledWith(
        expect.objectContaining({ id: pathologyIdForPoplitealArteryEntrapment })
      );
    });
  });

  describe('related data/info fields', () => {
    it('[FORM FIELD] renders Examination date component when not in edit mode', async () => {
      renderComponent({ isEditMode: true });

      await waitFor(() => {
        expect(screen.getByText('Date of examination')).toBeInTheDocument(); // Label
      });

      expect(
        screen.getAllByPlaceholderText('DD/MM/YYYY')[0]
      ).toBeInTheDocument(); // Date picker
      expect(screen.getAllByPlaceholderText('DD/MM/YYYY')[0]).toHaveValue(
        '22/06/2025'
      );

      // Selected date is in ISO format: "2021-03-02T13:00:00.000Z"
      // The below reformats that to assert data integrity by checking the actual value too
      expect(screen.getAllByPlaceholderText('DD/MM/YYYY')[1]).toHaveValue(
        new Date(
          props.examinationDateProps.selectedExaminationDate
        ).toLocaleDateString('en-gb', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      );
    });

    it('[FORM FIELD] does not render Examination date component when in create mode', async () => {
      renderComponent({ isEditMode: false });

      await waitFor(() => {
        expect(
          screen.queryByText('Date of examination')
        ).not.toBeInTheDocument(); // Label
      });
    });

    it('[FORM FIELD] renders side selector component', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Side')).toBeInTheDocument();
      });
      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Center')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
      expect(screen.getByText('Bilateral')).toBeInTheDocument();
      expect(
        screen.getByText('Bilateral').parentNode.querySelectorAll('button')[4]
      ).toHaveTextContent('N/A');
    });

    it('coding System side validaton IS triggered when coding_system_side_id IS added to invalidFields', async () => {
      renderComponent({
        invalidFields: ['coding_system_side_id'],
      });

      await waitFor(() => {
        expect(screen.getByText('Side')).toBeInTheDocument();
      });
      const componentParent = screen.getByTestId('SegmentedControl|Group');
      const resultAsExpected = await checkColorStyle(
        componentParent,
        'borderColor',
        colors.red_100,
        true
      );

      expect(resultAsExpected).toBe(true);
    });

    it('coding System side validaton NOT triggered when coding_system_side_id is NOT added to invalidFields', async () => {
      renderComponent({
        invalidFields: [''],
      });

      await waitFor(() => {
        expect(screen.getByText('Side')).toBeInTheDocument();
      });

      const componentParent = screen.getByTestId('SegmentedControl|Group');
      const styles = getComputedStyle(componentParent);

      expect(styles.borderColor).not.toBe(colors.red_100);
    });

    it('[FORM FIELD] renders onset selector component', async () => {
      const user = userEvent.setup();
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Onset Type')).toBeInTheDocument();
      });

      const onsetSelect = screen
        .getByText('Onset Type')
        .parentNode.parentNode.parentNode.querySelector('input');
      await user.click(onsetSelect);

      await waitFor(() => {
        const secondOnsetOption = mockInjuryOnsetOptions[1];
        // Aria context
        expect(
          screen.getByText(
            `option ${secondOnsetOption.label} selected, 2 of ${mockInjuryOnsetOptions.length}. ${mockInjuryOnsetOptions.length} results available. Use Up and Down to choose options, press Enter to select the currently focused option, press Escape to exit the menu, press Tab to select the option and exit the menu.`
          )
        ).toBeInTheDocument();
      });

      // Add focus to the input
      await user.click(screen.getAllByText('Chronic')[0]);

      await waitFor(() => {
        expect(
          screen.getByText('Select is focused , press Down to open the menu,')
        ).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        const thirdOnsetOption = mockInjuryOnsetOptions[1];
        expect(
          screen.getByText(
            `option ${thirdOnsetOption.label} selected, 2 of ${mockInjuryOnsetOptions.length}. ${mockInjuryOnsetOptions.length} results available. Use Up and Down to choose options, press Enter to select the currently focused option, press Escape to exit the menu, press Tab to select the option and exit the menu.`
          )
        ).toBeInTheDocument();
      });
    });

    it('[FORM FIELD] toggles the correct side option', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Wait for the codingSystemSides to be loaded and the SegmentedControl to render buttons
      await waitFor(() => {
        expect(screen.getByText('Left')).toBeInTheDocument();
      });
      expect(screen.getByText('Center')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
      expect(screen.getByText('Bilateral')).toBeInTheDocument();
      expect(
        screen.getByText('Bilateral').parentNode.querySelectorAll('button')[4]
      ).toHaveTextContent('N/A');

      const bilateralOption = screen.getByText('Bilateral');
      const leftOption = screen.getByText('Left');
      const leftOptionCodingSystemSide = mockCodingSystemSides.find(
        (item) => item.side_name === 'Left'
      );
      const bilateralOptionCodingSystemSide = mockCodingSystemSides.find(
        (item) => item.side_name === 'Bilateral'
      );

      // Click 'bilateral' option and expect the callback to have correct param
      await user.click(bilateralOption);
      await waitFor(() => {
        expect(props.sideProps.onSelectSide).toHaveBeenCalledWith(24);
        expect(bilateralOptionCodingSystemSide.coding_system_side_id).toEqual(
          24
        );
      });

      // Click 'left' option and expect the callback to have correct param
      await user.click(leftOption);
      await waitFor(() => {
        expect(props.sideProps.onSelectSide).toHaveBeenCalledWith(21);
        expect(leftOptionCodingSystemSide.coding_system_side_id).toEqual(21);
      });
    });

    it('[FORM FIELD] uses generic side_id when creating a chronic condition', async () => {
      const user = userEvent.setup();
      renderComponent({ isChronicCondition: true, isEditMode: false });

      await waitFor(() => {
        expect(screen.getByText('Left')).toBeInTheDocument();
      });

      const bilateralOption = screen.getByText('Bilateral');
      const leftOption = screen.getByText('Left');
      const leftOptionCodingSystemSide = mockCodingSystemSides.find(
        (item) => item.side_name === 'Left'
      );
      const bilateralOptionCodingSystemSide = mockCodingSystemSides.find(
        (item) => item.side_name === 'Bilateral'
      );

      // Click 'bilateral' option and expect the callback to have correct param (side_id)
      await user.click(bilateralOption);
      await waitFor(() => {
        expect(props.sideProps.onSelectSide).toHaveBeenCalledWith(
          bilateralOptionCodingSystemSide.side_id
        ); // side_id for Bilateral
        expect(bilateralOptionCodingSystemSide.side_id).toEqual(4);
      });

      // Click 'left' option and expect the callback to have correct param (side_id)
      await user.click(leftOption);
      await waitFor(() => {
        expect(props.sideProps.onSelectSide).toHaveBeenCalledWith(
          leftOptionCodingSystemSide.side_id
        ); // side_id for Left
        expect(leftOptionCodingSystemSide.side_id).toEqual(1);
      });
    });

    it('[FORM FIELD] uses the coding_system_side_id when editing a chronic condition', async () => {
      const user = userEvent.setup();
      renderComponent({ isChronicCondition: true, isEditMode: true });

      await waitFor(() => {
        expect(screen.getByText('Left')).toBeInTheDocument();
      });

      const bilateralOption = screen.getByText('Bilateral');
      const leftOption = screen.getByText('Left');
      const leftOptionCodingSystemSide = mockCodingSystemSides.find(
        (item) => item.side_name === 'Left'
      );
      const bilateralOptionCodingSystemSide = mockCodingSystemSides.find(
        (item) => item.side_name === 'Bilateral'
      );

      // Click 'bilateral' option and expect the callback to have correct param (coding_system_side_id)
      await user.click(bilateralOption);
      await waitFor(() => {
        expect(props.sideProps.onSelectSide).toHaveBeenCalledWith(
          bilateralOptionCodingSystemSide.coding_system_side_id
        ); // coding_system_side_id for Bilateral
        expect(bilateralOptionCodingSystemSide.coding_system_side_id).toEqual(
          24
        );
      });

      // Click 'left' option and expect the callback to have correct param (coding_system_side_id)
      await user.click(leftOption);
      await waitFor(() => {
        expect(props.sideProps.onSelectSide).toHaveBeenCalledWith(
          leftOptionCodingSystemSide.coding_system_side_id
        ); // coding_system_side_id for Left
        expect(leftOptionCodingSystemSide.coding_system_side_id).toEqual(21);
      });
    });

    it('[FORM FIELD] renders the related data labels', async () => {
      renderComponent();

      await waitFor(() =>
        expect(screen.getByText('Classification:')).toBeInTheDocument()
      );
      expect(screen.getByText('Body area:')).toBeInTheDocument();
      expect(screen.getByText('Code:')).toBeInTheDocument();
    });

    it('calls onSelectCodingSystemPathology when pathology dropdown item selected', async () => {
      const user = userEvent.setup();
      const legInjury = data.coding_system_pathologies.osiics15.find(
        (item) => item.pathology === 'Leg Muscle Tear'
      );
      const legInjuryClassification =
        legInjury.coding_system_classification.name; // Contusion/vascular1

      renderComponent();
      const input = screen.getByRole('combobox');

      // Search for pathologies related to Leg
      await user.click(input);
      fireEvent.change(input, { target: { value: 'Leg' } });

      // Before pathology dropdown item is selected
      await waitFor(() => assertDropdownItemsMatchLegQuery(), WAIT_FOR_TIMEOUT);

      const classificationFieldBeforeSelection =
        screen.getByText('Classification:').parentNode.textContent;
      const firstLegPathologyItem = screen.queryByText(
        'Leg Muscle Tear - LMT2'
      );

      expect(classificationFieldBeforeSelection).toEqual(`Classification: N/A`);

      // Select a pathology item from the dropdown of two matching pathologies (names including 'leg')
      await user.click(firstLegPathologyItem);

      // After pathology dropdown item is selected
      expect(
        props.codingSystemProps.onSelectCodingSystemPathology
      ).toHaveBeenCalledWith(expect.objectContaining({ ...legInjury }));
      expect(legInjuryClassification).toEqual('Contusion/vascular1');
    });

    it('displays pathology values based on codingSystemProps.selectedCodingSystemPathology', () => {
      const legInjury = data.coding_system_pathologies.osiics15.find(
        (item) => item.pathology === 'Leg Muscle Tear'
      );

      const propsWithSelectedCodingSystemPathology = {
        codingSystemProps: {
          ...props.codingSystemProps,
          selectedCodingSystemPathology: {
            ...legInjury,
          },
        },
      };

      renderComponent(propsWithSelectedCodingSystemPathology);

      const classificationField =
        screen.getByText('Classification:').parentNode.textContent;
      expect(classificationField).toEqual(
        `Classification: Contusion/vascular1`
      );

      const codeField = screen.getByText('Code:').parentNode.textContent;
      expect(codeField).toEqual(`Code: LMT2`);

      const bodyAreaField =
        screen.getByText('Body area:').parentNode.textContent;
      expect(bodyAreaField).toEqual(`Body area: Lower`);
    });
  });

  it('calls the t function with the correct keys', async () => {
    const t = jest.fn((key) => key);
    const customProps = { ...props, t };
    renderComponent(customProps);

    await waitFor(() => {
      expect(t).toHaveBeenCalledWith('Side');
      expect(t).toHaveBeenCalledWith('Onset Type');
    });
  });
});
