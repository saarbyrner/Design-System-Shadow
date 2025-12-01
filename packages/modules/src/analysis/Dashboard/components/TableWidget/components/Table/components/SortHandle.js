// @flow
import { SortableHandle } from 'react-sortable-hoc';
import classNames from 'classnames';

type Props = {
  absolute: boolean,
  className?: string,
};

const SortHandleButton = SortableHandle(({ absolute, className }: Props) => (
  <div
    className={classNames(
      'tableWidget__sortHandle',
      {
        'tableWidget__sortHandle--absolute': absolute,
      },
      className
    )}
  >
    <i className="icon-more" />
    <i className="icon-more" />
  </div>
));

SortHandleButton.defaultProps = {
  absolute: false,
};

export default SortHandleButton;
