// @flow
import { Link } from '@kitman/components';
import type { MenuItem } from '@kitman/common/src/types';

const MenuLink = (props: MenuItem) => {
  const key = `${props.label}-${props.url}`;

  // setting HTML "disabled" on anchor tags is not possible
  if (props.isDisabled === true) {
    return (
      <span className="breadCrumb__disabledLink" key={key}>
        {props.label}
      </span>
    );
  }

  return (
    <Link href={props.url} key={key}>
      {props.label}
    </Link>
  );
};

export default MenuLink;
