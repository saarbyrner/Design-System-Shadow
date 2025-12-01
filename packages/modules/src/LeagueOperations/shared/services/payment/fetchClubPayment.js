// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ClubPayment } from '@kitman/modules/src/LeagueOperations/shared/types/payment';

const fetchClubPayment = async (): Promise<ClubPayment> => {
  const { data } = await axios.get('/registration/payments/club_payment');
  return data;
};

export default fetchClubPayment;
