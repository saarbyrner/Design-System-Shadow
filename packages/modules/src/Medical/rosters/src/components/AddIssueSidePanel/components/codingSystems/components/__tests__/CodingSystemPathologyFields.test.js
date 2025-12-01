import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { Provider } from 'react-redux';
import { useGetPathologiesMultiCodingV2Query } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import data from '@kitman/services/src/mocks/handlers/medical/osics/data.mock';
import moment from 'moment-timezone';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { filterPathologiesMultiCodingV2Data } from '@kitman/services/src/mocks/handlers/medical/pathologies';
import CodingSystemPathologyFields from '../CodingSystemPathologyFields';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');

const mockSelectedCoding = {
  coding_system: {
    coding_system_pathology_id: 1392,
    groups: ['all_injuries'],
  },
};

const props = {
  athleteId: 1,
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
  renderPathologyRelatedFields: true,
};

const WAIT_FOR_TIMEOUT = { timeout: 4000 };

const renderComponent = (customProps) => {
  const fakeStore = storeFake({
    globalApi: {},
    medicalSharedApi: {
      useGetPathologiesMultiCodingV2Query: jest.fn(),
    },
  });

  return renderWithUserEventSetup(
    <Provider store={fakeStore}>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
        <CodingSystemPathologyFields {...props} {...customProps} />
      </LocalizationProvider>
    </Provider>
  );
};

const assertDropdownItemsMatchLegQuery = async () => {
  await waitFor(() => {
    expect(screen.getAllByRole('option')).toHaveLength(4);
    // Pathology included in response as its coding_system_body_region is related to Leg
    expect(screen.getAllByRole('option')[0]).toHaveTextContent(
      'Exercise-related iliac artery flow limitation - GVI'
    );
    // Pathology included in response as its coding_system_body_region is related to Leg
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

describe('CodingSystemPathologyFields', () => {
  beforeEach(() => {
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

  it('renders the input with default option when no pathologies available', async () => {
    renderComponent();
    const dropdown = screen.getByLabelText('Pathologies');

    expect(screen.getAllByText('Pathologies')).toHaveLength(2);

    // Menu not selected yet
    expect(
      screen.queryByText('Search by Pathology name or code')
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();

    // Menu shows default option after rendering with no Pathologies data
    act(() => {
      selectEvent.openMenu(dropdown);
    });

    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('renders the initial state of the searchable dropdown', async () => {
    renderComponent();
    const dropdown = screen.getByLabelText('Pathologies');

    expect(screen.getAllByText('Pathologies')).toHaveLength(2);
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();

    act(() => {
      selectEvent.openMenu(dropdown);
    });

    await waitFor(() => {
      expect(screen.queryAllByRole('presentation')[1]).toHaveTextContent(
        'Search by Pathology name or code'
      );
      expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
      expect(screen.getAllByRole('presentation')).toHaveLength(2);
    });

    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(
      props.codingSystemProps.onSelectCodingSystemPathology
    ).not.toHaveBeenCalled();
  });

  it('displays filtered options based on user input', async () => {
    const { user } = renderComponent();
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
    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(4);

      // Pathology included in response as its coding_system_body_region is related to Leg
      expect(screen.getAllByRole('option')[0]).toHaveTextContent(
        'Exercise-related iliac artery flow limitation - GVI'
      );
      // Pathology included in response as its coding_system_body_region is related to Leg
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
  });

  it('calls the redux callback with the selected pathology object when an option is selected', async () => {
    const { user } = renderComponent();
    const input = screen.getByRole('combobox');
    const pathologyData = filterPathologiesMultiCodingV2Data({
      searchExpression: 'Leg',
    });
    const expectedSelected = pathologyData.find(
      (item) => item.pathology === 'Popliteal artery entrapment'
    );

    await user.click(input);
    fireEvent.change(input, { target: { value: 'Leg' } });

    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(4);
    });

    await user.click(screen.getAllByRole('option')[1]); // Click 'Leg Muscle Strain'
    expect(
      props.codingSystemProps.onSelectCodingSystemPathology
    ).toHaveBeenCalledWith(
      expect.objectContaining({ id: expectedSelected.id })
    );
  });

  it('clears selection and calls callback with null when clicking clear/x icon', async () => {
    const { user } = renderComponent();
    const input = screen.getByRole('combobox');

    await user.click(input);
    fireEvent.change(input, { target: { value: 'Leg' } });

    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(4);
    });

    await user.click(screen.getAllByRole('option')[0]);

    const clearBtn = screen.getByLabelText('clear');
    await user.click(clearBtn);

    expect(
      props.codingSystemProps.onSelectCodingSystemPathology
    ).toHaveBeenCalledWith(null);
  });

  it('disables input interactions and hides clear button when field is disabled', async () => {
    const disabledProps = {
      ...props,
      codingSystemProps: {
        ...props.codingSystemProps,
        isPathologyFieldDisabled: true,
        selectedCodingSystemPathology: {
          id: 9999,
          code: 'ABC',
          pathology: 'Preset Pathology',
        },
      },
      isEditMode: false,
    };

    renderComponent(disabledProps);

    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('Preset Pathology - ABC');

    expect(screen.queryByLabelText('clear')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Leg' } });
    expect(input).toHaveValue('Preset Pathology - ABC');
  });

  it('[FORM FIELD] renders the related data labels', async () => {
    renderComponent();

    expect(screen.getByText('Classification:')).toBeInTheDocument();
    expect(screen.getByText('Body area:')).toBeInTheDocument();
    expect(screen.getByText('Code:')).toBeInTheDocument();
  });

  it('calls onSelectCodingSystemPathology when pathology dropdown item selected', async () => {
    const legInjury = data.coding_system_pathologies.osiics15.find(
      (item) => item.pathology === 'Leg Muscle Tear'
    );
    const legInjuryClassification = legInjury.coding_system_classification.name; // Contusion/vascular1

    const { user } = renderComponent();
    const input = screen.getByRole('combobox');

    // Search for pathologies related to Leg
    await user.click(input);
    fireEvent.change(input, { target: { value: 'Leg' } });

    // Before pathology dropdown item is selected
    await waitFor(() => assertDropdownItemsMatchLegQuery(), WAIT_FOR_TIMEOUT);

    const classificationFieldBeforeSelection =
      screen.getByText('Classification:').parentNode.textContent;
    const firstLegPathologyItem = screen.queryByText('Leg Muscle Tear - LMT2');

    expect(classificationFieldBeforeSelection).toEqual(`Classification: N/A`);

    // Select a pathology item from the dropdown of two matching pathologies (names including 'leg')
    await user.click(firstLegPathologyItem);

    // After pathology dropdown item is selected
    expect(
      props.codingSystemProps.onSelectCodingSystemPathology
    ).toHaveBeenCalledWith(expect.objectContaining({ ...legInjury }));
    expect(legInjuryClassification).toEqual('Contusion/vascular1');
  });

  it('displays pathology values based on codingSystemProps.selectedCodingSystemPathology', async () => {
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
    expect(classificationField).toEqual(`Classification: Contusion/vascular1`);

    const codeField = screen.getByText('Code:').parentNode.textContent;
    expect(codeField).toEqual(`Code: LMT2`);

    const bodyAreaField = screen.getByText('Body area:').parentNode.textContent;
    expect(bodyAreaField).toEqual(`Body area: Lower`);
  });

  describe('translations', () => {
    it('renders the translated labels', () => {
      const t = jest.fn((key) => key);
      renderComponent({ t });

      expect(t).toHaveBeenCalledWith('Classification');
      expect(t).toHaveBeenCalledWith('Body area');
      expect(t).toHaveBeenCalledWith('Code');
      expect(t).toHaveBeenCalledWith('Pathologies');
    });

    it('renders the translated no options text', async () => {
      const t = jest.fn((key) => key);
      const { user } = renderComponent({ t });
      const input = screen.getByRole('combobox');

      await user.click(input);
      fireEvent.change(input, { target: { value: 'abc' } });

      await waitFor(() => {
        expect(t).toHaveBeenCalledWith('No Pathology found');
      });

      fireEvent.change(input, { target: { value: '' } });

      await waitFor(() => {
        expect(t).toHaveBeenCalledWith('Search by Pathology name or code');
      });
    });

    it('renders the translated clear button aria-label', async () => {
      const t = jest.fn((key) => key);
      const { user } = renderComponent({ t });
      const input = screen.getByRole('combobox');

      await user.click(input);
      fireEvent.change(input, { target: { value: 'Leg' } });

      await waitFor(() => {
        expect(screen.getAllByRole('option')).toHaveLength(4);
      });

      await user.click(screen.getAllByRole('option')[0]);

      expect(t).toHaveBeenCalledWith('clear');
    });
  });
});
