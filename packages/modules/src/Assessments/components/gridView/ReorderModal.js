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

import { LegacyModal as Modal, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { AssessmentItem } from '../../types';

type Props = {
  onSave: Function,
  onClose: Function,
  assessmentItems: Array<AssessmentItem>,
};

const getItemName = (assessmentItem: AssessmentItem) => {
  switch (assessmentItem.item_type) {
    case 'AssessmentHeader':
      return assessmentItem.item.name;
    case 'AssessmentMetric':
      return assessmentItem.item.training_variable.name;
    case 'AssessmentStatus':
      return assessmentItem.item.variable;
    default:
      return '';
  }
};

const DragHandle = SortableHandle(
  (props: { ...Props, assessmentItem: AssessmentItem }) => (
    <li
      className={classNames('assessmentsReorderModal__item', {
        'assessmentsReorderModal__item--header':
          props.assessmentItem.item_type === 'AssessmentHeader',
      })}
    >
      <span className="icon-reorder-vertical" />
      {getItemName(props.assessmentItem)}
    </li>
  )
);

const SortableItem = SortableElement((props: { ...Props }) => (
  <DragHandle {...props} />
));

const SortableList = SortableContainer(
  (props: { ...Props, sortedAssessmentItems: Array<AssessmentItem> }) => (
    <ul>
      {props.sortedAssessmentItems.map((assessmentItem, index) => (
        <SortableItem
          {...props}
          assessmentItem={assessmentItem}
          index={index}
          key={assessmentItem.id}
          helperClass="draggable"
        />
      ))}
    </ul>
  )
);

const ReorderModal = (props: I18nProps<Props>) => {
  const assessmentItemWrapper = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderedItems, setOrderedItems] = useState(props.assessmentItems);

  return (
    <Modal
      title={props.t('Reorder')}
      isOpen
      close={props.onClose}
      width={560}
      onAfterOpen={() => setIsModalOpen(true)}
    >
      <div className="assessmentsReorderModal">
        <div
          className="assessmentsReorderModal__items"
          ref={assessmentItemWrapper}
        >
          {isModalOpen && (
            <SortableList
              {...props}
              sortedAssessmentItems={orderedItems}
              onSortEnd={({ oldIndex, newIndex }) => {
                setOrderedItems(arrayMove(orderedItems, oldIndex, newIndex));
              }}
              helperClass="assessmentsReorderModal__draggable"
              helperContainer={assessmentItemWrapper.current}
              useDragHandle
            />
          )}
        </div>
        <div className="assessmentsReorderModal__apply">
          <TextButton
            onClick={() => {
              const orderedItemsIds = orderedItems.map(
                (orderedItem) => orderedItem.id
              );
              props.onSave(orderedItemsIds);
              props.onClose();
            }}
            type="primary"
            text={props.t('Save')}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ReorderModal;
export const ReorderModalTranslated = withNamespaces()(ReorderModal);
