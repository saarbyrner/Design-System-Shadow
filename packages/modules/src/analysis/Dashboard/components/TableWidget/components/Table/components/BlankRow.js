// @flow
import classNames from 'classnames';

type Props = {
  header: boolean,
  historicalSquadEnabled?: boolean,
  className?: string,
};

const BlankRow = ({ header, historicalSquadEnabled, ...props }: Props) => (
  <tr
    className={classNames(
      'tableWidget__blankRow',
      {
        'tableWidget__blankRow--header': header,
        'tableWidget__blankRow--historicalSquadEnabled': historicalSquadEnabled,
      },
      props.className
    )}
    {...props}
  >
    <td />
  </tr>
);

BlankRow.defaultProps = {
  header: false,
};

export default BlankRow;
