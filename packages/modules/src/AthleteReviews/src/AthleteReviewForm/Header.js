// @flow
import { type ComponentType } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import sharedStyles from '@kitman/modules/src/AthleteReviews/src/shared/style';
import {
  useSaveReviewMutation,
  useEditReviewMutation,
} from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';
import { Button, Grid, Typography } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type {
  ReviewFormData,
  FormModeEnumLikeValues,
} from '@kitman/modules/src/AthleteReviews/src/shared/types';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import {
  validateReviewForm,
  dispatchToastMessage,
  getAthleteId,
  sanitizeDevelopmentGoals,
} from '../shared/utils';
import { formModeEnumLike } from '../shared/enum-likes';

type Props = {
  form: ReviewFormData,
  setIsValidationTriggered: Function,
  formMode: ?FormModeEnumLikeValues,
};

const Header = ({
  form,
  t,
  setIsValidationTriggered,
  formMode,
}: I18nProps<Props>) => {
  const pathname = useLocationPathname();
  const athleteId = getAthleteId(pathname);
  const locationAssign = useLocationAssign();
  let backButtonAndCompletedReviewHref = '';
  let backButtonTitle = '';
  let reviewModeTitle = '';
  const dispatch = useDispatch();

  // hang on not handling error?
  const [saveReview, { isLoading: isReviewCreateSaving }] =
    useSaveReviewMutation();
  const [editReview, { isLoading: isReviewEditSaving }] =
    useEditReviewMutation();

  const isReviewLoading = isReviewCreateSaving || isReviewEditSaving;

  switch (formMode) {
    case formModeEnumLike.Edit: {
      backButtonAndCompletedReviewHref = `/athletes/${athleteId}/athlete_reviews/${
        form.id || ''
      }`; // form id must be present on an edit
      backButtonTitle = t('Athlete review');
      reviewModeTitle = t('Edit review');
      break;
    }
    case formModeEnumLike.Create:
    default: {
      backButtonAndCompletedReviewHref = `/athletes/${athleteId}/athlete_reviews`;
      backButtonTitle = t('Athlete reviews');
      reviewModeTitle = t('New review');
    }
  }

  const formSuccessfullySaved = () => {
    dispatchToastMessage({
      dispatch,
      message: t('Review saved'),
      status: toastStatusEnumLike.Success,
    });
    locationAssign(backButtonAndCompletedReviewHref);
  };

  const onClickSave = () => {
    const { formWithEmptyUrlsRemoved, validForm, errorMessage } =
      validateReviewForm({
        form,
        t,
      });
    setIsValidationTriggered(true);

    if (validForm) {
      if (formMode === formModeEnumLike.Create) {
        saveReview({
          athleteId,
          form: formWithEmptyUrlsRemoved,
        }).then(({ error }) => {
          if (error) {
            dispatchToastMessage({
              dispatch,
              message: t('Error saving review'),
              status: toastStatusEnumLike.Error,
            });
          } else {
            formSuccessfullySaved();
          }
        });
      }
      if (formMode === formModeEnumLike.Edit && formWithEmptyUrlsRemoved) {
        const sanitizedForms = sanitizeDevelopmentGoals({
          reviewForm: formWithEmptyUrlsRemoved,
        });

        editReview({
          athleteId,
          reviewId: form.id,
          form: sanitizedForms,
        }).then(({ error }) => {
          if (error) {
            dispatchToastMessage({
              dispatch,
              message: t('Error editing review'),
              status: toastStatusEnumLike.Error,
            });
          } else {
            formSuccessfullySaved();
          }
        });
      }
    } else {
      dispatchToastMessage({
        dispatch,
        message: errorMessage,
        status: toastStatusEnumLike.Error,
      });
    }
  };

  return (
    <Grid component="header" container spacing={2}>
      <Grid xs item>
        <Button
          color="secondary"
          variant="contained"
          href={backButtonAndCompletedReviewHref}
          startIcon={<KitmanIcon name={KITMAN_ICON_NAMES.ChevronLeft} />}
          sx={sharedStyles.linkStyle}
        >
          {backButtonTitle}
        </Button>
        <Typography variant="h5" mt={2} mb={3}>
          {reviewModeTitle}
        </Typography>
      </Grid>

      <Grid xs container item spacing={1} justifyContent="right">
        <Grid item>
          <Button
            color="primary"
            onClick={onClickSave}
            disabled={isReviewLoading}
          >
            {t('Save')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const HeaderTranslated: ComponentType<Props> = withNamespaces()(Header);
export default Header;
