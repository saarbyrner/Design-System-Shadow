// @flow
import type { Diagnostic } from '@kitman/modules/src/Medical/shared/types';
import type { SelectOption as Option } from '@kitman/components/src/types';

export type DiagnosticType = {
  id: number,
  name: string,
};

export type RequestResponse = {
  diagnostics: Array<Diagnostic>,
  meta: {
    next_page: number,
    current_page: number,
    prev_page: number,
    total_count: number,
    total_pages: number,
  },
};

export type DiagnosticTypes = Array<DiagnosticType>;

export type OptionWithOptional = Option & {
  optional: boolean,
  isInjuryIllness: boolean,
};
export type MedicalLocationOption = Option & {
  redoxOrderable: boolean,
};
