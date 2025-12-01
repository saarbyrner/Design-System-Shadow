### RegistrationSidePanel actions, explained

#### Background

A user submits a registration. Some sections within this registration are set as
requiring review by an admin. The other sections are by default, set to
Approved, but can be reviewed by an admin.

A section would be 'Player details', 'Insurance', 'Headshot etc.

Once a registration has been submitted, a user can no longer submit a
registration, nor can they update the exisiting registration due to technical
limitiations and time constraints. We did not have enough time to implement a
patch service.

To get around this, a section can be viewed from the Requirements tabs and an
update can be applied to the section.

This update is effectively a POST that will overwrite the content with a new
value, whilst still maintaining a reference to the registration.

### Logic

The side panel cannot be accessed by anyone if a registration has not yet been
submitted. We need to have a registration created in order to have the sections
created. This is by design.

The only user who can edit a section belonging to a registration is the creator
of the registration. The athlete or the staff. And, a section can only be
edited, if that section has a `registration_status` of `rejected_organisation`
or `rejected_association`.

A club admin may only update the status for a section if the
`registration_status` is `pending_organisation`. \
A club admin may only open the side panel for a section if the registration has been
submitted. \
A club admin can only view the section details and not edit.

A league admin may only update the status for a section at any time as long as a
registration has been created. \
A league admin may only open the side panel for a section if the registration has
been submitted. \
A league admin can only view the section details and not edit.

### Truth table

| User            | Current Status          | Can view section | Can edit section | Can update status | Status Options                                                      |
| --------------- | ----------------------- | ---------------- | ---------------- | ----------------- | ------------------------------------------------------------------- |
| Athlete / Staff | `incomplete`            | `false`          | `false`          | `false`           | []                                                                  |
| Club admin      | `incomplete`            | `false`          | `false`          | `false`           | []                                                                  |
| League admin    | `incomplete`            | `false`          | `false`          | `false`           | []                                                                  |
| Athlete / Staff | `pending_organisation`  | `true`           | `false`          | `false`           | []                                                                  |
| Athlete / Staff | `pending_association`   | `true`           | `false`          | `false`           | []                                                                  |
| Athlete / Staff | `rejected_organisation` | `true`           | `true`           | `false`           | []                                                                  |
| Athlete / Staff | `rejected_association`  | `true`           | `true`           | `false`           | []                                                                  |
| Athlete / Staff | `pending_payment`       | `true`           | `false`          | `false`           | []                                                                  |
| Athlete / Staff | `active`                | `true`           | `false`          | `false`           | []                                                                  |
| Club admin      | `pending_organisation`  | `true`           | `false`          | `true`            | [`pending_association`, `rejected_organisation`]                    |
| Club admin      | `pending_association`   | `true`           | `false`          | `false`           | []                                                                  |
| Club admin      | `rejected_organisation` | `true`           | `false`          | `false`           | []                                                                  |
| Club admin      | `rejected_association`  | `true`           | `false`          | `false`           | []                                                                  |
| Club admin      | `pending_payment`       | `true`           | `false`          | `false`           | []                                                                  |
| Club admin      | `active`                | `true`           | `false`          | `false`           | []                                                                  |
| League admin    | `pending_organisation`  | `true`           | `false`          | `true`            | [`pending_payment`, `rejected_association` , `pending_association`] |
| League admin    | `pending_association`   | `true`           | `false`          | `true`            | [`pending_payment`, `rejected_association`]                         |
| League admin    | `rejected_organisation` | `true`           | `false`          | `true`            | [`pending_payment`]                                                 |
| League admin    | `rejected_association`  | `true`           | `false`          | `true`            | [`pending_payment`]                                                 |
| League admin    | `pending_payment`       | `true`           | `false`          | `true`            | [`active`]                                                          |
| League admin    | `active`                | `true`           | `false`          | `false`           | []                                                                  |
