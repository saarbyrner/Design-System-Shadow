import { screen, fireEvent } from '@testing-library/react';

import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';
import getInjuryData from '@kitman/modules/src/AthleteInjury/utils/InjuryData';
import Notes from '../../components/Notes';
import { getBlankNote } from '../../utils';

jest.mock('@kitman/components/src/Textarea', () => {
  const { useState } = jest.requireActual('react');
  return ({ label, onChange, value }) => {
    const [textareaValue, setTextareaValue] = useState(value);
    return (
      <div>
        <label htmlFor={`textarea-${label}`}>{label}</label>
        <textarea
          id={`textarea-${label}`}
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          onBlur={() => onChange(textareaValue)}
        />
      </div>
    );
  };
});

describe('Athlete Injury Editor <Notes /> component', () => {
  const injuryData = getInjuryData();
  let props;

  beforeEach(() => {
    props = {
      notes: injuryData.notes,
      currentNote: getBlankNote(),
      updateNote: jest.fn(),
      isRestricted: false,
      psychOnly: false,
      updateIsRestricted: jest.fn(),
      updatePsychOnly: jest.fn(),
      formType: 'INJURY',
      t: (key) => key,
    };
  });

  it('renders', () => {
    renderWithUserEventSetup(<Notes {...props} />);
    expect(screen.getByText('Injury Note')).toBeInTheDocument();
  });

  it('renders the correct number of notes', () => {
    renderWithUserEventSetup(<Notes {...props} />);
    expect(screen.getAllByTestId('note-item')).toHaveLength(3);
  });

    it('calls the correct action when editing the note', async () => {
      const { user } = renderWithUserEventSetup(<Notes {...props} />);
      await user.type(screen.getByRole('textbox', { name: 'Injury Note' }), 'New note');
      fireEvent.blur(screen.getByRole('textbox', { name: 'Injury Note' }));
      expect(props.updateNote).toHaveBeenLastCalledWith('New note');
    });

  it('calls the correct action when restricting the note to doctors', async () => {
    const { user } = renderWithUserEventSetup(<Notes {...props} />);
    await user.click(screen.getByLabelText('Restrict note to Doctors'));
    expect(props.updateIsRestricted).toHaveBeenCalledWith(true);
  });

  describe('when the mls-emr-psych-notes flag is true', () => {
    beforeEach(() => {
      window.featureFlags['mls-emr-psych-notes'] = true;
    });

    afterEach(() => {
      window.featureFlags['mls-emr-psych-notes'] = false;
    });

    it('shows a dropdown with the correct items', async () => {
      const { user } = renderWithUserEventSetup(<Notes {...props} />);
      await user.click(screen.getByRole('button', { name: 'Default Visibility' }));
      expect(screen.getByText('Doctors')).toBeInTheDocument();
      expect(screen.getByText('Psych Team')).toBeInTheDocument();
    });

    it('calls the correct actions when restricting to all', async () => {
      const { user } = renderWithUserEventSetup(<Notes {...props} />);
      await user.click(screen.getByRole('button', { name: 'Default Visibility' }));
      const options = screen.getAllByText('Default Visibility');
      await user.click(options[1]);
      expect(props.updateIsRestricted).toHaveBeenCalledWith(false);
      expect(props.updatePsychOnly).toHaveBeenCalledWith(false);
    });

    it('calls the correct actions when restricting to Doctors', async () => {
      const { user } = renderWithUserEventSetup(<Notes {...props} />);
      await user.click(screen.getByRole('button', { name: 'Default Visibility' }));
      await user.click(screen.getByText('Doctors'));
      expect(props.updateIsRestricted).toHaveBeenCalledWith(true);
      expect(props.updatePsychOnly).toHaveBeenCalledWith(false);
    });

    it('calls the correct actions when restricting to Psych Team', async () => {
      const { user } = renderWithUserEventSetup(<Notes {...props} />);
      await user.click(screen.getByRole('button', { name: 'Default Visibility' }));
      await user.click(screen.getByText('Psych Team'));
      expect(props.updateIsRestricted).toHaveBeenCalledWith(false);
      expect(props.updatePsychOnly).toHaveBeenCalledWith(true);
    });
  });

  describe('when the formType is ILLNESS', () => {
    beforeEach(() => {
      props.formType = 'ILLNESS';
    });

    it('renders the correct label for the note field', () => {
      renderWithUserEventSetup(<Notes {...props} />);
      expect(screen.getByRole('textbox', { name: 'Illness Note' })).toBeInTheDocument();
    });
  });
});
