import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConsentOverlapDialog from '@kitman/modules/src/ConditionalFields/OrganisationApp/src/components/ClubConsentTab/ConsentOverlapDialog';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

const props = {
  isOpen: true,
  onSave: jest.fn(),
  onCancel: jest.fn(),
  t: i18nextTranslateStub(),
  selectedNumber: 3,
  notConsentedAthletes: [
    {
      athlete_id: 1,
      fullname: 'Athlete 1',
      message: 'Message 1',
    },
  ],
};

describe('ConsentOverlapDialog', () => {
  it('should render', () => {
    render(<ConsentOverlapDialog {...props} />);
    expect(screen.getByText('Review Consent')).toBeInTheDocument();
  });
  it('should render the number of not consented athletes followed by the correct message', () => {
    render(<ConsentOverlapDialog {...props} />);
    expect(
      screen.getByText(
        '1/3 The following athletes cannot be updated due to overlapping consent dates'
      )
    ).toBeInTheDocument();
  });
  it('should render the number of consented athletes followed by the correct message', () => {
    render(<ConsentOverlapDialog {...props} />);
    expect(
      screen.getByText('2/3 athletes have consented to this time period.')
    ).toBeInTheDocument();
  });
  it('should render the not consented athletes list', () => {
    render(<ConsentOverlapDialog {...props} />);
    expect(screen.getByText('Athlete 1')).toBeInTheDocument();
  });
  it('should call the onCancel function when the cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancelMock = jest.fn();
    render(<ConsentOverlapDialog {...props} onCancel={onCancelMock} />);
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
  it('should call the onSave function when the save button is clicked', async () => {
    const user = userEvent.setup();
    const onSaveMock = jest.fn();
    render(<ConsentOverlapDialog {...props} onSave={onSaveMock} />);
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);
    expect(onSaveMock).toHaveBeenCalledTimes(1);
  });
});
