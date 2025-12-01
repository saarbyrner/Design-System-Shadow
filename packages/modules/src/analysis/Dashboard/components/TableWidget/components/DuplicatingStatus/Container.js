// @flow
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearDuplicateColumnError,
  duplicateTableColumn,
} from '../../../../redux/actions/tableWidget';
import {
  hasColumnErroredDuplicting,
  isColumnDuplicating,
} from '../../../../redux/selectors';
import { DuplicatingStatusTranslated as DuplicatingStatus } from './Component';

type Props = {
  columnId: number,
  widgetId: number,
  numRows: number,
};

function DuplicatingStatusContainer(props: Props) {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) =>
    isColumnDuplicating(state, props.columnId)
  );
  const hasErrored = useSelector((state) =>
    hasColumnErroredDuplicting(state, props.columnId)
  );

  const reload = useCallback(() => {
    dispatch(duplicateTableColumn(props.widgetId, props.columnId));
  }, []);

  const cancel = useCallback(() => {
    dispatch(clearDuplicateColumnError(props.columnId));
  }, []);

  return (
    <DuplicatingStatus
      isLoading={isLoading}
      hasErrored={hasErrored}
      reload={reload}
      cancel={cancel}
      numRows={props.numRows}
    />
  );
}

export default DuplicatingStatusContainer;
