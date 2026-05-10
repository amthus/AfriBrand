# Security Specification for AfriBrand AI

## Data Invariants
1. A Brand DNA document must be owned by a single user.
2. Only the owner of a Brand DNA document can read or write it.
3. Brand DNA must follow a strict schema on creation and update.

## The "Dirty Dozen" Payloads (Testing for Failure)

1. **Identity Spoofing**: User A attempts to read User B's brand DNA.
2. **Identity Spoofing (Save)**: User A attempts to write to User B's brand DNA path.
3. **Malicious ID**: Attempting to create a document with a 1KB string as an ID.
4. **Schema Violation (Missing Field)**: Attempting to save DNA without 'colors'.
5. **Schema Violation (Invalid Type)**: Attempting to save 'colors' as a string instead of a list.
6. **Shadow Update**: Attempting to add an `isAdmin: true` field during a DNA update.
7. **Bypassing Verification**: Attempting to write DNA as a user with an unverified email (if enforced).
8. **Resource Exhaustion**: Sending a 1MB string in the 'name' field.
9. **State Shortcutting**: (N/A for this simple CRUD)
10. **Orphaned Record**: (N/A as DNA is top-level)
11. **PII Leak**: Attempting to list all brands to find users' local context.
12. **Blanket Read**: Authenticated user trying to read `/brands/non-existent-user` without a specific ID.

## Test Runner (firestore.rules.test.ts)
(To be implemented if testing environment is available, but currently focusing on rules implementation)
