import { screen, render } from '@testing-library/react';
import { data } from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_post_movement_record_history';

import HistoryMovementRecordRow from '..';

const props = {
  record: data[0],
  showMovementType: true,
};

describe('<HistoryMovementRecordRow/>', () => {
  it('renders the record', () => {
    render(<HistoryMovementRecordRow {...props} />);
    expect(
      screen.getByRole('row', {
        name: 'Jul 1, 2006 retire Celtic FC Celtic FC',
      })
    ).toBeInTheDocument();
  });

  it('does not render the movement type when its passed as false', () => {
    render(<HistoryMovementRecordRow {...props} showMovementType={false} />);
    expect(
      screen.getByRole('row', {
        name: 'Jul 1, 2006 Celtic FC Celtic FC',
      })
    ).toBeInTheDocument();
  });
});
