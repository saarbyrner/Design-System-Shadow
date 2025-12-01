import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { setupStore } from '@kitman/modules/src/AppRoot/store';

import App from '../../components/App';

describe('Import Workflow <App /> component', () => {
  const props = {
    event: {
      id: 1,
      eventType: 'TRAINING_SESSION',
      sessionTypeId: '',
      workloadType: '',
      duration: '',
      date: '',
    },
    t: (value) => value,
  };

  it('renders the SourceSelection step', () => {
    render(
      <Provider store={setupStore()}>
        <App {...props} />
      </Provider>
    );

    // Use getByText to check modal title
    expect(screen.getByText('Import - Data Source')).toBeInTheDocument();
  });
});
