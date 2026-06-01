
Template -  [[Feature-Lens]]
A framework for understanding a single feature of a product deeply enough to decide what to do about it. This document explains the thinking behind it, what each part is for, and how to run it end to end.

---

## What this is, and what it's for

Most feature write-ups stop at the surface. "It lets users export to CSV." "It's a notification toggle." That's a description, and a description doesn't help you decide anything — whether to invest in the feature, leave it alone, fix it, or cut it.

Feature Lens exists to push past the surface. It's a structured pass over one feature that surfaces the parts a description hides: the real problem underneath it, the rhythm of how it's used, the structural load it carries inside the product, and what would actually break if it disappeared. It ends in a verdict, not a paragraph.

It works on **one feature at a time**. Point it at "the export button" or "undo" or "the alias selector," not at a whole product or a competitor. If you have several features to look at, run them one after another, each as its own clean pass.

## Why a framework, instead of just describing the feature

A framework only earns its weight if it does something a plain description can't. This one is built around a single move that people get wrong constantly: **a feature and the problem it solves are not the same thing.** "Export to CSV" is the feature. "Get my data out before an audit without re-typing it" is the problem. You can ship the feature and still leave the problem half-solved.

Once you accept that gap, three more follow naturally:

- Usage numbers alone mislead you, because a feature used rarely-but-critically and one used constantly-but-casually look opposite on a chart but need completely different care.
- A feature is a node in a system, so its value partly comes from what depends on it, not just from itself.
- The cleanest way to measure what a feature is worth is to imagine deleting it and naming the damage.

The framework is just those four observations turned into four deliberate lenses, plus a way to converge them into a decision.

## The objectives

These are the things the framework is built to deliver. Each one earns its place — none is filler.

1. **Separate function from purpose.** Pull apart what the feature mechanically _does_ from the job the user _hires it for_. This is the first lens because everything downstream gets distorted if you conflate the two.
2. **Read the shape of demand, not just the volume.** Capture frequency _and_ what triggers it _and_ how many users it touches. That combination — not raw usage — tells you how much reliability, speed, and visibility to spend.
3. **Locate the feature in the product's structure.** Find whether it's load-bearing, merely enabling, or a removable leaf. You can't reason about a feature you can't place.
4. **Price the absence.** Run a clean counterfactual: delete it in your head and name exactly what degrades, for the user and for the business separately.
5. **End in a verdict.** A framework that only describes is a diary. This one has to converge on a posture — invest, maintain, fix, or cut.

## Before you start: name the core promise

One setup step makes or breaks the whole analysis. Write down the **product's core promise** in a single sentence — the one thing this product promises to do well. Everything in the structural and cost lenses gets measured against that promise, so if it's vague, the analysis will be vague too. Get this sharp before going further.

---

## The four lenses

Walk them in order. Each lens carries a sharp test — the question that challenges the easy answer. Use the test; it's where the real work happens.

### Lens 1 · Purpose — separate function from job

This lens splits the feature into three layers:

- **Does** — the literal, mechanical behaviour. What happens when you press the button.
- **Job** — the outcome the user actually wants. The reason they reached for it.
- **Before** — the workaround or pain that existed in the world without this feature.

The "before" is the one people skip, and it's the most revealing. If a feature has no believable "before" — no pain that predates it — you may be looking at a solution to an imaginary problem.

> **Sharp test:** Can you name a real pain that existed before this feature? If you can't, say so plainly. That's a finding, not a gap to paper over.

### Lens 2 · Demand shape — read the rhythm, not the volume

Raw usage hides the insight, so this lens captures three separate dimensions instead of one number:

- **Frequency** — where it sits on a scale from per-session → daily → weekly → occasional → once-in-a-lifetime.
- **Trigger** — _why_ the user reaches for it. Four kinds: self-initiated (they choose to), event-driven (something prompts them), scheduled (it recurs), or a **fallback** they only hit when something else has gone wrong. The trigger is the underrated dimension and usually the one that changes the conclusion.
- **Breadth** — does it touch every user, a segment, or a sliver?

The reason this matters: a feature used twice a year sounds disposable until you notice it's the thing people reach for during a crisis. Low frequency plus a high-stakes trigger doesn't mean low priority — it means insurance.

> **Sharp test:** If the feature is rare, is it triggered by a high-stakes moment? If so, treat it as insurance, not as low-priority.

### Lens 3 · System role — locate it in the structure

A feature doesn't float in space; it's wired into the product. This lens places it two ways.

First, against the core promise:

- **Core** — it directly delivers the promise.
- **Enabling** — it makes the core usable (auth, settings, search, onboarding). Not the promise itself, but the promise doesn't work without it.
- **Peripheral** — it extends or decorates the promise.

Then map **dependency direction**: what does this feature lean on to work, and what other features lean on _it_? A feature that lots of things depend on is load-bearing even if it looks small and dull. This is where the quietly critical features reveal themselves.

> **Sharp test:** If you pulled this node out, would other features wobble? If yes, it's load-bearing regardless of how minor it looks.

### Lens 4 · Cost of absence — price the deletion

The truest measure of a feature's value is what it costs to delete it. Imagine removing it entirely, then name what degrades — down **two separate tracks**, because they routinely diverge:

- **User track** — do they leave, work around it, or not even notice?
- **Business track** — what happens to revenue, retention, trust, or compliance?

Running both tracks catches the features that are loved but earn nothing, and the ones users merely tolerate but that quietly print money. The gap between the two tracks is often the most interesting thing the whole analysis produces.

> **Sharp test:** Does the feature's absence cause damage _beyond itself_? The strongest features fail this test loudly — pulling them out hurts things that look unrelated.

---

## The verdict

The four lenses converge into a decision through two axes:
 ![[Pasted image 20260601143957.png]]
- **Frequency** — from Lens 2.
- **Criticality to the product** — Lens 3 and Lens 4 combined (how load-bearing it is, plus how loud its absence would be).

Plot the feature into one of four postures:

||**Low criticality**|**High criticality**|
|---|---|---|
|**High frequency**|**Habit Surface** — felt constantly but not why people stay. Polish for delight; it shapes the texture of the experience.|**The Spine** — the daily-driver core. Optimize relentlessly; small wins here compound across every session.|
|**Low frequency**|**Cut Candidate** — rarely reached, little lost if gone. Justify it or remove it and reclaim the complexity.|**Safety Net** — rare, but must never fail. Invisible 364 days a year; bulletproof on the 365 th. This is insurance.|

The framework's discriminating power lives on the **off-diagonal** — the surprises. A feature that looks peripheral and rarely used can turn out to be a Safety Net once you've priced its absence. So before committing to the obvious placement, sanity-check it against Lens 4. The obvious quadrant is right most of the time; the value is in catching the times it isn't.

Close with a one-line **decision posture** — invest, maintain, fix, or cut — and the single most important reason for it.

## Running it end to end

1. Name the product's core promise in one sentence.
2. Run Lens 1 (Purpose), answering its sharp test before moving on.
3. Run Lens 2 (Demand shape), then Lens 3 (System role), then Lens 4 (Cost of absence) — each with its test.
4. Plot frequency × criticality into one of the four postures.
5. State the verdict: posture → decision → the one reason that matters most.

Four lenses in, one decision out.

---

## Worked example — Undo (Ctrl-Z)

This shows why the off-diagonal matters, using a feature everyone underrates.

- **Purpose.** _Does:_ reverses the last action. _Job:_ lets the user act without fear of permanent mistakes. _Before:_ people moved slowly, double-checked everything, or avoided risky actions altogether.
- **Demand shape.** _Frequency:_ occasional — you don't undo every action. _Trigger:_ fallback — you reach for it when something went wrong. _Breadth:_ nearly every user, eventually.
- **System role.** On the surface it looks peripheral. But the _fear it removes_ underwrites the user's willingness to try every other feature, which makes it quietly enabling.
- **Cost of absence.** _User:_ acts hesitantly everywhere; engagement drops across the whole product, not just on "undo." _Business:_ lower engagement, more support tickets, more destructive accidents.
- **Verdict.** **Safety Net → invest.** A surface reading says "minor, rarely used." The lens reclassifies it: undo's real job isn't reversing mistakes, it's removing the fear of acting — and that's load-bearing. This is exactly the kind of insight a plain feature description never surfaces.

---

## When not to use it

Feature Lens is for one feature at a time. It's the wrong tool for sizing a whole product, mapping a market, or comparing against a competitor — those need their own frameworks. If you find yourself widening the scope mid-analysis, stop and pick the single feature you actually care about, then run it cleanly.