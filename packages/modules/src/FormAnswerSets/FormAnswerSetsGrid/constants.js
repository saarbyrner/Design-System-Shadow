// @flow

export const TabIndexes = {
  FormAnswerSets: '0',
};

export type TabIndex = $Values<typeof TabIndexes>;

type FormAnswerSetStatus = {
  id: string,
  label: string,
};

export const formAnswerSetStatuses: Array<FormAnswerSetStatus> = [
  {
    id: 'draft',
    label: 'Draft',
  },
  {
    id: 'complete',
    label: 'Complete',
  },
  {
    id: 'published',
    label: 'Published',
  },
  {
    id: 'deleted',
    label: 'Deleted',
  },
];
