# Project memory

## Product intent & audience

- **Scholarly** is a student-facing educational/study app focused on learning and academic productivity.
- The entry experience is a minimal landing/login flow; a fuller dashboard is available after authentication.
- **Exam Explorer** provides concise, scannable yet comprehensive information about standardized tests for prospective test takers.
- **Vibe Station** is an in-app music area where users can play saved songs without switching browser tabs.

## Brand personality & voice

- Friendly, approachable, and mascot-driven.
- Clean, modern, minimal, and production-quality.
- Exam content should be practical, structured, and easy to scan without omitting important details.
- Music playback should feel familiar and convenient, with controls modeled after common streaming-player patterns.

## Visual design & UX direction

- Opening screen uses a sparse, focused composition: centered **SCHOLARLY** title, tagline, mascot, message, and separate **LOGIN** / **SIGN UP** actions.
- The canonical mascot is the original tiny pixel robot. Do not reuse the rejected lavender creature variant.
- Prefer the approved opening-screen aesthetic over dense, multi-section marketing layouts.
- Exam Explorer entries should present format, timing, sections, scoring, fees, policies, dates, and related logistics in a consistent concise structure.
- Vibe Station playback stays embedded in the current page rather than redirecting users to another tab.
- Song-level controls should be placed beside the currently playing song and include play/pause, stop, replay, loop, and volume where supported.
- Direct audio should use native in-page playback for common formats including MP3, WAV, OGG, M4A, AAC, and WEBM.
- Embedded YouTube and Spotify players should remain large enough for their provider controls to be usable.

## Decisions, constraints & rationale

- Product title is **SCHOLARLY**; the removed “2.0” should not return.
- LOGIN and SIGN UP open account dialogs; the dashboard is post-authentication.
- GRE Explorer content currently includes the shorter 1h58m format, five sections, section timing/questions/scoring, section-level adaptivity, approximate pricing, score reports, retake policy, ScoreSelect, five-year score validity, and the 2023 Analytical Writing change.
- SAT Explorer content was added in the same format with:
  - Fully digital, multi-stage adaptive testing through the Bluebook app on a personal device or test-center computer.
  - Total duration of 2h14m plus a 10-minute break.
  - 400–1600 total score, based on 200–800 per main section; no negative marking.
  - Scores valid for five years.
  - Reading and Writing: 64 minutes across two 32-minute modules; 54 multiple-choice questions.
  - Math: 70 minutes across two 35-minute modules; 44 questions consisting of multiple-choice and student-produced responses; calculator permitted throughout, including built-in Desmos.
  - India registration fee of approximately $130.98 / ₹12,625.
  - 2026 dates supplied for November 7 and December 5; December registration deadline is November 20 and late deadline November 24. November registration is marked passed, with October 27 late registration.
  - More than 160 test centers across more than 40 Indian cities.
- Project build was reported successful after the SAT content update.
- Vibe Station fixes include correct parsing of regional Spotify URLs such as `/intl-in/track/...`, privacy-friendly YouTube embeds, and retention of existing saved tracks in the queue.
- YouTube and Spotify playback uses provider-controlled embedded controls because their services do not permit reliable custom audio control through the site’s native player.
- Direct-audio controls are implemented in-page; embedded-provider behavior should not be represented as fully equivalent to native playback.

## Open questions & assumptions

- Exact post-login dashboard scope and content remain unspecified.
- It is unconfirmed whether the pixel mascot has roles beyond the opening page.
- Authentication backend, providers, and persistence details are unspecified.
- It is unconfirmed whether Exam Explorer will expand beyond GRE and SAT.
- SAT dates, fees, and availability are time-sensitive and may need verification before production publication.
- Vibe Station’s supported source types beyond the fixed YouTube, Spotify, and direct-audio cases are unspecified.
- Browser autoplay restrictions may require a user interaction before playback begins.
- It is unspecified whether queue-wide playback, current-track persistence, keyboard controls, or mobile-specific player behavior are required.