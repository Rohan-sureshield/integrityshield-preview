(() => {
/* ---------- multi-page setup ---------- */
const SITE_ROOT = document.documentElement.dataset.root || '';
const U = r => r === 'home' ? (SITE_ROOT || './') : SITE_ROOT + r + '/';
const SEC_HASH = {'.book': 'book', '[data-plans-sec]': 'plans', '[data-faqsec]': 'faq', '[data-web]': 'webinar', '.assess': 'assess'};
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
  home: {title: "IntegrityShield | All-in-One Sanctions, Exclusion & Conflict of Interest Screening Software", desc: "All-in-one screening software for employees, vendors and healthcare providers: OFAC, OIG, SAM and 63 official sanctions and exclusion lists every night, plus conflict of interest monitoring with CMS Open Payments."},
  ses: {title: "Sanctions & Exclusion Screening Software for Employees, Vendors & Healthcare Providers (OFAC, OIG, SAM) | IntegrityShield-SES", desc: "All-in-one sanctions and exclusion screening software for your workforce, vendors and healthcare providers. Screens against OFAC, OIG LEIE, SAM.gov and state exclusion lists from official sources, every night. Features, free check, demo and pricing."},
  coi: {title: "Healthcare Conflict of Interest Monitoring Software | CMS Open Payments | IntegrityShield-COI", desc: "Detect and monitor hidden financial relationships between vendors and healthcare practitioners. IntegrityShield-COI matches vendors and credentialed practitioners against CMS Open Payments: an Open Payments compliance platform for Stark Law and Anti-Kickback."},
  licensure: {title: 'Licensure Verification and Monitoring | IntegrityShield-Licensure', desc: 'IntegrityShield-Licensure: license and certification monitoring for compliance teams. Details coming soon.'},
  about: {title: "About IntegrityShield | Sanctions, Exclusion & Conflict of Interest Screening Software by SureShield", desc: "IntegrityShield is SureShield's integrity screening platform for compliance officers: continuous sanctions and exclusion screening against OFAC, OIG and SAM, and conflict of interest monitoring with CMS Open Payments."},
  team: {title: "Our Team | The Compliance and Security Leaders Behind IntegrityShield", desc: "Meet the SureShield leadership team behind IntegrityShield, with decades of experience in healthcare compliance, information security, risk software and finance."},
  blog: {title: "IntegrityShield Blog | Sanctions Screening, Exclusion Monitoring & Conflict of Interest Compliance", desc: "Guides for compliance officers on OIG exclusion screening, OFAC and SAM checks, state Medicaid exclusion lists, CMS Open Payments and conflict of interest monitoring."},
  contact: {title: "Contact IntegrityShield | Book a Demo or Join a Compliance Webinar", desc: "Talk to the IntegrityShield team about sanctions and exclusion screening or conflict of interest monitoring. Book a demo, register for a live webinar or call 1-800-604-1354."},
  pricing: {title: 'Pricing | IntegrityShield', desc: 'Compare Basic, Plus, Max and Enterprise plans for IntegrityShield-SES, -COI and -Licensure. Save 20% with annual billing.'}
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

const HOME_FAQ = [["What is IntegrityShield?","All-in-one software that continuously screens the records you are required to monitor, such as employees, healthcare practitioners, vendors, board members and investors, for sanctions, exclusions, conflicts of interest and licensure issues, against official sources such as OFAC, OIG, SAM and CMS Open Payments, and keeps the audit trail for you."],["Which solutions are available?","IntegrityShield-SES for healthcare sanctions and exclusions screening, IntegrityShield-COI for conflict of interest screening of your providers against your vendors, and IntegrityShield-Licensure for live licensure and credential checks."],["Which lists do you screen against?","The same lists regulators and payors use: federal lists such as OIG LEIE, SAM.gov and OFAC SDN, state Medicaid exclusion lists, international sanctions lists, and data sources such as CMS Open Payments."],["How often does screening run?","Every night, and again whenever a source list changes or you add or update a monitoring record."],["How does IntegrityShield keep false positives down?","Identity matching algorithms compare names with other identifiers, such as date of birth, address and NPI, and clear 90% of false positives so your team reviews only the identity matches that need attention."],["What happens when there is a match?","You get an instant alert, and the exception is routed to the right person through configurable workflows for each type of integrity check. Every decision is logged for your audit trail."],["Who in our organization uses it?","Compliance, HR and onboarding, professional staff credentialing, supply chain and procurement, contract management and finance, revenue cycle, and risk and legal teams, all from one platform."],["How long does setup take?","Less than an hour from subscription activation."],["Can we stop outsourcing screening?","Yes. Teams bring screening in-house at a lower cost than outsourcing, with a full audit trail."],["How does pricing work?","Each solution has Basic, Plus, Max and Enterprise plans. Pay monthly, or save 20% with annual billing."]];
const PRICING_FAQ = [
  ['Can I change plans later?', 'Placeholder answer. Plan change terms coming soon.'],
  ['How much does annual billing save?', '20% compared with paying monthly.'],
  ['Can I buy more than one solution?', 'Yes. Each solution is priced on its own. Contact us to discuss bundles.'],
  ['Are these prices final?', 'No. All prices and plan features shown here are placeholders for this demo.']
];

const M = {
  ses: {
    name: 'IntegrityShield-SES', short: 'SES', crumb: "Sanctions & Exclusion Screening Software", vis: 'sources', visTitle: 'Source sync · tonight',
    oneliner: "All-in-one sanctions and exclusion screening for employees, vendors and healthcare providers: OFAC, OIG, SAM and 63 official lists, every night.",
    h1: '63 exclusion lists. Screened nightly. <span class="mark">Owned in-house.</span>',
    lede: "All-in-one sanctions and exclusion screening software for your workforce, vendors and healthcare providers. Checks OFAC, OIG, SAM and state exclusion lists from official government sources, every night.",
    stats: [['63','','Sources, updated nightly'],['440','k','Records checked against'],['90','%','Less than outsourcing'],['100','%','Audit ready']],
    hTitle: 'Live in under an hour.',
    steps: [["Load your workforce, vendors and providers", "Import employees, contractors, vendors and healthcare providers, or connect HR, credentialing and vendor systems."], ["We screen every night", "Each record is checked against OFAC, OIG LEIE, SAM.gov and state exclusion lists, 63 official sources, and again whenever a list changes."], ["Review real matches", "Match scoring clears false positives, so you only see what matters."], ["Close with evidence", "Every decision is logged and ready for your next audit."]],
    featTitle: "Sanctions screening software features",
    features: ["OFAC SDN, OIG LEIE, SAM.gov and state Medicaid exclusion lists: 63 official government sources", "Employees, contractors, vendors and healthcare providers screened in one place", "Nightly rescreening, plus a rescreen whenever a list updates", "Match scoring that clears false positives", "Audit trail and reports for every screening decision", "APIs for HR, credentialing, vendor and billing systems"],
    assess: 'ses',
    faqTitle: "Sanctions &amp; exclusion screening FAQs.",
    faq: [["What is sanctions and exclusion screening software?", "Software that checks employees, vendors and healthcare providers against government sanctions and exclusion lists, such as OFAC, OIG LEIE and SAM.gov, and flags matches for review. IntegrityShield-SES does this every night, in-house."], ["Is IntegrityShield-SES an all-in-one tool for employees, vendors and healthcare providers?", "Yes. One platform screens your workforce, contractors, vendors and healthcare providers against 63 federal and state lists, including OFAC SDN, OIG LEIE and SAM.gov exclusions."], ["Which official exclusion lists does it check?", "OIG LEIE, SAM.gov exclusions, OFAC SDN, and state Medicaid exclusion and termination lists: 63 official government sources, refreshed every night."], ["What should sanctions screening software include in 2026?", "Coverage of OFAC, OIG, SAM and every state list you are subject to; nightly rescreening; match scoring that clears false positives; an audit trail; and integrations with HR, credentialing and vendor systems. IntegrityShield-SES includes each of these."], ["How quickly can we start?", "Most teams screen their first watchlist within an hour."], ["Can we stop outsourcing?", "Yes. Run screening in-house for up to 90% less, with an audit trail reviewers can follow."], ["Does it connect to our systems?", "Yes. APIs connect to HR, credentialing, contract management and billing systems."]]
  },
  coi: {
    name: 'IntegrityShield-COI', short: 'COI', crumb: "Conflict of Interest Monitoring Software", vis: 'graph', visTitle: 'COI screening · CMS Open Payments',
    oneliner: "Detects and monitors hidden financial relationships between vendors and credentialed healthcare practitioners, using CMS Open Payments.",
    h1: 'See every vendor dollar that <span class="mark">reaches your practitioners.</span>',
    lede: "Healthcare conflict of interest monitoring software. Detect hidden financial relationships between your vendors and credentialed practitioners with CMS Open Payments data, before they become Stark Law or Anti-Kickback risk.",
    laws: ['Stark Law','Anti-Kickback Statute','Sunshine Act','False Claims Act','Civil Monetary Penalties Law','HRSA COI policy'],
    stats: [['1.5','M','Practitioners screened'],['3,000','','Reporting entities, 2017 to 2023'],['99','%+','Less time to find cases'],['75','%+','Lower admin cost']],
    hTitle: 'From vendor list to audit-ready report.',
    steps: [["Add vendors and credentialed practitioners", "Import lists, or sync from contract, vendor and credentialing systems."], ["Match against CMS Open Payments", "Vendor-physician financial relationships are matched automatically, and monitored as Open Payments data updates."], ["Work suspect cases", "A standardized worklist takes each hidden relationship from open to closed."], ["Report by law", "Export audit-ready reports for Stark Law, Anti-Kickback and more."]],
    featTitle: "Conflict of interest monitoring features",
    features: ["CMS Open Payments matching for vendors and credentialed practitioners", "Continuous monitoring of vendor-physician financial relationships as Open Payments data updates", "Every reported payment by amount, year and type", "Suspect-case worklist from open to closed", "Ad hoc checks before you sign a vendor or credential a practitioner", "Audit-ready reports for Stark Law, Anti-Kickback and the Sunshine Act"],
    assess: 'coi',
    faqTitle: "Conflict of interest monitoring FAQs.",
    faq: [["What is healthcare conflict of interest monitoring software?", "Software that detects and monitors financial relationships between your vendors and the healthcare practitioners you credential, so undisclosed conflicts surface before they become Stark Law or Anti-Kickback problems."], ["How does IntegrityShield-COI detect hidden financial relationships between vendors and practitioners?", "It matches your vendors and credentialed practitioners against CMS Open Payments and shows every reported payment between them, by amount, year and type."], ["What is CMS Open Payments?", "A federal database where drug and device makers report payments to physicians, certain practitioners and teaching hospitals."], ["Is IntegrityShield-COI an Open Payments compliance platform?", "Yes. It monitors Open Payments data as it updates, gives your team one worklist for suspect cases, and exports audit-ready reports by law."], ["What should a conflict of interest monitoring platform include in 2026?", "Matching of vendors and credentialed practitioners against CMS Open Payments, continuous monitoring as the data updates, a case worklist, ad hoc checks before you sign, and reports for Stark Law and Anti-Kickback. IntegrityShield-COI includes each of these."], ["Which laws does it support?", "Stark Law, Anti-Kickback, the Sunshine Act, the False Claims Act, the CMP Law and HRSA COI policy."], ["Can we check someone before signing?", "Yes. Run an ad hoc check on any vendor or practitioner before you engage them."], ["How is it priced?", "Plans are sized by the number of practitioners and vendors you track. See the plans above."]]
  },
  licensure: {
    name: 'IntegrityShield-Licensure', short: 'Licensure', crumb: 'Licensure Verification', placeholder: true, vis: 'lic', visTitle: 'License monitor · placeholder',
    oneliner: 'Placeholder: tracks licenses and certifications and alerts you before they lapse.',
    h1: 'Every license verified. <span class="mark">Every renewal tracked.</span>',
    lede: 'Placeholder copy. IntegrityShield-Licensure will monitor professional licenses and certifications across your workforce. Full details coming soon.',
    hTitle: 'How it will work.',
    steps: [['Add licensed staff','Placeholder: import people and the licenses they hold.'],['Connect license sources','Placeholder: link licensing boards and certification bodies.'],['Monitor status','Placeholder: track expirations and status changes.'],['Act on alerts','Placeholder: get notified before a license lapses.']],
    faq: [
      ['When will Licensure be available?', 'Placeholder answer. Launch details coming soon.'],
      ['Which licenses will it cover?', 'Placeholder answer. Coverage details coming soon.'],
      ['Will it work with SES and COI?', 'Placeholder answer. Details coming soon.'],
      ['How will it be priced?', 'See the placeholder plans above. Final pricing coming soon.']
    ]
  }
};

const ANNUAL_OFF = .2;
const ENT = {k: 'ent', n: 'Enterprise', blurb: 'For complex or high-volume needs.', f: ['Unlimited records','Custom sources and rules','SSO and role-based access','Dedicated success manager','Custom terms and SLA']};
const PLANS = {
  ses: {tiers: [
    {k: 'basic', n: 'Basic', m: 199, blurb: 'For small teams getting started.', f: ['Up to 250 watchlist records','OIG LEIE, SAM.gov and OFAC','Nightly rescreening','Email alerts','Standard audit reports']},
    {k: 'plus', n: 'Plus', m: 449, pop: true, blurb: 'For growing compliance programs.', f: ['Up to 1,000 watchlist records','All 63 federal and state lists','Email and text alerts','False-positive workflow','Ad hoc hiring checks']},
    {k: 'max', n: 'Max', m: 899, blurb: 'For larger, multi-site organizations.', f: ['Up to 5,000 watchlist records','Everything in Plus','HR and credentialing integrations','API access','Priority support']},
    ENT]},
  coi: {tiers: [
    {k: 'basic', n: 'Basic', m: 299, blurb: 'For small teams getting started.', f: ['Up to 100 practitioners','Up to 50 supply-chain vendors','Open Payments matching','Case worklist','Standard reports']},
    {k: 'plus', n: 'Plus', m: 649, pop: true, blurb: 'For growing compliance programs.', f: ['Up to 500 practitioners','Up to 250 vendors','Automatic data refresh','Custom COI rules','Pre-engagement checks']},
    {k: 'max', n: 'Max', m: 1199, blurb: 'For larger, multi-site organizations.', f: ['Up to 2,000 practitioners','Unlimited vendors','Everything in Plus','Contract and credentialing sync','Priority support']},
    {...ENT, f: ['Unlimited practitioners','Multi-entity reporting','SSO and role-based access','Dedicated success manager','Custom terms and SLA']}]},
  licensure: {placeholder: true, tiers: [
    {k: 'basic', n: 'Basic', m: 149, blurb: 'Placeholder tier.', f: ['Up to 100 licensed staff','Expiration tracking','Renewal reminders','Email alerts']},
    {k: 'plus', n: 'Plus', m: 349, pop: true, blurb: 'Placeholder tier.', f: ['Up to 500 licensed staff','Everything in Basic','Multi-state licenses','Email and text alerts']},
    {k: 'max', n: 'Max', m: 699, blurb: 'Placeholder tier.', f: ['Up to 2,000 licensed staff','Everything in Plus','HR system sync','Priority support']},
    {...ENT, blurb: 'Placeholder tier.', f: ['Unlimited licensed staff','Custom license sources','SSO and role-based access','Dedicated success manager']}]}
};

const SOURCES = [{"n": "OIG LEIE", "k": "fed"}, {"n": "Medi-Cal Suspended & Ineligible Provider List", "k": "state"}, {"n": "UN Security Council Consolidated List", "k": "intl"}, {"n": "SAM.gov Exclusions", "k": "fed"}, {"n": "Texas HHSC-OIG Exclusions", "k": "state"}, {"n": "CMS Open Payments", "k": "data"}, {"n": "OFAC SDN List", "k": "fed"}, {"n": "New York OMIG Exclusion List", "k": "state"}, {"n": "UK OFSI Consolidated List", "k": "intl"}, {"n": "FDA Debarment List", "k": "fed"}, {"n": "Pennsylvania Medicheck List", "k": "state"}, {"n": "NPPES NPI Registry", "k": "data"}, {"n": "Ohio Medicaid Exclusion & Suspension List", "k": "state"}, {"n": "CMS Preclusion List", "k": "fed"}, {"n": "Illinois HFS-OIG Sanctions", "k": "state"}, {"n": "EU Consolidated Financial Sanctions List", "k": "intl"}, {"n": "Georgia OIG Exclusions List", "k": "state"}, {"n": "Michigan Sanctioned Provider List", "k": "state"}, {"n": "North Carolina Medicaid Excluded Providers", "k": "state"}, {"n": "TennCare Terminated Provider List", "k": "state"}, {"n": "Washington HCA Termination & Exclusion List", "k": "state"}, {"n": "New Jersey Consolidated Debarment Report", "k": "state"}, {"n": "MassHealth Suspended & Excluded Providers", "k": "state"}, {"n": "Kentucky Medicaid Terminated & Excluded Providers", "k": "state"}, {"n": "Louisiana Adverse Actions List", "k": "state"}, {"n": "Florida AHCA Sanctioned Providers", "k": "state"}];

/* ---------- product visuals ---------- */
const VIS = {
  sources() {
    const rows = [['OIG LEIE','Federal'],['SAM.gov Exclusions','Federal'],['OFAC SDN','Federal'],['Texas HHSC-OIG','State'],['New York OMIG','State'],['Ohio Medicaid','State']];
    const t = ['02:11','02:12','02:12','02:13','02:13','02:14'];
    return `<div class="vis" data-anim="sources"><div class="vhead"><span>Source sync · tonight</span><span class="chip res">63 of 63 synced</span></div><ul class="srcl">${rows.map((r,i)=>`<li><span class="dt"></span><b>${r[0]}</b><em>${r[1]}</em><time data-t="${t[i]} ET">${t[i]} ET</time></li>`).join('')}</ul><span class="note">Sample data</span></div>`;
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
    const rows = [['A. Collins','RN','GA','Mar 31, 2027','Active'],['P. Natarajan','MD','TX','Oct 29, 2026','Expiring'],['O. Reyes','PT','FL','Aug 15, 2027','Active'],['L. Whitman','APRN','NC','Sep 30, 2026','Expired'],['I. Calloway','DEA','GA','Jan 12, 2028','Active']];
    const chip = {Active: 'res', Expiring: 'acc', Expired: 'match'};
    return `<div class="vis" data-anim="assets"><div class="vhead"><span>License monitor</span><span class="chip acc">Placeholder data</span></div><div class="atbl"><table><thead><tr><th>Name</th><th>License</th><th class="hide-s">State</th><th class="hide-s">Expires</th><th>Status</th></tr></thead><tbody>${rows.map(r=>`<tr class="${r[4]==='Expired'?'bad':''}"><td>${r[0]}</td><td class="m">${r[1]}</td><td class="m hide-s">${r[2]}</td><td class="m hide-s">${r[3]}</td><td><span class="chip ${chip[r[4]]}">${r[4]}</span></td></tr>`).join('')}</tbody></table></div><span class="note">Placeholder. Licensure details coming soon.</span></div>`;
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
function statsHTML(stats) {
  return `<div class="band" style="margin-top:clamp(56px,7vw,88px)"><div class="wrap stats" data-reveal>${stats.map(([n,suf,l],i) => {
    const num = parseFloat(n.replace(/,/g,'')), dec = n.includes('.') ? 1 : 0, sep = n.includes(',') ? 1 : 0;
    return `<div class="stat"><b${i===2?' class="acc"':''}><span data-count="${num}" data-dec="${dec}" data-sep="${sep}">${n}</span>${suf}</b><span>${l}</span></div>`;
  }).join('')}</div></div>`;
}
function faqHTML(list, title = 'Your questions answered.') {
  return `<div class="wrap faq-grid"><div style="display:grid;gap:12px;align-content:start" data-reveal><h2>${title}</h2><p class="lede" style="font-size:16px">Or call <span class="sel">1-800-604-1354</span>.</p></div><div class="faq-list" data-reveal>${list.map(([q,a])=>`<details><summary>${q}${PLUS}</summary><p>${a}</p></details>`).join('')}</div></div>`;
}
function flowHTML(steps) {
  return `<ol class="flow">${steps.map(([t,b]) => `<li><div><b>${t}</b><p>${b}</p></div></li>`).join('')}</ol>`;
}
function assessHTML(k) {
  if (k === 'ses') return `<div class="console assess" data-reveal>
      <div class="assess-top"><span class="bar">Free assessment</span><h3>Run a free exclusion check</h3><p>Search any person or business across all 63 sources. No account needed.</p></div>
      <form data-assess="ses" novalidate>
        <label for="ses-q">Name or business<input id="ses-q" name="q" placeholder="e.g. Jordan Ellis" autocomplete="off"></label>
        <div class="af-row"><label for="ses-type">Record type<select id="ses-type" name="type"><option>Individual</option><option>Business</option></select></label><label for="ses-state">State<select id="ses-state" name="state"><option>All states</option><option>Florida</option><option>Georgia</option><option>New York</option><option>Ohio</option><option>Texas</option></select></label></div>
        <button class="btn primary" type="submit">Search 63 sources</button>
      </form>
      <div class="ck-out" aria-live="polite"><div class="ck-head"><b>Jordan Ellis</b><span class="chip res">No matches</span></div><div class="ck-res"><span>Checked against <strong>63 sources</strong>, including OIG LEIE, SAM.gov and OFAC.</span><span class="note">Example result. Try a name.</span></div></div>
    </div>`;
  return `<div class="console assess" data-reveal>
      <div class="assess-top"><span class="bar">Free assessment</span><h3>Run a free payment lookup</h3><p>See whether a practitioner has reported industry payments in CMS Open Payments.</p></div>
      <form data-assess="coi" novalidate>
        <div class="af-row"><label for="coi-q">Practitioner name<input id="coi-q" name="q" placeholder="e.g. Dr. Jane Example" autocomplete="off"></label><label for="coi-v">Vendor (optional)<input id="coi-v" name="vendor" placeholder="e.g. Acme Ortho" autocomplete="off"></label></div>
        <label for="coi-yr">Years<select id="coi-yr" name="yr"><option>2017 to 2023</option><option>Last 3 years</option><option>2023 only</option></select></label>
        <button class="btn primary" type="submit">Search Open Payments</button>
      </form>
      <div class="ck-out" aria-live="polite"><div class="ck-head"><b>Dr. J. Example</b><span class="chip match">3 payments found</span></div><div class="ck-res"><span><strong>$48,200</strong> in reported payments. Largest payer: <strong>Acme Ortho</strong>.</span><span class="note">Example result. Try a name.</span></div></div>
    </div>`;
}
function bookHTML(k) {
  const d = M[k];
  return `<section class="sec book" data-book><div class="wrap">
    <div class="book-head" data-reveal><span class="bar">Book a demo</span><h2>See <span class="nw">${d.name}</span> <span class="mark">in 30 minutes.</span></h2><p class="lede">Pick a day and time. We’ll walk through it using your own use case.</p></div>
    <div class="cal" data-cal data-product="${k}" data-reveal>
      <aside class="cal-info">
        <div class="cal-host"><i>SS</i><span>SureShield team</span></div>
        <h3>${d.name} demo</h3>
        <ul class="cal-meta"><li>${SVG.clock}<span>30 minutes</span></li><li>${SVG.video}<span>Video call, link sent after booking</span></li><li>${SVG.globe}<span>Eastern Time (US &amp; Canada)</span></li></ul>
        <p class="cal-pick" hidden></p>
      </aside>
      <div class="cal-main">
        <div class="cal-step pick" data-step="pick">
          <div>
            <p class="cal-title">Select a date and time</p>
            <div class="cal-nav"><button type="button" data-prev aria-label="Previous month">${SVG.left}</button><b class="cal-mtitle"></b><button type="button" data-next aria-label="Next month">${SVG.right}</button></div>
            <div class="cal-grid cal-days"></div>
            <p class="tz">${SVG.globe}Times shown in Eastern Time</p>
          </div>
          <div class="cal-times"><h4 class="cal-dlabel"></h4><div class="slots"></div></div>
        </div>
        <form class="cal-step cal-form" data-step="form" novalidate hidden>
          <button type="button" class="cal-back" data-back>${SVG.left} Back</button>
          <p class="cal-title" style="margin:0">Enter your details</p>
          <div class="two"><label for="${k}-bk-name">Full name<input id="${k}-bk-name" name="name" autocomplete="name"></label><label for="${k}-bk-email">Work email<input id="${k}-bk-email" name="email" type="email" autocomplete="email"></label></div>
          <label for="${k}-bk-org">Organization<input id="${k}-bk-org" name="org" autocomplete="organization"></label>
          <label for="${k}-bk-note">What would you like to see? (optional)<textarea id="${k}-bk-note" name="note" rows="3"></textarea></label>
          <p class="err" hidden></p>
          <button class="btn primary" type="submit">Schedule demo</button>
          <p class="note">Demo form. Nothing is sent.</p>
        </form>
        <div class="cal-step cal-done" data-step="done" hidden>
          <span class="ok">${SVG.ok}</span>
          <h3>Your demo is scheduled</h3>
          <p data-when></p>
          <p class="note">A calendar invite would go to <b data-who></b>. In this demo, nothing was sent.</p>
          <button class="btn ghost sm" type="button" data-again>Book another time</button>
        </div>
      </div>
    </div>
  </div></section>`;
}
function pricingSecHTML(k) {
  const d = M[k];
  return `<section class="sec" data-plans-sec><div class="wrap">
    <div class="sec-head" data-reveal><div style="display:grid;gap:12px"><span class="bar">Pricing</span><h2>Choose your <span class="mark">${d.short} plan.</span></h2></div><p class="lede">Pay monthly, or save 20% when you pay annually.</p></div>
    <div class="plans" data-plans data-mode="page" data-sol="${k}"></div>
    <p class="note" style="margin-top:16px">Placeholder pricing for demo purposes. <a class="mlink" style="font-size:13px" href="#pricing" data-pr="${k}">Compare all solutions</a></p>
  </div></section>`;
}
function renderModule(k) {
  const d = M[k];
  return `
  <section class="wrap mhero">
    <div class="mcopy">
      <nav class="crumb" aria-label="Breadcrumb"><a href="#home">IntegrityShield</a><span>/</span><span>${d.crumb}</span>${d.placeholder ? '<span class="chip acc">Placeholder content</span>' : ''}</nav>
      <h1>${d.h1}</h1>
      <p class="lede">${d.lede}</p>
      <div class="cta-row"><button class="btn primary" data-go="demo">Book a demo</button><button class="btn ghost" data-go="plans">See pricing</button></div>
      ${d.laws ? `<div class="laws">${d.laws.map(l=>`<span>${l}</span>`).join('')}</div>` : ''}
    </div>
    <div class="mvis" data-s3="${({ses: 'sieve', coi: 'web', licensure: 'dom'})[k]}" role="img" aria-label="${({ses: 'Index cards fall through printed exclusion lists; clean ones land in Clear, one stops on OIG LEIE as a match', coi: 'Vendors and practitioners joined by payment lines; one $48,200 payment rises as an undisclosed relationship', licensure: 'License cards on a timeline; a sweep marks expiring licenses and an expired one that gets renewed'})[k]}"></div>
  </section>
  ${d.stats ? statsHTML(d.stats) : ''}
  <section class="sec"><div class="wrap hiw${d.assess ? '' : ' solo'}">
    <div class="hiw-copy" data-reveal><span class="bar">How it works</span><h2>${d.hTitle}</h2>${flowHTML(d.steps)}${d.features ? `<h3 class="feat-h">${d.featTitle}</h3><ul class="checks feat">${d.features.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}</div>
    ${d.assess ? assessHTML(d.assess) : ''}
  </div></section>
  ${bookHTML(k)}
  ${pricingSecHTML(k)}
  <section class="sec" style="padding-top:0" data-faqsec>${faqHTML(d.faq, d.faqTitle || `${d.short} questions.`)}</section>`;
}
function goBandHTML() {
  return `<section class="sec final" data-final><div class="wrap">
    <div class="final-top"><h2 class="zoomin">Own your integrity program.</h2><p class="lede">Pick a solution to see how it works, try a free assessment and book a demo.</p></div>
    <div class="go-cards">${SOLS.map(s => `<div class="go-card"><span class="sol-ic">${ICONS[s]}</span><h3>IntegrityShield<em>-${M[s].short}</em></h3><p>${M[s].oneliner}</p><div class="cta-row"><a class="btn primary sm" href="#${s}">View solution</a><button class="btn ghost sm" data-to="${s}:book">Book a demo</button></div></div>`).join('')}</div>
  </div></section>`;
}
function renderPricingPage() {
  return `<section class="wrap phero">
    <span class="bar">Pricing</span>
    <h1>Simple plans for <span class="mark">every solution.</span></h1>
    <p class="lede">Choose a solution to see its plans. Switch between them any time.</p>
  </section>
  <section class="sec" style="padding-top:clamp(28px,4vw,40px)"><div class="wrap">
    <div class="plans" data-plans data-mode="hub"></div>
    <p class="note" style="margin-top:16px">All prices and plan features shown are placeholders for this demo.</p>
  </div></section>
  <section class="sec" style="padding-top:0" data-faqsec>${faqHTML(PRICING_FAQ, 'Billing questions.')}</section>
  ${goBandHTML()}`;
}

SOLS.forEach(k => { $('#page-' + k).innerHTML = renderModule(k); });
$('#page-pricing').innerHTML = renderPricingPage();
/* team photos from sure-shield.com/our-team */
const TEAM_IMG = {"sanjaya": "data:image/webp;base64,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", "chandy": "data:image/webp;base64,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", "tom": "data:image/webp;base64,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", "susan": "data:image/webp;base64,UklGRpAcAABXRUJQVlA4WAoAAAAgAAAA5wAARQEASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggohoAAPB/AJ0BKugARgE+nUieSyWkIqonNsqBQBOJY269QXoubpoCgU74uV7/tuN40iQXPUZuLOdw86rfwN6cn5Xz3ZyxNbcnbT+0cZlFK8z4Ufz2u5nnu/x+777stkQjHjFVEcK0rRbWESEd4BKKvSN8HX5oDhdRGqppb9jtTZ3akoG+B639KX6qINUZyoQO1C423/DkESsSOsrjwR0xH2kp+6NHtw+EyhJUhTGFuoUrOaQv3ye3n6QvCNUwUQbNraMkHh0osOZsCKOAdhazhaHmi5a7ENYyYMqutCYr2rcb3Ev1vS61feslk0jWV3121kVLk35Rhf41GHu+9rZ4vCzQPu0kTeLWTCWDwH8EUpJQ0kIswv2A6Tw/qCsTqh0F18E8CffJYo+GRwjbxBRAXnv7ivHsXoJ7mTCTpqylPemNINfbulOuUiQDOYetY34phJlTgHmRBesh01QhNVquUSme9OtEuGTXeXln4RLDJFY2C2XdszHF4sIh3dlauR/iV1K+fRUsOeY9vbw5ybyegb76O75S9DRHEXe4UqyqE4L2E4S3usyHHLiP0YxUDr6ckgiWPBxPs5falHhCMxoVn7eIBdJRl2lQLnCLpVTak/nvDu1yCAt0MrT2NNRwBMomk6Nu5k1HIIkhax3Zo9oLFD14ooDiLINF/yvuM4bVAwpocawqT5MaSWNfgOT01fPtfoRqYW7P+rotWwp25XzQOp6h17n5o4I+JRIe4LiAT1+VkozGEsCt/HcAbdkk5ME9QEbYEJ94byftdL/RXuk3D8vdh0mvZkEErpNNPYiuojqx484govuXxWYHOUNv6mJ1eqBhM9rcJp1KsxRsVpI7IpQWSN1mGj/93HKkuM7ucIo0CkcK1S74fTmReDnMoZUZCUuvLSj9JV41gSvCkCzWL38kT0Shb7QtK0snmQ3xxtFbq/evjZyLxb82cU+N++gF13DcaXxRDVDBpJbvKiSD6Bm3K9z1FKzZv/IZJ9E35NReFNaZ+hB53R4TchaaL+PrTVmNiPFr1xSwbdW+QMvOcsOeCNSPUlRBHSxDVxQVJ0UX+LUr6iJ74DOCIA/YwOgw7AFClxwCJraYhmQEmQRfKOGGATkwsO8jvsnksXmxdx1JqH+t9DOZBxudnhSE3ReXvlfm6IprtL8lhecmkSFoJHx3/aTrcEkOEEhrIbMMkEJlxL96LffdXeruXpteJja5czk8gAzOC9RO76YbqCJPuA8EMnd4KY5zoOMuZtZ93jKUl6plx+I0ReCVp+MfDe2AuISm4UPwTStjWmad6YRfP3kKRV1rGqU025iH+85RxbY+hrsfcBKxvby0B7DtUmTnKSlcoEi1N4u92rjfHKCpVtgKieZa1jj4fOkVAAD+8+4B28EVElHnCiSjqm7GCrMlgIbFyni6sOc5HiITOXFm6xs8Tig9TK9HCJiwP8sDYGqlxky5Xoq4LAj2nQ2SNzDLnoNHjEh4z9/74nmnfkfA220zlHen7Zr8fwxr02iubJulEhsdxo/d7JT/tdMgZpgq0KdwP9eLEWo6GMYglHZD7dujwq5so0rmTlBYGpUydT0vAeAFiAcUhFzK6kdMQEb3p3zOnd6axIqFeR0wAETDhWm46wifH4Jzrkn0OTZWIPko5LDJ23geaHCfDGKlrx42y+hCISgcXVM4Wr6Ufug7yF/nAePIkGwt1Pju1krSQb1zDRwFQDdAuK/wWt+iBeioLpA1LHlZFDNsqDfHZr00qItFWXEUoQSo2p/PqMzD363Ikhez3VOd8ivmeT5LPky+fEym3/m/Sf6vdHoEUOUhNwbRMSthxuiH74yWsA+9OL+1qkJgjnTwCkBcGc42Og09rX8NbYykQRK7GuEW4U8iPskLJLmv3l4gPzcn59F1pbknQPTmnm2IK76Guo0B2KjkN5QJgYk3r2YUHV2ixMrHD4GBoqpEScb/8TfsuhALemEcgKCvFVsxaOwK/Ove3n8ANgl6tjMIuYT8IxZDmvcnR6zonIB5Mv0pw1rBXPUPmlcWgRd2vtMucpKvOFPmj1xqz1EIUdFI1MNeswltv3BRGCKRpUSNeB9EbCGR7X6WAX4Mmn+16HaCbuFmzkJl3TlWxYRZzEa4W2JgPpMW3rW3h8Sqol/HLpgf6oKVKASCdBCIl/ws7GWpY1icZxska22HkyIitVAeBvqLvMsGXgeUCgtOK2TIm8qb9r6BkvJkkdolXWMgO3+SKWv9RfAl4KbyeDEfasoVVCQdc2cvCcBGRQzRhH+Z+CoK71PakmynQKRmfkyA3Rmf8KdTfFO6X9adMMD/ucMCoUQr6r6AIXjtLczE6BJxF9LRfknXyc88kXOaM2zGTpk1W23hg3VcEkF090RmTgSFcDgNgUJSRt/bV+mJUA7buhqykvSwcxg6cz64JEK9Wu7yKyIbzzHVdxiHP1d9HoSTAXE05swYzMAyQICEox5G7g35OB75T3t1Nsv/oCyNlnDjKzMhh5FlNeMHDP0tRB6BO7zIs+tv2FcxC9I6FJ083BV6a7wLKzfTQkEFejAMpEgy+hXoqCdH+9dThi8bu67laSXdG3oCiJGukDqJhdyoUkx7KcxBE+kXUtK5fH4ry2r6MwaYWPH2u5eIjZGACq/OjAWwJS/6CsaIVApydDoEJucRj+g3EFiB3VxpuGMIQUzBnj5nm1om+0spUWNCoyJrFZhxoA+Nkrqqxa7GuUPokx6BTrMNFojqwLy3zMsUKioSxdNbJ0kgD3CckiRDqKzb7LH76BNNqJQnC83soQih2HdKCLoy9hu+aCp4pizbxNANrbjsDF6vRDf/zc/jcRokdOLIfda6NVXUPw7oo8KGNiyf3Fq+DB5Nzj3wcY0GKqw6D72D+BEVsYjAdg7yWzk8m97BcMXykAHQGuAt35HpxpS6WKPZzCBlRj6SEdR6SPOVL8zun3lpLIdf6PJQAaEykS6ZOw2j3DDCburI1YMNAED4S8QfI3g/PP0gGhQBl7vrW5oDVrrC/h+QE12MoJvqfFAD1Dz/1zw5Pql6E1yQBsHPyiuWIxwFwWRLX0me7qyR04K4aXztAfVVzxmu4dbRd3GtTlk1tiFJAk7zQYzUJpiG7PShl/YMvrPUjcPtGivrzWzlwzdyOmlkZgDa76r8vHR4z1MW+vADyJpYXxToeuLoslIfKbiW4OzDUZ1uAwiB0bmCjVbjVQrWFvXu/ecXPZXYMUtRb9gYQ6Z9IPavHiWanNbhCPFn0Fv4nBVUxZI5iyMxys3+Gm8JlMMlfJg1iwX3pizSu/u8UNg1mgy7+L+7r4MPvVLHR+JiiSejwrc1lTEpgSMfS1u1OQ2+oZzAtif28xx5dSp0Y0yU36J+uJgrpeNqmt4dizQaayHL2MbYEpcvfCaFm2YFY3b2/KPJSSWl+b4zGeM+X1zcCBwA4JCz+tu7JBvqk+nxzrSId72yK6AHofI1AYHDYkfmc4vIJChDfzZzF824D+x4O2ViB60gNcZEgqGzuAbwi5iVrvUCL9wQk5SL7CJhw8zyuonzDg/dyU96elVFe7Cqyx9ft+eFyrMtFKZaX+MafetuoD+zlk4DKUaojiBOlHdC2ifiATT6kl3YhRWqEi9+yRekjdV8G7eRdrnxxBXnPQ20NK1gHhfGy17+VIvkOj6fLdhnPT8LL+8M8WE30W0r3Znk5j6r2hMDvckBMcA0Ixm1s7a0h2AFs3UIL1neZGIOOFx56IpHIiMDYBN9ervPdKraM28IS0y96Rjhvp2/I7eFaftrWb9l3vtLC3DHWZY3xyP5r1I8869G/I0mhDDhco56UrKg9/gCQQSeVeEzbCJ/1y5uUWpVfBgXRA6ISYL0VIu/c7gazQoq0ohbrlcqueANwEw1yb8CBpJtKITAsw9uPb9Dq/FX+CZjyHArgfRY6zkfRyjjRIH91+/fygvgQK+yT3DNChtXCn6UmrRRLT6BfAGnDKgnlKwjDvEMDJVw+FeVxd6OyOoEHQZG+Nuof4cOmsljWbpZPFlPy0cVNrgjCFMbtJfiIPf280ndHqIThtMmFLmFXlRwtOQUjZgQMFrRCCCu79kadt3+2IEOUcmtUICS24k2tyK6LDpKoh7DMmUDjLDNnSx9ck/gPj/blMkGX5Cks5TGiQotwyqfbgxPHqT8Lf1EZbYEuh/At6aAoDmw/2Dn+KqSYGXC6G+dfzI4WBgHstV8VW/Rm98Wp+959pQBvOWKdOVc5ypzwKOHf5MGBzmPY1/z8DMUTxM/akuC6cuHSAfBvv/dwzpHyiA45jbY7PiGaFAxXG+y89AatlbH5UQk3mksRf6qzcOmKfOTRRCg5u7qduSv5XXfi0qvNlcoDeev0sa+Eyn4akkH7++puQ/gz4NtJD20rvLsiTrnPWCNqOkqLpxyDaMzSdDMxHVCjlxw3A+1RKueh4I46E9S/A3B0iFSJ78qkCM1JzIUSV8bpptl7Z579UZzaBVviuHKG/fpfB3V2dXv5MLmu2dVK6bUr7atqCFf5GlY6VlRTrHV3lixGh7xiS9jgprL3H6/na6GrvJYFH1hueDLBhIykF+vJWIkkFhVL35fHlPmF8yzymbCNA7Lz5f6OVXY7Y16fbEuPzmD5xxM5aPY46ACFq5MOXsXagrD9CdTOBM3pq9PzQDwTfSqQTxWqnKd/9LgQKajGUlM6sUfDJ29lhBmQSl/QA6VYIyDBKYISu7uYzwKhFXZHDLIEqcoxw5r9vjQFWY3hVeEGXnGseLoilyUChBQSpbazfoVWTcu1KbdhFiQNmZEAcro5qeRuQWR+Hf6VXA1STybs9NNvu8KBAz8FqXIJXVQ29HwHuAmzpprABTA1PY40Xo0pJ0buMA8eRZTgVTKZz8GipLY2rIc2XbwCqe8UsFYzRpZ3YE0kApvoNtcBhISwUu9VbzE2iPTpoFTrtNZ092oELNxUVrTp9Yn1Cw4olIc64RytFPWPuwvGugij8I+9vCNH96bRSKfE5VwNfihicS7lQ4fvsKPgM2kDZzd9H6Q3WjsafaTdkPpSyxmjWQg4dljAT2ZJT5yDbzgAaA2uw04fdADU3NdK56fTQncmowWbfudUjMx5/n41vr2X3IZi82qxMFTn0l+b8C4oD3TM43TJ5fpbu2zySNcMm1nNl6oV9kHkPcmP3XbkY0ryWQtifTvVONUYuhy9DHbqH++7D2/+SyfF+OmeJFyZ7kvqGAVIuNUd3xVXUMdf6nG2a1p/J90biJQFMj2mxfYZBc2S9GLJcAxgu9hDGCXsDGcS6vvder5Zxh6dgV27FfOqrdV7noVGPye0Yk2hj/p0l4yqnfx17QRNAVQtrOUsn0W0CuENGzg4wigGm+2+OfoAs8CGz1Qz3DhQIhGla+HhmAbGKbver7BqxTrAnJFfofv3bCTJhr4ZxOTZok3hJErnD4WeWO18l4YLejKZ1pcDMiIii/u3TaG4/TC58HGRJGcjEseEcAxenmCO08VdNao41HQl/9BJU1wBJeH/tmz/ffvD+v/Eo1au6rvY+iwGG+PFeEThwov2OdSAWRac4ikBaaQI8Y3AAA/de6mxChXt3vmlLF1DKLhEasl/f+oTXIg+fPBZD9nsNA/rNll7K0zRWvnlStUzQPU1QT6LLz/PLnQPf1w6/gZyJrzBXlzNuq1xhQVeOGTUgQheplZyohQ+EMcuUhuZjAJtkrVOwJpknKv+DcdGI0RoAwj+dp1S1qUsbP5Sg5Y4vKOg0JRcAIuHe3w7ySLc7UZVpAa4Ly5oPJ06xUik9ljyD6z5c2HAqC+zqCNRj2l7aC/u9BNHqRr7V487WZlMzr+1bFrRm6CLky8oB77GVREAUMvC1Ni5l8CZCsydbqeD9h3lfIjUji7DKZz4TO9iL0Pfi/93gPx+Kk80l8Ok1ipYrETb0n+hWGNVLGHvkLfbKBN9ldlgljmwNiRbGSn8PIwNoh/DypG6Hw58UiBVeG0WfOvRZGO5JBBzxuVL0Ba1eCmo9yMSrsSpCGfNSOOY7HQpgVlQQAzm3r5f/H/LKPmcEeSpoRVTrV3fJZj7aT/cdGey1ocO0PcZr+ZIH9p+sKuTmyTHTP95YAQ50PyXGkBcfDctOVSRcapS65N1fcCVDUHzZG9VN4xyLIyRrfq3gx9yvXDvDJDIZV20RUFU53y9w7g/EwULkOEXllxfmfJg4Ig+TUk9ZmH7H28i5rGrWL1IYKoXGbmWISuIacB8xdkDTwjzwK5u2tiufJmTyRN9k+f7m6+BLvHIqRVEFHP3dabbJO2LkVQRKm2gqAcsimkNPZDvXJMpj9sv8KJW4MPtIRs6hzht/v2NLShi7t8Dr3Jj4fGLqHgrKAJWG6NAjk3wEj2gHG11mY2nnV/U2Su23uyWCYnibOXkAxCKkN7TfCYe7bQfxoxe0NiDJaTlvfsOTW8U9BOXiRGVJmI6xy4guCUzhTPNjVX/wdGWrAQfBPo/R9iYzHNJAPPdOdCmxVYZiDcyNn6/0nt4ioZMTSDQ+z4k/3P/ZP4LQQC3sZqZcEkLTtS2loQ7vLbJd1OpSt2g7Vb7B2IDyiKTcjK10g2ge96XDAXOP32D3zpfcmLKPs7K8DApcPDQ54MMlo0h6sq42Fhb/MN1CEJmd+RAkSRhDGqNyPc0fM30UJNa7Q002hUdvlRd3vviGqbUNCQuL1ViCBwlaWiDWXQu/oyC9Uc1X98gqw+dkkY/aK74HHjHNpXynBZB65/D7VbvfLGBdj6JM3y83kMgyUBqsejJTgzjIkIPLvQlhcCGAkXb02lrTv2Rto8A3HqcUel+EQokiVBMGVruM0TRFVbBt4MbqJyAkbbEKsmSGxeOdNTNQQnuyM9V72FqzUEsSIu5I5hOjFOZjSQ2pFDab2BzOq47eDinNqTV+QszxEJCy03ezGvpjrezjsxygzZ/4p4sc3F4YgLHkWH3yg7twNO+a1RxBeCy3BQbctLbV3K9ZSTFtrKdFbzRU4Bcu/fRzgHX+C0UKCG39hZHfPk4JxrZw/CPThwp+zLiUVYzSf6X9OdScM5+EGhvca8Mb2+GnXxlYdGCDM2ESD2dGFAO4sNCPynN8rIUkz0cCPFnYJpOtsYfUOssAr/S8yBFDr2tHks8YpNZ+WsOFGzyA/BWmDRXUhWSJ/b/UF1JF9AUxScFfRg/+iag3nwGfD7Q6/jGYyihz/JcsV5A3yQl6n8OhPQbn/vmmCwXeal/aPTOV7f3mT8lPAOPmPdTaH0eF5MZlx8IBbeOX5mxzml0QexUc14I/F4MqzIZZIMQIE64yHdlxrX/OpTi5gYD3I+520pf77frs3tKcd7tFly8pEm7loesNmQucxSd2Qw+avHQ7A7uxi0m4yE+7Go5vrztz7t1w4yAv01AUwGViY/vgBCo3ujTraaMDA1YzKXPgOAQUwjdjpZWRRhbKkA8QsqmF+bGIloK+rFo6tG35+N+ZSQ/sQhUB0PJDvkKX+r7usxrxTwqv5/ZdpANhz25B97llDaHudkHNQ1dbrNy7sXPvnUtfDGvVjj5A+7jPacDNOdyUnQVFLAYE0yFxhgyZ5p42wXZ2YUTJGvvG1/k1fYTKQDNOICj3lnJByV7P4aAiiZLWGxzCLAEWZR+sMbaNhL7OJx+wqQaWbv2qvLceoHf0xXtmjSmhT6SN6qjfRUPVAp7rNzyvbz5J2z+1+8MWYR0gKLyvpss6Tg72/V2IyMJsfLtMHGzfJbabk7Qw6YRzShKqmMctS8MmK5VL+4ezO+Sk1eUqh2zkZIUpGLCc3ziqp/K3mCOMt5pL1yGrLtxIn49PDVfcy9MirE/N/wwP2XrErCYnQwCGXz0uBXSuJaB9ktRAkUjruKJNJrye2WkrEndZRjinDvKIQDic3LGHCDmREqDBgmVEy1/b94P3sYtmZNG2JGveht6vP1pxmfBKqNRP+QR8WgUVUYGIJOh5FfDTflDEXYC5AnWmQZbRhz2OgxTHkU+D5YN+/pfHNqAe5nz3iVQ1D2ZUZLDXwU9aXseD28Sq0DbXm/kg1mjqH7xzVLe5+aAcg9FjVHInRcEk/5JOkJw80kPOgTLbgYI4xyoCuWxQ3LBxbz/A6H11Kv6eP57owAwf1Ct4WzT5MCpOp7f3pa73kg6FHl26je5m1G4tnCgkYM2ak+aqoLKyKnfVTeXgUnsSROP4a9hRFVlRg6qEwSvV+KGqLOYi1rFXpinEpSdOVlBfyxuhbbmAEBqaeva0rY+mIm9GPn0hCcXXtIFm1qsrD6vxSOTM1cCUrIs2PAV8yWj8tY7Bcno2b1XjeD7u6p7FtwXcyXtggKu3yj0+pvDzdkSfAW1HphbYx9TdqSB8OMdtkKg0t6ug02zQUTV6fAfk6t+x5fmumxVslcZkmUyVLLbvuHVKevpVRqXaaWtd45xyXbp75r6yaoW1jfkrnr3e8s+0p62y49+0mXRUQdPM/PQRx2l5g6i54oKUJN+Cgx2xgMdp/eXenIOt78vHKVFU+3vRl4UO7qSeOku2WnobYdxx9/Hx2ZfnnVanAJpuEYKpGsdfnOxZVhzTwCIBpv1mBlfbrCkG47cy5lQL+ZkU6jH/iGMMViiHoH+lv1VRTPW1D8riUqCvWQSJg38fXE05GklNs8MWPujDVtgEirLtmQvu90yb5UDmz/XDKB3rgZzbCsZparpEF2uNQaBfcNEanxjQyS0r1d8Y7KbxUxr2cZwDRfustxqq5m+ehs2FTeDXeHq0AhkvGOV/JfKC1KaPRZIjA83SIVSk/3PB3J60xOxWyKqcw+Ow8BlyAp4ZZ+ur6NB1a5K3WCNjiPWGqu6J4QvE0fTqfEnCYKLU7MP7e4Bx5kbRkLQOnw0yAvPs/aagAsj2KHEQMVhFA/zFByCzUmRcnRFSOQYTZN+17GpPgwrf8qWGiMz1emCy6Ghzpf5xFK06QT+TLpLdazQ9xIArmXDQj8hJMRMrw5SZXDpJZZ775+sQzaiGm1CNYp7h6ZDFYDNWoVUSjRlAuezQzO9rzBLF1QKTLtAAqiF94PsQOQ6dN2DtpBExsm0Q6hhFmMACbTBOwLw1QZt7jIQ6Tv/3Y9ekZ4BVgyBi+0OAizItqylNd70eQsCnnLgYgVOLOAqEpgjN8C8j7DeIAA", "john": "data:image/webp;base64,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"};
/* ---------- company pages: about, team, blog, contact ---------- */
const ABOUT_ROUTES = ['about', 'team', 'blog', 'contact'];
M.gen = {name: 'IntegrityShield'};

const TEAM = [
  {k: 'sanjaya', name: 'Sanjaya Kumar', role: 'Chief Executive Officer', short: 'CEO', group: 'leadership',
   tags: ['Healthcare', 'Health informatics', 'SaaS'],
   bio: 'Sanjaya leads SureShield and IntegrityShield. He is a healthcare-focused executive with deep experience in health informatics and SaaS, and holds a master’s degree in public health with a focus on epidemiology.',
   focus: 'Company strategy, healthcare partnerships and business development.'},
  {k: 'chandy', name: 'Chandrasekhar Bilugu', role: 'Chief Technology Officer', short: 'CTO', group: 'leadership',
   tags: ['Information security', 'Product', 'Engineering'],
   bio: 'Chandrasekhar is a technology executive and repeat founder with decades of experience in product development and information security. He has led large engineering teams from first build to launch.',
   focus: 'The IntegrityShield platform, data sources, matching and security.'},
  {k: 'tom', name: 'Tom Leahy', role: 'SVP, Sales', short: 'SVP, Sales', group: 'leadership',
   tags: ['Compliance software', 'Risk', 'Growth'],
   bio: 'Tom has spent his career selling and building compliance, security and risk software, taking several companies from founding to exit. He and Sanjaya are on their fourth venture together.',
   focus: 'Helping compliance teams choose and roll out IntegrityShield.'},
  {k: 'john', name: 'John Hammer', role: 'Chief Financial Officer', short: 'CFO', group: 'leadership',
   tags: ['Finance', 'Venture', 'Operations'],
   bio: 'John is a finance executive for high-tech companies, with about 25 years of investing in, founding and running early-stage businesses. He holds degrees in engineering and business administration.',
   focus: 'Finance, operations and pricing.'},
  {k: 'susan', name: 'Susan Moore', role: 'Advisor, Healthcare', short: 'Advisor', group: 'advisors',
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
  {id: 'ofac-oig-sam', cat: 0, sol: 'ses', mins: 6, title: 'OFAC, OIG LEIE and SAM.gov: which lists cover what, and who must be screened',
   excerpt: 'Three federal lists, three different purposes. A plain-English guide to the OFAC SDN list, the OIG List of Excluded Individuals/Entities and SAM.gov exclusions, and how to screen against all three at once.',
   outline: ['The OFAC SDN list', 'The OIG LEIE', 'SAM.gov exclusions', 'Screening all three in one place']},
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
   excerpt: 'Expired and restricted licenses are an easy audit finding. What to look for in license and certification monitoring. IntegrityShield-Licensure is coming soon.',
   outline: ['Primary source verification', 'Expirations and restrictions', 'Alerts before a license lapses']},
  {id: 'webinar-recap', cat: 4, sol: 'ses', mins: 4, title: 'Webinar recap: continuous sanctions and exclusion screening in practice',
   excerpt: 'Highlights and audience questions from our live session on continuous screening. The full recording goes to everyone who registers.',
   outline: ['What we covered', 'Audience questions', 'Watch the recording']}
];

const ABOUT_FAQ = [
  ['Who makes IntegrityShield?', 'SureShield, Inc., a security, compliance and integrity (SCI) software company based in Atlanta, Georgia.'],
  ['What does IntegrityShield do?', 'It screens employees, vendors and healthcare providers against OFAC, OIG, SAM and 63 official sanctions and exclusion lists every night, and monitors conflicts of interest between vendors and credentialed practitioners using CMS Open Payments.'],
  ['Who is IntegrityShield for?', 'Compliance officers and their teams in healthcare, finance, defense, manufacturing and other regulated industries.'],
  ['Who leads SureShield?', 'Sanjaya Kumar (CEO), Chandrasekhar Bilugu (CTO), Tom Leahy (SVP, Sales) and John Hammer (CFO), with Susan Moore advising on healthcare.'],
  ['Can MSPs and MSSPs work with SureShield?', 'Yes. SureShield’s partner program lets MSPs and MSSPs offer its managed, automated services without a large upfront investment. Contact us to talk about IntegrityShield.']
];
const CONTACT_FAQ = [
  ['How do I book an IntegrityShield demo?', 'Pick a day and time in the calendar on this page. Demos take 30 minutes and use your own use case.'],
  ['Can I try IntegrityShield before a demo?', 'Yes. The SES and COI pages each have a free assessment: run an exclusion check or an Open Payments lookup in seconds.'],
  ['How do I join an IntegrityShield webinar?', 'Register with the webinar form on this page. Everyone who registers gets the recording.'],
  ['How can I reach the team?', 'Call 1-800-604-1354, email info@sureshield.ai, or send a message with the form on this page.']
];

const WEB = {
  ses: {h: 'Continuous sanctions and exclusion screening in 2026.', p: 'See how compliance officers screen employees, vendors and healthcare providers against OIG, SAM, OFAC and state Medicaid exclusion lists every night, and what auditors expect to see.',
        learn: ['Which official lists to screen, and how often', 'Screening vendors and contractors, not just staff', 'Clearing false positives without missing real matches', 'The audit trail reviewers ask for']},
  coi: {h: 'Detecting hidden vendor-physician financial relationships.', p: 'See how compliance teams use CMS Open Payments to monitor conflicts of interest between vendors and credentialed practitioners, before they become Stark Law or Anti-Kickback risk.',
        learn: ['What CMS Open Payments includes', 'Matching vendors to credentialed practitioners', 'Working suspect cases to closure', 'Reports for Stark Law and Anti-Kickback']},
  both: {h: 'Screening for sanctions, exclusions and conflicts of interest.', p: 'Two short sessions for compliance officers: continuous OIG, SAM and OFAC exclusion screening, then conflict of interest monitoring with CMS Open Payments.',
        learn: ['Nightly screening against official exclusion lists', 'Vendor and contractor screening', 'Conflict of interest monitoring with Open Payments', 'What auditors expect to see']}
};

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
function webinarNextHTML() {
  const w = nextWebinar();
  const ic = {
    cal: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    cam: '<rect x="3" y="6.5" width="13" height="11" rx="2"/><path d="m16 10.5 5-3v9l-5-3"/>'
  };
  const meta = (k, label, v) => `<li><span class="wn-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ic[k]}</svg></span><span><b>${label}</b>${v}</span></li>`;
  const reg = w.url ? `<a class="btn primary" href="${w.url}" target="_blank" rel="noopener">Register now</a>` : `<button type="button" class="btn primary" data-wnx="reg">Register now</button>`;
  return `<section class="sec wnx" data-web aria-labelledby="wnx-h"><div class="wrap"><div class="wnx-card" data-reveal>
    <div class="wnx-main">
      <span class="bar">Next live webinar</span>
      <h2 id="wnx-h">${w.topic}</h2>
      <ul class="wnx-meta">${meta('cal', 'Date', w.date)}${meta('clock', 'Time', w.time)}${meta('cam', 'Format', w.format)}</ul>
    </div>
    <div class="wnx-act">
      ${reg}
      <button type="button" class="btn ghost" data-wnx="alert">Can’t make it? Get webinar alerts</button>
      <p class="note">Free for compliance teams. The recording goes to everyone who registers.</p>
    </div>
    <div class="web-card wnx-panel" data-wnx-panel="reg" hidden>
      <form class="web-form wnx-form" novalidate>
        <input type="hidden" name="session" value="ses">
        <label>First name<input name="first" autocomplete="given-name"></label>
        <label>Work email<input name="email" type="email" autocomplete="email"></label>
        <label>Organization<input name="org" autocomplete="organization"></label>
        <button class="btn primary" type="submit">Save my seat</button>
        <p class="err" hidden></p>
      </form>
      <div class="web-done" hidden><span class="wd-ic" aria-hidden="true">✓</span><p class="wf-title">You’re registered.</p><p class="wd-t"></p><button type="button" class="btn ghost sm" data-web-again>Register someone else</button></div>
    </div>
    <div class="wnx-panel" data-wnx-panel="alert" hidden>
      <form class="wnx-alert" novalidate>
        <label>Work email<input name="email" type="email" autocomplete="email" placeholder="you@organization.org"></label>
        <button class="btn primary" type="submit">Notify me</button>
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
      <p class="lede">See how teams screen employees, vendors and providers against OIG, SAM, OFAC and state lists, and monitor conflicts of interest, without outsourcing.</p>
      <p class="web-chips"><span>Date to be announced</span><span>45 minutes, online</span><span>Recording for every registrant</span></p>
    </div>
    <div class="web-card" data-reveal>
      <form class="web-form" novalidate>
        <label>Session<select name="session"><option value="ses">Sanctions &amp; exclusion screening</option><option value="coi">Conflict of interest monitoring</option><option value="both">Both sessions</option></select></label>
        <div class="two"><label>First name<input name="first" autocomplete="given-name"></label><label>Work email<input name="email" type="email" autocomplete="email"></label></div>
        <label>Organization<input name="org" autocomplete="organization"></label>
        <p class="err" hidden></p>
        <button class="btn primary" type="submit">Save my seat</button>
        <p class="note">Demo form. Nothing is sent.</p>
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
      <form class="web-form" novalidate>
        <p class="wf-title">Save your seat</p>
        <fieldset class="sess"><legend>Choose a session</legend>
          <label class="sess-opt"><input type="radio" name="${px}-session" value="ses" checked><span><b>Sanctions &amp; exclusion screening</b><small>OIG, SAM, OFAC and state lists</small></span></label>
          <label class="sess-opt"><input type="radio" name="${px}-session" value="coi"><span><b>Conflict of interest monitoring</b><small>Vendor-physician relationships in CMS Open Payments</small></span></label>
          <label class="sess-opt"><input type="radio" name="${px}-session" value="both"><span><b>Both sessions</b><small>Back to back, 45 minutes each</small></span></label>
        </fieldset>
        <div class="two"><label>First name<input name="first" autocomplete="given-name"></label><label>Last name<input name="last" autocomplete="family-name"></label></div>
        <label>Work email<input name="email" type="email" autocomplete="email"></label>
        <div class="two"><label>Organization<input name="org" autocomplete="organization"></label><label>Role<select name="role"><option value="">Select</option><option>Compliance officer</option><option>Chief compliance officer</option><option>Privacy officer</option><option>Credentialing</option><option>HR</option><option>Procurement or finance</option><option>Other</option></select></label></div>
        <p class="err" hidden></p>
        <button class="btn primary" type="submit">Register for the webinar</button>
        <p class="note">Demo form. Nothing is sent.</p>
      </form>
      <div class="web-done" hidden><span class="wd-ic" aria-hidden="true">✓</span><p class="wf-title">You’re registered.</p><p class="wd-t"></p><button type="button" class="btn ghost sm" data-web-again>Register someone else</button></div>
    </div>
  </div></section>`;
}

function renderAbout() {
  const tl = [
    ['Two decades', 'Compliance software, built and scaled', 'Our leadership team has spent about 20 years building companies in compliance, safety, policy management and data analytics.'],
    ['2018', 'SureShield is founded', 'Security, compliance and integrity tools were complicated, fragmented and costly. SureShield set out to make them easy to deploy and cheaper to run.'],
    ['IntegrityShield', 'Sanctions & exclusion screening', 'IntegrityShield-SES screens employees, vendors and healthcare providers against OFAC, OIG, SAM and 63 official lists, every night.'],
    ['IntegrityShield', 'Conflict of interest monitoring', 'IntegrityShield-COI detects hidden financial relationships between vendors and credentialed practitioners using CMS Open Payments.'],
    ['Now', 'Licensure and credentials', 'IntegrityShield-Licensure adds live licensure and credential checks, with automated primary source verification documentation.']
  ];
  const values = [
    ['Customer delight', 'We build what compliance officers ask for, and measure ourselves by how easy their audits get.'],
    ['Automation', 'Nightly screening, rescreening and alerts run without anyone pressing a button.'],
    ['Attention to detail', 'Matching on name, date of birth and address clears false positives without missing real matches.'],
    ['Customer success', 'A team that helps you load watchlists, connect systems and prepare for audits.'],
    ['Continuous improvement', 'Sources, matching and reports keep getting better, release after release.'],
    ['Agility', 'Custom sources, rules and integrations for complex organizations.'],
    ['Simplicity', 'Most teams screen their first watchlist within an hour.'],
    ['Lower cost, better outcomes', 'In-house screening for up to 90% less than outsourcing, with a stronger audit trail.']
  ];
  const serve = [
    ['Healthcare', 'Hospitals, health systems, provider groups and post-acute care screening staff, vendors and practitioners.'],
    ['Finance', 'Banks and financial firms screening people and counterparties against OFAC and other sanctions lists.'],
    ['Defense and government contractors', 'Contractors checking SAM.gov exclusions across staff, suppliers and subcontractors.'],
    ['Manufacturing', 'Manufacturers screening suppliers, distributors and contractors.'],
    ['MSPs and MSSPs', 'Managed service providers offering SureShield’s automated services through its partner program.']
  ];
  return `${pageHero('About IntegrityShield', 'Integrity screening from people who have built <span class="mark">compliance software for 20 years.</span>',
      'IntegrityShield is the integrity screening platform from SureShield, Inc., an Atlanta company that builds automated security, compliance and integrity software. We help compliance officers screen employees, vendors and healthcare providers for sanctions, exclusions and conflicts of interest, in-house and every night.',
      `<div class="cta-row"><a class="btn primary" href="#team">Discover our team ${ARROW}</a><a class="btn ghost" href="#contact">Contact us</a></div>`)}
  <section class="sec ab-story"><div class="wrap ab-grid">
    <div class="ab-copy" data-reveal><span class="bar">Our story</span><h2>Why we built IntegrityShield.</h2>
      <p class="lede">Compliance teams were paying outside vendors to run monthly checks, then chasing spreadsheets when auditors asked for proof. We knew the work could be automated, run in-house and done every night.</p>
      <p class="ab-hint">Select a milestone</p></div>
    <div class="tl" data-tl data-reveal>
      <div class="tl-rail"><span class="tl-fill"></span></div>
      <ol class="tl-steps">${tl.map((s, i) => `<li><button type="button" class="tl-btn${i === 0 ? ' on' : ''}" data-i="${i}" aria-pressed="${i === 0}"><span class="tl-dot"></span><span class="tl-t">${s[0]}</span><b>${s[1]}</b></button></li>`).join('')}</ol>
      <div class="tl-panel" aria-live="polite">${tl.map((s, i) => `<div class="tl-card${i === 0 ? ' on' : ''}" data-i="${i}"><span class="tl-k">${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p></div>`).join('')}</div>
    </div>
  </div></section>
  <section class="ab-mission"><div class="wrap"><p class="am-k">Our mission</p><blockquote data-reveal>To secure America’s future, <span class="mark">one company at a time.</span></blockquote><p class="am-s" data-reveal>For IntegrityShield, that means every organization knowing, every morning, that no one they employ, contract or pay is excluded, sanctioned or conflicted.</p></div></section>
  <section class="sec ab-values"><div class="wrap">
    <div class="ab-head" data-reveal><span class="bar">What drives us</span><h2>Eight principles, built into the product.</h2><p class="lede">The values SureShield was founded on, and where you’ll see them in IntegrityShield.</p></div>
    <div class="vgrid">${values.map((v, i) => `<button type="button" class="vtile" data-reveal aria-expanded="false"><span class="vn">0${i + 1}</span><b>${v[0]}</b><span class="vt">${v[1]}</span><span class="vplus" aria-hidden="true">+</span></button>`).join('')}</div>
  </div></section>
  <section class="sec ab-serve" style="padding-top:0"><div class="wrap ab-grid">
    <div class="ab-copy" data-reveal><span class="bar">Who we serve</span><h2>Built for compliance officers in regulated industries.</h2><p class="lede">Healthcare is where screening rules are strictest, so it is where IntegrityShield started. The same screening serves any organization that must prove who it works with.</p></div>
    <ul class="serve">${serve.map(s => `<li data-reveal><b>${s[0]}</b><span>${s[1]}</span></li>`).join('')}</ul>
  </div></section>
  <section class="sec ab-meet" style="padding-top:0"><div class="wrap"><div class="meet" data-reveal>
    <div class="meet-copy"><span class="bar">Discover our team</span><h2>Meet the people behind IntegrityShield.</h2><p class="lede">Operators with backgrounds in healthcare compliance, information security, risk software and finance.</p><a class="btn primary" href="#team">Discover our team ${ARROW}</a></div>
    <a class="meet-faces" href="#team" aria-label="Discover our team">${TEAM.map(p => `<span class="mf"><img src="${p.img}" alt="${p.name}, ${p.role}" width="232" height="326" loading="lazy"><em>${p.name.split(' ')[0]}</em></span>`).join('')}</a>
  </div></div></section>
  <section class="sec" style="padding-top:0" data-faqsec>${faqHTML(ABOUT_FAQ, 'About IntegrityShield: FAQs.')}</section>`;
}
function renderTeam() {
  return `${pageHero('Our team', 'The people behind <span class="mark">IntegrityShield.</span>',
      'IntegrityShield is built by SureShield’s leadership team: operators with decades of experience in healthcare compliance, information security, risk software and finance.',
      `<div class="tfilter" role="tablist" aria-label="Filter team">${[['all', 'Everyone', TEAM.length], ['leadership', 'Leadership', TEAM.filter(p => p.group === 'leadership').length], ['advisors', 'Advisors', TEAM.filter(p => p.group === 'advisors').length]].map((f, i) => `<button type="button" role="tab" class="tf${i === 0 ? ' on' : ''}" data-f="${f[0]}" aria-selected="${i === 0}">${f[1]} <span>${f[2]}</span></button>`).join('')}</div>`)}
  <section class="sec team-sec"><div class="wrap"><div class="tgrid">${TEAM.map((p, i) => `<article class="tcard" data-g="${p.group}" data-reveal>
      <button type="button" class="tc-hit" data-person="${i}" aria-label="View profile: ${p.name}, ${p.role}"></button>
      <div class="tc-ph"><img src="${p.img}" alt="${p.name}, ${p.role} at SureShield" width="232" height="326" loading="lazy"><span class="tc-view">View profile ${ARROW}</span></div>
      <div class="tc-b"><h3>${p.name}</h3><p class="tc-r">${p.role}</p><p class="tc-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</p></div>
    </article>`).join('')}</div></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><div class="tjoin" data-reveal><div><h2>Talk to the team.</h2><p class="lede">Questions about sanctions and exclusion screening or conflict of interest monitoring? We’d like to hear about your program.</p></div><div class="cta-row"><a class="btn primary" href="#contact">Contact us</a><a class="btn ghost" href="#about">About IntegrityShield</a></div></div></div></section>`;
}
function renderBlog() {
  const counts = BLOG_CATS.map((c, i) => POSTS.filter(p => p.cat === i).length);
  return `${pageHero('IntegrityShield blog', 'Compliance guides for screening that <span class="mark">holds up in an audit.</span>',
      'Sanctions screening, exclusion monitoring and conflict of interest compliance, explained for compliance officers: OIG, SAM and OFAC checks, state Medicaid exclusion lists and CMS Open Payments.')}
  <section class="sec blog-sec" style="padding-top:clamp(28px,4vw,40px)"><div class="wrap">
    <div class="btools">
      <label class="bsearch"><svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.7"/><path d="m14 14 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><input type="search" placeholder="Search articles, for example OIG or Open Payments" aria-label="Search articles" data-bsearch></label>
      <div class="bchips" role="tablist" aria-label="Filter by topic"><button type="button" class="bc on" data-bc="-1" aria-selected="true">All <span>${POSTS.length}</span></button>${BLOG_CATS.map((c, i) => `<button type="button" class="bc" data-bc="${i}" aria-selected="false">${c} <span>${counts[i]}</span></button>`).join('')}</div>
    </div>
    <p class="bcount note" aria-live="polite" data-bcount></p>
    <div class="bgrid" data-bgrid>${POSTS.map((p, i) => postCard(p, i === 0)).join('')}</div>
    <p class="bempty" hidden>No articles match. Try another word, or <button type="button" class="link" data-bclear>clear the filters</button>.</p>
    <p class="note" style="margin-top:22px">Articles are placeholders for this demo. Full posts are coming soon.</p>
  </div></section>`;
}
function renderContact() {
  const opts = [
    ['Call sales', '1-800-604-1354', 'Talk to someone about your screening program.', 'tel:18006041354'],
    ['Email us', 'info@sureshield.ai', 'Questions, quotes and support.', 'mailto:info@sureshield.ai'],
    ['Visit', 'Atlanta, Georgia', '3343 Peachtree Rd NE, Ste 145-1564, Atlanta, GA 30326', ''],
    ['Partners', 'MSPs and MSSPs', 'Offer SureShield’s automated services to your clients.', 'https://sure-shield.com/partnershield/']
  ];
  const topics = ['Sanctions & exclusion screening', 'Conflict of interest monitoring', 'Licensure', 'Pricing', 'Partnerships', 'Something else'];
  return `${pageHero('Contact us', 'Talk to the <span class="mark">IntegrityShield team.</span>',
      'Questions about sanctions and exclusion screening, conflict of interest monitoring or pricing? Book a demo, join a live webinar or send us a note.',
      `<div class="cta-row"><button class="btn primary" data-go="demo">Book a demo</button><button class="btn ghost" data-to-web>Join a webinar</button></div>`)}
  <section class="sec" style="padding-top:clamp(36px,5vw,56px)"><div class="wrap">
    <div class="copts">${opts.map(o => `<${o[3] ? `a href="${o[3]}"` : 'div'} class="copt" data-reveal><span class="co-k">${o[0]}</span><b>${o[1]}</b><span>${o[2]}</span></${o[3] ? 'a' : 'div'}>`).join('')}</div>
    <div class="cform-wrap" data-reveal>
      <div class="cf-copy"><h2>Send us a message.</h2><p class="lede">Tell us what you screen today and what you need. The right person on our team will get back to you.</p></div>
      <form class="cform" novalidate>
        <fieldset class="topics"><legend>What can we help with?</legend>${topics.map((t, i) => `<label class="topic"><input type="radio" name="topic" value="${t}"${i === 0 ? ' checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>
        <div class="two"><label>Full name<input name="name" autocomplete="name"></label><label>Work email<input name="email" type="email" autocomplete="email"></label></div>
        <div class="two"><label>Organization<input name="org" autocomplete="organization"></label><label>Phone (optional)<input name="phone" type="tel" autocomplete="tel"></label></div>
        <label>Message<textarea name="msg" rows="4" placeholder="For example: we screen 3,000 employees and 600 vendors monthly and want to move to nightly screening."></textarea></label>
        <p class="err" hidden></p>
        <button class="btn primary" type="submit">Send message</button>
        <p class="note">Demo form. Nothing is sent.</p>
      </form>
      <div class="cdone" hidden><span class="wd-ic" aria-hidden="true">✓</span><p class="wf-title">Thanks, your message is ready.</p><p class="cd-t"></p><button type="button" class="btn ghost sm" data-c-again>Send another</button></div>
    </div>
  </div></section>
  ${webinarHTML('contact')}
  ${bookHTML('gen')}
  <section class="sec" style="padding-top:0" data-faqsec>${faqHTML(CONTACT_FAQ, 'Contact FAQs.')}</section>`;
}
function blogHomeHTML() {
  return `<section class="sec blog-home"><div class="wrap">
    <div class="bh-head" data-reveal><div><span class="bar">From the blog</span><h2>Integrity compliance nuggets from our blog posts.</h2></div><p class="lede">Practical answers on OIG exclusion checks, OFAC and SAM screening, and conflict of interest monitoring with CMS Open Payments.</p><a class="mlink" href="#blog">Read all articles ${ARROW}</a></div>
    <div class="bgrid three">${[0, 3, 6].map(i => postCard(POSTS[i])).join('')}</div>
  </div></section>`;
}

$('#page-about').innerHTML = renderAbout();
$('#page-team').innerHTML = renderTeam();
$('#page-blog').innerHTML = renderBlog();
$('#page-contact').innerHTML = renderContact();
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
const LOGOS = [
  `<div class="lg"><svg width="28" height="28" viewBox="0 0 30 30" fill="none"><path d="M15 3 27 26H3z" stroke="currentColor" stroke-width="2.2"/><path d="M9 19h12" stroke="currentColor" stroke-width="2.2"/></svg><span><b>Atlas</b><small>Healthcare Partners</small></span></div>`,
  `<div class="lg"><svg width="32" height="28" viewBox="0 0 34 30" fill="none"><path d="M2 20c5-6 9-6 15 0s10 6 15 0" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M2 12c5-6 9-6 15 0s10 6 15 0" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=".55"/></svg><span><b>Gold Coast</b><small>Health Providers</small></span></div>`,
  `<div class="lg"><svg width="28" height="28" viewBox="0 0 30 30" fill="none"><circle cx="15" cy="15" r="12" stroke="currentColor" stroke-width="2.2"/><circle cx="15" cy="15" r="5" fill="currentColor"/></svg><span><b>Genesis</b><small>HealthCare</small></span></div>`
];
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
  $$('[data-nav]').forEach(a => a.classList.toggle('cur', a.dataset.nav === r));
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
  if (target === 'faq') { const f = active.querySelector('[data-faqsec]'); if (f) scrollToEl(f); else goTo('home', '[data-faqsec]'); return; }
  if (target === 'sols') { scrollToEl($('#modules')); return; }
}
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g) { e.preventDefault(); setSheet(false); go(g.dataset.go); return; }
  const t = e.target.closest('[data-to]');
  if (t) { e.preventDefault(); setSheet(false); const [sol, sec] = t.dataset.to.split(':'); goTo(sol, SECT[sec]); return; }
  const pr = e.target.closest('[data-pr]');
  if (pr) { PR.sol = pr.dataset.pr; PR.tier = null; }
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
}

/* ---------- console stream ---------- */
const PEOPLE = [['Alex Doe','Employee'],['Acme Linen Co.','Vendor'],['Sam Roe','Contractor'],['Pat Example','Provider'],['Globex Courier LLC','Vendor'],['Jamie Sample','New hire'],['Chris Doe','Contractor'],['Initech Supply Co.','Vendor'],['Taylor Roe','Provider'],['Example Staffing Group','Contractor'],['Jordan Test','Employee'],['Casey Example','Employee'],['Sample Systems Inc','Vendor'],['Morgan Doe','Contractor']];
const tbody = $('#rows');
let pi = 0, screened = 5252, resolved = 2, review = 1;
const resultFor = i => i % 11 === 6 ? ['match','Match · OIG LEIE'] : i % 5 === 3 ? ['res','Resolved'] : ['','Clear'];
const rowHTML = (p, i) => { const [c, t] = resultFor(i); return `<td>${p[0]}</td><td class="t hide-s">${p[1]}</td><td class="s hide-s">63/63</td><td><span class="chip ${c}">${t}</span></td>`; };
for (let i = 0; i < 7; i++) { const tr = document.createElement('tr'); tr.innerHTML = rowHTML(PEOPLE[i % PEOPLE.length], i + 100); tbody.appendChild(tr); }
pi = 7;
function streamRow() {
  if (route !== 'home' || document.hidden) return;
  const i = pi++, tr = document.createElement('tr');
  tr.className = 'fresh'; tr.innerHTML = rowHTML(PEOPLE[i % PEOPLE.length], i);
  tbody.insertBefore(tr, tbody.firstChild);
  if (tbody.children.length > 7) tbody.lastElementChild.remove();
  screened++;
  const [c] = resultFor(i); if (c === 'res') resolved++; if (c === 'match') review++;
  $('#kScreened').textContent = screened.toLocaleString('en-US');
  $('#kRes').textContent = resolved; $('#kRev').textContent = review;
}
if (!reduce) setInterval(streamRow, 2200);

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
const OP_YEARS = ['2023','2022','2021','2020','2019','2018','2017'];
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-assess]');
  if (!f) return;
  e.preventDefault();
  if (f.dataset.busy) return;
  const kind = f.dataset.assess, out = f.parentElement.querySelector('.ck-out');
  const q = f.elements.q.value.trim();
  if (!q) {
    out.innerHTML = `<div class="ck-head"><b>Enter a name to search</b></div><p class="note">${kind === 'coi' ? 'Type a practitioner’s full name, then search.' : 'Type a full name or business name, then search.'}</p>`;
    f.elements.q.focus(); return;
  }
  f.dataset.busy = '1';
  const safe = clean(q);
  out.innerHTML = `<div class="ck-head"><b>${safe}</b><span class="chip acc">Searching</span></div><div class="ck-bar"><span></span></div><div class="ck-tick">Starting</div>`;
  const bar = out.querySelector('.ck-bar span'), tick = out.querySelector('.ck-tick');
  const list = SOURCES.slice(0, 24), dur = reduce ? 200 : 1600, t0 = performance.now();
  const step = t => {
    const p = clamp((t - t0) / dur);
    bar.style.width = (p * 100) + '%';
    tick.textContent = kind === 'coi'
      ? `Searching CMS Open Payments ${OP_YEARS[Math.min(6, Math.floor(p * 7))]}`
      : `Checked ${Math.max(1, Math.round(p * 63))} of 63 · ${list[Math.floor(p * (list.length - 1))]}`;
    if (p < 1) requestAnimationFrame(step); else done();
  };
  const done = () => {
    const h = hashStr(q);
    const foot = '<span class="note">Demo result. A live search queries current data.</span>';
    if (kind === 'ses') {
      const type = f.elements.type.value.toLowerCase();
      out.innerHTML = h % 5 === 0
        ? `<div class="ck-head"><b>${safe}</b><span class="chip match">1 possible match</span></div><div class="ck-res"><span><strong>SAM.gov Exclusions</strong> · ${type} · 88% name similarity</span><span>No date of birth to confirm. IntegrityShield would request more data automatically.</span>${foot}</div>`
        : `<div class="ck-head"><b>${safe}</b><span class="chip res">No matches</span></div><div class="ck-res"><span>Checked against <strong>63 sources</strong>, including OIG LEIE, SAM.gov and OFAC.</span>${foot}</div>`;
    } else {
      const vendor = clean(f.elements.vendor.value.trim());
      if (h % 3 === 0) {
        out.innerHTML = `<div class="ck-head"><b>${safe}</b><span class="chip res">No reported payments</span></div><div class="ck-res"><span>No industry payments found for ${clean(f.elements.yr.value).toLowerCase()}.</span>${foot}</div>`;
      } else {
        const n = 2 + h % 6, amt = (h % 90 + 4) * 850;
        const payer = vendor || ['Acme Ortho','Globex Bio','Initech Surgical'][h % 3];
        out.innerHTML = `<div class="ck-head"><b>${safe}</b><span class="chip match">${n} payments found</span></div><div class="ck-res"><span><strong>$${amt.toLocaleString('en-US')}</strong> in reported payments. Largest payer: <strong>${payer}</strong>.</span><span>Consulting fees and travel. Recommended for conflict-of-interest review.</span>${foot}</div>`;
      }
    }
    delete f.dataset.busy;
  };
  requestAnimationFrame(step);
});

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
function initCal(root) {
  const $r = s => root.querySelector(s);
  const days = $r('.cal-days'), title = $r('.cal-mtitle'), slots = $r('.slots'), dayLbl = $r('.cal-dlabel'), pick = $r('.cal-pick');
  const prev = $r('[data-prev]'), next = $r('[data-next]');
  const steps = {pick: $r('[data-step="pick"]'), form: $r('[data-step="form"]'), done: $r('[data-step="done"]')};
  const showStep = s => Object.entries(steps).forEach(([k, el]) => { el.hidden = k !== s; });
  let d = today0();
  do { d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1); } while (!isAvail(d));
  const st = {y: d.getFullYear(), m: d.getMonth(), sel: d, time: null};
  const when = () => `${fmtTime(st.time)} to ${fmtTime(st.time + 30)} ET, ${longDate(st.sel)}`;
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
    slots.innerHTML = slotsFor(st.sel).map(m => `<div class="slot${st.time === m ? ' on' : ''}"><button type="button" class="t" data-m="${m}">${fmtTime(m)}</button>${st.time === m ? '<button type="button" class="nx" data-nx>Next</button>' : ''}</div>`).join('');
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
  });
  $r('[data-again]').addEventListener('click', () => { st.time = null; pick.hidden = true; steps.form.reset(); drawSlots(); showStep('pick'); });
  drawMonth(); drawSlots();
}

/* ---------- pricing ---------- */
const PR = {sol: 'ses', tier: null, bill: 'annual'};
const priceOf = (t, bill) => bill === 'annual' ? Math.round(t.m * (1 - ANNUAL_OFF)) : t.m;
const money = n => '$' + n.toLocaleString('en-US');
function checkoutHTML(sol, bill) {
  const t = PLANS[sol].tiers.find(x => x.k === PR.tier);
  if (!t || !t.m) return '';
  const p = priceOf(t, bill);
  return `<div class="checkout" aria-live="polite"><div><span class="co-l">Your selection</span><h3>${M[sol].name} · ${t.n}</h3><p>${bill === 'annual' ? `${money(p)}/mo, billed annually (${money(p * 12)} per year)` : `${money(p)}/mo, billed monthly`}</p></div><div class="cta-row"><button type="button" class="btn ghost" data-clear>Change plan</button><button type="button" class="btn primary" data-checkout>Continue to checkout</button></div><p class="co-note" hidden>Demo: checkout isn’t connected yet.</p></div>`;
}
function renderPlans(el) {
  if (!el) return;
  const hub = el.dataset.mode === 'hub';
  const sol = hub ? PR.sol : el.dataset.sol;
  const bill = hub ? PR.bill : (el.dataset.period || 'annual');
  el.dataset.period = bill;
  const P = PLANS[sol];
  const pick = hub ? `<div class="solpick" role="tablist" aria-label="Choose a solution">${SOLS.map(s => `<button type="button" role="tab" aria-selected="${s === sol}" class="${s === sol ? 'on' : ''}" data-pick="${s}"><span class="sol-ic">${ICONS[s]}</span><span><b>${M[s].name}</b><small>${M[s].crumb}${M[s].placeholder ? ' · placeholder' : ''}</small></span></button>`).join('')}</div>` : '';
  const tiers = P.tiers.map(t => {
    const ent = !t.m, sel = hub && PR.tier === t.k, p = ent ? 0 : priceOf(t, bill);
    const priceBlock = ent
      ? `<b>Custom</b><span>Tailored to your organization</span>`
      : `<b>${money(p)}<small>/mo</small></b><span>${bill === 'annual' ? `<s>${money(t.m)}</s> · billed annually, ${money(p * 12)}/yr` : 'Billed monthly'}</span>`;
    const btn = ent
      ? `<button type="button" class="btn ghost" data-contact="${sol}">Contact us</button>`
      : `<button type="button" class="btn ${t.pop || sel ? 'primary' : 'ghost'}" data-pay="${t.k}">${sel ? 'Selected' : 'Pay now'}</button>`;
    return `<div class="tier${t.pop ? ' pop' : ''}${ent ? ' ent' : ''}${sel ? ' sel' : ''}">${t.pop ? '<span class="badge">Most popular</span>' : ''}<div><h3>${t.n}</h3></div><p class="tb">${t.blurb}</p><div class="tprice">${priceBlock}</div><ul class="checks sm">${t.f.map(x => `<li>${x}</li>`).join('')}</ul>${btn}</div>`;
  }).join('');
  el.innerHTML = `${pick}<div class="plans-bar"><span class="plans-for">${hub ? `Showing plans for <b>${M[sol].name}</b>` : 'Prices in USD'}${P.placeholder ? ' · placeholder plans' : ''}</span><div class="bill" role="radiogroup" aria-label="Billing period"><button type="button" role="radio" aria-checked="${bill === 'monthly'}" class="${bill === 'monthly' ? 'on' : ''}" data-billing="monthly">Monthly</button><button type="button" role="radio" aria-checked="${bill === 'annual'}" class="${bill === 'annual' ? 'on' : ''}" data-billing="annual">Annually <em>Save 20%</em></button></div></div><div class="tiers">${tiers}</div>${hub && PR.tier ? checkoutHTML(sol, bill) : ''}`;
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-plans]');
  if (!el) return;
  const hub = el.dataset.mode === 'hub';
  const b = e.target.closest('[data-billing]');
  if (b) { el.dataset.period = b.dataset.billing; if (hub) PR.bill = b.dataset.billing; renderPlans(el); return; }
  const s = e.target.closest('[data-pick]');
  if (s) { PR.sol = s.dataset.pick; renderPlans(el); return; }
  const pay = e.target.closest('[data-pay]');
  if (pay) {
    PR.tier = pay.dataset.pay;
    if (hub) renderPlans(el);
    else { PR.sol = el.dataset.sol; PR.bill = el.dataset.period; location.href = U('pricing') + '?sol=' + PR.sol + '&tier=' + PR.tier + '&bill=' + PR.bill; }
    return;
  }
  const c = e.target.closest('[data-contact]');
  if (c) { goTo(c.dataset.contact, '.book'); return; }
  if (e.target.closest('[data-clear]')) { PR.tier = null; renderPlans(el); return; }
  if (e.target.closest('[data-checkout]')) { const n = el.querySelector('.co-note'); if (n) n.hidden = false; }
});

/* ---------- logo (from sure-shield.com) ---------- */
const LOGO = 'data:image/png;base64,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';
$$('.logo-img').forEach(img => img.src = LOGO);

/* ---------- init ---------- */
{ const q = new URLSearchParams(location.search); if (M[q.get('sol')]) PR.sol = q.get('sol'); if (q.get('tier')) PR.tier = q.get('tier'); if (q.get('bill')) PR.bill = q.get('bill'); }
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
    <div class="cta-row"><a class="btn primary sm" href="#contact" data-close>Contact the team</a></div>`;
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
const EMAIL_OK = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
document.addEventListener('submit', e => {
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
    if (!f.elements.msg.value.trim()) miss.push('a message');
  }
  if (miss.length) { err.textContent = 'Add ' + miss.join(', ').replace(/, ([^,]*)$/, ' and $1') + '.'; err.hidden = false; return; }
  err.hidden = true;
  if (wf) {
    const v = (f.querySelector('input[type=radio]:checked') || f.elements.session || {}).value || 'ses';
    const names = {ses: 'Sanctions & exclusion screening', coi: 'Conflict of interest monitoring', both: 'Both sessions'};
    const done = $('.web-done', f.closest('.web-card'));
    $('.wd-t', done).textContent = `${names[v]}. We’ll email the date and joining link to ${f.elements.email.value.trim()}.`;
    f.hidden = true; done.hidden = false;
  } else {
    const done = $('.cdone', f.closest('.cform-wrap'));
    $('.cd-t', done).textContent = `Topic: ${f.elements.topic.value}. We’d reply to ${f.elements.email.value.trim()}.`;
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
const FILM_LEN = 30;
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
  if (on === fOn) return;
  fOn = on;
  const v = $('#introVideo');
  if (v) { if (on) v.play().catch(() => {}); else v.pause(); return; }
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
  filmPlay(true);
}
function filmClose() {
  clearTimeout(fEndT);
  filmPlay(false);
  film.classList.remove('ended');
  fElapsed = 0; fPaint(); const v = $('#introVideo'); if (v) v.currentTime = 0;
  filmFlip(() => { film.classList.remove('playing'); if (heroGrid) heroGrid.classList.remove('vplay'); });
}
$('#filmPlay').addEventListener('click', filmOpen);
$('#filmClose').addEventListener('click', filmClose);
const iv = $('#introVideo'); if (iv) iv.addEventListener('ended', () => { fOn = false; film.classList.add('ended'); filmAutoClose(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && film.classList.contains('playing')) filmClose(); });
new IntersectionObserver(es => es.forEach(en => {
  if (!film.classList.contains('playing') || film.classList.contains('ended')) return;
  filmPlay(en.isIntersecting && route === 'home');
}), {threshold: .35}).observe(fCard);
/* ---------- CSS 3D scenes ---------- */
const S3W = {catalog: 720, sieve: 520, web: 470, dom: 500};
const stand = (x, y, len, h, ang, cls = '', inner = '') => `<div class="s3-st ${cls}" style="left:${x}px;top:${y - h}px;width:${len}px;height:${h}px;transform:rotateZ(${ang}deg) rotateX(-90deg)">${inner}</div>`;
const box = (w, d, h, cls = '', top = '') => `<div class="s3-box ${cls}" style="--w:${w}px;--d:${d}px;--h:${h}px"><i class="fw"></i><i class="ff"></i><i class="ft">${top}</i></div>`;
/* labels live in a flat overlay; each follows a 1px anchor inside the 3D world */
let S3L = [];
const bb = (x, y, z, inner, cls = '') => { S3L.push([inner, cls]); return `<i class="s3-anc" data-a="${S3L.length - 1}" style="left:${x}px;top:${y}px;transform:translateZ(${z}px)"></i>`; };
const ovHTML = () => `<div class="s3-ov" aria-hidden="true">${S3L.map(([inner, cls], i) => `<div class="s3-o ${cls}" data-o="${i}">${inner}</div>`).join('')}</div>`;
const S3B = {
  catalog() {
    const ST = [['ses', 'HSES', 'Healthcare Sanctions & Exclusions Screening', -105], ['coi', 'COI Screening', 'Your providers checked against your vendors', 5], ['licensure', 'LCM', 'Licensure & credentials live checks', 115]];
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
    const names = ['SAM.gov', 'OFAC SDN', 'OIG LEIE', 'TX HHSC-OIG', 'NY OMIG', '+58 state lists'];
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
      paths += `<path class="${hot ? 'hot' : ''}" d="${d}" style="--len:400;transition-delay:${i * 140}ms"/>`;
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
  dom() {
    const C = [['RN', 'GA', 'ok'], ['MD', 'TX', 'soon'], ['PT', 'FL', 'ok'], ['APRN', 'NC', 'down'], ['DEA', 'GA', 'ok'], ['LPN', 'OH', 'soon'], ['PA', 'NY', 'ok']];
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
  card.querySelector('.wnx-demo').hidden = open.hidden;
  if (!open.hidden) { const i = open.querySelector('input:not([type=hidden])'); if (i) setTimeout(() => i.focus({preventScroll: true}), 50); }
});
document.addEventListener('submit', e => {
  const f = e.target.closest('.wnx-alert');
  if (!f) return;
  e.preventDefault();
  const v = f.elements.email.value.trim(), err = f.querySelector('.err');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { err.textContent = 'Add a work email.'; err.hidden = false; return; }
  err.hidden = true; f.hidden = true; f.parentElement.querySelector('.wnx-done').hidden = false;
});

/* ---------- opening scene ---------- */
function heroReveal() { document.documentElement.classList.remove('intro-hold'); $$('#ticks i').forEach(i => i.classList.remove('on')); fillTicks(); }
const intro = $('#intro'), ROOT = document.documentElement, ixSlot = $('#ixSlot');
const IX_ITEMS = ['surprise audits', 'manual list checks', 'monthly blind spots', 'false-match floods'];
const IX_TOKENS = ['A. DOE', 'CLEAR', 'ACME LINEN', 'SAM.GOV', 'S. ROE', 'OFAC SDN', 'P. EXAMPLE', 'TX HHSC-OIG', 'GLOBEX COURIER', 'CLEAR', 'C. DOE', 'NY OMIG', 'K. SAMPLE', 'OIG LEIE', 'INITECH SUPPLY', 'CLEAR', 'J. TEST', 'OH MEDICAID', 'L. ROE', 'CMS OPEN PAYMENTS', 'J. EXAMPLE', 'CLEAR'];
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
