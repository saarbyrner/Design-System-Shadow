// @flow
import { useMemo } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { TooltipMenu } from '@kitman/components';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import NoteCardLayout from '@kitman/modules/src/Medical/shared/components/NoteCardLayout';
import Athlete from '@kitman/modules/src/Medical/shared/components/NoteCardLayout/components/Athlete';
import { NoteTranslated as Note } from '@kitman/modules/src/Medical/shared/components/NoteCardLayout/components/Note';
import { LinkedIssuesTranslated as LinkedIssues } from '@kitman/modules/src/Medical/shared/components/NoteCardLayout/components/LinkedIssues';
import { LinkedDiagnosticTranslated as LinkedDiagnostic } from '@kitman/modules/src/Medical/shared/components/NoteCardLayout/components/LinkedDiagnostic';
import { LinkedProcedureTranslated as LinkedProcedure } from '@kitman/modules/src/Medical/shared/components/NoteCardLayout/components/LinkedProcedure';
import { LinkedReasonTranslated as LinkedReason } from '@kitman/modules/src/Medical/shared/components/NoteCardLayout/components/LinkedReason';
import { MetaDataTranslated as MetaDataView } from '@kitman/modules/src/Medical/shared/components/NoteCardLayout/components/MetaData';
import { ArchiveReasonTranslated as ArchiveReason } from '@kitman/modules/src/Medical/shared/components/NoteCardLayout/components/ArchiveReason';
import { AttachmentsTranslated as Attachments } from '@kitman/modules/src/Medical/shared/components/NoteCardLayout/components/Attachments';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu/index';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { CurrentUserData } from '@kitman/services/src/services/getCurrentUser';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import {
  determineMedicalLevelAndTab,
  getNoteActionElement,
} from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import { ConfidentialNotesTranslated as ConfidentialNotesVisibility } from '../ConfidentialNotesVisibility';
import { NoteHistoryTranslated as NoteHistory } from '../NoteHistory';
import style from '../styles';

type Props = {
  currentUser?: CurrentUserData,
  isLoading?: boolean,
  withAvatar?: boolean,
  note: MedicalNote,
  onSetViewType: Function,
  onArchiveNote: Function,
  onDuplicateNote: Function,
  hasActions: boolean,
  athleteData?: AthleteData,
};

const PresentationView = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { trackEvent } = useEventTracking();

  const getVisibility = () => {
    if (props.note.restricted_to_doc)
      return { value: 'DOCTORS', label: props.t('Doctors') };
    if (props.note.restricted_to_psych)
      return { value: 'PSYCH_TEAM', label: props.t('Psych Team') };
    return { value: 'DEFAULT', label: props.t('Default visibility') };
  };

  const isDiagnosticType = props.note?.annotationable_type === 'Diagnostic';
  const isProcedureType =
    props.note?.annotationable_type === 'Emr::Private::Models::Procedure';

  const allowConfidentialNote =
    permissions.medical.privateNotes.canCreate &&
    window.featureFlags['confidential-notes'] &&
    !isDiagnosticType;

  const isAthleteOnTrial =
    props.athleteData?.constraints?.organisation_status === 'TRIAL_ATHLETE';
  const getMetaData = useMemo(() => [
    {
      text: props.t('Visibility'),
      value: getVisibility().label,
    },
    {
      text: props.t('Occurred in Squad'),
      value: props.note?.squad?.name || '--',
    },
  ]);

  const canEdit =
    permissions.medical.notes.canEdit &&
    props.note.organisation_annotation_type.type !==
      'OrganisationAnnotationTypes::Telephone';

  const canDuplicate =
    permissions.medical.notes.canCreate &&
    props.note.organisation_annotation_type.type !==
      'OrganisationAnnotationTypes::Telephone';

  const canArchive = permissions.medical.notes.canArchive;

  const tooltipItems: Array<TooltipItem> = useMemo(
    () =>
      [
        {
          id: 'edit',
          description: props.t('Edit'),
          onClick: () => {
            trackEvent(performanceMedicineEventNames.clickEditMedicalNote, {
              ...determineMedicalLevelAndTab(),
              ...getNoteActionElement('Note meatball'),
            });
            props.onSetViewType('EDIT');
          },
          isVisible: canEdit && !isAthleteOnTrial,
        },
        {
          id: 'duplicate',
          description: props.t('Duplicate'),
          onClick: () => {
            trackEvent(
              performanceMedicineEventNames.clickDuplicateMedicalNote,
              {
                ...determineMedicalLevelAndTab(),
                ...getNoteActionElement('Note meatball'),
              }
            );
            props.onDuplicateNote();
          },
          isVisible: canDuplicate && !isAthleteOnTrial,
        },
        {
          id: 'archive',
          description: props.t('Archive'),
          onClick: () => {
            trackEvent(performanceMedicineEventNames.clickArchiveMedicalNote, {
              ...determineMedicalLevelAndTab(),
              ...getNoteActionElement('Note meatball'),
            });
            props.onArchiveNote();
          },
          isVisible: canArchive && !isAthleteOnTrial,
        },
      ]
        .filter((i) => i.isVisible)
        .map((i) => {
          return {
            id: i.id,
            description: i.description,
            onClick: i.onClick,
          };
        }),
    [canEdit, canDuplicate, canArchive]
  );

  const linkedIssues = isDiagnosticType
    ? props.note.annotationable.issue_occurrences
    : [...props.note.illness_occurrences, ...props.note.injury_occurrences];
  // Keeping `chronicIssues` in a separate variable and prop because it follows a different object schema.
  const chronicIssues =
    isDiagnosticType || isProcedureType ? [] : props.note.chronic_issues;

  const athleteId = props.note?.annotationable?.athlete?.id
    ? props.note.annotationable.athlete.id
    : props.note.annotationable.id;

  const linkedDiagnostic = {
    id: props.note?.annotationable?.id,
    type: props.note?.annotationable?.type,
  };

  const linkedProcedure = {
    id: props.note?.annotationable?.id,
    type: props.note?.annotationable?.procedure_type?.name,
  };

  const linkedReason =
    props.note?.annotationable?.diagnostic_reason ||
    props.note?.annotationable?.procedure_reason;

  const renderLinkedIssues = () => {
    return (
      <div data-testid="PresentationView|LinkedIssues">
        <LinkedIssues
          issues={linkedIssues}
          chronicIssues={chronicIssues}
          annotationableId={athleteId}
        />
      </div>
    );
  };

  const renderLinkedDiagnostic = () => {
    return (
      <div data-testid="PresentationView|LinkedDiagnostic">
        <LinkedDiagnostic
          diagnostic={linkedDiagnostic}
          annotationableId={athleteId}
        />
      </div>
    );
  };
  const renderLinkedProcedure = () => {
    return (
      <div data-testid="PresentationView|LinkedDiagnostic">
        <LinkedProcedure procedure={linkedProcedure} />
      </div>
    );
  };

  const renderLinkedReason = () => {
    return (
      <div data-testid="PresentationView|LinkedReason">
        <LinkedReason reason={linkedReason} />
      </div>
    );
  };

  const renderDocumentCategories = () => {
    return props.note?.document_note_categories?.map((category) => {
      return <span key={category.id}>{category.name}</span>;
    });
  };

  const canRenderTooltipActions = () => {
    return props.hasActions && !props.note.archived && tooltipItems.length > 0;
  };

  return (
    <NoteCardLayout withBorder isLoading={props.isLoading} id={props.note.id}>
      <NoteCardLayout.LeftContent>
        {props.withAvatar && props.note?.annotationable?.fullname && (
          <Athlete
            avatarUrl={props.note?.annotationable?.avatar_url}
            fullname={props.note?.annotationable?.fullname}
            annotationableId={props.note?.annotationable?.id}
          />
        )}
        {props.withAvatar && props.note?.annotationable?.athlete && (
          <Athlete
            avatarUrl={props.note?.annotationable?.athlete?.avatar_url}
            fullname={props.note?.annotationable?.athlete?.fullname}
            annotationableId={props.note?.annotationable?.athlete?.id}
          />
        )}
        <Note note={props.note} />
        {props.note.versions && props.note.versions.length > 0 && (
          <NoteHistory history={props.note.versions} />
        )}
      </NoteCardLayout.LeftContent>
      <NoteCardLayout.RightContent>
        {canRenderTooltipActions() && (
          <NoteCardLayout.Actions>
            <TooltipMenu
              placement="bottom-start"
              offset={[0, 0]}
              menuItems={tooltipItems}
              tooltipTriggerElement={
                <button css={style.actionButton} type="button">
                  <i className="icon-more" />
                </button>
              }
              disabled={props.isLoading}
              kitmanDesignSystem
            />
          </NoteCardLayout.Actions>
        )}

        {permissions.medical.issues.canView &&
          (linkedIssues.length > 0 || chronicIssues.length > 0) &&
          renderLinkedIssues()}

        {permissions.medical.issues.canView &&
          linkedReason &&
          renderLinkedReason()}

        {permissions.medical.issues.canView &&
          isDiagnosticType &&
          renderLinkedDiagnostic()}

        {permissions.medical.issues.canView &&
          isProcedureType &&
          renderLinkedProcedure()}

        {props.note.attachments.length > 0 && (
          // $FlowFixMe
          <Attachments attachments={props.note.attachments} />
        )}

        {permissions.medical.notes.canArchive &&
          props.note.archived &&
          props.note.archive_reason && (
            <ArchiveReason t={props.t} reason={props.note.archive_reason} />
          )}

        {!allowConfidentialNote && getMetaData.length > 0 && (
          <MetaDataView metaData={getMetaData} />
        )}

        {allowConfidentialNote && (
          <>
            <ConfidentialNotesVisibility
              note={props.note}
              currentUser={props.currentUser}
            />
            <MetaDataView
              metaData={[
                {
                  text: props.t('Occurred in Squad'),
                  value: props.note?.squad?.name || '--',
                },
              ]}
            />
          </>
        )}

        {props.note.organisation_annotation_type.type ===
          'OrganisationAnnotationTypes::Document' && (
          <div
            css={style.documentCategory}
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

        <div css={style.author} data-testid="MetaData|AuthorDetails">
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

        {props.note.archived && props.note.updated_by && (
          <div css={style.author} data-testid="MetaData|ArchivedDetails">
            {props.t('Archived {{date}}, {{time}} by {{author}}', {
              date: DateFormatter.formatStandard({
                date: moment(props.note.updated_at),
              }),
              time: moment(props.note.updated_at).format('LT'),
              author: props?.note?.updated_by?.fullname || '',
              interpolation: { escapeValue: false },
            })}
          </div>
        )}
      </NoteCardLayout.RightContent>
    </NoteCardLayout>
  );
};

PresentationView.defaultProps = {
  isLoading: false,
  withAvatar: false,
};

export const PresentationViewTranslated: ComponentType<Props> =
  withNamespaces()(PresentationView);
export default PresentationView;
