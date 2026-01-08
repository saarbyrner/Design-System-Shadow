import DummyTablePage from '../../../components/DummyTablePage';

export default {
  title: 'Layout/Dummy Table Page',
  component: DummyTablePage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <DummyTablePage />,
};
