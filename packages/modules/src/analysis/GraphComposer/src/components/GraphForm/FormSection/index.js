// @flow
import type { Node } from 'react';
import classNames from 'classnames';
import { colors } from '@kitman/common/src/variables';
import type { GraphType } from '@kitman/modules/src/analysis/shared/types';

type Props = {
  title?: ?string,
  children?: Node,
  border?: 'top' | 'bottom',
  sectionNumber?: ?number,
  sectionStyle?: ?GraphType,
};

const FormSection = (props: Props) => {
  const classes = classNames('graphComposerFormSection', {
    'graphComposerFormSection--borderTop': props.border === 'top',
    'graphComposerFormSection--borderBottom': props.border === 'bottom',
    'graphComposerFormSection--leftGutter':
      props.sectionNumber || props.sectionStyle,
    'graphComposerFormSection--noTitle': !props.title,
  });

  const sectionStyleIcon = (
    <svg
      className="graphComposerFormSection__sectionStyleIcon"
      width="21"
      height="23"
      viewBox="0 0 21 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.72734 8C7.17306 8 6.72452 8.45083 6.72735 9.00511L6.79372 22.0051C6.79653 22.5554 7.24341 23 7.79371 23H8.55556C9.10784 23 9.55556 22.5523 9.55556 22V9C9.55556 8.44772 9.10784 8 8.55556 8H7.72734ZM11.4444 12C11.4444 11.4477 11.8922 11 12.4444 11H13.2778C13.8301 11 14.2778 11.4477 14.2778 12V22C14.2778 22.5523 13.8301 23 13.2778 23H12.4444C11.8922 23 11.4444 22.5523 11.4444 22V12ZM3 12.5C2.44772 12.5 2 12.9477 2 13.5V22C2 22.5523 2.44771 23 3 23H3.83333C4.38562 23 4.83333 22.5523 4.83333 22V13.5C4.83333 12.9477 4.38562 12.5 3.83333 12.5H3ZM17.1667 12.5C16.6144 12.5 16.1667 12.9477 16.1667 13.5V22C16.1667 22.5523 16.6144 23 17.1667 23H18C18.5523 23 19 22.5523 19 22V13.5C19 12.9477 18.5523 12.5 18 12.5H17.1667Z"
        fill={props.sectionStyle === 'column' ? colors.p01 : colors.s13}
      />
      <path
        d="M2 7L8.14145 2L13 7L19 2.71429"
        stroke={props.sectionStyle === 'line' ? colors.p01 : colors.s13}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className={classes}>
      {props.sectionNumber && (
        <div className="graphComposerFormSection__sectionNumber">
          {props.sectionNumber}
        </div>
      )}
      {props.sectionStyle && sectionStyleIcon}
      {props.title ? (
        <h5 className="graphComposerFormSection__title">{props.title}</h5>
      ) : null}
      {props.children}
    </div>
  );
};

export default FormSection;
