// @flow
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import FileUploadField from './index';

export const Basic = () => {
  const [args] = useArgs();

  return <FileUploadField {...args} />;
};

Basic.parameters = {
  controls: { hideNoControlsWarning: true },
};

Basic.args = {
  separateBrowseButton: false,
  allowMultiple: true,
  maxFiles: 4,
  labelIdleText: 'Drag and drop your files here',
  separateBrowseButtonDisabled: false,
  allowImagePreview: false,
  allowOpenUploadedFile: false,
  allowDropOnPage: false,
  updateFiles: action('updateFiles'),
  removeUploadedFile: action('removeUploadedFile'),
  files: [
    {
      id: 12345566,
      original_filename: 'physio_2211_jon_doe.jpg',
      filename: 'physio_2211_jon_doe.jpg',
      created: '2019-06-25T23:00:00Z',
      filesize: 1564,
      confirmed: true,
    },
    {
      id: 5465656,
      original_filename: 'physio_2211_jon_doe.doc',
      filename: 'physio_2211_jon_doe.doc',
      created: '2019-06-25T23:00:00Z',
      filesize: 123,
      confirmed: true,
    },
  ],
  t: (t) => t,
};

export default {
  title: 'FileUploadField',
  component: Basic,
  argTypes: {
    separateBrowseButton: { control: { type: 'boolean' } },
    allowMultiple: { control: { type: 'boolean' } },
    maxFiles: { control: { type: 'number' } },
    labelIdleText: { control: { type: 'text' } },
    separateBrowseButtonDisabled: { control: { type: 'boolean' } },
    allowImagePreview: { control: { type: 'boolean' } },
    allowOpenUploadedFile: { control: { type: 'boolean' } },
    allowDropOnPage: { control: { type: 'boolean' } },
  },
};
