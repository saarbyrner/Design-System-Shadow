// @flow
import { withNamespaces } from 'react-i18next';
import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import uniqBy from 'lodash/uniqBy';

import { SentryCaptureMessage } from '@kitman/common/src/utils';
import { Button, Grid, Stack, Typography } from '@kitman/playbook/components';
import { DetailsViewTranslated as DetailsView } from '@kitman/components/src/DocumentSplitter/src/components/DetailsView';
import { SplitSetupTranslated as SplitSetup } from '@kitman/components/src/DocumentSplitter/src/components/SplitSetup';
import { useGetSquadAthletesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useGetDocumentNoteCategoriesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { mapSquadAthleteToOptions } from '@kitman/modules/src/ElectronicFiles/shared/utils';
import { validateRows } from '@kitman/components/src/DocumentSplitter/src/shared/utils/validation';
import { getIssueIdsFromOptions } from '@kitman/modules/src/Medical/shared/utils';
import generateRows from '@kitman/components/src/DocumentSplitter/src/shared/utils/generateRows';

import {
  selectDocumentDetails,
  selectSplitOptions,
  reset as resetSplitSetupSlice,
} from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/splitSetupSlice';
import {
  selectDataRows,
  setupDefaults,
  setRows,
  reset as resetDetailsGridSlice,
} from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/detailsGridSlice';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Option } from '@kitman/playbook/types';
import type {
  DocumentSplitterStep,
  SetupDefaultsPayload,
  ValidationResults,
  DetailsGridRowData,
  DocumentSplitterUsage,
} from '@kitman/components/src/DocumentSplitter/src/shared/types';
import type { PartialData as PartialDocumentDetailsData } from '@kitman/components/src/DocumentSplitter/src/sections/DocumentDetails/types';
import type {
  SquadAthletes,
  AllocationAttribute,
} from '@kitman/modules/src/ElectronicFiles/shared/types';

type Props = {
  usage: DocumentSplitterUsage,
  isOpen: boolean,
  totalPages: number, // If has 10 pages, pass 10
  athleteId: ?number,
  processAllocationsCallback: (Array<AllocationAttribute>) => Promise<void>,
  onSaveSuccessCallback: () => void,
  onSaveErrorCallback: (?string) => void,
  onCloseCallback?: () => void,
  onStepChangedCallback?: (DocumentSplitterStep) => void,
};

const DocumentSplitter = ({
  t,
  isOpen,
  totalPages,
  athleteId,
  processAllocationsCallback,
  onSaveSuccessCallback,
  onSaveErrorCallback,
  onCloseCallback,
  onStepChangedCallback,
  usage,
}: I18nProps<Props>) => {
  const [activeStep, setActiveStep] =
    useState<DocumentSplitterStep>('documentDetails');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [allowValidation, setAllowValidation] = useState<boolean>(false);
  const [documentDetailsInitialState, setDocumentDetailsInitialState] =
    useState<?PartialDocumentDetailsData>(null);
  const [playersOptions, setPlayersOptions] = useState<Array<Option>>([]);
  const [preselectedPlayer, setPreselectedPlayer] = useState<?Option>(null);

  const dispatch = useDispatch();

  const documentDetailsData = useSelector(selectDocumentDetails);
  const splitOptions = useSelector(selectSplitOptions);
  const dataRows = useSelector(selectDataRows);

  useEffect(() => {
    setActiveStep('documentDetails');
    setIsSaving(false);
    setAllowValidation(false);
    dispatch(resetSplitSetupSlice(documentDetailsInitialState));
    dispatch(resetDetailsGridSlice(preselectedPlayer));
  }, [isOpen, dispatch, documentDetailsInitialState, preselectedPlayer]);

  const initialSquadAthletesData: SquadAthletes = { squads: [] };

  const {
    data: squadAthletes = initialSquadAthletesData,
    isFetching: isFetchingPlayers,
    isSuccess: isSquadAthletesSuccess,
  } = useGetSquadAthletesQuery(
    {
      athleteList: true,
      minimalAthleteListData: true,
    },
    { skip: !isOpen }
  );

  const validationResults: ValidationResults = useMemo(
    () => (allowValidation ? validateRows(dataRows, totalPages) : {}),
    [dataRows, allowValidation, totalPages]
  );

  useEffect(() => {
    if (isSquadAthletesSuccess) {
      const mapped = mapSquadAthleteToOptions(squadAthletes);
      const uniquePlayerOptions = uniqBy(mapped, (v) => [v.id, v.group].join());
      setPlayersOptions(uniquePlayerOptions);

      let players: Array<Option> = [];
      let playerIsPreselected = false;
      if (athleteId != null) {
        const player = uniquePlayerOptions.find(
          (athlete) => athlete.id === athleteId
        );
        setPreselectedPlayer(player);
        players = player ? [player] : [];
        playerIsPreselected = !!player;
      }
      setDocumentDetailsInitialState({
        players,
        playerIsPreselected,
      });
    }
  }, [isSquadAthletesSuccess, athleteId, squadAthletes]);

  const {
    data: documentCategories = [],
    isFetching: isFetchingDocumentCategories,
  } = useGetDocumentNoteCategoriesQuery(undefined, {
    skip: !isOpen,
  });

  const documentCategoriesOptions = useMemo(
    () =>
      documentCategories.map((category) => ({
        id: category.id,
        label: category.name,
      })),
    [documentCategories]
  );

  const changeActiveStep = (step: DocumentSplitterStep) => {
    setActiveStep(step);
    onStepChangedCallback?.(step);
  };
  const onReset = () => {
    // Go back a step
    changeActiveStep('documentDetails');
  };

  const createAllocationAttributes = (): Array<AllocationAttribute> =>
    dataRows.map((row: DetailsGridRowData) => ({
      athlete_id: row.player?.id,
      range: row.pages,
      file_name: row.fileName,
      document_date: row.dateOfDocument,
      medical_attachment_category_ids: row.categories.map(
        (option) => option.id
      ),
      injury_occurrence_ids:
        (!!row.associatedIssues &&
          getIssueIdsFromOptions('Injury', row.associatedIssues)) ||
        undefined,
      illness_occurrence_ids:
        (!!row.associatedIssues &&
          getIssueIdsFromOptions('Illness', row.associatedIssues)) ||
        undefined,
      chronic_issue_ids:
        (!!row.associatedIssues &&
          getIssueIdsFromOptions('ChronicInjury', row.associatedIssues)) ||
        undefined,
    }));

  const processError = (error) => {
    let message;
    const errors = error?.response?.data?.errors;
    if (errors) {
      if (
        errors.documents?.includes("a document_date can't be in the future")
      ) {
        message = t('A document date cannot be in the future');
        SentryCaptureMessage(`DocumentSplitter: date in the future`, 'error');
      } else {
        SentryCaptureMessage(
          `DocumentSplitter: unknown ${JSON.stringify(errors)}`,
          'error'
        );
      }
    } else {
      SentryCaptureMessage(`DocumentSplitter: unknown ${error}`, 'error');
    }

    setIsSaving(false);
    onSaveErrorCallback(message); // Expect to fallback to generic error
  };

  const onSave = async () => {
    setAllowValidation(true);
    if (dataRows.length > 0) {
      const lastValidationCheck = validateRows(dataRows, totalPages);

      const validationPassed = Object.keys(lastValidationCheck).length === 0;
      if (validationPassed) {
        setIsSaving(true);
        try {
          await processAllocationsCallback(createAllocationAttributes());
          onSaveSuccessCallback();
          onCloseCallback?.();
        } catch (error) {
          processError(error);
        }
      }
    }
    // Otherwise validation from setAllowValidation will highlight to user problems
  };

  const prepareDetailsViewData = () => {
    const defaults: SetupDefaultsPayload = {
      defaultCategories: documentDetailsData.documentCategories,
      defaultFileName: documentDetailsData.fileName,
      defaultDateOfDocument: documentDetailsData.documentDate,
    };

    dispatch(setupDefaults(defaults));
    dispatch(
      setRows(generateRows(documentDetailsData, splitOptions, totalPages))
    );
  };

  const validationFailed =
    allowValidation &&
    (Object.keys(validationResults).length > 0 || dataRows.length < 1);

  const renderAllocationsStep = () => (
    <>
      <Grid
        item
        pt={1}
        pb={0}
        pl={3}
        pr={3}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={400}
          sx={{ color: 'text.primary', fontSize: '16px' }}
        >
          {t('Attach')}
        </Typography>
        <Stack direction="row" spacing={1} height={36}>
          <Button
            key="reset"
            color="secondary"
            variant="contained"
            disabled={isSaving}
            onClick={onReset}
          >
            {t('Reset')}
          </Button>
          <Button
            key="save"
            variant="contained"
            onClick={onSave}
            disabled={isSaving || validationFailed}
          >
            {t('Save')}
          </Button>
        </Stack>
      </Grid>
      <DetailsView
        dataRows={dataRows}
        validationResults={validationResults}
        validationFailed={validationFailed}
        players={playersOptions}
        isPlayerPreselected={!!preselectedPlayer}
        documentCategories={documentCategoriesOptions}
        isFetchingPlayers={isFetchingPlayers}
        isFetchingDocumentCategories={isFetchingDocumentCategories}
        isSaving={isSaving}
        usage={usage}
      />
    </>
  );

  const renderContent = () => {
    if (activeStep === 'allocations') {
      return renderAllocationsStep();
    }

    // Document details
    return (
      <SplitSetup
        players={playersOptions}
        documentCategories={documentCategoriesOptions}
        isFetchingPlayers={isFetchingPlayers}
        isFetchingDocumentCategories={isFetchingDocumentCategories}
        totalPages={totalPages}
        onNextCallback={() => {
          prepareDetailsViewData();
          changeActiveStep('allocations');
        }}
        onBackCallback={onCloseCallback}
      />
    );
  };

  return renderContent();
};

export const DocumentSplitterTranslated = withNamespaces()(DocumentSplitter);
export default DocumentSplitter;
