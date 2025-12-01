// @flow
import { useState, useEffect } from 'react';
import { Container } from '@kitman/playbook/components';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { useLazyGetReviewQuery } from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';
import { HeaderTranslated as Header } from './Header';
import { ReviewFormTranslated as ReviewForm } from './ReviewForm';
import { GoalsTranslated as Goals } from './Goals';
import { getAthleteId, getAthleteReviewId } from '../shared/utils';
import { useReviewFormData } from './hooks';
import { formModeEnumLike } from '../shared/enum-likes';

const AthleteReviewForm = () => {
  const pathname = useLocationPathname();
  const [athleteId, setAthleteId] = useState<?number>(null);
  const {
    form,
    setForm,
    formMode,
    setFormMode,
    updateForm,
    onUpdateGoal,
    onAddGoal,
    onRemoveGoal,
    onAddUrl,
  } = useReviewFormData();

  const [
    getReview,
    { isError: isGetReviewError, isFetching: isGetReviewFetching },
  ] = useLazyGetReviewQuery();

  useEffect(() => {
    setAthleteId(getAthleteId(pathname));
  }, [pathname]);

  useEffect(() => {
    if (pathname.includes('/edit') && athleteId) {
      const athleteReviewId = getAthleteReviewId(pathname);
      getReview({
        athleteId,
        reviewId: athleteReviewId,
      }).then((response) => {
        setForm(response.data);
        setFormMode(formModeEnumLike.Edit);
      });
    } else {
      setFormMode(formModeEnumLike.Create);
    }
  }, [athleteId]);

  const [isValidationTriggered, setIsValidationTriggered] =
    useState<boolean>(false);

  if (isGetReviewFetching) {
    return <DelayedLoadingFeedback />;
  }

  if (isGetReviewError) {
    return <AppStatus status="error" />;
  }

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Header
        form={form}
        setIsValidationTriggered={setIsValidationTriggered}
        formMode={formMode}
        setFormMode={setFormMode}
      />
      <ReviewForm
        athleteId={athleteId}
        form={form}
        isValidationTriggered={isValidationTriggered}
        onFormUpdate={updateForm}
      />
      <Goals
        form={form}
        formMode={formMode}
        isValidationTriggered={isValidationTriggered}
        onAddGoal={onAddGoal}
        onAddUrl={onAddUrl}
        onRemoveGoal={onRemoveGoal}
        onUpdateGoal={onUpdateGoal}
      />
    </Container>
  );
};

export default AthleteReviewForm;
