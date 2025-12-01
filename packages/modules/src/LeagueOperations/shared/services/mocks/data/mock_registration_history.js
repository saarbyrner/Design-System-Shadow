import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';

const mockedRegistrationHistory = {
  id: 1,
  user_id: 1234,
  status: RegistrationStatusEnum.APPROVED,
  status_history: [
    {
      id: 166,
      status: RegistrationStatusEnum.UNAPPROVED,
      registration_system_status: {
        id: 1,
        type: RegistrationStatusEnum.UNAPPROVED,
        name: 'Unapproved',
      },
      created_at: '2023-07-14T10:49:50Z',
      annotations: [
        {
          content: 'Bad Behavior',
          annotation_date: '2023-07-13T20:00:00Z',
        },
      ],
    },
  ],
};

export default mockedRegistrationHistory;
