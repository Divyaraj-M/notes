---
title: How to find edge cases before they become expensive issues
source: https://balsamiq.com/blog/uncovering-edge-cases/
author:
  - "[[Peldi Guilizzoni]]"
published: 2026-04-14
created: 2026-05-11
description: Level up your PM skills with real-world advice from the Good Product Club. Learn how seasoned product leaders uncover edge cases and protect the user experience.
tags:
  - clipping/balsamiq
related:
  - "[[Edge case Analysis]]"
  - "[[Edge case Analysis]]"
  - "[[Curious Geeks]]"
  - "[[Teardowns]]"
  - "[[First Principle thinking]]"
  - "[[Atomic Habits and deliberate practice applied to product management]]"
  - "[[Product thinking]]"
  - "[[Youtube video Framework]]"
  - "[[First-Principles Product Template]]"
  - "[[README]]"
  - "[[PRD Feature Name]]"
  - "[[Product thinking]]"
  - "[[user-story-prompt-template]]"
  - "[[README]]"
  - "[[README]]"
---
Teams spend most of their time designing the happy path, but that’s not where products break. The real trouble lives in the gaps—the moments nobody thought to plan for.

One person assumes the system remembers context. Another assumes it resets. A third believes the user never even gets to that screen. Those mismatched assumptions don’t show up in your designs. They show up once the thing is live and people start using it.

This piece is about catching those gaps earlier to [avoid rework later](https://balsamiq.com/blog/how-can-product-teams-balance-speed-with-clarity/). The strategies, the conversations, the low-fidelity thinking that helps you uncover edge cases before they turn into late-night fixes.

And yes—AI can help you explore ideas faster. But this part of the work? The [messy, human, assumption-surfacing](https://balsamiq.com/blog/translate-market-signals-into-product-decisions/) part? That still belongs to you and your team. This is the [thinking layer of product development](https://balsamiq.com/blog/ai-cant-replace-product-thinking/), and no model can replace it.

We asked the [Good Product Club](https://balsamiq.com/good-product-club/) (a group of builders just like you) to share the practical frameworks they use to stress-test their ideas. From pre-mortems to low-fidelity sketching, here’s how some of the best in the business uncover edge cases before they cause problems.

## Start with the flow, not the screen

Most teams jump straight into screens because they’re concrete. You can point at them. You can debate them. But edge cases rarely show up on a single screen—they show up in the moments between them.

Before the click. After the click. When the user does something you didn’t plan for.

That’s why the first step isn’t designing UI. It’s understanding the sequence of decisions a user makes and the states the system moves through.

Our CEO, , is all too familiar with the importance of planning ahead:

> "Edge cases show up when you start thinking beyond a single screen. So flows, states, and user intent: What happens before an action, what happens after, and what happens when a user does something you didn’t expect. The minute you walk through a product as a sequence of decisions instead of a set of designs, the gaps become more clear."

When you shift your way of thinking from “What does this look like?” to “What is happening here?”, you start to see the system's logic. This means [mapping the flow](https://balsamiq.com/blog/wireflows/) before you touch the UI, identifying what the system believes is true at each step, and questioning what triggered the current state.

By treating the journey as a path of choices rather than a gallery of images, the hidden risks start to surface.

A few practical ways to work this way:

- Map the flow before you sketch anything
- Write down what the system believes is true at each step
- Note what triggered the current state
- Ask what the system expects to happen next
- Walk the journey as a chain of decisions, not a stack of screens

When you design the flow first, the edge cases start showing up exactly where you need to address them— *early* in the process.

## Bring more people in the room

No single person can think like every user. Everyone on the team carries a different mental model of how the product works—and those models rarely match. Arielle summed it up:

> "Most edge cases aren't actually rare scenarios. They're often moments where different people on your team are holding different mental models of how something works."

That’s why you need more perspectives early. Engineers see systems. PMs see intent. Designers see flow. Support teams see failure. And operations teams? They see the real world in all its messy, unpredictable glory.

, Design Operations Consultant and Mentor, shared his approach:

> "I start by bringing the team together so we cover different perspectives. First, we map the simplest version of a journey or task — the critical path most people will follow — which gives us a solid foundation. I get the team to capture every assumption we’ve made. And I insist on using real data or content; if we can’t get it, that flags an organizational issue to solve rather than work around."

Arielle adds another tip:

> "Another underrated trick is to swap perspectives mid-flow. Have a PM explain the flow as a user. Have an engineer explain it as the system."

And sometimes, the fastest way to find gaps is to watch someone try to “do the thing.” , Product Owner & CEO at [Referral Rock](https://referralrock.com/), says:

> "A quick pressure test with an actual user trying to ‘do the thing’ or alternatively a service person who often helps users can often uncover obvious edge cases."

Communication gaps often masquerade as design flaws. Bringing in multiple perspectives early on ensures you surface the surprises *now* rather than discovering them after launch.

## Low-fidelity forces the uncomfortable questions

When something looks polished, people hesitate to question it. It feels finished. It feels approved. High-fidelity design accelerates that illusion.

[Low-fidelity](https://balsamiq.com/blog/low-fidelity-prototyping/) does the opposite. It invites critique. It makes the work feel safe to challenge because changing a wireframe is easier than changing an entire app. Arielle explains:

> "Low-fidelity is especially powerful here because it strips away the illusion of completeness. High-fidelity can make something look ‘done’ long before it's actually thought through."

James agrees:

> "Keeping things low fidelity helps too: rough work feels disposable, which invites people to challenge it more and surface blind spots earlier."

[Low-fidelity wireframes](https://balsamiq.com/blog/what-are-wireframes/) create the space for the uncomfortable—but necessary—questions:

- What if the data isn’t there yet?
- What state is the system in if this step fails?
- What if the user changes their mind halfway through?

Rough work gets the room aligned faster than something polished. It’s the perfect environment for uncovering edge cases.

## Break things on purpose

Once you’ve mapped the flow, your job is to try to break it. Not in a bad or pessimistic way, but because you’re being thorough. By shifting your mindset from “this is how it works” to "this is where it fails,” you can spot the gaps before your users experience them.

Arielle leans into this:

> "I like to deliberately remove constraints and see what breaks. What if the user skips this step? What if this happens out of order? What if the user retries? What if two things happen at once?"

James adds:

> "Sometimes it makes sense to start with the unhappy path, especially when working on risky journeys, complex systems, or in regulated industries."

And Gene Voskov, Chief Data Analytics at the [Massachusetts Department of Revenue](https://www.mass.gov/orgs/massachusetts-department-of-revenue), takes a wonderfully simple approach:

> "I start by understanding the user journey (happy path) and then I pretend I'm new to the process and just start doing everything opposite of the happy path."

Trying to break stuff is the best way to learn where your product bends—and where it snaps.

### Practical ways to break it before they do

Instead of hoping for the best, assume the happy path is a best-case scenario and start poking at the logic. As James puts it, you have to be intentional about testing the boundaries:

> "We deliberately try to break things: What happens for zero states? Extreme inputs like long text? Missing or wrong data? Conflicting permissions? Slow performance? Timeouts? Network or device limitations? Broken integrations? Users entering or abandoning mid-flow?"

However, a word of caution from Josh Ho: **don't get lost in the weeds.**

> "I try not to worry too much about edge cases more than one decision layer away from the main path as that can lead to overbuilding."

To help you find that balance, here’s a practical checklist of the usual suspects that often break a flow:

Design Checklist

## Wire for the edge cases,not just the happy path

7 scenarios to stress-test your wireframes before handoff.

Empty and zero states

What does the screen look like before any data exists? Check for empty lists, null search results, or fields with no values.

Extreme and unexpected inputs

Test for very long strings of text, special characters, and what happens when a user pastes content instead of typing it.

Out-of-order and skipped steps

What if the user skips a step entirely or arrives at a screen from an unexpected entry point?

Retries and repeated actions

Does the system break if a user submits a form twice or hits the back button mid-flow?

System and performance failures

Model the experience for slow connections, timeouts, or when an integration returns an error.

Permissions and roles

View the flow through the lens of a user with limited access. What happens if two users try to edit the same record simultaneously?

Mid-flow abandonment

If a user closes the tab and comes back later, where do they land? Does the system save their progress or force a restart?

## When solving 1 edge case turns into solving 3

Sometimes stress-testing a system uncovers more than the problem you set out to fix.

A great example comes from the world of EV charging. When charging networks explored what happens if a station loses internet connectivity, they added cameras as a fallback to identify vehicles and keep the session moving. That single solution ended up addressing two completely different issues they hadn’t originally planned for:

##### Incompatible vehicles

Cameras identified cars that couldn't actually charge but were still occupying a stall — freeing up access for drivers who needed it.

##### Parking misuse

Non-EV vehicles blocking charging bays — a growing frustration for EV drivers — became easier to detect and act on.

One edge case revealed two more—and the fix handled all three. That’s the value of thorough stress-testing.

## Build for the edges, not the center

If there’s one thing you take from this piece, it’s to stop treating edge cases as unique.

Edge cases are in the everyday moments where assumptions collide. When you catch them early, everything gets easier—your designs get clearer, your engineering gets smoother, and your users hit fewer dead ends.

This is the real work of product development: slowing down just enough to understand what’s happening between the screens, not just on them.

And this is exactly where low-fidelity shines. Start rough, get aligned, and make the thinking visible. [Balsamiq](https://balsamiq.com/) helps you do that. Sketch the flow, talk through the weird paths, and get everyone to the same “yes, build this” before anything gets too polished to question.

Great products don’t come from guessing the happy path. They come from understanding all the paths—and designing with them in mind.

If this kind of thinking is your jam, you’ll feel right at home in the [Good Product Club](https://balsamiq.com/good-product-club/). Bring your opinions, your questions, your stories—we’d love to have you in the mix!