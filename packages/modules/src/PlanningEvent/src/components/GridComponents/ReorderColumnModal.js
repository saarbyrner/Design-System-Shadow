// @flow
import { useState, useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  SortableHandle,
  SortableElement,
  SortableContainer,
  arrayMove,
} from 'react-sortable-hoc';
import classNames from 'classnames';
import { Modal, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type item = { id: number, name: string };

type Props = {
  columnItems: Array<item>,
  isOpen: boolean,
  onSave: Function,
  setIsModalOpen: Function,
};

const DragHandle = SortableHandle((props: { ...Props, columnItem: item }) => (
  <li className={classNames('reorderColumnModal__item')}>
    <span className="icon-reorder-vertical" />
    {props.columnItem.name}
  </li>
));

const SortableItem = SortableElement((props: { ...Props }) => (
  <DragHandle {...props} />
));

const SortableList = SortableContainer(
  (props: { ...Props, sortedColumnItems: Array<item> }) => (
    <ul>
      {props.sortedColumnItems.map((columnItem, index) => (
        <SortableItem
          {...props}
          columnItem={columnItem}
          index={index}
          key={columnItem.id}
          helperClass="draggable"
        />
      ))}
    </ul>
  )
);

const ReorderColumnModal = (props: I18nProps<Props>) => {
  const columnItemWrapper = useRef(null);
  const [orderedItems, setOrderedItems] = useState(props.columnItems);

  return (
    <Modal
      isOpen={props.isOpen}
      close={props.setIsModalOpen}
      onPressEscape={() => props.setIsModalOpen(false)}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Reorder')}</Modal.Title>
      </Modal.Header>

      <Modal.Content>
        <div className="reorderColumnModal__items" ref={columnItemWrapper}>
          <SortableList
            {...props}
            sortedColumnItems={orderedItems}
            onSortEnd={({ oldIndex, newIndex }) => {
              setOrderedItems(arrayMove(orderedItems, oldIndex, newIndex));
            }}
            helperClass="reorderColumnModal__draggable"
            helperContainer={columnItemWrapper.current}
            useDragHandle
          />
        </div>
      </Modal.Content>

      <Modal.Footer>
        <TextButton
          onClick={() => {
            const orderedItemsIds = orderedItems.map(
              (orderedItem) => orderedItem.id
            );
            props.onSave(orderedItemsIds);
            props.setIsModalOpen(false);
          }}
          type="primary"
          text={props.t('Save')}
          testId="reorderColumnModal__saveButton"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default ReorderColumnModal;
export const ReorderColumnModalTranslated =
  withNamespaces()(ReorderColumnModal);
