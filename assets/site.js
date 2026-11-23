(() => {
/* ---------- multi-page setup ---------- */
const SITE_ROOT = document.documentElement.dataset.root || '';
const U = r => r === 'home' ? (SITE_ROOT || './') : SITE_ROOT + r + '/';
const SEC_HASH = {'.book': 'book', '[data-plans-sec]': 'plans', '[data-faqsec]': 'faq', '[data-web]': 'webinar', '.assess': 'assess', '.cform-wrap': 'message'};
const HASH_SEC = Object.fromEntries(Object.entries(SEC_HASH).map(([k, v]) => [v, k]));
for (const [id, put] of [['home-tpl', n => document.getElementById('page-home').appendChild(n)], ['intro-tpl', n => document.body.insertBefore(n, document.body.firstChild)]]) {
  const t = document.getElementById(id); if (t) { put(t.content); t.remove(); }
}
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;
const ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PLUS = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3v12M3 9h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const scrollToY = (y, immediate) => window.scrollTo({top: y, behavior: immediate || reduce ? 'auto' : 'smooth'});

/* ---------- content ---------- */
const ROUTES = {
  home: {title: "Integrity Screening & Compliance Software | IntegrityShield", desc: "Screen employees, vendors and providers for exclusions, sanctions, conflicts of interest and license issues, every night, in-house. Free plan available."},
  ses: {title: "Healthcare Sanctions & Exclusions Screening | IntegrityShield", desc: "Screen employees, vendors and providers against OIG LEIE, SAM.gov and state Medicaid exclusion lists every night. Run a free exclusion check now."},
  coi: {title: "Healthcare Conflict of Interest Software | IntegrityShield", desc: "Find hidden vendor-to-practitioner payments in CMS Open Payments data. Data-driven COI monitoring for Stark Law and Anti-Kickback compliance."},
  licensure: {title: "Licensure & Credential Management Software | IntegrityShield", desc: "Verify licenses and credentials at the primary source and get alerts on lapses, renewals and disciplinary actions. USA, Canada and Australia."},
  about: {title: "About IntegrityShield | Integrity Screening by SureShield", desc: "IntegrityShield is SureShield's screening platform for compliance teams, built by people with 20+ years in compliance software. Founded 2018, Atlanta."},
  team: {title: "IntegrityShield Leadership Team | SureShield", desc: "Meet the SureShield leaders behind IntegrityShield, with 20+ years of experience in healthcare compliance, information security and risk software."},
  tools: {title: "Free Healthcare Compliance & Security Tools | IntegrityShield", desc: "Free tools for healthcare compliance teams: exclusion checks, CMS Open Payments lookups and license checks, plus a free PHP2Shell scan and a hospital cyber risk report."},
  blog: {title: "Exclusion & COI Compliance Guides | IntegrityShield Blog", desc: "Practical guides for compliance officers on OIG, SAM and state Medicaid exclusion screening, CMS Open Payments, conflicts of interest and licensing."},
  contact: {title: "Contact IntegrityShield | Book a Screening Demo", desc: "Talk to IntegrityShield about exclusion, conflict of interest or license screening. Book a demo, join a live webinar or call 1-800-604-1354."},
  checkout: {title: 'Checkout | IntegrityShield', desc: 'Complete your IntegrityShield subscription: organization details, agreement and payment.'},
  faq: {title: "Exclusion, COI & License Screening FAQs | IntegrityShield", desc: "Answers on exclusion and sanctions screening, conflict of interest monitoring, license verification, data sources, setup, pricing and support."},
  privacy: {title: 'Privacy Policy | IntegrityShield', desc: 'How SureShield, Inc. handles personal information collected through the IntegrityShield website.'},
  terms: {title: 'Terms & Conditions | IntegrityShield', desc: 'Terms and conditions for using the IntegrityShield website and services from SureShield, Inc.'},
  cookies: {title: 'Cookie Policy | IntegrityShield', desc: 'The cookies the IntegrityShield website uses, why, and how to change your choices.'},
  accessibility: {title: 'Accessibility Statement | IntegrityShield', desc: "IntegrityShield's commitment to an accessible website, our conformance target and how to report a problem."},
  security: {title: 'Security & Trust | IntegrityShield', desc: 'How IntegrityShield protects your data: data handling, encryption, hosting, access controls and compliance.'},
  pricing: {title: "Exclusion, COI & License Screening Pricing | IntegrityShield", desc: "Transparent screening software pricing: a Free plan for up to 25 records, paid plans by record count, 20% off annual billing and 25% off bundles."}
};
const SOLS = ['ses', 'coi', 'licensure'];
const ICONS = {
  ses: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="8" r="3.5"/><path d="M3 20c.8-3.6 3.2-5.5 6-5.5s5.2 1.9 6 5.5"/><path d="m15 9 2 2 4-4"/></svg>',
  coi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="7" r="2.5"/><circle cx="18" cy="17" r="2.5"/><path d="M8.5 7h3a3 3 0 0 1 3 3v4a3 3 0 0 0 1 2"/></svg>',
  licensure: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.2"/><path d="M5.8 16c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M14.5 10h4M14.5 13h3"/></svg>'
};
const SVG = {
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.8 2.5 15.2 0 18M12 3c-2.5 2.8-2.5 15.2 0 18"/></svg>',
  left: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  right: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ok: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

const HOME_FAQ = [["What is IntegrityShield?","All-in-one software that continuously screens the records you are required to monitor, such as healthcare practitioners, employees, contractors, vendors and board members, for sanctions, exclusions, conflicts of interest and licensure issues, against official sources such as OIG, SAM, state Medicaid lists and CMS Open Payments, and keeps the audit trail for you."],["Which solutions are available?","IntegrityShield-HSES for healthcare sanctions and exclusions screening, IntegrityShield-COI for conflict of interest screening of your providers against your vendors, and IntegrityShield-LCM for live licensure and credential checks."],["Which lists do you screen against?","The same lists regulators and payors use: federal lists such as OIG LEIE, SAM.gov and the FDA debarment list, state Medicaid exclusion lists, and data sources such as CMS Open Payments."],["How often does screening run?","Every night, and again whenever a source list changes or you add or update a monitoring record."],["How does IntegrityShield keep false positives down?","Identity matching algorithms compare names with other identifiers, such as date of birth, address and NPI, and clear 90% of false positives so your team reviews only the identity matches that need attention."],["What happens when there is a match?","You get an instant alert, and the exception is routed to the right person through configurable workflows for each type of integrity check. Every decision is logged for your audit trail."],["Who in our organization uses it?","Compliance, HR and onboarding, professional staff credentialing, supply chain and procurement, contract management and finance, revenue cycle, and risk and legal teams, all from one platform."],["How long does setup take?","Under an hour from activation, not counting integrations."],["Can we stop outsourcing screening?","Yes. Teams bring screening in-house at a lower cost than outsourcing, with a full audit trail."],["How does pricing work?","Each solution has Free, Essential, Essential Plus, Essential PRO and Enterprise plans. Pay monthly or save 20% with annual billing, and save another 25% when you subscribe to two or more solutions."]];
const PRICING_FAQ = [
  ['What counts as a monitoring record?', 'One person or organization you monitor in one solution. Someone screened in both IntegrityShield-HSES and IntegrityShield-COI counts as one record in each.'],
  ['Can I change plans later?', 'Yes. Contact us and we’ll move you to the plan that fits.'],
  ['How much does annual billing save?', '20% compared with paying monthly.'],
  ['Can I buy more than one solution?', 'Yes. Subscribe to two or more solutions and get an extra 25% bundle discount, on top of the 20% annual billing savings.'],
  ['What does the Free plan include?', 'Up to 25 active monitoring records with Nightly Integrity Scans and email alerts. No credit card required.'],
  ['Which plan is the most cost-efficient?', 'Essential PRO. It includes every integration and capability, with the lowest price per monitoring record.']
];

const M = {
  ses: {
    name: 'IntegrityShield-HSES', short: 'HSES', title: 'Integrity Violations Screening Solution', crumb: "Healthcare Sanctions & Exclusions Screening Software", vis: 'sources', visTitle: 'Source sync · tonight',
    oneliner: "Continuous screening of healthcare providers, staff, contractors and vendors for exclusions, sanctions and other violations: OIG, SAM, FDA and state Medicaid lists, every night.",
    h1: 'Federal and state exclusion lists. Screened nightly. <span class="mark">At your command, in-house!</span>',
    lede: "Healthcare sanctions and exclusion screening that continuously checks your providers, staff, contractors and vendors against OIG, SAM, FDA and 47 state Medicaid exclusion lists from official government sources, matching on NPI, date of birth and address.",
    stats: [['100','+','Federal and state sources, checked nightly for updates'],['Instant','','Screening when you add or change a record'],['90','%','Less than outsourcing'],['440','k','Sanction and exclusion records checked against']],
    hTitle: 'Live in under an hour.', planH: 'Choose a subscription plan <span class="mark">that best suits you.</span>',
    steps: [["Load your workforce, vendors and providers", "Import employees, contractors, vendors and healthcare providers, or connect systems such as Workday and MD-Staff."], ["Nightly automated screenings", "Each record is checked against OIG LEIE, SAM.gov and state Medicaid exclusion lists, and again whenever a list changes."], ["Review only matches that need attention", "Identity matching on NPI, date of birth and address clears false positives, so you only see the possible matches that matter."], ["Manage true positives with configurable workflows", "Route each confirmed match to the right person, track it to closure and keep every decision for your next audit."]],
    featTitle: "Sanctions screening software features",
    features: ["OIG LEIE, SAM.gov, the FDA debarment list and 47 state Medicaid exclusion lists from official government sources", "Employees, contractors, vendors and healthcare providers screened in one place", "Nightly rescreening, plus a rescreen whenever a list updates", "Match scoring that clears 90% of false positives", "Audit trail and reports for every screening and management decision", "Integrations with Workday and MD-Staff, plus APIs for HR, credentialing, vendor and billing systems"],
    assess: 'ses',
    faqTitle: "Sanctions &amp; exclusion screening FAQs.",
    faq: [["What is sanctions and exclusion screening software?", "Software that checks employees, vendors and healthcare providers against government sanctions and exclusion lists, such as OIG LEIE, SAM.gov and state Medicaid exclusion lists, and flags matches for review. IntegrityShield-HSES does this every night, in-house."], ["Is IntegrityShield-HSES an all-in-one tool for employees, vendors and healthcare providers?", "Yes. One platform screens your workforce, contractors, vendors and healthcare providers against federal and state lists, including OIG LEIE, SAM.gov exclusions and state Medicaid exclusion lists."], ["Which official exclusion lists does it check?", "OIG LEIE, SAM.gov exclusions, the FDA debarment list, and state Medicaid exclusion and termination lists from official government sources, refreshed every night."], ["What should sanctions screening software include in 2026?", "Coverage of OIG, SAM and every state Medicaid list you are subject to; nightly rescreening; match scoring that clears false positives; an audit trail; and integrations with HR, credentialing and vendor systems. IntegrityShield-HSES includes each of these."], ["How quickly can we start?", "Most teams are live in under an hour from activation, not counting integrations."], ["Can we stop outsourcing?", "Yes. Run screening in-house for up to 90% less than outsourcing, based on our internal cost calculations, with an audit trail reviewers can follow."], ["Does it connect to our systems?", "Yes. Integrations include Workday and MD-Staff, and APIs connect to HR, credentialing, contract management and billing systems."], ["How does IntegrityShield-HSES reduce false positives?", "Identity matching compares names with NPI, date of birth and address, using identity data from sources such as NPPES and CMS, and clears 90% of false positives, so your team only reviews identity matches that need attention."], ["What happens when a true match is found?", "You get an instant alert, and the match is routed through a configurable workflow to the right reviewer. Every step and decision is logged for your audit trail."], ["Who should be screened?", "Employees, contractors, healthcare providers, vendors, board members and anyone else your compliance program requires you to monitor."], ["How often should we screen against the OIG exclusion list?", "OIG expects regular checks, and many organizations screen monthly. IntegrityShield-HSES screens every night and again whenever a list updates, so nothing waits for the next monthly run."], ["Is there a free option?", "Yes. You can run a free integrity violation screening check on this page, and the Free plan covers up to 25 active monitoring records."], ["What happens when a list updates or we add a record?", "Screening runs both ways, automatically. When a sanctions or exclusion source updates, your whole watchlist is rescreened, and when you add or change a record, that record is screened right away."], ["Can HR screen a candidate before hiring?", "Yes. Run an ad hoc check on a prospective employee in-house, in real time, so hiring is not held up waiting for an outside vendor."], ["Can it check medical bills before they go to payers?", "Yes. With a medical billing system integration, IntegrityShield-HSES checks the providers on a superbill in real time before it is submitted, which helps you avoid billing for excluded providers and the OIG audits and penalties that follow."], ["Can we see match results in our own systems?", "Yes. Connect your contract management system to see match results there, and connect your medical staff credentialing and privileging system for real-time checks on every medical service provider."], ["What dashboards and reports are included?", "Management dashboards and reporting templates show your screening activity, open matches and their resolution at a glance, ready to share with leadership or auditors."], ["How do we get started?", "Register and sign up, add your watchlist records, set up real-time alerts and notifications if you want them, and review screening matches from your dashboard."]]
  },
  coi: {
    name: 'IntegrityShield-COI', short: 'COI', title: 'Conflict of Interest Screening Solution', crumb: "Conflict of Interest Monitoring Software", vis: 'graph', visTitle: 'COI screening · CMS Open Payments',
    oneliner: "Detects and monitors hidden financial relationships between vendors and credentialed healthcare practitioners, using CMS Open Payments.",
    h1: 'See every vendor dollar that <span class="mark">reaches your practitioners.</span>',
    lede: "Data-driven conflict of interest screening that finds payments nobody disclosed, with no disclosure forms needed. Detect hidden financial relationships between your vendors and credentialed practitioners with CMS Open Payments data, before they become Stark Law or Anti-Kickback risk.",
    laws: ['Stark Law','Anti-Kickback Statute','Sunshine Act','False Claims Act','Civil Monetary Penalties Law','Federal COI statutes','HRSA COI policy'],
    stats: [['1.5','M','Healthcare practitioners screened for payments'],['3,200','+','Reporting entities (2013–2025)'],['99','%+','Reduction in time to identify suspect COI cases'],['75','%+','Reduction in administrative cost burden']],
    hTitle: 'From vendor list to audit-ready report.', planH: 'Select a subscription plan <span class="mark">that best suits your needs.</span>', bookH: 'Do you have 30 mins? <span class="mark">See our Conflict of Interest screening solution in action.</span>', bookP: 'We will walk you through a live demo of our solution.',
    steps: [["Add vendors and credentialed practitioners", "Import lists, or sync from vendor and credentialing systems such as MD-Staff."], ["Match against CMS Open Payments", "Vendor-physician financial relationships are matched automatically, and monitored as Open Payments data updates."], ["Work suspect cases", "A standardized worklist takes each hidden relationship from open to closed."], ["Report by law", "Export audit-ready reports for Stark Law, Anti-Kickback and more."]],
    featTitle: "Conflict of interest monitoring features",
    features: ["CMS Open Payments matching for vendors and credentialed practitioners", "Continuous monitoring of vendor-physician financial relationships as Open Payments data updates", "Every reported payment by amount, year and type", "Suspect-case worklist from open to closed", "Ad hoc checks before you sign a vendor or credential a practitioner", "Audit-ready reports for Stark Law, Anti-Kickback and the Sunshine Act"],
    assess: 'coi',
    faqTitle: "Conflict of interest monitoring FAQs.",
    faq: [["What is healthcare conflict of interest monitoring software?", "Software that detects and monitors financial relationships between your vendors and the healthcare practitioners you credential, so undisclosed conflicts surface before they become Stark Law or Anti-Kickback problems."], ["How does IntegrityShield-COI detect hidden financial relationships between vendors and practitioners?", "It matches your vendors and credentialed practitioners against CMS Open Payments and shows every reported payment between them, by amount, year and type."], ["What is CMS Open Payments?", "A federal database where drug and device makers report payments to physicians, certain practitioners and teaching hospitals."], ["Is IntegrityShield-COI an Open Payments compliance platform?", "Yes. It monitors Open Payments data as it updates, gives your team one worklist for suspect cases, and exports audit-ready reports by law."], ["What should a conflict of interest monitoring platform include in 2026?", "Matching of vendors and credentialed practitioners against CMS Open Payments, continuous monitoring as the data updates, a case worklist, ad hoc checks before you sign, and reports for Stark Law and Anti-Kickback. IntegrityShield-COI includes each of these."], ["Which laws does it support?", "Seven governing laws and policies: the Stark Law, the Anti-Kickback Statute, the Physician Payments Sunshine Act, the False Claims Act, the Civil Monetary Penalties Law, federal conflict of interest statutes and HRSA conflict of interest policy."], ["Do practitioners need to fill in disclosure forms?", "No. IntegrityShield-COI is data-driven: it matches your vendors and practitioners against CMS Open Payments, so it finds reported payments whether or not anyone disclosed them."], ["How current is the data?", "CMS publishes each year’s Open Payments data, usually around June, and it is in IntegrityShield-COI within 2 weeks."], ["Can I search for payments made or received?", "Yes. Search a practitioner, a vendor, or both, and see every reported payment between them in CMS Open Payments."], ["How much data does IntegrityShield-COI cover?", "More than 1.5 million healthcare practitioners screened for payments, and 3,200+ reporting entities in CMS Open Payments data from 2013 to 2025. Each year’s new data is in the product within 2 weeks of CMS publishing it."], ["How much time and cost does it save?", "Customers see a 99%+ reduction in the time to identify suspect conflict of interest cases and a 75%+ reduction in their administrative cost burden."], ["Who uses conflict of interest screening?", "Compliance, medical staff, credentialing, supply chain and contract management teams that need to know about financial relationships before they sign or credential."], ["Can we check someone before signing?", "Yes. Run an ad hoc check on any vendor or practitioner before you engage them."], ["How is it priced?", "Plans are sized by the number of practitioners and vendors you track. See the plans above."], ["What do we need to set up?", "Your supply chain vendor and practitioner watchlists. Add them in the application, or connect your contract management and credentialing systems so the watchlists stay up to date automatically."], ["Is COI screening automatic?", "Yes, fully. Your watchlists are rescreened whenever you add or change a record and whenever CMS Open Payments data updates, with no manual searches."], ["Can we set our own COI rules?", "Yes. The criteria and rules that decide what counts as a suspect conflict of interest case can be configured for your organization before they are used for screening."], ["What do we get from each screening?", "COI risk summaries, real-time risk profiles in a central compliance dashboard, and a worklist of suspect cases, each with the payments behind it."], ["How does it help with audits and investigations?", "It keeps detailed records of every financial relationship and every investigation, from first alert to closure and follow-up, and produces audit-ready reports for regulatory surveys and enforcement reviews, organized by governing law."], ["Does it help with research integrity?", "Yes. It surfaces payments linked to industry-sponsored studies, so you can check that financial relationships do not bias research or care decisions."], ["How do we get started?", "Onboard with guided step-by-step wizards, let screening run automatically, work suspect cases through a standardized worklist, and monitor and report from your dashboard."]]
  },
  licensure: {
    name: 'IntegrityShield-LCM', short: 'LCM', title: 'Licensure & Credential Management Solution', crumb: 'Licensure & Credential Management Software', vis: 'lic', visTitle: 'License monitor · placeholder',
    oneliner: 'Live licensure and credential checks with automated primary source verification, plus alerts before anything lapses.',
    h1: 'Every license &amp; credential verified. <span class="mark">Every renewal &amp; disciplinary action tracked.</span>',
    lede: 'Licensure and credentialing monitoring is an integral part of medical staff operations. IntegrityShield-LCM verifies licenses and board certifications at the primary source and rechecks them every week for status changes, expirations and disciplinary actions.',
    stats: [['80','+','Licensing boards and regulators in the USA, Canada and Australia'],['Weekly','','Rechecks for status changes and disciplinary actions'],['Before expiry','','Automated reminders before a license lapses'],['90','%','Less than outsourcing']],
    featTitle: 'What IntegrityShield-LCM includes', features: ['Primary sources in the USA, Canada and Australia: 69 US state licensing boards and agencies, Nursys, ABMS and AOA board certifications, and Canadian and Australian regulators', 'Automated primary source verification of licenses and credentials', 'Continuous monitoring, with every license rechecked weekly for status changes', 'Expiration tracking, with automated verification and reminders as a renewal date approaches', 'Disciplinary action monitoring, with weekly alerts', 'Integrations with credentialing and HR systems such as MD-Staff and Workday', 'Configurable workflows and a full audit trail'],
    hTitle: 'End-to-end licensure and credential monitoring.', assess: 'licensure', scanCta: true, bookH: 'See licensure and credential management in action. <span class="mark">Schedule a 30-minute demo today.</span>',
    steps: [['Digitally onboard staff','Bring practitioners and staff into the platform digitally, with the licenses and credentials they hold.'],['Establish your credentialed providers','Build a verified roster of credentialed providers for your medical staff.'],['Continuous licensure verification and validation checks','Licenses and credentials are verified at the source and rechecked every week for status changes and disciplinary actions.'],['Alerts and notifications to mitigate risk and enforce patient safety','Weekly alerts tell you when a license lapses, changes status or carries a disciplinary action, and reminders arrive before renewals are due.'],['Configurable workflows to act on issues identified','Route every issue to the right person and track it to resolution, with a full audit trail.']],
    faq: [
      ['What does IntegrityShield-LCM do?', 'It verifies and continuously monitors the licenses and credentials of your practitioners and staff, checks their status and disciplinary actions, and alerts you before anything lapses.'],
      ['What is primary source verification (PSV)?', 'Confirming a license or credential directly with the issuing source, such as a state licensing board. IntegrityShield-LCM automates these checks and keeps the documentation.'],
      ['Which countries does it cover?', 'The USA, Canada and Australia: 69 US state licensing boards and agencies, 5 Canadian regulators, and Ahpra across all 8 Australian states and territories. New sources are added continuously.'],
      ['Which sources does it check?', 'State licensing boards for medicine, nursing, social work, behavioral health, podiatry and other professions, Nursys and Nursys e-Notify for nurse licensure, and ABMS and AOA board certifications. The full list is on this page.'],
      ['Does it check for disciplinary actions?', 'Yes. Along with license status and expiration, it checks every week for disciplinary actions and alerts you when one appears.'],
      ['How quickly will I hear about a change?', 'Licenses are rechecked weekly, so status changes and disciplinary actions reach you within a week. Expiration reminders arrive before a renewal is due.'],
      ['Who uses it?', 'Medical Staff Offices, credentialing teams, HR and compliance teams responsible for licensed practitioners and staff.'],
      ['Will it work with HSES and COI?', 'Yes. All three IntegrityShield solutions share one platform, so a practitioner can be screened for exclusions, conflicts of interest and licensure in one place.'],
      ['How is it priced?', 'See the plans above, or contact us for a quote.']
    ]
  }
};

const ANNUAL_OFF = .2;
const TIERS = [
  {k: 'free', n: 'Free', m: 0, free: true, cap: 'Up to 25', rec: 'Up to 25 active monitoring records', blurb: 'Try continuous monitoring at no cost.'},
  {k: 'basic', n: 'Essential', m: 199, cap: 'Up to 100', rec: 'Up to 100 active monitoring records', blurb: 'For small teams getting started.'},
  {k: 'plus', n: 'Essential Plus', m: 449, pop: true, cap: 'Up to 250', rec: 'Up to 250 active monitoring records', blurb: 'For growing compliance programs.'},
  {k: 'max', n: 'Essential PRO', m: 799, eff: true, cap: 'Up to 750', rec: 'Up to 750 active monitoring records', blurb: 'Lowest cost per record, with third-party and one-way integrations.'},
  {k: 'ent', n: 'Enterprise', cap: 'Unlimited', rec: 'Unlimited records', blurb: 'For complex or high-volume needs.'}
];
/* monthly list prices (USD) set by Tom, 2026-11-16: Essential, Essential Plus, Essential PRO */
const PRICES = {ses: [89.99, 199.99, 489.99], licensure: [99.99, 249.99, 529.99], coi: [59.99, 149.99, 449.99]};
const tiersFor = sol => TIERS.map(t => ({...t, m: {basic: PRICES[sol][0], plus: PRICES[sol][1], max: PRICES[sol][2]}[t.k] ?? t.m}));
const PLANS = {
  ses: {cover: 'OIG, SAM and state Medicaid exclusion lists', tiers: tiersFor('ses')},
  coi: {cover: 'CMS Open Payments matching for practitioners and vendors', tiers: tiersFor('coi')},
  licensure: {cover: 'License and credential verification at the source', tiers: tiersFor('licensure')}
};

const SOURCES = [{"n": "OIG LEIE", "k": "fed"}, {"n": "Medi-Cal Suspended & Ineligible Provider List", "k": "state"}, {"n": "SAM.gov Exclusions", "k": "fed"}, {"n": "Texas HHSC-OIG Exclusions", "k": "state"}, {"n": "CMS Open Payments", "k": "data"}, {"n": "New York OMIG Exclusion List", "k": "state"}, {"n": "FDA Debarment List", "k": "fed"}, {"n": "Pennsylvania Medicheck List", "k": "state"}, {"n": "NPPES NPI Registry", "k": "data"}, {"n": "Ohio Medicaid Exclusion & Suspension List", "k": "state"}, {"n": "Illinois HFS-OIG Sanctions", "k": "state"}, {"n": "Georgia OIG Exclusions List", "k": "state"}, {"n": "Michigan Sanctioned Provider List", "k": "state"}, {"n": "North Carolina Medicaid Excluded Providers", "k": "state"}, {"n": "TennCare Terminated Provider List", "k": "state"}, {"n": "Washington HCA Termination & Exclusion List", "k": "state"}, {"n": "New Jersey Consolidated Debarment Report", "k": "state"}, {"n": "MassHealth Suspended & Excluded Providers", "k": "state"}, {"n": "Kentucky Medicaid Terminated & Excluded Providers", "k": "state"}, {"n": "Louisiana Adverse Actions List", "k": "state"}, {"n": "Florida AHCA Sanctioned Providers", "k": "state"}, {"n": "National Sex Offender Public Website", "k": "fed"}, {"n": "Nursys", "k": "data"}, {"n": "Arizona Board of Nursing – Nurse Imposters", "k": "state"}, {"n": "Ohio Abuser Registry", "k": "state"}];

/* ---------- product visuals ---------- */
const VIS = {
  sources() {
    const rows = [['OIG LEIE','Federal'],['SAM.gov Exclusions','Federal'],['FDA Debarment','Federal'],['Texas HHSC-OIG','State'],['New York OMIG','State'],['Ohio Medicaid','State']];
    const t = ['02:11','02:12','02:12','02:13','02:13','02:14'];
    return `<div class="vis" data-anim="sources"><div class="vhead"><span>Source sync · tonight</span><span class="chip res">All lists synced</span></div><ul class="srcl">${rows.map((r,i)=>`<li><span class="dt"></span><b>${r[0]}</b><em>${r[1]}</em><time data-t="${t[i]} ET">${t[i]} ET</time></li>`).join('')}</ul><span class="note">Sample data</span></div>`;
  },
  graph() {
    const V = [['Acme Ortho',62],['Globex Bio',132],['Initech Surgical',202],['Example Imaging',272]];
    const P = [['Dr. J. Example','Orthopedics',52],['Dr. K. Doe','Cardiology',112],['Dr. S. Sample','Orthopedics',172],['Dr. M. Test','Neurology',232],['Dr. T. Roe','Radiology',292]];
    const L = [[0,2,0],[1,1,0],[2,3,0],[3,4,0],[1,3,0],[2,2,0],[0,0,1]];
    const path = (a,b) => `M174 ${a} C 250 ${a}, 256 ${b}, 330 ${b}`;
    let s = `<svg viewBox="0 0 520 330" role="img" aria-label="Payments between vendors and practitioners, one flagged"><text class="hd" x="18" y="18">Vendors</text><text class="hd" x="334" y="18">Practitioners</text>`;
    L.forEach(([v,p,h]) => { s += `<path class="${h?'hot':''}" d="${path(V[v][1],P[p][2])}"/>`; });
    V.forEach(([n,y],i) => { s += `<rect class="vx ${i===0?'hotbox':''}" x="16" y="${y-18}" width="158" height="36" rx="8"/><text x="30" y="${y+5}">${n}</text>`; });
    P.forEach(([n,sp,y],i) => { s += `<rect class="px ${i===0?'hotbox':''}" x="330" y="${y-22}" width="176" height="44" rx="8"/><text x="344" y="${y-2}">${n}</text><text class="sub" x="344" y="${y+14}">${sp}</text>`; });
    s += `</svg>`;
    return `<div class="vis graph"><div class="vhead"><span>7 relationships found</span><span class="chip match">1 suspect case</span></div>${s}<div class="callout"><span class="chip match">Review</span><b>Acme Ortho paid Dr. J. Example $48,200 in consulting fees (2023)</b></div><span class="note">Sample data</span></div>`;
  },
  lic() {
    const rows = [['A. Collins','RN','GA','Mar 31, 2027','Active'],['P. Natarajan','MD','TX','Oct 29, 2026','Expiring'],['O. Reyes','PT','FL','Aug 15, 2027','Active'],['L. Whitman','APRN','NC','Sep 30, 2026','Expired'],['I. Calloway','LCSW','GA','Jan 12, 2028','Active']];
    const chip = {Active: 'res', Expiring: 'acc', Expired: 'match'};
    return `<div class="vis" data-anim="assets"><div class="vhead"><span>License monitor</span><span class="chip acc">Placeholder data</span></div><div class="atbl"><table><thead><tr><th>Name</th><th>License</th><th class="hide-s">State</th><th class="hide-s">Expires</th><th>Status</th></tr></thead><tbody>${rows.map(r=>`<tr class="${r[4]==='Expired'?'bad':''}"><td>${r[0]}</td><td class="m">${r[1]}</td><td class="m hide-s">${r[2]}</td><td class="m hide-s">${r[3]}</td><td><span class="chip ${chip[r[4]]}">${r[4]}</span></td></tr>`).join('')}</tbody></table></div></div>`;
  }
};
const MV = {
  ex() {
    const w = [64,48,72,56,40,68];
    return `<div class="mv-top"><span>Physicians</span><span>1,284 records</span></div><ul class="exl">${w.map((x,i)=>`<li class="${i===3?'hitrow':''}"><span class="av"></span><span class="sk" style="--w:${x}%"></span><span class="st">${i===3?'Match · OIG LEIE':'Clear'}</span></li>`).join('')}</ul>`;
  },
  coi() {
    const V = [['Acme Ortho',50],['Globex Bio',130],['Initech Surgical',210]];
    const P = [['Dr. J. Example',50],['Dr. K. Doe',130],['Dr. S. Sample',210]];
    const L = [[1,1,0],[2,1,0],[1,2,0],[2,2,0],[0,0,1]];
    let s = `<svg viewBox="0 0 460 260" role="img" aria-label="One vendor payment to a practitioner flagged">`;
    L.forEach(([v,p,h]) => { const a = V[v][1], b = P[p][1]; s += `<path class="${h?'hot':''}" d="M160 ${a} C 230 ${a}, 230 ${b}, 300 ${b}"/>`; });
    V.forEach(([n,y],i) => { s += `<rect class="${i===0?'hot':''}" x="4" y="${y-20}" width="156" height="40" rx="10"/><text x="20" y="${y+5}">${n}</text>`; });
    P.forEach(([n,y],i) => { s += `<rect class="${i===0?'hot':''}" x="300" y="${y-20}" width="156" height="40" rx="10"/><text x="316" y="${y+5}">${n}</text>`; });
    return s + `<text class="amt" x="230" y="36" text-anchor="middle">$48,200</text></svg>`;
  },
  lic() {
    const rows = [['Active',''],['Active',''],['Expires in 21 days','warn'],['Active',''],['Expired','hitrow'],['Active','']];
    const w = [60,46,70,52,42,64];
    return `<div class="mv-top"><span>Licensed staff</span><span>Placeholder data</span></div><ul class="exl">${rows.map(([t,c],i)=>`<li class="${c}"><span class="av"></span><span class="sk" style="--w:${w[i]}%"></span><span class="st">${t}</span></li>`).join('')}</ul>`;
  }
};

/* ---------- render ---------- */
function todoStatsHTML() {
  return `<div class="band" style="margin-top:clamp(56px,7vw,88px)"><div class="wrap stats" data-reveal>${[1, 2, 3, 4].map(i => `<div class="stat"><b>—</b><span><span class="rv">[Content needed: Licensure stat ${i}]</span></span></div>`).join('')}</div></div>`;
}
function statsHTML(stats) {
  return `<div class="band" style="margin-top:clamp(56px,7vw,88px)"><div class="wrap stats" data-reveal>${stats.map(([n,suf,l],i) => {
    const num = parseFloat(n.replace(/,/g,'')), dec = n.includes('.') ? 1 : 0, sep = n.includes(',') ? 1 : 0;
    if (!/^[\d.,]+$/.test(n)) return `<div class="stat"><b class="tx${i===2?' acc':''}">${n}${suf}</b><span>${l}</span></div>`;
    return `<div class="stat"><b${i===2?' class="acc"':''}><span data-count="${num}" data-dec="${dec}" data-sep="${sep}">${n}</span>${suf}</b><span>${l}</span></div>`;
  }).join('')}</div></div>`;
}
const FAQ_MAX = 7;
function faqSplit(items) {
  if (items.length <= FAQ_MAX) return items.join('');
  const n = items.length - FAQ_MAX;
  return items.slice(0, FAQ_MAX).join('') + `<div class="faq-more" hidden>${items.slice(FAQ_MAX).join('')}</div><button type="button" class="btn ghost sm faq-more-btn" aria-expanded="false" data-more="${n}">More questions (${n})</button>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('.faq-more-btn'); if (!b) return;
  const box = b.previousElementSibling, open = box.hidden;
  box.hidden = !open; b.setAttribute('aria-expanded', open ? 'true' : 'false');
  b.textContent = open ? 'Fewer questions' : `More questions (${b.dataset.more})`;
  if (open) { const f = box.querySelector('summary'); if (f) f.focus(); }
});
function faqHTML(list, title = 'Your questions answered.') {
  return `<div class="wrap faq-grid"><div style="display:grid;gap:12px;align-content:start" data-reveal><h2>${title}</h2><p class="lede" style="font-size:16px">Or call <span class="sel">1-800-604-1354</span>.</p></div><div class="faq-list" data-reveal>${faqSplit(list.map(([q,a])=>`<details><summary>${q}${PLUS}</summary><p>${a}</p></details>`))}</div></div>`;
}
function flowHTML(steps) {
  return `<ol class="flow">${steps.map(([t,b]) => `<li><div><b>${t}</b><p>${b}</p></div></li>`).join('')}</ol>`;
}
/* ---------- free checks: result faces and report request ---------- */
const FACE = {
  ok: '<svg class="face ok" viewBox="0 0 32 32" aria-label="No match" role="img"><circle cx="16" cy="16" r="15"/><circle class="e" cx="11" cy="13" r="2"/><circle class="e" cx="21" cy="13" r="2"/><path d="M9.5 19c1.6 2.6 3.9 3.9 6.5 3.9s4.9-1.3 6.5-3.9"/></svg>',
  maybe: '<svg class="face maybe" viewBox="0 0 32 32" aria-label="Possible match" role="img"><circle cx="16" cy="16" r="15"/><circle class="e" cx="11" cy="13" r="2"/><circle class="e" cx="21" cy="13" r="2"/><path d="M10 23c1.6-2.4 3.6-3.6 6-3.6s4.4 1.2 6 3.6"/></svg>'
};
const REPORT_LBL = {ses: 'View Screening Log Report', coi: 'View Payment Report', licensure: 'View Licensure Scan Report'};
function reportCTA(k) {
  return '';   // free assessments come without a report
  return `<div class="rep-cta"><button type="button" class="btn primary sm" data-report="${k}">${REPORT_LBL[k]}</button></div>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-report]');
  if (!b) return;
  const k = b.dataset.report, box = b.closest('.rep-cta'), id = 'rp' + Math.random().toString(36).slice(2, 7);
  box.innerHTML = `<form class="rep-form" novalidate><p class="rep-h">Where should we send the ${({coi: 'payment', licensure: 'licensure scan'})[k] || 'screening log'} report?</p>
    <div class="rep-row"><label for="${id}n">Full name<input id="${id}n" name="name" autocomplete="name"></label><label for="${id}e">Work email<input id="${id}e" name="email" type="email" autocomplete="email"></label></div>
    <label for="${id}o">Organization <span class="opt">(optional)</span><input id="${id}o" name="org" autocomplete="organization"></label>
    <p class="err" hidden></p><button class="btn primary sm" type="submit">${REPORT_LBL[k]}</button><p class="rep-demo">Demo: nothing is sent.</p></form>`;
  const i = box.querySelector('input'); if (i) i.focus({preventScroll: true});
});
document.addEventListener('submit', e => {
  const f = e.target.closest('.rep-form');
  if (!f) return;
  e.preventDefault();
  const err = f.querySelector('.err'), n = f.elements.name.value.trim(), m = f.elements.email.value.trim();
  if (!n) { err.textContent = 'Add your name.'; err.hidden = false; f.elements.name.focus(); return; }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)) { err.textContent = 'Add a work email.'; err.hidden = false; f.elements.email.focus(); return; }
  repDone(f, n, m);
});
async function repDone(f, n, m) {
  const box = f.parentElement, a = f.closest('.assess'), kf = a && a.querySelector('form[data-assess]');
  const kind = kf ? kf.dataset.assess : '', live = (kind === 'licensure' || kind === 'ses') && kf.dataset.live !== undefined && scanApi();
  if (!live) { box.innerHTML = `<p class="rep-done">${FACE.ok}<span><b>Report requested.</b> In the live product it is emailed to ${clean(m)}. This demo sends nothing.</span></p>`; return; }
  const btn = f.querySelector('button[type=submit]'); if (btn) { btn.disabled = true; btn.textContent = 'One moment…'; }
  const url = kind === 'licensure' ? LIC.lastReport : null;
  try { await licCall('/lead', {kind, name: n, email: m, org: f.elements.org ? f.elements.org.value.trim() : '', ref: url || '', website: ''}); } catch (x) {}
  box.innerHTML = url
    ? `<p class="rep-done">${FACE.ok}<span><b>Your report is ready.</b> <a href="${licEsc(url)}" target="_blank" rel="noopener">Download the licensure scan report (PDF)</a>. It includes the board’s records as captured during the scan.</span></p>`
    : `<p class="rep-done">${FACE.ok}<span><b>Thanks, ${licEsc(n.split(' ')[0])}.</b> Our team will send the full report to ${licEsc(m)}.</span></p>`;
}

/* ---------- one-time licensure scan (demo data until the platform API is connected) ---------- */
const LIC_TYPES = [['Physician (MD/DO)', 'medical board'], ['Registered nurse (RN)', 'board of nursing'], ['Nurse practitioner (NP)', 'board of nursing'], ['Physician assistant (PA)', 'medical board'], ['Pharmacist', 'board of pharmacy'], ['Physical therapist', 'physical therapy board'], ['Dentist', 'dental board'], ['Other licensed professional', 'licensing board']];
const LIC_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
function licRows(rows) {
  return `<dl class="lic-rows">${rows.map(([k, v, cls]) => `<div${cls ? ` class="${cls}"` : ''}><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
}
function scanApi() { return 'https://script.google.com/macros/s/AKfycbxAC-4_d7JG7mNCH3vRrbg6LwOnkEEjbTadT8QNTaDIpVchN8pZZRfdY2zliSab5xEw/exec'; }
function turnstileSiteKey() { return '6LdjiRsuAAAAAIBdpgz_2bP_bBNXQpsu3HUNI_Sq'; }
/* solution videos: set src (and poster, length) when a video is ready; until then a placeholder shows */
const SOL_VIDEO = {
  ses: {src: 'assets/integrityshield-hses.mp4', poster: 'assets/integrityshield-hses-poster.jpg', vtt: 'assets/integrityshield-hses.en.vtt', len: '0:37', name: 'IntegrityShield-HSES', sub: 'See how IntegrityShield-HSES screens employees, vendors and providers against official exclusion and sanctions lists.'},
  coi: {src: 'assets/integrityshield-coi.mp4', poster: 'assets/integrityshield-coi-poster.jpg', vtt: 'assets/integrityshield-coi.en.vtt', len: '0:21', name: 'IntegrityShield-COI', sub: 'See how IntegrityShield-COI finds hidden financial relationships between your vendors and practitioners.'},
  licensure: {src: 'assets/integrityshield-lcm.mp4', poster: 'assets/integrityshield-lcm-poster.jpg', vtt: 'assets/integrityshield-lcm.en.vtt', len: '0:18', name: 'IntegrityShield-LCM', sub: 'See how IntegrityShield-LCM verifies licenses at the source and tracks every renewal and disciplinary action.'}
};
function solVideoHTML(k) {
  const v = SOL_VIDEO[k];
  if (!v) return '';
  const head = `<div class="svid-head"><span class="bar">Product video</span><h3>Watch ${v.name} in action</h3></div>`;
  const vr = u => /^(data:|https?:|\/)/.test(u) ? u : (document.documentElement.dataset.root || '') + u;   // pages live in sub-folders
  if (v.src) return `<div class="svid" data-reveal>${head}<div class="svid-card svid-v"><video preload="none" playsinline src="${vr(v.src)}"${v.poster ? ` poster="${vr(v.poster)}"` : ''} aria-label="${v.name} overview video">${v.vtt ? `<track kind="subtitles" srclang="en" label="English" src="${vr(v.vtt)}">` : ''}</video>
      ${v.vtt ? `<button type="button" class="svid-cc" aria-pressed="false" aria-label="Subtitles" title="Subtitles"><svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true"><rect x="1" y="1" width="20" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><text x="11" y="11.3" text-anchor="middle" font-size="7.5" font-weight="700" font-family="system-ui,sans-serif" fill="currentColor">CC</text></svg></button>` : ''}
      <button type="button" class="svid-hit" aria-label="Play the ${v.name} video${v.len ? ` (${v.len})` : ''}"><span class="svid-play"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="#fff"/></svg></span><span class="vplay-lbl" aria-hidden="true">See ${v.name.replace('IntegrityShield-', '')} in action${v.len ? ` · ${v.len}` : ''}</span></button></div></div>`;
  return `<div class="svid" data-reveal>${head}<div class="svid-card" role="img" aria-label="${v.name} overview video, coming soon">
      <span class="svid-tag">Overview video</span>
      <div class="svid-c"><span class="svid-play"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="#fff"/></svg></span>
        <b>Coming soon</b><span>${v.sub}</span></div>
      <div class="svid-bar" aria-hidden="true"><span>0:00</span><i></i><span>${v.len || '1:30'}</span></div>
    </div></div>`;
}
/* solution videos: click the play button to start; native controls while playing; the button comes back at the end */
document.addEventListener('click', e => {
  const b = e.target.closest('.svid-hit'); if (!b) return;
  const card = b.closest('.svid-v'), v = card.querySelector('video');
  document.querySelectorAll('.svid-v.on video').forEach(o => { if (o !== v) o.pause(); });
  card.classList.add('on'); v.controls = true; v.play().catch(() => {});
});
document.addEventListener('ended', e => {
  const card = e.target.closest && e.target.closest('.svid-v'); if (!card) return;
  card.classList.remove('on'); e.target.controls = false; e.target.load(); svidCC(card);
}, true);
/* subtitles: the CC button switches the video's English track on and off (the choice is kept for the other videos too) */
let ccOn = false;
function svidCC(card) {
  const v = card.querySelector('video'), b = card.querySelector('.svid-cc');
  for (const t of v.textTracks) t.mode = ccOn ? 'showing' : 'hidden';
  if (b) { b.setAttribute('aria-pressed', ccOn ? 'true' : 'false'); b.classList.toggle('on', ccOn); }
}
document.addEventListener('click', e => {
  const b = e.target.closest('.svid-cc'); if (!b) return;
  ccOn = !ccOn; document.querySelectorAll('.svid-v, #filmCard').forEach(svidCC);
});
// the native player's own captions menu changes the track too: keep the CC button in step
document.addEventListener('play', e => { const card = e.target.closest && e.target.closest('.svid-v, #filmCard'); if (card) svidCC(card); }, true);
function assessHTML(k) {
  if (k === 'licensure' && scanApi()) return licLiveFormHTML();
  if (k === 'ses' && scanApi()) return sesLiveFormHTML();
  if (k === 'licensure') return `<div class="console assess lic-scan" data-reveal>
      <div class="assess-top"><span class="bar">Free licensure assessment</span><h3>Verify a license at the source</h3><p>Check a practitioner’s license at the source: status, expiration date and disciplinary actions. No account needed.</p></div>
      <form data-assess="licensure" novalidate>
        <label for="lic-q">Practitioner name<input id="lic-q" name="q" placeholder="e.g. Dr. Jane Example" autocomplete="off"></label>
        <div class="af-row"><label for="lic-type">License type<select id="lic-type" name="ltype">${LIC_TYPES.map(([v]) => `<option>${v}</option>`).join('')}</select></label><label for="lic-state">State<select id="lic-state" name="state"><option value="">Select a state</option>${LIC_STATES.map(s => `<option>${s}</option>`).join('')}</select></label></div>
        <div class="af-row"><label for="lic-no"><span>License number <em class="opt">(optional)</em></span><input id="lic-no" name="lno" autocomplete="off" inputmode="text"></label><label for="lic-npi"><span>NPI <em class="opt">(optional)</em></span><input id="lic-npi" name="npi" autocomplete="off" inputmode="numeric" maxlength="10"></label></div>
        <div class="lic-ts" data-lic-ts></div>
        <button class="btn primary" type="submit">Run licensure scan</button>
      </form>
      <div class="ck-out" aria-live="polite"><div class="ck-head">${FACE.ok}<b>Dr. J. Example</b><span class="chip res">Active, no actions found</span></div><div class="ck-res">${licRows([['License', 'Physician (MD/DO) · Georgia'], ['Status', 'Active'], ['Expires', 'Dec 31, 2027'], ['Disciplinary actions', 'None found'], ['Verified with', 'State licensing board']])}<span class="note">Example result. Try a name.</span>${reportCTA('licensure')}</div></div>
    </div>`;
  if (k === 'ses') return `<div class="console assess" data-reveal>
      <div class="assess-top"><span class="bar">Free exclusion assessment</span><h3>Screen a name against the exclusion lists</h3><p>Search any person or business across all screening data sources. No account needed.</p></div>
      <form data-assess="ses" novalidate>
        <label for="ses-q">Name or business<input id="ses-q" name="q" placeholder="e.g. Jordan Ellis" autocomplete="off"></label>
        <div class="af-row"><label for="ses-type">Record type<select id="ses-type" name="type"><option>Individual</option><option>Business</option></select></label><label for="ses-state">State<select id="ses-state" name="state"><option>All states</option><option>Florida</option><option>Georgia</option><option>New York</option><option>Ohio</option><option>Texas</option></select></label></div>
        <button class="btn primary" type="submit">Search Now</button>
      </form>
      <div class="ck-out" aria-live="polite"><div class="ck-head">${FACE.ok}<b>Jordan Ellis</b><span class="chip res">No match found</span></div><div class="ck-res"><span>Checked against all screening data sources, including OIG LEIE, SAM.gov and state Medicaid lists.</span><span class="note">Example result. Try a name.</span>${reportCTA('ses')}</div></div>
    </div>`;
  return `<div class="console assess" data-reveal>
      <div class="assess-top"><span class="bar">Free payments assessment</span><h3>Look up a practitioner’s industry payments</h3><p>See whether a practitioner has reported industry payments in CMS Open Payments.</p></div>
      <form data-assess="coi" novalidate>
        <div class="af-row"><label for="coi-q">Practitioner name<input id="coi-q" name="q" placeholder="e.g. Dr. Jane Example" autocomplete="off"></label><label for="coi-v">Vendor name<input id="coi-v" name="vendor" placeholder="e.g. Acme Ortho" autocomplete="off"></label></div>
        <button class="btn primary" type="submit">Search for payments made or received</button>
      </form>
      <div class="ck-out" aria-live="polite"><div class="ck-head"><b>Dr. J. Example</b><span class="chip match">3 payments found</span></div><div class="ck-res"><span><strong>$48,200</strong> in reported payments. Largest payer: <strong>Acme Ortho</strong>.</span><span class="note">Example result. Try a name.</span>${reportCTA('coi')}</div></div>
    </div>`;
}
const SRC_LISTS = {"ses": {"title": "Sources IntegrityShield-HSES screens against.", "lede": "Official federal and state lists, kept current from the sources that publish them.", "groups": [["Federal lists", ["OIG List of Excluded Individuals/Entities (LEIE)", "SAM.gov Exclusions (System for Award Management)", "FDA Debarment List and Disqualified/Totally Restricted List for Clinical Investigators", "Dru Sjodin National Sex Offender Public Website"]], ["State Medicaid exclusion lists (47 lists, 43 states and DC)", ["Alabama: Alabama Medicaid Suspended Providers", "Alaska: Alaska Department of Health and Social Services Excluded Provider List", "Arizona: Arizona Health Care Cost Containment System (AHCCCS) Excluded Providers", "Arizona: Arizona State Exclusion List", "Arkansas: Arkansas Department of Human Services Excluded Provider List", "California: California Department of Health Care Services Suspended and Ineligible Provider List", "Colorado: Colorado Department of Health Care Policy and Financing", "Connecticut: Connecticut Department of Social Services Administrative Actions List", "District of Columbia: District of Columbia Excluded Parties List (Firms)", "District of Columbia: District of Columbia Excluded Parties List (Individuals)", "Delaware: Delaware Listing of Sanctioned Providers", "Florida: Florida Agency for Health Care Administration Medicaid Sanctioned Providers", "Georgia: Georgia Office of Inspector General Exclusions List", "Hawaii: Hawaii Med-QUEST Excluded Providers", "Idaho: Idaho Department of Health and Welfare Medicaid Exclusion List", "Illinois: Illinois Healthcare and Family Services Office of Inspector General Provider Sanctions", "Indiana: Indiana Termination of Provider Participation in Medicaid and CHIP", "Iowa: Iowa Medicaid Program Integrity", "Kansas: Kansas Department of Health and Environment Terminated Provider List", "Kentucky: Kentucky Cabinet for Health and Family Services Medicaid Terminated and Excluded Provider List", "Louisiana: Louisiana Department of Health Adverse Actions List", "Maine: Maine Department of Health and Human Services MaineCare Excluded Providers", "Maryland: Maryland Department of Health Medicaid Providers and Other Entities Sanctioned List", "Massachusetts: MassHealth List of Suspended or Excluded Providers", "Michigan: Michigan Department of Health and Human Services List of Sanctioned Providers", "Minnesota: Minnesota Department of Human Services Excluded Provider List (Firms)", "Minnesota: Minnesota Department of Human Services Excluded Provider List (Individuals)", "Mississippi: Mississippi Division of Medicaid Sanctioned Provider List", "Missouri: Missouri Department of Social Services Medicaid List of Terminated Providers", "Montana: Montana Department of Public Health and Human Services Excluded or Terminated Medicaid Enrollment", "Nebraska: Nebraska Department of Health and Human Services", "Nevada: Nevada Department of Health and Human Services Excluded/Sanctioned Providers", "New Hampshire: New Hampshire Department of Health and Human Services", "New Jersey: New Jersey Office of the State Comptroller Consolidated Debarment Report", "New York: New York Office of the Medicaid Inspector General List of Exclusions", "North Carolina: North Carolina Health and Human Services State Excluded Provider List", "North Dakota: North Dakota Department of Human Services Provider Exclusion List", "Ohio: Ohio Department of Medicaid Provider Exclusion and Suspension List", "Oregon: Oregon Health Authority", "Pennsylvania: Pennsylvania Department of Human Services Medicheck Precluded Providers List", "South Carolina: South Carolina Department of Health and Human Services Excluded Providers List", "Tennessee: TennCare Terminated Providers List", "Texas: Texas Health and Human Services Commission Office of the Inspector General Exclusions", "Vermont: Vermont Medicaid Portal", "Washington: Washington Health Care Authority Provider Termination and Exclusion List", "West Virginia: West Virginia Medicaid Provider Sanctioned/Exclusion List", "Wyoming: Wyoming Department of Health Provider Exclusion List"]], ["State registries", ["Ohio Department of Developmental Disabilities Online Abuser Registry", "Ohio Department of Rehabilitation and Correction (parole violators)", "Arizona Board of Nursing – Nurse Imposters", "Georgia Board of Nursing – Nurse Imposters", "Texas Board of Nursing – Nurse Imposters"]], ["Identity data used to confirm matches", ["NPPES (National Plan and Provider Enumeration System)", "CMS provider data"]]]}, "licensure": {"title": "Sources IntegrityShield-LCM verifies against.", "lede": "Primary sources in the USA, Canada and Australia, rechecked every week. New sources are added continuously.", "groups": [["National sources", ["Nursys and Nursys e-Notify (nurse licensure)", "ABMS and AOA board certifications"]], ["US state licensing boards and agencies (69)", ["Louisiana State Board of Social Work Examiners", "North Dakota Board of Medicine", "Florida Department of Health", "Arkansas State Medical Board", "Nebraska Department of Health and Human Services", "Texas Medical Board", "E-Licensing Ohio Professional Licensure", "Missouri Division of Professional Registration", "New Hampshire Office of Professional Licensure and Certification", "Georgia Composite Medical Board", "New York State Physician Profile", "Massachusetts Board of Registration in Medicine", "Alaska Corporations, Business and Professional Licensing", "Massachusetts Executive Office of Health and Human Services", "Delaware Division of Professional Regulation", "Alabama State Board of Social Work Examiners", "California Department of Consumer Affairs", "South Carolina Department of Labor, Licensing and Regulation", "Oklahoma State Board of Medical Licensure and Supervision", "Arizona Board of Behavioral Health Examiners", "South Dakota Board of Medical and Osteopathic Examiners", "Alabama Board of Medical Examiners and Medical Licensure Commission", "Rhode Island Department of Health", "Arizona Board of Medical Examiners", "Kansas State Board of Healing Arts", "West Virginia Board of Medicine", "Utah Division of Professional Licensing", "Pennsylvania Licensing System", "Minnesota Board of Medical Practice", "North Carolina Medical Board", "Virginia Department of Health Professions", "Oregon Medical Board", "Washington State Department of Health", "Kansas Behavioral Sciences Regulatory Board", "New Jersey Division of Consumer Affairs", "Iowa Board of Medicine", "West Virginia Board of Social Work", "New Mexico Board", "New Mexico Medical Board", "Arizona Medical Board", "Maryland Department of Health", "Illinois Department of Financial and Professional Regulation", "North Carolina Social Work Certification and Licensure Board", "Kentucky Board of Social Work", "Nevada Board of Examiners for Social Workers", "Arizona State Board of Podiatry Examiners", "Oregon Board of Licensed Social Workers", "Tennessee Department of Health", "Montana Department of Labor and Industry", "Maryland Board of Social Work Examiners", "Idaho Division of Occupational and Professional Licenses", "South Dakota Board of Social Work Examiners", "Kentucky Board of Medical Licensure", "Wisconsin Department of Safety and Professional Services", "Mississippi Board of Examiners for Social Workers and Marriage and Family Therapists", "Maine Regulatory Licensing and Permitting", "Nevada State Board of Medical Examiners", "Michigan Department of Licensing and Regulatory Affairs", "Hawaii DCCA Professional and Vocational Licensing", "Texas Board of Nursing", "State of Connecticut", "Arizona State Board of Nursing", "Wyoming Board of Medicine", "Colorado Division of Professions and Occupations", "Vermont Department of Health", "Mississippi State Board of Medical Licensure", "Ohio Department of Health Nurse Aide Registry", "Oklahoma State Board of Licensed Social Workers", "Indiana Professional Licensing Agency"]], ["Canada (5 regulators)", ["Ontario College of Social Workers and Social Service Workers", "College of Physicians and Surgeons of British Columbia", "Collège des médecins du Québec", "College of Physicians and Surgeons of Ontario", "College of Physicians and Surgeons of Manitoba"]], ["Australia", ["Ahpra: Australian Capital Territory", "Ahpra: New South Wales", "Ahpra: Northern Territory", "Ahpra: Queensland", "Ahpra: South Australia", "Ahpra: Tasmania", "Ahpra: Victoria", "Ahpra: Western Australia"]]]}};
function sourcesHTML(k) {
  const d = SRC_LISTS[k]; if (!d) return '';
  return `<section class="sec src-sec" style="padding-top:0" data-reveal><div class="wrap"><span class="bar">Data sources</span><h2>${d.title}</h2><p class="lede">${d.lede}</p>
    <div class="src-groups">${d.groups.map(([t, list], i) => `<details class="src-g"${i === 0 ? ' open' : ''}><summary><b>${t}</b><span class="src-n">${list.length}</span>${PLUS}</summary><ul class="src-ul">${list.map(x => `<li>${x}</li>`).join('')}</ul></details>`).join('')}</div>
  </div></section>`;
}
function limitsHTML(k) {
  const L = k === 'ses' ? {
    cov: ['Federal lists: OIG LEIE, SAM.gov exclusions, the FDA debarment list and the national sex offender registry', '47 state Medicaid exclusion lists from 43 states and DC, plus state abuse registries and nurse imposter lists', 'Identity data from sources such as NPPES and CMS, used to confirm matches'],
    lim: ['A name match is a possible match, not a confirmed identity: matches need review before you act.', 'Results are only as current and complete as the lists their publishers release.', 'Lists that are not in the source list on this page are not screened.']
  } : {
    cov: ['CMS Open Payments: payments and transfers of value reported by drug and medical device manufacturers and group purchasing organizations to covered recipients'],
    lim: ['Open Payments covers only reporting manufacturers and group purchasing organizations, not every vendor you work with.', 'CMS publishes each program year’s data the following year (usually around June), so recent payments appear later. New data is in IntegrityShield-COI within 2 weeks of publication.', 'Matches between your vendors and practitioners need review before you act.']
  };
  return `<section class="sec limits" data-reveal><div class="wrap"><span class="bar">Data sources and limitations</span><h2>What’s covered, and what isn’t.</h2>
    <div class="lim-grid"><div><h3>Covered</h3><ul class="checks">${L.cov.map(x => `<li>${x}</li>`).join('')}</ul></div><div><h3>Limitations</h3><ul class="checks">${L.lim.map(x => `<li>${x}</li>`).join('')}</ul></div></div></div></section>`;
}
function bookHTML(k) {
  const d = M[k];
  return `<section class="sec book" data-book><div class="wrap">
    <div class="book-head" data-reveal><span class="bar">Book a demo</span><h2>${d.bookH || `See <span class="nw">${d.name}</span> <span class="mark">in 30 minutes.</span>`}</h2><p class="lede">${d.bookP || 'Pick a day and time. We’ll walk through it using your own use case.'}</p></div>
    <div class="cal" data-cal data-product="${k}" data-reveal>
      <aside class="cal-info">
        <div class="cal-host"><i>SS</i><span>SureShield team</span></div>
        <h3>${d.name} demo</h3>
        <ul class="cal-meta"><li>${SVG.clock}<span>30 minutes</span></li><li>${SVG.video}<span>Video call, link sent after booking</span></li><li>${SVG.globe}<span class="tzname">Your local time</span></li></ul>
        <p class="cal-pick" hidden></p>
      </aside>
      <div class="cal-main">
        <div class="cal-step pick" data-step="pick">
          <div>
            <p class="cal-title">Select a date and time</p>
            <div class="cal-nav"><button type="button" data-prev aria-label="Previous month">${SVG.left}</button><b class="cal-mtitle"></b><button type="button" data-next aria-label="Next month">${SVG.right}</button></div>
            <div class="cal-grid cal-days"></div>
            <p class="tz">${SVG.globe}Times shown in your local time (<span class="tzname">local</span>)</p>
          </div>
          <div class="cal-times"><h4 class="cal-dlabel"></h4><div class="slots"></div></div>
        </div>
        <form class="cal-step cal-form" data-step="form" novalidate hidden>
          <button type="button" class="cal-back" data-back>${SVG.left} Back</button>
          <p class="cal-title" style="margin:0">Enter your details</p>
          <div class="two"><label for="${k}-bk-name">Full name<input id="${k}-bk-name" name="name" autocomplete="name"></label><label for="${k}-bk-email">Work email<input id="${k}-bk-email" name="email" type="email" autocomplete="email"></label></div>
          <label for="${k}-bk-org">Organization<input id="${k}-bk-org" name="org" autocomplete="organization"></label>
          <input class="hp" name="ish_trap_x" tabindex="-1" autocomplete="off" readonly data-lpignore="true" data-1p-ignore aria-hidden="true">
          <label for="${k}-bk-note">What would you like to see? (optional)<textarea id="${k}-bk-note" name="note" rows="3"></textarea></label>
          <p class="err" hidden></p>
          <div class="cal-qs" data-cal-qs></div>
          ${nlBox()}${consentBox()}
          <button class="btn primary" type="submit">Schedule demo</button>
          <p class="note" data-demo-note>Demo form. Nothing is sent.</p>
        </form>
        <div class="cal-step cal-done" data-step="done" hidden>
          <span class="ok">${SVG.ok}</span>
          <h3>Your demo is scheduled</h3>
          <p data-when></p>
          <p class="note" data-done-note>A calendar invite would go to <b data-who></b>. In this demo, nothing was sent.</p>
          <button class="btn ghost sm" type="button" data-again>Book another time</button>
        </div>
      </div>
    </div>
  </div></section>`;
}
function pricingSecHTML(k) {
  const d = M[k];
  return `<section class="sec" data-plans-sec><div class="wrap">
    <div class="sec-head" data-reveal><div style="display:grid;gap:12px"><span class="bar">Pricing</span><h2>${d.planH || `Choose your <span class="mark">${d.short} plan.</span>`}</h2></div><p class="lede">Pay monthly, save 20% when you pay annually, and save another 25% when you bundle two or more solutions.</p></div>
    <div class="plans" data-plans data-mode="page" data-sol="${k}"></div>
    <p class="note" style="margin-top:16px"><a class="mlink" style="font-size:13px" href="#pricing" data-pr="${k}">Compare all solutions</a></p>
  </div></section>`;
}
function renderModule(k) {
  const d = M[k];
  return `
  <section class="wrap mhero">
    <div class="mcopy">
      <nav class="crumb" aria-label="Breadcrumb"><a href="#home">IntegrityShield</a><span>/</span><span>${d.crumb}</span>${d.placeholder ? '<span class="chip acc">Placeholder content</span>' : ''}</nav>
      <h1><span class="m-title">${({ses: 'Healthcare Sanctions &amp; Exclusions Screening Software', coi: 'Healthcare Conflict of Interest Monitoring Software', licensure: 'Licensure &amp; Credential Management Software'})[k] || d.title}</span>${d.h1}</h1>
      <p class="lede">${d.lede}</p>
      <div class="cta-row"><button class="btn primary" data-go="demo">Book a demo</button>${d.scanCta ? '<button class="btn ghost" data-go="assess">Try a free assessment</button>' : '<button class="btn ghost" data-go="plans">See pricing</button>'}</div>
      ${d.laws ? `<div class="laws">${d.laws.map(l=>`<span>${l}</span>`).join('')}</div>` : ''}
    </div>
    <div class="mvis" data-s3="${({ses: 'sieve', coi: 'web', licensure: 'vgrid'})[k]}" role="img" aria-label="${({ses: 'Index cards fall through printed exclusion lists; clean ones land in Clear, one stops on OIG LEIE as a match', coi: 'Vendors and practitioners joined by payment lines; one $48,200 payment rises as an undisclosed relationship', licensure: 'A verification grid for one practitioner: five record types (state medical license, nursing license, board certification, social work license, counselor license) pass three checks: found at source, status validated and disciplinary check. One record is due for renewal and one has a disciplinary action'})[k]}"></div>
  </section>
  ${d.stats ? statsHTML(d.stats) : d.statsTodo ? todoStatsHTML() : ''}
  <section class="sec"><div class="wrap hiw${d.assess ? '' : ' solo'}">
    <div class="hiw-copy" data-reveal><span class="bar">How it works</span><h2>${d.hTitle}</h2>${flowHTML(d.steps)}${d.features ? `<h3 class="feat-h">${d.featTitle}</h3><ul class="checks feat">${d.features.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}</div>
    <div class="hiw-side">${d.assess ? assessHTML(d.assess) : ''}${solVideoHTML(k)}</div>
  </div></section>
  ${k !== 'licensure' ? limitsHTML(k) : ''}${sourcesHTML(k)}
  ${bookHTML(k)}
  ${pricingSecHTML(k)}
  <section class="sec" style="padding-top:0" data-faqsec>${faqHTML(d.faq, d.faqTitle || `${d.short} questions.`)}</section>
  ${otherSolsHTML(k)}`;
}
const SOL_KW = {ses: 'Healthcare sanctions &amp; exclusions screening software', coi: 'Healthcare conflict of interest monitoring software', licensure: 'Licensure &amp; credential management software'};
function otherSolsHTML(k) {
  const others = SOLS.filter(s => s !== k);
  return `<section class="sec sol-more" style="padding-top:0"><div class="wrap">
    <div class="sec-head" data-reveal><div style="display:grid;gap:12px"><span class="bar">More from IntegrityShield</span><h2>Screen for more than ${M[k].short}.</h2></div><p class="lede">One platform, one login: add another solution and save 25% with a bundle.</p></div>
    <div class="go-cards two">${others.map(s => `<div class="go-card"><span class="sol-ic">${ICONS[s]}</span><h3>IntegrityShield<em>-${M[s].short}</em></h3><p>${M[s].oneliner}</p><div class="cta-row"><a class="btn primary sm" href="#${s}">${SOL_KW[s]}</a></div></div>`).join('')}</div>
  </div></section>`;
}
function goBandHTML() {
  return `<section class="sec final" data-final><div class="wrap">
    <div class="final-top"><h2 class="zoomin">Own your integrity program.</h2><p class="lede">Pick a solution to see how it works, try a free assessment and book a demo.</p></div>
    <div class="go-cards">${SOLS.map(s => `<div class="go-card"><span class="sol-ic">${ICONS[s]}</span><h3>IntegrityShield<em>-${M[s].short}</em></h3><p>${M[s].oneliner}</p><div class="cta-row"><a class="btn primary sm" href="#${s}">View solution</a><button class="btn ghost sm" data-to="${s}:book">Book a demo</button></div></div>`).join('')}</div>
  </div></section>`;
}
function renderPricingPage() {
  return `<section class="wrap phero">
    <h1><span class="bar h1-kw">Screening software pricing</span>Simple plans for <span class="mark">every solution.</span></h1>
    <p class="lede">Every solution uses the same five plans. Add plans from two or more solutions to get the 25% bundle discount.</p>
  </section>
  <section class="sec" style="padding-top:clamp(28px,4vw,40px)"><div class="wrap">
    <div class="plans" data-plans data-mode="hub"></div>
  </div></section>
  <section class="sec" style="padding-top:0" data-faqsec>${faqHTML(PRICING_FAQ, 'Billing questions.')}</section>
  ${goBandHTML()}`;
}

SOLS.forEach(k => { $('#page-' + k).innerHTML = renderModule(k); });
$('#page-pricing').innerHTML = renderPricingPage();
/* team photos from sure-shield.com/our-team */
const TEAM_IMG = {"sanjaya": "data:image/webp;base64,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", "chandy": "data:image/webp;base64,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", "tom": "data:image/webp;base64,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", "susan": "data:image/webp;base64,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", "john": "data:image/webp;base64,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"};
/* ---------- company pages: about, team, blog, contact ---------- */
const ABOUT_ROUTES = ['about', 'team', 'blog', 'tools', 'contact'];
M.gen = {name: 'IntegrityShield'};

const TEAM = [
  {k: 'sanjaya', li: 'https://www.linkedin.com/in/sanjaya-kumar-7bb68815/', name: 'Sanjaya Kumar', role: 'Chief Executive Officer', short: 'CEO', group: 'leadership',
   tags: ['Healthcare', 'Health informatics', 'SaaS'],
   bio: 'Sanjaya leads SureShield and IntegrityShield. He is a healthcare-focused executive with deep experience in health informatics and SaaS, and holds a master’s degree in public health with a focus on epidemiology.',
   focus: 'Company strategy, healthcare partnerships and business development.'},
  {k: 'chandy', li: 'https://www.linkedin.com/in/chandybilugu/', name: 'Chandrasekhar Bilugu', role: 'Chief Technology Officer', short: 'CTO', group: 'leadership',
   tags: ['Information security', 'Product', 'Engineering'],
   bio: 'Chandrasekhar is a technology executive and repeat founder with 20+ years of experience in product development and information security. He has led large engineering teams from first build to launch.',
   focus: 'The IntegrityShield platform, data sources, matching and security.'},
  {k: 'tom', li: 'https://www.linkedin.com/in/thomas-leahy-a497aa4/', name: 'Tom Leahy', role: 'SVP, Sales', short: 'SVP, Sales', group: 'leadership',
   tags: ['Compliance software', 'Risk', 'Growth'],
   bio: 'Tom has spent his career selling and building compliance, security and risk software, taking several companies from founding to exit. He and Sanjaya are on their fourth venture together.',
   focus: 'Helping compliance teams choose and roll out IntegrityShield.'},
  {k: 'john', name: 'John Hammer', role: 'Chief Financial Officer', short: 'CFO', group: 'leadership',
   tags: ['Finance', 'Venture', 'Operations'],
   bio: 'John is a finance executive for high-tech companies, with about 25 years of investing in, founding and running early-stage businesses. He holds degrees in engineering and business administration.',
   focus: 'Finance, operations and pricing.'},
  {k: 'susan', li: 'https://www.linkedin.com/in/susanwmooremph2b03a9/', name: 'Susan Moore', role: 'Advisor, Healthcare', short: 'Advisor', group: 'advisors',
   tags: ['Quality and risk', 'Public health', 'Policy'],
   bio: 'Susan is a former senior healthcare leader whose work spans clinical care, quality and risk, public health and policy. She has built industry partnerships that serve diverse patient communities.',
   focus: 'Healthcare compliance practice and what providers need from screening.'}
];
TEAM.forEach(p => { p.img = TEAM_IMG[p.k]; });

const BLOG_CATS = ['Sanctions & exclusions', 'Conflict of interest', 'Licensure', 'Compliance programs', 'Webinars'];
const POSTS = [
  {id: 'oig-frequency', cat: 0, sol: 'ses', mins: 7, title: 'How often should you check the OIG exclusion list? Monthly vs. continuous screening',
   excerpt: 'OIG points providers to monthly checks of the LEIE. Here is what monthly screening misses, and how continuous screening of employees, vendors and contractors closes the gap.',
   outline: ['What OIG expects from exclusion screening', 'Where monthly checks leave gaps', 'How continuous screening works', 'Documenting every check for auditors']},
  {id: 'ofac-oig-sam', cat: 0, sol: 'ses', mins: 6, title: 'OIG LEIE, SAM.gov and state Medicaid lists: which lists cover what, and who must be screened',
   excerpt: 'Federal and state lists serve different purposes. A plain-English guide to the OIG List of Excluded Individuals/Entities, SAM.gov exclusions and state Medicaid exclusion lists, and how to screen against all of them at once.',
   outline: ['The OIG LEIE', 'SAM.gov exclusions', 'State Medicaid exclusion lists', 'Screening all of them in one place']},
  {id: 'state-medicaid', cat: 0, sol: 'ses', mins: 8, title: 'State Medicaid exclusion lists: a 2026 guide for compliance officers',
   excerpt: 'Most states publish their own Medicaid exclusion or termination list. What they cover, how often they change and why federal checks alone are not enough.',
   outline: ['Why state lists matter', 'How state lists differ', 'Keeping up with changes', 'Building state checks into nightly screening']},
  {id: 'open-payments', cat: 1, sol: 'coi', mins: 6, title: 'What is CMS Open Payments, and how do you use it for conflict of interest monitoring?',
   excerpt: 'Open Payments is the federal database of payments from drug and device makers to physicians and teaching hospitals. Here is how compliance teams use it to monitor conflicts of interest.',
   outline: ['What Open Payments includes', 'Who reports, and when', 'Matching vendors and practitioners', 'Turning payments into reviewable cases']},
  {id: 'hidden-relationships', cat: 1, sol: 'coi', mins: 7, title: 'How to detect hidden financial relationships between vendors and physicians',
   excerpt: 'Undisclosed vendor payments to credentialed practitioners create Stark Law and Anti-Kickback risk. A step-by-step approach to finding them before an auditor does.',
   outline: ['Why relationships stay hidden', 'Building a vendor and practitioner list', 'Reviewing payments by amount, year and type', 'Closing cases with evidence']},
  {id: 'stark-aks', cat: 1, sol: 'coi', mins: 6, title: 'Stark Law and Anti-Kickback: what your conflict of interest program should document',
   excerpt: 'Disclosures, payment reviews and case decisions: the records that show your conflict of interest monitoring works.',
   outline: ['What regulators look for', 'Disclosure records', 'Payment review records', 'Case decisions and follow-up']},
  {id: 'in-house', cat: 3, sol: 'ses', mins: 5, title: 'Bringing sanctions screening in-house: cost, effort and audit readiness',
   excerpt: 'Outsourced screening is expensive and slow to change. What it takes to run sanctions and exclusion screening in-house, and how teams cut costs by up to 90%.',
   outline: ['The real cost of outsourcing', 'What in-house screening needs', 'A one-hour baseline', 'Staying audit-ready']},
  {id: 'vendors', cat: 0, sol: 'ses', mins: 5, title: 'Sanctions and exclusion screening for vendors and contractors, not just employees',
   excerpt: 'Excluded vendors and contractors create the same exposure as excluded staff. How to build one screening program for your whole workforce and supply chain.',
   outline: ['Where vendor exposure comes from', 'Screening contractors and new hires', 'One program, one audit trail']},
  {id: 'licensure', cat: 2, sol: 'licensure', mins: 5, title: 'Primary source license verification: what continuous licensure monitoring should cover',
   excerpt: 'Expired and restricted licenses are an easy audit finding. What to look for in license and certification monitoring. IntegrityShield-LCM is available now.',
   outline: ['Primary source verification', 'Expirations and restrictions', 'Alerts before a license lapses']},
  {id: 'webinar-recap', cat: 4, sol: 'ses', mins: 4, title: 'Webinar recap: continuous sanctions and exclusion screening in practice',
   excerpt: 'Highlights and audience questions from our live session on continuous screening. The full recording goes to everyone who registers.',
   outline: ['What we covered', 'Audience questions', 'Watch the recording']}
];

const ABOUT_FAQ = [
  ['Who makes IntegrityShield?', 'SureShield, Inc., a security, compliance and integrity (SCI) software company based in Atlanta, Georgia.'],
  ['What does IntegrityShield do?', 'It screens employees, vendors and healthcare providers against OIG, SAM and 100+ federal and state exclusion sources every night, and monitors conflicts of interest between vendors and credentialed practitioners using CMS Open Payments.'],
  ['Who is IntegrityShield for?', 'Compliance, credentialing and medical staff teams at hospitals and health systems, physician groups, post-acute and behavioral health providers, health plans, pharmacies, life sciences companies and other organizations that work with federal healthcare programs.'],
  ['Who leads SureShield?', 'Sanjaya Kumar (CEO), Chandrasekhar Bilugu (CTO), Tom Leahy (SVP, Sales) and John Hammer (CFO), with Susan Moore advising on healthcare.'],
];
const CONTACT_FAQ = [
  ['How do I book an IntegrityShield demo?', 'Pick a day and time in the calendar on this page. Demos take 30 minutes and use your own use case.'],
  ['Can I try IntegrityShield before a demo?', 'Yes. The HSES, COI and LCM pages each have a free assessment: run an exclusion check, an Open Payments lookup or a license check in seconds.'],
  ['How do I join an IntegrityShield webinar?', 'Register with the webinar form on this page. Everyone who registers gets the recording.'],
  ['How can I reach the team?', 'Call 1-800-604-1354, email info@sureshield.ai, or send a message with the form on this page.']
];

const WEB = {
  ses: {h: 'Continuous sanctions and exclusion screening in 2026.', p: 'See how compliance officers screen employees, vendors and healthcare providers against OIG, SAM and state Medicaid exclusion lists every night, and what auditors expect to see.',
        learn: ['Which official lists to screen, and how often', 'Screening vendors and contractors, not just staff', 'Clearing false positives without missing real matches', 'The audit trail reviewers ask for']},
  coi: {h: 'Detecting hidden vendor-physician financial relationships.', p: 'See how compliance teams use CMS Open Payments to monitor conflicts of interest between vendors and credentialed practitioners, before they become Stark Law or Anti-Kickback risk.',
        learn: ['What CMS Open Payments includes', 'Matching vendors to credentialed practitioners', 'Working suspect cases to closure', 'Reports for Stark Law and Anti-Kickback']},
  both: {h: 'Screening for sanctions, exclusions and conflicts of interest.', p: 'Two short sessions for compliance officers: continuous OIG, SAM and state Medicaid exclusion screening, then conflict of interest monitoring with CMS Open Payments.',
        learn: ['Nightly screening against official exclusion lists', 'Vendor and contractor screening', 'Conflict of interest monitoring with Open Payments', 'What auditors expect to see']}
};

function pageHeroK(label, h1, lede, extra = '') {   // the label is the page's keyword, so it goes inside the H1
  return `<section class="wrap phero pg-hero"><h1><span class="bar h1-kw">${label}</span>${h1}</h1><p class="lede">${lede}</p>${extra}</section>`;
}
function pageHero(label, h1, lede, extra = '') {
  return `<section class="wrap phero pg-hero"><span class="bar">${label}</span><h1>${h1}</h1><p class="lede">${lede}</p>${extra}</section>`;
}
function postCard(p, big) {
  return `<article class="pcard${big ? ' big' : ''}" data-reveal><button type="button" class="pc-hit" data-post="${p.id}" aria-label="Read: ${p.title}"></button>
    <div class="pc-art c${p.cat}" aria-hidden="true">${pcArt(p.cat)}</div>
    <div class="pc-body"><p class="pc-meta"><span class="chip acc">${BLOG_CATS[p.cat]}</span><span>${p.mins} min read</span></p><h3>${p.title}</h3><p class="pc-ex">${p.excerpt}</p><span class="mlink">Read article ${ARROW}</span></div></article>`;
}
/* next webinar: fill these in when the calendar details are ready.
   url: when set, "Register now" goes straight to the registration page. */
function nextWebinar() {
  return {
    topic: 'Continuous sanctions and exclusion screening: what auditors check in 2026',
    date: 'Date to be announced',
    time: 'Time to be announced',
    format: '45 minutes, online',
    url: ''
  };
}
function webinarNextHTML(px = 'home') {
  const w = nextWebinar();
  const ic = {
    cal: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    cam: '<rect x="3" y="6.5" width="13" height="11" rx="2"/><path d="m16 10.5 5-3v9l-5-3"/>'
  };
  const meta = (k, label, v) => `<li><span class="wn-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ic[k]}</svg></span><span><b>${label}</b><span data-w-v="${k}">${v}</span></span></li>`;
  const reg = w.url ? `<a class="btn primary" href="${w.url}" target="_blank" rel="noopener">Register now</a>` : `<button type="button" class="btn primary" data-wnx="reg">Register now</button>`;
  return `<section class="sec wnx${webinarSheetURL() ? ' loading' : ''}" data-web aria-labelledby="wnx-h-${px}"><div class="wrap"><div class="wnx-card" data-reveal>
    <div class="wnx-main">
      <span class="bar">Next live webinar</span>
      <h2 id="wnx-h-${px}" data-w-topic>${w.topic}</h2>
      <p class="wnx-desc" data-w-desc hidden></p>
      <div class="wnx-guests" data-w-guests hidden></div>
      <ul class="wnx-meta">${meta('cal', 'Date', w.date)}${meta('clock', 'Time', w.time)}${meta('cam', 'Format', w.format)}</ul>
    </div>
    <div class="wnx-act">
      <span class="w-reg" data-w-reg>${reg}</span>
      <button type="button" class="btn ghost" data-wnx="alert">Can’t make it? Get webinar alerts</button>
      <p class="note">Free for compliance teams. The recording goes to everyone who registers.</p>
    </div>
    <div class="web-card wnx-panel" data-wnx-panel="reg" hidden>
      <form class="web-form wnx-form" novalidate>
        <input type="hidden" name="session" value="ses">
        <label>First name<input name="first" autocomplete="given-name"></label>
        <label>Work email<input name="email" type="email" autocomplete="email"></label>
        <label>Organization<input name="org" autocomplete="organization"></label>
        ${nlBox()}${consentBox()}
        <button class="btn primary" type="submit">Save my seat</button>
        <p class="err" hidden></p>
      </form>
      <div class="web-done" hidden><span class="wd-ic" aria-hidden="true">✓</span><p class="wf-title">You’re registered.</p><p class="wd-t"></p><button type="button" class="btn ghost sm" data-web-again>Register someone else</button></div>
    </div>
    <div class="wnx-panel" data-wnx-panel="alert" hidden>
      <form class="wnx-alert" novalidate><input class="hp" name="ish_trap_x" tabindex="-1" autocomplete="off" readonly data-lpignore="true" data-1p-ignore aria-hidden="true">
        <label>Work email<input name="email" type="email" autocomplete="email" placeholder="you@organization.org"></label>
        <label><span>Industry <em class="opt">(optional)</em></span><select name="industry"><option value="">Select your industry</option>${industriesList().map(x => `<option>${x}</option>`).join('')}</select></label>
        <button class="btn primary" type="submit">Notify me</button>
        ${nlBox()}${consentBox()}
        <p class="err" hidden></p>
      </form>
      <div class="wnx-done" hidden><span class="wd-ic" aria-hidden="true">✓</span><p>You’re on the list. We’ll email you the date and topic of every upcoming IntegrityShield webinar, plus the recording if you miss one.</p></div>
    </div>
    <p class="wnx-demo note" hidden>Demo form. Nothing is sent.</p>
  </div></div></section>`;
}

function webinarCompactHTML(px) {
  return `<section class="sec web web-c" data-web aria-labelledby="${px}-web-h"><div class="wrap web-grid">
    <div class="web-copy" data-reveal>
      <span class="bar">Live webinar · Free for compliance teams</span>
      <h2 id="${px}-web-h">Continuous integrity screening, live in 45 minutes.</h2>
      <p class="lede">See how teams screen employees, vendors and providers against OIG, SAM and state Medicaid lists, and monitor conflicts of interest, without outsourcing.</p>
      <p class="web-chips"><span>Date to be announced</span><span>45 minutes, online</span><span>Recording for every registrant</span></p>
    </div>
    <div class="web-card" data-reveal>
      <form class="web-form" novalidate><input class="hp" name="ish_trap_x" tabindex="-1" autocomplete="off" readonly data-lpignore="true" data-1p-ignore aria-hidden="true">
        <label>Session<select name="session"><option value="ses">Sanctions &amp; exclusion screening</option><option value="coi">Conflict of interest monitoring</option><option value="both">Both sessions</option></select></label>
        <div class="two"><label>First name<input name="first" autocomplete="given-name"></label><label>Work email<input name="email" type="email" autocomplete="email"></label></div>
        <label>Organization<input name="org" autocomplete="organization"></label>
        <p class="err" hidden></p>
        ${nlBox()}${consentBox()}
        <button class="btn primary" type="submit">Save my seat</button>
        ${scanApi() ? '' : '<p class="note">Demo form. Nothing is sent.</p>'}
      </form>
      <div class="web-done" hidden><span class="wd-ic" aria-hidden="true">✓</span><p class="wf-title">You’re registered.</p><p class="wd-t"></p><button type="button" class="btn ghost sm" data-web-again>Register someone else</button></div>
    </div>
  </div></section>`;
}

function webinarHTML(px) {
  const w = WEB.ses;
  return `<section class="sec web" data-web aria-labelledby="${px}-web-h"><div class="wrap web-grid">
    <div class="web-copy" data-reveal>
      <span class="bar">Live webinar · Free for compliance teams</span>
      <h2 id="${px}-web-h" data-wh>${w.h}</h2>
      <p class="lede" data-wp>${w.p}</p>
      <ul class="web-meta"><li><b>When</b><span>Date to be announced</span></li><li><b>Length</b><span>45 minutes, online</span></li><li><b>Recording</b><span>Sent to everyone who registers</span></li></ul>
      <p class="web-lt">What you’ll learn</p>
      <ul class="checks sm web-learn" data-wl>${w.learn.map(l => `<li>${l}</li>`).join('')}</ul>
    </div>
    <div class="web-card" data-reveal>
      <form class="web-form" novalidate><input class="hp" name="ish_trap_x" tabindex="-1" autocomplete="off" readonly data-lpignore="true" data-1p-ignore aria-hidden="true">
        <p class="wf-title">Save your seat</p>
        <fieldset class="sess"><legend>Choose a session</legend>
          <label class="sess-opt"><input type="radio" name="${px}-session" value="ses" checked><span><b>Sanctions &amp; exclusion screening</b><small>OIG, SAM and state Medicaid lists</small></span></label>
          <label class="sess-opt"><input type="radio" name="${px}-session" value="coi"><span><b>Conflict of interest monitoring</b><small>Vendor-physician relationships in CMS Open Payments</small></span></label>
          <label class="sess-opt"><input type="radio" name="${px}-session" value="both"><span><b>Both sessions</b><small>Back to back, 45 minutes each</small></span></label>
        </fieldset>
        <div class="two"><label>First name<input name="first" autocomplete="given-name"></label><label>Last name<input name="last" autocomplete="family-name"></label></div>
        <label>Work email<input name="email" type="email" autocomplete="email"></label>
        <div class="two"><label>Organization<input name="org" autocomplete="organization"></label><label>Role<select name="role"><option value="">Select</option><option>Compliance officer</option><option>Chief compliance officer</option><option>Privacy officer</option><option>Credentialing</option><option>HR</option><option>Procurement or finance</option><option>Other</option></select></label></div>
        <p class="err" hidden></p>
        ${nlBox()}${consentBox()}
        <button class="btn primary" type="submit">Register for the webinar</button>
        ${scanApi() ? '' : '<p class="note">Demo form. Nothing is sent.</p>'}
      </form>
      <div class="web-done" hidden><span class="wd-ic" aria-hidden="true">✓</span><p class="wf-title">You’re registered.</p><p class="wd-t"></p><button type="button" class="btn ghost sm" data-web-again>Register someone else</button></div>
    </div>
  </div></section>`;
}

/* the FAQ page is a hub: each answer is held in full on one page only (home, a product page, pricing, about or contact);
   here each question gets the opening sentence and a link to the full answer, so no two pages compete with the same text */
const FAQ_HOME = {home: 'the home page', ses: 'the HSES page', coi: 'the COI page', licensure: 'the LCM page', pricing: 'the pricing page', about: 'the About page', contact: 'the contact page'};
function faqShort(a) {
  const t = a.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const m = t.match(/^.{20,}?[.?!](?=\s+[A-Z(“"]|$)/);
  return m ? m[0] : t;
}
function faqHubHTML(list, title, owner) {
  return `<div class="wrap faq-grid"><div style="display:grid;gap:12px;align-content:start" data-reveal><h2>${title}</h2><p class="lede" style="font-size:16px"><a class="mlink" href="#${owner}" data-faqgo="${owner}">Full answers on ${FAQ_HOME[owner]}</a></p></div><div class="faq-list" data-reveal>${faqSplit(list.map(([q, a]) => {
    const s = faqShort(a), more = s.length < a.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().length;
    return `<details class="faq-short"><summary>${q}${PLUS}</summary><p>${s} <a class="mlink" href="#${owner}" data-faqgo="${owner}">${more ? 'Full answer on ' : 'More on '}${FAQ_HOME[owner]}</a></p></details>`;
  }))}</div></div>`;
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-faqgo]');
  if (!a) return;
  e.preventDefault(); goTo(a.dataset.faqgo, '[data-faqsec]');
});
function renderFaqPage() {
  const groups = [['General', HOME_FAQ, 'home'], ['IntegrityShield-HSES · Healthcare Sanctions & Exclusions Screening', M.ses.faq, 'ses'], ['IntegrityShield-COI · Conflict of Interest', M.coi.faq, 'coi'],
    ['IntegrityShield-LCM · Licensure & Credential Management', M.licensure.faq, 'licensure'], ['Pricing and plans', PRICING_FAQ, 'pricing'], ['About SureShield', ABOUT_FAQ, 'about'], ['Demos, webinars and support', CONTACT_FAQ, 'contact']];
  return `${pageHeroK('Integrity screening FAQs', 'Answers about <span class="mark">IntegrityShield.</span>', 'Quick answers to common questions about screening, data sources, pricing, setup and support, grouped by solution. Each one links to the full answer.')}
    ${groups.map(([t, list, owner]) => `<section class="sec faqpage" data-faqsec>${faqHubHTML(list, t, owner)}</section>`).join('')}`;
}
const AGREEMENT = {"title": "IntegrityShield Software Subscription Agreement", "sections": [["Preamble", ["This Software Subscription and Maintenance Agreement (“Agreement”) is effective as of {{DATE}} (“Effective Date”), between SureShield, Inc. (“Company”) and {{LICENSEE}} (“Licensee”). It governs Licensee’s subscription to the hosted IntegrityShield software, made up of IntegrityShield-HSES (healthcare sanctions and exclusions screening), IntegrityShield-COI (conflict of interest monitoring) and IntegrityShield-LCM (licensure and credential management), as selected by Licensee (“Software”), and related services (“Services”)."]], ["1. Service", ["Company grants Licensee a nonexclusive, nontransferable right, subject to Section 16, for its authorized users to access and use the hosted Software during the Term for Licensee’s internal sanctions and exclusion screening, conflict of interest monitoring, and licensure and credential management, limited to the solutions and plans Licensee selects.", "For IntegrityShield-HSES, Company shall screen records of employees, vendors, and providers maintained in Licensee’s active screening population nightly against the latest data Company has obtained from the selected sources, including newly added records in the next scheduled cycle after successful ingestion. Nightly screening does not mean that each source publishes or is refreshed nightly. Company shall use commercially reasonable efforts to retrieve and incorporate source updates promptly after publication and shall identify relevant source and screening dates in the results.", "For IntegrityShield-COI, Company shall match the practitioners and vendors in Licensee’s active monitoring population against CMS Open Payments data and identify potential financial relationships between them, and shall check newly added or changed practitioners and vendors when they are added or changed. Open Payments data is published by CMS once a year for the previous calendar year; Company shall incorporate each publication using commercially reasonable efforts after it is released.", "For IntegrityShield-LCM, Company shall verify the licenses and credentials in Licensee’s active monitoring population at the issuing primary source where Company supports that source, monitor them for expiration and recorded disciplinary actions, and send reminders before a license expires. Primary sources publish and update their records on their own schedules, and coverage of states, countries and license types is limited to the sources Company supports at the time.", "The Services shall provide reports, potential-match alerts to designated authorized users after processing, and workflows for documenting review and follow-up. Historical information is limited to information captured or retained by the Service and supplied by sources; the Services do not promise a complete history of every sanction or exclusion. Source outages, delayed publications, and unavailable data shall not be represented as a clear screening result. Company shall notify Licensee of material interruptions to selected source coverage and restore coverage using commercially reasonable efforts.", "Potential matches and alerts require identity verification and review; a name match alone is not a final determination. Licensee remains responsible for accurate and lawfully obtained input data, selecting appropriate databases, reviewing alerts, confirming matches with the issuing authority where appropriate, and making employment, contracting, payment, and compliance decisions. The Services support, but do not guarantee, legal compliance or replace professional advice. Solutions, plans and services that Licensee has not selected, including credentialing services beyond license verification and monitoring, are excluded unless separately agreed in writing.", "New databases added to Company’s platform are not automatically included. Additions, removals, substitutions, or fees affecting selected coverage require a written amendment to be approved by both parties. Company may update source names or access methods without changing the underlying agreed scope; it shall notify Licensee of material changes."]], ["2. Restrictions", ["Licensee shall not share credentials or permit unauthorized access, copy or distribute the Software, sublicense or resell the Services, reverse engineer the Software except as permitted by applicable law, interfere with security, or use the Services unlawfully. Company retains ownership of the Software and its intellectual property. Licensee retains ownership of its submitted data, screening populations, and its case notes and decisions (“Licensee Data”); Company receives only the rights necessary to provide and secure the Services."]], ["3. Fees", ["Licensee shall pay undisputed fees per service selection. Pre-approved, documented travel expenses for onsite visits shall be invoiced separately with an expense report. Additional work or charges require Licensee’s prior written approval."]], ["4. Warranty of Title", ["Company warrants that it owns or has sufficient rights to provide the Software and grant the rights in this Agreement. For a breach or threatened breach, Company shall, at its expense, promptly obtain continued use rights, provide a non-infringing replacement with comparable functionality, or refund the full license fees paid. This remedy does not limit Company’s indemnification obligations under Section 12."]], ["5. Warranty of Functionality", ["Company warrants that the Software will perform in all material respects according to its written specifications supplied to Licensee when used as specified. Licensee shall promptly notify Company of a material nonconformity, and Company shall promptly correct it. This warranty does not apply to unauthorized modifications or misuse by Licensee. Source publication accuracy or completeness is not warranted by Company; Company remains responsible for materially accurate processing of the source data it obtains and the screening functions described in this Agreement."]], ["6. Malicious Code", ["Company shall not knowingly introduce malicious code, undisclosed disabling mechanisms, or unauthorized access features into the Services and shall maintain commercially reasonable safeguards to detect and prevent them. Ordinary software defects are governed by Section 5."]], ["7. Excluded Provider", ["Company represents that neither Company nor its directors, officers, or personnel assigned to the Services is excluded, debarred, or otherwise ineligible to participate in applicable federal or state health care programs. Company shall promptly notify Licensee if this representation ceases to be accurate and shall remove affected personnel from the Services."]], ["8. Maintenance and Support", ["Undisputed subscription fees include corrections and generally available enhancements to the subscribed Software, user documentation, and support. Separately priced products, modules, or professional services are not included unless agreed in writing. Support availability and response objectives are governed by the prevailing Support policy of the Company."]], ["9. Payment", ["Undisputed invoices are payable upon receipt unless otherwise stated in the invoice. Licensee shall promptly identify disputed charges and the basis for the dispute and shall pay the undisputed portion on time. The parties shall work in good faith to resolve billing disputes"]], ["10. Warranty Disclaimer", ["Except for the express warranties in this Agreement, Company disclaims other warranties to the extent permitted by law, including implied warranties of merchantability and fitness for a particular purpose. No disclaimer reduces an express obligation under this Agreement."]], ["11. Limitation of Liability", ["Neither party is liable for incidental, consequential, or other indirect damages, including lost revenue, even if advised of their possibility. Each party’s aggregate liability under this Agreement shall not exceed the fees paid by Licensee under this Agreement, regardless of the theory of liability. These limitations do not apply to Company’s indemnification obligations, Company’s breach of confidentiality obligations, or either party’s gross negligence, fraud, or willful misconduct."]], ["12. Indemnification", ["Company shall indemnify, defend, and hold harmless Licensee and its officers, directors, agents, employees, successors, and assigns against claims, proceedings, damages, judgments, liabilities, penalties, fines, and reasonable costs and attorneys’ fees arising from Company’s breach of confidentiality, gross negligence or willful misconduct, or a third-party allegation that the Software, Services, or supplied materials, or their authorized use, infringe, misappropriate, or violate intellectual property rights.", "Licensee shall promptly notify Company of a claim and reasonably cooperate at Company’s expense. Company may control the defense with counsel reasonably acceptable to Licensee, subject to Licensee’s applicable public-entity requirements. No settlement may admit fault, impose an obligation on Licensee, or fail to fully release Licensee without Licensee’s written consent. A delay in notice reduces Company’s obligations only to the extent materially prejudiced.", "For an intellectual property claim, Company shall obtain continued use rights or modify or replace the affected Services without materially reducing their agreed functionality. If neither is commercially feasible, either party may terminate the affected Services, and Company shall refund all fees and expenses paid in connection with those Services. These steps do not eliminate the defense and indemnification obligations above."]], ["13. Confidentiality", ["Confidential Information includes nonpublic business, technical, financial, and personal information disclosed by either party that is identified as confidential or reasonably understood to be confidential, including Licensee Data. It excludes information that is public without breach, already lawfully known without restriction, lawfully received from a third party without restriction, or independently developed without use of the other party’s Confidential Information.", "Each party shall protect the other’s Confidential Information with at least reasonable care, use it only to perform or exercise rights under this Agreement, and disclose it only to representatives who need access and are bound by equivalent confidentiality obligations. Each party is responsible for its representatives.", "Compelled disclosures are permitted to the extent required by law; where legally permitted, the receiving party shall give advance notice and reasonable assistance with protective measures. Licensee’s public-records duties are not displaced by this Agreement; a confidentiality label alone does not establish an exemption.", "On termination or a lawful written request, each party shall return or securely delete the other’s Confidential Information, subject to Section 14 and legal retention requirements. Retained legal and backup copies remain protected, shall not be used for other purposes, and shall be deleted under applicable retention schedules. A party may seek equitable relief for an actual or threatened breach, subject to applicable law."]], ["14. Data Protection and Security", ["Company shall maintain a documented information security program with safeguards appropriate to the sensitivity of Licensee Data, including encryption in transit and at rest, access controls and least privilege, multifactor authentication for privileged access, logging, vulnerability management, secure backups, incident response, and personnel confidentiality obligations. Company shall use Licensee Data only to provide, support, and secure the Services or as required by law, and shall not sell it, use it for advertising, or train general- purpose artificial intelligence models on it without Licensee’s prior written consent.", "Company shall notify Licensee without undue delay and no later than forty-eight (48) hours after becoming aware of unauthorized access to, acquisition of, disclosure of, or material loss of Licensee Data. Initial notice may be preliminary; Company shall provide available details, investigation updates, mitigation steps, and reasonable cooperation. Company shall not delay notice pending completion of an investigation. Applicable law or an executed business associate agreement may require additional or earlier notice.", "Licensee shall provide only data reasonably necessary for screening and shall not submit patient or member clinical information unless the parties expressly authorize that processing in writing. If the Services involve protected health information for which Company is a business associate, the parties shall execute an appropriate HIPAA business associate agreement before that processing begins. This Agreement does not itself constitute a business associate agreement. Each party shall comply with privacy and data protection laws applicable to its activities.", "Licensee may export its data and available screening and case records during the Term. For thirty (30) days after termination, Company shall make those records available in a commonly usable electronic format upon request, subject to lawful restrictions. Company shall then securely delete active copies within sixty (60) days after the export period, except for legally required retention. Backup copies shall remain protected and be deleted on Company’s documented backup rotation. Company shall confirm deletion in writing on request."]], ["15. Notices", ["Notices shall be in writing and delivered personally, by certified mail, by recognized overnight carrier, or by email to an address designated for contractual notices, with affirmative acknowledgment of receipt. Automated replies alone are insufficient. Notices take effect upon documented receipt. Each party may update its notice details in writing.", "Company: SureShield, Inc., 16025 Manor Club Drive, Milton, GA 30004. Contract notice email: sales@sureshield.ai", "Licensee: {{LICENSEE_NOTICE}}", "Licensee and Company support and emergency contacts shall be provided at implementation and maintained during the Term."]], ["16. Governing Law and Assignment", ["Delaware law governs, without regard to conflict-of-law principles. Neither party may assign this Agreement without the other’s written consent, except to an affiliate or in connection with a merger, acquisition, corporate reorganization, or sale of all or substantially all assets. The assignee must assume the obligations in writing; assignment shall not reduce Licensee’s data protections or agreed Services."]], ["17. Entire Agreement and Order of Precedence", ["This Agreement and its exhibits supersede prior understandings on the same subject. Amendments and waivers require a writing approved by both parties. Purchase orders may identify renewal and billing details but do not amend other terms unless expressly accepted in a signed amendment. Website or click-through terms do not amend this Agreement. No failure to enforce a right is a waiver. Electronic signatures and counterparts are permitted to the extent allowed by law."]], ["18. Severability and Headings", ["An unenforceable provision shall be severed to the extent necessary, and the remaining provisions remain effective. Headings are for convenience and do not alter meaning."]], ["19. Subcontractors", ["Company remains responsible for subcontractors’ and hosting providers’ performance and compliance with this Agreement. Subcontractors accessing Licensee Data shall be subject to written confidentiality and security obligations at least as protective as this Agreement and any applicable business associate agreement. Company shall provide its current list of material hosting and data-processing subcontractors on reasonable written request and notify Licensee before a material change affecting Licensee Data."]], ["20. Termination", ["Either party may elect not to renew by giving at least thirty (30) days’ written notice before the current Term ends. Auto-renewal takes effect at the end date stated for that Term. Either party may terminate for a material breach remaining uncured thirty (30) days after written notice describing the breach. Rights under an applicable business associate agreement are preserved.", "Upon termination, access ends except for the data export arrangements in Section 14. Undisputed accrued fees remain payable. If Licensee terminates for Company’s uncured material breach, Company shall refund prepaid subscription fees for the unused portion of the Term. Company may temporarily restrict access only as reasonably necessary to address an actual security threat or unlawful use, shall promptly notify Licensee where legally permitted, and shall restore access promptly when the cause is resolved."]], ["21. Survival", ["Payment obligations accrued before termination, ownership, confidentiality, data return and deletion, indemnification, liability limitations, governing law, and provisions intended by their nature to survive shall survive expiration or termination."]]]};
const PRIVACY_POLICY = {"updated": "November 23, 2026", "sections": [["Who we are", ["IntegrityShield is a product of SureShield, Inc. (“SureShield”, “we”, “us”). This Privacy Policy explains how we collect, use and protect personal information through the IntegrityShield website and when you contact us, book a demo, register for a webinar, run a free assessment, or sign up for or buy an IntegrityShield plan.", "Records that customers screen inside the IntegrityShield platform (for example employee, vendor and provider records) are handled under the customer’s IntegrityShield Software Subscription Agreement, including its Confidentiality and Data Protection and Security sections."]], ["Information we collect", ["<b>Information you give us.</b> When you use a form on this website we collect what you enter, such as your name, work email, phone number, organization, job title or role, industry and message. Demo bookings also collect the meeting time you choose and your answers to the booking questions. Webinar registrations and alerts collect your email and, if you give them, your name, organization, role and industry.", "<b>Sign-ups and purchases.</b> For a free plan, a paid plan or an Enterprise request we collect your organization’s details (name, address, organization type, website and industries served), the name, email and phone number of your system administrator, the plans you choose, and the name, title, email and date of the person who signs the agreement electronically.", "<b>Free assessments.</b> To run a free sanctions and exclusion check or a free licensure check, we send the details you enter (for example a name, license number or state) to the relevant public data sources and show you the result. We record that a check ran, when and for which solution, but not the names you searched.", "<b>Collected automatically.</b> When you visit, we and the analytics and advertising tools listed in our <a href=\"#cookies\">Cookie Policy</a> collect information about your device and how you use the site, such as pages viewed, clicks and scrolling, how you arrived, approximate location from your IP address, and browser and device type. We also set a random visitor ID and counters for the free assessments. When you run a free assessment, Google reCAPTCHA collects technical information from your browser to check that you are a person."]], ["How we use information", ["We use personal information to: respond to your questions and requests; schedule demos and send meeting details; register you for webinars and send confirmations, reminders, recordings and webinar alerts; set up and provide your IntegrityShield account and subscription, including agreements, invoices and support; process payments; send our newsletter if you asked for it; understand how the website is used so we can improve it; measure our marketing and show relevant ads; keep the website secure and prevent abuse (for example free-assessment limits and bot checks); and comply with the law."]], ["Emails and newsletter", ["We send service emails that you need, such as form and webinar confirmations, meeting details, receipts, signed agreements and account information.", "Forms on this site include a newsletter box that is ticked for you; untick it if you do not want the newsletter. Every newsletter and webinar alert email includes an unsubscribe link, and we honor unsubscribe requests promptly. You can also email us to opt out."]], ["Payments", ["Card payments are processed by Stripe. Your card details go directly to Stripe and are not stored on our systems. Stripe handles them under its own privacy policy. We keep a record of what you bought, what you paid and your invoices."]], ["Cookies", ["This website uses cookies and similar technologies. Some are needed for the site to work, such as the random visitor ID, the free-assessment counters and Google reCAPTCHA. Others help us understand how the site is used (Google Analytics, Microsoft Clarity and our own visitor statistics) and measure our advertising (Meta Pixel). The <a href=\"#cookies\">Cookie Policy</a> lists each one and explains how to block or delete them."]], ["Sharing and service providers", ["We never sell or trade your personal information.", "We share it only with service providers that help us run IntegrityShield and this website, under confidentiality obligations: Google Workspace (email, and the Google Sheets and Google Apps Script service that stores and processes form submissions), HubSpot (customer relationship management), Brevo (newsletter and email delivery), Calendly (demo scheduling), Zoom (meetings and webinars), Stripe (payments), GitHub Pages (website hosting), Google reCAPTCHA (bot checks), Google Analytics and Microsoft Clarity (website analytics), Meta (advertising measurement through the Meta Pixel), and the public data sources that a free assessment queries.", "We may also disclose information when the law requires it, to protect the rights, property or safety of SureShield, our customers or others, or as part of a merger, acquisition or sale of assets, in which case this policy continues to apply. We may use aggregated or de-identified information, which does not identify you, for research and to improve our services."]], ["Do Not Track", ["There is no common standard for browser Do Not Track signals, so this website does not respond to them. You can control analytics and advertising cookies as described in our <a href=\"#cookies\">Cookie Policy</a>."]], ["Security", ["We protect personal information with measures that include encryption in transit (SSL/TLS), access limited to staff who need it, and regular reviews of our systems. No method of transmission or storage is completely secure, but we work to protect your information.", "If we confirm a breach that affects your personal information, we will tell you by email, phone or another appropriate method as soon as possible."]], ["Data retention", ["We keep information from inquiries, demo bookings, webinar registrations, free assessments and newsletter sign-ups for one year from your last contact with us, unless you become a customer or ask us to delete it sooner. Customer records are kept for the length of the subscription and then handled as the Subscription Agreement and the law require. After that we delete the information or make it anonymous."]], ["Your rights and choices", ["Depending on where you live, you may have the right to access the personal information we hold about you, correct it, delete it, restrict or object to how we use it, receive a copy in a portable format, and withdraw any consent you gave.", "To make a request, email us at <a href=\"mailto:info@sureshield.ai\">info@sureshield.ai</a>. We do not charge for requests and usually respond within one month.", "IntegrityShield currently serves organizations in the United States. Information for visitors in the European Union and the United Kingdom is coming soon."]], ["Children", ["IntegrityShield is sold only to businesses and organizations. This website is not aimed at children, and we do not knowingly collect personal information from children under 13."]], ["Changes to this policy", ["We may update this policy. When we do, we will change the “Last updated” date above, and if a change is significant we will tell you more prominently."]], ["Contact us", ["SureShield, Inc., 3343 Peachtree Rd NE, Ste 145-1564, Atlanta, GA 30326<br>Email: <a href=\"mailto:info@sureshield.ai\">info@sureshield.ai</a>"]]]};
/* the agreement with this customer's details filled in; o = {licensee, date, notice} (already escaped for HTML when shown) */
function agreementSections(o) {
  return AGREEMENT.sections.map(([h, ps]) => [h === 'Preamble' ? '' : h,
    ps.map(p => p.replace('{{DATE}}', o.date).replace('{{LICENSEE}}', o.licensee).replace('{{LICENSEE_NOTICE}}', o.notice))]);
}
const AG_REVIEW = 'Needs legal review: the agreement now covers all three solutions (opening paragraph and Section 1 updated for COI and LCM). Still open: the notice address (Milton, GA) differs from the Atlanta headquarters address, and the source document was marked “Revised draft”.';
const INFO = {
  privacy: ['Privacy Policy', 'Privacy <span class="mark">Policy.</span>', 'How SureShield, Inc. collects, uses and protects personal information through IntegrityShield.',
    ['Information we collect', 'How we use information', 'Newsletter and marketing emails', 'Cookies', 'Sharing and service providers', 'Data retention', 'Your rights and choices', 'Contact us']],
  terms: ['Terms & Conditions', 'Terms &amp; <span class="mark">Conditions.</span>', 'The IntegrityShield Software Subscription Agreement that every subscription is signed under.',
    ['Acceptance of terms', 'Use of the website', 'Free assessments and free plans', 'Subscriptions and payment', 'Intellectual property', 'Disclaimers and limitation of liability', 'Governing law', 'Contact us']],
  cookies: ['Cookie Policy', 'Cookie <span class="mark">Policy.</span>', 'The cookies this website uses, why, and how to change your choices.', null],
  accessibility: ['Accessibility', 'Accessibility <span class="mark">statement.</span>', 'We want everyone to be able to use this website.', null],
  security: ['Security & Trust', 'Security &amp; <span class="mark">trust.</span>', 'How IntegrityShield protects the data you screen.',
    ['Data handling', 'Encryption', 'Hosting', 'Access controls', 'HIPAA and business associate agreements (BAA)', 'Certifications and audits (for example SOC 2)', 'Reporting a security issue']]
};
function renderInfoPage(k) {
  const [label, h1, lede, secs] = INFO[k];
  let body;
  if (k === 'cookies') body = `<p class="upd">Last updated: November 23, 2026</p>
    <p>Cookies are small files a website stores in your browser. This website and the services it uses also rely on similar technologies, such as small scripts and pixels. This page lists what we use and why. For how we handle personal information in general, see our <a href="#privacy">Privacy Policy</a>.</p>
    <h2>Necessary</h2><p>These keep the site working and protect it from abuse.</p>
    <div class="fx-wrap"><table class="fx ck-t"><thead><tr><th scope="col">Name</th><th scope="col">Purpose</th><th scope="col">Lasts</th></tr></thead><tbody>
      <tr><th scope="row">is_vid</th><td>A random visitor ID used to count free assessments and for our own visitor statistics</td><td>1 year</td></tr>
      <tr><th scope="row">is_scans_ses</th><td>Free sanctions and exclusion assessments used (10 per visitor)</td><td>1 year</td></tr>
      <tr><th scope="row">is_scans_lic</th><td>Free licensure assessments used (10 per visitor)</td><td>1 year</td></tr>
      <tr><th scope="row">is-theme</th><td>Remembers whether you chose dark mode (stored on your device, not sent to us)</td><td>Until you clear it</td></tr>
      <tr><th scope="row">Google reCAPTCHA</th><td>Checks that you are a person before a free assessment or form is sent</td><td>Set by Google</td></tr>
    </tbody></table></div>
    <h2>Analytics</h2><p>These show us how visitors find and use the site, so we can improve it.</p>
    <div class="fx-wrap"><table class="fx ck-t"><thead><tr><th scope="col">Name</th><th scope="col">Purpose</th><th scope="col">Lasts</th></tr></thead><tbody>
      <tr><th scope="row">Built-in visitor statistics</th><td>Our own count of page visits and form use, recorded with the random visitor ID. Not shared with advertisers.</td><td>1 year</td></tr>
      <tr><th scope="row">Google Analytics (_ga, _ga_*)</th><td>Pages viewed, time on site, how you arrived and approximate location</td><td>Up to 2 years</td></tr>
      <tr><th scope="row">Microsoft Clarity (_clck, _clsk, CLID)</th><td>Clicks, scrolling and anonymized session replays that show where the site is hard to use</td><td>Up to 1 year</td></tr>
    </tbody></table></div>
    <h2>Marketing</h2><p>These measure our advertising and help show relevant ads.</p>
    <div class="fx-wrap"><table class="fx ck-t"><thead><tr><th scope="col">Name</th><th scope="col">Purpose</th><th scope="col">Lasts</th></tr></thead><tbody>
      <tr><th scope="row">Meta Pixel (_fbp)</th><td>Tells us when a visit or sign-up came from a Facebook or Instagram ad, and lets Meta show our ads to similar audiences</td><td>3 months</td></tr>
    </tbody></table></div>
    <h2>Your choices</h2>
    <ul class="checks"><li>Block or delete cookies in your browser settings. Necessary cookies cannot be turned off without some parts of the site, such as the free assessments, not working.</li>
      <li>Opt out of Google Analytics with the <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener" target="_blank">Google Analytics opt-out add-on</a>.</li>
      <li>Change how Meta uses your activity for ads in your <a href="https://www.facebook.com/adpreferences" rel="noopener" target="_blank">Meta ad preferences</a>.</li>
      <li>Read how Microsoft handles Clarity data in the <a href="https://privacy.microsoft.com/privacystatement" rel="noopener" target="_blank">Microsoft Privacy Statement</a>.</li></ul>
    <h2>Questions</h2><p>Email <a href="mailto:info@sureshield.ai">info@sureshield.ai</a>.</p>`;
  else if (k === 'accessibility') body = `<p class="upd">Last updated: November 23, 2026</p>
    <p>We want everyone, including people who use assistive technology, to be able to learn about IntegrityShield, book a demo and sign up on this website.</p>
    <h2>Our standard</h2><p>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1, level AA.</p>
    <h2>What we have done</h2>
    <ul class="checks"><li><b>Captions.</b> Every video has captions. Turn them on with the CC button while the video plays.</li>
      <li><b>Keyboard navigation.</b> Menus, forms, the demo calendar, checkout and the video player can be used with a keyboard alone, with a visible focus outline.</li>
      <li><b>Dark mode.</b> Switch between light and dark with the sun and moon button in the header, or under Dark mode in the mobile menu. Your choice is remembered on this device.</li>
      <li><b>Readable structure.</b> Pages use headings, labeled form fields and descriptive link text so screen readers can move through them.</li></ul>
    <h2>Known limitations</h2>
    <ul class="checks"><li>Some images and illustrations do not yet have full text descriptions.</li>
      <li>Some animations do not yet follow your device’s reduced-motion setting.</li></ul>
    <p>We are working on both.</p>
    <h2>Report a problem</h2><p>If something on this site is hard to use, email <a href="mailto:info@sureshield.ai">info@sureshield.ai</a>. Tell us the page and what went wrong, and we will reply within 24 to 48 hours.</p>`;
  else if (k === 'privacy') body = `<p class="upd">Last updated: ${PRIVACY_POLICY.updated}</p>` + PRIVACY_POLICY.sections.map(([h, ps]) => `<h2>${h}</h2>${ps.map(x => `<p>${x}</p>`).join('')}`).join('');
  else if (k === 'terms') body = `<p>${RV(AG_REVIEW)}</p>
    <p>Every IntegrityShield subscription, including the free plan, is signed under this agreement at checkout. The customer’s name and the signing date are filled in when you sign. Read it together with our <a href="#privacy">Privacy Policy</a>.</p>
    <p>${RV('Needs legal review: terms of use for website visitors and the free assessments (not covered by the subscription agreement)')}</p>
    <h2>${AGREEMENT.title}</h2>` + agreementSections({licensee: 'the organization named at checkout', date: 'the date it is signed', notice: 'as given at checkout'})
      .map(([h, ps]) => `${h ? `<h3>${h}</h3>` : ''}${ps.map(x => `<p>${x.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>`).join('')}`).join('');
  else body = `<p>${RV(k === 'security' ? 'Content needed: real facts only (no claims without evidence)' : 'TODO: legal text from counsel')}</p>` +
    secs.map(s => `<h2>${s}</h2><p>${RV(k === 'security' ? 'Content needed' : 'TODO')}</p>`).join('');
  return `${pageHero(label, h1, lede)}<section class="sec info"><div class="wrap legal">${body}</div></section>`;
}
function renderAbout() {
  const tl = [
    ['20+ years', 'Compliance software, built and scaled', 'SureShield was founded in 2018 and is led by a team with 20+ years of experience building compliance software, across compliance, safety, policy management and data analytics.'],
    ['2018', 'SureShield is founded', 'Security, compliance and integrity tools were complicated, fragmented and costly. SureShield set out to make them easy to deploy and cheaper to run.'],
    ['HSES', 'Healthcare Sanctions & Exclusions Screening', 'IntegrityShield-HSES screens employees, vendors and healthcare providers against official sanctions and exclusion lists, and gives your team one worklist for possible matches.'],
    ['COI', 'Conflict of Interest monitoring', 'IntegrityShield-COI finds financial relationships between your vendors and credentialed practitioners using CMS Open Payments data.'],
    ['LCM', 'Licensure & Credential Management', 'IntegrityShield-LCM verifies licenses and credentials at the source and tracks status, expiration dates and disciplinary actions.'],
    ['One platform', 'Screen once, see everything', 'All three solutions share one platform, so a person can be screened for exclusions, conflicts of interest and licensure in one place.']
  ];
  const values = [
    ['Customer delight', 'We build what compliance officers ask for, and measure ourselves by how easy their audits get.'],
    ['Automation', 'Nightly screening, rescreening and alerts run without anyone pressing a button.'],
    ['Attention to detail', 'Matching on name, date of birth and address clears false positives without missing real matches.'],
    ['Customer success', 'A team that helps you load watchlists, connect systems and prepare for audits.'],
    ['Continuous improvement', 'Sources, matching and reports keep getting better, release after release.'],
    ['Agility', 'Custom sources, rules and integrations for complex organizations.'],
    ['Simplicity', 'Most teams are live in under an hour from activation, not counting integrations.'],
    ['Lower cost, better outcomes', 'In-house screening for up to 90% less than outsourcing, with a stronger audit trail.']
  ];
  const serve = [
    ['Hospitals and health systems', 'Acute care, critical access and specialty hospitals screening staff, vendors and practitioners.'],
    ['Physician groups and clinics', 'Medical groups, outpatient centers and community health centers keeping practitioner screening and licensing current.'],
    ['Post-acute and behavioral health', 'Long-term care, home health, hospice and behavioral health providers screening staff and contractors.'],
    ['Health plans, pharmacy and life sciences', 'Payers, pharmacies, drug and device makers and healthcare staffing firms that work with federal healthcare programs.']
  ];
  return `${pageHeroK('About IntegrityShield: integrity screening by SureShield', 'Integrity screening from people who have built <span class="mark">compliance software for 20+ years.</span>',
      'IntegrityShield is a product of SureShield, Inc., an Atlanta company that builds automated security, compliance and integrity software. We help compliance officers screen employees, vendors and healthcare providers for sanctions, exclusions and conflicts of interest, in-house and every night.',
      `<div class="cta-row"><a class="btn primary" href="#team">Discover our team ${ARROW}</a><a class="btn ghost" href="#contact">Contact us</a></div>`)}
  <section class="sec ab-story"><div class="wrap ab-grid">
    <div class="ab-copy" data-reveal><span class="bar">Our story</span><h2>Why we built IntegrityShield.</h2>
      <p class="lede">Compliance teams were paying outside vendors to run monthly checks, then chasing spreadsheets when auditors asked for proof. We knew the work could be automated, run in-house and done every night.</p></div>
    <div class="tl" data-tl data-reveal>
      <div class="tl-rail"><span class="tl-fill"></span></div>
      <ol class="tl-steps">${tl.map((s, i) => `<li><button type="button" class="tl-btn${i === 0 ? ' on' : ''}" data-i="${i}" aria-pressed="${i === 0}"><span class="tl-dot"></span><span class="tl-t">${s[0]}</span><b>${s[1]}</b></button></li>`).join('')}</ol>
      <div class="tl-panel" aria-live="polite">${tl.map((s, i) => `<div class="tl-card${i === 0 ? ' on' : ''}" data-i="${i}"><span class="tl-k">${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p></div>`).join('')}</div>
    </div>
  </div></section>
  <section class="ab-mission"><div class="wrap"><p class="am-k">Our mission</p><blockquote data-reveal>To secure America’s future,<br><span class="mark">one company at a time.</span></blockquote><p class="am-s" data-reveal>For IntegrityShield, that means every organization knowing, every morning, that no one they employ, contract or pay is excluded, sanctioned or conflicted.</p></div></section>
  <section class="sec ab-values"><div class="wrap">
    <div class="ab-head" data-reveal><span class="bar">What drives us</span><h2>Eight principles, built into the product.</h2><p class="lede">The values SureShield was founded on, and where you’ll see them in IntegrityShield.</p></div>
    <div class="vgrid">${values.map((v, i) => `<button type="button" class="vtile" data-reveal aria-expanded="false"><span class="vn">0${i + 1}</span><b>${v[0]}</b><span class="vt">${v[1]}</span><span class="vplus" aria-hidden="true">+</span></button>`).join('')}</div>
  </div></section>
  <section class="sec ab-serve" style="padding-top:0"><div class="wrap ab-grid">
    <div class="ab-copy" data-reveal><span class="bar">Who we serve</span><h2>Built for compliance teams in healthcare.</h2><p class="lede">Healthcare is where screening rules are strictest, so it is where IntegrityShield started. The same screening serves any organization that must prove who it works with.</p></div>
    <ul class="serve">${serve.map(s => `<li data-reveal><b>${s[0]}</b><span>${s[1]}</span></li>`).join('')}</ul>
  </div></section>
  <section class="sec ab-meet" style="padding-top:0"><div class="wrap"><div class="meet" data-reveal>
    <div class="meet-copy"><span class="bar">Discover our team</span><h2>Meet the people behind IntegrityShield.</h2><p class="lede">Operators with backgrounds in healthcare compliance, information security, risk software and finance.</p><a class="btn primary" href="#team">Discover our team ${ARROW}</a></div>
    <a class="meet-faces" href="#team" aria-label="Discover our team">${TEAM.map(p => `<span class="mf"><img src="${p.img}" alt="${p.name}, ${p.role}" width="232" height="326" loading="lazy"><em>${p.name.split(' ')[0]}</em></span>`).join('')}</a>
  </div></div></section>
  <section class="sec" style="padding-top:0" data-faqsec>${faqHTML(ABOUT_FAQ, 'About IntegrityShield: FAQs.')}</section>`;
}
function renderTeam() {
  return `${pageHeroK('IntegrityShield leadership team', 'The people behind <span class="mark">IntegrityShield.</span>',
      'IntegrityShield is built by SureShield’s leadership team: operators with 20+ years of experience in healthcare compliance, information security, risk software and finance.',
      `<div class="tfilter" role="tablist" aria-label="Filter team">${[['all', 'Everyone', TEAM.length], ['leadership', 'Leadership', TEAM.filter(p => p.group === 'leadership').length], ['advisors', 'Advisors', TEAM.filter(p => p.group === 'advisors').length]].map((f, i) => `<button type="button" role="tab" class="tf${i === 0 ? ' on' : ''}" data-f="${f[0]}" aria-selected="${i === 0}">${f[1]} <span>${f[2]}</span></button>`).join('')}</div>`)}
  <section class="sec team-sec"><div class="wrap"><h2 class="vh">Leadership team</h2><div class="tgrid">${TEAM.map((p, i) => `<article class="tcard" data-g="${p.group}" data-reveal>
      <button type="button" class="tc-hit" data-person="${i}" aria-label="View profile: ${p.name}, ${p.role}"></button>
      <div class="tc-ph"><img src="${p.img}" alt="${p.name}, ${p.role} at SureShield" width="232" height="326" loading="lazy"><span class="tc-view">View profile ${ARROW}</span></div>
      <div class="tc-b"><h3>${p.name}</h3><p class="tc-r">${p.role}</p><p class="tc-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</p></div>
    </article>`).join('')}</div></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><div class="tjoin" data-reveal><div><h2>Talk to the team.</h2><p class="lede">Questions about sanctions and exclusion screening or conflict of interest monitoring? We’d like to hear about your program.</p></div><div class="cta-row"><a class="btn primary" href="#contact">Contact us</a><a class="btn ghost" href="#about">About IntegrityShield</a></div></div></div></section>`;
}
function renderTools() {
  const own = [
    ['ses', 'Free exclusion check', 'Search a person or business against OIG LEIE, SAM.gov, the FDA debarment list and state Medicaid exclusion lists.', 'Run the check'],
    ['coi', 'Free Open Payments lookup', 'See the industry payments CMS Open Payments reports for a practitioner, and who made them.', 'Look up payments'],
    ['licensure', 'Free license check', 'Check a practitioner’s license with the state board that issued it.', 'Check a license']];
  const more = [
    ['https://phphealthcare.sure-shield.com/', 'Free PHP2Shell scan for healthcare', 'A free, agentless baseline scan of your organization’s internet-facing systems for PHP2Shell exposure. Nothing to install.', 'Get the free scan'],
    ['https://us-healthcare-cyber-resilience-report.sure-shield.com/', 'US Healthcare Cyber Resilience Report', 'An outside-in look at the internet-facing attack surface of critical access hospitals, from SureShield and BorderHawk. See your hospital’s exposure and run a free email-spoofing check.', 'See the report']];
  return `${pageHeroK('Free compliance and security tools', 'Free tools for <span class="mark">healthcare compliance teams.</span>', 'Run a free check on a practitioner, employee or vendor, or see where your organization stands on cyber risk. No account needed.')}
  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head" data-reveal><div style="display:grid;gap:12px"><span class="bar">IntegrityShield</span><h2>Free integrity checks.</h2></div><p class="lede">The same checks IntegrityShield customers run continuously, one name at a time.</p></div>
    <div class="go-cards">${own.map(([k, t, p, c]) => `<div class="go-card"><span class="sol-ic">${ICONS[k]}</span><h3>${t}</h3><p>${p}</p><div class="cta-row"><a class="btn primary sm" href="#${k}" data-assessgo="${k}">${c}</a></div></div>`).join('')}</div>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head" data-reveal><div style="display:grid;gap:12px"><span class="bar">Also from SureShield</span><h2>Free cybersecurity tools for healthcare.</h2></div><p class="lede">From SureShield, the company behind IntegrityShield.</p></div>
    <div class="go-cards two">${more.map(([u, t, p, c]) => `<div class="go-card tool-ext"><h3>${t}</h3><p>${p}</p><div class="cta-row"><a class="btn ghost sm" href="${u}" target="_blank" rel="noopener">${c} <span aria-hidden="true">↗</span></a></div></div>`).join('')}</div>
  </div></section>`;
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-assessgo]'); if (!a) return;
  e.preventDefault(); goTo(a.dataset.assessgo, '.assess');
});
function renderBlog() {
  const counts = BLOG_CATS.map((c, i) => POSTS.filter(p => p.cat === i).length);
  return `${pageHeroK('Exclusion &amp; COI compliance guides', 'Compliance guides for screening that <span class="mark">holds up in an audit.</span>',
      'Sanctions screening, exclusion monitoring and conflict of interest compliance, explained for compliance officers: OIG and SAM checks, state Medicaid exclusion lists and CMS Open Payments.')}
  <section class="sec blog-sec" style="padding-top:clamp(28px,4vw,40px)"><div class="wrap">
    <div class="btools">
      <label class="bsearch"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.7"/><path d="m14 14 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><input type="search" placeholder="Search articles, for example OIG or Open Payments" aria-label="Search articles" data-bsearch></label>
      <div class="bchips" role="tablist" aria-label="Filter by topic"><button type="button" class="bc on" data-bc="-1" aria-selected="true">All <span>${POSTS.length}</span></button>${BLOG_CATS.map((c, i) => `<button type="button" class="bc" data-bc="${i}" aria-selected="false">${c} <span>${counts[i]}</span></button>`).join('')}</div>
    </div>
    <p class="bcount note" aria-live="polite" data-bcount></p>
    <h2 class="vh">Articles</h2>
    <div class="bgrid" data-bgrid>${POSTS.map((p, i) => postCard(p, i === 0)).join('')}</div>
    <p class="bempty" hidden>No articles match. Try another word, or <button type="button" class="link" data-bclear>clear the filters</button>.</p>
    <p class="note" style="margin-top:22px">Articles are placeholders for this demo. Full posts are coming soon.</p>
  </div></section>`;
}
const SOCIALS = [["linkedin", "LinkedIn", "SureShield", "https://www.linkedin.com/company/sureshield", "<path fill=\"currentColor\" d=\"M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.03-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96V21H9z\"/>"], ["x", "X", "@ShieldSure", "https://x.com/ShieldSure", "<path fill=\"currentColor\" d=\"M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78zm-1.08 16.2h1.7L7.4 4.73H5.58z\"/>"], ["youtube", "YouTube", "@sureshieldinc4561", "https://www.youtube.com/@sureshieldinc4561", "<path fill=\"currentColor\" d=\"M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.75 15.02V8.98L15.5 12z\"/>"], ["instagram", "Instagram", "@sureshield.ai", "https://www.instagram.com/sureshield.ai", "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"17.5\" cy=\"6.5\" r=\"1.3\" fill=\"currentColor\"/>"], ["facebook", "Facebook", "SureShield, Inc.", "https://www.facebook.com/people/SureShield-Inc/61584576941329/", "<path fill=\"currentColor\" d=\"M14 8h3V4h-3c-2.76 0-4.5 1.79-4.5 4.6V11H7v4h2.5v7h4v-7h3l.5-4h-3.5V8.9c0-.6.4-.9 1-.9z\"/>"]];
function socialsHTML() {
  return `<section class="sec socials-sec" style="padding-top:0"><div class="wrap">
    <div class="sec-head" data-reveal><div style="display:grid;gap:12px"><span class="bar">Follow us</span><h2>Follow <span class="mark">SureShield.</span></h2></div>
      <p class="lede">Product updates, webinar announcements and compliance news, wherever you follow along.</p></div>
    <div class="socs" data-reveal>${SOCIALS.map(([k, n, h, u, b]) => `<a class="soc soc-${k}" href="${u}" target="_blank" rel="noopener"><span class="soc-ic"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${b}</svg></span><span class="soc-t"><b>${n}</b><span>${h}</span></span><span class="soc-go" aria-hidden="true">↗</span></a>`).join('')}</div>
  </div></section>`;
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-follow]'); if (!a) return;
  e.preventDefault(); scrollToEl(document.querySelector('main:not([hidden]) .socials-sec') || document.querySelector('.socials-sec'));
});
function renderContact() {
  const opts = [
    ['Call sales', '1-800-604-1354', 'Talk to someone about your screening program.', 'tel:18006041354'],
    ['Email us', 'info@sureshield.ai', 'Questions, quotes and support.', 'mailto:info@sureshield.ai'],
    ['Headquarters', 'Atlanta, Georgia', '3343 Peachtree Rd NE, Ste 145-1564, Atlanta, GA 30326', '']
  ];
  const topics = ['Sanctions & exclusion screening', 'Conflict of interest monitoring', 'Licensure & credential management', 'Pricing', 'Something else'];
  return `${pageHeroK('Contact IntegrityShield', 'Talk to the <span class="mark">IntegrityShield team.</span>',
      'Questions about sanctions and exclusion screening, conflict of interest monitoring or pricing? Book a demo, join a live webinar or send us a note, and <a class="mlink" href="#contact" data-follow>follow SureShield</a> on LinkedIn, X, YouTube, Instagram and Facebook for product news and webinar updates.',
      `<div class="cta-row"><button class="btn primary" data-go="demo">Book a demo</button><button class="btn ghost" data-to-web>Join a webinar</button></div>`)}
  <section class="sec" style="padding-top:clamp(36px,5vw,56px)"><div class="wrap">
    <div class="copts">${opts.map(o => `<${o[3] ? `a href="${o[3]}"` : 'div'} class="copt" data-reveal><span class="co-k">${o[0]}</span><b>${o[1]}</b><span>${o[2]}</span></${o[3] ? 'a' : 'div'}>`).join('')}</div>
    <div class="cform-wrap" data-reveal>
      <div class="cf-copy"><div class="cf-std"><h2>Send us a message.</h2><p class="lede">Tell us what you screen today and what you need. The right person on our team will get back to you within the next 48 hours.</p></div><div class="cf-ent"><h2>Talk to us about Enterprise.</h2><p class="lede">Leave your name and work email. Our team will contact you to scope your Enterprise plan.</p></div></div>
      <form class="cform" novalidate><input class="hp" name="ish_trap_x" tabindex="-1" autocomplete="off" readonly data-lpignore="true" data-1p-ignore aria-hidden="true">
        <p class="ent-tag"><b>Enterprise plan</b><button type="button" class="link" data-ent-off>Not an Enterprise inquiry?</button></p>
        <fieldset class="topics"><legend>What can we help with?</legend>${topics.map((t, i) => `<label class="topic"><input type="radio" name="topic" value="${t}"${i === 0 ? ' checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>
        <div class="two"><label>Full name<input name="name" autocomplete="name"></label><label>Work email<input name="email" type="email" autocomplete="email"></label></div>
        <div class="two ph-row"><label>Organization<input name="org" autocomplete="organization"></label><label class="ph-l">Phone (optional)<input name="phone" type="tel" autocomplete="tel"></label></div>
        <label>Message<textarea name="msg" rows="4" placeholder="For example: we screen 3,000 employees and 600 vendors monthly and want to move to nightly screening."></textarea></label>
        <p class="err" hidden></p>
        ${nlBox()}${consentBox()}
        <button class="btn primary" type="submit">Send message</button>
        ${scanApi() ? '' : '<p class="note">Demo form. Nothing is sent.</p>'}
      </form>
      <div class="cdone" hidden><span class="wd-ic" aria-hidden="true">✓</span><p class="wf-title">${scanApi() ? 'Thanks, your message is on its way.' : 'Thanks, your message is ready.'}</p><p class="cd-t"></p><button type="button" class="btn ghost sm" data-c-again>Send another</button></div>
    </div>
  </div></section>
  ${socialsHTML()}
  ${webinarNextHTML('contact')}
  ${bookHTML('gen')}
  <section class="sec" style="padding-top:0" data-faqsec>${faqHTML(CONTACT_FAQ, 'Contact FAQs.')}</section>`;
}
function blogHomeHTML() {
  return `<section class="sec blog-home"><div class="wrap">
    <div class="bh-head" data-reveal><div><span class="bar">From the blog</span><h2>Integrity compliance nuggets from our blog posts.</h2></div><p class="lede">Practical answers on OIG exclusion checks, SAM and state Medicaid screening, and conflict of interest monitoring with CMS Open Payments.</p><a class="mlink" href="#blog">Read all articles ${ARROW}</a></div>
    <div class="bgrid three">${[0, 3, 6].map(i => postCard(POSTS[i])).join('')}</div>
  </div></section>`;
}

$('#page-about').innerHTML = renderAbout();
$('#page-team').innerHTML = renderTeam();
$('#page-blog').innerHTML = renderBlog();
$('#page-tools').innerHTML = renderTools();
$('#page-contact').innerHTML = renderContact();
$('#page-faq').innerHTML = renderFaqPage();
['privacy', 'terms', 'cookies', 'accessibility', 'security'].forEach(k => { $('#page-' + k).innerHTML = renderInfoPage(k); });
$('[data-blog="home"]').outerHTML = blogHomeHTML();


$('[data-faq="home"]').innerHTML = faqHTML(HOME_FAQ);
$('[data-faq="home"]').setAttribute('data-faqsec', '');
$('[data-cta="home"]').outerHTML = webinarNextHTML();
$$('[data-mv]').forEach(el => { el.innerHTML = MV[el.dataset.mv](); });

const half = Math.ceil(SOURCES.length / 2);
const mqFill = (el, list) => { const html = list.map(s => `<span class="s-${s.k}">${s.n}</span>`).join(''); el.innerHTML = html + html; };
mqFill($('#mq1'), SOURCES.slice(0, half));
mqFill($('#mq2'), SOURCES.slice(half));

// customer wordmarks (placeholders until real logo files arrive)
/* Customer marks. To show a real logo, add its file to /logos and set img (and a width). */
const CUSTOMERS = [
  {b: 'Atlas', s: 'Healthcare Partners', mono: 'AH', img: ''},
  {b: 'Genesis', s: 'Healthcare System', mono: 'GH', img: ''},
  {b: 'Medical Home', s: 'Network', mono: 'MH', img: ''},
  {b: 'MHN ACO', s: 'LLC', mono: 'MA', img: ''},
  {b: 'Precision', s: 'Diagnostics', mono: 'PD', img: 'data:image/webp;base64,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'},
  {b: 'Gold Coast', s: 'Health Plan (GCHP)', mono: 'GC', img: ''}
];
const LOGOS = CUSTOMERS.map(c => c.img
  ? `<div class="lg lg-img"><img src="${c.img}" alt="${c.b} ${c.s}" loading="lazy" decoding="async"></div>`
  : `<div class="lg"><i class="lg-mono" aria-hidden="true">${c.mono}</i><span><b>${c.b}</b><small>${c.s}</small></span></div>`);
const set = LOGOS.join('').repeat(3);
$('#lgTrack').innerHTML = set + set;



/* ---------- nav ---------- */
const nav = $('#nav'), dd = $('#dd'), ddBtn = $('#ddBtn'), msheet = $('#msheet'), menuBtn = $('#menuBtn');
let ddTimer;
const setDD = open => { dd.classList.toggle('open', open); ddBtn.setAttribute('aria-expanded', open); };
ddBtn.addEventListener('click', e => { e.stopPropagation(); setDD(!dd.classList.contains('open')); });
dd.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { clearTimeout(ddTimer); setDD(true); } });
dd.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') ddTimer = setTimeout(() => setDD(false), 180); });
const setSheet = open => { msheet.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); menuBtn.textContent = open ? 'Close' : 'Menu'; };
menuBtn.addEventListener('click', e => { e.stopPropagation(); setSheet(!msheet.classList.contains('open')); });
document.addEventListener('click', e => { if (!dd.contains(e.target)) setDD(false); if (!msheet.contains(e.target) && e.target !== menuBtn) setSheet(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { setDD(false); setSheet(false); } });

/* ---------- router ---------- */
const metaDesc = document.querySelector('meta[name="description"]');
let route = null, active = null, pending = null;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const routeFromHash = () => { const h = document.documentElement.dataset.route || 'home'; return ROUTES[h] ? h : 'home'; };
function flushPending(delay) {
  if (!pending) return;
  const sel = pending; pending = null;
  setTimeout(() => scrollToEl(active.querySelector(sel)), delay);
}
function show(r, instant) {
  const next = $('#page-' + r);
  setDD(false); setSheet(false);
  if (active === next) { flushPending(0); return; }
  const prev = active;
  route = r; active = next;
  document.title = ROUTES[r].title;
  if (metaDesc) metaDesc.setAttribute('content', ROUTES[r].desc);
  $$('[data-nav]').forEach(a => { const on = a.dataset.nav === r; a.classList.toggle('cur', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  ddBtn.classList.toggle('cur', SOLS.includes(r));
  const enter = () => { scrollToY(0, true); onEnter(); flushPending(reduce ? 0 : 180); };
  if (!prev || instant || reduce) { if (prev) prev.hidden = true; next.hidden = false; enter(); return; }
  prev.classList.add('leaving');
  setTimeout(() => {
    prev.hidden = true; prev.classList.remove('leaving');
    next.classList.add('entering'); next.hidden = false;
    enter();
    requestAnimationFrame(() => requestAnimationFrame(() => next.classList.remove('entering')));
  }, 320);
}
window.addEventListener('hashchange', () => { const s = HASH_SEC[location.hash.slice(1)]; if (s) scrollToEl(active.querySelector(s)); });

function scrollToEl(el) { if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 90); }
const SECT = {book: '.book', plans: '[data-plans-sec]', faq: '[data-faqsec]'};
function goTo(sol, sel) {
  if (route === sol) { scrollToEl(active.querySelector(sel)); return; }
  location.href = U(sol) + (SEC_HASH[sel] ? '#' + SEC_HASH[sel] : '');
}
function go(target) {
  if (target === 'demo') { if (SOLS.includes(route) || route === 'contact') scrollToEl(active.querySelector('.book')); else goTo('contact', '.book'); return; }
  if (target === 'plans') { scrollToEl(active.querySelector('[data-plans-sec]')); return; }
  if (target === 'assess') { const a = active.querySelector('.assess'); if (a) { scrollToEl(a); const i = a.querySelector('input'); if (i) setTimeout(() => i.focus({preventScroll: true}), 600); } return; }
  if (target === 'faq') { const f = active.querySelector('[data-faqsec]'); if (f) scrollToEl(f); else goTo('home', '[data-faqsec]'); return; }
  if (target === 'sols') { scrollToEl($('#modules')); return; }
}
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g) { e.preventDefault(); setSheet(false); go(g.dataset.go); return; }
  const t = e.target.closest('[data-to]');
  if (t) { e.preventDefault(); setSheet(false); const [sol, sec] = t.dataset.to.split(':'); goTo(sol, SECT[sec]); return; }
  const pr = e.target.closest('[data-pr]');
  if (pr) { PR.sol = pr.dataset.pr; }
});

/* ---------- reveals + counters ---------- */
let io;
function setupReveal() {
  if (io) io.disconnect();
  if (reduce || !('IntersectionObserver' in window)) return;
  io = new IntersectionObserver(ents => ents.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.remove('pre');
    $$('[data-count]', en.target).forEach(countUp);
    io.unobserve(en.target);
  }), {threshold: .15, rootMargin: '0px 0px -6% 0px'});
  $$('[data-reveal]', active).forEach(el => {
    if (el.getBoundingClientRect().top > innerHeight * .92) el.classList.add('pre');
    io.observe(el);
  });
}
function countUp(el) {
  if (el.dataset.done) return; el.dataset.done = '1';
  const to = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, sep = +el.dataset.sep;
  const fmt = v => sep ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec);
  const t0 = performance.now(), dur = 1100;
  const step = t => { const p = clamp((t - t0) / dur); el.textContent = fmt(to * ease(p)); if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(to); };
  requestAnimationFrame(step);
}

/* ---------- hero ticks ---------- */
function fillTicks() { sbStart(); }


/* ---------- scroll loop ---------- */
const heroConsole = $('#heroConsole');
function update() {
  const y = window.scrollY, vh = innerHeight;
  nav.classList.toggle('scrolled', y > 24);
  if (route === 'home') {
    if (!reduce) {
      const p = clamp(y / (vh * .5));
      heroConsole.style.transform = `rotateX(${(1-p)*8}deg) scale(${.96 + .04*p})`;
    }
  }
  if (!reduce && active) {
    $$('.zoomin', active).forEach(h => {
      const r = h.getBoundingClientRect();
      h.style.transform = `scale(${.94 + .06 * ease(clamp((vh - r.top) / (vh * .7)))})`;
    });
  }
}
let ticking = false;
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } }, {passive: true});
window.addEventListener('resize', () => { buildHub(); update(); });
function onEnter() {
  setupReveal();
  update();
  if (route === 'pricing') renderPlans($('#page-pricing [data-plans]'));
  if (route === 'checkout') renderCheckout();
  if (route === 'licensure' && scanApi()) $$('#page-licensure .lic-scan').forEach(licInit);
  if (route === 'licensure') $$('#page-licensure .lic-scan form[data-assess]').forEach(licGateInit);
  if (route === 'ses') $$('#page-ses .ses-scan form[data-assess]').forEach(licGateInit);
}

/* ---------- dashboard showcase: real product views rotate (illustrative data) ---------- */
const dshow = $('#heroConsole.dshow');
if (dshow) {
  const DROOT = document.documentElement.dataset.root || '';
  const dSrc = u => /^(data:|https?:|\/)/.test(u) ? u : DROOT + u;
  const imgs = $$('.dshow-stage img', dshow), tabs = $$('.dshow-tabs button', dshow), ttl = $('#dshowTtl');
  const DT = 6000; let di = 0, dTimer = 0, held = false;
  imgs.forEach((im, i) => { if (i === 0) im.src = dSrc(im.dataset.src); });
  const loadAll = () => imgs.forEach(im => { if (!im.getAttribute('src')) im.src = dSrc(im.dataset.src); });
  const label = i => tabs[i].querySelector('.l').textContent;
  function dGo(i, user) {
    di = (i + imgs.length) % imgs.length; loadAll();
    imgs.forEach((im, j) => im.classList.toggle('on', j === di));
    tabs.forEach((b, j) => { b.classList.toggle('on', j === di); b.setAttribute('aria-selected', j === di); const bar = b.querySelector('i'); bar.style.transition = 'none'; bar.style.width = '0'; });
    if (ttl) ttl.textContent = 'IntegrityShield · ' + label(di) + ' dashboard';
    dArm();
  }
  function dArm() {
    clearTimeout(dTimer);
    const bar = tabs[di].querySelector('i');
    if (reduce || held) { bar.style.transition = 'none'; bar.style.width = reduce ? '100%' : '0'; return; }
    bar.offsetWidth; bar.style.transition = `width ${DT}ms linear`; bar.style.width = '100%';
    dTimer = setTimeout(() => { if (route === 'home' && !document.hidden) dGo(di + 1); else dArm(); }, DT);
  }
  tabs.forEach((b, i) => b.addEventListener('click', () => dGo(i, true)));
  dshow.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { held = true; dshow.classList.add('held'); dArm(); } });
  dshow.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { held = false; dshow.classList.remove('held'); dArm(); } });
  dshow.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); dGo(di + (e.key === 'ArrowRight' ? 1 : -1), true); tabs[di].focus(); } });
  setTimeout(loadAll, 2500);
  dArm();
}
/* the footer button opens the 404 page */
$$('[data-404-link]').forEach(a => {
  const root = document.documentElement.dataset.root;
  const multi = root !== undefined, base = multi ? root : '';
  const home = new URL(multi ? (root || './') : location.pathname.split('/').pop() || './', location.href).href;
  a.href = base + '404.html?home=' + encodeURIComponent(home) + (multi ? '' : '&spa=1');
});

/* ---------- solutions accordion ---------- */
$$('.sol-card').forEach(card => {
  const btn = card.querySelector('.sol-btn');
  btn.addEventListener('click', () => {
    const open = !card.classList.contains('open');
    card.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.querySelector('span').textContent = open ? 'Show less' : 'Learn more';
  });
});

/* ---------- gentle live loops ---------- */
let aTick = 0;
if (!reduce) setInterval(() => {
  if (!active || document.hidden) return;
  aTick++;
  $$('.exl', active).forEach(ul => { const lis = Array.from(ul.children), i = aTick % lis.length; lis.forEach((li, j) => li.classList.toggle('lit', j === i && !li.matches('.hitrow,.warn'))); });
  $$('[data-anim="sources"] .srcl', active).forEach(ul => {
    const lis = Array.from(ul.children), i = aTick % lis.length;
    lis.forEach((li, j) => { const t = li.querySelector('time'); if (j === i) { li.classList.add('sync'); t.textContent = 'syncing'; } else if (li.classList.contains('sync')) { li.classList.remove('sync'); t.textContent = t.dataset.t; } });
  });
  $$('[data-anim="assets"] tbody', active).forEach(tb => { const trs = Array.from(tb.children), i = aTick % trs.length; trs.forEach((tr, j) => tr.classList.toggle('scanning', j === i && !tr.classList.contains('bad'))); });
}, 1200);

/* ---------- departments hub ---------- */
let hubMode = '';
const HUB_DEPTS = [
  ['l', ['HR & Employee', 'Onboarding']],
  ['l', ['Revenue Cycle Management', '& Payor Billing']],
  ['l', ['Supply Chain Management', '& Procurement']],
  ['r', ['Contract Management', '& Finance']],
  ['r', ['Risk & Compliance', '/ Legal']],
  ['r', ['Professional Staff', 'Credentialing & Privileging']]
];
const HUB_SOLS = [['HSES', 'Exclusions'], ['COI', 'Conflicts'], ['LCM', 'Licensure']];
function buildHub() {
  const host = $('#hubSvg'); if (!host || !host.clientWidth) return;
  const portrait = host.clientWidth < 700, mode = portrait ? 'p' : 'l';
  if (mode === hubMode) return; hubMode = mode;
  const esc = s => s.replace(/&/g, '&amp;');
  let wires = '', boxes = '', pk = '', vb, core;
  const box = (x, y, w, h, lines, fs) => `<g class="dept"><rect class="box" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="12"/><text x="${x}" y="${y - 3}" text-anchor="middle" style="font-size:${fs}px">${esc(lines[0])}</text><text x="${x}" y="${y + fs + 1}" text-anchor="middle" style="font-size:${fs}px">${esc(lines[1])}</text></g>`;
  const coreBox = (cx, cy, cw, ch) => {
    const lw = Math.min(230, cw - 60), lh = lw * 64 / 261, ly = cy - ch / 2 + 16;
    const cwid = 108, gap = 12, x0 = cx - (3 * cwid + 2 * gap) / 2, cy2 = ly + lh + 12;
    let chips = '';
    HUB_SOLS.forEach(([a, b], i) => {
      const x = x0 + i * (cwid + gap);
      chips += `<rect class="chip" x="${x}" y="${cy2}" width="${cwid}" height="44" rx="9"/><text class="ca" x="${x + cwid / 2}" y="${cy2 + 19}" text-anchor="middle">${a}</text><text class="cb" x="${x + cwid / 2}" y="${cy2 + 35}" text-anchor="middle">${b}</text>`;
    });
    return `<rect class="core" x="${cx - cw / 2}" y="${cy - ch / 2}" width="${cw}" height="${ch}" rx="16"/><image href="${LOGO}" x="${cx - lw / 2}" y="${ly}" width="${lw}" height="${lh}"/>${chips}`;
  };
  const packets = (i, rev) => {
    if (reduce) return '';
    const dur = 4 + i * .35;
    return `<circle r="4" class="pk-out"><animateMotion dur="${dur}s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear" begin="${i * .45}s"><mpath href="#w${i}"/></animateMotion></circle>` +
      `<circle r="3.2" class="pk-in"><animateMotion dur="${dur + .8}s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear" begin="${i * .4 + 1.2}s"><mpath href="#w${i}"/></animateMotion></circle>`;
  };
  if (!portrait) {
    vb = '0 0 1000 350';
    const cx = 500, cy = 175, cw = 400, ch = 156, bw = 262, bh = 72, ys = [48, 175, 302];
    let li = 0, ri = 0;
    HUB_DEPTS.forEach(([side, lines], i) => {
      const k = side === 'l' ? li++ : ri++, y = ys[k];
      const x = side === 'l' ? 20 + bw / 2 : 980 - bw / 2;
      const sx = side === 'l' ? cx - cw / 2 : cx + cw / 2, ex = side === 'l' ? x + bw / 2 : x - bw / 2;
      const sy = [cy - 50, cy, cy + 50][k], mx = (sx + ex) / 2;
      wires += `<path class="wire" id="w${i}" d="M${sx} ${sy} C ${mx} ${sy}, ${mx} ${y}, ${ex} ${y}"/>`;
      boxes += box(x, y, bw, bh, lines, 16);
      pk += packets(i);
    });
    core = coreBox(cx, cy, cw, ch);
  } else {
    vb = '0 0 400 500';
    const cx = 200, cy = 92, cw = 360, ch = 150, bw = 176, bh = 70, ys = [270, 360, 450], bus = 196;
    let li = 0, ri = 0;
    HUB_DEPTS.forEach(([side, lines], i) => {
      const k = side === 'l' ? li++ : ri++, y = ys[k];
      const x = side === 'l' ? 104 : 296, sp = side === 'l' ? 8 : 392, edge = side === 'l' ? 16 : 384;
      wires += `<path class="wire" id="w${i}" d="M${cx} ${cy + ch / 2} V${bus} H${sp} V${y} H${edge}"/>`;
      boxes += box(x, y, bw, bh, lines, 12.5);
      pk += packets(i);
    });
    core = coreBox(cx, cy, cw, ch);
  }
  host.innerHTML = `<svg viewBox="${vb}" role="img" aria-label="IntegrityShield, with its HSES, COI and LCM checks, exchanging records and results with HR and employee onboarding, risk and compliance and legal, supply chain and procurement, contract management and finance, revenue cycle and payor billing, and professional staff credentialing and privileging">${wires}${pk}${boxes}${core}</svg>`;
}

/* ---------- free assessments ---------- */
const hashStr = s => { let h = 0; for (const ch of s.toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
const clean = s => s.replace(/[<>&"]/g, '');
const OP_YEARS = ['2025', '2024','2023','2022','2021','2020','2019','2018','2017'];
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-assess]');
  if (!f) return;
  e.preventDefault();
  if (f.dataset.busy) return;
  const kind = f.dataset.assess, out = f.parentElement.querySelector('.ck-out');
  const q = f.elements.q.value.trim();
  if (!q) {
    out.innerHTML = `<div class="ck-head"><b>Enter a name to search</b></div><p class="note">${kind === 'ses' ? 'Type a full name or business name, then search.' : 'Type a practitioner’s full name, then search.'}</p>`;
    f.elements.q.focus(); return;
  }
  if (kind === 'licensure' && !f.elements.state.value) {
    out.innerHTML = `<div class="ck-head"><b>Choose a state</b></div><p class="note">Pick the state that issued the license, then scan.</p>`;
    f.elements.state.focus(); return;
  }
  if (kind === 'licensure' && f.elements.npi.value.trim() && !/^\d{10}$/.test(f.elements.npi.value.trim())) {
    out.innerHTML = `<div class="ck-head"><b>Check the NPI</b></div><p class="note">An NPI is 10 digits. Leave it blank if you don’t have it.</p>`;
    f.elements.npi.focus(); return;
  }
  f.dataset.busy = '1';
  const safe = clean(q);
  out.innerHTML = `<div class="ck-head"><b>${safe}</b><span class="chip acc">Searching</span></div><div class="ck-bar"><span></span></div><div class="ck-tick">Starting</div>`;
  const bar = out.querySelector('.ck-bar span'), tick = out.querySelector('.ck-tick');
  const list = SOURCES.slice(0, 24), dur = reduce ? 200 : 1600, t0 = performance.now();
  const step = t => {
    const p = clamp((t - t0) / dur);
    bar.style.width = (p * 100) + '%';
    tick.textContent = kind === 'licensure'
      ? `Verifying at the source · ${['Finding the license', 'Checking license status', 'Checking the expiration date', 'Checking for disciplinary actions', 'Preparing the result'][Math.min(4, Math.floor(p * 5))]}`
      : kind === 'coi'
      ? `Searching CMS Open Payments, payments made or received ${OP_YEARS[Math.min(7, Math.floor(p * 8))]}`
      : `Checking screening data sources · ${list[Math.floor(p * (list.length - 1))]}`;
    if (p < 1) requestAnimationFrame(step); else done();
  };
  const done = () => {
    const h = hashStr(q);
    const foot = '<span class="demo-note"><b>Sample result.</b> The live check isn’t connected yet, so no real records were searched and this is not a finding about this person.</span>';
    if (kind === 'ses') {
      const type = f.elements.type.value.toLowerCase();
      out.innerHTML = h % 5 === 0
        ? `<div class="ck-head">${FACE.maybe}<b>${safe}</b><span class="chip warn">Possible matches found</span></div><div class="ck-res"><span><strong>SAM.gov Exclusions</strong> · ${type} · 88% name similarity</span><span>No date of birth to confirm. IntegrityShield would request more data automatically.</span>${foot}${reportCTA('ses')}</div>`
        : `<div class="ck-head">${FACE.ok}<b>${safe}</b><span class="chip res">No match found</span></div><div class="ck-res"><span>Checked against all screening data sources, including OIG LEIE, SAM.gov and state Medicaid lists.</span>${foot}${reportCTA('ses')}</div>`;
    } else if (kind === 'licensure') {
      const lt = f.elements.ltype.value, st = clean(f.elements.state.value);
      const board = (LIC_TYPES.find(x => x[0] === lt) || LIC_TYPES[7])[1];
      const src = `${st} ${board}`;
      const fmtD = d => d.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
      const base = new Date(); base.setHours(0, 0, 0, 0);
      const r = h % 6, lic = `${lt} · ${st}`;
      if (r === 0) {
        out.innerHTML = `<div class="ck-head">${FACE.maybe}<b>${safe}</b><span class="chip match">Disciplinary action found</span></div><div class="ck-res">${licRows([['License', lic], ['Status', 'Active, with conditions', 'bad'], ['Expires', fmtD(new Date(base.getFullYear() + 1, (h >>> 3) % 12, 28))], ['Disciplinary actions', `Board order on record · probation · ${base.getFullYear() - 1 - (h >>> 5) % 3}`, 'bad'], ['Verified with', src]])}<span>Review the board order before this practitioner’s next privileging decision.</span>${foot}${reportCTA('licensure')}</div>`;
      } else if (r === 1) {
        const exp = new Date(base.getTime() + (12 + (h >>> 4) % 40) * 864e5);
        out.innerHTML = `<div class="ck-head">${FACE.maybe}<b>${safe}</b><span class="chip warn">Renewal due soon</span></div><div class="ck-res">${licRows([['License', lic], ['Status', 'Active'], ['Expires', `${fmtD(exp)} · in ${Math.round((exp - base) / 864e5)} days`, 'warn'], ['Disciplinary actions', 'None found'], ['Verified with', src]])}<span>IntegrityShield-LCM would alert you before it lapses.</span>${foot}${reportCTA('licensure')}</div>`;
      } else if (r === 2 && !f.elements.lno.value.trim()) {
        out.innerHTML = `<div class="ck-head">${FACE.maybe}<b>${safe}</b><span class="chip warn">No exact license match</span></div><div class="ck-res">${licRows([['License', lic], ['Result', 'No license found for this name', 'warn'], ['Verified with', src]])}<span>Add the license number or NPI and scan again to narrow it down.</span>${foot}</div>`;
      } else {
        out.innerHTML = `<div class="ck-head">${FACE.ok}<b>${safe}</b><span class="chip res">Active, no actions found</span></div><div class="ck-res">${licRows([['License', lic], ['Status', 'Active'], ['Expires', fmtD(new Date(base.getFullYear() + 1 + (h >>> 6) % 2, (h >>> 3) % 12, 28))], ['Disciplinary actions', 'None found'], ['Verified with', src]])}${foot}${reportCTA('licensure')}</div>`;
      }
    } else {
      const vendor = clean(f.elements.vendor.value.trim());
      if (h % 3 === 0) {
        out.innerHTML = `<div class="ck-head"><b>${safe}</b><span class="chip res">No reported payments</span></div><div class="ck-res"><span>No industry payments found in CMS Open Payments.</span>${foot}${reportCTA('coi')}</div>`;
      } else {
        const n = 2 + h % 6, amt = (h % 90 + 4) * 850;
        const payer = vendor || ['Acme Ortho','Globex Bio','Initech Surgical'][h % 3];
        out.innerHTML = `<div class="ck-head"><b>${safe}</b><span class="chip match">${n} payments found</span></div><div class="ck-res"><span><strong>$${amt.toLocaleString('en-US')}</strong> in reported payments. Largest payer: <strong>${payer}</strong>.</span><span>Consulting fees and travel. Recommended for conflict-of-interest review.</span>${foot}${reportCTA('coi')}</div>`;
      }
    }
    delete f.dataset.busy;
    if (kind === 'licensure') licAfterScan(f, out);
  };
  requestAnimationFrame(step);
});

/* ---------- free licensure scans: bot check, 10-scan allowance (cookie), next-step buttons ---------- */
const LIC_FREE = 10;
const TS_TEST_KEY = '1x00000000000000000000AA';   /* Cloudflare's public test key, used only while the scan shows sample results */
const licMem = {};
function licCookie(name, val) {
  if (val === undefined) {
    try { const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)')); if (m) return decodeURIComponent(m[1]); } catch (e) {}
    return licMem[name] == null ? null : licMem[name];
  }
  licMem[name] = String(val);
  try { document.cookie = `${name}=${encodeURIComponent(val)}; Max-Age=31536000; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`; } catch (e) {}
}
const licCK = f => 'is_scans_' + (f && f.dataset && f.dataset.assess === 'ses' ? 'ses' : 'lic');   // necessary cookie: free assessments used, per solution
const licUsed = f => Math.max(0, parseInt(licCookie(licCK(f)) || '0', 10) || 0);
function licVid() {
  let v = licCookie('is_vid');
  if (!/^[a-f0-9]{24}$/.test(v || '')) {
    const a = new Uint8Array(12);
    try { crypto.getRandomValues(a); } catch (e) { for (let i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 256); }
    v = [...a].map(x => x.toString(16).padStart(2, '0')).join('');
    licCookie('is_vid', v);
  }
  return v;
}
function licQuota(f) {
  const q = f.querySelector('[data-lic-quota]'); if (!q) return;
  const left = Math.max(0, LIC_FREE - licUsed(f));
  q.textContent = left >= LIC_FREE ? `${LIC_FREE} free assessments included.` : `${left} of ${LIC_FREE} free assessments left.`;
}
const LIC_BTNS = {
  subscribe: t => `<button type="button" class="btn primary" data-lic-cta="subscribe">${t}</button>`,
  call: () => `<button type="button" class="btn ghost" data-lic-cta="call">Set up a call with us</button>`,
  again: () => `<button type="button" class="btn ghost" data-lic-cta="again">Run another scan</button>`
};
function licNextHTML(f) {
  const prod = f && f.dataset.assess === 'ses' ? 'IntegrityShield-HSES' : 'IntegrityShield-LCM';
  const left = Math.max(0, LIC_FREE - licUsed(f));
  return `<div class="lic-next"><p class="lic-left">${left ? `<b>${left} of ${LIC_FREE}</b> free assessments left` : 'That was your last free assessment'}</p><div class="lic-ctas">${LIC_BTNS.subscribe('Subscribe to ' + prod)}${LIC_BTNS.call()}${LIC_BTNS.again()}</div></div>`;
}
function licLimitHTML() {
  return `<div class="ck-head">${FACE.maybe}<b>You’ve used your ${LIC_FREE} free assessments</b></div><div class="ck-res"><span>Subscribe to verify and monitor every practitioner’s licenses continuously, or set up a call and we’ll walk you through it.</span><div class="lic-ctas">${LIC_BTNS.subscribe('Subscribe to our platform')}${LIC_BTNS.call()}</div></div>`;
}
function licLock(f, out) {
  if (!f) return;
  f.classList.add('locked');
  f.querySelectorAll('input, select, button').forEach(x => { x.disabled = true; });
  const b = f.querySelector('button[type=submit]'); if (b) b.textContent = 'Free assessments used';
  licQuota(f);
  if (out) out.innerHTML = licLimitHTML();
}
function licAfterScan(f, out, remaining) {
  let used = licUsed(f) + 1;
  if (typeof remaining === 'number') used = Math.max(used, LIC_FREE - remaining);
  licCookie(licCK(f), Math.min(used, LIC_FREE));
  const res = out.querySelector('.ck-res') || out;
  res.insertAdjacentHTML('beforeend', licNextHTML(f));
  licQuota(f); licTsReset(f);
}

/* bot check: Cloudflare Turnstile */
function licTsKey() { return turnstileSiteKey() || (scanApi() ? '' : TS_TEST_KEY); }
function licTsInit(f) {
  const box = f.querySelector('[data-lic-ts]');
  if (!box || box.dataset.init) return;
  box.dataset.init = '1';
  const key = licTsKey();
  if (!key) { box.dataset.none = '1'; return; }
  const rc = /^6L/.test(key);
  const api = () => rc ? (window.grecaptcha && typeof window.grecaptcha.render === 'function' ? window.grecaptcha : null) : window.turnstile;
  box.innerHTML = '<p class="note">Loading the security check…</p>';
  const render = () => {
    if (box.dataset.wid || !api()) return;
    box.innerHTML = '';
    try {
      box.dataset.rc = rc ? '1' : '';
      box.dataset.wid = String(rc ? api().render(box, {sitekey: key, theme: 'light'}) : api().render(box, {sitekey: key, size: 'flexible', theme: 'light', action: 'licensure-scan'}));
    } catch (e) { fail(); }
  };
  const fail = () => {
    if (box.dataset.wid) return;
    if (!scanApi()) {
      box.dataset.fallback = '1';
      box.innerHTML = `<label class="lic-human"><input type="checkbox" data-human><span>I’m not a robot</span></label><p class="note">Preview stand-in. The live site shows a security check here.</p>`;
    } else box.innerHTML = '<p class="note">The security check couldn’t load. Refresh the page to try again.</p>';
  };
  if (api()) return render();
  if (!document.getElementById('cf-ts')) {
    const s = document.createElement('script');
    s.id = 'cf-ts'; s.async = true; s.defer = true;
    s.src = rc ? 'https://www.google.com/recaptcha/api.js?render=explicit' : 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.onerror = () => document.querySelectorAll('[data-lic-ts]').forEach(x => x.dispatchEvent(new Event('ts-fail')));
    document.head.appendChild(s);
  }
  box.addEventListener('ts-fail', fail);
  const t0 = Date.now();
  const iv = setInterval(() => { if (api()) { clearInterval(iv); render(); } else if (Date.now() - t0 > 10000) { clearInterval(iv); fail(); } }, 250);
}
const licTsApi = box => box.dataset.rc ? window.grecaptcha : window.turnstile;
function licTsToken(f) {
  const box = f.querySelector('[data-lic-ts]');
  if (!box || box.dataset.none) return 'none';
  if (box.dataset.fallback) { const c = box.querySelector('[data-human]'); return c && c.checked ? 'preview' : ''; }
  const api = licTsApi(box);
  if (box.dataset.wid && api) { try { return api.getResponse(box.dataset.rc ? +box.dataset.wid : box.dataset.wid) || ''; } catch (e) { return ''; } }
  return '';
}
function licTsReset(f) {
  const box = f && f.querySelector('[data-lic-ts]');
  if (!box) return;
  const api = licTsApi(box);
  if (box.dataset.wid && api) { try { api.reset(box.dataset.rc ? +box.dataset.wid : box.dataset.wid); } catch (e) {} }
  const c = box.querySelector('[data-human]'); if (c) c.checked = false;
  delete f.dataset.ts;
}

/* runs before either scan handler: allowance first, then the bot check */
document.addEventListener('submit', e => {
  const f = e.target.closest && e.target.closest('form[data-assess="licensure"], form[data-assess="ses"][data-live]');
  if (!f || f.dataset.busy) return;
  const out = f.parentElement.querySelector('.ck-out');
  if (f.classList.contains('locked') || licUsed(f) >= LIC_FREE) { e.preventDefault(); e.stopImmediatePropagation(); licLock(f, out); return; }
  const tok = licTsToken(f);
  if (!tok) {
    e.preventDefault(); e.stopImmediatePropagation();
    out.innerHTML = `<div class="ck-head"><b>Confirm you’re human</b></div><p class="note">Complete the security check above the button, then run the scan.</p>`;
    const box = f.querySelector('[data-lic-ts]'); if (box) box.scrollIntoView({block: 'nearest'});
    return;
  }
  f.dataset.ts = tok;
}, true);
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-lic-cta]');
  if (!b) return;
  const a = b.closest('.lic-scan, .ses-scan'), f = a && a.querySelector('form[data-assess]'), out = a && a.querySelector('.ck-out');
  const k = b.dataset.licCta;
  if (k === 'subscribe') { go('plans'); return; }
  if (k === 'call') { go('demo'); return; }
  if (k === 'again') {
    if (licUsed(f) >= LIC_FREE) { licLock(f, out); scrollToEl(a); return; }
    f.querySelectorAll('input').forEach(i => { if (!i.classList.contains('hp') && i.type !== 'checkbox' && i.type !== 'radio') i.value = ''; });
    out.innerHTML = `<div class="ck-head"><b>Ready for your next scan</b></div><p class="note">${LIC_FREE - licUsed(f)} of ${LIC_FREE} free assessments left. Complete the security check, then run the scan.</p>`;
    licTsReset(f);
    scrollToEl(a);
    const first = f.querySelector('input:not(.hp):not([type=checkbox]):not([type=radio])'); if (first) setTimeout(() => first.focus({preventScroll: true}), 500);
  }
});
function licGateInit(f) {
  if (!f || f.dataset.gate) return;
  f.dataset.gate = '1';
  licTsInit(f);
  const btn = f.querySelector('button[type=submit]');
  if (btn && !f.querySelector('[data-lic-quota]')) btn.insertAdjacentHTML('afterend', '<p class="lic-quota" data-lic-quota></p>');
  licQuota(f);
  if (licUsed(f) >= LIC_FREE) licLock(f, f.parentElement.querySelector('.ck-out'));
}

/* ---------- one-time licensure scan, live (through the IntegrityShield website API) ---------- */
const LIC = {sources: null, details: {}, timers: new WeakMap(), lastReport: null};
const licEsc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
/* The website API is either the Cloudflare Worker (paths like /lic/scan) or a Google Apps Script
   web app (one URL ending in /exec; GET ?fn=…, POST a JSON body sent as text/plain so the browser
   needs no preflight, and every answer carries its own status because Apps Script always sends 200). */
const licGAS = () => /\/macros\/s\/[^/]+\/exec$/.test(scanApi());
async function licCall(p, body, signal) {
  const base = scanApi(), gas = licGAS();
  let url = base + p, init = body
    ? {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body), signal}
    : {headers: {'Accept': 'application/json'}, signal};
  if (gas) {
    const m = p.match(/^\/lic\/source\/(.+)$/);
    const fn = p === '/lic/sources' ? 'sources' : m ? 'source' : p === '/lic/scan' ? 'scan' : p === '/ses/scan' ? 'sanctions' : p.replace(/^\//, '');
    url = body ? base : `${base}?fn=${fn}${m ? '&id=' + encodeURIComponent(m[1]) : ''}`;
    init = body ? {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify({fn, ...body}), signal, redirect: 'follow'} : {signal, redirect: 'follow'};
  }
  const r = await fetch(url, init);
  let data = {};
  try { data = await r.json(); } catch (x) {}
  const status = gas && r.ok ? (+data.status || 200) : r.status;
  return {ok: status >= 200 && status < 300, status, data};
}
async function licGet(p) {
  const r = await licCall(p);
  if (!r.ok) throw new Error('lic ' + r.status);
  return r.data;
}
function licLiveFormHTML() {
  return `<div class="console assess lic-scan" data-reveal>
      <div class="assess-top"><span class="bar">Free licensure assessment</span><h3>Verify a license at the source</h3><p>Check a practitioner’s license with the state licensing board: status, expiration date, discipline and public complaints. No account needed.</p></div>
      <form data-assess="licensure" data-live novalidate>
        <div class="af-row"><label for="lic-st">State<select id="lic-st" name="state" data-lic-state><option value="">Loading states…</option></select></label><label for="lic-src" data-lic-srcwrap hidden>Licensing board<select id="lic-src" name="sourceId" data-lic-src></select></label></div>
        <div class="af-row"><label for="lic-fn">First name<input id="lic-fn" name="firstName" autocomplete="off"></label><label for="lic-ln">Last name<input id="lic-ln" name="lastName" autocomplete="off"></label></div>
        <label for="lic-num"><span>License number <em class="opt">(or enter the name above)</em></span><input id="lic-num" name="licenseNumber" autocomplete="off"></label>
        <div class="lic-extra" data-lic-extra></div>
        <input class="hp" name="ish_trap_x" tabindex="-1" autocomplete="off" readonly data-lpignore="true" data-1p-ignore aria-hidden="true">
        <div class="lic-ts" data-lic-ts></div>
        <button class="btn primary" type="submit" disabled>Run licensure scan</button>
        <p class="lic-fine">This free assessment uses public licensing board records and is for general information only. Check the details before you act on a result.</p>
      </form>
      <div class="ck-out" aria-live="polite"><div class="ck-head"><b>How it works</b></div><div class="ck-res"><span>Pick the state, then enter the license number, or the practitioner’s first and last name. IntegrityShield checks the board’s records and shows the license status, expiration date and any discipline on file.</span><span class="note">Most scans take 10 to 60 seconds, because each board is checked live.</span></div></div>
    </div>`;
}
function licInit(root) {
  const f = root.querySelector('form[data-live]');
  if (!f || f.dataset.ready) return;
  f.dataset.ready = '1';
  const stSel = f.querySelector('[data-lic-state]'), srcSel = f.querySelector('[data-lic-src]'), srcWrap = f.querySelector('[data-lic-srcwrap]');
  const extra = f.querySelector('[data-lic-extra]'), btn = f.querySelector('button[type=submit]');
  const load = LIC.sources ? Promise.resolve(LIC.sources) : licGet('/lic/sources').then(d => (LIC.sources = d.sources || []));
  load.then(list => {
    const states = [...new Map(list.map(s => [s.state, s.stateName])).entries()].sort((a, b) => a[1].localeCompare(b[1]));
    stSel.innerHTML = '<option value="">Select a state</option>' + states.map(([c, n]) => `<option value="${licEsc(c)}">${licEsc(n)}</option>`).join('');
    if (!f.classList.contains('locked')) btn.disabled = false;
  }).catch(() => {
    stSel.innerHTML = '<option value="">States unavailable</option>';
    root.querySelector('.ck-out').innerHTML = `<div class="ck-head"><b>The scan isn’t available right now</b></div><div class="ck-res"><span>Please try again later, or book a demo to see licensure monitoring in action.</span></div>`;
  });
  const showSource = async id => {
    extra.innerHTML = '';
    if (!id) return;
    extra.innerHTML = '<p class="note">Loading search options…</p>';
    try {
      const d = LIC.details[id] || (LIC.details[id] = await licGet('/lic/source/' + encodeURIComponent(id)));
      if (srcSel.value !== id && f.dataset.src !== id) return;
      f.dataset.src = id;
      const sel = (d.fields || []).filter(x => x.type === 'select' && x.f !== 'searchType');
      extra.innerHTML = sel.length ? `<div class="lic-grid">${sel.map(x => `<label for="lic-x-${x.f}"><span>${licEsc(x.label)} <em class="opt">${x.required ? '(required)' : '(optional)'}</em></span><select id="lic-x-${x.f}" name="${licEsc(x.f)}" data-f="${licEsc(x.f)}"${x.dependsOn ? ` data-dep="${licEsc(x.dependsOn)}" disabled` : ''}${x.required ? ' data-req="1"' : ''}><option value="">${x.dependsOn ? 'Choose ' + licEsc((d.fields.find(y => y.f === x.dependsOn) || {}).label || 'the option above').toLowerCase() + ' first' : 'Any'}</option>${(x.options || []).map(o => `<option>${licEsc(o)}</option>`).join('')}</select></label>`).join('')}</div>` : '';
      extra.querySelectorAll('select[data-dep]').forEach(child => {
        const def = d.fields.find(y => y.f === child.dataset.f);
        const parent = extra.querySelector(`select[data-f="${child.dataset.dep}"]`);
        if (!parent) return;
        parent.addEventListener('change', () => {
          const opts = (def.optionsBy || {})[parent.value] || [];
          child.innerHTML = `<option value="">${opts.length ? 'Any' : 'Choose ' + licEsc((d.fields.find(y => y.f === def.dependsOn) || {}).label || '').toLowerCase() + ' first'}</option>` + opts.map(o => `<option>${licEsc(o)}</option>`).join('');
          child.disabled = !opts.length;
        });
      });
    } catch (e) {
      extra.innerHTML = '<p class="note">Search options couldn’t be loaded. You can still scan by license number or name.</p>';
      f.dataset.src = id;
    }
  };
  stSel.addEventListener('change', () => {
    const list = (LIC.sources || []).filter(s => s.state === stSel.value);
    f.dataset.src = '';
    srcSel.innerHTML = list.map(s => `<option value="${licEsc(s.id)}">${licEsc(s.authority)}</option>`).join('');
    srcWrap.hidden = list.length < 2;
    showSource(list.length ? list[0].id : '');
  });
  srcSel.addEventListener('change', () => { f.dataset.src = ''; showSource(srcSel.value); });
  licTsInit(f);
}
function licDate(s) {
  if (!s) return null;
  const m = String(s).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const d = m ? new Date(+m[3], +m[1] - 1, +m[2]) : new Date(s);
  return isNaN(d) ? null : d;
}
function licVerdict(l) {
  const st = (l.status || '').toLowerCase();
  if (!st) return {face: 'maybe', chip: 'warn', text: 'Status not reported'};
  const bad = l.discipline || /probation|restrict|suspend|revok|surrender|obligation|denied|condition/.test(st);
  const inactive = st && !/active|clear|current|valid|good standing/.test(st) || /inactive|expired|lapsed|null and void|retired|cancel/.test(st);
  const exp = licDate(l.expires), days = exp ? Math.round((exp - new Date()) / 864e5) : null;
  if (bad) return {face: 'maybe', chip: 'match', text: l.discipline ? 'Discipline on file' : 'Status needs review'};
  if (inactive) return {face: 'maybe', chip: 'match', text: 'Not active'};
  if (days != null && days < 0) return {face: 'maybe', chip: 'match', text: 'Expired'};
  if (days != null && days <= 60) return {face: 'maybe', chip: 'warn', text: `Renewal due in ${days} days`};
  if (l.complaint) return {face: 'maybe', chip: 'warn', text: 'Public complaint on file'};
  return {face: 'ok', chip: 'res', text: 'Active, no discipline found'};
}
function licLicenseHTML(l, d, many) {
  const v = licVerdict(l);
  const rows = [
    ['Name', l.name], ['Profession', l.profession], ['License', l.license], ['Status', l.status, /review|not active|expired|discipline/i.test(v.text) && v.chip === 'match' ? 'bad' : ''],
    ['Expires', l.expires, /renewal|expired/i.test(v.text) ? (v.chip === 'match' ? 'bad' : 'warn') : ''], ['First issued', l.issued],
    ['Discipline on file', l.discipline ? 'Yes' : 'No', l.discipline ? 'bad' : ''], l.complaint ? ['Public complaint', 'Yes', 'warn'] : null,
    ['Checked with', `${d.authority}${l.dataAsOf ? ` · data as of ${l.dataAsOf}` : ''}`]
  ].filter(r => r && r[1]);
  const conduct = (l.conduct || []).length ? `<div class="lic-conduct"><p>Board actions on record</p><ul>${l.conduct.map(c => `<li><b>${licEsc(c.type || 'Action')}</b>${c.action ? ` · ${licEsc(c.action)}` : ''}${c.caseNumber ? ` · case ${licEsc(c.caseNumber)}` : ''}${c.date ? ` · ${licEsc(c.date)}` : ''}${c.url ? ` <a href="${licEsc(c.url)}" target="_blank" rel="noopener nofollow">Board document<span class="vh"> (opens the state board’s site)</span> ↗</a>` : ''}</li>`).join('')}</ul></div>` : '';
  const more = (l.details || []).length ? `<details class="lic-more"><summary>All details from the board</summary><dl class="lic-rows">${l.details.map(([k, val]) => `<div><dt>${licEsc(k)}</dt><dd>${licEsc(val)}</dd></div>`).join('')}</dl></details>` : '';
  return `<div class="lic-one">${many ? `<div class="ck-head">${FACE[v.face]}<b>${licEsc(l.name || l.license || 'License')}</b><span class="chip ${v.chip}">${licEsc(v.text)}</span></div>` : ''}${licRows(rows.map(([k, val, c]) => [k, licEsc(val), c]))}${conduct}${more}</div>`;
}
function licResultHTML(q, d) {
  d.licenses = (d.licenses || []).filter(l => l.name || l.license || l.status);
  d.count = d.licenses.length;
  const who = licEsc(q.firstName || q.lastName ? `${q.firstName} ${q.lastName}`.trim() : `License ${q.licenseNumber}`);
  if (!d.count) {
    return `<div class="ck-head">${FACE.maybe}<b>${who}</b><span class="chip warn">No license found</span></div><div class="ck-res"><span>${licEsc(d.authority)} returned no license for these details.</span><span>Check the spelling, try the license number instead of the name, or pick another board if the state has more than one.</span></div>`;
  }
  const one = d.count === 1, v = licVerdict(d.licenses[0]);
  const head = one
    ? `<div class="ck-head">${FACE[v.face]}<b>${licEsc(d.licenses[0].name || who)}</b><span class="chip ${v.chip}">${licEsc(v.text)}</span></div>`
    : `<div class="ck-head">${FACE.ok}<b>${who}</b><span class="chip acc">${d.count} licenses found</span></div>`;
  LIC.lastReport = d.report || null;
  return `${head}<div class="ck-res">${d.licenses.map(l => licLicenseHTML(l, d, !one)).join('')}${reportCTA('licensure')}</div>`;
}
const LIC_STEPS = ['Connecting to {b}', 'Looking up the license', 'Reading the license status', 'Checking the expiration date', 'Checking discipline and public complaints', 'Saving the board’s records', 'Still working: some boards take up to a minute'];
document.addEventListener('submit', async e => {
  const f = e.target.closest && e.target.closest('form[data-assess="licensure"][data-live]');
  if (!f) return;
  e.preventDefault(); e.stopImmediatePropagation();
  if (f.dataset.busy) return;
  const out = f.parentElement.querySelector('.ck-out');
  const g = n => (f.elements[n] ? String(f.elements[n].value || '').trim() : '');
  const q = {firstName: g('firstName'), lastName: g('lastName'), licenseNumber: g('licenseNumber')};
  const say = (title, msg, focus) => { out.innerHTML = `<div class="ck-head"><b>${title}</b></div><p class="note">${msg}</p>`; if (focus) focus.focus(); };
  if (!g('state')) return say('Choose a state', 'Pick the state that issued the license.', f.elements.state);
  const sourceId = f.dataset.src || g('sourceId');
  if (!sourceId) return say('One moment', 'Search options are still loading. Try again in a second.');
  if (!q.licenseNumber && !(q.firstName && q.lastName)) return say('Add a license number or a name', 'Enter the license number, or the practitioner’s first and last name.', q.licenseNumber || q.firstName ? f.elements.lastName : f.elements.licenseNumber);
  const extra = {};
  for (const s of f.querySelectorAll('[data-lic-extra] select[data-f]')) {
    if (s.value) extra[s.dataset.f] = s.value;
    else if (s.dataset.req && !s.disabled) return say('One more detail', `Choose the ${licEsc(s.closest('label').querySelector('span').firstChild.textContent.trim().toLowerCase())} for this board.`, s);
  }
  const ts = f.dataset.ts && f.dataset.ts !== 'none' ? f.dataset.ts : '';
  const src = (LIC.sources || []).find(s => s.id === sourceId) || {authority: 'the licensing board'};
  f.dataset.busy = '1';
  const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
  out.innerHTML = `<div class="ck-head"><b>${licEsc(q.licenseNumber ? 'License ' + q.licenseNumber : q.firstName + ' ' + q.lastName)}</b><span class="chip acc">Scanning</span></div><div class="ck-bar lic-bar"><span></span></div><div class="ck-tick"></div>`;
  const tick = out.querySelector('.ck-tick'), t0 = Date.now();
  const step = () => { const s = Math.floor((Date.now() - t0) / 1000), i = Math.min(LIC_STEPS.length - 1, Math.floor(s / 6)); tick.textContent = `${LIC_STEPS[i].replace('{b}', src.authority)} · ${s}s`; };
  step(); const iv = setInterval(step, 1000);
  const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const to = ctl ? setTimeout(() => ctl.abort(), 110000) : 0;
  let res = null, data = {};
  try {
    res = await licCall('/lic/scan', {...q, ...extra, sourceId, website: g('ish_trap_x'), turnstile: ts, vid: licVid()}, ctl ? ctl.signal : undefined);
    data = res.data || {};
  } catch (x) { res = null; }
  clearInterval(iv); clearTimeout(to);
  delete f.dataset.busy; if (!f.classList.contains('locked')) btn.disabled = false;
  licTsReset(f);
  if (res && res.ok && data.ok) { out.innerHTML = licResultHTML(q, data); licAfterScan(f, out, data.remaining); return; }
  const err = (data && data.error) || '';
  if (res && res.status === 429 && data.scope === 'free') { licCookie(licCK(f), LIC_FREE); licLock(f, out); return; }
  if (res && res.status === 429) { say('Daily limit reached', data.scope === 'site' ? 'Free assessments are busy today. Please try again tomorrow, or subscribe for unlimited checks.' : 'Too many free assessments from this network today. Please try again tomorrow, or subscribe for unlimited checks.'); out.insertAdjacentHTML('beforeend', `<div class="lic-ctas">${LIC_BTNS.subscribe('Subscribe to our platform')}${LIC_BTNS.call()}</div>`); return; }
  if (err === 'bot_check') return say('Please confirm you’re human', 'Complete the quick check above the button, then scan again.');
  if (err === 'missing_fields' || err === 'invalid') return say('Check the details', licEsc(data.message || data.detail || 'The board couldn’t search with these details. Check the license number or name and try again.'));
  say('The board didn’t respond', `${licEsc(src.authority)} didn’t answer in time. Some boards are slow or briefly offline; please try again in a minute.`);
}, true);

$$('.lic-scan').forEach(licInit);
$$('.lic-scan form[data-assess]').forEach(licGateInit);
/* ---------- one-time sanctions & exclusions check, live (SanctionsShield API through the website API) ---------- */
function sesStates() { return [['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming']]; }
function sesLiveFormHTML() {
  return `<div class="console assess ses-scan" data-reveal>
      <div class="assess-top"><span class="bar">Free exclusion assessment</span><h3>Screen a name against the exclusion lists</h3><p>Search a person or business across IntegrityShield’s sanctions and exclusion lists, including OIG LEIE, SAM.gov and state Medicaid lists. No account needed.</p></div>
      <form data-assess="ses" data-live novalidate>
        <div class="ses-type" role="radiogroup" aria-label="Search for">
          <label><input type="radio" name="type" value="individual" checked><span>Individual</span></label>
          <label><input type="radio" name="type" value="entity"><span>Business</span></label>
        </div>
        <div class="af-row" data-ses-person><label for="ses-fn">First name<input id="ses-fn" name="firstName" autocomplete="off" maxlength="60"></label><label for="ses-ln">Last name<input id="ses-ln" name="lastName" autocomplete="off" maxlength="60"></label></div>
        <div class="af-row" data-ses-person><label for="ses-mn"><span>Middle name <em class="opt">(optional)</em></span><input id="ses-mn" name="middleName" autocomplete="off" maxlength="60"></label><label for="ses-st"><span>State <em class="opt">(optional)</em></span><select id="ses-st" name="state"><option value="">Any state</option>${sesStates().map(([c, n]) => `<option value="${c}">${n}</option>`).join('')}</select></label></div>
        <div data-ses-org hidden><label for="ses-org">Business name<input id="ses-org" name="orgName" autocomplete="off" maxlength="120"></label></div>
        <input class="hp" name="ish_trap_x" tabindex="-1" autocomplete="off" readonly data-lpignore="true" data-1p-ignore aria-hidden="true">
        <div class="lic-ts" data-lic-ts></div>
        <button class="btn primary" type="submit">Search now</button>
        <p class="note lic-disc">This free assessment uses public sanctions and exclusion lists and is for general information only. A name match is not a confirmed identity, so check the details before you act on a result.</p>
      </form>
      <div class="ck-out" aria-live="polite"></div>
    </div>`;
}
function sesSetType(f) {
  const ent = (f.querySelector('input[name=type]:checked') || {}).value === 'entity';
  f.querySelectorAll('[data-ses-person]').forEach(x => { x.hidden = ent; });
  f.querySelector('[data-ses-org]').hidden = !ent;
}
document.addEventListener('change', e => {
  const f = e.target.closest && e.target.closest('form[data-assess="ses"][data-live]');
  if (f && e.target.name === 'type') sesSetType(f);
});
function sesMatchHTML(m) {
  const pct = m.match != null ? `${m.match}% name match` : '';
  const rows = [
    ['Listed name', m.name + (m.dba ? ` (DBA ${m.dba})` : '')], ['List', m.source], ['Agency', m.agency], ['Program', m.program],
    ['Type', m.type], ['Details', m.detail], ['Action', m.action], ['Date listed', m.date],
    ['Expires', m.expires ? m.expires + (m.expired ? ' (expired)' : '') : ''], ['Location on the list', m.place], ['Match', [pct, m.quality ? m.quality.replace(/_/g, ' ').toLowerCase().replace(/^./, c => c.toUpperCase()) : ''].filter(Boolean).join(' · ')]
  ].filter(r => r[1]);
  return `<div class="lic-one ses-one"><div class="ck-head">${FACE.maybe}<b>${licEsc(m.name || 'Listed record')}</b><span class="chip ${m.expired ? 'warn' : 'match'}">${licEsc(m.source || 'Listed')}</span></div>${licRows(rows.map(([k, v]) => [k, licEsc(v)]))}</div>`;
}
function sesResultHTML(q, d) {
  const who = licEsc(q.orgName || [q.firstName, q.middleName, q.lastName].filter(Boolean).join(' '));
  if (!d.count) {
    return `<div class="ck-head">${FACE.ok}<b>${who}</b><span class="chip res">No match found</span></div><div class="ck-res"><span>No records with this name on IntegrityShield’s sanctions and exclusion lists as of ${licEsc(new Date(d.checkedAt || Date.now()).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}))}.</span>${reportCTA('ses')}</div>`;
  }
  const shown = d.matches.length, more = d.count > shown ? ` Showing the closest ${shown}.` : '';
  return `<div class="ck-head">${FACE.maybe}<b>${who}</b><span class="chip match">${d.count === 1 ? 'Possible match' : `${d.count} possible matches`}</span></div><div class="ck-res"><span>These listed records match the name you searched.${more} A name match is not a confirmed identity: compare location, dates and identifiers before acting.</span>${d.matches.map(sesMatchHTML).join('')}${reportCTA('ses')}</div>`;
}
var SES_STEPS = ['Checking the federal exclusion lists', 'Checking state Medicaid exclusion lists', 'Checking state registries', 'Comparing names'];
document.addEventListener('submit', async e => {
  const f = e.target.closest && e.target.closest('form[data-assess="ses"][data-live]');
  if (!f) return;
  e.preventDefault(); e.stopImmediatePropagation();
  if (f.dataset.busy) return;
  const out = f.parentElement.querySelector('.ck-out');
  const g = n => (f.elements[n] && !f.elements[n].closest('[hidden]') ? String(f.elements[n].value || '').trim() : '');
  const type = (f.querySelector('input[name=type]:checked') || {}).value === 'entity' ? 'entity' : 'individual';
  const q = type === 'entity' ? {orgName: g('orgName')} : {firstName: g('firstName'), middleName: g('middleName'), lastName: g('lastName'), state: g('state')};
  const say = (title, msg, focus) => { out.innerHTML = `<div class="ck-head"><b>${title}</b></div><p class="note">${msg}</p>`; if (focus) focus.focus(); };
  if (type === 'entity' && !q.orgName) return say('Add the business name', 'Enter the name of the business to check.', f.elements.orgName);
  if (type === 'individual' && !(q.firstName && q.lastName)) return say('Add a first and last name', 'Enter the person’s first and last name.', q.firstName ? f.elements.lastName : f.elements.firstName);
  const ts = f.dataset.ts && f.dataset.ts !== 'none' ? f.dataset.ts : '';
  f.dataset.busy = '1';
  const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
  out.innerHTML = `<div class="ck-head"><b>${licEsc(q.orgName || `${q.firstName} ${q.lastName}`)}</b><span class="chip acc">Searching</span></div><div class="ck-bar lic-bar"><span></span></div><div class="ck-tick"></div>`;
  const tick = out.querySelector('.ck-tick'), t0 = Date.now();
  const step = () => { const s = Math.floor((Date.now() - t0) / 1000); tick.textContent = `${SES_STEPS[Math.min(SES_STEPS.length - 1, Math.floor(s / 3))]} · ${s}s`; };
  step(); const iv = setInterval(step, 1000);
  const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const to = ctl ? setTimeout(() => ctl.abort(), 90000) : 0;
  let res = null, data = {};
  try { res = await licCall('/ses/scan', {type, ...q, website: g('ish_trap_x'), turnstile: ts, vid: licVid()}, ctl ? ctl.signal : undefined); data = res.data || {}; }
  catch (x) { res = null; }
  clearInterval(iv); clearTimeout(to);
  delete f.dataset.busy; if (!f.classList.contains('locked')) btn.disabled = false;
  licTsReset(f);
  if (res && res.ok && data.ok) { out.innerHTML = sesResultHTML(q, data); licAfterScan(f, out, data.remaining); return; }
  if (res && res.status === 429 && data.scope === 'free') { licCookie(licCK(f), LIC_FREE); licLock(f, out); return; }
  if (res && res.status === 429) { say('Daily limit reached', 'Free assessments are busy today. Please try again tomorrow, or subscribe for unlimited screening.'); out.insertAdjacentHTML('beforeend', `<div class="lic-ctas">${LIC_BTNS.subscribe('Subscribe to our platform')}${LIC_BTNS.call()}</div>`); return; }
  if (data.error === 'bot_check') return say('Please confirm you’re human', 'Complete the quick check above the button, then search again.');
  if (data.error === 'missing_fields' || data.error === 'invalid') return say('Check the details', licEsc(data.message || data.detail || 'The search couldn’t run with these details. Check the spelling and try again.'));
  say('The search didn’t finish', 'The screening service didn’t answer in time. Please try again in a minute.');
}, true);

$$('.ses-scan form[data-assess]').forEach(f => { sesSetType(f); licGateInit(f); });

/* ---------- demo booking calendar ---------- */
const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SLOT_TIMES = [];
for (let m = 9 * 60; m <= 16 * 60 + 30; m += 30) SLOT_TIMES.push(m);
const fmtTime = m => { const h = Math.floor(m / 60), mm = m % 60; return `${(h + 11) % 12 + 1}:${String(mm).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
const dayKey = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const today0 = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
const longDate = d => d.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'});
const BOOK_DAYS = 60;
function isAvail(d) {
  const diff = Math.round((d - today0()) / 864e5);
  return diff >= 1 && diff <= BOOK_DAYS && d.getDay() !== 0 && d.getDay() !== 6;
}
const slotsFor = d => SLOT_TIMES.filter(m => (Math.imul(hashStr(dayKey(d) + ':' + m), 2654435761) >>> 16) % 3 !== 0);
/* ---------- booking: show ET slots in the visitor's own time zone ---------- */
const ET_FMT = new Intl.DateTimeFormat('en-US', {timeZone: 'America/New_York', hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'});
function etOffset(ts) {
  const p = {}; ET_FMT.formatToParts(ts).forEach(x => { p[x.type] = +x.value; });
  return (Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute) - ts) / 60000;
}
function etToLocal(d, m) {
  const g = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(m / 60), m % 60);
  let t = g - etOffset(g) * 60000;
  t = g - etOffset(t) * 60000;
  return new Date(t);
}
const fmtLocal = (d, m) => etToLocal(d, m).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'});
const tzPart = (o) => { try { return (new Intl.DateTimeFormat('en-US', {timeZoneName: o}).formatToParts(new Date()).find(x => x.type === 'timeZoneName') || {}).value || ''; } catch (e) { return ''; } };
const TZ_NAME = tzPart('short') || 'local time';
const TZ_LONG = tzPart('long') || 'Your local time';
function fillTZ() { document.querySelectorAll('.tzname').forEach(el => { el.textContent = TZ_LONG; }); }

/* ---------- live demo booking (Calendly, through the booking API) ----------
   Set BOOKING_API to the booking Worker's address to switch every demo calendar
   from sample times to real Calendly availability. Empty = demo mode. */
const BOOKING_API = scanApi();   // live Calendly booking whenever the website API is set
const BOOK_LEN_MIN = 30;
const LOCAL_TZ = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } })();
const fmtClock = d => d.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'});
function bookUtm() {
  const q = new URLSearchParams(location.search), u = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(k => { if (q.get(k)) u[k] = q.get(k); });
  return u;
}
function calQs(root, qs) {
  const box = root.querySelector('[data-cal-qs]');
  if (!box || box.dataset.done) return;
  box.dataset.done = '1';
  qs.filter(q => !q.map).forEach(q => {
    const id = `cq-${root.dataset.product}-${q.position}`, req = q.required ? ' required aria-required="true"' : '';
    const lab = `${licEsc(q.name)}${q.required ? ' <i class="req" aria-hidden="true">*</i>' : ' <em class="opt">(optional)</em>'}`;
    let ctl;
    if (q.type === 'single_select' && q.choices.length) ctl = `<select id="${id}" data-cq="${q.position}"${req}><option value="">Select</option>${q.choices.map(c => `<option>${licEsc(c)}</option>`).join('')}</select>`;
    else if (q.type === 'multi_select' && q.choices.length) ctl = `<span class="cq-multi">${q.choices.map(c => `<label class="nl-opt"><input type="checkbox" data-cq="${q.position}" value="${licEsc(c)}"><span>${licEsc(c)}</span></label>`).join('')}</span>`;
    else if (q.type === 'text') ctl = `<textarea id="${id}" rows="2" data-cq="${q.position}"${req}></textarea>`;
    else ctl = `<input id="${id}" data-cq="${q.position}"${q.type === 'phone_number' ? ' type="tel" autocomplete="tel"' : ''}${req}>`;
    box.insertAdjacentHTML('beforeend', `<label for="${id}" data-cq-req="${q.required ? 1 : 0}" data-cq-name="${licEsc(q.name)}"><span>${lab}</span>${ctl}</label>`);
  });
}
function calAnswers(f) {
  const a = {};
  f.querySelectorAll('[data-cq]').forEach(el => {
    const p = el.dataset.cq;
    if (el.type === 'checkbox') { if (el.checked) a[p] = a[p] ? a[p] + ', ' + el.value : el.value; }
    else if (String(el.value || '').trim()) a[p] = String(el.value).trim();
  });
  return a;
}
function initCalLive(root) {
  const $r = s => root.querySelector(s);
  fillTZ();
  const days = $r('.cal-days'), title = $r('.cal-mtitle'), slots = $r('.slots'), dayLbl = $r('.cal-dlabel'), pick = $r('.cal-pick');
  const prev = $r('[data-prev]'), next = $r('[data-next]');
  const steps = {pick: $r('[data-step="pick"]'), form: $r('[data-step="form"]'), done: $r('[data-step="done"]')};
  const showStep = s => Object.entries(steps).forEach(([k, el]) => { el.hidden = k !== s; });
  const type = root.dataset.product;
  const demoNote = $r('[data-demo-note]'); if (demoNote) demoNote.hidden = true;
  const t0 = today0();
  const lim = new Date(t0.getFullYear(), t0.getMonth(), t0.getDate() + BOOK_DAYS);
  const st = {y: t0.getFullYear(), m: t0.getMonth(), sel: null, time: null, months: {}, auto: true};
  const mKey = (y, m) => `${y}-${m}`;
  const monthData = () => st.months[mKey(st.y, st.m)];
  const when = () => {
    const s = new Date(st.time), e = new Date(s.getTime() + BOOK_LEN_MIN * 60e3);
    return `${fmtClock(s)} to ${fmtClock(e)} ${TZ_NAME}, ${longDate(s)}`;
  };

  async function loadMonth(y, m, force) {
    const k = mKey(y, m);
    if (!force && st.months[k] && st.months[k] !== 'error') return;
    st.months[k] = 'loading';
    if (y === st.y && m === st.m) { drawMonth(); drawSlots(); }
    try {
      const start = new Date(y, m, 1), end = new Date(y, m + 1, 1);
      const q = new URLSearchParams({type, start: start.toISOString(), end: end.toISOString()});
      const r = await fetch(`${BOOKING_API}?fn=slots&${q}`, {redirect: 'follow'});
      const body = await r.json();
      if (!body.ok) throw new Error('slots ' + body.status);
      calQs(root, body.questions || []);
      const map = new Map();
      (body.slots || []).forEach(iso => {
        const d = new Date(iso);
        if (isNaN(d) || d > lim) return;
        const key = dayKey(d);
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(iso);
      });
      map.forEach(list => list.sort());
      st.months[k] = map;
      if (st.auto && y === st.y && m === st.m) {
        const firstDay = [...map.keys()].map(key => new Date(map.get(key)[0])).sort((a, b) => a - b)[0];
        if (firstDay) { st.sel = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate()); st.auto = false; }
        else if (new Date(y, m + 1, 1) <= lim) { st.m = m + 1 > 11 ? 0 : m + 1; st.y = m + 1 > 11 ? y + 1 : y; loadMonth(st.y, st.m); return; }
        else st.auto = false;
      }
    } catch (err) {
      st.months[k] = 'error';
    }
    if (y === st.y && m === st.m) { drawMonth(); drawSlots(); }
  }

  function drawMonth() {
    title.textContent = `${MONTHS[st.m]} ${st.y}`;
    const data = monthData(), ready = data instanceof Map;
    const first = new Date(st.y, st.m, 1), n = new Date(st.y, st.m + 1, 0).getDate();
    let html = DOW.map(x => `<span class="dow">${x}</span>`).join('') + '<span></span>'.repeat(first.getDay());
    for (let i = 1; i <= n; i++) {
      const dd = new Date(st.y, st.m, i), av = ready && data.has(dayKey(dd)), sel = st.sel && dayKey(dd) === dayKey(st.sel);
      html += `<button type="button" data-d="${i}"${av ? '' : ' disabled'} class="${sel ? 'sel' : ''}${dayKey(dd) === dayKey(t0) ? ' today' : ''}" aria-label="${longDate(dd)}${av ? '' : ', unavailable'}"${sel ? ' aria-pressed="true"' : ''}>${i}</button>`;
    }
    days.innerHTML = html;
    days.classList.toggle('loading', data === 'loading');
    prev.disabled = st.y === t0.getFullYear() && st.m === t0.getMonth();
    next.disabled = st.y > lim.getFullYear() || (st.y === lim.getFullYear() && st.m >= lim.getMonth());
  }
  function drawSlots() {
    const data = monthData();
    const inMonth = st.sel && st.sel.getFullYear() === st.y && st.sel.getMonth() === st.m;
    if (data === 'loading' || data === undefined) { dayLbl.textContent = 'Loading available times'; slots.innerHTML = '<p class="slots-msg">Checking the calendar…</p>'; return; }
    if (data === 'error') { dayLbl.textContent = 'Times unavailable'; slots.innerHTML = `<p class="slots-msg">We couldn’t load available times.</p><button type="button" class="btn ghost sm" data-retry>Try again</button>`; return; }
    if (!inMonth || !data.has(dayKey(st.sel))) {
      dayLbl.textContent = data.size ? 'Select a date' : 'No open times this month';
      slots.innerHTML = (st.notice ? `<p class="slots-msg warn" role="alert">${st.notice}</p>` : '') + `<p class="slots-msg">${data.size ? 'Pick a highlighted date to see times.' : 'Try the next month.'}</p>`;
      return;
    }
    dayLbl.textContent = longDate(st.sel);
    slots.innerHTML = (st.notice ? `<p class="slots-msg warn" role="alert">${st.notice}</p>` : '') + data.get(dayKey(st.sel)).map(iso => `<div class="slot${st.time === iso ? ' on' : ''}"><button type="button" class="t" data-iso="${iso}">${fmtClock(new Date(iso))}</button>${st.time === iso ? '<button type="button" class="nx" data-nx>Next</button>' : ''}</div>`).join('');
  }
  const go = (y, m) => { st.y = y; st.m = m; st.time = null; drawMonth(); drawSlots(); loadMonth(y, m); };
  days.addEventListener('click', e => {
    const b = e.target.closest('button[data-d]');
    if (!b || b.disabled) return;
    st.sel = new Date(st.y, st.m, +b.dataset.d); st.time = null;
    drawMonth(); drawSlots();
  });
  prev.addEventListener('click', () => { const m = st.m - 1; go(m < 0 ? st.y - 1 : st.y, (m + 12) % 12); });
  next.addEventListener('click', () => { const m = st.m + 1; go(m > 11 ? st.y + 1 : st.y, m % 12); });
  slots.addEventListener('click', e => {
    if (e.target.closest('[data-retry]')) { loadMonth(st.y, st.m, true); return; }
    if (e.target.closest('[data-nx]')) {
      pick.textContent = when(); pick.hidden = false;
      showStep('form');
      const first = steps.form.querySelector('input:not(.hp)'); if (first) first.focus({preventScroll: true});
      return;
    }
    const b = e.target.closest('button[data-iso]');
    if (!b) return;
    st.time = b.dataset.iso; st.notice = ''; drawSlots();
    const nx = slots.querySelector('[data-nx]'); if (nx) nx.focus({preventScroll: true});
  });
  $r('[data-back]').addEventListener('click', () => showStep('pick'));
  calKeys(days); dayLbl.setAttribute('aria-live', 'polite');
  steps.form.addEventListener('submit', async e => {
    e.preventDefault();
    const f = steps.form, err = f.querySelector('.err'), btn = f.querySelector('button[type=submit]');
    if (btn.disabled) return;
    const name = f.elements.name.value.trim(), email = f.elements.email.value.trim(), org = f.elements.org.value.trim();
    const miss = [];
    if (!name) miss.push('your name');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) miss.push('a work email');
    if (!org) miss.push('your organization');
    const ans = calAnswers(f);
    f.querySelectorAll('[data-cq-req="1"]').forEach(l => { const el = l.querySelector('[data-cq]'); if (el && !ans[el.dataset.cq]) miss.push(l.dataset.cqName.toLowerCase()); });
    if (miss.length) { err.textContent = 'Add ' + miss.join(', ').replace(/, ([^,]*)$/, ' and $1') + ' to schedule your demo.'; err.hidden = false; return; }
    err.hidden = true;
    const label = btn.textContent; btn.disabled = true; btn.textContent = 'Scheduling…';
    let res = null, data = {};
    try {
      res = await licCall('/book', {
        type, start: st.time, name, email, org, note: f.elements.note.value.trim(), timezone: LOCAL_TZ, answers: calAnswers(f),
        utm: bookUtm(), newsletter: NL(f), page: location.pathname, ms: FORM_T0.has(f) ? Date.now() - FORM_T0.get(f) : 0, website: f.elements.ish_trap_x ? f.elements.ish_trap_x.value : ''
      });
      data = res.data || {};
    } catch (x) { res = null; }
    btn.disabled = false; btn.textContent = label;
    if (res && res.ok && data.ok) {
      steps.done.querySelector('[data-when]').textContent = when();
      const dn = steps.done.querySelector('[data-done-note]');
      if (dn) { dn.textContent = ''; dn.append('A calendar invite with the video link is on its way to ', Object.assign(document.createElement('b'), {textContent: email}), '. Check your spam folder if it hasn’t arrived in a few minutes.'); }
      showStep('done');
      root.dispatchEvent(new CustomEvent('cal:booked', {bubbles: true, detail: {when: when(), start: st.time, name, email, org, newsletter: !!(f.elements.newsletter && f.elements.newsletter.checked), live: true}}));
      return;
    }
    if (res && res.status === 409) {
      st.time = null; pick.hidden = true; st.notice = 'Sorry, that time was just taken. Please pick another time.';
      Object.keys(st.months).forEach(k => delete st.months[k]);
      showStep('pick'); loadMonth(st.y, st.m, true);
      return;
    }
    if (res && res.status === 400 && data.message) { err.textContent = data.message; err.hidden = false; return; }
    if (res && res.status === 429) { err.textContent = 'You’ve booked several demos today. Please call 1-800-604-1354 to book another.'; err.hidden = false; return; }
    err.textContent = 'We couldn’t schedule the demo just now. Please try again, or call 1-800-604-1354.'; err.hidden = false;
  });
  $r('[data-again]').addEventListener('click', () => { st.time = null; pick.hidden = true; steps.form.reset(); Object.keys(st.months).forEach(k => delete st.months[k]); showStep('pick'); loadMonth(st.y, st.m, true); });
  drawMonth(); drawSlots();
  loadMonth(st.y, st.m);
}

function calKeys(days) {
  days.setAttribute('role', 'group'); days.setAttribute('aria-label', 'Choose a date');
  days.addEventListener('keydown', e => {
    const step = {ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7}[e.key];
    if (!step || !e.target.matches('button[data-d]')) return;
    e.preventDefault();
    const all = [...days.querySelectorAll('button[data-d]')];
    let i = all.indexOf(e.target) + step;
    while (i >= 0 && i < all.length && all[i].disabled) i += step > 0 ? 1 : -1;
    if (all[i]) all[i].focus();
  });
}
function initCal(root) {
  if (BOOKING_API) return initCalLive(root);
  const $r = s => root.querySelector(s);
  fillTZ();
  const days = $r('.cal-days'), title = $r('.cal-mtitle'), slots = $r('.slots'), dayLbl = $r('.cal-dlabel'), pick = $r('.cal-pick');
  const prev = $r('[data-prev]'), next = $r('[data-next]');
  const steps = {pick: $r('[data-step="pick"]'), form: $r('[data-step="form"]'), done: $r('[data-step="done"]')};
  const showStep = s => Object.entries(steps).forEach(([k, el]) => { el.hidden = k !== s; });
  let d = today0();
  do { d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1); } while (!isAvail(d));
  const st = {y: d.getFullYear(), m: d.getMonth(), sel: d, time: null};
  const when = () => `${fmtLocal(st.sel, st.time)} to ${fmtLocal(st.sel, st.time + 30)} ${TZ_NAME}, ${longDate(etToLocal(st.sel, st.time))}`;
  function drawMonth() {
    title.textContent = `${MONTHS[st.m]} ${st.y}`;
    const first = new Date(st.y, st.m, 1), n = new Date(st.y, st.m + 1, 0).getDate(), t = today0();
    let html = DOW.map(x => `<span class="dow">${x}</span>`).join('') + '<span></span>'.repeat(first.getDay());
    for (let i = 1; i <= n; i++) {
      const dd = new Date(st.y, st.m, i), av = isAvail(dd), sel = st.sel && dayKey(dd) === dayKey(st.sel);
      html += `<button type="button" data-d="${i}"${av ? '' : ' disabled'} class="${sel ? 'sel' : ''}${dayKey(dd) === dayKey(t) ? ' today' : ''}" aria-label="${longDate(dd)}${av ? '' : ', unavailable'}"${sel ? ' aria-pressed="true"' : ''}>${i}</button>`;
    }
    days.innerHTML = html;
    prev.disabled = st.y === t.getFullYear() && st.m === t.getMonth();
    const lim = new Date(t.getFullYear(), t.getMonth(), t.getDate() + BOOK_DAYS);
    next.disabled = st.y > lim.getFullYear() || (st.y === lim.getFullYear() && st.m >= lim.getMonth());
  }
  function drawSlots() {
    dayLbl.textContent = longDate(st.sel);
    slots.innerHTML = slotsFor(st.sel).map(m => `<div class="slot${st.time === m ? ' on' : ''}"><button type="button" class="t" data-m="${m}">${fmtLocal(st.sel, m)}</button>${st.time === m ? '<button type="button" class="nx" data-nx>Next</button>' : ''}</div>`).join('');
  }
  days.addEventListener('click', e => {
    const b = e.target.closest('button[data-d]');
    if (!b || b.disabled) return;
    st.sel = new Date(st.y, st.m, +b.dataset.d); st.time = null;
    drawMonth(); drawSlots();
  });
  prev.addEventListener('click', () => { if (--st.m < 0) { st.m = 11; st.y--; } drawMonth(); });
  next.addEventListener('click', () => { if (++st.m > 11) { st.m = 0; st.y++; } drawMonth(); });
  slots.addEventListener('click', e => {
    if (e.target.closest('[data-nx]')) {
      pick.textContent = when(); pick.hidden = false;
      showStep('form');
      const first = steps.form.querySelector('input'); if (first) first.focus({preventScroll: true});
      return;
    }
    const b = e.target.closest('button[data-m]');
    if (!b) return;
    st.time = +b.dataset.m; drawSlots();
    const nx = slots.querySelector('[data-nx]'); if (nx) nx.focus({preventScroll: true});
  });
  $r('[data-back]').addEventListener('click', () => showStep('pick'));
  steps.form.addEventListener('submit', e => {
    e.preventDefault();
    const f = steps.form, err = f.querySelector('.err');
    const name = f.elements.name.value.trim(), email = f.elements.email.value.trim(), org = f.elements.org.value.trim();
    const miss = [];
    if (!name) miss.push('your name');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) miss.push('a work email');
    if (!org) miss.push('your organization');
    if (miss.length) { err.textContent = 'Add ' + miss.join(', ').replace(/, ([^,]*)$/, ' and $1') + ' to schedule your demo.'; err.hidden = false; return; }
    err.hidden = true;
    steps.done.querySelector('[data-when]').textContent = when();
    steps.done.querySelector('[data-who]').textContent = email;
    showStep('done');
    root.dispatchEvent(new CustomEvent('cal:booked', {bubbles: true, detail: {when: when(), start: etToLocal(st.sel, st.time).toISOString(), name, email, org, newsletter: !!(f.elements.newsletter && f.elements.newsletter.checked), live: false}}));
  });
  $r('[data-again]').addEventListener('click', () => { st.time = null; pick.hidden = true; steps.form.reset(); drawSlots(); showStep('pick'); });
  drawMonth(); drawSlots();
}

/* ---------- pricing ---------- */
const PR = {sol: 'ses', bill: 'annual', cart: {}};
const BUNDLE_OFF = .25;
const r2 = n => Math.round(n * 100 + 1e-6) / 100;
const priceOf = (t, bill) => bill === 'annual' ? r2(t.m * (1 - ANNUAL_OFF)) : t.m;
const money = n => '$' + r2(n).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
const CHECK = '<svg class="fx-y" viewBox="0 0 20 20" aria-label="Included" role="img"><circle cx="10" cy="10" r="10"/><path d="m5.6 10.3 2.9 2.9 5.9-6.2"/></svg>';
const DASH = '<span class="fx-n" role="img" aria-label="Not included">—</span>';
function cartLines() {
  return SOLS.filter(s => PR.cart[s]).map(s => ({sol: s, t: PLANS[s].tiers.find(x => x.k === PR.cart[s])})).filter(x => x.t && x.t.m);
}
function cartTotals(bill) {
  const lines = cartLines(), list = r2(lines.reduce((a, x) => a + x.t.m, 0));
  const annual = bill === 'annual' ? r2(list * ANNUAL_OFF) : 0;
  const bundle = lines.length >= 2 ? r2((list - annual) * BUNDLE_OFF) : 0;
  return {lines, list, annual, bundle, total: r2(list - annual - bundle)};
}
function bundleExample() {
  const a = PLANS.ses.tiers.find(x => x.k === 'plus'), b = PLANS.coi.tiers.find(x => x.k === 'plus');
  const list = r2(a.m + b.m), annual = r2(list * ANNUAL_OFF), bundle = r2((list - annual) * BUNDLE_OFF), total = r2(list - annual - bundle);
  return `Example: ${a.n} for IntegrityShield-HSES and IntegrityShield-COI is ${money(list)}/mo at list price. Annual billing saves ${money(annual)} and the bundle saves another ${money(bundle)}, for ${money(total)}/mo: ${Math.round((1 - total / list) * 100)}% off list.`;
}
function bundleHTML() {
  return `<div class="bundle"><span class="bd-ic" aria-hidden="true">%</span><div><b>Bundle discount: save an extra 25%</b><span>Subscribe to two or more IntegrityShield solutions and take another 25% off, on top of your annual billing savings.</span><span class="bd-ex">${bundleExample()}</span></div></div><p class="plans-same">Same plans for every IntegrityShield solution; prices vary by solution. A monitoring record is one person or organization in one solution, so someone screened in both HSES and COI counts once in each. To change plans, contact us. ${RV('Needs clarification: what happens at the record limit, and overage pricing')}</p>`;
}
function checkoutHTML(bill) {
  const c = cartTotals(bill);
  if (!c.lines.length) return '';
  const next = SOLS.find(s => !PR.cart[s] || !PLANS[s].tiers.find(x => x.k === PR.cart[s]).m);
  return `<div class="checkout" aria-live="polite">
    <div class="co-main">
      <div class="co-head"><span class="co-l">Your subscription</span><span class="co-bill">${bill === 'annual' ? 'Billed annually' : 'Billed monthly'}</span></div>
      <ul class="co-lines">
        ${c.lines.map(x => `<li><span>${M[x.sol].name} · ${x.t.n}<small>${x.t.rec}</small></span><b>${money(x.t.m)}<small>/mo</small></b><button type="button" class="co-rm" data-rm="${x.sol}" aria-label="Remove ${M[x.sol].name}">×</button></li>`).join('')}
        ${c.annual ? `<li class="disc"><span>Annual billing savings (20%)</span><b>−${money(c.annual)}<small>/mo</small></b></li>` : ''}
        ${c.bundle ? `<li class="disc bnd"><span>Bundle discount (25%)<small>${c.lines.length} solutions</small></span><b>−${money(c.bundle)}<small>/mo</small></b></li>`
          : `<li class="hint"><span>Add one more solution to unlock the 25% bundle discount.</span>${next ? `<button type="button" class="link" data-addsol="${next}">Add ${M[next].name} ${ARROW}</button>` : ''}</li>`}
      </ul>
    </div>
    <div class="co-sum">
      <span class="co-l">Total</span>
      <b class="co-tot">${money(c.total)}<small>/mo</small></b>
      <p class="co-yr">${bill === 'annual' ? `${money(c.total * 12)} billed today for 12 months.` : 'Billed monthly. Cancel any time.'}${c.annual + c.bundle ? ` You save ${money((c.annual + c.bundle) * 12)} a year.` : ''}</p>
      <button type="button" class="btn primary" data-checkout>Continue to checkout</button>
      <p class="co-note" hidden>Demo: checkout isn’t connected yet.</p>
    </div>
  </div>`;
}
function matrixHTML(sol) {
  const T = PLANS[sol].tiers, all = [1, 1, 1, 1, 1];
  const rows = [
    ['Active monitoring records', '', T.map(t => t.cap)],
    [PLANS[sol].cover, '', all],
    ['Nightly Integrity Scans', '', all],
    ['Email alerts and notifications', '', all],
    ['Third-party integrations', '', [0, 0, 1, 1, 1]],
    ['One-way data integration', 'Fetch data from your systems', [0, 0, 0, 1, 1]],
    ['Two-way data integration', 'Enrich data and push updates back to your source systems', [0, 0, 0, 0, 1]],
    ['Screening list customization', '', [0, 0, 0, 1, 1]],
    ['Dedicated support staff and account success manager', '', [0, 0, 0, 1, 1]]
  ];
  return `<div class="fx-wrap" tabindex="0" role="region" aria-label="Compare ${M[sol].name} plans"><table class="fx">
    <thead><tr><th scope="col">Compare plans</th>${T.map(t => `<th scope="col"${t.pop ? ' class="pop"' : t.eff ? ' class="eff"' : ''}>${t.n}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(([n, sub, v]) => `<tr><th scope="row">${n}${sub ? `<small>${sub}</small>` : ''}</th>${v.map((x, i) => `<td${T[i].pop ? ' class="pop"' : T[i].eff ? ' class="eff"' : ''}>${typeof x === 'string' ? `<b>${x}</b>` : x ? CHECK : DASH}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}
function renderPlans(el) {
  if (!el) return;
  const hub = el.dataset.mode === 'hub';
  const sol = hub ? PR.sol : el.dataset.sol;
  const bill = hub ? PR.bill : (el.dataset.period || 'annual');
  el.dataset.period = bill;
  const P = PLANS[sol];
  const pick = hub ? `<div class="solpick" role="tablist" aria-label="Choose a solution">${SOLS.map(s => { const ct = PR.cart[s] && PLANS[s].tiers.find(x => x.k === PR.cart[s]); return `<button type="button" role="tab" aria-selected="${s === sol}" class="${s === sol ? 'on' : ''}" data-pick="${s}"><span class="sol-ic">${ICONS[s]}</span><span><b>${M[s].name}</b><small>${M[s].crumb}</small>${ct && ct.m ? `<em class="incart">✓ In your plan: ${ct.n}</em>` : ''}</span></button>`; }).join('')}</div>` : '';
  const tiers = P.tiers.map(t => {
    const ent = !t.m && !t.free, sel = hub && PR.cart[sol] === t.k, p = ent || t.free ? 0 : priceOf(t, bill);
    const priceBlock = t.free ? `<b>$0<small>/mo</small></b><span class="nocard">No credit card required</span>` : ent
      ? `<b>Custom</b><span>Tailored to your organization</span>`
      : `<b>${money(p)}<small>/mo</small></b><span>${bill === 'annual' ? `<s>${money(t.m)}</s> · billed annually, ${money(p * 12)}/yr` : 'Billed monthly'}</span>`;
    const btn = t.free ? `<button type="button" class="btn ghost" data-contact="${sol}">Get started free</button>` : ent
      ? `<button type="button" class="btn ghost" data-ent="${sol}">Contact us</button>`
      : `<button type="button" class="btn ${t.pop || t.eff || sel ? 'primary' : 'ghost'}${sel ? ' added' : ''}" data-pay="${t.k}" aria-pressed="${sel}">${sel ? '✓ Added to your plan' : 'Subscribe'}</button>`;
    const badge = t.pop ? '<span class="badge">Most popular</span>' : t.eff ? '<span class="badge eff">Most cost-efficient</span>' : '';
    return `<div class="tier${t.pop ? ' pop' : ''}${t.eff ? ' eff' : ''}${ent ? ' ent' : ''}${t.free ? ' free' : ''}${sel ? ' sel' : ''}">${badge}<div><h3>${t.n}</h3></div><p class="tb">${t.blurb}</p><div class="tprice">${priceBlock}</div><p class="trec">${t.rec}</p>${btn}</div>`;
  }).join('');
  el.innerHTML = `${pick}<div class="plans-bar"><span class="plans-for">${hub ? `Showing plans for <b>${M[sol].name}</b>` : 'Prices in USD'}</span><div class="bill" role="radiogroup" aria-label="Billing period"><button type="button" role="radio" aria-checked="${bill === 'monthly'}" class="${bill === 'monthly' ? 'on' : ''}" data-billing="monthly">Monthly</button><button type="button" role="radio" aria-checked="${bill === 'annual'}" class="${bill === 'annual' ? 'on' : ''}" data-billing="annual">Annually <em>Save 20%</em></button></div></div>${bundleHTML()}<h2 class="vh">Plans for ${M[sol].name}</h2><div class="tiers">${tiers}</div>${hub ? checkoutHTML(bill) : ''}${matrixHTML(sol)}`;
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-plans]');
  if (!el) return;
  const hub = el.dataset.mode === 'hub';
  const b = e.target.closest('[data-billing]');
  if (b) { el.dataset.period = b.dataset.billing; if (hub) PR.bill = b.dataset.billing; renderPlans(el); return; }
  const s = e.target.closest('[data-pick]');
  if (s) { PR.sol = s.dataset.pick; renderPlans(el); return; }
  const add = e.target.closest('[data-addsol]');
  if (add) { PR.sol = add.dataset.addsol; renderPlans(el); scrollToEl(el.querySelector('.solpick')); return; }
  const rm = e.target.closest('[data-rm]');
  if (rm) { delete PR.cart[rm.dataset.rm]; renderPlans(el); return; }
  const pay = e.target.closest('[data-pay]');
  if (pay) {
    const sol = hub ? PR.sol : el.dataset.sol;
    if (hub) {
      if (PR.cart[sol] === pay.dataset.pay) delete PR.cart[sol]; else PR.cart[sol] = pay.dataset.pay;
      renderPlans(el);
      const co = el.querySelector('.checkout');
      if (co && PR.cart[sol]) { const r = co.getBoundingClientRect(); if (r.top > innerHeight - 120 || r.bottom < 0) scrollToEl(co); }
    } else { PR.cart[sol] = pay.dataset.pay; PR.sol = sol; PR.bill = el.dataset.period; location.href = U('pricing') + '?sol=' + PR.sol + '&cart=' + Object.entries(PR.cart).map(x => x.join(':')).join(',') + '&bill=' + PR.bill; }
    return;
  }
  const en = e.target.closest('[data-ent]');
  if (en) { goSignup('ent', en.dataset.ent); return; }
  const c = e.target.closest('[data-contact]');
  if (c) { goSignup('free', c.dataset.contact); return; }
});

/* ---------- checkout: organization → agreement → payment → confirmation ---------- */
const SUPPORT = {phone: '1-800-604-1354', tel: 'tel:18006041354', email: 'support@sureshield.ai'};
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
const cartQS = () => '?sol=' + PR.sol + '&cart=' + Object.entries(PR.cart).map(x => x.join(':')).join(',') + '&bill=' + PR.bill + (CO.mode !== 'paid' ? '&mode=' + CO.mode + '&sols=' + coSolList().join(',') : '');
function goCheckout() { location.href = U('checkout') + cartQS(); }
function goPricing() { location.href = U('pricing') + cartQS(); }
const ORG_TYPES = ['Hospital or health system', 'Physician group or clinic', 'Post-acute or long-term care', 'Health plan or payer', 'Pharmacy', 'Behavioral health', 'Government contractor', 'Financial services', 'Other'];
const INDUSTRIES = ['Hospitals & health systems', 'Physician groups & clinics', 'Post-acute & long-term care', 'Behavioral health', 'Health plans & insurance', 'Pharmacy & life sciences', 'Healthcare staffing', 'Government & public sector', 'Education', 'Other'];
const COUNTRIES = ['United States', 'Canada', 'Mexico', 'United Kingdom', 'India', 'Other'];
const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','Puerto Rico'];
const CO_STEPS = ['Organization', 'Agreement', 'Payment', 'Confirmation'];
const CO = {step: 0, org: {country: 'United States', industries: []}, contacts: [], sign: null, order: null, contractNo: '', mode: 'paid', sols: {}, meeting: null};
{ const q = new URLSearchParams(location.search); if (q.get('mode') === 'free' || q.get('mode') === 'ent') { CO.mode = q.get('mode'); (q.get('sols') || '').split(',').forEach(s => { if (M[s]) CO.sols[s] = true; }); } }
function coStepNames() { return CO.mode === 'free' ? ['Organization', 'Agreement', 'Confirmation'] : CO.mode === 'ent' ? ['Organization', 'Meeting', 'Confirmation'] : CO_STEPS; }
function coLast() { return coStepNames().length - 1; }
function coSolList() { return SOLS.filter(s => CO.sols[s]); }
function goSignup(mode, sol) { CO.mode = mode; CO.sols = {}; if (M[sol]) CO.sols[sol] = true; CO.step = 0; CO.order = null; CO.sign = null; CO.contractNo = ''; CO.meeting = null; goCheckout(); }

function coDate(d) { return d.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}); }
function coTotals() {
  if (CO.mode !== 'paid') return {lines: coSolList().map(s => ({sol: s, t: PLANS[s].tiers.find(x => CO.mode === 'free' ? x.free : !x.m && !x.free)})).filter(x => x.t), list: 0, annual: 0, bundle: 0, total: 0};
  return cartTotals(PR.bill);
}
function coDueToday(c) { return CO.mode !== 'paid' ? 0 : PR.bill === 'annual' ? r2(c.total * 12) : c.total; }
function coNewNo(prefix) {
  const d = new Date(), p = n => String(n).padStart(2, '0');
  return `${prefix}-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/* summary beside every step */
function coSummaryHTML(c, open) {
  if (CO.mode !== 'paid') {
    const free = CO.mode === 'free';
    const lines = c.lines.length ? c.lines.map(x => `<li><span>${M[x.sol].name}<small>${free ? `Free · ${x.t.rec}` : 'Enterprise · unlimited records'}</small></span><b>${free ? '$0' : 'Custom'}</b></li>`).join('') : '<li><span>Choose at least one solution</span><b></b></li>';
    const body = `<ul class="cs-lines">${lines}</ul><p class="cs-due"><span>${free ? 'Due today · no credit card required' : 'Pricing tailored in your meeting'}</span><b>${free ? '$0' : ''}</b></p>`;
    const h = free ? 'Free plan' : 'Enterprise request';
    return `<aside class="co-sum2" aria-label="${h}"><details class="cs-m"${open ? ' open' : ''}><summary><span>${h}</span><b>${free ? '$0' : ''}</b></summary>${body}</details><div class="cs-d"><p class="cs-h">${h}</p>${body}</div></aside>`;
  }
  const lines = c.lines.map(x => `<li><span>${M[x.sol].name}<small>${x.t.n} · ${x.t.rec}</small></span><b>${money(x.t.m)}<small>/mo</small></b></li>`).join('');
  const body = `<ul class="cs-lines">${lines}
      ${c.annual ? `<li class="disc"><span>Annual billing savings (20%)</span><b>−${money(c.annual)}<small>/mo</small></b></li>` : ''}
      ${c.bundle ? `<li class="disc"><span>Bundle discount (25%)</span><b>−${money(c.bundle)}<small>/mo</small></b></li>` : ''}
      <li class="tot"><span>Total</span><b>${money(c.total)}<small>/mo</small></b></li>
    </ul>
    <p class="cs-due"><span>${PR.bill === 'annual' ? 'Due today, billed annually' : 'Due today, billed monthly'}</span><b>${money(coDueToday(c))}</b></p>
    ${CO.step === 0 ? `<button type="button" class="link cs-edit" data-co-edit>Change plans</button>` : ''}`;
  return `<aside class="co-sum2" aria-label="Order summary">
    <details class="cs-m"${open ? ' open' : ''}><summary><span>Order summary</span><b>${money(coDueToday(c))}</b></summary>${body}</details>
    <div class="cs-d"><p class="cs-h">Order summary</p>${body}</div>
  </aside>`;
}
function coStepsHTML() {
  return `<ol class="co-steps" aria-label="Checkout steps">${coStepNames().map((s, i) => {
    const st = i < CO.step ? 'done' : i === CO.step ? 'cur' : '';
    const back = i < CO.step && CO.step < coLast();
    return `<li class="${st}"${i === CO.step ? ' aria-current="step"' : ''}>${back ? `<button type="button" data-co-go="${i}">` : '<span class="cst">'}<i>${i < CO.step ? '✓' : i + 1}</i><span>${s}</span>${back ? '</button>' : '</span>'}</li>`;
  }).join('')}</ol>`;
}

/* field helpers */
const fid = n => 'co-' + n;
function fText(name, label, o = {}) {
  const v = o.value != null ? o.value : (CO.org[name] || '');
  return `<label class="cf${o.wide ? ' wide' : ''}" for="${fid(name)}"><span class="cl">${label}${o.req ? ' <i aria-hidden="true">*</i>' : ' <em>(optional)</em>'}</span><input id="${fid(name)}" name="${name}" value="${esc(v)}"${o.type ? ` type="${o.type}"` : ''}${o.ac ? ` autocomplete="${o.ac}"` : ''}${o.im ? ` inputmode="${o.im}"` : ''}${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}${o.req ? ' required aria-required="true"' : ''}><span class="fe" id="${fid(name)}-e" hidden></span></label>`;
}
function fSelect(name, label, opts, o = {}) {
  const v = CO.org[name] || '';
  return `<label class="cf${o.wide ? ' wide' : ''}" for="${fid(name)}"><span class="cl">${label}${o.req ? ' <i aria-hidden="true">*</i>' : ' <em>(optional)</em>'}</span><select id="${fid(name)}" name="${name}"${o.req ? ' required aria-required="true"' : ''}><option value="">${o.ph || 'Select'}</option>${opts.map(x => `<option${x === v ? ' selected' : ''}>${esc(x)}</option>`).join('')}</select><span class="fe" id="${fid(name)}-e" hidden></span></label>`;
}
function stateField() {
  return CO.org.country === 'United States'
    ? fSelect('state', 'State', US_STATES, {req: true, ph: 'Select a state'})
    : fText('state', 'State / Province / Region', {req: true, ac: 'address-level1'});
}
function contactRow(k, i) {
  const c = CO.contacts[i];
  return `<div class="kc" data-kc="${i}"><div class="kc-h"><b>Key contact ${i + 1}</b><button type="button" class="link" data-kc-rm="${i}">Remove</button></div>
    <div class="cgrid">
      <label class="cf" for="co-kc${i}-name"><span class="cl">Full name <em>(optional)</em></span><input id="co-kc${i}-name" data-kc-f="name" value="${esc(c.name)}" autocomplete="off"></label>
      <label class="cf" for="co-kc${i}-role"><span class="cl">Role <em>(optional)</em></span><input id="co-kc${i}-role" data-kc-f="role" value="${esc(c.role)}" placeholder="e.g. Compliance officer" autocomplete="off"></label>
      <label class="cf" for="co-kc${i}-email"><span class="cl">Email <em>(optional)</em></span><input id="co-kc${i}-email" data-kc-f="email" type="email" value="${esc(c.email)}" autocomplete="off"><span class="fe" id="co-kc${i}-email-e" hidden></span></label>
      <label class="cf" for="co-kc${i}-phone"><span class="cl">Phone <em>(optional)</em></span><input id="co-kc${i}-phone" data-kc-f="phone" type="tel" value="${esc(c.phone)}" autocomplete="off"></label>
    </div></div>`;
}

/* step 1: organization */
function coOrgHTML() {
  const o = CO.org;
  return `<form class="co-card co-form" data-co-form="org" novalidate>
    <div class="co-head2"><h2>Organization details</h2><p>${CO.mode === 'free' ? 'Tell us who the free plan is for. We use these details to set up your account.' : CO.mode === 'ent' ? 'Tell us about your organization. Next, you’ll choose a time to meet our team.' : 'Tell us who the subscription is for.'} Fields marked <i class="req">*</i> are required.</p></div>
    ${CO.mode !== 'paid' ? `<fieldset class="co-fs"><legend>Solutions <i class="req">*</i></legend><p class="co-hint">${CO.mode === 'free' ? 'Choose the solutions you want on the Free plan, up to 25 active monitoring records each.' : 'Choose the solutions you’d like to discuss.'}</p>
      <div class="chips">${SOLS.map(s => `<label class="chip-c"><input type="checkbox" name="sols" value="${s}"${CO.sols[s] ? ' checked' : ''}><span>${M[s].name}</span></label>`).join('')}</div><p class="fe" id="co-sols-e" hidden></p></fieldset>` : ''}
    <input class="hp" name="ish_trap_x" tabindex="-1" autocomplete="off" readonly data-lpignore="true" data-1p-ignore aria-hidden="true">
    <fieldset class="co-fs"><legend>Organization</legend><div class="cgrid">
      ${fText('name', 'Organization name', {req: true, ac: 'organization', wide: true})}
      ${fText('short', 'Short form / acronym', {ph: 'e.g. ACME'})}
      ${fSelect('type', 'Organization type', ORG_TYPES)}
      ${fText('url', 'Website / URL', {type: 'url', im: 'url', ac: 'url', ph: 'www.example.org', wide: true})}
    </div></fieldset>
    <fieldset class="co-fs"><legend>Industries served by this organization <em>(optional, choose any)</em></legend>
      <div class="chips">${INDUSTRIES.map((x, i) => `<label class="chip-c"><input type="checkbox" name="industries" value="${esc(x)}"${o.industries.includes(x) ? ' checked' : ''}><span>${x}</span></label>`).join('')}</div>
    </fieldset>
    <fieldset class="co-fs"><legend>Address</legend><div class="cgrid">
      ${fText('addr', 'Address', {req: true, ac: 'street-address', wide: true, ph: 'Street address, suite or unit'})}
      ${fSelect('country', 'Country', COUNTRIES, {req: true})}
      <div class="cf-slot" data-state-slot>${stateField()}</div>
      ${fText('city', 'City', {req: true, ac: 'address-level2'})}
      ${fText('zip', 'ZIP code', {req: true, ac: 'postal-code', im: o.country === 'United States' ? 'numeric' : 'text'})}
    </div></fieldset>
    <fieldset class="co-fs"><legend>System administrator</legend><p class="co-hint">The person who will set up and manage your IntegrityShield account.</p><div class="cgrid">
      ${fText('adminFirst', 'First name', {ac: 'given-name', req: true})}
      ${fText('adminLast', 'Last name', {ac: 'family-name', req: true})}
      ${fText('adminEmail', 'Work email', {type: 'email', ac: 'email', req: true})}
      ${fText('adminPhone', 'Phone', {type: 'tel', ac: 'tel'})}
    </div><p class="co-hint">They’ll get the login details by email and can add more users once the account is set up.</p></fieldset>
    <p class="co-formerr" role="alert" hidden></p>
    <div class="co-nav"><button type="button" class="link" data-co-edit>← Back to plans</button><button type="submit" class="btn primary">${CO.mode === 'ent' ? 'Continue to choose a time' : 'Continue to agreement'}</button></div>
  </form>`;
}

/* step 2: agreement */
function coDocHTML(id, title, items) {
  return `<section class="co-doc" aria-labelledby="${id}"><h3 id="${id}">${title}</h3><div class="co-doc-b" tabindex="0">${items.map(([h, p]) => `${h ? `<h4>${h}</h4>` : ''}${(Array.isArray(p) ? p : [p]).map(x => `<p>${x}</p>`).join('')}`).join('')}</div></section>`;
}
function coAddress() { const o = CO.org; return [o.addr, o.city, [o.state, o.zip].filter(Boolean).join(' '), o.country].filter(Boolean).join(', '); }
function coAgreementHTML(c) {
  const o = CO.org, s = CO.sign;
  const start = coDate(new Date());
  const term = CO.mode === 'free' ? 'Free plan at no charge, until cancelled or upgraded' : PR.bill === 'annual' ? '12 months from the start date, billed annually in advance' : 'Month to month, billed monthly';
  const rows = c.lines.map(x => `<tr><td>${M[x.sol].name}</td><td>${x.t.n}</td><td>${x.t.rec}</td><td class="n">${money(x.t.m)}/mo</td></tr>`).join('');
  return `<div class="co-card">
    <div class="co-head2"><h2>Review and sign your agreement</h2><p>Read the purchase summary, the IntegrityShield Software Subscription Agreement and the Privacy Policy, then sign below. ${RV(AG_REVIEW)}</p></div>
    <section class="co-contract" aria-labelledby="co-ct-h">
      <div class="cc-top"><h3 id="co-ct-h">Subscription agreement</h3><span>No. ${CO.contractNo}</span></div>
      <dl class="cc-dl">
        <div><dt>Customer</dt><dd>${esc(o.name)}${o.short ? ` (${esc(o.short)})` : ''}</dd></div>
        <div><dt>Address</dt><dd>${esc(coAddress())}</dd></div>
        <div><dt>Provider</dt><dd>SureShield, Inc., 3343 Peachtree Rd NE, Ste 145-1564, Atlanta, GA 30326</dd></div>
        <div><dt>Start date</dt><dd>${start}</dd></div>
        <div><dt>Term</dt><dd>${term}</dd></div>
      </dl>
      <div class="cc-tw"><table class="cc-t"><thead><tr><th>Solution</th><th>Plan</th><th>Records</th><th class="n">List price</th></tr></thead><tbody>${rows}</tbody>
        <tfoot>
          ${c.annual ? `<tr><td colspan="3">Annual billing savings (20%)</td><td class="n">−${money(c.annual)}/mo</td></tr>` : ''}
          ${c.bundle ? `<tr><td colspan="3">Bundle discount (25%)</td><td class="n">−${money(c.bundle)}/mo</td></tr>` : ''}
          <tr class="tt"><td colspan="3">Total</td><td class="n">${money(c.total)}/mo</td></tr>
          ${CO.mode === 'free' ? '<tr class="tt"><td colspan="3">Amount due</td><td class="n">$0, no credit card required</td></tr>' : `<tr class="tt"><td colspan="3">${PR.bill === 'annual' ? 'Amount due today (12 months)' : 'Amount due today (first month)'}</td><td class="n">${money(coDueToday(c))}</td></tr>`}
        </tfoot></table></div>
    </section>
    ${coDocHTML('co-tc-h', AGREEMENT.title, agreementSections({licensee: esc(o.name), date: s ? s.date : start, notice: esc([o.name, coAddress(), o.adminEmail].filter(Boolean).join(', '))}))}
    ${coDocHTML('co-pp-h', 'Privacy Policy', PRIVACY_POLICY.sections)}
    ${s ? coSignedHTML() : `<form class="co-sign" data-co-form="sign" novalidate>
      <h3>Electronic signature</h3>
      <div class="cgrid">
        <label class="cf" for="co-sname"><span class="cl">Signer full name <i aria-hidden="true">*</i></span><input id="co-sname" name="sname" autocomplete="name" required aria-required="true" value="${esc(CO.draftSign.sname || o.adminName || '')}"><span class="fe" id="co-sname-e" hidden></span></label>
        <label class="cf" for="co-stitle"><span class="cl">Title <i aria-hidden="true">*</i></span><input id="co-stitle" name="stitle" autocomplete="organization-title" required aria-required="true" value="${esc(CO.draftSign.stitle || o.adminTitle || '')}"><span class="fe" id="co-stitle-e" hidden></span></label>
        <label class="cf wide" for="co-semail"><span class="cl">Work email <i aria-hidden="true">*</i> <em>The signed contract and receipt go here</em></span><input id="co-semail" name="semail" type="email" autocomplete="email" required aria-required="true" value="${esc(CO.draftSign.semail || o.adminEmail || '')}"><span class="fe" id="co-semail-e" hidden></span></label>
      </div>
      <div class="sig-pad" aria-hidden="true"><span class="sig-l">Signature</span><span class="sig-v" data-sig-v>${esc(CO.draftSign.sname || o.adminName || '')}</span><span class="sig-d">${start}</span></div>
      <label class="ck"><input type="checkbox" name="tc"${CO.draftSign.tc ? ' checked' : ''}><span>I have read and agree to the IntegrityShield Software Subscription Agreement. <i aria-hidden="true">*</i></span></label>
      <label class="ck"><input type="checkbox" name="pp"${CO.draftSign.pp ? ' checked' : ''}><span>I have read and agree to the Privacy Policy. <i aria-hidden="true">*</i></span></label>
      <label class="ck"><input type="checkbox" name="es"${CO.draftSign.es ? ' checked' : ''}><span>I am authorized to sign for ${esc(o.name)}, and typing my name above is my electronic signature. <i aria-hidden="true">*</i></span></label>
      ${nlBox(CO.draftSign.newsletter !== false)}
      <p class="co-formerr" role="alert" hidden></p>
      <div class="co-nav"><button type="button" class="link" data-co-go="0">← Back</button><button type="submit" class="btn primary">Sign agreement</button></div>
    </form>`}
  </div>`;
}
function coSignedHTML() {
  const s = CO.sign;
  return `<div class="co-signed">
    <div class="sig-pad on"><span class="sig-l">Signed</span><span class="sig-v">${esc(s.name)}</span><span class="sig-d">${esc(s.title)} · ${s.date}</span></div>
    <p class="co-ok"><b>Agreement signed.</b> You can download a copy now. We’ll also email the signed contract to <b>${esc(s.email)}</b> ${CO.mode === 'free' ? 'with your account details' : 'after payment'}.</p>
    ${CO.mode === 'free' ? '<p class="co-formerr" role="alert" hidden data-co-senderr></p>' : ''}<div class="co-nav"><button type="button" class="btn ghost" data-co-dl>Download contract (PDF)</button>${CO.mode === 'free' ? '<button type="button" class="btn primary" data-co-free>Complete sign-up</button>' : '<button type="button" class="btn primary" data-co-go="2">Continue to payment</button>'}</div>
    <button type="button" class="link co-resign" data-co-resign>Edit signer details</button>
  </div>`;
}

/* step 3: payment */
function coPaymentHTML(c) {
  const due = coDueToday(c);
  return `<div class="co-card">
    <div class="co-head2"><h2>Payment</h2><p>${PR.bill === 'annual' ? 'Your annual subscription is billed today for 12 months.' : 'Your first month is billed today, then every month.'}</p></div>
    <div class="pay-due"><span>Amount due today</span><b>${money(due)}</b></div>
    <div class="pay-box" role="note">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="4" y="10.5" width="16" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>
      <div><b>Secure card payment</b><span>Card details go straight to Stripe and are never stored by IntegrityShield. The payment form will appear here once payments are connected; this demo does not take payments or ask for card details. ${RV('Stripe connection pending: payment form and test plan')}</span></div>
    </div>
    <p class="pay-note">The receipt and signed contract go to <b>${esc(CO.sign.email)}</b>.</p>
    <div class="co-nav"><button type="button" class="link" data-co-go="1">← Back</button><button type="button" class="btn primary" data-co-pay>Pay ${money(due)}</button></div>
    <p class="pay-demo">Demo: selecting Pay completes the order without charging anything.</p>
  </div>`;
}

/* step 4: confirmation */
function coDoneHTML() {
  const d = CO.order;
  const pro = d.lines.some(x => x.t.k === 'max');
  return `<div class="co-card co-done">
    <div class="cd-top"><span class="cd-ic" aria-hidden="true">✓</span><div><h2>Thank you. Your order is confirmed.</h2><p>Order <b>${d.no}</b> for ${esc(d.org)}.</p></div></div>
    ${pro ? `<div class="cd-csm"><b>Your dedicated success manager will contact you shortly.</b><span>Essential PRO includes a dedicated success manager to help you set up and get the most from IntegrityShield.</span></div>` : ''}
    <div class="cd-next"><h3>What happens next</h3>
      <p>You’ll receive an email at <b>${esc(d.email)}</b> within the next <b>24 to 48 hours</b> with your account setup details, receipt and signed contract.</p>
      <p class="cd-spam">Please keep an eye on your spam or junk folder in case the email lands there.</p>
    </div>
    <dl class="cc-dl cd-dl">
      <div><dt>Order number</dt><dd>${d.no}</dd></div>
      <div><dt>Date</dt><dd>${d.date}</dd></div>
      <div><dt>Organization</dt><dd>${esc(d.org)}</dd></div>
      <div><dt>Plans</dt><dd>${d.lines.map(x => `${M[x.sol].name} · ${x.t.n}`).join('<br>')}</dd></div>
      <div><dt>Billing</dt><dd>${d.bill === 'annual' ? 'Annual, billed in advance' : 'Monthly'}</dd></div>
      <div><dt>Amount paid</dt><dd>${money(d.paid)}${d.bundle ? ' <small>(includes 25% bundle discount)</small>' : ''}</dd></div>
      <div><dt>Agreement</dt><dd>No. ${d.contractNo}, signed by ${esc(d.signer)}</dd></div>
    </dl>
    <div class="cd-help"><h3>Need help?</h3><p>Reach us about anything to do with your order or account.</p>
      <div class="cd-ways"><a href="${SUPPORT.tel}"><span>Call</span><b>${SUPPORT.phone}</b></a><a href="mailto:${SUPPORT.email}"><span>Email</span><b>${SUPPORT.email}</b></a></div>
    </div>
    <div class="co-nav"><button type="button" class="btn ghost" data-co-dl>Download contract (PDF)</button><a class="btn primary" href="#home">Back to home</a></div>
  </div>`;
}

function coMeetingHTML() {
  const list = coSolList(), k = list.length === 1 ? list[0] : 'gen';
  const tmp = document.createElement('div'); tmp.innerHTML = bookHTML(k);
  const cal = tmp.querySelector('.cal'); cal.removeAttribute('data-reveal');
  const h3 = cal.querySelector('.cal-info h3'); if (h3) h3.textContent = 'IntegrityShield Enterprise consultation';
  const sb = cal.querySelector('.cal-form button[type=submit]'); if (sb) sb.textContent = 'Book meeting and send request';
  const dn = cal.querySelector('[data-demo-note]'); if (dn && scanApi()) dn.remove();
  return `<div class="co-card co-meet">
    <div class="co-head2"><h2>Choose a time to meet our team</h2><p>Enterprise plans are tailored to your organization. Pick a time for a 30-minute call to go through your needs and pricing. Booking a time sends your request.</p></div>
    ${cal.outerHTML}
    <p class="co-formerr" role="alert" hidden data-co-senderr></p>
    <div class="co-nav"><button type="button" class="link" data-co-go="0">← Back</button></div>
  </div>`;
}
const PAYMENTS_LIVE = true;           // the backend decides: it refuses paid orders unless its PAYMENTS_LIVE property is 1
async function pdfB64(blocks) {
  const buf = new Uint8Array(await buildPDF(blocks).arrayBuffer());
  let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  return btoa(s);
}
function coOrderFields() {
  const c = coTotals(), free = CO.mode === 'free';
  return {lines: c.lines.map(x => ({sol: M[x.sol].name, plan: free ? 'Free' : x.t.n, records: x.t.rec, price: free ? 0 : x.t.m})),
    bill: free ? 'free' : PR.bill, list: free ? 0 : c.list, annualOff: free ? 0 : c.annual, bundleOff: free ? 0 : c.bundle, total: free ? 0 : c.total, due: free ? 0 : coDueToday(c)};
}
function coSignupBody(extra) {
  const o = CO.org, s = CO.sign || {};
  return {kind: CO.mode === 'free' ? 'free' : CO.mode === 'paid' ? 'paid' : 'enterprise', solutions: (CO.mode === 'paid' ? [...new Set(coTotals().lines.map(x => x.sol))] : coSolList()).map(x => M[x].name).join(', '), org: o.name, short: o.short, type: o.type, url: o.url,
    industries: (o.industries || []).join(', '), addr: o.addr, city: o.city, state: o.state, zip: o.zip, country: o.country,
    adminName: o.adminName, adminFirst: o.adminFirst, adminLast: o.adminLast, adminTitle: '', adminEmail: o.adminEmail, adminPhone: o.adminPhone,
    contacts: CO.contacts.filter(k => k.name || k.email).map(k => [k.name, k.role, k.email, k.phone].filter(Boolean).join(', ')).join('; '),
    signName: s.name || '', signTitle: s.title || '', signEmail: s.email || '', contractNo: CO.mode !== 'ent' ? CO.contractNo : '',
    page: location.pathname, utm: Object.entries(bookUtm()).map(([a, b]) => `${a}=${b}`).join('&'), website: o.hp || '', ...extra};
}
async function coSignupSend(extra) {
  if (!scanApi()) return {ok: true};
  try { return await licCall('/signup', coSignupBody(extra)); } catch (x) { return {ok: false}; }
}
function coSendErr(r) {
  const p = $('#page-checkout [data-co-senderr]');
  if (!p) return;
  p.textContent = r && r.status === 429 ? `We’ve had an unusual number of requests today. Please try again tomorrow, or call ${SUPPORT.phone}.` : `We couldn’t send this just now. Please try again, or call ${SUPPORT.phone}.`;
  p.hidden = false;
}
document.addEventListener('cal:booked', async e => {
  if (!e.target.closest || !e.target.closest('#page-checkout') || CO.mode !== 'ent') return;
  const d = e.detail, no = coNewNo('ISE');
  const r = await coSignupSend({ref: no, meeting: d.when, meetingStart: d.start || '', meetingName: d.name, meetingEmail: d.email, meetingBooked: d.live, newsletter: d.newsletter});
  if (!r.ok) { coSendErr(r); return; }
  CO.order = {no, date: coDate(new Date()), org: CO.org.name, email: d.email, meeting: d.when, booked: d.live, lines: coTotals().lines};
  CO.step = coLast(); renderCheckout(true);
});
function coDoneAltHTML() {
  const d = CO.order, free = CO.mode === 'free';
  const help = `<div class="cd-help"><h3>Need help?</h3><p>Reach us about anything to do with your ${free ? 'account' : 'request'}.</p>
      <div class="cd-ways"><a href="${SUPPORT.tel}"><span>Call</span><b>${SUPPORT.phone}</b></a><a href="mailto:${SUPPORT.email}"><span>Email</span><b>${SUPPORT.email}</b></a></div></div>`;
  if (free) return `<div class="co-card co-done">
    <div class="cd-top"><span class="cd-ic" aria-hidden="true">✓</span><div><h2>Thank you. Your free plan is on its way.</h2><p>Reference <b>${d.no}</b> for ${esc(d.org)}.</p></div></div>
    <div class="cd-next"><h3>What happens next</h3>
      <p>We’ve emailed your plan details and signed agreement to <b>${esc(d.email)}</b> from <b>sales@sureshield.ai</b>.</p>
      <p>Keep an eye out for a second email from <b>admin@sureshield.ai</b> with your login details and account setup.</p>
      <p class="cd-spam">Please keep an eye on your spam or junk folder in case the email lands there.</p></div>
    <dl class="cc-dl cd-dl">
      <div><dt>Reference</dt><dd>${d.no}</dd></div><div><dt>Date</dt><dd>${d.date}</dd></div><div><dt>Organization</dt><dd>${esc(d.org)}</dd></div>
      <div><dt>Plans</dt><dd>${d.lines.map(x => `${M[x.sol].name} · Free (${x.t.rec.toLowerCase()})`).join('<br>')}</dd></div>
      <div><dt>Agreement</dt><dd>No. ${d.contractNo}, signed by ${esc(d.signer)}</dd></div>
    </dl>${help}
    <div class="co-nav"><button type="button" class="btn ghost" data-co-dl>Download agreement (PDF)</button><a class="btn primary" href="#home">Back to home</a></div>
  </div>`;
  return `<div class="co-card co-done">
    <div class="cd-top"><span class="cd-ic" aria-hidden="true">✓</span><div><h2>Thank you. Your Enterprise request is in.</h2><p>Reference <b>${d.no}</b> for ${esc(d.org)}.</p></div></div>
    <div class="cd-next"><h3>Your meeting</h3>
      <p><b>${esc(d.meeting)}</b></p>
      <p>${d.booked ? `A calendar invite with the video link is on its way to <b>${esc(d.email)}</b>.` : `Our team will confirm this time by email at <b>${esc(d.email)}</b>, with the video link.`} In the meeting we’ll go through your needs and prepare a tailored Enterprise quote.</p>
      <p class="cd-spam">Please keep an eye on your spam or junk folder in case the email lands there.</p></div>
    <dl class="cc-dl cd-dl">
      <div><dt>Reference</dt><dd>${d.no}</dd></div><div><dt>Date</dt><dd>${d.date}</dd></div><div><dt>Organization</dt><dd>${esc(d.org)}</dd></div>
      <div><dt>Solutions</dt><dd>${d.lines.map(x => M[x.sol].name).join('<br>')}</dd></div>
    </dl>${help}
    <div class="co-nav"><a class="btn primary" href="#home">Back to home</a></div>
  </div>`;
}

function coEmptyHTML() {
  return `<div class="co-card co-empty"><h2>Your plan is empty.</h2><p>Choose a plan on the pricing page, then continue to checkout.</p><div class="co-nav"><a class="btn primary" href="#pricing">See plans</a></div></div>`;
}

function renderCheckout(focusTop) {
  const root = $('#page-checkout');
  if (!root) return;
  if (!CO.draftSign) CO.draftSign = {};
  const c = coTotals();
  let main, aside = '';
  const alt = CO.mode !== 'paid';
  if (CO.step === coLast() && CO.order) main = alt ? coDoneAltHTML() : coDoneHTML();
  else if (!alt && !c.lines.length) main = coEmptyHTML();
  else {
    if (alt && CO.step > 0 && !c.lines.length) CO.step = 0;
    if (!CO.contractNo) CO.contractNo = coNewNo('ISA');
    main = CO.step === 0 ? coOrgHTML() : CO.step === 1 ? (CO.mode === 'ent' ? coMeetingHTML() : coAgreementHTML(c)) : coPaymentHTML(c);
    aside = CO.mode === 'ent' && CO.step === 1 ? '' : coSummaryHTML(c);
  }
  const done = CO.step === coLast() && CO.order;
  const bar = CO.mode === 'free' ? 'Free plan' : CO.mode === 'ent' ? 'Enterprise' : 'Checkout';
  const h1 = CO.mode === 'free' ? (done ? 'You’re signed up' : 'Start your free plan') : CO.mode === 'ent' ? (done ? 'Request sent' : 'Request IntegrityShield Enterprise') : (done ? 'Order confirmed' : 'Complete your subscription');
  root.innerHTML = `<div class="co-bg" aria-hidden="true"><i></i><i></i></div>
    <section class="wrap co-wrap">
      <div class="co-top"><span class="bar">${bar}</span><h1>${h1}</h1>${(alt || c.lines.length || CO.order) ? coStepsHTML() : ''}</div>
      <div class="co-grid${aside ? '' : ' solo'}"><div class="co-main2">${main}</div>${aside}</div>
    </section>`;
  const mc = root.querySelector('.co-meet [data-cal]');
  if (mc) {
    initCal(mc);
    const set = (n, v) => { const i = mc.querySelector(`.cal-form [name=${n}]`); if (i && v && !i.value) i.value = v; };
    set('name', CO.org.adminName); set('email', CO.org.adminEmail); set('org', CO.org.name);
  }
  if (focusTop) { scrollToY(0, true); const h = root.querySelector('.co-head2 h2, .cd-top h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({preventScroll: true}); } }
}

/* validation */
const CO_EMAIL = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
function coErr(form, name, msg, sel) {
  const el = sel ? form.querySelector(sel) : form.querySelector(`[name="${name}"]`);
  if (!el) return;
  const e = form.querySelector('#' + el.id + '-e');
  el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  if (e) { e.textContent = msg || ''; e.hidden = !msg; if (msg) el.setAttribute('aria-describedby', e.id); else el.removeAttribute('aria-describedby'); }
}
function coReadOrg(f) {
  const o = CO.org, g = n => (f.elements[n] ? f.elements[n].value.trim() : '');
  ['name', 'short', 'type', 'url', 'addr', 'country', 'state', 'city', 'zip', 'adminFirst', 'adminLast', 'adminEmail', 'adminPhone'].forEach(n => { o[n] = g(n); });
  o.adminName = [o.adminFirst, o.adminLast].filter(Boolean).join(' '); o.adminTitle = '';
  o.industries = $$('input[name=industries]:checked', f).map(x => x.value);
  o.hp = g('ish_trap_x');
  if (CO.mode !== 'paid') { CO.sols = {}; $$('input[name=sols]:checked', f).forEach(x => { CO.sols[x.value] = true; }); }
  $$('[data-kc]', f).forEach(row => { const i = +row.dataset.kc; $$('[data-kc-f]', row).forEach(inp => { CO.contacts[i][inp.dataset.kcF] = inp.value.trim(); }); });
}
function coValidateOrg(f) {
  coReadOrg(f);
  const o = CO.org, bad = [];
  const need = [['name', 'Enter your organization’s name.'], ['addr', 'Enter the street address.'], ['country', 'Choose a country.'], ['state', o.country === 'United States' ? 'Choose a state.' : 'Enter the state, province or region.'], ['city', 'Enter the city.'], ['zip', 'Enter the ZIP code.']];
  need.forEach(([n, m]) => { const miss = !o[n]; coErr(f, n, miss ? m : ''); if (miss) bad.push(n); });
  if (o.zip && o.country === 'United States' && !/^\d{5}(-\d{4})?$/.test(o.zip)) { coErr(f, 'zip', 'Enter a 5-digit ZIP code, for example 30326.'); bad.push('zip'); }
  if (o.url && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(o.url)) { coErr(f, 'url', 'Enter a web address, for example www.example.org.'); bad.push('url'); } else coErr(f, 'url', '');
  if (o.adminEmail && !CO_EMAIL(o.adminEmail)) { coErr(f, 'adminEmail', 'Enter a valid email address.'); bad.push('adminEmail'); } else coErr(f, 'adminEmail', '');
  if (!o.adminFirst) { coErr(f, 'adminFirst', 'Enter the administrator’s first name.'); bad.push('adminFirst'); } else coErr(f, 'adminFirst', '');
  if (!o.adminLast) { coErr(f, 'adminLast', 'Enter the administrator’s last name.'); bad.push('adminLast'); } else coErr(f, 'adminLast', '');
  if (!o.adminEmail) { coErr(f, 'adminEmail', 'Enter the administrator’s work email.'); bad.push('adminEmail'); }
  if (CO.mode !== 'paid') {
    const se = f.querySelector('#co-sols-e'), none = !coSolList().length;
    if (se) { se.textContent = none ? 'Choose at least one solution.' : ''; se.hidden = !none; }
    if (none) bad.push('sols');
  }
  CO.contacts.forEach((c, i) => { const ok = !c.email || CO_EMAIL(c.email); coErr(f, '', ok ? '' : 'Enter a valid email address.', `#co-kc${i}-email`); if (!ok) bad.push(`kc${i}`); });
  return bad;
}
function coFormError(f, n) {
  const p = f.querySelector('.co-formerr');
  if (!p) return;
  p.textContent = n ? `Please check the ${n === 1 ? 'highlighted field' : n + ' highlighted fields'}.` : '';
  p.hidden = !n;
}
function coFocusFirst(f) { const el = f.querySelector('[aria-invalid="true"]'); if (el) { el.focus({preventScroll: true}); scrollToY(el.getBoundingClientRect().top + window.scrollY - 140); } }

document.addEventListener('submit', e => {
  const f = e.target.closest('[data-co-form]');
  if (!f) return;
  e.preventDefault();
  if (f.dataset.coForm === 'org') {
    const bad = coValidateOrg(f);
    coFormError(f, bad.length);
    if (bad.length) { coFocusFirst(f); return; }
    CO.sign = null; CO.step = 1; renderCheckout(true); return;
  }
  if (f.dataset.coForm === 'sign') {
    const g = n => f.elements[n].value.trim(), bad = [];
    const d = CO.draftSign; d.sname = g('sname'); d.stitle = g('stitle'); d.semail = g('semail'); d.tc = f.elements.tc.checked; d.pp = f.elements.pp.checked; d.es = f.elements.es.checked; d.newsletter = !!(f.elements.newsletter && f.elements.newsletter.checked);
    [['sname', !d.sname && 'Enter the signer’s full name.'], ['stitle', !d.stitle && 'Enter the signer’s title.'], ['semail', !d.semail ? 'Enter a work email.' : !CO_EMAIL(d.semail) && 'Enter a valid email address.']].forEach(([n, m]) => { coErr(f, n, m || ''); if (m) bad.push(n); });
    ['tc', 'pp', 'es'].forEach(n => { const box = f.elements[n]; box.setAttribute('aria-invalid', box.checked ? 'false' : 'true'); box.closest('.ck').classList.toggle('bad', !box.checked); if (!box.checked) bad.push(n); });
    const p = f.querySelector('.co-formerr');
    p.textContent = bad.length ? (bad.some(x => ['tc', 'pp', 'es'].includes(x)) && bad.length === bad.filter(x => ['tc', 'pp', 'es'].includes(x)).length ? 'Please tick all three boxes to sign.' : `Please check the ${bad.length === 1 ? 'highlighted item' : bad.length + ' highlighted items'}.`) : '';
    p.hidden = !bad.length;
    if (bad.length) { coFocusFirst(f); return; }
    CO.sign = {name: d.sname, title: d.stitle, email: d.semail, date: coDate(new Date()), at: new Date().toISOString()};
    renderCheckout(false);
    const s = $('#page-checkout .co-signed'); if (s) scrollToY(s.getBoundingClientRect().top + window.scrollY - 140);
  }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (!t.closest || !t.closest('#page-checkout')) return;
  if (t.name === 'sname') { const v = $('#page-checkout [data-sig-v]'); if (v) v.textContent = t.value; }
  if (t.getAttribute('aria-invalid') === 'true' && t.value.trim()) { const f = t.closest('form'); t.setAttribute('aria-invalid', 'false'); const er = f && f.querySelector('#' + t.id + '-e'); if (er) er.hidden = true; }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (!t.closest || !t.closest('#page-checkout')) return;
  if (t.type === 'checkbox' && t.closest('.ck') && t.checked) { t.closest('.ck').classList.remove('bad'); t.setAttribute('aria-invalid', 'false'); }
  if (t.name === 'country') {
    const f = t.closest('form'); coReadOrg(f);
    CO.org.country = t.value; CO.org.state = '';
    f.querySelector('[data-state-slot]').innerHTML = stateField();
    const z = f.elements.zip; if (z) z.setAttribute('inputmode', t.value === 'United States' ? 'numeric' : 'text');
  }
  if (t.getAttribute('aria-invalid') === 'true' && t.value) { t.setAttribute('aria-invalid', 'false'); const f = t.closest('form'); const er = f && f.querySelector('#' + t.id + '-e'); if (er) er.hidden = true; }
});
document.addEventListener('click', e => {
  if (!e.target.closest) return;
  const inCo = e.target.closest('#page-checkout');
  if (e.target.closest('[data-checkout]')) {
    if (!cartLines().length) return;
    CO.mode = 'paid'; CO.step = 0; CO.order = null; CO.sign = null; CO.contractNo = '';
    goCheckout(); return;
  }
  if (!inCo) return;
  const ed = e.target.closest('[data-co-edit]');
  if (ed) { const f = inCo.querySelector('[data-co-form="org"]'); if (f) coReadOrg(f); goPricing(); return; }
  const add = e.target.closest('[data-kc-add]');
  if (add) { const f = add.closest('form'); coReadOrg(f); CO.contacts.push({name: '', role: '', email: '', phone: ''}); renderCheckout(false); const i = $(`#co-kc${CO.contacts.length - 1}-name`); if (i) i.focus(); return; }
  const rm = e.target.closest('[data-kc-rm]');
  if (rm) { const f = rm.closest('form'); coReadOrg(f); CO.contacts.splice(+rm.dataset.kcRm, 1); renderCheckout(false); return; }
  const go = e.target.closest('[data-co-go]');
  if (go) {
    const to = +go.dataset.coGo, f = inCo.querySelector('[data-co-form="org"]');
    if (f) coReadOrg(f);
    const sf = inCo.querySelector('[data-co-form="sign"]');
    if (sf) { const d = CO.draftSign; ['sname', 'stitle', 'semail'].forEach(n => { d[n] = sf.elements[n].value.trim(); }); ['tc', 'pp', 'es'].forEach(n => { d[n] = sf.elements[n].checked; }); }
    if (to === 2 && !CO.sign) return;
    CO.step = to; renderCheckout(true); return;
  }
  if (e.target.closest('[data-co-resign]')) { CO.draftSign = {sname: CO.sign.name, stitle: CO.sign.title, semail: CO.sign.email, tc: true, pp: true, es: true}; CO.sign = null; renderCheckout(false); return; }
  if (e.target.closest('[data-co-dl]')) { coDownload(); return; }
  const fr = e.target.closest('[data-co-free]');
  if (fr) {
    if (fr.disabled || !CO.sign) return;
    const label = fr.textContent; fr.disabled = true; fr.textContent = 'Sending…';
    const no = coNewNo('ISF');
    (async () => {
      let agreementPdf = '';
      try { agreementPdf = await pdfB64(coContractBlocks()); } catch (err) { console.warn('agreement PDF failed', err); }
      return coSignupSend({ref: no, newsletter: CO.draftSign.newsletter !== false, ...coOrderFields(), agreementPdf});
    })().then(r => {
      fr.disabled = false; fr.textContent = label;
      if (!r.ok) { coSendErr(r); return; }
      const c = coTotals();
      CO.order = {no, date: coDate(new Date()), org: CO.org.name, email: CO.org.adminEmail || CO.sign.email, signer: CO.sign.name, lines: c.lines, bill: 'free', paid: 0, total: 0, annual: 0, bundle: 0, list: 0, contractNo: CO.contractNo, address: coAddress()};
      CO.step = coLast(); renderCheckout(true);
    });
    return;
  }
  if (e.target.closest('[data-co-pay]')) {
    const c = coTotals();
    CO.order = {no: coNewNo('IS'), date: coDate(new Date()), org: CO.org.name, email: CO.sign.email, signer: CO.sign.name, lines: c.lines, bill: PR.bill, paid: coDueToday(c), total: c.total, annual: c.annual, bundle: c.bundle, list: c.list, contractNo: CO.contractNo, address: coAddress()};
    // the cart is emptied only after the order has been sent: the order's plans are read from it
    (PAYMENTS_LIVE ? coPaidSend('') : Promise.resolve(null)).then(r => { if (r && !r.ok) console.warn('order emails failed', r); }).catch(err => console.warn('order send failed', err)).finally(() => { PR.cart = {}; });   // the gateway's payment reference goes here once connected
    CO.step = 3; renderCheckout(true); return;
  }
});

/* invoice for a paid order (d = CO.order) */
function coInvoiceBlocks(d, paymentRef) {
  const B = [], o = CO.org, p = (t, gap = 0) => B.push({t: pdfSafe(t), gap});
  B.push({t: 'IntegrityShield Invoice', b: true, s: 18});
  p(`Invoice no. ${d.no}   Date: ${d.date}   Status: PAID`, 6);
  p('From: SureShield, Inc., 3343 Peachtree Rd NE, Ste 145-1564, Atlanta, GA 30326, sales@sureshield.ai, 1-800-604-1354', 6);
  p(`Bill to: ${o.name}, ${d.address}`, 2);
  p(`Attention: ${[o.adminName, o.adminEmail].filter(Boolean).join(', ')}`, 2);
  B.push({t: 'Items (monthly list price)', b: true, gap: 12});
  d.lines.forEach(x => p(`${M[x.sol].name} - ${x.t.n} (${x.t.rec}): ${money(x.t.m)}/mo`, 3));
  B.push({t: 'Summary', b: true, gap: 12});
  p(`Billing: ${d.bill === 'annual' ? 'annual, billed once for 12 months' : 'monthly'}`, 3);
  p(`List price: ${money(d.list)}/mo`, 3);
  if (d.annual) p(`Annual billing savings (20%): -${money(d.annual)}/mo`, 3);
  if (d.bundle) p(`Bundle discount (25%): -${money(d.bundle)}/mo`, 3);
  p(`Total: ${money(d.total)}/mo`, 3);
  B.push({t: `Amount paid: ${money(d.paid)}`, b: true, gap: 8});
  if (paymentRef) p(`Payment reference: ${paymentRef}`, 3);
  p(`Agreement no. ${d.contractNo}, signed by ${CO.sign.name}.`, 8);
  return B;
}
async function coPaidSend(paymentRef) {
  const d = CO.order;
  if (!PAYMENTS_LIVE) return {ok: true, skipped: true};   // every paid order, Essential PRO included, reaches sales@
  let agreementPdf = '', invoicePdf = '';
  try { agreementPdf = await pdfB64(coContractBlocks()); invoicePdf = await pdfB64(coInvoiceBlocks(d, paymentRef)); } catch (err) { console.warn('order PDFs failed', err); }
  return coSignupSend({ref: d.no, ...coOrderFields(), agreementPdf, invoicePdf, invoiceNo: d.no, paymentRef: paymentRef || '', newsletter: CO.draftSign && CO.draftSign.newsletter !== false});
}
/* ---------- contract PDF (built in the browser, no library) ---------- */
function pdfSafe(s) {
  return String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—−]/g, '-').replace(/·/g, '-').replace(/…/g, '...').replace(/[^\x20-\x7E]/g, '');
}
function pdfWrap(text, max) {
  const out = []; let line = '';
  pdfSafe(text).split(/\s+/).forEach(w => { if (!w) return; if ((line + ' ' + w).trim().length > max) { if (line) out.push(line); line = w; } else line = (line + ' ' + w).trim(); });
  if (line) out.push(line);
  return out.length ? out : [''];
}
function buildPDF(blocks) {
  /* blocks: [{t: text, b: bold, s: size, gap: points before}] */
  const W = 612, H = 792, L = 56, TOP = 736, BOT = 64;
  const pages = []; let ops = [], y = TOP;
  const flush = () => { pages.push(ops.join('\n')); ops = []; y = TOP; };
  blocks.forEach(bk => {
    const size = bk.s || 10, lh = size * 1.45, max = Math.floor(500 / (size * (bk.b ? .56 : .5)));
    y -= bk.gap || 0;
    pdfWrap(bk.t, max).forEach(ln => {
      if (y - lh < BOT) flush();
      y -= lh;
      const esc2 = ln.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      ops.push(`BT /${bk.b ? 'F2' : 'F1'} ${size} Tf ${L} ${y.toFixed(1)} Td (${esc2}) Tj ET`);
    });
  });
  if (ops.length || !pages.length) flush();
  const objs = [];
  objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objs[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objs[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  const kids = [];
  pages.forEach((content, i) => {
    const total = pages.length;
    const foot = `BT /F1 8 Tf ${L} 36 Td (IntegrityShield subscription agreement - page ${i + 1} of ${total}) Tj ET`;
    const stream = content + '\n' + foot;
    const pn = 5 + i * 2, cn = pn + 1;
    objs[pn] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${cn} 0 R >>`;
    objs[cn] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
    kids.push(`${pn} 0 R`);
  });
  objs[2] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${kids.length} >>`;
  let out = '%PDF-1.4\n'; const offs = [];
  for (let i = 1; i < objs.length; i++) { offs[i] = out.length; out += `${i} 0 obj\n${objs[i]}\nendobj\n`; }
  const xref = out.length;
  out += `xref\n0 ${objs.length}\n0000000000 65535 f \n` + offs.slice(1).map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('');
  out += `trailer\n<< /Size ${objs.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([out], {type: 'application/pdf'});
}
function coContractBlocks() {
  const d = CO.order, o = CO.org, s = CO.sign;
  const lines = d ? d.lines : coTotals().lines;
  const c = d || coTotals();
  const bill = d ? d.bill : PR.bill;
  const due = d ? d.paid : coDueToday(c);
  const B = [];
  const h = (t, gap = 14) => B.push({t, b: true, s: 12, gap});
  const plain = t => String(t).replace(/<br>/g, ' ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, '-').replace(/[^\x20-\x7e]/g, '');
  const p = (t, gap = 0) => B.push({t: plain(t), gap});
  B.push({t: 'IntegrityShield Software Subscription Agreement', b: true, s: 18});
  p(`Agreement no. ${CO.contractNo}${d ? ` - Order no. ${d.no}` : ''}`, 6);
  h('Parties');
  p('Provider: SureShield, Inc., 3343 Peachtree Rd NE, Ste 145-1564, Atlanta, GA 30326');
  p(`Customer: ${o.name}${o.short ? ` (${o.short})` : ''}`);
  p(`Address: ${coAddress()}`);
  if (o.type) p(`Organization type: ${o.type}`);
  if (o.url) p(`Website: ${o.url}`);
  if (o.industries.length) p(`Industries served: ${o.industries.join(', ')}`);
  if (o.adminName || o.adminEmail) p(`System administrator: ${[o.adminName, o.adminTitle, o.adminEmail, o.adminPhone].filter(Boolean).join(', ')}`);
  CO.contacts.filter(k => k.name || k.email).forEach((k, i) => p(`Key contact ${i + 1}: ${[k.name, k.role, k.email, k.phone].filter(Boolean).join(', ')}`));
  h('Summary of purchase');
  lines.forEach(x => p(`${M[x.sol].name} - ${x.t.n} (${x.t.rec}): ${money(x.t.m)} per month list price`));
  if (c.annual) p(`Annual billing savings (20%): -${money(c.annual)} per month`);
  if (c.bundle) p(`Bundle discount (25%): -${money(c.bundle)} per month`);
  p(`Total: ${money(c.total)} per month`);
  p(`Billing: ${bill === 'free' || CO.mode === 'free' ? 'Free plan, no charge' : bill === 'annual' ? 'annual, billed in advance for 12 months' : 'monthly'}`);
  p(`Amount due at signing: ${money(due)}`);
  p(`Start date: ${s ? s.date : coDate(new Date())}`);
  h(AGREEMENT.title);
  agreementSections({licensee: o.name, date: s ? s.date : coDate(new Date()), notice: [o.name, coAddress(), o.adminEmail].filter(Boolean).join(', ')})
    .forEach(([t, ps]) => { if (t) B.push({t, b: true, gap: 6}); ps.forEach(x => p(x, 3)); });
  h('Privacy Policy');
  p(`Last updated: ${PRIVACY_POLICY.updated}`);
  PRIVACY_POLICY.sections.forEach(([t, ps]) => { B.push({t, b: true, gap: 6}); ps.forEach(x => p(x, 3)); });
  h('Electronic signature');
  if (s) { p(`Signed by: ${s.name}, ${s.title}`); p(`Email: ${s.email}`); p(`Date: ${s.date}`); p('The signer confirmed they are authorized to sign for the customer and agreed to the IntegrityShield Software Subscription Agreement and the Privacy Policy. Typing their name is their electronic signature.'); }
  else p('Not signed.');
  return B;
}
async function coDownload() {
  let blob;
  try { blob = buildPDF(coContractBlocks()); } catch (err) { console.warn('contract build failed', err); return; }
  const name = `IntegrityShield-Agreement-${CO.contractNo}.pdf`;
  /* inside the claude.ai preview, files are offered through the viewer's save prompt */
  if (window.claude && typeof window.claude.use === 'function') {
    try { const dl = await window.claude.use('downloads'); if (dl) { await dl.save({filename: name, data: blob}); return; } }
    catch (err) { if (err && err.code === 'declined') return; }
  }
  try {
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch (err) { console.warn('contract download failed', err); }
}

/* ---------- enterprise: straight to a short inquiry form ---------- */
function entSetup(sol) {
  const wrap = $('#page-contact .cform-wrap');
  if (!wrap) return null;
  const f = $('.cform', wrap);
  wrap.classList.add('ent'); f.classList.add('ent');
  $('.cdone', wrap).hidden = true; f.hidden = false;
  const pr = f.querySelector('input[name=topic][value="Pricing"]'); if (pr) pr.checked = true;
  $('.ent-tag b', wrap).textContent = `Enterprise plan · ${M[sol].name}`;
  f.elements.msg.placeholder = 'Optional: number of records, solutions you need, or anything else we should know.';
  return wrap;
}
function entInquiry(sol) {
  if (route === 'contact') { scrollToEl(entSetup(sol)); return; }
  location.href = U('contact') + '?ent=' + sol + '#message';
}
document.addEventListener('click', e => {
  const x = e.target.closest('[data-ent-off]');
  if (!x) return;
  const wrap = x.closest('.cform-wrap'), f = $('.cform', wrap);
  wrap.classList.remove('ent'); f.classList.remove('ent');
  f.elements.msg.placeholder = 'For example: we screen 3,000 employees and 600 vendors monthly and want to move to nightly screening.';
});

/* ---------- logo (from sure-shield.com) ---------- */
const LOGO = 'data:image/png;base64,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';
$$('.logo-img').forEach(img => img.src = LOGO);

/* ---------- init ---------- */
setTimeout(() => { markReq(); rvAll(); }, 0);
{ const q = new URLSearchParams(location.search); if (M[q.get('sol')]) PR.sol = q.get('sol'); (q.get('cart') || '').split(',').forEach(x => { const [k, v] = x.split(':'); if (M[k] && v) PR.cart[k] = v; }); if (q.get('bill')) PR.bill = q.get('bill'); if (M[q.get('ent')]) { location.replace(U('checkout') + '?mode=ent&sols=' + q.get('ent')); } }
$$('[data-plans]').forEach(renderPlans);
$$('[data-cal]').forEach(initCal);
{ const s = HASH_SEC[location.hash.slice(1)]; if (s) pending = s; }
show(routeFromHash(), true);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => update());
buildHub();
/* drawer: team profiles and blog articles */
const drawer = $('#drawer'), drBody = $('#drBody');
let drList = null, drIdx = 0, drLast = null;
function personHTML(p) {
  return `<div class="dp"><div class="dp-ph"><img src="${p.img}" alt="${p.name}, ${p.role}" width="232" height="326"></div><div class="dp-b"><p class="dp-r">${p.role}</p><h2 id="drTitle">${p.name}</h2><p class="tc-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</p></div></div>
    <p class="dp-bio">${p.bio}</p><div class="dp-f"><b>Focus at IntegrityShield</b><p>${p.focus}</p></div>
    <div class="cta-row"><a class="btn primary sm" href="#contact" data-close>Contact the team</a>${p.li ? `<a class="btn ghost sm" href="${p.li}" target="_blank" rel="noopener">LinkedIn profile <span class="vh">(opens in a new tab)</span></a>` : ''}</div>`;
}
function postHTML(p) {
  const sol = M[p.sol];
  return `<p class="pc-meta"><span class="chip acc">${BLOG_CATS[p.cat]}</span><span>${p.mins} min read</span><span class="chip">Placeholder</span></p>
    <h2 id="drTitle">${p.title}</h2><p class="dr-lead">${p.excerpt}</p>
    <div class="dr-toc"><b>In this article</b><ol>${p.outline.map(o => `<li>${o}</li>`).join('')}</ol></div>
    <p class="note">Full article coming soon. This is a placeholder for the demo.</p>
    <div class="dr-rel"><b>Related</b><a href="#${p.sol}" data-close>${sol.name}: ${sol.crumb} ${ARROW}</a><button type="button" class="link" data-close data-to-web>Join the live webinar ${ARROW}</button></div>`;
}
function drOpen(list, i) {
  drList = list; drIdx = i; drLast = document.activeElement;
  drPaint();
  drawer.hidden = false;
  document.documentElement.classList.add('dr-on');
  requestAnimationFrame(() => { drawer.classList.add('on'); $('.dr-x', drawer).focus({preventScroll: true}); });
}
function drPaint() {
  const item = drList === 'team' ? TEAM[drIdx] : POSTS[drIdx];
  drBody.innerHTML = drList === 'team' ? personHTML(item) : postHTML(item);
  drBody.scrollTop = 0;
  const n = drList === 'team' ? TEAM.length : POSTS.length;
  $('[data-dprev]', drawer).textContent = drList === 'team' ? '← Previous person' : '← Previous article';
  $('[data-dnext]', drawer).textContent = drList === 'team' ? 'Next person →' : 'Next article →';
  $('.dr-count', drawer).textContent = `${drIdx + 1} of ${n}`;
}
function drClose() {
  drawer.classList.remove('on');
  document.documentElement.classList.remove('dr-on');
  setTimeout(() => { drawer.hidden = true; }, reduce ? 0 : 280);
  if (drLast && drLast.focus) drLast.focus({preventScroll: true});
}
function drStep(d) { const n = drList === 'team' ? TEAM.length : POSTS.length; drIdx = (drIdx + d + n) % n; drPaint(); }
drawer.addEventListener('click', e => {
  if (e.target.closest('[data-dprev]')) { drStep(-1); return; }
  if (e.target.closest('[data-dnext]')) { drStep(1); return; }
  if (e.target.closest('[data-close]')) drClose();
});
document.addEventListener('keydown', e => {
  if (drawer.hidden) return;
  if (e.key === 'Escape') drClose();
  else if (e.key === 'ArrowRight') drStep(1);
  else if (e.key === 'ArrowLeft') drStep(-1);
});

/* page interactions (delegated, so they work on every page) */
document.addEventListener('click', e => {
  const person = e.target.closest('[data-person]');
  if (person) { drOpen('team', +person.dataset.person); return; }
  const post = e.target.closest('[data-post]');
  if (post) { drOpen('blog', POSTS.findIndex(p => p.id === post.dataset.post)); return; }
  if (e.target.closest('[data-to-web]')) {
    const tgt = route === 'home' || route === 'contact' ? active.querySelector('[data-web]') : null;
    if (tgt) scrollToEl(tgt); else goTo('contact', '[data-web]');
    return;
  }
  const tf = e.target.closest('.tf');
  if (tf) {
    $$('.tf', active).forEach(b => { b.classList.toggle('on', b === tf); b.setAttribute('aria-selected', b === tf); });
    $$('.tcard', active).forEach(c => c.classList.toggle('off', tf.dataset.f !== 'all' && c.dataset.g !== tf.dataset.f));
    return;
  }
  const tl = e.target.closest('.tl-btn');
  if (tl) { tlGo(tl.closest('[data-tl]'), +tl.dataset.i, true); return; }
  const vt = e.target.closest('.vtile');
  if (vt) { const on = vt.getAttribute('aria-expanded') !== 'true'; vt.setAttribute('aria-expanded', on); vt.classList.toggle('on', on); return; }
  const bc = e.target.closest('.bc');
  if (bc) { $$('.bc', active).forEach(b => { b.classList.toggle('on', b === bc); b.setAttribute('aria-selected', b === bc); }); blogFilter(); return; }
  if (e.target.closest('[data-bclear]')) { const s = $('[data-bsearch]', active); s.value = ''; $$('.bc', active).forEach((b, i) => { b.classList.toggle('on', i === 0); b.setAttribute('aria-selected', i === 0); }); blogFilter(); return; }
  const again = e.target.closest('[data-web-again]');
  if (again) { const card = again.closest('.web-card'); $('.web-done', card).hidden = true; const f = $('.web-form', card); f.reset(); f.hidden = false; webSession(f); return; }
  const cAgain = e.target.closest('[data-c-again]');
  if (cAgain) { const w = cAgain.closest('.cform-wrap'); $('.cdone', w).hidden = true; const f = $('.cform', w); f.reset(); f.hidden = false; return; }
});

/* timeline */
function tlGo(root, i, manual) {
  if (!root) return;
  if (manual) root.dataset.manual = '1';
  root.dataset.i = i;
  $$('.tl-btn', root).forEach(b => { const on = +b.dataset.i === i; b.classList.toggle('on', on); b.classList.toggle('past', +b.dataset.i < i); b.setAttribute('aria-pressed', on); });
  $$('.tl-card', root).forEach(c => c.classList.toggle('on', +c.dataset.i === i));
  const n = $$('.tl-btn', root).length;
  $('.tl-fill', root).style.transform = `scaleX(${i / (n - 1)})`;
}
const tlRoot = $('#page-about [data-tl]');
let tlTimer = 0;
if (tlRoot && !reduce) new IntersectionObserver(es => es.forEach(en => {
  clearInterval(tlTimer);
  if (!en.isIntersecting || tlRoot.dataset.manual) return;
  tlTimer = setInterval(() => {
    if (tlRoot.dataset.manual || route !== 'about') { clearInterval(tlTimer); return; }
    const n = $$('.tl-btn', tlRoot).length, i = (+(tlRoot.dataset.i || 0) + 1);
    if (i >= n) { clearInterval(tlTimer); return; }
    tlGo(tlRoot, i);
  }, 3200);
}), {threshold: .5}).observe(tlRoot);

/* team: gentle tilt on hover */
if (!reduce && matchMedia('(hover: hover)').matches) {
  document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest('.tcard');
    $$('.tcard.tilt').forEach(t => { if (t !== c) { t.classList.remove('tilt'); t.style.removeProperty('--tx'); t.style.removeProperty('--ty'); } });
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.classList.add('tilt');
    c.style.setProperty('--tx', (((e.clientY - r.top) / r.height - .5) * -6).toFixed(2) + 'deg');
    c.style.setProperty('--ty', (((e.clientX - r.left) / r.width - .5) * 6).toFixed(2) + 'deg');
  }, {passive: true});
}

/* blog search and filter */
function blogFilter() {
  const page = $('#page-blog');
  const q = $('[data-bsearch]', page).value.trim().toLowerCase();
  const cat = +$('.bc.on', page).dataset.bc;
  let shown = 0;
  $$('.pcard', page).forEach((card, i) => {
    const p = POSTS[i];
    const ok = (cat < 0 || p.cat === cat) && (!q || (p.title + ' ' + p.excerpt + ' ' + BLOG_CATS[p.cat]).toLowerCase().includes(q));
    card.hidden = !ok; if (ok) shown++;
    card.classList.toggle('big', ok && shown === 1 && !q && cat < 0);
  });
  $('.bempty', page).hidden = shown > 0;
  $('[data-bcount]', page).textContent = q || cat >= 0 ? `${shown} article${shown === 1 ? '' : 's'}` : '';
}
$('#page-blog [data-bsearch]').addEventListener('input', blogFilter);

/* webinar forms */
function webSession(f) {
  if (!f.querySelector('input[type=radio]')) return;
  const v = (f.querySelector('input[type=radio]:checked') || {}).value || 'ses';
  const sec = f.closest('[data-web]'), w = WEB[v];
  const h = $('[data-wh]', sec), p = $('[data-wp]', sec), l = $('[data-wl]', sec);
  if (h.textContent === w.h) return;
  sec.classList.add('swap');
  setTimeout(() => { h.textContent = w.h; p.textContent = w.p; l.innerHTML = w.learn.map(x => `<li>${x}</li>`).join(''); sec.classList.remove('swap'); }, reduce ? 0 : 180);
}
document.addEventListener('change', e => { const f = e.target.closest('.web-form'); if (f && e.target.type === 'radio') webSession(f); });
function industriesList() { return ['Healthcare providers', 'Health plans & insurance', 'Pharmacy', 'Life sciences (pharma, biotech, medical devices)', 'Financial services & banking',
  'Insurance (non-health)', 'Government & public sector', 'Defense & aerospace', 'Education', 'Nonprofit', 'Technology & software', 'Telecommunications',
  'Manufacturing', 'Retail & e-commerce', 'Energy & utilities', 'Transportation & logistics', 'Construction & real estate', 'Hospitality & travel',
  'Media & entertainment', 'Professional services', 'Legal', 'Staffing & HR', 'Agriculture & food', 'Other']; }
function consentBox() { return `<label class="nl-opt consent"><input type="checkbox" name="consent"><span>I agree to the <a href="#privacy" target="_blank" rel="noopener">Privacy Policy</a>. <i class="req" aria-hidden="true">*</i></span></label>`; }
function nlBox(on) { return `<label class="nl-opt"><input type="checkbox" name="newsletter"${on === false ? '' : ' checked'}><span>Send me SureShield news, new offerings and updates. Unsubscribe anytime.</span></label>`; }
const NL = f => !!(f.elements.newsletter && f.elements.newsletter.checked);
/* ---------- privacy consent: forms with the box cannot be sent unless it is ticked ---------- */
document.addEventListener('submit', e => {
  const f = e.target, c = f && f.querySelector && f.querySelector('input[name=consent]');
  if (!c || c.checked) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const err = f.querySelector('.err');
  if (err) { err.textContent = 'Please tick the box to agree to the Privacy Policy.'; err.hidden = false; }
  c.focus();
}, true);
/* required markers and error association on lead forms */
const REQ = {'.cform': ['name', 'email', 'msg'], '.web-form': ['first', 'email', 'org'], '.wnx-alert': ['email'], '.cal-form': ['name', 'email', 'org']};
function markReq() {
  Object.entries(REQ).forEach(([sel, names]) => document.querySelectorAll(sel).forEach(f => {
    names.forEach(n => {
      const el = f.elements[n]; if (!el || el.dataset.req) return;
      el.dataset.req = '1'; el.setAttribute('aria-required', 'true');
      const lab = el.closest('label'); if (!lab) return;
      const node = [...lab.childNodes].find(x => x.nodeType === 3 && x.nodeValue.trim()) || lab.querySelector('span');
      if (node) node.after(Object.assign(document.createElement('i'), {className: 'req', textContent: ' *', ariaHidden: 'true'}));
    });
    const err = f.querySelector('.err');
    if (err) { if (!err.id) err.id = 'err-' + Math.random().toString(36).slice(2, 8); err.setAttribute('role', 'alert'); f.setAttribute('aria-describedby', err.id); }
  }));
}
/* ---------- review markers (remove a rule once the item is resolved) ---------- */
const REVIEW = [
];
/* ---------- dark mode: header button; remembered on this device ---------- */
const THEME_KEY = 'is-theme';
function themeSet(dark, save) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const b = document.getElementById('themeBtn');
  if (b) { b.setAttribute('aria-pressed', dark ? 'true' : 'false'); b.title = b.ariaLabel = dark ? 'Light mode' : 'Dark mode'; }
  if (save) { try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch (e) {} }
}
{ let t = null; try { t = localStorage.getItem(THEME_KEY); } catch (e) {} themeSet(t === 'dark', false); }
document.addEventListener('click', e => {
  if (e.target.closest('#themeBtn, [data-theme-toggle]')) themeSet(document.documentElement.dataset.theme !== 'dark', true);
});
document.addEventListener('click', e => {
  if (!e.target.closest('[data-skip]')) return;
  const m = [...document.querySelectorAll('main')].find(x => !x.hidden) || document.querySelector('main');
  if (!m) return;
  m.setAttribute('tabindex', '-1'); m.focus({preventScroll: true}); m.scrollIntoView({block: 'start'});
});
/* testimonials: rotate every 9 seconds; pause while hovered or focused; stop once a visitor picks one */
(function () {
  const box = document.querySelector('[data-quotes]'); if (!box) return;
  const qs = [...box.querySelectorAll('.quote')], dots = [...box.querySelectorAll('.q-dots button')];
  let i = 0, held = false, stopped = false;
  const show = n => { i = n; qs.forEach((q, k) => { q.classList.toggle('on', k === n); q.setAttribute('aria-hidden', k === n ? 'false' : 'true'); });
    dots.forEach((d, k) => { d.classList.toggle('on', k === n); d.setAttribute('aria-pressed', k === n ? 'true' : 'false'); }); };
  dots.forEach((d, k) => d.addEventListener('click', () => { stopped = true; show(k); }));
  ['pointerenter', 'focusin'].forEach(t => box.addEventListener(t, () => { held = true; }));
  ['pointerleave', 'focusout'].forEach(t => box.addEventListener(t, () => { held = false; }));
  setInterval(() => { if (!held && !stopped && !document.hidden) show((i + 1) % qs.length); }, 9000);
})();
function RV(t) { return `<span class="rv">[${t}]</span>`; }
const RV_DONE = new WeakSet();
function rvMark(root) {
  if (!root) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode: n => {
    const p = n.parentElement;
    if (!p || RV_DONE.has(n) || !n.nodeValue.trim() || p.closest('.rv, script, style, textarea, option, select, title, svg, [data-no-rv], .ix, .ixs, .ck-ban')) return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
  }});
  const todo = [];
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    for (const [re, note] of REVIEW) { const m = re.exec(n.nodeValue); if (m) { todo.push([n, m.index + m[0].length, note]); break; } }
  }
  todo.forEach(([n, at, note]) => {
    const after = n.splitText(at);
    RV_DONE.add(n);
    const s = document.createElement('span'); s.className = 'rv'; s.textContent = '[' + note + ']';
    after.parentNode.insertBefore(s, after);
  });
}
let rvTimer = 0;
function rvAll() { clearTimeout(rvTimer); rvTimer = setTimeout(() => { rvObs.disconnect(); document.querySelectorAll('main, header.nav, footer, #drawer').forEach(rvMark); rvWatch(); }, 60); }
const rvObs = new MutationObserver(rvAll);
function rvWatch() { document.querySelectorAll('main, #drawer').forEach(m => rvObs.observe(m, {childList: true, subtree: true})); }
/* ---------- cookie consent: necessary always on; analytics and marketing only with consent ---------- */
const CK = (() => { try { const m = document.cookie.match(/(?:^|; )is_consent=([^;]*)/); return m ? JSON.parse(decodeURIComponent(m[1])) : null; } catch (e) { return null; } })();
window.isConsent = {analytics: !!(CK && CK.a), marketing: !!(CK && CK.m), decided: !!CK};
const EMAIL_OK = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
/* forms send to the website API's "form" step; empty API = demo, nothing is sent */
const FORM_T0 = new WeakMap();
document.addEventListener('focusin', e => { const f = e.target.closest && e.target.closest('.web-form, .cform, .wnx-alert, .cal-form'); if (f && !FORM_T0.has(f)) FORM_T0.set(f, Date.now()); });
async function formSend(f, body) {
  if (!scanApi()) return {ok: true};
  const btn = f.querySelector('button[type=submit]'), label = btn ? btn.textContent : '';
  if (f.dataset.busy) return {ok: false, busy: true};
  f.dataset.busy = '1'; if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
  const u = bookUtm();
  let res = null;
  try {
    res = await licCall('/form', {...body, page: location.pathname + location.hash, utm: Object.entries(u).map(([k, v]) => `${k}=${v}`).join('&'),
      ms: FORM_T0.has(f) ? Date.now() - FORM_T0.get(f) : 0, website: f.elements.ish_trap_x ? f.elements.ish_trap_x.value : ''});
  } catch (x) { res = null; }
  delete f.dataset.busy; if (btn) { btn.disabled = false; btn.textContent = label; }
  if (res && res.ok) return {ok: true};
  const err = f.querySelector('.err');
  if (err) {
    err.textContent = res && res.status === 429 ? 'We’ve had an unusual number of messages today. Please try again tomorrow, or call 1-800-604-1354.'
      : res && res.status === 400 ? 'Check your details and try again.'
      : 'We couldn’t send this just now. Please try again, or call 1-800-604-1354.';
    err.hidden = false;
  }
  return {ok: false};
}
document.addEventListener('submit', async e => {
  const wf = e.target.closest('.web-form'), cf = e.target.closest('.cform');
  if (!wf && !cf) return;
  e.preventDefault();
  const f = wf || cf, err = $('.err', f), miss = [];
  if (wf) {
    if (!f.elements.first.value.trim()) miss.push('your first name');
    if (!EMAIL_OK(f.elements.email.value.trim())) miss.push('a work email');
    if (!f.elements.org.value.trim()) miss.push('your organization');
  } else {
    if (!f.elements.name.value.trim()) miss.push('your name');
    if (!EMAIL_OK(f.elements.email.value.trim())) miss.push('a work email');
    if (!f.elements.msg.value.trim() && !f.classList.contains('ent')) miss.push('a message');
  }
  if (miss.length) { err.textContent = 'Add ' + miss.join(', ').replace(/, ([^,]*)$/, ' and $1') + '.'; err.hidden = false; return; }
  err.hidden = true;
  const val = n => f.elements[n] ? String(f.elements[n].value || '').trim() : '';
  if (wf) {
    const v0 = (f.querySelector('input[type=radio]:checked') || f.elements.session || {}).value || 'ses';
    const names0 = {ses: 'Sanctions & exclusion screening', coi: 'Conflict of interest monitoring', both: 'Both sessions'};
    const card = f.closest('.web-card, .wnx-card, section'), wt = card && card.querySelector('h2, h3'), wsec = f.closest('[data-web]');
    const sent = await formSend(f, {kind: 'webinar', sessionStart: wsec && wsec.dataset.wStart || '', name: [val('first'), val('last')].filter(Boolean).join(' '), email: val('email'), org: val('org'), role: val('role'),
      topic: [names0[v0] || v0, wt ? wt.textContent.trim() : ''].filter(Boolean).join(' · '), newsletter: NL(f)});
    if (!sent.ok) return;
  } else {
    const ent = f.classList.contains('ent');
    const sent = await formSend(f, {kind: ent ? 'enterprise' : 'contact', name: val('name'), email: val('email'), org: val('org'), phone: val('phone'),
      topic: ent ? $('.ent-tag b', f.closest('.cform-wrap')).textContent : val('topic'), message: val('msg'), newsletter: NL(f)});
    if (!sent.ok) return;
  }
  if (wf) {
    const v = (f.querySelector('input[type=radio]:checked') || f.elements.session || {}).value || 'ses';
    const names = {ses: 'Sanctions & exclusion screening', coi: 'Conflict of interest monitoring', both: 'Both sessions'};
    const done = $('.web-done', f.closest('.web-card'));
    const wsec2 = f.closest('[data-web]'), em = f.elements.email.value.trim();
    $('.wd-t', done).textContent = wsec2 && wsec2.dataset.wTopic
      ? `${wsec2.dataset.wTopic}. Your confirmation, Zoom join link and calendar invite are on their way to ${em}.`
      : `${names[v]}. We’ll email the date, time and Zoom join link to ${em} as soon as it’s scheduled.`;
    f.hidden = true; done.hidden = false;
  } else {
    const done = $('.cdone', f.closest('.cform-wrap'));
    $('.cd-t', done).textContent = f.classList.contains('ent') ? `${$('.ent-tag b', f).textContent}. ${scanApi() ? 'We’ll' : 'We’d'} contact you at ${f.elements.email.value.trim()}.` : `Topic: ${f.elements.topic.value}. ${scanApi() ? 'We’ll' : 'We’d'} reply to ${f.elements.email.value.trim()}.`;
    f.hidden = true; done.hidden = false;
  }
});

/* About dropdown in the nav */
const dd2 = $('#dd2'), dd2Btn = $('#dd2Btn');
let dd2Timer;
const setDD2 = open => { dd2.classList.toggle('open', open); dd2Btn.setAttribute('aria-expanded', open); if (open) setDD(false); };
dd2Btn.addEventListener('click', e => { e.stopPropagation(); setDD2(!dd2.classList.contains('open')); });
dd2.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { clearTimeout(dd2Timer); setDD2(true); } });
dd2.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') dd2Timer = setTimeout(() => setDD2(false), 180); });
dd.addEventListener('pointerenter', () => setDD2(false));
document.addEventListener('click', e => { if (!dd2.contains(e.target)) setDD2(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setDD2(false); });
const markAbout = () => dd2Btn.classList.toggle('cur', ABOUT_ROUTES.includes(routeFromHash()));
window.addEventListener('hashchange', () => { setDD2(false); if (!drawer.hidden) drClose(); markAbout(); });
markAbout();

/* ---------- film: click to zoom in and play ---------- */
const film = $('#film'), fCard = $('#filmCard');
let fOn = false, fElapsed = 0, fLast = 0;
let FILM_LEN = 43.3;
const FILM_ROOT = document.documentElement.dataset.root || '';
const fVid = $('#introVideo');
const fSrc = u => /^(data:|https?:|\/)/.test(u) ? u : FILM_ROOT + u;
if (fVid) {
  if (fVid.dataset.poster) fVid.poster = fSrc(fVid.dataset.poster);
  fVid.addEventListener('loadedmetadata', () => { if (isFinite(fVid.duration)) FILM_LEN = fVid.duration; });
  fVid.addEventListener('timeupdate', () => { fElapsed = fVid.currentTime; fPaint(); });
  fVid.addEventListener('play', () => { fOn = true; film.classList.remove('paused', 'ended'); clearTimeout(fEndT); });
  fVid.addEventListener('pause', () => { fOn = false; if (!fVid.ended && film.classList.contains('playing')) film.classList.add('paused'); });
}
function fPaint() {
  const pr = $('#vidProg'), tm = $('#vidTime');
  if (pr) pr.style.width = (fElapsed / FILM_LEN * 100) + '%';
  if (tm) tm.textContent = '0:' + String(Math.floor(fElapsed)).padStart(2, '0');
}
function fTick(now) {
  if (!fOn) return;
  fElapsed = Math.min(FILM_LEN, fElapsed + (now - fLast) / 1000); fLast = now; fPaint();
  if (fElapsed >= FILM_LEN) { filmPlay(false); film.classList.add('ended'); filmAutoClose(); return; }
  requestAnimationFrame(fTick);
}
function filmPlay(on) {
  try { if (on === fOn) return; } catch (err) { return; }
  fOn = on;
  const v = $('#introVideo');
  if (v) { if (on) { if (!v.getAttribute('src') && v.dataset.src) { const tr = v.querySelector('track[data-src]'); if (tr && !tr.getAttribute('src')) tr.src = fSrc(tr.dataset.src); v.src = fSrc(v.dataset.src); svidCC(fCard); } film.classList.remove('paused'); v.play().catch(() => {}); } else v.pause(); return; }
  if (on) { fLast = performance.now(); requestAnimationFrame(fTick); }
}
function filmFlip(change) {
  if (reduce) { change(); return; }
  const a = fCard.getBoundingClientRect();
  change();
  const b = fCard.getBoundingClientRect();
  fCard.style.transition = 'none';
  fCard.style.transform = `translate(${a.left - b.left}px,${a.top - b.top}px) scale(${a.width / b.width},${a.height / b.height})`;
  fCard.offsetWidth;
  fCard.style.transition = 'transform .8s cubic-bezier(.2,.7,.1,1)';
  fCard.style.transform = '';
}
let fEndT = 0;
const heroGrid = film.closest('.hero-grid');
function filmAutoClose() { clearTimeout(fEndT); fEndT = setTimeout(() => { if (film.classList.contains('ended')) filmClose(); }, 2000); }
function filmOpen() {
  clearTimeout(fEndT);
  if (film.classList.contains('ended')) { film.classList.remove('ended'); fElapsed = 0; fPaint(); const v = $('#introVideo'); if (v) v.currentTime = 0; }
  if (!film.classList.contains('playing')) {
    filmFlip(() => { film.classList.add('playing'); if (heroGrid) heroGrid.classList.add('vplay'); });
    const g = heroGrid || fCard;
    scrollToY(window.scrollY + g.getBoundingClientRect().top - 96);
  }
  const cv = $('#introVideo'); if (cv) cv.controls = true;
  filmPlay(true);
}
function filmClose() {
  { const cv = $('#introVideo'); if (cv) cv.controls = false; }
  clearTimeout(fEndT);
  filmPlay(false);
  film.classList.remove('ended', 'paused');
  fElapsed = 0; fPaint(); const v = $('#introVideo'); if (v) v.currentTime = 0;
  filmFlip(() => { film.classList.remove('playing'); if (heroGrid) heroGrid.classList.remove('vplay'); });
}
$('#filmPlay').addEventListener('click', filmOpen);
$('#filmClose').addEventListener('click', filmClose);
const iv = $('#introVideo'); if (iv) iv.addEventListener('ended', () => { fOn = false; film.classList.add('ended'); filmAutoClose(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && film.classList.contains('playing')) filmClose(); });
new IntersectionObserver(es => es.forEach(en => {
  if (!film.classList.contains('playing') || film.classList.contains('ended')) return;
  if (!en.isIntersecting || route !== 'home') filmPlay(false);
}), {threshold: .35}).observe(fCard);
/* ---------- CSS 3D scenes ---------- */
const S3W = {catalog: 720, sieve: 520, web: 470, dom: 500, vgrid: 470};
const stand = (x, y, len, h, ang, cls = '', inner = '') => `<div class="s3-st ${cls}" style="left:${x}px;top:${y - h}px;width:${len}px;height:${h}px;transform:rotateZ(${ang}deg) rotateX(-90deg)">${inner}</div>`;
const box = (w, d, h, cls = '', top = '') => `<div class="s3-box ${cls}" style="--w:${w}px;--d:${d}px;--h:${h}px"><i class="fw"></i><i class="ff"></i><i class="ft">${top}</i></div>`;
/* labels live in a flat overlay; each follows a 1px anchor inside the 3D world */
let S3L = [];
const bb = (x, y, z, inner, cls = '') => { S3L.push([inner, cls]); return `<i class="s3-anc" data-a="${S3L.length - 1}" style="left:${x}px;top:${y}px;transform:translateZ(${z}px)"></i>`; };
const ovHTML = () => `<div class="s3-ov" aria-hidden="true">${S3L.map(([inner, cls], i) => `<div class="s3-o ${cls}" data-o="${i}">${inner}</div>`).join('')}</div>`;
const S3B = {
  catalog() {
    const ST = [['ses', 'HSES', 'Healthcare Sanctions & Exclusions Screening', -105], ['coi', 'COI', 'Your providers checked against your vendors', 5], ['licensure', 'LCM', 'Licensure & credentials live checks', 115]];
    let s = `<div class="desk"></div>`;
    // the drawer of index cards
    s += `<div class="dfloor"></div>`;
    s += stand(-315, -80, 120, 56, 0, 'dwall');
    s += stand(-315, -80, 160, 56, 90, 'dwall side');
    s += stand(-195, -80, 160, 56, 90, 'dwall side');
    const DIV = {1: 'Physicians', 4: 'NP / PA', 6: 'Vendors', 8: 'Employees'};
    for (let j = 0; j < 10; j++) s += stand(-309, -68 + j * 15, 108, DIV[j] ? 78 : 70, 0, 'icard' + (DIV[j] ? ' divd' : ''), DIV[j] ? `<i class="tab big t${j % 3}" style="left:${[0, 6, 0, 0, 34, 0, 62, 0, 20][j]}px"></i>` : `<i class="tab t${j % 3}" style="left:${8 + (j * 29) % 70}px"></i>`);
    [[1, 6], [4, 34], [6, 62], [8, 20]].forEach(([j, x]) => { s += bb(-309 + x + 20, -68 + j * 15, 86, `<span class="s3-tab">${DIV[j]}</span>`, 'tabl'); });
    s += stand(-315, 80, 120, 56, 0, 'dwall front', '<i class="holder"></i><i class="pull"></i>');
    s += bb(-255, 96, 0, '<span class="s3-tag">YOUR MONITORING RECORDS</span>', 'b');
    // trays
    s += `<div class="tray clear" style="left:239px;top:15px"></div><div class="tray rev" style="left:239px;top:-115px"></div>`;
    for (let p = 0; p < 4; p++) s += `<div class="pile" style="left:239px;top:25px;transform:translateZ(${p * 4}px)">${box(92, 60, 3)}</div>`;
    s += bb(240, 100, 0, '<span class="s3-tag ok">TRUE NEGATIVES <b data-n>5,248</b></span>', 'b');
    s += bb(285, -95, 46, '<span class="flagl rvl"><svg class="alrt" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5 15 14H1z" fill="currentColor"/><path d="M8 6v3.6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="8" cy="11.8" r="1" fill="#fff"/></svg>SCREENED IDENTITY MATCHES<br>FOR REVIEW</span>');
    // stamps
    ST.forEach(([k, n, sub, x]) => {
      s += `<div class="stamp" data-k="${k}" data-x="${x}" style="left:${x - 32}px;top:-23px">
        ${box(64, 46, 6, 'plate')}<div class="body">${box(64, 46, 22)}</div><div class="knob">${box(20, 20, 30)}</div>
        </div>${bb(x, 0, 128, `<span class="s3-lbl" data-k="${k}">${n}<small>${sub}</small></span>`, 'k-' + k)}`;
    });
    // live cards (pool)
    for (let c = 0; c < 6; c++) s += `<div class="lcard gone">${box(92, 60, 3, '', '<i class="ln a"></i><i class="ln b"></i><i class="mk s"></i><i class="mk c"></i><i class="mk l"></i><i class="warn"></i>')}${bb(46, 0, 22, '<i></i>', 'fl')}</div>`;
    return `<div class="s3-world">${s}</div>${ovHTML()}`;
  },
  sieve() {
    const names = ['SAM.gov', 'FDA debarment', 'OIG LEIE', 'TX HHSC-OIG', 'NY OMIG', '+45 state lists'];
    let s = `<div class="tray" style="transform:translateZ(-60px)">${bb(18, 258, 0, '<span class="s3-tag" style="color:var(--ok)">CLEAR</span>', 'r')}</div>`;
    names.forEach((n, j) => {
      const z = (names.length - 1 - j) * 46;
      s += `<div class="sheet" data-z="${z}" style="transform:translateZ(${z}px)"><i class="hd"></i>${bb(0, 230, 0, `<span class="s3-tag">${n}</span>`, 'r sh' + j)}</div>`;
    });
    for (let c = 0; c < 8; c++) s += `<div class="chip3 gone"><div style="transform:rotateZ(${(c * 37) % 50 - 25}deg)">${box(46, 32, 3, '', '<i class="l1"></i><i class="l2"></i>')}</div></div>`;
    return `<div class="s3-world">${s}</div>${ovHTML()}
      <div class="s3-note">Sample data</div>
      <div class="s3-cap"><span><i style="background:#9fd0b5"></i>Clear</span><span><i style="background:var(--flag)"></i>Match</span><span>Screened <b data-n>5,244</b></span></div>`;
  },
  web() {
    const V = [['Acme Ortho', -140], ['Globex Bio', -45], ['Initech Surgical', 50], ['Example Imaging', 145]];
    const P = [['Dr. J. Example', -150, 'Orthopedics'], ['Dr. K. Doe', -50, 'Cardiology'], ['Dr. S. Sample', 50, 'Orthopedics'], ['Dr. T. Roe', 150, 'Radiology']];
    const L = [[1, 1, 30], [2, 3, 24], [3, 3, 18], [1, 2, 34], [2, 2, 26], [0, 0, 120]];
    const vy = -95, py = 95;
    let paths = '', cols = '';
    L.forEach(([v, p, h], i) => {
      const x1 = V[v][1] + 210, y1 = vy + 150, x2 = P[p][1] + 210, y2 = py + 150;
      const d = `M${x1} ${y1} C ${x1} ${y1 + 80}, ${x2} ${y2 - 80}, ${x2} ${y2}`;
      const hot = h > 100;
      paths += `<path id="cp${i}" class="${hot ? 'hot' : ''}" d="${d}" style="--len:400;transition-delay:${i * 140}ms"/>`;
      if (!reduce) paths += `<g class="coin${hot ? ' hot' : ''}"><circle r="9"/><text y="4" text-anchor="middle">$</text><animateMotion dur="${2.6 + i * .35}s" begin="-${i * .5 + .3}s" repeatCount="indefinite" rotate="0"><mpath href="#cp${i}"/></animateMotion></g>`;
      const mx = (x1 + x2) / 2 - 210, my = (y1 + y2) / 2 - 150;
      cols += `<div class="col${hot ? ' hot' : ''}" style="left:${mx}px;top:${my}px">${box(16, 16, h)}${hot ? bb(0, 0, h + 10, '<span class="amt">$48,200<small>consulting fees, 2023</small></span>', 'amt-o') : ''}</div>`;
    });
    let s = `<div class="floor"><svg viewBox="0 0 420 300" preserveAspectRatio="none">${paths}</svg></div>${cols}`;
    V.forEach(([n, x], i) => { s += `<div class="card v${i === 0 ? ' h' : ''}" style="left:${x}px;top:${vy - 46}px">${n}<small>Vendor</small></div>`; });
    P.forEach(([n, x, sp], i) => { s += `<div class="card${i === 0 ? ' h' : ''}" style="left:${x}px;top:${py - 46}px">${n}<small>${sp}</small></div>`; });
    return `<div class="s3-world">${s}</div>${ovHTML()}
      <div class="s3-note">Sample data · CMS Open Payments</div>
      <div class="s3-cap"><span><i style="background:#b9a3b1"></i>Payment</span><span><i style="background:var(--accent)"></i>Undisclosed relationship</span></div>`;
  },
  vgrid() {
    const R = [['State medical license', 'State medical board'], ['Nursing license', 'Nursys'], ['Board certification', 'ABMS / AOA'], ['Social work license', 'State social work board'], ['Counselor license', 'Behavioral health board']];
    const C = [['Found at source', 'Source'], ['Status validated', 'Status'], ['Disciplinary check', 'Discipline']];
    const X = [-95, 0, 95], H = [12, 22, 32];
    const Y = r => -100 + r * 50;
    let s = `<div class="vg-plate"></div>`;
    R.forEach(([n, src], r) => {
      s += `<i class="vg-lane" style="top:${Y(r) - 1}px"></i>`;
      s += bb(-130, Y(r), 0, `<span class="vg-row"><b>${n}</b><small>${src}</small></span>`, 'r');
      X.forEach((x, c) => {
        s += `<div class="vg-cell" data-r="${r}" data-c="${c}" style="left:${x - 17}px;top:${Y(r) - 17}px"><i class="vg-slot"></i>${box(34, 34, H[c])}</div>`;
        s += bb(x, Y(r), H[c] + 8, `<span class="vg-co"></span>`, `vgc c${r}${c}`);
      });
    });
    C.forEach(([n, sh], c) => { s += bb(X[c], 142, 0, `<span class="vg-colh"><em>${c + 1}</em><span class="l">${n}</span><span class="sh">${sh}</span></span>`, 'b'); });
    s += `<div class="vg-beam"></div>`;
    return `<div class="s3-world">${s}</div>${ovHTML()}
      <div class="vg-who"><small>Practitioner</small><b class="vg-name">Dr. J. Example · Cardiology</b></div>
      <div class="s3-note">Sample data</div>
      <div class="s3-cap"><span class="vg-key"><em>1</em>Found at source <em>2</em>Status <em>3</em>Disciplinary</span><span><i style="background:#6fb08d"></i>Verified</span><span><i style="background:#f2b01e"></i>Renewal due</span><span><i style="background:var(--flag)"></i>Action found</span><span>Records checked <b data-n>1,284</b></span></div>`;
  },
  dom() {
    const C = [['RN', 'GA', 'ok'], ['MD', 'TX', 'soon'], ['PT', 'FL', 'ok'], ['APRN', 'NC', 'down'], ['LCSW', 'GA', 'ok'], ['LPN', 'OH', 'soon'], ['PA', 'NY', 'ok']];
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    let s = `<div class="strip">${months.map((m, i) => `<i class="tick" style="left:${40 + i * 84}px"></i>`).join('')}</div>`;
    months.forEach((m, i) => { s += bb(-210 + i * 84, 96, 0, `<span class="s3-tag">${m}</span>`, 'b'); });
    C.forEach(([t, st, state], i) => { s += `<div class="lic" data-state="${state}" style="left:${-198 + i * 66}px;top:-70px">${t}<small>${st}</small><i></i></div>`; });
    s += `<div class="sweep"></div>`;
    return `<div class="s3-world">${s}</div>${ovHTML()}
      <div class="s3-note">Placeholder data</div>
      <div class="s3-cap"><span><i style="background:var(--ok)"></i>Active</span><span><i style="background:var(--accent)"></i>Expiring</span><span><i style="background:var(--flag)"></i>Expired</span></div>`;
  }
};

/* controllers: each returns {play(on)} */
const S3C = {
  catalog(host) {
    const stamps = $$('.stamp', host), cards = $$('.lcard', host), nEl = host.querySelector('[data-n]');
    const flagLbls = cards.map(c => host.querySelector(`[data-o="${c.querySelector('.s3-anc').dataset.a}"]`));
    const SX = stamps.map(st => +st.dataset.x), REST = 74, LOW = 5;
    const press = stamps.map(() => -9);
    const SPAWN = 1.35, MARKS = ['m-s', 'm-c', 'm-l'];
    let raf = 0, t0 = 0, cleared = 5248, lastK = -1, on = null;
    const ez = u => u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u);
    const lerp2 = (a, b, u) => a + (b - a) * u;
    function path(t, bad) { // returns [x, y, z, scale, stage]
      if (t < .35) return [-255, 0, 96, .5 + .5 * ez(t / .35), -1];
      if (t < .75) return [lerp2(-255, -140, ez((t - .35) / .4)), 0, 96, 1, -1];
      if (t < 1) return [lerp2(-140, -130, (t - .75) / .25), 0, lerp2(96, 2, ez((t - .75) / .25)), 1, -1];
      let x = -130, tt = t - 1;
      for (let i = 0; i < 3; i++) {
        if (tt < .4) return [lerp2(x, SX[i], ez(tt / .4)), 0, 2, 1, -1];
        tt -= .4;
        if (tt < .55) return [SX[i], 0, 2, 1, i + tt / 10];
        tt -= .55; x = SX[i];
      }
      const ty = bad ? -85 : 55, tz = bad ? 26 : 16;
      if (tt < .45) { const u = ez(tt / .45); return [lerp2(x, 285, u), lerp2(0, ty, u), 2 + (tz - 2) * u + Math.sin(u * Math.PI) * 30, 1, -1]; }
      return [285, ty, tz, 1, 9];
    }
    function frame(now) {
      if (!t0) t0 = now;
      const T = (now - t0) / 1000;
      const kNow = Math.floor(T / SPAWN);
      cards.forEach((c, slot) => {
        // card k uses slot k % 6
        let k = kNow - ((kNow - slot) % 6 + 6) % 6;
        if (k < 0) { c.classList.add('gone'); return; }
        const bad = k % 4 === 1, t = T - k * SPAWN;
        if (c._k !== k) { c._k = k; c.className = 'lcard' + (bad ? ' isbad' : ''); }
        const [x, y, z, sc, stage] = path(t, bad);
        if (stage >= 0 && stage < 9) {
          const i = Math.floor(stage), ph = (stage - i) * 10;
          if (ph < .02 && press[i] < T - .5) press[i] = T;
          if (ph > .17) c.classList.add(MARKS[i]);
        }
        let hide = false;
        if (stage === 9) {
          if (!bad && t > 4.55) { hide = true; if (!c._counted) { c._counted = 1; cleared++; nEl.textContent = cleared.toLocaleString('en-US'); } }
          if (bad && k + 4 <= kNow - 3) hide = true; // replaced by the next match
        } else c._counted = 0;
        c.classList.toggle('gone', hide);
        c.classList.toggle('flagged', bad && stage === 9 && !hide);
        flagLbls[slot].classList.toggle('on', bad && stage === 9 && !hide);
        c.style.transform = `translate3d(${x - 46}px,${y - 30}px,${z}px) scale(${sc})`;
      });
      stamps.forEach((st, i) => {
        const dt = T - press[i];
        let f = 0;
        if (dt >= 0 && dt < .12) f = ez(dt / .12); else if (dt >= .12 && dt < .22) f = 1; else if (dt >= .22 && dt < .5) f = 1 - ez((dt - .22) / .28);
        const rest = REST + (st.classList.contains('on') ? 16 : 0);
        st.style.transform = `translateZ(${(rest - (rest - LOW) * f).toFixed(1)}px)`;
      });
      raf = requestAnimationFrame(frame);
    }
    const setOn = k => {
      on = k;
      stamps.forEach(st => st.classList.toggle('on', st.dataset.k === k));
      $$('.s3-lbl[data-k]', host).forEach(b => b.classList.toggle('on', b.dataset.k === k));
      host.classList.toggle('has-on', !!k);
    };
    host._setOn = setOn;
    $$('.s3-lbl[data-k]', host).forEach(b => {
      b.addEventListener('pointerenter', () => { setOn(b.dataset.k); host.dispatchEvent(new CustomEvent('s3hover', {detail: b.dataset.k})); });
      b.addEventListener('click', () => { location.href = U(b.dataset.k); });
    });
    host.addEventListener('pointerleave', () => host.dispatchEvent(new CustomEvent('s3hover', {detail: null})));
    return {play(v) {
      cancelAnimationFrame(raf);
      if (v && !reduce) raf = requestAnimationFrame(frame);
      else if (reduce) {
        stamps.forEach(st => { st.style.transform = `translateZ(${REST}px)`; });
        [[115, 0, 2, 'm-s m-c'], [285, -85, 26, 'isbad m-s m-c m-l flagged']].forEach(([x, y, z, cls], i) => { const c = cards[i]; c.className = 'lcard ' + cls; c.style.transform = `translate3d(${x - 46}px,${y - 30}px,${z}px)`; });
        flagLbls[1].classList.add('on');
      }
    }};
  },
  sieve(host) {
    const sheets = $$('.sheet', host).map(el => ({el, z: +el.dataset.z}));
    const chips = $$('.chip3', host);
    const nEl = host.querySelector('[data-n]');
    const flagSheet = sheets[2];
    const spots = [[-90,-40],[40,-60],[100,30],[-20,10],[-110,55],[70,-5],[-50,-75],[20,60]];
    const T0 = 320, TRAY = -60, D = 1.7, CYCLE = 6.4, FLAG = 3;
    let raf = 0, t0 = 0, last = -1, screened = 5244;
    const prev = chips.map(() => T0);
    const flash = el => { el.classList.add('hit'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('hit'), 240); };
    function frame(now) {
      if (!t0) t0 = now;
      const t = ((now - t0) / 1000) % CYCLE;
      if (t < last) { // new cycle
        sheets.forEach(s => s.el.classList.remove('flag', 'hit')); host.classList.remove('flagged');
        chips.forEach(c => { c.className = 'chip3 gone'; });
        prev.fill(T0);
      }
      last = t;
      chips.forEach((c, i) => {
        const start = i * 0.42, u = (t - start) / D;
        if (u < 0) { c.classList.add('gone'); return; }
        const [x, y] = spots[i];
        let z = T0 - (T0 - TRAY) * Math.pow(Math.min(u, 1), 1.7);
        if (i === FLAG && z <= flagSheet.z) {
          z = flagSheet.z;
          if (!c.classList.contains('bad')) { c.classList.add('bad'); flagSheet.el.classList.add('flag'); host.classList.add('flagged'); }
        }
        const landed = u >= 1 && i !== FLAG;
        if (landed && !c.classList.contains('ok')) { c.classList.add('ok'); screened++; if (nEl) nEl.textContent = screened.toLocaleString('en-US'); }
        const out = i !== FLAG && u > 1.55;
        c.classList.toggle('gone', out || (i === FLAG && t > CYCLE - 0.4));
        sheets.forEach(s => { if (s !== flagSheet || i !== FLAG) if (prev[i] > s.z && z <= s.z) flash(s.el); });
        prev[i] = z;
        c.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
      });
      raf = requestAnimationFrame(frame);
    }
    return {play(on) { cancelAnimationFrame(raf); if (on && !reduce) raf = requestAnimationFrame(frame); else if (reduce) { chips.slice(0, 4).forEach((c, i) => { c.className = 'chip3 ' + (i === FLAG ? 'bad' : 'ok'); const [x, y] = spots[i]; c.style.transform = `translate3d(${x}px,${y}px,${i === FLAG ? flagSheet.z : TRAY}px)`; }); flagSheet.el.classList.add('flag'); } }};
  },
  web(host) {
    let tm = [];
    const clear = () => { tm.forEach(clearTimeout); tm = []; };
    return {play(on) {
      clear();
      if (!on) return;
      if (reduce) { host.classList.add('drawn', 'hot'); return; }
      const cycle = () => {
        host.classList.remove('drawn', 'hot');
        tm.push(setTimeout(() => host.classList.add('drawn'), 300));
        tm.push(setTimeout(() => host.classList.add('hot'), 1900));
        tm.push(setTimeout(cycle, 9000));
      };
      cycle();
    }};
  },
  vgrid(host) {
    const cells = $$('.vg-cell', host), beam = host.querySelector('.vg-beam'), name = host.querySelector('.vg-name'), nEl = host.querySelector('[data-n]');
    const co = (r, c) => host.querySelector(`.s3-o.c${r}${c} .vg-co`);
    const SC = [
      {name: 'Dr. J. Example · Cardiology', warn: [1, 1, 'Expires in 28 days', 'Nursing license · renewal due'], bad: [0, 2, 'State board action', 'Probation · 2024']},
      {name: 'Dr. K. Doe · Orthopedics', warn: [3, 1, 'Expires in 45 days', 'Board certification · renewal due'], bad: [2, 2, 'Nursing board action', 'Restricted · 2023']},
      {name: 'Dr. S. Sample · Radiology', warn: [0, 1, 'Expires in 12 days', 'State license · renewal due'], bad: [1, 2, 'Medical board action', 'Surrendered · 2024']}
    ];
    let tm = [], k = 0, n = 1284;
    const clear = () => { tm.forEach(clearTimeout); tm = []; };
    const stateOf = (sc, r, c) => sc.warn[0] === r && sc.warn[1] === c ? 'warn' : sc.bad[0] === r && sc.bad[1] === c ? 'bad' : 'ok';
    const label = (sc, which) => { const [r, c, t, sub] = sc[which]; const el = co(r, c); if (el) { el.className = 'vg-co ' + which; el.innerHTML = `${t}<small>${sub}</small>`; } };
    const reset = () => {
      cells.forEach(el => el.classList.remove('up', 'ok', 'warn', 'bad'));
      $$('.vg-co', host).forEach(el => { el.className = 'vg-co'; el.innerHTML = ''; });
    };
    const raise = (sc, c, delay) => cells.filter(el => +el.dataset.c === c).forEach(el => {
      const r = +el.dataset.r;
      tm.push(setTimeout(() => el.classList.add('up', stateOf(sc, r, c)), delay + r * 110));
    });
    const finalState = sc => { reset(); name.textContent = sc.name; cells.forEach(el => el.classList.add('up', stateOf(sc, +el.dataset.r, +el.dataset.c))); label(sc, 'warn'); label(sc, 'bad'); };
    const BEAM = x => `translate3d(${x}px,0,0) rotateZ(90deg) rotateX(-90deg)`;
    return {play(on) {
      clear();
      if (!on) return;
      if (reduce) { beam.style.visibility = 'hidden'; finalState(SC[0]); return; }
      const cycle = () => {
        const sc = SC[k % SC.length]; k++;
        reset(); name.textContent = sc.name;
        beam.style.transition = 'none'; beam.style.transform = BEAM(-150); beam.style.opacity = '1';
        void beam.offsetWidth;
        tm.push(setTimeout(() => { beam.style.transition = 'transform 4.8s linear, opacity .4s'; beam.style.transform = BEAM(150); }, 200));
        [0, 1, 2].forEach(c => raise(sc, c, 200 + (55 + c * 95) / 300 * 4800));
        tm.push(setTimeout(() => label(sc, 'warn'), 200 + 150 / 300 * 4800 + 900));
        tm.push(setTimeout(() => label(sc, 'bad'), 200 + 245 / 300 * 4800 + 900));
        tm.push(setTimeout(() => { beam.style.opacity = '0'; n += 5; if (nEl) nEl.textContent = n.toLocaleString('en-US'); }, 5100));
        tm.push(setTimeout(cycle, 10500));
      };
      cycle();
    }};
  },
  dom(host) {
    const cards = $$('.lic', host), sweep = host.querySelector('.sweep');
    const xs = cards.map(c => parseFloat(c.style.left));
    let raf = 0, t0 = 0, last = -1;
    const DUR = 5.2, X0 = -290, X1 = 290;
    function frame(now) {
      if (!t0) t0 = now;
      const t = ((now - t0) / 1000) % (DUR + 1.6);
      if (t < last) cards.forEach(c => { c.classList.remove('seen', 'soon', 'down', 'renew'); });
      last = t;
      const x = X0 + (X1 - X0) * Math.min(t / DUR, 1);
      sweep.style.transform = `translate3d(${x}px,0,0) rotateZ(90deg) rotateX(-90deg)`;
      sweep.style.visibility = t > DUR ? 'hidden' : 'visible';
      cards.forEach((c, i) => {
        const dt = (x - xs[i]) / (X1 - X0) * DUR; // seconds since sweep passed
        if (dt < 0 || t > DUR + 1.2) return;
        const s = c.dataset.state;
        if (s === 'ok') c.classList.toggle('seen', dt < .5);
        else if (s === 'soon') c.classList.add('soon');
        else if (s === 'down') { if (dt < 1.4) c.classList.add('down'); else { c.classList.remove('down'); c.classList.add('renew'); } }
      });
      raf = requestAnimationFrame(frame);
    }
    return {play(on) { cancelAnimationFrame(raf); if (on && !reduce) { t0 = 0; last = -1; raf = requestAnimationFrame(frame); } else if (reduce) { sweep.style.visibility = 'hidden'; cards.forEach(c => { if (c.dataset.state !== 'ok') c.classList.add(c.dataset.state); }); } }};
  }
};
function s3Init(host) {
  if (host._s3) return host._s3;
  const kind = host.dataset.s3;
  host.classList.add('s3', 's3-' + kind);
  S3L = [];
  host.innerHTML = S3B[kind]();
  const ancs = $$('.s3-anc', host).map(a => [a, host.querySelector(`[data-o="${a.dataset.a}"]`)]);
  let trackRaf = 0;
  const track = () => {
    const hr = host.getBoundingClientRect();
    ancs.forEach(([a, o]) => { const r = a.getBoundingClientRect(); o.style.transform = `translate(${(r.left - hr.left).toFixed(1)}px,${(r.top - hr.top).toFixed(1)}px)`; });
    host.classList.add('tracked');
    trackRaf = requestAnimationFrame(track);
  };
  const fit = () => { const w = host.clientWidth; if (w) host.style.setProperty('--k', (w / S3W[kind]).toFixed(3)); };
  fit();
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(host);
  const ctrl = S3C[kind](host);
  const base = getComputedStyle(host);
  const rz0 = parseFloat(base.getPropertyValue('--rz')), rx0 = parseFloat(base.getPropertyValue('--rx'));
  if (!reduce && matchMedia('(hover: hover)').matches) {
    const amp = kind === 'catalog' ? .35 : 1;
    host.addEventListener('pointermove', e => {
      if (e.target.closest && e.target.closest('.s3-lbl')) return;
      const r = host.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      host.style.setProperty('--rz', (rz0 + px * 10 * amp).toFixed(2) + 'deg');
      host.style.setProperty('--rx', (rx0 - py * 6 * amp).toFixed(2) + 'deg');
    });
    host.addEventListener('pointerleave', () => { host.style.removeProperty('--rz'); host.style.removeProperty('--rx'); });
  }
  let vis = false;
  const setVis = v => { if (v === vis) return; vis = v; host.classList.toggle('open', v); ctrl.play(v); cancelAnimationFrame(trackRaf); if (v) trackRaf = requestAnimationFrame(track); };
  host._show = setVis;
  if (host.dataset.manual !== undefined) { host._s3 = ctrl; return ctrl; }
  const io = new IntersectionObserver(es => es.forEach(en => {
    setVis(en.isIntersecting);
  }), {threshold: .2});
  io.observe(host);
  host._s3 = ctrl;
  return ctrl;
}
/* ---------- 3D scene wiring ---------- */
$$('[data-s3]').forEach(s3Init);
const catHost = $('#modules [data-s3]');
const solCards = $$('#modules .sol-card');
solCards.forEach(card => {
  const a = card.querySelector('.mlink'); card.dataset.k = a ? (h => h.startsWith('#') ? h.slice(1) : h.replace(/\/$/, '').split('/').pop())(a.getAttribute('href')) : '';
  const on = () => { catHost._setOn(card.dataset.k); solCards.forEach(c => c.classList.toggle('lit', c === card)); };
  card.addEventListener('pointerenter', on); card.addEventListener('focusin', on);
});
const restCat = () => { catHost._setOn(null); solCards.forEach(c => c.classList.remove('lit')); };
$('#modules .sol-list').addEventListener('pointerleave', restCat);
catHost.addEventListener('s3hover', e => { if (e.detail) solCards.forEach(c => c.classList.toggle('lit', c.dataset.k === e.detail)); else restCat(); });
/* ---------- hero scanner: a beam sweeps the records and flags exceptions ---------- */
function sbStart() {
  const row = document.getElementById('sbRow'), beam = document.getElementById('sbBeam');
  if (!row || row.dataset.on) return;
  row.dataset.on = '1';
  const REC = [['md', 'Dr. Jane Doe'], ['vd', 'Acme Corp'], ['np', 'John Roe, NP'], ['vd', 'Globex Health'], ['bd', 'Sam Sample, Board'], ['em', 'Alex Example'], ['vd', 'Initech Supply'], ['np', 'Pat Placeholder, PA'], ['iv', 'Jordan Doe, Investor'], ['as', 'Asset #0042'], ['vd', 'Example Medical LLC'], ['md', 'Dr. Chris Test'], ['em', 'Taylor Demo'], ['vd', 'Sample Vendor Inc'], ['md', 'Dr. Riley Roe'], ['em', 'Casey Doe']];
  const IC = {md: 'M8 2v4a3 3 0 0 0 6 0V2M11 9v2a4 4 0 0 1-8 0V9.5', np: 'M8 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.5 15c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6', em: 'M8 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.5 15c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6',
    vd: 'M2 15V6l4-2v3l4-2v3l4-2v9zM5 12h1M8 12h1M11 12h1', bd: 'M2 6h12M3 6v8M13 6v8M2 14h12M8 2l6 4H2z', iv: 'M2 14l4-5 3 3 5-7M10 5h4v4', as: 'M1.5 11V6h8v5M9.5 8h3l2 2v1h-5M4 13a1.5 1.5 0 1 0 0-.01M12 13a1.5 1.5 0 1 0 0-.01'};
  const OK = '<svg class="st ok" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="currentColor"/><path d="m4.8 8.2 2.2 2.2 4.2-4.6" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const BAD = '<svg class="st bad" viewBox="0 0 16 16"><path d="M8 1.2 15.2 14H.8z" fill="currentColor"/><path d="M8 5.8v3.8" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="8" cy="11.8" r="1" fill="#fff"/></svg>';
  row.innerHTML = REC.map(([t, n]) => `<span class="sb-c"><svg class="ic" viewBox="0 0 16 16"><path d="${IC[t]}"/></svg>${n}${OK}${BAD}</span>`).join('');
  const chips = Array.from(row.children);
  const BADSETS = [[3, 10], [6, 13], [1, 8, 14], [4, 11]];
  if (reduce) { chips.forEach((c, i) => c.classList.add(BADSETS[0].includes(i) ? 'bad' : 'ok')); beam.style.display = 'none'; return; }
  const SWEEP = 4200, HOLD = 1100;
  let t0 = 0, pass = -1;
  function frame(now) {
    if (!t0) t0 = now;
    const el = now - t0, p = Math.floor(el / (SWEEP + HOLD)), t = el % (SWEEP + HOLD);
    if (p !== pass) { pass = p; chips.forEach(c => c.classList.remove('ok', 'bad')); }
    const w = row.parentElement.clientWidth, x = Math.min(1, t / SWEEP) * w;
    beam.style.transform = `translateX(${x.toFixed(1)}px)`;
    beam.style.opacity = t > SWEEP ? '0' : '1';
    const bad = BADSETS[pass % BADSETS.length];
    chips.forEach((c, i) => {
      if (c.classList.contains('ok') || c.classList.contains('bad')) return;
      if (c.offsetLeft + c.offsetWidth / 2 < x) c.classList.add(bad.includes(i) ? 'bad' : 'ok');
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
if (!document.documentElement.classList.contains('intro-hold')) sbStart();

/* ---------- blog card illustrations ---------- */
function pcArt(cat) {
  const A = [
    // sanctions and exclusions: a screened list with one flagged row, under a shield
    `<rect x="214" y="22" width="150" height="112" rx="10" fill="#fff"/>${[0, 1, 2, 3].map(i => `<rect x="228" y="${38 + i * 23}" width="${[96, 70, 84, 60][i]}" height="9" rx="4.5" fill="${i === 2 ? '#e5484d' : '#e7dfd6'}"/><circle cx="${348}" cy="${42 + i * 23}" r="6" fill="${i === 2 ? '#e5484d' : '#3f9b6b'}"/>`).join('')}<path d="M110 26 152 40v34c0 26-18 44-42 52-24-8-42-26-42-52V40z" fill="#ec6711"/><path d="m92 76 13 13 26-28" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="40" cy="128" r="46" fill="#f3a76f" opacity=".45"/>`,
    // conflict of interest: a vendor and a physician linked by a payment
    `<path d="M120 74 C 170 20, 240 128, 290 74" stroke="#7a2a5f" stroke-width="3" fill="none" stroke-dasharray="7 7"/><rect x="44" y="44" width="96" height="60" rx="10" fill="#fff"/><rect x="58" y="58" width="44" height="8" rx="4" fill="#c9a2bb"/><rect x="58" y="74" width="66" height="8" rx="4" fill="#e9dbe4"/><rect x="270" y="44" width="96" height="60" rx="10" fill="#fff"/><circle cx="294" cy="74" r="12" fill="#c9a2bb"/><rect x="314" y="64" width="40" height="8" rx="4" fill="#5c1f47"/><rect x="314" y="80" width="30" height="8" rx="4" fill="#e9dbe4"/><circle cx="205" cy="74" r="22" fill="#5c1f47"/><text x="205" y="82" text-anchor="middle" font-size="22" font-weight="700" fill="#fff" font-family="system-ui,sans-serif">$</text>`,
    // licensure: a credential card with a verified badge
    `<rect x="110" y="26" width="180" height="104" rx="12" fill="#fff"/><circle cx="150" cy="68" r="20" fill="#9fd0b5"/><path d="M134 104c3-12 9-18 16-18s13 6 16 18" fill="#9fd0b5"/><rect x="184" y="52" width="80" height="9" rx="4.5" fill="#2f7d55"/><rect x="184" y="70" width="60" height="9" rx="4.5" fill="#cfe9dc"/><rect x="184" y="88" width="70" height="9" rx="4.5" fill="#cfe9dc"/><circle cx="286" cy="34" r="20" fill="#3f9b6b"/><path d="m277 34 7 7 12-13" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="370" cy="130" r="40" fill="#9fd0b5" opacity=".5"/>`,
    // compliance programs: a checklist on a clipboard
    `<rect x="140" y="20" width="120" height="124" rx="10" fill="#fff"/><rect x="176" y="12" width="48" height="16" rx="6" fill="#33363c"/>${[0, 1, 2, 3].map(i => `<rect x="156" y="${44 + i * 23}" width="12" height="12" rx="3" fill="${i < 3 ? '#33363c' : '#fff'}" stroke="#33363c" stroke-width="2"/>${i < 3 ? `<path d="m158.5 ${50 + i * 23} 3 3 5-6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>` : ''}<rect x="176" y="${46 + i * 23}" width="${[64, 52, 70, 46][i]}" height="8" rx="4" fill="#dcd6cb"/>`).join('')}<circle cx="60" cy="40" r="34" fill="#cfc8ba" opacity=".6"/>`,
    // webinars: a screen with a play button and a chat bubble
    `<rect x="96" y="24" width="208" height="112" rx="12" fill="#fff"/><rect x="96" y="24" width="208" height="20" rx="10" fill="#f5c8a8"/><circle cx="200" cy="90" r="24" fill="#ec6711"/><path d="M193 78v24l20-12z" fill="#fff"/><rect x="292" y="18" width="78" height="40" rx="10" fill="#c45410"/><rect x="304" y="31" width="54" height="7" rx="3.5" fill="#fff" opacity=".85"/><rect x="304" y="43" width="34" height="7" rx="3.5" fill="#fff" opacity=".6"/>`
  ];
  return `<svg viewBox="0 0 400 156" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${A[cat] || A[0]}</svg>`;
}

/* ---------- hero: open a solution card and scroll to it ---------- */
function openSolCard(k) {
  const cards = $$('#modules .sol-card');
  const card = cards.find(c => (c.querySelector('.mlink') || {}).getAttribute && (c.querySelector('.mlink').getAttribute('href') || '').replace(/^#|\/$/g, '').split('/').pop() === k);
  if (!card) return;
  cards.forEach(c => {
    const on = c === card, b = c.querySelector('.sol-btn');
    c.classList.toggle('open', on);
    if (b) { b.setAttribute('aria-expanded', on); b.querySelector('span').textContent = on ? 'Show less' : 'Learn more'; }
  });
  card.classList.add('in');
  setTimeout(() => scrollToY(card.getBoundingClientRect().top + window.scrollY - 104), 30);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-open-sol]');
  if (b) { e.preventDefault(); openSolCard(b.dataset.openSol); }
});

/* ---------- next webinar: register or get alerts ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-wnx]');
  if (!b) return;
  const card = b.closest('.wnx-card'), k = b.dataset.wnx;
  $$('[data-wnx-panel]', card).forEach(p => { p.hidden = p.dataset.wnxPanel !== k ? true : !p.hidden; });
  $$('[data-wnx]', card).forEach(x => x.classList.toggle('on', x === b && !card.querySelector(`[data-wnx-panel="${k}"]`).hidden));
  const open = card.querySelector(`[data-wnx-panel="${k}"]`);
  card.querySelector('.wnx-demo').hidden = open.hidden || !!scanApi();
  if (!open.hidden) { const i = open.querySelector('input:not([type=hidden])'); if (i) setTimeout(() => i.focus({preventScroll: true}), 50); }
});
document.addEventListener('submit', async e => {
  const f = e.target.closest('.wnx-alert');
  if (!f) return;
  e.preventDefault();
  const v = f.elements.email.value.trim(), err = f.querySelector('.err');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { err.textContent = 'Add a work email.'; err.hidden = false; return; }
  err.hidden = true;
  if (!(await formSend(f, {kind: 'webinar-alert', email: v, industry: f.elements.industry ? f.elements.industry.value : '', newsletter: NL(f)})).ok) return;
  f.hidden = true; f.parentElement.querySelector('.wnx-done').hidden = false;
});
/* ---------- next webinar from a Google Sheet ----------
   WEBINAR_SHEET is the sheet tab's "Publish to web" CSV link. Empty = use nextWebinar() above.
   Columns (header names, any order): Show | Date | Start time (ET) | Duration (min) | Topic |
   Description | Special guests | Registration link | Recording link
   The card shows the next row marked Show = Yes whose end time has not passed. */
function webinarSheetURL() { return 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOXZvgPuhf7kIVA870sTt7bUAfBIDlRsCLa3C8JUIiioIS4gzp9iYcIBJNroxpY1QvOa9o6IFA97CU/pub?gid=1048252422&single=true&output=csv'; }
function wsParseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim() !== ''));
}
function wsDate(v) {
  v = (v || '').trim(); let m;
  if ((m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return [+m[1], +m[2] - 1, +m[3]];
  if ((m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))) return [+m[3], +m[1] - 1, +m[2]];
  const t = Date.parse(v);
  if (!isNaN(t)) { const d = new Date(t); return [d.getFullYear(), d.getMonth(), d.getDate()]; }
  return null;
}
function wsTime(v) {
  const m = (v || '').trim().match(/^(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*([ap])\.?m?\.?$/i) || (v || '').trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m) return null;
  let h = +m[1]; const min = +(m[2] || 0), ap = m[3] && m[3].toLowerCase();
  if (ap === 'p' && h < 12) h += 12;
  if (ap === 'a' && h === 12) h = 0;
  return h > 23 || min > 59 ? null : h * 60 + min;
}
const wsYes = v => /^(yes|y|true|1|x|✓|show)$/i.test((v || '').trim());
const wsUrl = v => { v = (v || '').trim(); return /^https:\/\/[^\s<>"']+$/i.test(v) ? v : ''; };
function wsRows(text) {
  const rows = wsParseCSV(text);
  if (rows.length < 2) return [];
  const head = rows[0].map(h => h.trim().toLowerCase());
  const col = re => head.findIndex(h => re.test(h));
  const C = {show: col(/^show|publish|visible/), date: col(/^date/), time: col(/time/), dur: col(/duration|length|min/), topic: col(/topic|title/),
    desc: col(/desc|summary|about/), guests: col(/guest|speaker/), url: col(/regist/), rec: col(/record/)};
  const g = (r, k) => (C[k] >= 0 ? (r[C[k]] || '') : '').trim();
  return rows.slice(1).map(r => {
    const d = wsDate(g(r, 'date')), t = wsTime(g(r, 'time'));
    const dur = Math.max(15, Math.min(480, parseInt(g(r, 'dur'), 10) || 60));
    if (!d || t == null || !g(r, 'topic')) return null;
    const start = etToLocal(new Date(d[0], d[1], d[2]), t);
    return {
      show: C.show < 0 ? true : wsYes(g(r, 'show')),
      topic: g(r, 'topic'), desc: g(r, 'desc'), dur, start, end: new Date(start.getTime() + dur * 60e3),
      guests: g(r, 'guests').split(/\s*;\s*|\n+/).map(s => s.trim()).filter(Boolean).slice(0, 6),
      url: wsUrl(g(r, 'url')), rec: wsUrl(g(r, 'rec'))
    };
  }).filter(Boolean);
}
function wsNext(list) {
  const now = Date.now();
  return list.filter(w => w.show && w.end.getTime() > now).sort((a, b) => a.start - b.start)[0] || null;
}
function wsGuestHTML(s) {
  const parts = s.split(/\s*,\s*/), name = parts.shift(), rest = parts.join(', ');
  const ini = name.split(/\s+/).filter(Boolean).map(x => x[0]).slice(0, 2).join('').toUpperCase();
  return `<li><i aria-hidden="true">${esc(ini)}</i><span><b>${esc(name)}</b>${rest ? `<small>${esc(rest)}</small>` : ''}</span></li>`;
}
function wsApply(sec, w) {
  const $s = s => sec.querySelector(s);
  sec.classList.remove('loading');
  const topic = $s('[data-w-topic]'), desc = $s('[data-w-desc]'), guests = $s('[data-w-guests]'), meta = $s('.wnx-meta'), reg = $s('[data-w-reg]'), bar = $s('.wnx-main .bar');
  if (!w) {
    sec.classList.add('soon');
    bar.textContent = 'Live webinars';
    topic.textContent = 'Our next webinar is being scheduled.';
    desc.textContent = 'Get webinar alerts and we’ll email you the topic and date as soon as it’s announced.'; desc.hidden = false;
    guests.hidden = true; meta.hidden = true;
    reg.innerHTML = '';
    const al = $s('[data-wnx="alert"]'); if (al) { al.textContent = 'Get webinar alerts'; al.classList.replace('ghost', 'primary'); }
    const nt = $s('.wnx-act > .note'); if (nt) nt.textContent = 'Free for compliance teams. One email per webinar, unsubscribe any time.';
    return;
  }
  sec.classList.remove('soon');
  bar.textContent = 'Next live webinar';
  topic.textContent = w.topic;
  desc.textContent = w.desc; desc.hidden = !w.desc;
  guests.innerHTML = w.guests.length ? `<p class="wg-l">${w.guests.length > 1 ? 'Special guests' : 'Special guest'}</p><ul>${w.guests.map(wsGuestHTML).join('')}</ul>` : '';
  guests.hidden = !w.guests.length;
  meta.hidden = false;
  const set = (k, v) => { const el = $s(`[data-w-v="${k}"]`); if (el) el.textContent = v; };
  set('cal', w.start.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'}));
  set('clock', `${fmtClock(w.start)} to ${fmtClock(w.end)} ${TZ_NAME}`);
  set('cam', `${w.dur} minutes, online`);
  sec.dataset.wStart = w.start.toISOString(); sec.dataset.wTopic = w.topic;
  reg.innerHTML = w.url
    ? `<a class="btn primary" href="${esc(w.url)}" target="_blank" rel="noopener">Register now <span class="vh">(opens in a new tab)</span></a>`
    : `<button type="button" class="btn primary" data-wnx="reg">Register now</button>`;
}
function wsEventLD(w) {
  if (!w) return;
  const ld = {'@context': 'https://schema.org', '@type': 'Event', name: w.topic, description: w.desc || w.topic,
    startDate: w.start.toISOString(), endDate: w.end.toISOString(), eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {'@type': 'VirtualLocation', url: w.url || 'https://integrityshield.io'},
    organizer: {'@type': 'Organization', name: 'SureShield, Inc.', url: 'https://sure-shield.com'},
    isAccessibleForFree: true};
  if (w.guests.length) ld.performer = w.guests.map(s => ({'@type': 'Person', name: s.split(/\s*,\s*/)[0]}));
  const sc = document.createElement('script'); sc.type = 'application/ld+json'; sc.id = 'webinar-ld';
  sc.textContent = JSON.stringify(ld);
  const old = document.getElementById('webinar-ld'); if (old) old.remove();
  document.head.appendChild(sc);
}
async function loadWebinarSheet() {
  const secs = $$('[data-web]');
  const url = webinarSheetURL();
  if (!url || !secs.length) return;
  let w = null;
  try {
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const tm = ctl ? setTimeout(() => ctl.abort(), 9000) : 0;
    const r = await fetch(url, ctl ? {signal: ctl.signal} : {});
    clearTimeout(tm);
    if (!r.ok) throw new Error('sheet ' + r.status);
    w = wsNext(wsRows(await r.text()));
  } catch (err) { console.warn('Webinar sheet could not be loaded:', err && err.message); }
  $$('[data-web]').forEach(sec => wsApply(sec, w));
  wsEventLD(w);
}
loadWebinarSheet();

/* ---------- opening scene ---------- */
function heroReveal() { document.documentElement.classList.remove('intro-hold'); $$('#ticks i').forEach(i => i.classList.remove('on')); fillTicks(); }
const intro = $('#intro'), ROOT = document.documentElement, ixSlot = $('#ixSlot');
const IX_ITEMS = ['surprise audits', 'manual list checks', 'monthly blind spots', 'false-match floods'];
const IX_TOKENS = ['A. DOE', 'CLEAR', 'ACME LINEN', 'SAM.GOV', 'S. ROE', 'FDA DEBARMENT', 'P. EXAMPLE', 'TX HHSC-OIG', 'GLOBEX COURIER', 'CLEAR', 'C. DOE', 'NY OMIG', 'K. SAMPLE', 'OIG LEIE', 'INITECH SUPPLY', 'CLEAR', 'J. TEST', 'OH MEDICAID', 'L. ROE', 'CMS OPEN PAYMENTS', 'J. EXAMPLE', 'CLEAR'];
let ixTimers = [], ixState = 'idle';
function ixBuildRows() {
  const bg = $('#ixBg'); if (bg.childElementCount) return;
  const N = 11; let html = '';
  for (let r = 0; r < N; r++) {
    const toks = IX_TOKENS.map((_, i) => IX_TOKENS[(i * 7 + r * 5) % IX_TOKENS.length]);
    if (r === 6) toks.splice(5, 0, '<em>D. WHITCOMBE · OIG LEIE · 96% MATCH</em>');
    const line = toks.join('   ·   ') + '   ·   ';
    html += `<div class="ix-row" style="--dur:${38 + (r * 7) % 19}s;--d:${(0.08 + r / N * 0.9).toFixed(2)}s">${line}${line}</div>`;
  }
  bg.innerHTML = html;
}
function ixSet(text) {
  const cur = $$('.ix-word:not(.leave)', ixSlot);
  const w = document.createElement('span');
  w.className = 'ix-word enter'; w.textContent = text; ixSlot.appendChild(w);
  const em = parseFloat(getComputedStyle(ixSlot).fontSize);
  ixSlot.style.width = Math.ceil(w.offsetWidth + em * .24) + 'px';
  requestAnimationFrame(() => requestAnimationFrame(() => w.classList.remove('enter')));
  cur.forEach(c => { c.classList.add('leave'); setTimeout(() => c.remove(), 480); });
}
function ixReset() {
  ixTimers.forEach(clearTimeout); ixTimers = [];
  intro.classList.remove('lift', 'ix-go', 'ix-solved', 'ix-scanning');
  $$('.ix-w', intro).forEach(w => w.classList.remove('on'));
  $('.ix-count', intro).classList.remove('on');
  ixSlot.innerHTML = ''; ixSlot.style.width = '0px';
}
function ixPlay() {
  { const sk = document.querySelector('.ix-skip'); if (sk) setTimeout(() => sk.focus({preventScroll: true}), 60); }
  if (reduce) { ixDone(); return; }
  ixReset(); ixBuildRows();
  ROOT.classList.add('intro-on', 'intro-hold');
  ixState = 'play';
  const T = (ms, fn) => ixTimers.push(setTimeout(fn, ms));
  const fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 450))]);
  fontsReady.then(() => {
    if (ixState !== 'play') return;
    intro.classList.add('ix-go');
    $$('.ix-l1 .ix-sw.a .ix-w', intro).forEach((w, i) => T(220 + i * 150, () => w.classList.add('on')));
    IX_ITEMS.forEach((t, i) => T(620 + i * 940, () => ixSet(t)));
    T(1100, () => $('.ix-l3 .ix-sw.a .ix-w', intro).classList.add('on'));
    const solve = 620 + IX_ITEMS.length * 940 + 120;
    T(solve, () => { intro.classList.add('ix-solved', 'ix-scanning'); ixSet('the solution.'); });
    T(solve + 700, () => $('.ix-count', intro).classList.add('on'));
    T(solve + 1900, ixLift);
  });
}
function ixLift() {
  if (ixState !== 'play') return;
  ixState = 'lift';
  ixTimers.forEach(clearTimeout); ixTimers = [];
  intro.classList.add('lift');
  setTimeout(heroReveal, 330);
  setTimeout(ixDone, 950);
}
function ixDone() {
  ixState = 'done';
  ROOT.classList.remove('intro-on'); if (ROOT.classList.contains('intro-hold')) heroReveal();
  intro.classList.remove('lift', 'ix-go', 'ix-solved', 'ix-scanning');
}
intro.addEventListener('click', ixLift);
addEventListener('keydown', () => { if (ixState === 'play') ixLift(); });
addEventListener('wheel', () => { if (ixState === 'play') ixLift(); }, {passive: true});
addEventListener('touchmove', () => { if (ixState === 'play') ixLift(); }, {passive: true});
document.addEventListener('click', e => {
  if (!e.target.closest('[data-replay]')) return;
  e.preventDefault();
  if (route !== 'home') { location.href = U('home') + '?intro=1'; return; }
  setTimeout(() => { scrollToY(0, true); ixPlay(); }, route !== 'home' ? 400 : 0);
});
if (ROOT.classList.contains('intro-on')) ixPlay(); else fillTicks();

/* ---------- links to other pages are real addresses ---------- */
const ROUTE_KEYS = Object.keys(ROUTES);
function fixLink(a) {
  const h = a.getAttribute('href'); if (!h || h[0] !== '#') return;
  const k = h.slice(1); if (!ROUTE_KEYS.includes(k)) return;
  a.setAttribute('href', U(k) + (a.dataset.pr ? '?sol=' + a.dataset.pr : ''));
}
$$('a[href^="#"]').forEach(fixLink);
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
  if (n.nodeType !== 1) return;
  if (n.matches('a[href^="#"]')) fixLink(n);
  n.querySelectorAll('a[href^="#"]').forEach(fixLink);
}))).observe(document.body, {childList: true, subtree: true});

})();
