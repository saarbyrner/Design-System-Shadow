import { render, screen } from '@testing-library/react';

import { data as mockedModifications } from '@kitman/services/src/mocks/handlers/medical/getModifications';

import ActiveModifications from '@kitman/modules/src/Medical/issues/src/components/ActiveModifications';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

describe('<ActiveModifications />', () => {
  const props = {
    modifications: mockedModifications.medical_notes,
    canDeactivate: true,
    deactivateModification: jest.fn(),
    t: i18nextTranslateStub(),
    isLoading: false,
  };

  test('renders the correct title', () => {
    render(<ActiveModifications {...props} />);
    expect(screen.getByText('Active modifications')).toBeInTheDocument();
  });

  test('renders the modifications correctly', () => {
    render(<ActiveModifications {...props} />);

    // Two cards rendered
    expect(screen.getAllByTestId('Note|Content').length).toBe(2);
  });
});
