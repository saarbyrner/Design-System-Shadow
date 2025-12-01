// @flow
type Props = {};

const Cell = (props: Props) => (
  <td {...props}>
    <div className="tableWidget__loadingCell" />
  </td>
);

export default Cell;
