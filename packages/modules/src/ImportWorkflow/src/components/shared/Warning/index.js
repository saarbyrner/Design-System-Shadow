// @flow

import type { Node } from 'react';

type Props = {
  title: string,
  description?: string,
  children?: Node,
};

const Warning = (props: Props) => (
  <div className="importWorkflowWarning">
    <div className="importWorkflowWarning__container">
      <div className="icon-error importWorkflowWarning__icon" />
      <h6 className="importWorkflowWarning__title">{props.title}</h6>

      <div className="importWorkflowWarning__description">
        {props.description}
      </div>

      {props.children}
    </div>
  </div>
);

export default Warning;
