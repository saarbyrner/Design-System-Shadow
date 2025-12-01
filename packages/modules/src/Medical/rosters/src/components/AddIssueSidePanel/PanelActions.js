// @flow
import { withNamespaces } from 'react-i18next';
import { TextButton } from '@kitman/components';
import { useEffect } from 'react';
import { css } from '@emotion/react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { isChronicIssue } from '../../../../shared/utils';
import type { IssueAttachments } from '../../../types';

type Props = {
  selectedChronicIssue: number,
  currentPage: number,
  annotations: Array<IssueAttachments>,
  issueType: string,
  onClickBack: Function,
  onClickCreateIssue: Function,
  onClickNext: Function,
  setuploadQueuedAttachments: Function,
  setAllowCreateIssue: Function,
  allowCreateIssue: boolean,
  formValidation: (Function) => boolean,
};

const styles = {
  row: css`
    display: flex;
    flex-direction-row;
    gap: 12px;
  `,
};

/**
 *  QueuedAttachments might exist in <NoteAttachments />
 *  state and need to check if they should be added to
 *  respective annotations in Store before creating issue
 */

const PanelActions = (props: I18nProps<Props>) => {
  useEffect(() => {
    if (props.allowCreateIssue) {
      props.onClickCreateIssue(props.issueType);
      props.setAllowCreateIssue(false);
      props.setuploadQueuedAttachments(false);
    }
  }, [props.allowCreateIssue]);
  const isNoPriorChronicRecorded =
    props.selectedChronicIssue === 'NoPriorChronicRecorded';

  const getValidationType = () => {
    if (
      window.featureFlags['preliminary-injury-illness'] &&
      !isChronicIssue(props.issueType) &&
      !isNoPriorChronicRecorded
    ) {
      return 'preliminary';
    }
    return 'full';
  };

  return (
    <>
      {props.currentPage !== 1 && (
        <TextButton
          onClick={() => props.onClickBack()}
          text={props.t('Back')}
          kitmanDesignSystem
        />
      )}
      <div css={styles.row}>
        {window.featureFlags['preliminary-injury-illness'] &&
          !isChronicIssue(props.issueType) &&
          !isNoPriorChronicRecorded && (
            <TextButton
              onClick={() => {
                if (props.formValidation('preliminary')) {
                  if (props.currentPage === 4 && props.annotations.length > 0) {
                    props.setuploadQueuedAttachments(true);
                  } else {
                    props.onClickCreateIssue(props.issueType);
                  }
                }
              }}
              type="textOnly"
              text={props.t('Save Progress')}
              kitmanDesignSystem
            />
          )}

        <TextButton
          onClick={() => {
            const validated = props.formValidation(getValidationType());
            if (validated) {
              if (
                isChronicIssue(props.issueType) &&
                window.featureFlags['chronic-conditions-updated-fields'] &&
                props.currentPage === 2
              ) {
                props.onClickCreateIssue(props.issueType);
              } else if (
                props.currentPage === 4 &&
                props.annotations.length === 0
              ) {
                props.onClickCreateIssue(props.issueType);
              } else if (
                props.currentPage === 4 &&
                props.annotations.length > 0
              ) {
                props.setuploadQueuedAttachments(true);
              } else {
                props.onClickNext();
              }
            }
          }}
          text={props.t('Next')}
          type="primary"
          kitmanDesignSystem
        />
      </div>
    </>
  );
};

export const PanelActionsTranslated = withNamespaces()(PanelActions);
export default PanelActions;
