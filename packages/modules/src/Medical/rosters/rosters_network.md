| API                                              | Technology          | Desired tech | Used                                                                |
| ------------------------------------------------ | ------------------- | ------------ | ------------------------------------------------------------------- |
| /ui/organisation/organisations/current           | OrganisationContext | Context      | App                                                                 |
| /ui/squads/permitted                             | SOLVED              | RTK          | index.js                                                            |
| /ui/fields/medical/issues/create_params          | hook                | RTK          | useIssueFields in addIssueSidePanel                                 |
| /ui/position_groups                              | SOLVED              | RTK          | Filters.                                                            |
| /ui/medical/clinical_impressions_body_areas      | AJAX get            | RTK          | AddIssueSidePanel, AddWorkersCompSidePanel, AddDiagnosticsSidePanel |
| /ui/medical/clinical_impressions_classifications | AJAX GET            | RTK          | AddIssueSidePanel,                                                  |
| /ui/medical/injuries/types                       | AJAX GET            | RTK          | AddIssueSidePanel,                                                  |
| /ui/medical/presentation_types                   | AJAX GET & RTK      | RTK Only     | AddIssueSidePanel - EventInformation                                |
| /ui/medical/issue_contact_types                  | RTK                 |              | possibly skipping on a truthy value - which would not skip          |
| /ui/medical/injury_mechanisms                    | RTK                 |              | possibly skipping on a truthy value - which would not skip          |
| /ui/conditional_fields/fetch_questions           | REDUX               | Investigate  |
| /ui/fields/medical/issues/create_params          |                     |              | Duplicate from above                                                |
| /medical/rosters/fetch                           |                     |              | Should be the 1st one                                               |
