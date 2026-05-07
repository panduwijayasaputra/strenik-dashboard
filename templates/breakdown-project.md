---
description:
globs:
alwaysApply: false
---

# Rule: Breaking Down a Project Before Creating PRDs

## Goal

To guide an AI assistant in producing a structured **Project Overview** document that maps all features and modules of a project before any PRD is written. This ensures scope is understood holistically, features are prioritized, and PRDs are created in the right order.

## Process

1. **Receive Initial Input:** The user provides either a rough project concept or an existing brief. Accept both — do not require a polished description.
2. **Ask Guided Questions:** Ask targeted questions one at a time to understand scope, users, and constraints. Do not ask more than one question per message. Provide lettered or numbered options where possible so the user can respond quickly.
3. **Generate Project Overview:** Once enough is understood, produce the overview document using the structure below.
4. **Save Document:** Save the output as `project-overview-[project-name].md` inside `/docs/prd/`.
5. **Hand off to PRD creation:** At the end of the document, list the suggested PRD order and instruct the user to run `create-prd.md` for each feature module.

## Guided Questions

Ask these in order, adapting based on previous answers. Stop when you have enough to produce a solid overview.

1. **Project type & purpose:** "What kind of product is this — web app, mobile app, internal tool, API? And what core problem does it solve?"
2. **Target users:** "Who are the main users? Are there multiple user roles (e.g. admin, regular user, guest)?"
3. **Core must-have features:** "If you had to ship a version 1 tomorrow, what are the 3–5 things it absolutely must do?"
4. **Nice-to-have features:** "What features are valuable but can wait for a later release?"
5. **Key constraints:** "Are there any known constraints — tech stack requirements, integration with existing systems, compliance, or timeline?"
6. **Success criteria:** "How would you know this project was a success? What does a good outcome look like?"

## Project Overview Structure

The generated document should include the following sections:

1. **Project Summary:** One paragraph describing what the project is, who it's for, and what problem it solves.
2. **User Types:** List each distinct user role with a one-line description of their purpose.
3. **Feature Modules:** A table or list of all identified features/modules with:
   - Module name
   - Brief description (1–2 sentences)
   - Priority: `Must Have` / `Nice to Have` / `Future`
4. **Out of Scope:** Features or capabilities explicitly excluded from this project.
5. **Key Constraints:** Technical, business, or timeline constraints that will affect implementation.
6. **Suggested PRD Order:** A numbered list of modules in the recommended order for writing PRDs, based on dependencies and priority.
7. **Open Questions:** Anything still unclear that should be resolved before or during PRD creation.

## Output

- **Format:** Markdown (`.md`)
- **Location:** `/docs/prd/`
- **Filename:** `project-overview-[project-name].md`

## Final Instructions

1. Do NOT write any PRDs during this step.
2. Ask questions one at a time — do not batch them.
3. Once the overview is saved, tell the user: "Use `templates/create-prd.md` to create a PRD for each module, starting with the first item in the Suggested PRD Order."
