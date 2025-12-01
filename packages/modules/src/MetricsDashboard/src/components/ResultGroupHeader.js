// @flow
type Props = {
  title: string,
  subtitle?: string,
};

const ResultGroupHeader = (props: Props) => {
  const subtitleHTML = (subtitle: ?string) => {
    if (subtitle === undefined) {
      return '';
    }
    return (
      <span className="km-light-text">
        {props.subtitle ? ` ${props.subtitle}` : ''}
      </span>
    );
  };

  return (
    <tr className="km-datagrid-groupLabel">
      <td>
        {props.title}
        {subtitleHTML(props.subtitle)}
      </td>
      <td colSpan="11">&nbsp;</td>
    </tr>
  );
};

export default ResultGroupHeader;
