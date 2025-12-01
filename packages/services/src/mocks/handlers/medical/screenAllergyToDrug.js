import { rest } from 'msw';

const data = [
  {
    ScreenMessage:
      'The use of ibuprofen 400 mg tablet may result in an allergic reaction based on a reported history of a reaction to ibuprofen in which Itching was experienced.',
    DALinks: [
      {
        InteractingIngredients: null,
        ActiveProductsExistenceCode: 'Active products exist',
        IngredientTypeBasisCode: 'Based on active ingredient',
        AllergenMatch: 'ibuprofen',
        AllergenMatchType: 'Ingredient',
      },
    ],
    ScreenDrugs: [
      {
        DrugDose: null,
        Prospective: false,
        DrugDesc: 'ibuprofen 400 mg tablet',
        DrugID: '250621',
        DrugConceptType: 3,
      },
    ],
    ScreenAllergen: {
      AllergenID: '2377',
      AllergenConceptType: 1,
      AllergenDesc: 'ibuprofen',
      Prospective: false,
      Reaction: 'Itching',
      ReactionType: null,
      Severity: null,
      AllergenType: null,
      Comment: null,
    },
  },
];

const handler = rest.post(
  '/ui/medical/medications/allergy_screen',
  (req, res, ctx) => res(ctx.json(data))
);
export { handler, data };
