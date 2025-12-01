import { rest } from 'msw';

const data = [
  {
    ScreenMessage:
      'Coumadin 6 mg tablet and ibuprofen 400 mg tablet may interact based on the potential interaction between SELECTED ANTICOAGULANTS (VIT K ANTAGONISTS) and NSAIDS.',
    ClinicalEffects: [
      {
        ClinicalEffectCode: 'INF',
        ClinicalEffectDesc: 'Increased effect of the former drug',
      },
    ],
    InteractionDesc: 'SELECTED ANTICOAGULANTS (VIT K ANTAGONISTS)/NSAIDS',
    Severity: '2',
    ScreenDrug1: {
      DrugDose: null,
      GroupSetID: 'active',
      Prospective: false,
      DrugDesc: 'Coumadin 6 mg tablet',
      DrugID: '196962',
      DrugConceptType: 3,
    },
    ScreenDrug2: {
      DrugDose: null,
      Prospective: false,
      DrugDesc: 'ibuprofen 400 mg tablet',
      DrugID: '250621',
      DrugConceptType: 3,
    },
    HasHumanClinicalTrial: true,
    HasCaseReports: true,
    HasMeetingAbstract: false,
    HasVitroOrAnimalStudy: false,
    HasMfgInfo: true,
    HasReview: true,
    MonographID: 496,
    InteractionID: 496,
    SeverityDesc:
      'Severe Interaction: Action is required to reduce the risk of severe adverse interaction. ',
    EDIPageReference: '04/059.00',
    ScreenDrugs: [
      {
        DrugDose: null,
        GroupSetID: 'active',
        Prospective: false,
        DrugDesc: 'Coumadin 6 mg tablet',
        DrugID: '196962',
        DrugConceptType: 3,
      },
      {
        DrugDose: null,
        Prospective: false,
        DrugDesc: 'ibuprofen 400 mg tablet',
        DrugID: '250621',
        DrugConceptType: 3,
      },
    ],
    ClinicalEffectsNarrative:
      'Concurrent use of anticoagulants and NSAIDs may increase the risk for bleeding.',
  },
];

const handler = rest.post(
  '/ui/medical/medications/drug_interaction_screen',
  (req, res, ctx) => res(ctx.json(data))
);
export { handler, data };
