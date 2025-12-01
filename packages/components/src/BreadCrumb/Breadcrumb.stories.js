// @flow
import { useArgs } from '@storybook/client-api';
import Breadcrumb from './index';

export const Basic = () => {
  const [args] = useArgs();

  return <Breadcrumb {...args} />;
};

Basic.args = {
  children: [
    <span className="breadCrumb__raquo" key={1}>
      Link1
    </span>,
    <span className="breadCrumb__raquo" key={2}>
      Link2
    </span>,
    <span className="breadCrumb__raquo" key={2}>
      Link3
    </span>,
  ],
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

export default {
  title: 'Breadcrumb',
  component: Basic,
};
