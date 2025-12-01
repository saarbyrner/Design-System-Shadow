import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../components/App';

jest.mock('../../containers/IssueDetails', () => () => (
  <div data-testid="issue-details-mock" />
));
jest.mock('../../containers/InjuryOccurrence', () => () => (
  <div data-testid="injury-occurrence-mock" />
));
jest.mock('../../containers/AthleteAvailabilityHistory', () => () => (
  <div data-testid="athlete-availability-history-mock" />
));
jest.mock('../../containers/Notes', () => () => (
  <div data-testid="notes-mock" />
));
jest.mock('../../containers/AppStatus', () => () => (
  <div data-testid="app-status-mock" />
));

jest.mock('@kitman/components', () => ({
  Checkbox: ({ label, id, isChecked, toggle }) => (
    <input
      type="checkbox"
      data-testid={id}
      aria-label={label}
      checked={isChecked}
      onChange={() => toggle({ checked: !isChecked })}
    />
  ),
  DatePicker: ({ label, value, onDateChange }) => (
    <input
      type="date"
      aria-label={label}
      value={value}
      onChange={(e) => onDateChange(e.target.value)}
    />
  ),
  Dropdown: ({ label, items, value, onChange }) => (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.title}
        </option>
      ))}
    </select>
  ),
  FormValidator: ({ children, successAction }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        successAction();
      }}
    >
      {children}
    </form>
  ),
  LegacyModal: ({ isOpen, children }) =>
    isOpen ? <div data-testid="modal-mock">{children}</div> : null,
  Textarea: ({ label, value, onChange }) => (
    <textarea
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
  TextButton: ({ text, onClick, isSubmit }) => (
    <button type={isSubmit ? 'submit' : 'button'} onClick={onClick}>
      {text}
    </button>
  ),
}));

describe('Athlete Injury Editor <App /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      athleteName: 'John Doe',
      info: 'Info',
      updateInfo: jest.fn(),
      createIssue: jest.fn(),
      editIssue: jest.fn(),
      examinationDate: '2019-10-20',
      formType: 'INJURY',
      hasRecurrence: false,
      recurrenceId: null,
      priorInjuryOptions: [{ title: 'injury 1', id: 1 }],
      priorIllnessOptions: [{ title: 'illness 1', id: 1 }],
      t: (key) => key,
      formMode: 'CREATE',
      updateFormType: jest.fn(),
      updateHasRecurrence: jest.fn(),
      updateRecurrence: jest.fn(),
      updateExaminationDate: jest.fn(),
      eventsOrder: [],
      events: {},
    };
    window.featureFlags = {};
  });

  it('renders', () => {
    render(<App {...props} />);
    expect(screen.getByTestId('modal-mock')).toBeInTheDocument();
  });

  describe('the modal title', () => {
    it('renders the athlete full name', () => {
      render(<App {...props} />);
      expect(
        screen.getByText(props.athleteName, { exact: false })
      ).toBeInTheDocument();
    });

    describe('when the form mode is EDIT', () => {
      it('renders the text Edit Issue', () => {
        render(<App {...props} formMode="EDIT" />);
        expect(
          screen.getByText('Edit Issue', { exact: false })
        ).toBeInTheDocument();
      });
    });

    describe('when the form mode is EDIT and the parent issue has a recurrence', () => {
      it('renders the text Edit Issue (Recurrence)', () => {
        render(<App {...props} formMode="EDIT" hasRecurrence />);
        expect(
          screen.getByText('Edit Issue (Recurrence)', { exact: false })
        ).toBeInTheDocument();
      });

      it('does not display the fields of the first section', () => {
        render(<App {...props} formMode="EDIT" hasRecurrence />);
        expect(screen.queryByLabelText('Issue')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Recurrence')).not.toBeInTheDocument();
      });

      describe('when the parent injury has a recurrence and the edited issue is the first occurrence', () => {
        it('renders the correct title', () => {
          render(
            <App
              {...props}
              formMode="EDIT"
              formType="INJURY"
              hasRecurrence
              isFirstOccurrence
            />
          );
          expect(
            screen.getByText('Edit Issue (This injury has a Recurrence)', {
              exact: false,
            })
          ).toBeInTheDocument();
        });
      });

      describe('when the parent illness has a recurrence and the edited issue is the first occurrence', () => {
        it('renders the correct title', () => {
          render(
            <App
              {...props}
              formMode="EDIT"
              formType="ILLNESS"
              hasRecurrence
              isFirstOccurrence
            />
          );
          expect(
            screen.getByText('Edit Issue (This illness has a Recurrence)', {
              exact: false,
            })
          ).toBeInTheDocument();
        });
      });
    });

    describe('when the form mode is CREATE', () => {
      it('renders the text New Issue', () => {
        render(<App {...props} formMode="CREATE" />);
        expect(
          screen.getByText('New Issue', { exact: false })
        ).toBeInTheDocument();
      });
    });
  });

  describe('when the form mode is CREATE', () => {
    it('renders an issue type select', () => {
      render(<App {...props} formMode="CREATE" />);
      expect(screen.getByLabelText('Issue')).toBeInTheDocument();
    });

    it('has the correct default issue type selected', () => {
      render(<App {...props} formMode="CREATE" />);
      expect(screen.getByLabelText('Issue')).toHaveValue('INJURY');
    });

    it('renders a recurrence checkbox', () => {
      render(<App {...props} formMode="CREATE" />);
      const checkbox = screen.getByTestId('isIssueRecurrenceField');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    describe('when the recurrence checkbox is not checked', () => {
      it("doesn't render prior issue dropdown", () => {
        render(<App {...props} formMode="CREATE" hasRecurrence={false} />);
        expect(
          screen.queryByLabelText(
            'Prior Injury (Date of Injury - Resolved Date)'
          )
        ).not.toBeInTheDocument();
      });
    });

    describe('when the recurrence checkbox is checked and the issue type is INJURY', () => {
      it('renders a prior injury dropdown', () => {
        render(
          <App
            {...props}
            formMode="CREATE"
            formType="INJURY"
            hasRecurrence
            recurrenceId={1}
          />
        );
        const dropdown = screen.getByLabelText(
          'Prior Injury (Date of Injury - Resolved Date)'
        );
        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toHaveValue('1');
      });
    });

    describe('when the recurrence checkbox is checked and the issue type is ILLNESS', () => {
      it('renders a prior illness dropdown', () => {
        render(
          <App
            {...props}
            formMode="CREATE"
            formType="ILLNESS"
            hasRecurrence
            recurrenceId={1}
          />
        );
        const dropdown = screen.getByLabelText(
          'Prior Illness (Date of Illness - Resolved Date)'
        );
        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toHaveValue('1');
      });
    });
  });

  it('renders an injury detail section', () => {
    render(<App {...props} />);
    expect(screen.getByTestId('issue-details-mock')).toBeInTheDocument();
  });

  it('renders an injury occurrence section', () => {
    render(<App {...props} />);
    expect(screen.getByTestId('injury-occurrence-mock')).toBeInTheDocument();
  });

  it('renders the injury info field', () => {
    render(<App {...props} />);
    const infoField = screen.getByLabelText('Modifications/Info');
    expect(infoField).toBeInTheDocument();
    expect(infoField).toHaveValue(props.info);
  });

  it('calls the correct action when editing the info', () => {
    render(<App {...props} />);
    const infoField = screen.getByLabelText('Modifications/Info');
    fireEvent.change(infoField, { target: { value: 'New info' } });
    expect(props.updateInfo).toHaveBeenCalledWith('New info');
  });

  describe('when the user clicks the send button', () => {
    describe('when the form mode is EDIT', () => {
      it('calls editIssue()', () => {
        render(<App {...props} formMode="EDIT" />);
        fireEvent.submit(screen.getByText('Save'));
        expect(props.editIssue).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the form mode is CREATE', () => {
      it('calls createIssue()', () => {
        render(<App {...props} formMode="CREATE" />);
        fireEvent.submit(screen.getByText('Save'));
        expect(props.createIssue).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when examination-date is enabled', () => {
    beforeEach(() => {
      window.featureFlags['examination-date'] = true;
    });

    it('renders an examination date picker', () => {
      render(<App {...props} />);
      const datePicker = screen.getByLabelText('Examination Date');
      expect(datePicker).toBeInTheDocument();
      expect(datePicker).toHaveValue(props.examinationDate);
    });
  });
});
