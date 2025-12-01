import { screen, within, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  i18nextTranslateStub,
  storeFake,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import { useSearchPastAthletesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { data as pastAthletes } from '@kitman/services/src/mocks/handlers/medical/searchPastAthletes';
import { exportBulkAthleteMedicalData } from '@kitman/services/src/services/medical';
import { mockedExportResponse } from '@kitman/services/src/mocks/handlers/medical/exportBulkAthleteMedicalData';
import MedicalHistory from '../MedicalHistory';

jest.mock('@kitman/services/src/services/medical/exportBulkAthleteMedicalData');
jest.mock('@kitman/components/src/DatePicker');
jest.mock('@kitman/services/src/services/medical', () => ({
  ...jest.requireActual('@kitman/services/src/services/medical'),
  exportBulkAthleteMedicalData: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useSearchPastAthletesQuery: jest.fn(),
  })
);

const getSwitchByLabel = (labelText) => {
  const label = screen.getByText(labelText);
  const switchInput = label.parentNode.querySelector('input');
  return switchInput;
};

describe('Medical History', () => {
  beforeEach(() => {
    exportBulkAthleteMedicalData.mockResolvedValue(mockedExportResponse);
    window.featureFlags['nested-checkbox-select'] = true;
    useSearchPastAthletesQuery.mockReturnValue({
      data: pastAthletes,
      error: false,
      isFetching: false,
    });
  });

  afterEach(() => {
    exportBulkAthleteMedicalData.mockClear();
    window.featureFlags['nested-checkbox-select'] = false;
    jest.clearAllMocks();
  });

  const closeSettingsSpy = jest.fn();
  const onExportStartedSuccessSpy = jest.fn();
  const defaultProps = {
    isSettingsOpen: true,
    closeSettings: closeSettingsSpy,
    onExportStartedSuccess: onExportStartedSuccessSpy,
    reportSettingsKey: 'RosterOverview|MedicalHistory',
    squadId: 100,
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = defaultProps) =>
    renderWithUserEventSetup(
      <Provider store={storeFake({ globalApi: {}, medicalApi: {} })}>
        <MedicalHistory {...props} />
      </Provider>
    );

  it('displays correct options in sidepanel', async () => {
    const { user } = renderComponent();

    await screen.findByText('Medical History');

    const title = screen.getByTestId('sliding-panel|title');
    expect(title).toHaveTextContent('Medical History');

    expect(screen.getByLabelText('Squads')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    expect(screen.queryByText('Export as')).not.toBeInTheDocument();
    expect(screen.getByText('Printer friendly version')).toBeInTheDocument();
    expect(screen.getByText('Receive email notification')).toBeInTheDocument();

    await user.click(screen.getByText('Entities in export'));

    const optionsList = screen.getByRole('list');
    const checkboxes = within(optionsList).getAllByRole('checkbox');
    const expectedCheckboxNames = [
      'Non-injury data',
      'Notes',
      'Medical notes',
      'Nutrition notes',
      'Diagnostic notes',
      'Procedure notes',
      'Rehab notes',
      'Diagnostics',
      'Procedures',
      'Files',
      'Medications',
      'Rehab',
      'Daily Status notes',
    ];
    expect(checkboxes).toHaveLength(expectedCheckboxNames.length);
    expectedCheckboxNames.forEach((name) => {
      const checkbox = within(optionsList).getByRole('checkbox', { name });
      expect(checkbox).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole('button', { name: 'Export' });
    expect(downloadButton).toBeDisabled(); // Need to select both a start and end date
  });

  describe('[FEATURE FLAG] medical-form-pdf-export-enabled ON', () => {
    beforeEach(() => {
      window.featureFlags['medical-form-pdf-export-enabled'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-form-pdf-export-enabled'] = false;
    });
    it('displays correct options in sidepanel', async () => {
      const { user } = renderComponent();

      await screen.findByText('Medical History');

      const title = screen.getByTestId('sliding-panel|title');
      expect(title).toHaveTextContent('Medical History');

      expect(screen.getByLabelText('Squads')).toBeInTheDocument();
      expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
      expect(screen.getByLabelText('End Date')).toBeInTheDocument();
      expect(screen.queryByText('Export as')).not.toBeInTheDocument();
      expect(screen.getByText('Printer friendly version')).toBeInTheDocument();
      expect(
        screen.getByText('Receive email notification')
      ).toBeInTheDocument();

      await user.click(screen.getByText('Entities in export'));

      const optionsList = screen.getByRole('list');
      const checkboxes = within(optionsList).getAllByRole('checkbox');
      const expectedCheckboxNames = [
        'Non-injury data',
        'Notes',
        'Medical notes',
        'Nutrition notes',
        'Diagnostic notes',
        'Procedure notes',
        'Rehab notes',
        'Diagnostics',
        'Procedures',
        'Files',
        'Medications',
        'Rehab',
        'Daily Status notes',
        'Forms',
      ];
      expect(checkboxes).toHaveLength(expectedCheckboxNames.length);
      expectedCheckboxNames.forEach((name) => {
        const checkbox = within(optionsList).getByRole('checkbox', { name });
        expect(checkbox).toBeInTheDocument();
      });

      const downloadButton = screen.getByRole('button', { name: 'Export' });
      expect(downloadButton).toBeDisabled(); // Need to select both a start and end date
    });
  });

  describe('[FEATURE FLAG] medical-bulk-export-zip-options ON', () => {
    beforeEach(() => {
      window.featureFlags['medical-bulk-export-zip-options'] = true;
    });

    afterEach(() => {
      window.featureFlags['medical-bulk-export-zip-options'] = false;
    });

    it('displays zip options in sidepanel', async () => {
      renderComponent();

      await screen.findByText('Medical History');

      expect(screen.getByText('Export as')).toBeInTheDocument();
      expect(screen.getByText('Single zip folder')).toBeInTheDocument();
      expect(screen.getByText('One zip per Athlete')).toBeInTheDocument();

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);
      expect(radios.at(0).value).toEqual('single_zip');
      expect(radios.at(1).value).toEqual('individual_zip');
    });

    it('requests individual_zip when checkbox selected', async () => {
      const { user } = renderComponent();

      await screen.findByText('Medical History');

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);

      expect(radios.at(1)).not.toBeChecked();
      await user.click(radios.at(1));
      expect(radios.at(1)).toBeChecked();

      await fireEvent.change(screen.getByLabelText('Start Date'), {
        target: { value: '2023-11-28T00:00:00' },
      });

      await fireEvent.change(screen.getByLabelText('End Date'), {
        target: { value: '2023-11-29T00:00:00' },
      });

      const downloadButton = screen.getByRole('button', { name: 'Export' });
      expect(downloadButton).toBeEnabled();
      await user.click(downloadButton);

      expect(exportBulkAthleteMedicalData).toHaveBeenCalledWith(
        [
          {
            all_squads: false,
            applies_to_squad: false,
            athletes: [],
            context_squads: [100],
            position_groups: [],
            positions: [],
            squads: [100],
          },
        ],
        {
          start_date: '2023-11-28T00:00:00+00:00',
          end_date: '2023-11-29T23:59:59+00:00',
          entities_to_include: [],
          note_types: [],
          include_entities_not_related_to_any_issue: false,
        },
        false, // singleZipFile
        false, // Include past players: no
        false, // isPrinterFriendly
        false // skipNotification
      );

      expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
      expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('calls the closeSettings callback on cancel button', async () => {
    const { user } = renderComponent();

    await screen.findByText('Medical History');

    const closeButton = screen.getAllByRole('button')[0];
    await user.click(closeButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings callback on close sidepanel', async () => {
    const { user } = renderComponent();

    await screen.findByText('Medical History');

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the closeSettings and onDownloadSuccess callback on download', async () => {
    const { user } = renderComponent();

    await screen.findByText('Medical History');

    await fireEvent.change(screen.getByLabelText('Start Date'), {
      target: { value: '2023-11-28T00:00:00' },
    });

    await fireEvent.change(screen.getByLabelText('End Date'), {
      target: { value: '2023-11-29T00:00:00' },
    });

    const downloadButton = screen.getByRole('button', { name: 'Export' });
    expect(downloadButton).toBeEnabled();
    await user.click(downloadButton);

    expect(exportBulkAthleteMedicalData).toHaveBeenCalledWith(
      [
        {
          all_squads: false,
          applies_to_squad: false,
          athletes: [],
          context_squads: [100],
          position_groups: [],
          positions: [],
          squads: [100],
        },
      ],
      {
        start_date: '2023-11-28T00:00:00+00:00',
        end_date: '2023-11-29T23:59:59+00:00',
        entities_to_include: [],
        note_types: [],
        include_entities_not_related_to_any_issue: false,
      },
      true, // singleZipFile
      false, // Include past players: no
      false, // isPrinterFriendly
      false // skipNotification
    );

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });

  it('changes entities to include on changing checkboxes', async () => {
    const { user } = renderComponent();

    await screen.findByText('Medical History');

    // Change Entities in export selections
    await user.click(screen.getByText('Entities in export'));
    const optionsList = screen.getByRole('list');

    const nonInjuryDataCheckbox = within(optionsList).getByRole('checkbox', {
      name: 'Non-injury data',
    });
    expect(nonInjuryDataCheckbox).not.toBeChecked();
    await user.click(nonInjuryDataCheckbox);
    expect(nonInjuryDataCheckbox).toBeChecked();

    const medicalNotesCheckbox = within(optionsList).getByRole('checkbox', {
      name: 'Medical notes',
    });
    expect(medicalNotesCheckbox).not.toBeChecked();
    await user.click(medicalNotesCheckbox);
    expect(medicalNotesCheckbox).toBeChecked();

    const diagnosticsCheckbox = within(optionsList).getByRole('checkbox', {
      name: 'Diagnostics',
    });
    expect(diagnosticsCheckbox).not.toBeChecked();
    await user.click(diagnosticsCheckbox);
    expect(diagnosticsCheckbox).toBeChecked();

    await fireEvent.change(screen.getByLabelText('Start Date'), {
      target: { value: '2023-11-28T00:00:00' },
    });

    await fireEvent.change(screen.getByLabelText('End Date'), {
      target: { value: '2023-11-29T00:00:00' },
    });

    const emailSwitch = getSwitchByLabel('Receive email notification');
    expect(emailSwitch).toBeChecked();
    await user.click(emailSwitch);
    expect(emailSwitch).not.toBeChecked();

    const printerFriendlySwitch = getSwitchByLabel('Printer friendly version');
    expect(printerFriendlySwitch).not.toBeChecked();
    await user.click(printerFriendlySwitch);
    expect(printerFriendlySwitch).toBeChecked();

    const downloadButton = screen.getByRole('button', { name: 'Export' });
    expect(downloadButton).toBeEnabled();
    await user.click(downloadButton);

    expect(exportBulkAthleteMedicalData).toHaveBeenCalledWith(
      [
        {
          all_squads: false,
          applies_to_squad: false,
          athletes: [],
          context_squads: [100],
          position_groups: [],
          positions: [],
          squads: [100],
        },
      ],
      {
        start_date: '2023-11-28T00:00:00+00:00',
        end_date: '2023-11-29T23:59:59+00:00',
        entities_to_include: ['diagnostics'],
        note_types: ['OrganisationAnnotationTypes::Medical'],
        include_entities_not_related_to_any_issue: true,
      },
      true, // singleZipFile
      false, // Include past players: no
      true, // isPrinterFriendly
      true // skipNotification
    );

    expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
    expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
  });

  describe('Past athlete selection', () => {
    it('displays correct options in sidepanel', async () => {
      renderComponent({ ...defaultProps, displayPastAthletes: true });

      expect(screen.getByLabelText('Past athletes')).toBeInTheDocument();
    });

    it('calls the closeSettings and onDownloadSuccess callback on download', async () => {
      const { user } = renderComponent({
        ...defaultProps,
        displayPastAthletes: true,
      });

      await screen.findByText('Medical History');

      const athleteSelector = screen.getByLabelText('Past athletes');
      await fireEvent.change(
        screen.getByPlaceholderText('Search past athletes'),
        {
          target: { value: 'myrna' },
        }
      );
      await user.click(athleteSelector);
      await user.click(
        screen.getByRole('option', { name: pastAthletes.athletes[0].fullname })
      );

      await fireEvent.change(screen.getByLabelText('Start Date'), {
        target: { value: '2023-11-28T00:00:00' },
      });

      await fireEvent.change(screen.getByLabelText('End Date'), {
        target: { value: '2023-11-29T00:00:00' },
      });

      const downloadButton = screen.getByRole('button', { name: 'Export' });
      expect(downloadButton).toBeEnabled();
      await user.click(downloadButton);

      expect(exportBulkAthleteMedicalData).toHaveBeenCalledWith(
        [
          {
            all_squads: false,
            applies_to_squad: false,
            athletes: [pastAthletes.athletes[0].id],
            context_squads: [],
            position_groups: [],
            positions: [],
            squads: [],
          },
        ],
        {
          start_date: '2023-11-28T00:00:00+00:00',
          end_date: '2023-11-29T23:59:59+00:00',
          entities_to_include: ['diagnostics'],
          note_types: ['OrganisationAnnotationTypes::Medical'],
          include_entities_not_related_to_any_issue: true,
        },
        true, // singleZipFile
        false, // Include past players: no
        false, // isPrinterFriendly
        false // skipNotification
      );

      expect(closeSettingsSpy).toHaveBeenCalledTimes(1);
      expect(onExportStartedSuccessSpy).toHaveBeenCalledTimes(1);
    });
  });
});
