// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { leagueOperationsApi } from './leagueOperations';

import fetchClubPayment from '../../services/payment/fetchClubPayment';
import fetchRepayForm from '../../services/payment/fetchRepayForm';
import deletePaymentMethod from '../../services/payment/deletePaymentMethod';
import payRegistration from '../../services/payment/payRegistration';
import storePaymentMethod from '../../services/payment/storePaymentMethod';
import { TAGS } from './utils';

export const registrationPaymentApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchClubPayment: builder.query({
      queryFn: serviceQueryFactory(fetchClubPayment),
      providesTags: [TAGS.CLUB_PAYMENT],
    }),
    fetchRepayForm: builder.query({
      queryFn: serviceQueryFactory(fetchRepayForm),
    }),
    deletePaymentMethod: builder.mutation({
      queryFn: serviceQueryFactory(deletePaymentMethod),
      invalidatesTags: [TAGS.CLUB_PAYMENT],
    }),
    payRegistration: builder.mutation({
      queryFn: serviceQueryFactory((total) => payRegistration(total)),
      invalidatesTags: [TAGS.CLUB_PAYMENT],
    }),
    storePaymentMethod: builder.mutation({
      queryFn: serviceQueryFactory((formDetails) =>
        storePaymentMethod(formDetails)
      ),
      invalidatesTags: [TAGS.CLUB_PAYMENT],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchClubPaymentQuery,
  useFetchRepayFormQuery,
  useDeletePaymentMethodMutation,
  usePayRegistrationMutation,
  useStorePaymentMethodMutation,
} = registrationPaymentApi;
