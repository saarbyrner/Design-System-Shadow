// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import type { DevelopmentGoalCompletionType } from '@kitman/modules/src/PlanningHub/src/services/getDevelopmentGoalCompletionTypes';
import { colors } from '@kitman/common/src/variables';
import { Modal, TextButton } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  developmentGoalCompletionTypes: Array<DevelopmentGoalCompletionType>,
  onUnarchive: (developmentGoalCompletionTypeId: number | string) => void,
  onClose: Function,
};

const styles = {
  listHeading: css`
    color: ${colors.grey_100};
    font-size: 14px;
    font-weight: 600;
  `,
  list: css`
    border-top: 2px solid ${colors.neutral_300};
    color: ${colors.grey_300};
    list-style: none;
    padding: 10px 0 0 0;
    width: 100%;
    li {
      align-items: center;
      display: flex;
      justify-content: space-between;
      line-height: 1;
    }
  `,
};

const DevelopmentGoalCompletionTypeArchiveModal = (props: I18nProps<Props>) => {
  const onUnarchive = (developmentGoalCompletionTypeId: number | string) => {
    TrackEvent(
      'Org Settings Planning',
      'Unarchive',
      'Development goal completion type'
    );
    props.onUnarchive(developmentGoalCompletionTypeId);
  };

  return (
    <Modal
      onPressEscape={props.onClose}
      isOpen={props.isOpen}
      close={props.onClose}
    >
      <Modal.Header>
        <Modal.Title>
          {props.t('Archived Development goal completion type')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <h5 css={styles.listHeading}>{props.t('Name')}</h5>
        <ul css={styles.list}>
          {props.developmentGoalCompletionTypes.map(
            (developmentGoalCompletionType) => (
              <li key={developmentGoalCompletionType.id}>
                {developmentGoalCompletionType.name}
                <TextButton
                  text={props.t('Unarchive')}
                  type="link"
                  onClick={() => onUnarchive(developmentGoalCompletionType.id)}
                  kitmanDesignSystem
                />
              </li>
            )
          )}
        </ul>
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Done')}
          type="primary"
          onClick={props.onClose}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export default DevelopmentGoalCompletionTypeArchiveModal;
export const DevelopmentGoalCompletionTypeArchiveModalTranslated: ComponentType<Props> =
  withNamespaces()(DevelopmentGoalCompletionTypeArchiveModal);
