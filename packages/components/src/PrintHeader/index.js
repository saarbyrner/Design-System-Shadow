// @flow
import type { Node } from 'react';

type PrintHeaderItem = {
  title: string,
  value: string,
};

type Props = {
  logoPath: string,
  logoAlt?: string,
  titleContent?: Node,
  items: Array<PrintHeaderItem>,
};

const PrintHeader = (props: Props) => {
  const getItems = () =>
    props.items.map((item) => (
      <div className="printHeader__item" key={item.title}>
        <strong className="printHeader__itemTitle">{item.title}</strong>
        <div className="printHeader__itemText">{item.value}</div>
      </div>
    ));
  return (
    <div className="printHeader" role="heading" aria-level="1">
      <img src={props.logoPath} alt={props.logoAlt || ''} />
      <div className="printHeader__container">
        {props.titleContent || null}
        {getItems()}
      </div>
    </div>
  );
};

export default PrintHeader;
