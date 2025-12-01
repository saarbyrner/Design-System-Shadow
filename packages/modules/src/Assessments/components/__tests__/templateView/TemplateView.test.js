import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import mockedStore from '../../../redux/utils/mockedStore';
import TemplateView from '../../templateView/TemplateView';

describe('TemplateView component', () => {
  it('renders the template list', () => {
    const preloadedState = {
      ...mockedStore,
      formTemplatesSlice: {
        ...mockedStore.formTemplatesSlice,
        templates: [{ id: 1, name: 'Sample Template Name' }],
      },
    };

    renderWithRedux(<TemplateView />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
