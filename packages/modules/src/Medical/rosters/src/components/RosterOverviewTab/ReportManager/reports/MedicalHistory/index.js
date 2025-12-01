// @flow
import moment from 'moment';
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import _isEqual from 'lodash/isEqual';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import useExports from '@kitman/modules/src/Medical/shared/hooks/useExports';
import { exportBulkAthleteMedicalData } from '@kitman/services/src/services/medical';
import { Box, Alert } from '@kitman/playbook/components';
import { AthleteSelectorTranslated as AthleteSelector } from '@kitman/modules/src/Medical/shared/components/AthleteSelector';
import { RadioList, DatePicker, ToggleSwitch } from '@kitman/components';
import ExportSettings from '@kitman/modules/src/Medical/shared/components/ExportSettings';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import { SquadSelectorFieldTranslated as SquadSelectorField } from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/SquadSelectorField';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import style from '@kitman/modules/src/Medical/rosters/src/components/RosterOverviewTab/ReportManager/reports/MedicalHistory/style';

// Types
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  ExportableMedicalEntities,
  ExportableNoteTypes,
} from '@kitman/services/src/services/medical/exportBulkAthleteMedicalData';
import type { Option } from '@kitman/playbook/types';

type Props = {
  squadId: ?number,
  isSettingsOpen: boolean,
  closeSettings: Function,
  reportSettingsKey: string,
  onExportStartedSuccess?: Function,
  // If true then squad selector changes to a past player athlete selector
  displayPastAthletes?: boolean,
};

const emptyPopulation = {
  applies_to_squad: false,
  all_squads: false,
  position_groups: [],
  positions: [],
  athletes: [],
  squads: [],
  context_squads: [],
};

type ValidationResults = {
  populationHasError?: boolean,
};

const MedicalHistory = ({
  squadId,
  isSettingsOpen,
  closeSettings,
  reportSettingsKey,
  onExportStartedSuccess,
  displayPastAthletes = false,
  t,
}: I18nProps<Props>) => {
  const exportHook = useExports(null, true);
  const reportTitle = t('Medical History');
  const hiddenExportEntitiesOptions = [];
  const defaultExportEntities = [];
  const exportEntitiesOptions = [
    {
      value: 'include_entities_not_related_to_any_issue',
      label: t('Non-injury data'),
    },
    {
      label: t('Notes'),
      value: 'notes',
      nestedOptions: [
        {
          label: t('Medical notes'),
          value: 'OrganisationAnnotationTypes::Medical',
        },
        {
          label: t('Nutrition notes'),
          value: 'OrganisationAnnotationTypes::Nutrition',
        },
        {
          label: t('Diagnostic notes'),
          value: 'OrganisationAnnotationTypes::Diagnostic',
        },
        {
          label: t('Procedure notes'),
          value: 'OrganisationAnnotationTypes::Procedure',
        },
        {
          label: t('Rehab notes'),
          value: 'OrganisationAnnotationTypes::RehabSession',
        },

        {
          label: t('Daily Status notes'),
          value: 'OrganisationAnnotationTypes::DailyStatusNote',
        },
      ],
    },
    { label: t('Diagnostics'), value: 'diagnostics' },
    { label: t('Procedures'), value: 'procedures' },
    { label: t('Files'), value: 'files' },
    { label: t('Medications'), value: 'medications' },
    { label: t('Rehab'), value: 'rehab_sessions' },
    ...(window.getFlag('medical-form-pdf-export-enabled')
      ? [{ label: t('Forms'), value: 'forms' }]
      : []),
  ];

  const [validationResults, setValidationResults] = useState<ValidationResults>(
    {}
  );
  const [selectedPastPlayers, setSelectedPastPlayers] = useState<Array<Option>>(
    []
  );
  const [isPrinterFriendlyToggleOn, setIsPrinterFriendlyToggleOn] =
    useState(false);
  const [isEmailNotificationToggleOn, setIsEmailNotificationToggleOn] =
    useState(true);

  const onExport = (state) => {
    let population = state.population;
    const isPrinterFriendly = isPrinterFriendlyToggleOn;
    const skipNotification = !isEmailNotificationToggleOn;

    if (displayPastAthletes) {
      if (selectedPastPlayers.length < 1) {
        setValidationResults({
          populationHasError: true, // has error
        });
        return;
      }
      const athletes = selectedPastPlayers.map((option) => option.id);
      population = [{ ...emptyPopulation, athletes }];
    } else if (
      state.population.length === 0 ||
      (state.population.length === 1 &&
        _isEqual(state.population[0], emptyPopulation))
    ) {
      setValidationResults({
        populationHasError: true, // has error
      });
      return;
    }

    setValidationResults({
      populationHasError: false, // is valid
    });

    closeSettings();

    const startDate = moment(state.startDate)
      .startOf('day')
      .format(dateTransferFormat);

    const endDate = moment(state.endDate)
      .endOf('day')
      .format(dateTransferFormat);

    const notePrefix = 'OrganisationAnnotationTypes::';

    const exportEntities = state.exportEntities
      ? state.exportEntities.filter(
          (col) => !hiddenExportEntitiesOptions.includes(col)
        )
      : [];

    const entitiesToInclude: Array<ExportableMedicalEntities> =
      exportEntities.filter(
        (entry) =>
          !entry.startsWith(notePrefix) &&
          entry !== 'notes' &&
          entry !== 'include_entities_not_related_to_any_issue'
      );

    // $FlowIgnore(incompatible-type) If starts with notePrefix then is valid value
    const noteTypes: Array<ExportableNoteTypes> = exportEntities.filter(
      (entry) => entry.startsWith(notePrefix)
    );

    const filters = {
      start_date: startDate,
      end_date: endDate,
      entities_to_include: entitiesToInclude,
      include_entities_not_related_to_any_issue: state.exportEntities.includes(
        'include_entities_not_related_to_any_issue'
      ),
      note_types: noteTypes,
    };
    exportHook.exportReports(
      () =>
        exportBulkAthleteMedicalData(
          population,
          filters,
          !window.featureFlags['medical-bulk-export-zip-options'] ||
            state.exportType === 'single_zip',
          false,
          isPrinterFriendly,
          skipNotification
        ),

      onExportStartedSuccess
    );
  };

  const showAthletePopulationError = !!validationResults.populationHasError;
  const defaultSquads = squadId != null ? [squadId] : [];

  const renderIsPrinterFriendlyToggle = () => (
    <div style={{ display: 'block', paddingBottom: '1rem' }}>
      <ToggleSwitch
        isSwitchedOn={isPrinterFriendlyToggleOn}
        toggle={() => {
          setIsPrinterFriendlyToggleOn(!isPrinterFriendlyToggleOn);
        }}
        label={t('Printer friendly version')}
        labelPlacement="left"
        kitmanDesignSystem
      />
    </div>
  );

  const renderEmailNotificationToggle = () => (
    <ToggleSwitch
      isSwitchedOn={isEmailNotificationToggleOn}
      toggle={() => {
        setIsEmailNotificationToggleOn(!isEmailNotificationToggleOn);
      }}
      label={t('Receive email notification')}
      labelPlacement="left"
      kitmanDesignSystem
    />
  );

  return (
    <>
      <ExportSettings
        requiredKeys={['startDate', 'endDate']}
        saveButtonTitle={t('Export')}
        title={reportTitle}
        isOpen={isSettingsOpen}
        onSave={onExport}
        onCancel={() => {
          setSelectedPastPlayers([]);
          closeSettings();
        }}
        settingsKey={reportSettingsKey}
      >
        {!displayPastAthletes && (
          <SquadSelectorField
            defaultValue={[
              {
                applies_to_squad: false,
                all_squads: false,
                position_groups: [],
                positions: [],
                athletes: [],
                squads: defaultSquads,
                context_squads: defaultSquads,
              },
            ]}
          />
        )}
        {displayPastAthletes && (
          <Box
            sx={{
              padding: `${convertPixelsToREM(12)} ${convertPixelsToREM(24)}`,
            }}
          >
            <AthleteSelector
              fullWidth
              multiple
              renderCheckboxes
              skipCurrentAthletes
              limitTags={2}
              label={t('Past athletes')}
              placeholder={t('Search past athletes')}
              value={selectedPastPlayers}
              onChange={(values) => {
                setSelectedPastPlayers(values);
                setValidationResults({
                  populationHasError: values.length === 0,
                });
              }}
              error={showAthletePopulationError}
            />
          </Box>
        )}
        <div css={style.datePickers}>
          <ExportSettings.Field
            fieldKey="startDate"
            defaultValue={null}
            isCached
          >
            {({ value, onChange }) => (
              <DatePicker
                label={t('Start Date')}
                value={value}
                onDateChange={onChange}
                invalid={!value}
                disableFutureDates
                kitmanDesignSystem
              />
            )}
          </ExportSettings.Field>
          <ExportSettings.Field fieldKey="endDate" defaultValue={null} isCached>
            {({ value, onChange }) => (
              <DatePicker
                label={t('End Date')}
                value={value}
                onDateChange={onChange}
                invalid={!value}
                disableFutureDates
                kitmanDesignSystem
              />
            )}
          </ExportSettings.Field>
        </div>
        {window.featureFlags['medical-bulk-export-zip-options'] && (
          <ExportSettings.Field
            fieldKey="exportType"
            defaultValue="single_zip"
            isCached
          >
            {({ value, onChange }) => (
              <RadioList
                radioName="MedicalHistory|ExportType"
                label={t('Export as')}
                value={value}
                options={[
                  {
                    value: 'single_zip',
                    name: t('Single zip folder'),
                  },
                  {
                    value: 'individual_zip',
                    name: t('One zip per Athlete'),
                  },
                ]}
                direction="vertical"
                change={onChange}
                kitmanDesignSystem
              />
            )}
          </ExportSettings.Field>
        )}
        <div css={style.entities}>
          <span css={style.label}>{t('Entities in export')}</span>

          <ExportSettings.CommonFields.CheckboxList
            fieldKey="exportEntities"
            defaultValue={defaultExportEntities}
            items={exportEntitiesOptions.filter(
              (option) => !hiddenExportEntitiesOptions.includes(option.value)
            )}
            isCached
          />
          {renderIsPrinterFriendlyToggle()}
          {renderEmailNotificationToggle()}
        </div>
        <Alert
          severity="info"
          sx={{ mx: convertPixelsToREM(24), mb: convertPixelsToREM(12) }}
        >
          {t(
            'Exports including several athletes or long date ranges will take longer than individual export'
          )}
        </Alert>
      </ExportSettings>

      <ToastDialog
        toasts={exportHook.toasts}
        onCloseToast={exportHook.closeToast}
      />
    </>
  );
};

export const MedicalHistoryTranslated: ComponentType<Props> =
  withNamespaces()(MedicalHistory);
export default MedicalHistory;
