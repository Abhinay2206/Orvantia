# Orvantia: design notes

The reference for anyone changing the site, so later work stays on one idea.

## Brief

- **Subject:** Orvantia, a small software and automation studio in Hyderabad.
- **Audience:** owners and managers of growing businesses that still run on diaries,
  spreadsheets and WhatsApp.
- **Job:** get them to start a project (the lead form), with FactoryFlow as the proof.
- **Constraint:** keep the palette below. Most visitors are on phones.

## Concept card

```
Idea:        Software that runs itself, shown rather than said: a keyboard types the promise,
             then the floor under it starts doing the work on its own.
Metaphor:    a workshop floor of modules where tasks route themselves, tile to tile.
Signature:   the keyboard shot. A real backlit board wakes in the dark, types "RUNS ITSELF"
             (each letter lifts off its key into the line), ignites, and the camera pulls back
             as the floor powers up; the typed words become the headline (match cut).
Emotion:     a quiet room, a machine waking up; then calm confidence.
Motion verb: press and settle. Keys travel down and spring back; modules lift and settle;
             things move on their own, never frantically.
Screenshot:  the overhead of the board, the typed keys lit lilac through their legends.
```

## System

**Palette (fixed by the owner)**

| Role | Hex |
|---|---|
| Ground | `#04040a` |
| Ink | `#f1f5f9` |
| Accent (light, type) | `#c4b5fd` lilac |
| Accent (system) | `#6366f1` indigo, `#a855f7` violet |
| Done / signal | `#22d3ee` cyan (a task lands) |

**Type:** Instrument Serif for display (italic lilac for the promise), Space Grotesk for body,
JetBrains Mono for labels, time and meta. All self-hosted.

**Shape:** modules are rounded squares (the floor, the page transition tiles); UI pills are
fully round.

**Motion:** one house curve (`orv`, cubic 0.16, 1, 0.3, 1) for GSAP and framer-motion alike.
Large things move slower than small ones. Scroll inside the keyboard shot is deliberately heavy.

## Continuity

- **Loader:** the wordmark rises out of masks while a counter runs, then lifts like a curtain
  into the keyboard shot (about 1.8 s plus the lift).
- **Hero:** the keyboard shot (above), then the typed words match-cut into the headline.
- **Between pages:** the floor of modules tiles in from the click point and clears outward on the
  next page (`PageCurtain`). Arriving on home this way skips the loader.

## Life at rest

The hero floor keeps working while nobody touches it: lit tasks route themselves tile to tile
and land with a cyan pulse. The cursor lamp and click ripples answer the visitor.

## Decisions on record

- **Custom cursor:** the owner chose the focus-reticle cursor; its dot sits exactly on the
  pointer and stands in for the native one on fine pointers. Touch devices use the native
  behaviour. This goes against the usual "native cursor visible" rule on purpose.
- **Sound** is opt-in only.
- **Reduced motion / no WebGL:** the hero is a static first screen with the headline in place;
  no keyboard shot, no smooth scroll.
