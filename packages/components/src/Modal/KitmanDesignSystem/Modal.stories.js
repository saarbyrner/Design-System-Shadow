// @flow
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import { TextButton } from '@kitman/components';
import Modal from '.';

// @flow
export const Basic = () => {
  const [args] = useArgs();

  return (
    <Modal {...args}>
      <Modal.Header>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Modal.Content>
      <Modal.Footer>
        <TextButton text="Save" type="primary" kitmanDesignSystem />
      </Modal.Footer>
    </Modal>
  );
};

Basic.args = {
  isOpen: true,
  width: 'medium',
  onPressEscape: action('onClose'),
  t: (txt) => txt,
};

export default {
  title: 'Modal',
  component: Modal,
  argTypes: {
    width: {
      control: {
        options: ['small', 'medium', 'large', 'x-large'],
        type: 'select',
      },
    },
  },
};
