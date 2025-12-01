import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import mockedStore from '@kitman/modules/src/Assessments/redux/utils/mockedStore';
import GridView from '../../gridView/GridView';

describe('GridView component', () => {
  it('renders the list of assessments', async () => {
    const preloadedState = {
      ...mockedStore,
      assessments: [{ id: 1, name: 'Sample Assessment', items: [] }],
      appState: {
        ...mockedStore.appState,
        assessmentsRequestStatus: 'SUCCESS',
      },
    };

    renderWithRedux(<GridView />, {
      useGlobalStore: false,
      preloadedState,
    });

    expect(await screen.findByText('Sample Assessment')).toBeInTheDocument();
  });
});
