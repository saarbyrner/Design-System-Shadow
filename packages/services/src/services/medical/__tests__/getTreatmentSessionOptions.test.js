import $ from 'jquery';
import getTreatmentSessionOptions from '../getTreatmentSessionOptions';

describe('getTreatmentSessionOptions', () => {
  let getTreatmentSessionOptionsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = {
      issue_options: {
        key_name: 'Closed Illnesses',
        name: 'Closed Illnesses',
        isGroupOption: true,
      },
      treatable_area_options: [
        {
          value: {
            treatable_area_type: 'Emr::Private::Models::BodyPart',
            treatable_area_id: 262,
            side_id: 1,
          },
          name: 'Achilles Tendon',
          description: 'Left',
        },
        {
          value: {
            treatable_area_type: 'Emr::Private::Models::BodyPart',
            treatable_area_id: 207,
            side_id: 1,
          },
          name: 'Deltoid Ligament',
          description: 'Left',
        },
      ],
      treatment_modality_options: [
        {
          name: 'AT Directed Rehab',
          isGroupOption: true,
        },
        {
          key_name: 209,
          name: 'Rehab Exercises',
        },
      ],
    };

    getTreatmentSessionOptionsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getTreatmentSessionOptions(123);

    expect(returnedData).toEqual({
      issue_options: {
        key_name: 'Closed Illnesses',
        name: 'Closed Illnesses',
        isGroupOption: true,
      },
      treatable_area_options: [
        {
          value: {
            treatable_area_type: 'Emr::Private::Models::BodyPart',
            treatable_area_id: 262,
            side_id: 1,
          },
          name: 'Achilles Tendon',
          description: 'Left',
        },
        {
          value: {
            treatable_area_type: 'Emr::Private::Models::BodyPart',
            treatable_area_id: 207,
            side_id: 1,
          },
          name: 'Deltoid Ligament',
          description: 'Left',
        },
      ],
      treatment_modality_options: [
        {
          name: 'AT Directed Rehab',
          isGroupOption: true,
        },
        {
          key_name: 209,
          name: 'Rehab Exercises',
        },
      ],
    });

    expect(getTreatmentSessionOptionsRequest).toHaveBeenCalledTimes(1);
    expect(getTreatmentSessionOptionsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/medical/athletes/123/treatment_session_options',
    });
  });
});
