// @flow
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { useRef, useState, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import { colors } from '@kitman/common/src/variables';

import type { ComponentType } from 'react';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type {
  VisibilityOption,
  RequestStatus,
} from '@kitman/modules/src/Medical/shared/types';

import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import {
  InputTextField,
  TextTag,
  DatePicker,
  RichTextEditor,
  TextButton,
  TooltipMenu,
  Select,
  FileUploadArea,
} from '@kitman/components';
import { Box } from '@kitman/playbook/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import { AttachmentsTranslated as Attachments } from '@kitman/modules/src/Medical/shared/components/NoteCardLayout/components/Attachments';
import NoteCardLayout from '@kitman/modules/src/Medical/shared/components/NoteCardLayout';
import Athlete from '@kitman/modules/src/Medical/shared/components/NoteCardLayout/components/Athlete';
import SquadSelector from '@kitman/modules/src/Medical/shared/components/SquadSelector';

import {
  emptyHTMLeditorContent,
  getRestricVisibilityValue,
  getFormattedIssueIds,
} from '@kitman/modules/src/Medical/shared/utils';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  handleNoteVisibilityChange,
  transformNoteVisibilityOptions,
} from '../ConfidentialNotesVisibility/utils';
import styles from '../styles';
import type { StaffUserSelectOption } from '../../../../../types/medical/StaffUsers';
import type { FormState } from '../hooks/useEditMedicalNoteForm';
import AthleteConstraints from '../../../../AthleteConstraints';

type AttachmentType = 'FILE';

type AthleteIssues = {
  options: Array<Option>,
  isLoading: boolean,
};

type StaffUsers = {
  data: Array<StaffUserSelectOption>,
  isLoading: boolean,
};

type Props = {
  note: MedicalNote,
  withAvatar?: boolean,
  isLoading?: boolean,
  onSetViewType: Function,
  requestStatus: RequestStatus,
  athleteIssues: AthleteIssues,
  staffUsers: StaffUsers,
  formState: FormState,
  fileUploadQueue: AttachedFile[],
  onSetFileUploadQueue: Function,
  onSaveNote: Function,
  onUpdateIssues: Function,
  onUpdateTitle: Function,
  onUpdateDate: Function,
  onUpdateContent: Function,
  onUpdateVisibility: Function,
  onUpdateSquad: Function,
  onUpdateAuthor: Function,
  onResetAttachments: Function,
  onNoteVisibilityChange: Function,
  isPastAthlete: boolean,
  currentUser?: CurrentUserData,
  athleteId: ?number,
};

const EditView = (props: I18nProps<Props>) => {
  const editorRef = useRef(null);

  const { permissions } = usePermissions();

  const isActive = !props.note.expired;

  const [shownAttachmentTypes, setShownAttachmentTypes] = useState<
    Array<'FILE'>
  >([]);

  const visibilityOptions: Array<VisibilityOption> = useMemo(() => [
    { value: 'DEFAULT', label: props.t('Default visibility') },
    { value: 'DOCTORS', label: props.t('Doctors') },
    { value: 'PSYCH_TEAM', label: props.t('Psych Team') },
  ]);
  const isDiagnosticType = props.note?.annotationable_type === 'Diagnostic';
  const isFieldReadOnly = props.note?.content_editable === false;

  const allowConfidentialNote =
    permissions.medical.privateNotes.canCreate &&
    window.featureFlags['confidential-notes'] &&
    !isDiagnosticType;

  const showPlayerMovementDatePicker =
    window.featureFlags['player-movement-aware-datepicker'];

  const renderActionButtons = () => {
    const actions = [
      {
        text: props.t('Discard changes'),
        onClick: () => props.onSetViewType('PRESENTATION'),
        type: 'subtle',
      },
      {
        text: props.t('Save'),
        onClick: props.onSaveNote,
        type: 'primary',
      },
    ];
    return (
      <div data-testid="EditView|Actions">
        {actions.map((action) => (
          <TextButton
            key={action.text}
            text={action.text}
            type={action.type}
            onClick={action.onClick}
            isDisabled={props.isLoading}
            kitmanDesignSystem
          />
        ))}
      </div>
    );
  };

  const renderEditLinkedReason = () => {
    return (
      <Select
        label={props.t('Reason')}
        onChange={props.onUpdateIssues}
        options={[
          {
            value: props.note.annotationable.diagnostic_reason.id,
            label: props.note.annotationable.diagnostic_reason.name,
          },
        ]}
        value={props.note.annotationable.diagnostic_reason.id}
        isDisabled={props.athleteIssues.isLoading || isDiagnosticType}
        appendToBody
      />
    );
  };

  const renderEditLinkedDiagnostic = () => {
    return (
      <Select
        label={props.t('Associated diagnostic')}
        onChange={props.onUpdateIssues}
        options={[
          {
            value: props.note.annotationable.id,
            label: props.note.annotationable.type,
          },
        ]}
        value={props.note.annotationable.id}
        isDisabled={props.athleteIssues.isLoading || isDiagnosticType}
        appendToBody
      />
    );
  };

  const renderEditLinkedIssues = () => {
    return (
      <Select
        label={props.t('Associated injury/ illness')}
        onChange={props.onUpdateIssues}
        options={props.athleteIssues.options}
        value={getFormattedIssueIds(
          props.formState.injury_occurrence_ids,
          props.formState.illness_occurrence_ids,
          props.formState.chronic_issue_ids
        )}
        isDisabled={props.athleteIssues.isLoading || isDiagnosticType}
        optional
        isMulti
        appendToBody
      />
    );
  };

  const renderDatePicker = () => {
    return (
      <div css={styles.row}>
        <AthleteConstraints athleteId={props.athleteId} disableMaxDate>
          {({ lastActivePeriod, isLoading }) => {
            return (
              <DatePicker
                label={props.t('Date of note')}
                name="medicalNoteDate"
                onDateChange={props.onUpdateDate}
                value={props.formState.annotation_date}
                kitmanDesignSystem
                minDate={
                  window.featureFlags[
                    'player-movement-entity-emr-annotations'
                  ] && lastActivePeriod.start
                }
                maxDate={
                  window.featureFlags[
                    'player-movement-entity-emr-annotations'
                  ] && lastActivePeriod.end
                }
                disabled={isLoading || props.requestStatus === 'PENDING'}
              />
            );
          }}
        </AthleteConstraints>
      </div>
    );
  };

  const renderDatePickerNew = () => {
    return (
      <Box
        sx={{
          '> div': {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <MovementAwareDatePicker
          athleteId={props.athleteId || undefined}
          value={moment(props.formState.annotation_date)}
          onChange={(date) => {
            props.onUpdateDate(moment(date).format(dateTransferFormat));
          }}
          inputLabel={props.t('Date of note')}
          disabled={props.requestStatus === 'PENDING'}
          kitmanDesignSystem
        />
      </Box>
    );
  };

  /**
   * Filter and map staff for lastname first, selection
   */
  const filteredStaff = (): Array<Option> => {
    return (
      props.staffUsers.data
        .filter((item) => item.value !== props.currentUser?.id)
        .map(({ value, firstname, lastname }) => ({
          value,
          label: `${lastname}, ${firstname}`,
        }))
        .sort((a, b) => {
          return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
        }) || []
    );
  };

  const renderEditNote = () => {
    return (
      <section css={styles.section}>
        <div css={styles.row}>
          <InputTextField
            name="title"
            label={props.t('Title')}
            kitmanDesignSystem
            value={props.formState.title}
            onChange={(e) => props.onUpdateTitle(e.target.value)}
          />

          <div data-testid="Note|Tag">
            {props.note.organisation_annotation_type.type !==
              'OrganisationAnnotationTypes::Modification' && (
              <span css={styles.status}>
                <TextTag
                  content={props.note.organisation_annotation_type.name}
                />
              </span>
            )}
            {props.note.organisation_annotation_type.type ===
              'OrganisationAnnotationTypes::Modification' &&
              isActive && (
                <span css={styles.status}>
                  <TextTag
                    content={props.t('Active')}
                    backgroundColor={colors.blue_300}
                    textColor={colors.white}
                  />
                </span>
              )}
          </div>
        </div>
        {showPlayerMovementDatePicker
          ? renderDatePickerNew()
          : renderDatePicker()}
        <div css={styles.row}>
          <RichTextEditor
            label={props.t('S.O.A.P notes')}
            onChange={props.onUpdateContent}
            isInvalid={
              !props.formState.content ||
              props.formState.content === emptyHTMLeditorContent
            }
            value={props.note.content}
            forwardedRef={editorRef}
            kitmanDesignSystem
            isDisabled={isFieldReadOnly}
          />
        </div>
      </section>
    );
  };

  const renderSquadSelector = () => {
    return (
      <div css={styles.row}>
        <SquadSelector
          label={props.t('Occurred in Squad')}
          athleteId={props.athleteId}
          value={props.formState.squad_id}
          onChange={props.onUpdateSquad}
          isInvalid={!props.formState.squad_id}
          requestStatus={props.requestStatus}
        />
      </div>
    );
  };

  const renderEditMetaData = () => {
    return (
      <section css={styles.section}>
        <div
          css={[
            styles.row,
            allowConfidentialNote && styles.confidentialNotesRow,
          ]}
        >
          {allowConfidentialNote ? (
            <>
              <Select
                label={props.t('Visibility')}
                onChange={(value) => {
                  props.onNoteVisibilityChange(
                    handleNoteVisibilityChange(value, props.currentUser)
                  );
                }}
                value={props.formState.note_visibility_ids || []}
                options={transformNoteVisibilityOptions(
                  props.currentUser,
                  filteredStaff()
                )}
                appendToBody
                closeMenuOnScroll
                groupBy="submenu"
                menuPlacement="top"
                isDisabled={['PENDING', 'FAILURE'].includes(
                  props.requestStatus
                )}
                multiSelectSubMenu
                showSubmenuActions
                allowClearAll
                allowSelectAll
              />
              {props.formState.note_visibility_ids &&
                props.formState.note_visibility_ids.length >= 1 &&
                !['All', 'Only me'].includes(
                  props.formState.note_visibility_ids[0].label
                ) && (
                  <TextTag
                    displayEllipsisWidth={400}
                    fontSize={14}
                    content=""
                    wrapperCustomStyles={
                      styles.confidentialNotesEditIndicatorWrapper
                    }
                  >
                    <div css={styles.confidentialNotesEditIndicator}>
                      <div className="icon-info-active" />
                      <div>
                        {props.t(
                          'You are changing the visibility of the note.'
                        )}
                        <br />
                        {props.t(
                          'After saving, this note will only be visible to the selected users.'
                        )}
                      </div>
                    </div>
                  </TextTag>
                )}
            </>
          ) : (
            <Select
              label={props.t('Visibility')}
              kitmanDesignSystem
              value={getRestricVisibilityValue(
                props.formState.restricted_to_doc,
                props.formState.restricted_to_psych
              )}
              options={visibilityOptions}
              appendToBody
              isDisabled={['PENDING', 'FAILURE'].includes(props.requestStatus)}
              onChange={props.onUpdateVisibility}
            />
          )}
        </div>
        {renderSquadSelector()}
        {window.featureFlags['note-author-field'] && (
          <div css={styles.row}>
            <Select
              label={props.t('On behalf of')}
              value={props.formState.author_id}
              options={props.staffUsers.data}
              isDisabled={props.staffUsers.isLoading}
              onChange={props.onUpdateAuthor}
              appendToBody
              kitmanDesignSystem
              optional
            />
          </div>
        )}
      </section>
    );
  };

  const setAttachmentTypes = (attachmentType: AttachmentType) => {
    setShownAttachmentTypes((prevShownFileAttachementSection) => [
      ...prevShownFileAttachementSection,
      attachmentType,
    ]);
  };

  const clearAttachmentTypes = (attachmentType: AttachmentType) => {
    setShownAttachmentTypes((prevShownFileAttachementSection) =>
      prevShownFileAttachementSection.filter(
        (section) => section !== attachmentType
      )
    );
  };

  const renderAttachmentSection = () => (
    <section css={styles.fileSection}>
      <hr css={styles.hr} />
      {shownAttachmentTypes.includes('FILE') && (
        <FileUploadArea
          showActionButton
          testIdPrefix="MedicalNoteCard"
          isFileError={false}
          areaTitle={props.t('Attach file(s)')}
          onClickActionButton={() => {
            props.onResetAttachments();
            clearAttachmentTypes('FILE');
          }}
          actionIcon="icon-bin"
          updateFiles={props.onSetFileUploadQueue}
          attachedFiles={props.fileUploadQueue}
        />
      )}
      <div css={styles.row}>
        <TooltipMenu
          tooltipTriggerElement={
            <TextButton
              text={props.t('Add')}
              type="secondary"
              iconAfter="icon-chevron-down"
              kitmanDesignSystem
            />
          }
          menuItems={[
            {
              description: props.t('File'),
              onClick: () => setAttachmentTypes('FILE'),
            },
          ]}
          placement="bottom-start"
          appendToParent
          kitmanDesignSystem
        />
      </div>
    </section>
  );

  const renderDocumentCategories = () => {
    return props.note?.document_note_categories?.map((category) => {
      return <span key={category.id}>{category.name}</span>;
    });
  };

  return (
    <NoteCardLayout
      withBorder
      isLoading={props.requestStatus === 'PENDING'}
      id={props.note.id}
    >
      <NoteCardLayout.LeftContent>
        {props.withAvatar && props.note?.annotationable?.fullname && (
          <Athlete
            avatarUrl={props.note.annotationable.avatar_url}
            fullname={props.note.annotationable.fullname}
            annotationableId={props.note.annotationable.id}
          />
        )}
        {props.withAvatar && props.note?.annotationable?.athlete && (
          <Athlete
            avatarUrl={props.note.annotationable.athlete?.avatar_url}
            fullname={props.note.annotationable.athlete?.fullname}
            annotationableId={props.note.annotationable.athlete?.id}
          />
        )}
        {renderEditNote()}
        {!isDiagnosticType && renderAttachmentSection()}
      </NoteCardLayout.LeftContent>

      <NoteCardLayout.RightContent>
        <NoteCardLayout.Actions>{renderActionButtons()}</NoteCardLayout.Actions>
        <div css={styles.section}>
          {props.note.attachments.length > 0 && (
            // $FlowFixMe
            <Attachments attachments={props.note.attachments} />
          )}
          {renderEditMetaData()}
          {isDiagnosticType && renderEditLinkedReason()}
          {isDiagnosticType && renderEditLinkedDiagnostic()}
          {renderEditLinkedIssues()}
          {props.note.organisation_annotation_type.type ===
            'OrganisationAnnotationTypes::Document' && (
            <div
              css={styles.documentCategory}
              data-testid="MetaData|DocumentCategory"
            >
              <h4 data-testid="MetaData|DocumentCategoryTitle">
                {props.t('Document Category')}
              </h4>
              <div data-testid="MetaData|DocumentCategoryValue">
                {renderDocumentCategories()}
              </div>
            </div>
          )}
          <div css={styles.author} data-testid="MetaData|AuthorDetails">
            {props.t('Created {{date}} by {{author}}', {
              date: DateFormatter.formatStandard({
                date: moment(props.note.created_at),
              }),
              author: props?.note?.created_by?.fullname || '',
              interpolation: { escapeValue: false },
            })}{' '}
            {window.featureFlags['note-author-field'] &&
              props?.note?.author?.fullname &&
              props.t('on behalf of {{userName}}', {
                userName: props?.note?.author?.fullname,
                interpolation: { escapeValue: false },
              })}
          </div>
        </div>
      </NoteCardLayout.RightContent>
    </NoteCardLayout>
  );
};

EditView.defaultProps = {
  isLoading: false,
  withAvatar: false,
};

export const EditViewTranslated: ComponentType<Props> =
  withNamespaces()(EditView);
export default EditView;
