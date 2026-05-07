Here are the updated session notes combining the previous document with this session's work:


> Session Notes — Paul Fillingham Context Brief
> For use at the start of the next Claude session alongside context-brief.md
> Updated end of session, April 2026.

---

## Documents Currently in Existence

- **context-brief.md** (formerly Abridged Brief — rename in BBEdit, version 1.4) — primary working document, in Obsidian
- **formation.md** — new companion document, three eulogies in full (Roy, Steve, Valerie). Store in GitHub: dreamtargets-studio/briefs/
- **Extended Brief 2.3** — original document, now significantly out of date, to be replaced by Extended Brief 3.0
- **thinkamigo-framework-spec.md** — design system and style guide, updated to v1.2 this session
- **Wikipedia Draft** — for review by Dr David Amos, James Walker or Natalie Braber. Needs updating with new material.
- **Gems.md** — ideas backlog in Obsidian. New gems from this session to add manually:
  - *The history of art could wait. The making of it couldn't.*
  - *The student who borrowed ideas becoming the technician who borrowed the Mac at weekends to teach himself the future.*
  - *The journalist was writing that email would never catch on. Paul was using it to correspond with the people who were building the future.*
  - *You had to be an evangelist to combat this kind of derision.*
  - *Platform thinking — the ability to conceive content, architecture and audience as a single unified system.*
  - *When Paul and Mike were in a room together, magic happened.*
  - *Roy gave the discipline. Valerie gave the welcome. The 108 Club combined both. So has every project since.*
  - *The kitchen table is where Thinkamigo actually lives.*
  - *Subtle, accessible, stylish — not three separate goals. One.*

---

## Thinkamigo Website — Work Completed This Session

- **People biog and amigo biog page templates** built and finalised
- **People grids** — `.people-intro-grid` and `.people-collab-grid` added to gallery.css section 7. Self-contained, no lightbox, pixel-perfect column alignment
- **Breadcrumb** — added to destination.css as `p.breadcrumb`. GDS underline hover pattern. Rule: second-level pages and deeper with no cinematic hero only
- **Links section** — properly classed in destination.css, inline styles removed from HTML
- **GDS underline hover** applied to both breadcrumb links and links-section links
- **Plate to Pixel migration** — first full WordPress-to-HTML proof of concept. PDF + web archive in, complete HTML and metadata out. Workflow proven
- **framework-spec.md and wiki** updated to reflect all people page additions

## Thinkamigo Website — Still To Do

- Sitemaps — HTML (for users) and XML (for Google)
- 404 page — with contact form reusing existing PHP handler
- robots.txt — excluding `/remembering/`, referencing sitemap
- .htaccess redirects — requires Screaming Frog crawl of WordPress site first, mapped in XLSX
- paulfillingham.com — point DNS from 123-reg to SiteGround
- thinkamigo.com — replace WordPress with single landing page
- `/remembering/` pages — migrate Roy, Steve and Valerie eulogies from dreamtargets.com
- Remaining WordPress content migration — page by page using PDF + web archive workflow
- Framework spec and wiki — breadcrumb and links-section not yet documented there

## Site Architecture Decisions Made

- **paulfillingham.com** — primary domain, full site
- **thinkamigo.com** — single landing page, not a redirect, Thinkamigo brand retained for commercial purposes
- **dreamtargets.com** — remains live. Eulogies migrate to `paulfillingham.com/remembering/`
- **`/remembering/`** — no nav, no Open Graph, excluded from robots.txt and XML sitemap
- All domains at 123-reg pointing to SiteGround directories — existing workflow, no new process needed

---

## Outstanding Work — Priority Order

### 1. Extended Brief 3.0
The major outstanding task. The context-brief.md is the skeleton — the Extended puts full detail on every section. Key sections requiring expansion beyond the brief:

- Full heritage practice — all five Mine2Minds projects in detail, MyTrail full specification, AHL five-year partnership, transatlantic projects
- Full broadcast and public record
- Complete technical architecture — CSS framework, design system rules, tools
- Commercial strategy — five year horizon, platform strategy, Substack content architecture, the heartbeat model
- The Enquire Within Substack provenance story in full
- Full Houdini Window synopsis and character notes
- Key credentials and awards in full
- Immediate next actions updated

### 2. Wikipedia Draft Update
The draft needs updating with material from this session:
- Fire and Rescue period — Charles and Diana, Certificate of Merit, forensic work, emergency exercises
- Sound on Sound cartoon strip — first UK Mac-created cartoon strip
- IPEX88 — £1.4 million in orders
- Raleigh CDi kiosks — IMRG white paper
- Raleigh Pioneer Gainsborough poster — London Underground
- Raleigh Activator TV campaign — subliminal five-second slots
- Boots Sunshop — twelve unit retail trial
- Cyberseat — world's first airline booking website
- Guy Kawasaki — TidBits, ClockWorker spoof
- John Warnock — PDF libraries featured in exhibition presentation
- DBRW — Cream Advertising Award, American Corporate Branding Award
- Stroke and recovery — Sillitoe Trail pitch with eye patch
- Alan Yentob connection — Arena 1978, Royal Festival Hall 2012
- DSA Young Drivers 2008 — first multi-platform social media campaign
- 108 Club — founding document of the Creative Framework

### 3. CV
Not yet started. To be built from the brief and Extended once 3.0 is complete. Key considerations:
- No date of birth
- Dates of employment imply age — handle carefully
- Lead with the Creative Framework and trajectory arc
- Credentials and awards section prominent
- Tone consistent with the brief — not a standard CV format

---

## Loose Threads — Career Narrative

### Headland Multimedia (1998–2010)
- Ecommerce Director
- Machine Mart online account — built annual revenue to £6.4M
- Ken Heptonstall as MD — had his ear
- Rufford Country Park and National Ceramics Centre (c.1999) — needs Headland context
- The dot com bubble — mentioned as a chapter to cover
- Sean Clark at Headland — sequence now documented in brief
- Broadway Cinema mobile-first booking website — needs Headland context confirmed

### Jigsaw Systems
- Roger Whittle as MD — Paul had his ear
- Not yet covered in detail — needs a session

### The Clarendon Network
- Chris Richards — Clarendon student, Fire and Rescue period, CHC graphics studio, ITV Way We Were
- Markie (Margaret) — American friend from Marin County, introduced Brautigan, now deceased
- Other Clarendon connections to surface

### Ramba Zamba
- Live performances 1988-89 — venues, specific gigs not yet documented
- Full successor to Smart Cookies story — what happened after the live performances?
- Connection to the Leeds Arts University show 2025 — how does this chapter close?

### Smart Cookies
- Full discography and performance record not in brief
- Gavin Butt's *No Machos or Pop Stars* citation — needs full reference
- *Still Undead* exhibition at Nottingham Contemporary (2019) — needs more detail

### Marcus Clarke
- Mansfield College of Art connection — not yet documented
- Full Jim Henson/Little Shop of Horrors credit — film details
- *The Puppetmaster* screenplay — 2010, garden shed recovery 2024
- Subsequent Thinkamigo projects with Marcus — what were they?
- Everest audiobook project — details needed

### Mike Breckon
- Byways — more detail on the organisation and Paul's involvement
- Tour de France Team Raleigh bulletins — any specific races or years notable?
- Everest audiobook — title, author, Paul's role at Thinkamigo
- Munich 1972 interview — LeftLion URL in brief, any other uses of the footage?

### Mike Conwill
- Broadway Cinema first meeting brokered by Lavanya Sivakumaran — now in brief
- Raleigh Interactive architecture mapped on Mike's kitchen table — now in brief
- DSA Young Drivers 2008 — now in brief
- StaffBay — now in brief
- Full account of CHC creative output — more campaigns to document?

### DSA Young Drivers 2008
- Ruth Disney — full details of her role and subsequent career
- Cartoon character names and social media profiles — any assets survive?
- Lavanya Sivakumaran — headhunted to London, full career trajectory?
- Campaign metrics — response rate, reach?

### Thomas Wass
- Paul's grandfather, amateur track cyclist 1930s
- Uncle Tommy Wass — Korean War, trauma, basis for Houdini Window chapter
- Connection to Raleigh thread — worth developing for Trees and Tides essay

### Forensic Photography
- Nottinghamshire Fire and Rescue darkroom work — specific cases or techniques worth noting?
- The trained eye thread — connection forward to UX research observation skills

---

## Loose Threads — Formation and Influences

### The 108 Club
- XPOhaas archive articles — recover and document fully
- Specific films made — titles, subjects, any footage survive?
- Other members beyond Steve Clay — who else was in the club?
- The briefcase — any photographs of it?

### Roy and Valerie Fillingham
- Roy's death July 2018 described as disruptive to project history — which projects affected and how?
- Steve Clay at Roy's funeral — last meeting before Steve's own death a year later
- Formation period 2018-2019 — unsettled but productive, needs documenting properly
- Hannah and Daisy — Paul's daughters from previous marriage, custody during early Headland years. Context for that period not yet in brief
- Clare — Paul's wife, present through the hardest years
- Gilbert — Paul's son, named notably outside the biblical sequence

### Arena BBC2 1978
- The Zenith-e camera and cassette recorder recordings — any of these survive?
- Specific Arena programmes that were formative beyond the Magritte episode?

### The Nottingham Art Scene
- Eduardo Paolozzi — met at the Tate, more detail
- Gilbert and George — met several times, any specific occasions?

---

## Loose Threads — Current Projects

### paulfillingham.com
- Domain acquired April 2026, parked at 123-reg
- Point to SiteGround as first step
- CSS skin application — destination.css on existing chassis
- Content architecture — what goes where?

### Houdini Window
- Tommy Wass Korean War chapter — to be shared in dedicated session
- Website integral to lore — not a standard author site
- Thinkamigo framework is the rehearsal for the Houdini Window platform

### Seaside Sci-fi
- Concept stage, with Adrian Reynolds
- Winter Gardens Morecambe as anchor venue
- Coastal tour — Morecambe, Skegness, Great Yarmouth
- Next steps not yet defined

### MyTrail Migration
- WordPress to hand-rolled HTML/CSS/JS
- Six trails across five sites
- North West territory — new trail opportunities

### Coaltime Days
- Publication by David Amos, design by Paul
- Status update needed

### TransAtlantic Rebel Counties
- Political situation monitoring
- What can still move forward despite US political climate?

---

## Wikipedia Draft — Action Points

- David Amos to review draft at next Mine2Minds meeting (agenda item confirmed)
- Third party submission required — David is qualified and willing candidate
- Draft needs updating before submission (see Outstanding Work above)
- Conflict of interest declaration required from David on submission

---

## Notes on Tone and Accuracy for Next Session

- Age: Paul was born 18 February 1961. Do not state age directly in documents
- Smart Cookies used MIDI from 1983 — not a BBC Micro workaround, a proper MIDI setup
- Sean Clark — first met at CHC, University of Derby research fellow, .Net columnist. Never visited CHC — remote relationship
- Two separate Raleigh advertising campaigns — Cerne Abbas Giant (print) and Activator Mountain Bike (TV). Not the same campaign
- Raleigh Interactive (CDi POS kiosks) is distinct from raleighbikes.com (website). Two separate projects
- Tim Clark — no 'e'. Former KRCS line manager, later Sales Director at Ameridata/GE
- Paintbox operator — not Quantel Paintbox operator
- Audio Visual technician at Clarendon — not video edit suite technician
- Silicon Spa — nickname for Leamington Spa the town, not for Symbiosis the company
- GDS established 2011, launched 2012 — do not reference GDS in pre-2012 context
- Four sons — Paul, Peter, Mark, Michael. Gilbert is Paul's son, Valerie's grandson
- formation.md is the companion document for Roy, Steve and Valerie — do not paste into every session, share selectively

---

*Updated April 2026. Store in Obsidian alongside context-brief.md.*
*Next session: paste context-brief.md and these session notes at the start.*
