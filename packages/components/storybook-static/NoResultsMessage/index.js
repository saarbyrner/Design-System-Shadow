// @flow
import classNames from 'classnames';

type Props = {
  innerHtml: () => Object,
  isVisible?: boolean,
};

const NoResultsMessage = (props: Props) => {
  const classes = classNames('noResultsMessage', {
    'noResultsMessage--isVisible': props.isVisible,
  });

  return (
    <div role="alert" className={classes}>
      {props.innerHtml()}
    </div>
  );
};

export default NoResultsMessage;
