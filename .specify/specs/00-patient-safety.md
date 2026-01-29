# Patient Safety Fields Specification

## User Story
As a doctor, I need to see patient allergies and chronic conditions prominently displayed so I don't prescribe medications that could harm the patient.

## Why This is P0 (Critical)
**Allergies can kill patients.** A patient allergic to penicillin who receives amoxicillin can die from anaphylaxis. This is the highest priority feature.

## Acceptance Criteria
- [ ] Allergies field exists in patient record (array of strings)
- [ ] Chronic conditions field exists (array of strings)
- [ ] Blood group field exists
- [ ] Allergies display as RED WARNING BANNER on patient page
- [ ] Allergies display as RED WARNING BANNER on visit page
- [ ] Chronic conditions display as colored badges
- [ ] Fields are editable in patient form

## Data Model Changes

### Patients Table (add columns)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| allergies | TEXT[] | No | Array of drug allergies |
| chronic_conditions | TEXT[] | No | Array of conditions (Diabetes, HTN, etc.) |
| blood_group | TEXT | No | A+, A-, B+, B-, AB+, AB-, O+, O- |

## UI Components Required

### AllergyBanner
- Background: Red (#DC2626)
- Icon: Warning triangle
- Text: "ALLERGIES: {list of allergies}"
- Position: Top of patient detail page, top of visit page
- Always visible when patient has allergies

### ChronicConditionBadges
- Display as colored badges/chips
- Common conditions with colors:
  - Diabetes: Blue
  - Hypertension: Red
  - Asthma: Green
  - Heart Disease: Purple
- Display on patient card and visit page

### Patient Form Updates
- Allergies: Tag/chip input (add multiple)
- Chronic conditions: Tag/chip input (add multiple)
- Blood group: Dropdown select

## Common Allergies (Suggestions)
- Penicillin
- Sulfa drugs
- Aspirin
- NSAIDs
- Codeine
- Latex
- Iodine

## Common Chronic Conditions (Suggestions)
- Diabetes Mellitus
- Hypertension
- Asthma
- COPD
- Coronary Artery Disease
- Chronic Kidney Disease
- Hypothyroidism
- Hyperthyroidism

## Non-Functional Requirements
- Banner must be impossible to miss (size, color, position)
- Must load with patient data (no lazy loading)
- Must be visible without scrolling
