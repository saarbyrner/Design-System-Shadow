// @flow
import { withNamespaces } from 'react-i18next';

import { Modal, TextButton } from '@kitman/components';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import style from './style';

type Props = {
  isOpen: boolean,
  isMulti: boolean,
  isFromArchive: boolean,
  onDelete: () => void,
  onCancel: () => void,
};

export default withNamespaces()((props: I18nProps<Props>) => {
  const getFirstParagraph = (): string => {
    if (props.isFromArchive) {
      return props.t(
        'Are you sure you want to delete these drills for everyone from the club drill archive?'
      );
    }
    if (props.isMulti) {
      return props.t(
        'Are you sure you want to delete these drills for everyone from the club drill library?'
      );
    }
    return props.t(
      'Are you sure you want to delete this drill for everyone from the club drill library?'
    );
  };
  const getSecondParagraph = (): string => {
    if (props.isFromArchive) {
      return '';
    }
    if (props.isMulti) {
      return props.t(
        'The legacy versions of these drills will still appear in the old session plans.'
      );
    }
    return props.t(
      'A legacy version of this drill will still appear in the old session plans.'
    );
  };

  const deleteDrillText = props.isMulti
    ? props.t('Delete drills')
    : props.t('Delete drill');

  return (
    <Modal
      isOpen={props.isOpen}
      outsideClickCloses
      overlapSidePanel
      width="small"
      onPressEscape={props.onCancel}
      close={props.onCancel}
    >
      <Modal.Header>
        <Modal.Title>
          {props.t('{{deleteDrillText}} from club library', {
            deleteDrillText,
          })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <div css={style.text}>
          <p>{getFirstParagraph()}</p>
          <p>{getSecondParagraph()}</p>
        </div>
      </Modal.Content>
      <div css={style.buttons}>
        <Modal.Footer>
          <TextButton
            text={props.t('Cancel')}
            onClick={props.onCancel}
            type="textOnly"
            kitmanDesignSystem
          />
          <div css={style.deleteButton}>
            <TextButton
              text={props.t('Delete')}
              onClick={props.onDelete}
              type="primary"
              kitmanDesignSystem
            />
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
});
