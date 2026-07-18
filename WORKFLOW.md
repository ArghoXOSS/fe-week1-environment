# Workflow Comparison: Vague vs Precise Prompting

In this exercise, I built the same user settings form twice on separate Git branches to compare how prompt specificity affects the resulting implementation. The **vague-prompt** branch was created from the instruction: "Build a simple user settings form with basic validation using HTML, CSS, and JavaScript." The **precise-prompt** branch followed a detailed specification that named exact fields, validation rules, accessibility requirements, localStorage behaviour, responsive design constraints, and automated tests.

## What Each Branch Produced

Using `git show` to inspect both branches, I found that the vague version delivered three files (`index.html`, `styles.css`, `script.js`) with seven form fields, including username, bio, and password fields that were never requested in the brief but were inferred by the model. Validation lived entirely inside `script.js`, errors appeared below inputs, and successful submission logged data to the console rather than persisting it. The precise version matched the requested five fields (display name, email, time zone, theme radios, email notifications), split validation into `validation.js`, added `tests/validation.test.js`, and wired `npm test` to Node's built-in test runner.

## Correctness and Edge Cases

Both branches validate required names and email format, but they differ in scope and rigour. The vague form validates a restrictive full-name character set and optional password pairs, yet omits a time zone field entirely. The precise form enforces a 2–50 character display name (trimmed), required time zone selection, and handles malformed or missing `localStorage` data through `normalizeSettings()` without crashing. After reloading the page, saved settings restore correctly on the precise branch; the vague branch offers no persistence, so refresh loses all input.

## Accessibility, Validation, and Review Effort

The vague form includes labels and a status live region, but it lacks `aria-invalid`, `aria-describedby`, and a `fieldset`/`legend` for theme options. Focus styles remove the default outline without consistently using `:focus-visible`, which is weaker for keyboard users. The precise form addresses these gaps, places inline errors beside invalid fields, supports `prefers-color-scheme` and `prefers-reduced-motion`, and focuses the first invalid field in a predictable field order after submit.

Reviewing the vague version required reading all inline validators manually and checking behaviour in the browser field by field. The precise version passed 13 automated tests and also passed manual browser checks, which reduced verification time and gave clearer evidence that edge cases were handled.

## Weaknesses and Improvements

The main weaknesses in the vague version were scope drift (extra fields), no automated testing, no persistence, and incomplete accessibility. The precise prompt corrected these by stating requirements explicitly. In my view, the comparison confirms that detailed prompts produce implementations that are easier to verify, closer to the intended product, and safer to maintain.
