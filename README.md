# coffee-random

<img src="resources/showcase/typical-usage.gif" width="360px" height="640px" />

## What does it do?

It lets you rate each coffee you get from the coffee machine at my university.

## But why?

The rating functionality itself is not why I built this. This project was a
playground to gain experience using lots of animations in a web app.

## Constraints

My goal was to implement animations in a realistic context, but try even
technically challenging animations. These are the constraints I tried to stick
to:

- I must implement exactly the animations I want
  - Even if that takes an unreasonable amount of code
  - I'm not an animator - the animations won't necessarily look amazing in the
    end
- The app should have a realistically complicated style and UX
  - It doesn't have to be perfect - that's not the focus, I'm not a designer and
    this is not a public app
- Animations should be performant enough to deploy
  - Not perfect 60 FPS on low power phones, but not 10 FPS unoptimized
    animations either
- The app only needs to work on mobile
  - Since that is the only platform I will use it on in the real world
  - Since I wouldn't learn anything extra about animation by also targeting
    desktop

## Showcase

The animations in this app are all pretty different from a technical point of
view. Here's an overview of all of them, including what's special about
implementing each one.

### Machine

<img src="resources/showcase/machine-cropped.gif" width="360px" height="224px" />

The pair of animated coffee machines is the centerpiece of this app. It is split
into two react components in a fairly typical way:

One stateless component (`machine-pure.tsx`) handles layout and style. It takes
positions for all the doors, the cup, the position and length of the stream of
coffee, etc.

The other component (`machine.tsx`) is a large state machine, which generates
those inputs. The animation is structured in phases like pre-pour (door closing,
coffee stream starting), pour (coffee color changing), etc. It's possible
cleanly abort from any phase, and change the target brew head at any time. This
component also has to handle cup movement, since that is closely tied to pouring
coffee - for example you can't pour until the cup is in position.

The design is a stylized version of the real machines that my university has:

<img src="resources/showcase/real-machines.jpg" width="720px" />

### Morph

<img src="resources/showcase/morph-debug.gif" width="360px" height="640px" />

The morphing transition is the most technically difficult animation in this app,
for a few reasons:

- The machine layout uses both pixel and percentage sizes, and has fixed aspect
  ratio pieces
- Every piece of the machine and every label on the rating square moves on a
  unique path
- The paths of the rating labels depend on the dimensions and position of the
  machine, and vice-versa
- The machine has a significant amount of state and logic, but the rendered
  pieces have to be positioned together with the rating square
- The top and bottom parts of the page (title, buttons) have to cross-fade
  during the morph

It's a real challenge to minimize coupling between the machine and rating square
components and pages. I went through three iterations implementing this: no
animation, morphing only the background rectangle and cropping the content, and
animating every single piece. Each iteration required large structural changes
to the machine and rating square components.

In the final version, the transition is coordinated by `composite-page.tsx`. The
positions for everything are calculated in JS based on pixel measurements of the
window. This greatly simplifies combining pixel sizes, percentage sizes and
fixed aspect ratios.

Doing the calculations manually (instead of relying on browser layout
mechanisms) makes it much easier to smoothly animate pieces between two
structurally different layouts. For example, in the "machine" form there is a
larger space betwen the 2nd and 3rd brew head. In the "rating square" form, all
brew heads are evenly spaced. It would be very difficult to animate between
these two states if all the layout was done in CSS, since the required markup
would likely be structurally different.

By calculating all positions for both elements of the machine and rating square
centrally, these components are, of course, coupled. This coupling is almost
necessary though, since their animations depend on each-others layouts. The
structure I've built (see `placement-parent.tsx` and `placement.tsx`) allows
these two components to use this shared layout information cleanly, and prevents
any further coupling. I think the approach of sharing layout calculations
between components is the best possible solution here, but I would avoid it
unless a complex interconnected transition is really necessary.

### Login

<img src="resources/showcase/login.gif" width="360px" height="640px" />

The login screen doesn't have complicated animations. The fades on colors of the
inputs are done with plain CSS `transition`. I used `react-spring` in a typical
way here to transition past the login screen. The simple animations used here
are probably the sweet spot for typical applications, in terms of development
cost vs UX benifits.

### Button

<img src="resources/showcase/button-normal.gif" width="260px" height="220px" />
<img src="resources/showcase/button-debug.gif" width="260px" height="220px" />

The button uses my stylized version of a "material" look. The ripples originate
in a diagonal line, which intersects the touch point. There's no particular
hover effect, since this is intended for mobile.

Since the animation progress is controlled by the timestamps given by
`requestAnimationFrame`, saving the start time of an animation involes waiting
for that callback. Combined with the possibly asyncronous nature of React's
`setState` this caused quite a few bugs on fast consequtive touches. The code I
used to make the event handling stable is far from ideal. Using CSS `transition`
with `react-transition-group` (instead of controlling each frame directly) would
probably give a simpler implementation.

### Tick

<img src="resources/showcase/ticks.gif" width="360px" height="120px" />

The tick component is a fairly unique sort of loading spinner. It starts as bar,
which spins as many times as it needs before the "save rating" request is
completed. Once the request completes, the bar morphs into a tick on the next
turn. If the request fails, it morphs into a cross instead.

The difficulty here was getting the morph to look natural, and maintaining the
momentum of the bar. This would have been easier in real animation software than
the fully hard coded approach I used here. If you have more than one of this
sort of component, definitely consider using some system for importing
animations.
