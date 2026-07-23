# WEEK 07: Quality Assurance & Destructive Testing

## Objectives
- Conduct rigorous Destructive Testing on the Flask API.
- Harden the file upload architecture.
- Finalize UI responsiveness across various viewport sizes.

## Destructive Testing
The philosophy this week was: *Try to break the system.*
We uploaded PDFs renamed as `.jpg`, injected 20MB files to cause memory exhaustion, and tested malformed JSON bodies. The API was hardened to utilize strict MIME-type validation, gracefully rejecting malicious payloads with HTTP 415 errors instead of crashing the server.

## Deliverables
- `testing_and_bug_logs.txt` detailing the QA methodologies.
- Hardened backend code with robust file validation.
