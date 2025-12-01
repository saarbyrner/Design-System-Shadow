// @flow
import formStateSlice from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import formMenuSlice from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import formValidationSlice from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import formAttachmentSlice from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import athleteProfileSlice from '@kitman/modules/src/AthleteProfile/redux/slices/athleteProfileSlice';
import guardiansTabSlice from '@kitman/modules/src/AthleteProfile/redux/slices/guardiansTabSlice';
import humanInputSlice from '../slices/humanInputSlice';

export default {
  athleteProfileSlice: athleteProfileSlice.reducer,
  formStateSlice: formStateSlice.reducer,
  formMenuSlice: formMenuSlice.reducer,
  formValidationSlice: formValidationSlice.reducer,
  formAttachmentSlice: formAttachmentSlice.reducer,
  humanInputSlice: humanInputSlice.reducer,
  guardiansTabSlice: guardiansTabSlice.reducer,
};
