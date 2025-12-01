import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PhoneSelector from '../index';

describe('<PhoneSelector />', () => {
  const props = {
    element: { config: { element_id: 123, text: 'Phone', custom_params: {} } },
    value: '',
    validationStatus: {
      status: 'VALID',
    },
    onChange: jest.fn(),
  };
  describe('should handle NA territories area codes', () => {
    const americanSamoa = 'American Samoa';
    const americanSamoaCountryCode = '+1-684';
    const number = '1245668';
    it('should accept user input', async () => {
      const user = userEvent.setup();

      render(<PhoneSelector {...props} />);
      const countryCodeSelect = screen.getByLabelText('Country code');
      const americanSamoaOptionText = `${americanSamoa} (AS) ${americanSamoaCountryCode}`;
      await user.type(countryCodeSelect, americanSamoa);
      await user.click(
        screen.getByRole('option', { name: americanSamoaOptionText })
      );
      expect(countryCodeSelect).toHaveDisplayValue(americanSamoaCountryCode);
      const numberInput = screen.getByLabelText(props.element.config.text);
      await user.type(numberInput, number);
      expect(countryCodeSelect).toHaveDisplayValue(americanSamoaCountryCode);
      expect(numberInput).toHaveDisplayValue(number);
    });

    it('should parse input properly', () => {
      render(<PhoneSelector {...props} value={`+1684${number}`} />);
      const countryCodeSelect = screen.getByLabelText('Country code');
      const numberInput = screen.getByLabelText(props.element.config.text);
      expect(countryCodeSelect).toHaveDisplayValue(americanSamoaCountryCode);
      expect(numberInput).toHaveDisplayValue(number);
    });
  });
});
