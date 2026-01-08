import moment from 'moment';
import { render, screen, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DatePicker from '..';

describe('DatePicker component', () => {
  let props;
  const defaultLocale = moment.locale();

  afterEach(() => {
    moment.locale(defaultLocale);
    jest.resetAllMocks();
  });

  beforeEach(() => {
    props = {
      name: 'datePicker',
      value: new Date('2023-06-22T13:00:10Z').toISOString(),
      onDateChange: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  describe('when a label is set', () => {
    it('shows the label', () => {
      render(<DatePicker {...props} label="date picker label" />);
      expect(screen.getByText('date picker label')).toBeInTheDocument();
    });
  });

  describe('when a label is not set', () => {
    it("doesn't show the label", () => {
      render(<DatePicker {...props} label={null} />);
      expect(screen.queryByText('date picker label')).not.toBeInTheDocument();
    });
  });

  describe('when disabled is true', () => {
    it('disables the datepicker', () => {
      const { container } = render(
        <DatePicker {...props} label="label" disabled />
      );
      expect(
        container.getElementsByClassName('datePicker__label--disabled')
      ).toHaveLength(1);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('when kitmanDesignSystem is true', () => {
    it('renders the correct field', () => {
      const { container } = render(
        <DatePicker {...props} kitmanDesignSystem />
      );
      expect(
        container.getElementsByClassName('inputText--kitmanDesignSystem')
      ).toHaveLength(1);
    });

    it('formats the input date to "DD MMM YYYY" format regardless of IE locale', async () => {
      moment.locale('en-IE');
      render(<DatePicker {...props} kitmanDesignSystem />);
      const input = screen.getByRole('textbox');
      await waitFor(() => expect(input).toHaveValue('22 Jun 2023'));
    });

    it('formats the input date to "DD MMM YYYY" format regardless of US locale', async () => {
      moment.locale('en-US');
      render(<DatePicker {...props} kitmanDesignSystem />);
      const input = screen.getByRole('textbox');
      await waitFor(() => expect(input).toHaveValue('22 Jun 2023'));
    });
  });

  describe('when optional is true', () => {
    it('displays an optional text', () => {
      render(<DatePicker {...props} optional />);
      expect(screen.getByText('Optional')).toBeInTheDocument();
    });
  });

  describe('[feature-flag] date-picker-text-entry flag is on', () => {
    beforeEach(() => {
      window.featureFlags['date-picker-text-entry'] = true;
    });

    afterEach(() => {
      window.featureFlags['date-picker-text-entry'] = false;
    });

    it('formats the input date to a short locale with kitmanDesignSystem', async () => {
      moment.locale('en-IE');
      render(<DatePicker {...props} kitmanDesignSystem />);
      const input = screen.getByRole('textbox');
      await waitFor(() => expect(input).toHaveValue('22/06/2023'));
    });

    it('formats the input date to a short US locale with kitmanDesignSystem', async () => {
      moment.locale('en-US');
      render(<DatePicker {...props} kitmanDesignSystem />);
      const input = screen.getByRole('textbox');
      await waitFor(() => expect(input).toHaveValue('06/22/2023'));
    });
  });

  describe('[feature-flag] date-picker-short-format-display flag is on', () => {
    beforeEach(() => {
      window.featureFlags['date-picker-short-format-display'] = true;
    });

    afterEach(() => {
      window.featureFlags['date-picker-short-format-display'] = false;
    });

    it('formats the input date to a short locale with kitmanDesignSystem', async () => {
      moment.locale('en-IE');
      render(<DatePicker {...props} kitmanDesignSystem />);
      const input = screen.getByRole('textbox');
      await waitFor(() => expect(input).toHaveValue('22/06/2023'));
    });

    it('formats the input date to a short US locale with kitmanDesignSystem', async () => {
      moment.locale('en-US');
      render(<DatePicker {...props} kitmanDesignSystem />);
      const input = screen.getByRole('textbox');
      await waitFor(() => expect(input).toHaveValue('06/22/2023'));
    });
  });

  describe('Invalid text display', () => {
    it('displays invalid text when displayValidationText and invalid are true', () => {
      render(<DatePicker {...props} displayValidationText invalid />);
      expect(screen.queryByText('This field is required')).toBeInTheDocument();
    });

    it('does not display invalid text when displayValidationText or invalid are false', () => {
      render(<DatePicker {...props} invalid={false} />);
      expect(
        screen.queryByText('This field is required')
      ).not.toBeInTheDocument();
    });
  });
});
