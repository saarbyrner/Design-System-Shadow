import { data } from '@kitman/modules/src/Scouts/shared/redux/services/mocks/data/mock_form_structure';

import formMenuSlice, {
  onToggleDrawer,
  onSetActiveMenu,
  onBuildFormMenu,
  initialState,
} from '../formMenuSlice';

describe('[formMenuSlice]', () => {
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(formMenuSlice.reducer(initialState, action)).toEqual(expectedState);
  });

  describe('onToggleDrawer()', () => {
    it('should toggle the drawer', () => {
      const action = onToggleDrawer();
      const updatedState = formMenuSlice.reducer(initialState, action);
      expect(updatedState.drawer.isOpen).toEqual(false);
    });
  });

  describe('onSetActiveMenu()', () => {
    it('should correctly set the active sub-form', () => {
      const action = onSetActiveMenu({ menuGroupIndex: 3 });
      const updatedState = formMenuSlice.reducer(initialState, action);
      expect(updatedState.active.menuGroupIndex).toEqual(3);
      expect(updatedState.active.menuItemIndex).toEqual(0);
    });
    it('should correctly set the active sub-form and sub-section', () => {
      const action = onSetActiveMenu({ menuGroupIndex: 3, menuItemIndex: 2 });
      const updatedState = formMenuSlice.reducer(initialState, action);
      expect(updatedState.active.menuGroupIndex).toEqual(3);
      expect(updatedState.active.menuItemIndex).toEqual(2);
    });
  });
});

describe('onBuildFormMenu() for athletes', () => {
  let action;
  beforeEach(() => {
    action = onBuildFormMenu({
      elements: data[61].form_template_version.form_elements,
    });
  });
  it('should correctly build the form state for athletes', () => {
    const updatedState = formMenuSlice.reducer(initialState, action);
    const expectedState = {
      element_type: 'Forms::Elements::Layouts::Menu',
      fields: [
        2692, 2693, 2694, 2696, 2697, 2698, 2699, 2699, 2700, 2701, 2702, 2703,
        2704, 2706, 2707, 2711, 2712, 2713, 2714, 2715, 2716, 2708, 2717, 2709,
        2719, 2721, 2722, 2723, 2724, 2727, 2729, 2731, 2733, 2734, 2737, 2739,
        2741, 2743, 2745, 2747, 2749, 2750, 2751, 2752, 2753, 2754, 2755, 2756,
        2757, 2758, 2759, 2760, 2762, 2763, 2764, 2765, 2766, 2768, 2769, 2770,
        2771, 2774,
      ],
      index: 0,
      items: [
        {
          element_type: 'Forms::Elements::Layouts::MenuGroup',
          fields: [
            2692, 2693, 2694, 2696, 2697, 2698, 2699, 2699, 2700, 2701, 2702,
            2703, 2704, 2706, 2707, 2711, 2712, 2713, 2714, 2715, 2716, 2708,
            2717, 2709, 2719, 2721, 2722, 2723, 2724,
          ],
          index: 0,
          items: [
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [
                2692, 2693, 2694, 2696, 2697, 2698, 2699, 2699, 2700, 2701,
                2702, 2703, 2704,
              ],
              index: 0,
              items: [],
              key: 'playerdetails',
              title: 'Player Details',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [
                2706, 2707, 2711, 2712, 2713, 2714, 2715, 2716, 2708, 2717,
                2709,
              ],
              index: 1,
              items: [],
              key: 'parentguardian',
              title: 'Parents/ Guardian',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2719, 2721, 2722, 2723, 2724],
              index: 2,
              items: [],
              key: 'insurance',
              title: 'Insurance',
            },
          ],
          key: 'personal_details',
          title: 'Personal Details',
        },
        {
          element_type: 'Forms::Elements::Layouts::MenuGroup',
          fields: [2727, 2729, 2731, 2733, 2734],
          index: 1,
          items: [
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2727],
              index: 0,
              items: [],
              key: 'attachment_section_headshot',
              title: 'Headshot',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2729],
              index: 1,
              items: [],
              key: 'attachment_section_proof_of_birth',
              title: 'Proof of Birth',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2731],
              index: 2,
              items: [],
              key: 'attachment_section_impact_baseline',
              title: 'ImPACT Baseline Test',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2733, 2734],
              index: 3,
              items: [],
              key: 'attachment_section_itc',
              title: 'International Transfer Certificate',
            },
          ],
          key: 'attachments',
          title: 'Documents',
        },
        {
          element_type: 'Forms::Elements::Layouts::MenuGroup',
          fields: [
            2737, 2739, 2741, 2743, 2745, 2747, 2749, 2750, 2751, 2752, 2753,
            2754, 2755, 2756, 2757, 2758, 2759, 2760, 2762, 2763, 2764, 2765,
            2766, 2768, 2769, 2770, 2771,
          ],
          index: 2,
          items: [
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2737],
              index: 0,
              items: [],
              key: 'acknowledgement_privacy_policy_section',
              title: 'Privacy Policy',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2739],
              index: 1,
              items: [],
              key: 'acknowledgement_health_information_release_section',
              title:
                'Player Authorization for the Release of Health Information',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2741],
              index: 2,
              items: [],
              key: 'acknowledgement_rules_regulations_section',
              title: 'Rules and Regulations',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2743],
              index: 3,
              items: [],
              key: 'acknowledgement_participant_waiver_section',
              title: 'Participant Agreement and Waiver',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2745],
              index: 4,
              items: [],
              key: 'acknowledgement_code_conduct_section',
              title: 'Code of Conduct',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2747],
              index: 5,
              items: [],
              key: 'acknowledgement_mls_next_section',
              title: 'MLS NEXT Acknowledgements',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [
                2749, 2750, 2751, 2752, 2753, 2754, 2755, 2756, 2757, 2758,
                2759, 2760,
              ],
              index: 6,
              items: [],
              key: 'acknowledgement_diversity_section',
              title: 'Diversity, Equity and Inclusion',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2762, 2763, 2764, 2765, 2766],
              index: 7,
              items: [],
              key: 'acknowledgement_housing_section',
              title: '23/24 Housing Information',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2768, 2769, 2770, 2771],
              index: 8,
              items: [],
              key: 'signatures',
              title: 'Signature',
            },
          ],
          key: 'policies',
          title: 'Policies & Signatures',
        },
        {
          element_type: 'Forms::Elements::Layouts::MenuGroup',
          fields: [2774],
          index: 3,
          items: [
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2774],
              index: 0,
              items: [],
              key: 'attachment_safesport_section',
              title: 'SafeSport',
            },
          ],
          key: 'courses',
          title: 'Courses',
        },
      ],
      key: 'menu',
      title: 'MLS Next 23/24',
    };
    expect(updatedState.menu).toEqual(expectedState);
  });
});

describe('onBuildFormMenu() for staff', () => {
  let action;
  beforeEach(() => {
    action = onBuildFormMenu({
      elements: data[62].form_template_version.form_elements,
    });
  });

  it('should correctly build the form state for staff', () => {
    const updatedState = formMenuSlice.reducer(initialState, action);
    const expectedState = {
      element_type: 'Forms::Elements::Layouts::Menu',
      fields: [
        2783, 2777, 2778, 2779, 2781, 2782, 2784, 2780, 2785, 2786, 2787, 2789,
        2790, 2791, 2792, 2793, 2794, 2796, 2797, 2798, 2799, 2800, 2801, 2803,
        2805, 2806, 2807, 2808, 2811, 2813, 2815, 2816, 2817, 2819, 2820, 2822,
        2823, 2825, 2826, 2828, 2829, 2831, 2832, 2835, 2837, 2839, 2841, 2843,
        2845, 2846, 2847, 2848, 2849, 2850, 2851, 2852, 2853, 2854, 2856, 2857,
        2859, 2860, 2863, 2865, 2866,
      ],
      index: 0,
      items: [
        {
          element_type: 'Forms::Elements::Layouts::MenuGroup',
          fields: [
            2783, 2777, 2778, 2779, 2781, 2782, 2784, 2780, 2785, 2786, 2787,
            2789, 2790, 2791, 2792, 2793, 2794, 2796, 2797, 2798, 2799, 2800,
            2801, 2803, 2805, 2806, 2807, 2808,
          ],
          index: 0,
          items: [
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [
                2783, 2777, 2778, 2779, 2781, 2782, 2784, 2780, 2785, 2786,
                2787, 2789, 2790, 2791, 2792, 2793, 2794,
              ],
              index: 0,
              items: [],
              key: 'userdetails',
              title: 'Coach Details',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2796, 2797, 2798, 2799, 2800, 2801],
              index: 1,
              items: [],
              key: 'emergency',
              title: 'Emergency Contact',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2803, 2805, 2806, 2807, 2808],
              index: 2,
              items: [],
              key: 'insurance',
              title: 'Insurance',
            },
          ],
          key: 'personal_details',
          title: 'Personal Details',
        },
        {
          element_type: 'Forms::Elements::Layouts::MenuGroup',
          fields: [
            2811, 2813, 2815, 2816, 2817, 2819, 2820, 2822, 2823, 2825, 2826,
            2828, 2829, 2831, 2832,
          ],
          index: 1,
          items: [
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2811],
              index: 0,
              items: [],
              key: 'attachment_section_headshot',
              title: 'Headshot',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2813, 2815, 2816, 2817],
              index: 1,
              items: [],
              key: 'attachment_section_ussf_license',
              title: 'USSF License',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2819, 2820],
              index: 2,
              items: [],
              key: 'attachment_section_uscc_license',
              title: 'USCC License',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2822, 2823],
              index: 3,
              items: [],
              key: 'attachment_section_csa_license',
              title: 'CSA License',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2825, 2826],
              index: 4,
              items: [],
              key: 'attachment_section_uefa_license',
              title: 'UEFA License',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2828, 2829],
              index: 5,
              items: [],
              key: 'attachment_section_gkc_license',
              title: 'GKC License',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2831, 2832],
              index: 6,
              items: [],
              key: 'attachment_section_other_license',
              title: 'Other License',
            },
          ],
          key: 'attachments',
          title: 'Documents',
        },
        {
          element_type: 'Forms::Elements::Layouts::MenuGroup',
          fields: [
            2835, 2837, 2839, 2841, 2843, 2845, 2846, 2847, 2848, 2849, 2850,
            2851, 2852, 2853, 2854, 2856, 2857, 2859, 2860,
          ],
          index: 2,
          items: [
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2835],
              index: 0,
              items: [],
              key: 'acknowledgement_privacy_policy_section',
              title: 'Privacy Policy',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2837],
              index: 1,
              items: [],
              key: 'acknowledgement_participant_waiver_section',
              title: 'Participant Agreement and Waiver',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2839],
              index: 2,
              items: [],
              key: 'acknowledgement_acknowledgements_section',
              title: 'Acknowledgements',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2841],
              index: 3,
              items: [],
              key: 'acknowledgement_code_conduct_section',
              title: 'Code of Conduct',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2843],
              index: 4,
              items: [],
              key: 'acknowledgement_cdc_heads_up_section',
              title: 'CDC Heads Up Acknowledgement',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [
                2845, 2846, 2847, 2848, 2849, 2850, 2851, 2852, 2853, 2854,
              ],
              index: 5,
              items: [],
              key: 'acknowledgement_diversity_section',
              title: 'Diversity, Equity and Inclusion',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2856, 2857],
              index: 6,
              items: [],
              key: 'background_check_policy_section',
              title: 'Background Check',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2859, 2860],
              index: 7,
              items: [],
              key: 'signatures',
              title: 'Signature',
            },
          ],
          key: 'policies',
          title: 'Policies & Signatures',
        },
        {
          element_type: 'Forms::Elements::Layouts::MenuGroup',
          fields: [2863, 2865, 2866],
          index: 3,
          items: [
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2863],
              index: 0,
              items: [],
              key: 'attachment_safesport_section',
              title: 'SafeSport',
            },
            {
              element_type: 'Forms::Elements::Layouts::MenuItem',
              fields: [2865, 2866],
              index: 1,
              items: [],
              key: 'attachment_cdc_heads_up_section',
              title: 'Heads Up',
            },
          ],
          key: 'courses',
          title: 'Courses',
        },
      ],
      key: 'menu',
      title: 'MLS Next 23/24',
    };
    expect(updatedState.menu).toEqual(expectedState);
  });
});
