// @flow
import { AppStatus, LineLoader } from '@kitman/components';
import QuestionSectionsDisplay from '@kitman/modules/src/Medical/shared/components/DynamicMedicalForms/QuestionSectionsDisplay';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import { FormInfoSectionTranslated as FormInfoSection } from '@kitman/modules/src/Medical/forms/src/components/FormInfoSection';
import { FormLinkedIssueSectionTranslated as FormLinkedIssueSection } from '@kitman/modules/src/Medical/forms/src/components/FormLinkedIssueSection';
import { FormAttachmentsSectionTranslated as FormAttachmentsSection } from '@kitman/modules/src/Medical/forms/src/components/FormAttachmentsSection';
import type {
  QuestionSection,
  FormInfo,
} from '@kitman/modules/src/Medical/shared/types/medical/QuestionTypes';
import style from './style';

type Props = {
  sections: Array<QuestionSection>,
  formInfo: ?FormInfo,
  displayFormInfo: boolean,
  requestStatus: RequestStatus,
  concussionLoading: RequestStatus,
  formId: number,
  updateForms: Function,
};

const FormOverviewTab = (props: Props) => {
  if (props.requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  const canShowFormLinkedIssueSection =
    props.formInfo?.formMeta.key === 'concussion_incident' ||
    props.formInfo?.formMeta.key === 'concussion_rtp' ||
    ((props.formInfo?.formMeta.group === 'scat5' ||
      props.formInfo?.formMeta.group === 'king_devick' ||
      props.formInfo?.formMeta.group === 'npc') &&
      props.formInfo?.formMeta.key !== 'baseline');

  return (
    <div css={style.formOverviewTab}>
      {props.requestStatus === 'PENDING' && (
        <div css={style.sectionLoader}>
          <LineLoader />
        </div>
      )}
      {props.requestStatus === 'SUCCESS' && (
        <>
          <div css={style.mainContent}>
            <QuestionSectionsDisplay
              firstSectionHeader={props.formInfo?.headerTitle}
              sections={props.sections.filter(
                (section) => !section.sidePanelSection
              )}
              mergeSections={props.formInfo?.mergeSections || false}
            />
          </div>
          <div css={style.sidebar}>
            <QuestionSectionsDisplay
              sections={
                props.sections.filter((section) => section.sidePanelSection) ||
                []
              }
              mergeSections={false}
            />
            {props.displayFormInfo && props.formInfo && (
              <FormInfoSection formInfo={props.formInfo} />
            )}
            {props.formInfo && canShowFormLinkedIssueSection && (
              <FormLinkedIssueSection
                formId={props.formId}
                formInfo={props.formInfo}
                linkedInjuriesIllnesses={
                  props.formInfo && props.formInfo.linked_injuries_illnesses
                    ? props.formInfo.linked_injuries_illnesses
                    : []
                }
                concussionLoading={props.concussionLoading}
                updateForms={props.updateForms}
              />
            )}
            {props.formInfo && props.formInfo.attachments.length > 0 && (
              <FormAttachmentsSection
                attachments={props.formInfo.attachments}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FormOverviewTab;
