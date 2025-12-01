import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import MedicationTypeSelector from '..';

describe('<MedicationTypeSelector />', () => {
  const props = {
    medicationType: 'overview',
    setMedicationType: jest.fn(),
    t: i18nextTranslateStub(),
  };

  describe('[FEATURE FLAG] dr-first-integration ON', () => {
    beforeEach(() => {
      window.featureFlags['dr-first-integration'] = true;
    });
    afterEach(() => {
      window.featureFlags['dr-first-integration'] = false;
    });

    it('renders the default form', async () => {
      render(<MedicationTypeSelector {...props} />);

      expect(
        screen.getByTestId('Medications|TypeSelector')
      ).toBeInTheDocument();

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);

      const overviewButton = buttons[0];
      const managementButton = buttons[1];

      expect(overviewButton).toHaveTextContent('Overview');
      expect(managementButton).toHaveTextContent('ePrescription');
    });
  });

  describe('[FEATURE FLAG] dr-first-integration off', () => {
    beforeEach(() => {
      window.featureFlags['dr-first-integration'] = false;
    });

    it('renders only Overview', async () => {
      render(<MedicationTypeSelector {...props} />);

      const overviewButton = screen.getByRole('button');
      expect(overviewButton).toBeInTheDocument();
      expect(overviewButton).toHaveTextContent('Overview');
    });
  });
});
