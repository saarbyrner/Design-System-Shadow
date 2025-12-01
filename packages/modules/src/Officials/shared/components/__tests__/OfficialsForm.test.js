import { act, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { parseFromTypeFromLocation } from '@kitman/modules/src/Scouts/shared/routes/utils';
import OfficialsForm from '../OfficialsForm';

const props = {
  t: i18nextTranslateStub(),
};

jest.mock('@kitman/common/src/hooks/useLocationPathname', () => jest.fn());
jest.mock('@kitman/modules/src/Scouts/shared/routes/utils');

describe('<OfficialsForm/>', () => {
  describe('edit mode', () => {
    beforeEach(() => {
      parseFromTypeFromLocation.mockImplementation(
        useLocationPathname.mockImplementation(() => ({ id: '123' }))
      );
    });

    it('renders the form', async () => {
      act(() => {
        renderWithProviders(<OfficialsForm {...props} />);
      });

      // Close & Save buttons
      const buttons = document.querySelectorAll('button');
      expect(buttons).toHaveLength(2);

      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(await screen.findByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByText('DOB')).toBeInTheDocument();
      expect(screen.getByText('Language')).toBeInTheDocument();
      expect(buttons[1]).toHaveTextContent('Save');

      // Role
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Referee')).toBeInTheDocument();

      // Division
      expect(screen.getByText('Division')).toBeInTheDocument();
      expect(screen.getByText('MLS NEXT')).toBeInTheDocument();

      // Status
      expect(screen.getByText('Status')).toBeInTheDocument();
      const activeRadioButton = screen.getAllByRole('radio', {
        name: 'Active',
      });
      expect(activeRadioButton[0]).toBeChecked();
      expect(activeRadioButton[1]).not.toBeChecked();
    });
  });

  describe('create mode', () => {
    beforeEach(() => {
      parseFromTypeFromLocation.mockImplementation(
        useLocationPathname.mockImplementation(() => ({ id: 'new' }))
      );
    });

    it('renders the form with the status', async () => {
      act(() => {
        renderWithProviders(<OfficialsForm {...props} />);
      });

      const buttons = document.querySelectorAll('button');
      expect(buttons).toHaveLength(2);
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(await screen.findByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByText('DOB')).toBeInTheDocument();
      expect(screen.getByText('Language')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Division')).toBeInTheDocument();

      // Status
      expect(screen.queryByText('Status')).not.toBeInTheDocument();
    });
  });
});
