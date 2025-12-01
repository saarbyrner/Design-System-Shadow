import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';

export default {
  id: 1,
  status: RegistrationStatusEnum.UNAPPROVED,
  created_at: '2021-01-01',
  annotations: [
    {
      content: 'Bad behaviour',
      annotation_date: '2021-01-01',
    },
  ],
};
