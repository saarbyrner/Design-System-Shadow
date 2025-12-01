// @flow
import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import {
  AppStatus,
  SlidingPanelResponsive,
  Select,
  InputTextField,
  TextButton,
  DatePicker,
  TooltipMenu,
  FileUploadArea,
} from '@kitman/components';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { SelectOption as Option } from '@kitman/components/src/types';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import {
  saveNote,
  saveAttachmentLegacy as saveAttachment,
} from '@kitman/services';
import { NOTE_TYPE } from '@kitman/modules/src/Medical/shared/types/medical/MedicalNote';
import { checkInvalidFileTitles } from '@kitman/common/src/utils/fileHelper';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useTUEForm from './hooks/useTUEForm';
import useEnrichedAthletesIssues from '../../hooks/useEnrichedAthletesIssues';

import {
  getRestricVisibilityValue,
  getIssueIds,
  getFormattedIssueIds,
  emptyHTMLeditorContent,
} from '../../utils';
import useMedicalHistory from '../../hooks/useMedicalHistory';

import type { RequestStatus } from '../../types';
import style from '../styles/forms';

import AthleteConstraints from '../AthleteConstraints';

type Props = {
  isOpen: boolean,
  isAthleteSelectable: boolean,
  squadAthletes: Array<Option>,
  athleteId?: ?number,
  onFileUploadStart: Function,
  onFileUploadSuccess: Function,
  onFileUploadFailure: Function,
  initialDataRequestStatus: RequestStatus,
  onClose: Function,
};

const AddTUESidePanel = (props: I18nProps<Props>) => {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [requestIssuesStatus, setRequestIssuesStatus] =
    useState<RequestStatus>(null);

  const [isValidationCheckAllowed, setIsValidationCheckAllowed] =
    useState(false);

  const { formState, dispatch } = useTUEForm();
  const { enrichedAthleteIssues, fetchAthleteIssues } =
    useEnrichedAthletesIssues({
      athleteId: props.isOpen ? props.athleteId : null,
    });
  const { fetchMedicalHistory } = useMedicalHistory({
    athleteId: props.athleteId,
  });

  useEffect(() => {
    if (props.athleteId) {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: props.athleteId,
      });
    }

    if (!props.isOpen) {
      setIsValidationCheckAllowed(false);
      dispatch({ type: 'CLEAR_FORM' });
    }
  }, [dispatch, props.athleteId, props.isOpen]);

  const getAssociatedInjuryIllnessValues = () => {
    return getFormattedIssueIds(
      formState.injury_occurrence_ids,
      formState.illness_occurrence_ids,
      formState.chronic_issue_ids
    );
  };

  const onAthleteChange = (athleteId: number) => {
    dispatch({
      type: 'SET_ATHLETE_ID',
      athleteId,
    });

    setRequestIssuesStatus('PENDING');

    fetchAthleteIssues({
      selectedAthleteId: athleteId,
      useOccurrenceIdValue: false,
      includeDetailedIssue: false,
      issueFilter: null,
      includeIssue: true,
      includeGrouped: true,
    })
      .then(() => setRequestIssuesStatus('SUCCESS'))
      .catch(() => {
        setRequestIssuesStatus('FAILURE');
      });
  };

  const saveTUERecord = (attachmentIds) => {
    const newTUERecord = {
      attachment_ids: attachmentIds,
      expiration_date: formState.tue_expiration_date,
      injury_ids: formState.injury_occurrence_ids,
      illness_ids: formState.illness_occurrence_ids,
      chronic_issue_ids: formState.chronic_issue_ids,
      medical_type: 'TUE',
      medical_name: formState.tue_name,
      note: 'TUE',
      note_date: formState.tue_date,
      note_type: NOTE_TYPE.MEDICAL_NOTE_ID,
      restricted: formState.restricted_to_doc,
      psych_only: formState.restricted_to_psych,
    };
    saveNote(
      // $FlowFixMe athleteId will never be null at this stage
      formState.athlete_id,
      newTUERecord
    )
      .then(() => {
        setRequestStatus('SUCCESS');
        props.onClose();
        fetchMedicalHistory();
      })
      .catch(() => {
        setRequestStatus('FAILURE');
      });
  };

  const uploadAttachmentsAndSave = async (queuedAttachments) => {
    setRequestStatus('PENDING');
    const performUpload = (attachment) => {
      return new Promise((resolve, reject) => {
        const file = attachment.file;
        const fileName = file.name;
        const fileSize = fileSizeLabel(attachment.fileSize, true);
        const fileId = attachment.id;
        props.onFileUploadStart(fileName, fileSize, fileId);
        saveAttachment(file, attachment.fileTitle)
          .then((response) => {
            resolve(response.attachment_id);
            props.onFileUploadSuccess(fileId);
          })
          .catch(() => {
            reject();
            props.onFileUploadFailure(fileId);
          });
      });
    };

    // Unfortunately, this is legacy flow only. We need to wait for the attachments
    // to upload, get the created resource IDs and add this to the mew record
    // There are plans to introduce a new API for TUE records in the future
    await Promise.all(queuedAttachments.map(performUpload)).then(
      (attachmentIds) => {
        saveTUERecord(attachmentIds);
      }
    );
  };

  const onSave = async () => {
    setIsValidationCheckAllowed(true);

    const requiredFields = [
      formState.athlete_id,
      formState.tue_date,
      formState.tue_name,
      formState.tue_expiration_date,
    ];

    const allRequiredFieldsAreValid = requiredFields.every(
      (item) => item && item !== emptyHTMLeditorContent
    );

    if (
      !allRequiredFieldsAreValid ||
      (formState.queuedAttachmentTypes.includes('FILE') &&
        checkInvalidFileTitles(formState.queuedAttachments))
    ) {
      return;
    }

    await uploadAttachmentsAndSave(formState.queuedAttachments);
  };

  const renderDateOfTUEPicker = () => {
    return (
      <AthleteConstraints athleteId={formState.athlete_id}>
        {({ lastActivePeriod, isLoading }) => (
          <div data-testid="AddTUESidePanel|TUEDate">
            <DatePicker
              label={props.t('Date of TUE')}
              onDateChange={(date) => {
                dispatch({
                  type: 'SET_TUE_DATE',
                  tue_date: moment(date).format(dateTransferFormat),
                });
              }}
              todayHighlight
              value={formState.tue_date ? moment(formState.tue_date) : null}
              minDate={lastActivePeriod.start}
              invalid={isValidationCheckAllowed && !formState.tue_date}
              disabled={
                requestStatus === 'PENDING' ||
                !formState.athlete_id ||
                isLoading
              }
              kitmanDesignSystem
            />
          </div>
        )}
      </AthleteConstraints>
    );
  };

  return (
    <div css={style.sidePanel}>
      <SlidingPanelResponsive
        isOpen={props.isOpen}
        title={props.t('Add TUE')}
        onClose={props.onClose}
        width={659}
      >
        <div css={style.section}>
          <div
            css={[style.row, style['row--dualFields']]}
            data-testid="AddTUESidePanel|AthleteSelector"
          >
            <Select
              label={props.t('Athlete')}
              onChange={(id) => onAthleteChange(id)}
              value={formState.athlete_id}
              options={props.squadAthletes}
              isDisabled={
                (!props.isAthleteSelectable && !!props.athleteId) ||
                requestStatus === 'PENDING'
              }
              invalid={isValidationCheckAllowed && !formState.athlete_id}
            />
            {renderDateOfTUEPicker()}
          </div>
          <div
            css={[style.row, style.halfRow]}
            data-testid="AddTUESidePanel|TUEName"
          >
            <InputTextField
              label={props.t('Name of TUE')}
              value={formState.tue_name}
              onChange={(e) =>
                dispatch({
                  type: 'SET_TUE_NAME',
                  tue_name: e.target.value,
                })
              }
              invalid={isValidationCheckAllowed && !formState.tue_name}
              disabled={requestStatus === 'PENDING'}
              kitmanDesignSystem
            />
          </div>
          <div css={style.row} data-testid="AddTUESidePanel|AssociatedInjuries">
            <Select
              label={props.t('Associated injury / illness')}
              onChange={(ids) => {
                const illnessIds = getIssueIds('Illness', ids);
                const injuryIds = getIssueIds('Injury', ids);
                const chronicIds = getIssueIds('ChronicInjury', ids);

                dispatch({ type: 'SET_ILLNESS_IDS', illnessIds });
                dispatch({ type: 'SET_INJURY_IDS', injuryIds });
                dispatch({ type: 'SET_CHRONIC_IDS', chronicIds });
              }}
              value={getAssociatedInjuryIllnessValues()}
              options={enrichedAthleteIssues}
              isMulti
              isDisabled={
                !formState.athlete_id ||
                requestStatus === 'PENDING' ||
                requestIssuesStatus === 'PENDING'
              }
              optional
            />
          </div>

          <div
            css={[style.row, style.halfRow]}
            data-testid="AddTUESidePanel|Visibility"
          >
            <Select
              label={props.t('Visibility')}
              onChange={(visibilityId) =>
                dispatch({ type: 'SET_VISIBILITY', visibilityId })
              }
              options={[
                {
                  label: props.t('Default visibility'),
                  value: 'DEFAULT',
                },
                { label: props.t('Doctors'), value: 'DOCTORS' },
                // disable Psych Team only injury option for now as it's not working
                // { label: props.t('Psych team'), value: 'PSYCH_TEAM' },
              ]}
              value={getRestricVisibilityValue(
                formState.restricted_to_doc,
                formState.restricted_to_psych
              )}
              isDisabled={
                requestStatus === 'PENDING' ||
                props.initialDataRequestStatus === 'FAILURE'
              }
            />
          </div>

          <div
            css={[style.row, style.halfRow]}
            data-testid="AddTUESidePanel|ExpirationDate"
          >
            <DatePicker
              label={props.t('Expiration date')}
              onDateChange={(date) => {
                dispatch({
                  type: 'SET_TUE_EXPIRATION_DATE',
                  tue_expiration_date: moment(date).format(dateTransferFormat),
                });
              }}
              value={
                formState.tue_expiration_date
                  ? moment(formState.tue_expiration_date)
                  : null
              }
              minDate={formState.tue_date ? moment(formState.tue_date) : null}
              disabled={requestStatus === 'PENDING'}
              invalid={
                isValidationCheckAllowed && !formState.tue_expiration_date
              }
              kitmanDesignSystem
            />
          </div>

          <hr css={style.hr} />
          {formState.queuedAttachmentTypes.includes('FILE') && (
            <>
              <FileUploadArea
                showActionButton
                actionIcon="icon-bin"
                areaTitle={props.t('Attach file(s)')}
                attachedFiles={formState.queuedAttachments}
                updateFiles={(queuedAttachments) => {
                  dispatch({
                    type: 'UPDATE_QUEUED_ATTACHMENTS',
                    queuedAttachments,
                  });
                }}
                removeFiles={props.isOpen}
                testIdPrefix="AddTueSidePanel"
                isFileError={false}
                onClickActionButton={() =>
                  dispatch({
                    type: 'REMOVE_ATTACHMENT_TYPE',
                    queuedAttachmentType: 'FILE',
                  })
                }
                acceptedFileTypeCode="imageVideo"
              />
              <hr css={style.hr} />
            </>
          )}

          <div css={style.row} data-testid="AddTUESidePanel|AddAttachment">
            <TooltipMenu
              tooltipTriggerElement={
                <TextButton
                  text={props.t('Add attachment')}
                  type="secondary"
                  iconAfter="icon-chevron-down"
                  kitmanDesignSystem
                />
              }
              menuItems={[
                {
                  description: props.t('File'),
                  onClick: () =>
                    dispatch({
                      type: 'UPDATE_ATTACHMENT_TYPE',
                      queuedAttachmentType: 'FILE',
                    }),
                },
              ]}
              placement="bottom-start"
              appendToParent
              kitmanDesignSystem
            />
          </div>
        </div>

        <div css={style.actions} data-testid="AddTUESidePanel|Actions">
          <TextButton
            onClick={onSave}
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
          />
        </div>
        {(requestStatus === 'FAILURE' ||
          requestIssuesStatus === 'FAILURE' ||
          props.initialDataRequestStatus === 'FAILURE') && (
          <AppStatus status="error" />
        )}
      </SlidingPanelResponsive>
    </div>
  );
};

export const AddTUESidePanelTranslated: ComponentType<Props> =
  withNamespaces()(AddTUESidePanel);
export default AddTUESidePanel;
