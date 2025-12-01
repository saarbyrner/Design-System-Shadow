import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import MedicalData from '../MedicalData';

describe('<MedicalData />', () => {
  const onSetColumnTitleMock = jest.fn();
  const i18nT = i18nextTranslateStub(i18n);
  const props = {
    t: i18nT,
    title: '',
    type: 'RehabSessionExercise',
    subtypes: {},
    onSetColumnTitle: onSetColumnTitleMock,
    direction: 'column',
  };

  it('renders column direction correctly', () => {
    render(<MedicalData {...props} />);
    expect(screen.getByText('Add filter')).toBeInTheDocument();
    expect(screen.getByLabelText('Column Title')).toBeInTheDocument();
    expect(screen.queryByLabelText('Row Title')).not.toBeInTheDocument();
  });

  it('renders row direction correctly', () => {
    render(<MedicalData {...props} direction="row" />);
    expect(screen.getByText('Add filter')).toBeInTheDocument();
    expect(screen.queryByLabelText('Column Title')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Row Title')).toBeInTheDocument();
  });

  it('renders a custom title in the column title', () => {
    render(<MedicalData {...props} title="abc123" />);
    const input = screen.getByLabelText('Column Title');
    expect(input).toHaveValue('abc123');
  });

  it('sets the correct tile for type MedicalIllness', async () => {
    render(<MedicalData {...props} type="MedicalIllness" />);
    expect(onSetColumnTitleMock).toHaveBeenCalledWith('Illnesses');
  });

  it('sets the correct tile for type MedicalInjury', async () => {
    render(<MedicalData {...props} type="MedicalInjury" />);
    expect(onSetColumnTitleMock).toHaveBeenCalledWith('Injuries');
  });

  it('sets the correct tile for type RehabSessionExercise', async () => {
    render(<MedicalData {...props} type="RehabSessionExercise" />);
    expect(onSetColumnTitleMock).toHaveBeenCalledWith('Rehab exercises');
  });

  it('calls the correct function onChange', async () => {
    const user = userEvent.setup();

    render(<MedicalData {...props} />);
    const input = screen.getByLabelText('Column Title');
    expect(onSetColumnTitleMock).toHaveBeenCalledWith('Rehab exercises');
    await user.clear(input);
    await user.type(input, 'x');
    expect(onSetColumnTitleMock).toHaveBeenCalledWith('x');
  });
});
