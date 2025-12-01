import { screen, fireEvent } from '@testing-library/react';
import moment from 'moment';

import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import athleteData from '@kitman/modules/src/AthleteAvailabilityList/utils/dummyAthleteData';

import RTPModal from '..';

jest.mock('../../../containers/AppStatus', () => () => <div>AppStatus</div>);
jest.mock('@kitman/components/src/DatePicker');

describe('RTPModal', () => {
  const athletes = athleteData();
  let props;

  beforeEach(() => {
    props = {
      isOpen: true,
      athleteId: athletes[0].id,
      modRTPData: {
        rtp: '',
      },
      updateRTP: jest.fn(),
      saveRTP: jest.fn(),
      closeModal: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the component', () => {
    renderWithUserEventSetup(<RTPModal {...props} />);
    expect(screen.getByText('Update RTP date')).toBeInTheDocument();
  });

  describe('when the rtp date is changed', () => {
    it('calls the correct callback', () => {
      const testDate = moment('2019-04-15').toDate();
      renderWithUserEventSetup(<RTPModal {...props} />);
      const datepicker = screen.getByLabelText('RTP Date');
      fireEvent.change(datepicker, { target: { value: '2019-04-15' } });
      expect(props.updateRTP).toHaveBeenCalledWith(testDate);
    });

    it('calls the correct callback when saving', () => {
      const testDate = moment('2019-04-15').toDate();
      const { rerender } = renderWithUserEventSetup(<RTPModal {...props} />);
      const datepicker = screen.getByLabelText('RTP Date');
      fireEvent.change(datepicker, { target: { value: '2019-04-15' } });

      rerender(<RTPModal {...props} modRTPData={{ rtp: testDate }} />);

      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      expect(props.saveRTP).toHaveBeenCalledWith(props.athleteId, testDate);
    });
  });

  it('calls the correct callback when closing', () => {
    renderWithUserEventSetup(<RTPModal {...props} />);
    const closeButton = screen.getByText('Cancel');
    fireEvent.click(closeButton);
    expect(props.closeModal).toHaveBeenCalled();
  });
});
