// @flow
import { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  value: ?string,
  isAbbreviated: boolean,
  removeDefaultStyles?: boolean,
  abbreviatedHeight?: number,
};

const RichTextDisplay = (props: Props) => {
  const wrapperElement = useRef(null);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const createMarkup = () => ({ __html: props.value });

  useEffect(() => {
    if (wrapperElement.current) {
      setWrapperHeight(wrapperElement.current.offsetHeight);
    }
  }, []);

  return (
    <div
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={createMarkup()}
      className={classNames(!props.removeDefaultStyles && 'richTextDisplay', {
        'richTextDisplay--abbreviated':
          !props.removeDefaultStyles &&
          props.isAbbreviated &&
          wrapperHeight > (props.abbreviatedHeight ?? 50),
      })}
      // $FlowFixMe
      ref={wrapperElement}
    />
  );
};

export default RichTextDisplay;
