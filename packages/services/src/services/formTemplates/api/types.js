// @flow

export type FormTemplateEditor = {
  id: number,
  name: string,
};
export type MetaCamelCase = {
  currentPage: number,
  nextPage: number | null,
  prevPage: number | null,
  totalPages: number,
  totalCount: number,
};

export type Choice = {
  name: string,
  key: string,
  default_score: number,
  default_colour: string,
};

export type QuestionResponse = {
  source: string,
  variable: string,
  description: string,
  type: string,
  unit?: string,
  min?: number,
  max?: number,
  choices?: Array<Choice>,
  platform?: number,
};

export type QuestionType =
  | 'number'
  | 'boolean'
  | 'range'
  | 'single_choice'
  | 'multiple_choice';

export type FormCategorySelect = {
  label: string,
  value: string,
};

export type ProductArea = {
  id: number,
  name: string,
  key: string,
};

type CreatedBy = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
};

export type FormCategory = {
  id: number,
  name: string,
  key?: string,
  productArea: string, // This may become an enum after time.
  productAreaId: number,
  organisationId?: number,
  createdBy?: CreatedBy,
  createdAt?: string,
  updatedAt?: string,
  deleted?: boolean,
};

export type FormTemplate = {
  id: number,
  name: string,
  version: number,
  category: string,
  editor: FormTemplateEditor,
  createdAt: string,
  updatedAt: string,
  fullname: string,
  formCategory: FormCategory,
};

export type FormCategories = Array<FormCategory>;
