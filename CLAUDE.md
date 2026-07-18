# CLAUDE.md

## Project Overview

This repository is for the FlyRank AI Front-End Engineering internship Week 1 environment setup.

## Stack

- Node.js
- Git
- Cursor IDE
- JavaScript

## Development Conventions

- Use Conventional Commits for Git messages.
- Keep code clean and readable.
- Document important changes.
- Use AI-assisted development responsibly.

## Git Commit Style

Examples:

- feat: add new feature
- docs: update documentation
- chore: update configuration

## Project-Specific Rules

Learned from the user settings form exercise comparing vague and precise prompting:

- Every form input must have a visible label connected with a matching `for`/`id` pair. Do not rely on placeholders alone.
- Show inline validation errors beside the relevant field, and set `aria-invalid="true"` on controls that fail validation.
- Ensure the form is fully usable by keyboard: use `:focus-visible` styles, logical tab order, and move focus to the first invalid field after a failed submit.
- Keep validation logic in `validation.js` separate from DOM handling in `script.js` so rules can be tested without a browser.
- Run `npm test` before committing changes to validation or form behaviour; the suite must stay green.
- Read and write `localStorage` inside try/catch blocks, validate parsed data with `normalizeSettings()`, and fall back to safe defaults when storage is unavailable or malformed.
