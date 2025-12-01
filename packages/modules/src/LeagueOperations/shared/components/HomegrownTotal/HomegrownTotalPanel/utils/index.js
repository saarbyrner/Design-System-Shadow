// @flow
import i18n from '@kitman/common/src/utils/i18n';

const CONTENT_TEXT = [
  {
    subHeader: i18n.t('Registered Academy Players'),
    bulletPoints: [
      {
        point: i18n.t(
          'An MLS club may establish Homegrown Exclusivity over up to forty-five (45) academy players between the U15, U17, and U19 age.'
        ),
      },
    ],
  },
  {
    subHeader: i18n.t('Additional Players (“Plus 9”)'),
    bulletPoints: [
      {
        point: i18n.t(
          'In addition to the 45 registered academy players, an MLS club may establish Homegrown Exclusivity over up to nine (9) players who:'
        ),
        subPoints: [
          i18n.t('are not registered academy players;'),
          i18n.t(
            'have a permanent address or currently reside with their parent(s) or legal guardian(s) in the MLS club’s Homegrown Territory; and'
          ),
          i18n.t('are in one of the U15, U17, or U19 age groups.'),
        ],
      },
    ],
  },
  {
    subHeader: i18n.t('Post-Formation Players: College and MLS NEXT Pro'),
    bulletPoints: [
      {
        point: i18n.t(
          'An MLS club may extend Homegrown Exclusivity, for a limited time, over any former registered academy player enrolled in college or signed to a professional contract with the MLS club’s MLS NEXT Pro team, if the MLS club:'
        ),
        subPoints: [
          i18n.t(
            'Already achieved Homegrown Priority over the player at the time of college enrollment or of signing a professional contract in MLS NEXT Pro; and'
          ),
          i18n.t(
            'included the player on its Homegrown Player List at the time of college enrollment or of signing a professional contract in MLS NEXT Pro.'
          ),
        ],
      },
      {
        point: i18n.t(
          'For Post-Formation Players enrolled in college, Homegrown Exclusivity expires December 1 of the player’s scholastic senior year in college, at which point an MLS club must offer an MLS contract to sign the player as a Homegrown Player to remove him from the MLS SuperDraft.'
        ),
      },
    ],
  },
];

export default CONTENT_TEXT;
