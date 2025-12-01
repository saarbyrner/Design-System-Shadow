import { render, screen } from '@testing-library/react';

import SourceSelection from '../../components/SourceSelection';

describe('Import Workflow <SourceSelection /> component', () => {
  const props = {
    event: {
      id: null,
      eventType: 'TRAINING_SESSION',
      sessionTypeId: '',
      workloadType: '',
      duration: '',
      date: '2018-02-26',
    },
    sourceFormData: {
      loaded: true,
      integrations: [{ id: 6, name: 'Statsports' }],
      fileSources: {},
    },
    sourceData: {
      integrationData: { id: 1, date: '2018-02-26', name: 'Statsports' },
      eventData: null,
    },
    onForward: () => {},
    onBackward: () => {},
    onIntegrationsLoad: () => {},
    t: (value) => value,
  };

  it('renders', () => {
    render(<SourceSelection {...props} />);
    // Test that component renders by checking for existence of content
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders the next step button', () => {
    render(<SourceSelection {...props} />);
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
