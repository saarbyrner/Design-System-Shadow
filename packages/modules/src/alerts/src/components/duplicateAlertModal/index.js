// @flow
import { useEffect, useState } from 'react';
import _isEmpty from 'lodash/isEmpty';
import { withNamespaces } from 'react-i18next';

import { Select, TextButton, Modal } from '@kitman/components';
import type { Squad } from '@kitman/common/src/types/Squad';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  onClose: Function,
  onSave: Function,
  fetchSquads: Function,
  squads: Array<Squad>,
  isFetchingSquads: boolean,
  hasSquadsErrored: boolean,
  activeSquad: Squad,
};

function DuplicateAlertModal(props: I18nProps<Props>) {
  const [selectedSquad, setSelectedSquad] = useState([]);

  useEffect(() => {
    props.fetchSquads();
  }, []);

  useEffect(() => {
    if (!props.isOpen) {
      setSelectedSquad([]);
    }
  }, [props.isOpen]);

  return (
    <Modal
      isOpen={props.isOpen}
      onPressEscape={() => props.onClose()}
      close={props.onClose}
    >
      <Modal.Header>
        <Modal.Title data-testid="DuplicateAlertModal|ModalTitle">
          {props.t('Duplicate Alert')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <Select
          data-testid="DuplicateAlertModal|SquadSelect"
          onChange={(id) => {
            setSelectedSquad(id);
          }}
          options={props.squads
            .filter((squad) => {
              return squad.id !== props.activeSquad.id;
            })
            .map((squad) => ({
              value: squad.id,
              label: squad.name,
            }))}
          label={props.t('Select Squad')}
          value={selectedSquad}
          isLoading={props.isFetchingSquads}
          isDisabled={props.isFetchingSquads}
          invalid={!props.isFetchingSquads && props.hasSquadsErrored}
          appendToBody
          isMulti
        />
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          onClick={props.onClose}
          kitmanDesignSystem
        />
        <TextButton
          data-testid="DuplicateWidgetModal|SaveButton"
          isDisabled={_isEmpty(selectedSquad)}
          text={props.t('Save')}
          type="primary"
          onClick={() => {
            props.onSave(selectedSquad);
          }}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
}

export const DuplicateAlertModalTranslated =
  withNamespaces()(DuplicateAlertModal);
export default DuplicateAlertModal;
