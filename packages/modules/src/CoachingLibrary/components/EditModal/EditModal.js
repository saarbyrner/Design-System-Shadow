// @flow
import { withNamespaces } from 'react-i18next';

import { Modal, TextButton, Select } from '@kitman/components';
import { defaultMapToOptions } from '@kitman/components/src/Select/utils';
import type { ActivityType } from '@kitman/services/src/services/planning';
import type { Translation } from '@kitman/common/src/types/i18n';

import style from './style';

type Props = {
  isOpen: boolean,
  drillsNumber: number,
  types: Array<ActivityType>,
  typeId: number,
  setTypeId: (number) => void,
  onEdit: () => void,
  onCancel: () => void,
  t: Translation,
};

export default withNamespaces()((props: Props) => {
  const squads =
    props.types
      .find(({ id }) => id === props.typeId)
      ?.squads?.map(({ name }) => name)
      .join(', ') || props.t('None');

  return (
    <Modal
      isOpen={props.isOpen}
      outsideClickCloses
      overlapSidePanel
      width="small"
      onPressEscape={props.onCancel}
      close={props.onCancel}
      additionalStyle={style.modal}
    >
      <Modal.Header>
        <Modal.Title>
          {props.drillsNumber > 1
            ? props.t('Bulk update {{count}} drills', {
                count: props.drillsNumber,
              })
            : props.t('Bulk update {{count}} drill', {
                count: props.drillsNumber,
              })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <div css={style.text}>
          <Select
            placeholder={props.t('Activity type')}
            options={defaultMapToOptions(props.types)}
            value={props.typeId}
            onChange={props.setTypeId}
            isSearchable
            appendToBody
          />
          <span css={style.squads}>
            {`${props.t('Associated squads')}: ${squads}`}
          </span>
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
          <TextButton
            text={
              props.drillsNumber > 1 ? props.t('Update all') : props.t('Update')
            }
            onClick={props.onEdit}
            type="primary"
            kitmanDesignSystem
          />
        </Modal.Footer>
      </div>
    </Modal>
  );
});
