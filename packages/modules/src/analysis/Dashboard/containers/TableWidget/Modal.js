import { useSelector, useDispatch } from 'react-redux';
import { TableWidgetModalTranslated as TableWidgetModal } from '../../components/TableWidgetModal';
import {
  addTableWidget,
  closeTableWidgetModal,
} from '../../redux/actions/tableWidgetModal';

export default (props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.tableWidgetModal.isOpen);

  return (
    <TableWidgetModal
      isOpen={isOpen}
      onClickCloseModal={() => {
        dispatch(closeTableWidgetModal());
      }}
      onClickCreateTable={(tableType) => dispatch(addTableWidget(tableType))}
      {...props}
    />
  );
};
