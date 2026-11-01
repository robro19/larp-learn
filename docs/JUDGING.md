# Judging guide

Larp Club is a tech roleplay game. The initial reward is the character and joke; real skills are earned by making and explaining decisions inside the story.

| Rubric | Evidence in the product |
| --- | --- |
| Working product | Three complete stories; real request lab; saved progress; XP without replay farming; successful receipt email delivery; live Render deployment. |
| Usefulness | Players scope an MVP, interpret HTTP/JSON, investigate an outage, reason about cache freshness, evaluate AI claims, and bound tool permissions. |
| Theme | Players begin as a comically underqualified founder, engineer, or AI visionary. Consequences and dialogue sustain the roleplay, including wrong turns. |
| Creativity | “Break character” hints, comic job titles, a co-conspirator mascot, and a debrief that reveals what was learned during the bit. |
| Ease of use | One obvious “Enter character” action; self-paced scenes; visible progress; understandable failures; saved completed scenes; responsive controls. |
| Demo | A short founder arc shows a joke becoming an actual server request and ending with an evidence-backed skills receipt. |

## Honest boundaries

- Story characters and companies are fictional. Titles and badges are playful practice acknowledgements.
- The request lab makes real HTTP calls but uses labelled sample snack data and a deliberate outage endpoint.
- Scores demonstrate guided exercise completion, not independent professional proficiency.
- Guest cloud saves belong to browser storage; clearing that storage loses the guest capability.
- No AI model is required for the core experience. Pitch variations are local templates.
- Sentry monitors unexpected app errors. Expected lab errors are learning content, not production incidents.
- Agentboxd sends only a fixed receipt requested through explicit user consent. The sender key is inbox-scoped, send-only, and stored in backend secrets.
