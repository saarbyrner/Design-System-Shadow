# Tracking data guidelines

IMPORTANT: Any data that is to be used for tracking purposes, should live solely
in the index file of this directory, and have an accompanying test checking for
changes.

The purpose of this util folder, is to restrict and lock down the data that we
send to 3rd parties, with the aim of preventing leakage of Personally
Identifiable Information (PII) or Personal Health Information (PHI).

## What is PII

Personally identifiable information (PII) is information that, when used alone
or with other relevant data, can identify an individual.

PII may contain direct identifiers (e.g., passport information) that can
identify a person uniquely, or quasi-identifiers (e.g., race) that can be
combined with other quasi-identifiers (e.g., date of birth) to successfully
recognize an individual.

### Examples of PII that is relevant to us

- Full name.
- Social Security Number (SSN).
- Email address.
- Personal address information.
- Phone number.

## What is PHI

Protected health information (PHI), also referred to as personal health
information, is the demographic information, medical histories, test and
laboratory results, mental health conditions, insurance information and other
data that a healthcare professional collects to identify an individual and
determine appropriate care.

### Examples of PHI that is relevant to us

There are a lot of crossovers between PII & PHI, but some examples that are
relevant to us could include:

- Medical certificate.
- Biometrics data.
- Medical records.
- Dates (admission date, discharge date, appointment date etc.).

## Steps to add new data to track

1. Update or add a new directory within `src/data`. This could be feature
   specific, or per module, dependant on how big the area is, and what the event
   tracking needs are.
1. Create a new file within here, to construct and return the data needed, named
   to identify the purpose (e.g., `getCalendarEventData`).
1. Create a new type, with the same directory format as above, in `src/types`.
   1. This step is very important, as it outlines the type of data that we’ll be
      sending, and will prevent commits & merges if we attempt to send different
      data types.
1. Create a mock object in the `src/mocks`, as close to the real data as
   possible, again in the same directory naming as above.
1. Add a snapshot test for the data returned in step 2.
   1. This just adds another verification step, and will ensure that no new data
      is added to an object accidentally.
