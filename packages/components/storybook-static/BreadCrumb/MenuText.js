// @flow
type Props = {
  label: string,
};

const MenuText = (props: Props) => (
  <span className="breadCrumb__textItem" key={props.label}>
    {props.label}
  </span>
);

export default MenuText;
