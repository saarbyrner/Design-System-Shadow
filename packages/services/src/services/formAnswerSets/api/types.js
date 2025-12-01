// @flow
import type {
  MetaCamelCase,
  FormCategory,
} from '@kitman/services/src/services/formTemplates/api/types';

export type Pagination = {
  page: number,
  per_page: number,
};

export type LatestPdfDetails = {
  id: number,
  url: string,
  downloadUrl: string,
  filename: string,
  filetype: string,
  filesize: number,
};

export type AnswersSet = {
  id: number,
  organisationId: number,
  form: {
    id: number,
    category: string,
    group: string,
    key: string,
    name: string,
    fullname: string,
    formType: string,
    config: any,
    enabled: boolean,
    createdAt: string,
    updatedAt: string,
    formCategory: FormCategory,
  },
  date: string,
  editor: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
  },
  athlete: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
    position: {
      id: number,
      name: string,
      order: number,
    },
    availability: string,
    avatarUrl: string,
  },
  extra: null,
  status: string,
  latestCompletedPdfExport?: ?LatestPdfDetails,
};

export type FormAnswersSetsFilters = {
  category?: string,
  athlete_id?: number,
  group?: string,
  form_type?: string,
  key?: ?string,
  statuses?: Array<string>,
  date_range?: {
    start_date: string,
    end_date: string,
  },
  form_id?: number,
  only_assigned_forms?: boolean,
  user_id?: number,
};

export type SearchFormAnswersSetsBody = {
  ...FormAnswersSetsFilters,
  pagination: Pagination,
};

export type SearchByAthleteParams = {
  athleteIds?: Array<number>,
  formIds?: Array<number>,
  statuses?: Array<string>,
  startDate?: string,
  endDate?: string,
} & Pagination;

export type FormAnswerSetStatus = {
  total: number,
  completed: number,
  incomplete: number,
  latest_submission_at: ?string,
};

export type FormAssignment = {
  id: number,
  due_on: string,
};

export type FormAnswerSetForm = {
  id: number,
  name: string,
  status: string,
  last_update: ?string,
  assignment: ?FormAssignment,
};

export type FormAnswerSetCompliance = {
  athlete: {
    id: number,
    firstname: string,
    lastname: string,
    fullname: string,
    position: {
      id: number,
      name: string,
      order: number,
    },
    avatarUrl: string,
    dateOfBirth: string,
  },
  status: {
    total: number,
    completed: number,
    incomplete: number,
    latestSubmissionAt: ?string,
  },
  formTemplates: Array<{
    id: number,
    name: string,
    status: string,
    lastUpdate: ?string,
    formAnswersSets: ?Array<{
      id: number,
      updatedAt: string,
      status: string,
    }>,
  }>,
};

export type FetchFormAnswerSetsByAthleteResponse = {
  data: Array<FormAnswerSetCompliance>,
  meta: MetaCamelCase,
};

export type FetchMultipleFormAnswersSetsResponse = {
  data: Array<AnswersSet>,
  meta: MetaCamelCase,
};
