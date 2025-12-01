// @flow
import { Checkbox } from '@kitman/components';
import { useBulkActions } from '../../contexts/BulkActions';

type Props = {
  id: string,
  diagnosticId?: number,
  isChecked: boolean,
  onToggle: Function,
};

const BulkActionsCheckbox = (props: Props) => {
  const { bulkActionsState, updateBulkActionsMode } = useBulkActions();

  return (
    <Checkbox
      id={props.id}
      isChecked={props.isChecked}
      toggle={({ checked }) => {
        if (bulkActionsState.bulkActionsMode) {
          return;
        }
        if (bulkActionsState.bulkActionsMode) {
          updateBulkActionsMode({ status: false });
        }
        props.onToggle(checked);
      }}
      isDisabled={
        !bulkActionsState.bulkActionsDiagnostics.includes(props.diagnosticId) &&
        bulkActionsState.bulkActionsMode
      }
      kitmanDesignSystem
      data-testid="BulkActions|Parent"
    />
  );
};

export default BulkActionsCheckbox;
