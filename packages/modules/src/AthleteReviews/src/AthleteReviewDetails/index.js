// @flow
import { Container, LinearProgress, Box } from '@kitman/playbook/components';
import { useEffect, useState } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import type { AssessmentGroup } from '@kitman/services/src/types';
import {
  useLazyGetReviewQuery,
  useGetAthleteReviewTypesQuery,
} from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';
import { useGetStaffUsersQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { AppStatus } from '@kitman/components';
import { useDispatch } from 'react-redux';
import type { ReviewFormData } from '@kitman/modules/src/AthleteReviews/src/shared/types';
import { getAssessmentGroups } from '@kitman/services';
import { withNamespaces } from 'react-i18next';
import { HeaderTranslated as Header } from './Header';
import { CoachViewTranslated as CoachView } from './CoachView';
import {
  getAthleteId,
  getDefaultReviewForm,
  getAthleteReviewId,
  dispatchToastMessage,
} from '../shared/utils';

type Props = I18nProps<{}>;

const AthleteReviewDetails = ({ t }: Props) => {
  const [form, setForm] = useState<ReviewFormData>(getDefaultReviewForm());
  const pathname = useLocationPathname();
  const dispatch = useDispatch();

  const [
    getReview,
    { isError: isGetReviewError, isFetching: isGetReviewFetching },
  ] = useLazyGetReviewQuery();

  const {
    data: staffUsers,
    isError: isGetStaffUsersError,
    isFetching: isGetStaffUsersFetching,
  } = useGetStaffUsersQuery();

  const {
    data: athleteReviewTypes,
    isError: isGetAthleteReviewTypesError,
    isFetching: isGetAthleteReviewTypesFetching,
  } = useGetAthleteReviewTypesQuery();

  const isLoading =
    isGetReviewFetching ||
    isGetStaffUsersFetching ||
    isGetAthleteReviewTypesFetching;

  const isError =
    isGetReviewError || isGetStaffUsersError || isGetAthleteReviewTypesError;

  const [assessmentGroups, setAssessmentGroups] = useState(
    Array<AssessmentGroup>([])
  );

  useEffect(() => {
    const athleteReviewId = getAthleteReviewId(pathname);
    const athleteId = getAthleteId(pathname);

    getReview({
      athleteId,
      reviewId: athleteReviewId,
    }).then((response) => {
      setForm(response.data);
    });

    const fetchAssessmentGroups = async () => {
      try {
        const filters = {
          athlete_ids: [athleteId],
          list_view: true,
          position_group_ids: null,
          assessment_template_ids: [],
        };

        const data = await getAssessmentGroups(filters);
        setAssessmentGroups(data.assessment_groups);
      } catch (error) {
        dispatchToastMessage({
          dispatch,
          message: t('Error fetching assessment. Please try again'),
          status: 'error',
        });
      }
    };

    if (window.getFlag('athlete-profile-goals-and-reviews')) {
      fetchAssessmentGroups();
    }
  }, [pathname]);

  if (isError) {
    return <AppStatus status="error" />;
  }
  if (isLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Header
        form={form}
        staffUsers={staffUsers}
        athleteReviewTypes={athleteReviewTypes}
        setForm={setForm}
        assessmentGroups={assessmentGroups}
      />
      <Box mt={2}>
        <CoachView form={form} setForm={setForm} />
      </Box>
    </Container>
  );
};

export default withNamespaces()(AthleteReviewDetails);
