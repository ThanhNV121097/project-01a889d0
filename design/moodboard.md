# Bốn Chân — moodboard

A two-vet clinic on Trần Duy Hưng, Hà Nội. Dogs and cats only. What the owner
wants from a website is fewer telephone calls: an owner who books the right
twenty-minute slot by themselves, and a desk that can see the day without
paper. Everything below serves that.

## The sites learned from

**Cal.com** — the booking itself is the hero. A row states what is booked, how
long it takes and what it costs *before* the button; the picker is a plain
grid of times, not a widget pretending to be a calendar. Taken: the booking
panel as the first screen's main object, and the rule that a service row
always carries its duration and its price. Not taken: Cal Sans, the dark
sections, the logo wall.

**Linear** — hairline rules as the structural device instead of cards, and
tabular figures in every table so numbers line up down a column. Taken: the
hairline table language used for the services, the vaccination history and the
admin lists. Not taken: the dark ground, the glow, the gradient edges.

**Stripe** — the small-caps section label sitting in a left margin column
beside the content from 1024px up, and one accent used only on actions and
selection. Taken: both. Not taken: the three-colour gradient band.

**Land-book (featured: clinic and studio sites)** — a full-bleed photograph
band at the top cut by a panel of structured data overlapping up into it.
Taken: the hero band of two photographs with the booking panel lifted into it.
Not taken: the centred hero, the testimonial carousel.

**Awwwards winners, 2026 selections** — the reveal cadence: one short
fade-and-rise per section as it enters, 16px over 0.6s, and nothing else. No
pinning, no scrubbing, no smooth-scroll library. Taken exactly that.

## The direction — "The day on one screen"

The owner chose this of the three in `design/directions.md`.

Light, clinical, calm, and dense with facts: the first screen carries a band
of two clinic photographs with a white booking panel lifted 64px into it, and
in that panel the seven services with their durations and prices, and the two
vets with the days they work. Type is **Space Grotesk** for display (OFL) and
**Inter** for body, with tabular figures everywhere a number appears. The
scale is deliberately low — h1 40px, h2 24px — because the screen's job is to
hold seven services and two vets above the fold, not to shout. Palette:
ground `#EDF0F2`, surface `#FFFFFF`, ink `#0B1016`, ink-soft `#54616E`, accent
`#1F49E0`, accent-ink `#FFFFFF`, plus two states the brief demands — a warning
amber for an overdue vaccination and a quiet green for a confirmed booking.
Grid: a left margin column holding each section's label, content in the wide
column beside it; everything on one left edge, every figure right-aligned.
Pictures are documentary and used large — a hand on a dog, a puppy on a table,
an ear being looked into — never a stock smile. Motion: a 0.5s load settle on
the hero, a 16px fade-and-rise per section, hover that answers on a row. No
marquee, nothing pinned.

## Crit notes

- Round 1: the hero panel held only the services; the two vets and their days
  were below the fold, so an owner could not see that Dr Quân has no Thursday
  before choosing a day. The vets moved into the panel beside the services.
- Round 2: the account's pets were a card grid that left a hole at three
  items; they are full-width rows in the site's own table language instead.
- Pictures: the clinic has none of its own. Every photograph on the site is a
  licensed stand-in, listed in the pull request for the owner to replace.

## COMMITMENTS

- The home page opens with a full-bleed band of two clinic photographs running edge to edge of the viewport, and the white booking panel overlaps 64px up into it.
- Every service is a table row — name, duration, price — with a hairline between rows, and never a card in a three-card grid.
- Every section's small-caps label sits in a left margin column beside its content from 1024px up, not above it.
- Durations and prices are right-aligned tabular figures on every page, including the admin tables.
- Dr Quân's "No Thursdays" is an accent-outlined flag beside his name wherever he appears, and Thursday is visibly disabled in the booking day picker.
- The accent #1F49E0 appears only on a primary button, a selected day, slot, service or vet, a focus ring and the "today" marker — nowhere as decoration.
- An overdue vaccination is the row's own state — a left rule in the alert token with the word "Overdue" set in it — not a coloured dot beside normal text.
