Summary — What A19 Is All About

Arewa19 Pyramid (A19) is a digital-first socio-political movement dedicated to redefining the future of Northern Nigeria through technology, civic education, and narrative transformation. It is a grassroots network of young innovators, creators, leaders, and reformers who believe that political progress in the North must begin with information power, digital literacy, and value-based leadership.

Born from the urgency to address the region’s declining civic participation, misinformation, and leadership vacuum, A19 harnesses the influence of social media, civic technology, and narrative engineering to build an informed, united, and visionary youth population. Through its digital platforms and community cells across all 19 Northern states, the movement trains, mobilizes, and empowers a new generation of Northern voices who are tech-savvy, politically conscious, and socially responsible.

A19 operates as a non-partisan, values-driven institution, using storytelling, data, and collaboration to shape policies, challenge stereotypes, and strengthen governance accountability. It connects local action to digital innovation — from civic education campaigns and political leadership academies to media labs, innovation hubs, and diaspora collaborations.

The ultimate goal of A19 is to create one million digital citizens and civic leaders who will rebuild Northern Nigeria into a peaceful, progressive, and globally competitive region — a North that leads with knowledge, speaks with one voice, and thrives through technology.

A19: Rewriting the Arewa Story — Digitally, Politically, and Powerfully.

## Registrations on the State Chapters map

`/state-chapters` shows one dot per registration, read from the Google Sheet the registration form writes to
(`pages/api/registrations.js`). The API returns only each registration's state, LGA and day, never names or contact
details, and caches the sheet for 30 seconds. The map checks for new registrations every 30 seconds and pulses new ones.

Setup:

1. Share the registrations sheet with the service account in `GOOGLE_SERVICE_ACCOUNT_EMAIL` (Viewer is enough).
2. Set `REGISTRATIONS_SHEET_ID` to the sheet's ID (the long part of its URL between `/d/` and `/edit`).
3. Optional: `REGISTRATIONS_SHEET_RANGE` for the tab (default: "Form Responses", else the first tab), and
   `REGISTRATIONS_STATE_COLUMN` / `REGISTRATIONS_LGA_COLUMN` / `REGISTRATIONS_TIME_COLUMN` (column letters) if the
   header row doesn't contain "State of Residence", "LGA" and "Timestamp".

Demo baseline: `MEMBER_BASELINE` in `pages/state-chapters.js` (currently 112,000 existing members) is added before
the form's registrations. Those members have no recorded location, so their dots are spread over the LGAs in proportion
to population and the page labels them as a demo estimate; set it to `0` to show only the form's registrations.

Answers are matched to the map's state and LGA names with tolerance for typos and common spellings
(`lib/matchPlace.js`). A registration with an unrecognised LGA is placed in its state; one outside the 19 northern
states is counted but not drawn. Dots are placed near the middle of the LGA, not at anyone's address.
