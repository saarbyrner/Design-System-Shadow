import $ from 'jquery';
import getDrillLabels from '../getDrillLabels';

const mockedData = [
  {
    id: 1,
    name: 'First drill label',
  },
  {
    id: 2,
    name: 'Second drill label',
  },
];

describe('getDrillLabels', () => {
  let getDrillLabelsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getDrillLabelsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDrillLabels();

    expect(returnedData).toEqual(mockedData);

    expect(getDrillLabelsRequest).toHaveBeenCalledTimes(1);
    expect(getDrillLabelsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/event_activity_drill_labels',
    });
  });
});
