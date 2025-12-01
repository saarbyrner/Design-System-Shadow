// @flow
import { useState } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { FileUploadArea, Select } from '@kitman/components';
import { css } from '@emotion/react';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import { colors } from '@kitman/common/src/variables';
import type { ConcussionPermissions } from '@kitman/common/src/contexts/PermissionsContext/concussion/types';
import type { MedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical/types';
import type { Question as QuestionType } from '@kitman/common/src/types/Issues';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { UnuploadedFile } from '../../../../../shared/components/AddTreatmentSidePanel/types';
import style from '../AddIssueSidePanelStyle';
import Attachments from '../../../containers/Attachments';
import ConditionalFieldsForm from '../../../containers/ConditionalFieldsForm';
import ConditionalFieldsFormContainer from '../../../containers/ConditionalFieldsFormContainer';
import LinkedIssues from '../../../containers/LinkedIssues';
import ManageLinksInformation from '../../../containers/ManageLinksInformation';

type Props = {
  // Permissions
  permissions: {
    medical: MedicalPermissions,
    concussion: ConcussionPermissions,
  },
  conditionalFieldsQuestions: Array<QuestionType>,
  onAddAnnotation: Function,
  issueIsAContinuation: boolean,
  isInfoEvent: boolean,
  areAnnotationsInvalid: boolean,
  attachedFiles: AttachedFile[],

  // these are passed up to parent to be passed to PanelActions.
  // logic ported from when this was in the parent addIssue sidepanel.
  uploadQueuedAttachments: boolean,
  isPastAthlete: boolean,
  setAllowCreateIssue: Function,
  onUpdateIssueFiles: (files: UnuploadedFile[]) => void,
};

function AdditionalQuestions(props: I18nProps<Props>) {
  const [isLinkedIssueVisible, setLinkedIssueVisibility] = useState(false);
  const [isFileIssueVisibility, setFileIssueVisibility] = useState(false);
  const [isManageLinkInfoVisible, setManageLinkInfoVisible] = useState(false);

  const options = [
    {
      label: props.t('Note'),
      value: 'NOTE',
      isVisible:
        props.permissions.medical?.notes?.canCreate && !props.isPastAthlete,
      onSelect: () => {
        props.onAddAnnotation('NOTE');
      },
    },
    {
      label: props.t('File'),
      value: 'FILE',
      isVisible: window.featureFlags['files-and-links-on-injuries'],
      onSelect: () => setFileIssueVisibility(true),
    },
    {
      label: props.t('Associated issue'),
      value: 'LINKED_ISSUE',
      isVisible:
        window.featureFlags['linked-injury-illness-performance-medicine'],
      onSelect: () => setLinkedIssueVisibility(true),
    },
    {
      label: props.t('Link'),
      value: 'LINK',
      isVisible: window.featureFlags['files-and-links-on-injuries'],
      onSelect: () => setManageLinkInfoVisible(true),
    },
  ].filter((option) => option.isVisible);

  const getConditionalFieldsForm = () => {
    return window.featureFlags['conditional-fields-v1-stop'] ? (
      <ConditionalFieldsFormContainer />
    ) : (
      <ConditionalFieldsForm />
    );
  };
  if (props.conditionalFieldsQuestions?.length === 0 && options.length === 0) {
    return (
      <div css={style.row} data-testid="AddIssuePanel|NoAdditionalInformation">
        <section css={[style.section, style.additionalInformationSection]}>
          {getConditionalFieldsForm()}
          <div>{props.t('No additional questions')}</div>
        </section>
      </div>
    );
  }

  const removeFileAttachments = () => {
    props.onUpdateIssueFiles([]);
    setFileIssueVisibility(false);
  };

  return (
    <div>
      {window.featureFlags['conditional-fields-showing-in-ip'] &&
        !props.issueIsAContinuation && (
          <>
            <div
              css={style.row}
              data-testid="AddIssuePanel|ConditionalFieldsForm"
            >
              <section css={[style.section, style.conditionalFieldsSection]}>
                {getConditionalFieldsForm()}
              </section>
            </div>

            {props.isInfoEvent && (
              <hr
                css={css`
                  background-color: ${colors.neutral_300};
                  margin: 16px 0;
                  opacity: 0.5;
                `}
              />
            )}
          </>
        )}
      <Attachments
        uploadQueuedAttachments={props.uploadQueuedAttachments}
        setAllowCreateIssue={props.setAllowCreateIssue}
        areAnnotationsInvalid={props.areAnnotationsInvalid}
      />

      {isLinkedIssueVisible && (
        <LinkedIssues onRemove={() => setLinkedIssueVisibility(false)} />
      )}

      {isManageLinkInfoVisible && (
        <ManageLinksInformation
          onRemove={() => setManageLinkInfoVisible(false)}
        />
      )}

      {isFileIssueVisibility && (
        <div
          css={css`
            padding: 0px 25px 0px 25px;
            position: relative;
          `}
        >
          <FileUploadArea
            showActionButton
            areaTitle={props.t('Attach file(s)')}
            actionIcon="icon-bin"
            testIdPrefix=""
            isFileError={false}
            updateFiles={props.onUpdateIssueFiles}
            attachedFiles={props.attachedFiles}
            onClickActionButton={removeFileAttachments}
          />
        </div>
      )}

      {options.length > 0 && (
        <div css={style.section}>
          <div
            css={[
              style.row,
              css`
                .kitmanReactSelect {
                  width: 150px;
                }
              `,
            ]}
          >
            <Select
              appendToBody
              value=""
              placeholder={props.t('Add')}
              options={options}
              onChange={(selected) => {
                const option = options.find(({ value }) => value === selected);

                if (option) {
                  option.onSelect();
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export const AdditionalQuestionsTranslated: ComponentType<Props> =
  withNamespaces()(AdditionalQuestions);
export default AdditionalQuestions;
