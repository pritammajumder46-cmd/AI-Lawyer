/* ============================================================
   AI LAWYER - Core Data
   data.js - Lawyers, Case Law, Constitution, Courts, Config
   Loaded before app.js
   ============================================================ */

const DATA_VERSION = "1.4.2";
const DATA_LAST_UPDATED = "2026-08-10";

/* ============ Practice Categories ============ */
const CATEGORIES = [
    { id: "all", name: "All Areas", icon: "fa-gavel" },
    { id: "criminal", name: "Criminal Law", icon: "fa-gavel", color: "#dc2626" },
    { id: "civil", name: "Civil Law", icon: "fa-scale-balanced", color: "#2563eb" },
    { id: "family", name: "Family Law", icon: "fa-people-roof", color: "#16a34a" },
    { id: "corporate", name: "Corporate Law", icon: "fa-building", color: "#7c3aed" },
    { id: "constitutional", name: "Constitutional Law", icon: "fa-landmark", color: "#1e3a8a" },
    { id: "consumer", name: "Consumer Protection", icon: "fa-cart-shopping", color: "#ea580c" },
    { id: "labor", name: "Labor & Employment", icon: "fa-industry", color: "#0891b2" },
    { id: "tax", name: "Taxation", icon: "fa-file-invoice-dollar", color: "#ca8a04" },
    { id: "ipr", name: "Intellectual Property", icon: "fa-copyright", color: "#db2777" },
    { id: "environment", name: "Environmental", icon: "fa-leaf", color: "#65a30d" }
];

const CASE_TYPE_STATS = [
    { category: "criminal", cases: 18420, winRate: 62, avgDuration: "14 mo", label: "Criminal Law" },
    { category: "civil", cases: 22310, winRate: 58, avgDuration: "21 mo", label: "Civil Law" },
    { category: "family", cases: 9865, winRate: 71, avgDuration: "9 mo", label: "Family Law" },
    { category: "corporate", cases: 7432, winRate: 76, avgDuration: "12 mo", label: "Corporate Law" },
    { category: "constitutional", cases: 2894, winRate: 55, avgDuration: "28 mo", label: "Constitutional" },
    { category: "consumer", cases: 12450, winRate: 83, avgDuration: "7 mo", label: "Consumer Protection" },
    { category: "labor", cases: 6120, winRate: 68, avgDuration: "16 mo", label: "Labor & Employment" },
    { category: "tax", cases: 3712, winRate: 64, avgDuration: "24 mo", label: "Taxation" },
    { category: "ipr", cases: 2876, winRate: 69, avgDuration: "18 mo", label: "Intellectual Property" },
    { category: "environment", cases: 1450, winRate: 52, avgDuration: "30 mo", label: "Environmental" }
];

/* ============ Lawyers ============ */
const LAWYERS = [
    {
        id: "lw-001", name: "Adv. Rajesh Sharma", type: "private",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh",
        categories: ["criminal", "civil"],
        location: { city: "New Delhi", state: "Delhi", area: "Tis Hazari Courts", pin: "110054" },
        experience: 18, rating: 4.8, reviewCount: 342,
        qualifications: ["LL.B - Faculty of Law, DU (2005)", "LL.M - Criminal Law, NLSIU Bangalore (2007)", "PG Diploma - Forensic Science"],
        specializations: ["Criminal Defense", "Bail Applications", "NDPS Cases", "Cyber Crime", "White Collar Crime"],
        barCouncil: "Bar Council of Delhi - D/3149/2005",
        languages: ["English", "Hindi", "Punjabi"],
        bio: "Senior criminal defense advocate with 18 years of experience arguing before the Delhi High Court and Supreme Court. Known for strategic bail arguments and meticulous trial preparation. Former Additional Public Prosecutor contributes unmatched insight into prosecution tactics.",
        fees: {
            consultation: { amount: 2500, note: "First consultation (30 mins)" },
            hearing: { amount: 5500, note: "Per hearing appearance" },
            retainer: { amount: 150000, note: "Annual retainer for corporates" },
            contingency: { amount: null, note: "Case value (negotiable)" },
            document: { amount: 8000, note: "Drafting & filing" }
        },
        slots: [4, 6, 2, 5, 3, 7, 0],
        availabilityStatus: "online",
        reviews: [
            { name: "Manish Verma", category: "Criminal Defense", rating: 5, date: "2026-07-18", text: "Got anticipatory bail granted in 9 days. Extremely professional and transparent about every step." },
            { name: "Priya Nair", category: "NDPS Case", rating: 5, date: "2026-06-30", text: "Handled my brother's drug case with great sensitivity. Court outcomes were excellent." },
            { name: "Rohit Gupta", category: "Cheating Case", rating: 4, date: "2026-05-12", text: "Very knowledgeable. Fees slightly on the higher side but worth the results." },
            { name: "Sunita Kaur", category: "Domestic Violence", rating: 5, date: "2026-03-25", text: "Went above and beyond. Kept me informed on every hearing without fail." }
        ]
    },
    {
        id: "lw-002", name: "Adv. Hari Sankar Roy", type: "private",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera",
        categories: ["family", "civil"],
        location: { city: "Mumbai", state: "Maharashtra", area: "Mumbai High Court", pin: "400032" },
        experience: 14, rating: 4.9, reviewCount: 518,
        qualifications: ["LL.B - Government Law College, Mumbai (2009)", "LL.M - Family Law, GLC Mumbai (2011)", "Certificate - Mediation & Arbitration"],
        specializations: ["Divorce & Separation", "Child Custody", "Maintenance", "Domestic Violence", "Succession & Wills"],
        barCouncil: "Bar Council of Maharashtra & Goa - Mah/7321/2009",
        languages: ["English", "Hindi", "Marathi", "Malayalam"],
        bio: "Compassionate family lawyer with over 500 successful family matters. Certified mediator who resolves 4 out of 10 cases through mediation without court proceedings. Trusted advisor for high-net-worth divorce settlements.",
        fees: {
            consultation: { amount: 3000, note: "First consultation (45 mins)" },
            hearing: { amount: 4500, note: "Per hearing appearance" },
            retainer: { amount: 120000, note: "Annual retainer" },
            contingency: { amount: null, note: "Not available" },
            document: { amount: 6000, note: "Petition drafting & filing" }
        },
        slots: [3, 5, 4, 2, 6, 0, 3],
        availabilityStatus: "today",
        reviews: [
            { name: "Amita Deshpande", category: "Divorce", rating: 5, date: "2026-07-22", text: "Handled my contested divorce with dignity and won a fair settlement. Forever grateful." },
            { name: "Karthik Menon", category: "Child Custody", rating: 5, date: "2026-06-11", text: "Custody of my daughter granted in 4 months. Clearly the best family lawyer in Mumbai." },
            { name: "Falguni Shah", category: "Maintenance", rating: 5, date: "2026-04-19", text: "Corrected an unfair maintenance order from a lower court. Very thorough." },
            { name: "Nikhil Joshi", category: "Succession", rating: 4, date: "2026-02-28", text: "Wills and succession handled cleanly. Would recommend for estate matters." }
        ]
    },
    {
        id: "lw-003", name: "Adv. Souvik Bose", type: "government",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anil",
        categories: ["constitutional", "criminal"],
        location: { city: "Hyderabad", state: "Telangana", area: "Telangana High Court", pin: "500066" },
        experience: 22, rating: 4.6, reviewCount: 198,
        qualifications: ["LL.B - Osmania University (2001)", "LL.M - Constitutional Law (2003)", "PG Diploma - Public Policy"],
        specializations: ["Constitutional Challenges", "Criminal Appeals", "Writ Petitions", "Service Matters", "State Defence"],
        barCouncil: "Bar Council of Telangana - TS/4112/2001",
        languages: ["English", "Hindi", "Telugu"],
        bio: "Government Pleader representing the State of Telangana in constitutional matters. 22 years of public service experience including defence of state legislation and criminal appeals at High Court level.",
        fees: {
            consultation: { amount: 1500, note: "Reduced for senior citizens & EWS" },
            hearing: { amount: 3500, note: "Per hearing appearance" },
            retainer: { amount: null, note: "Government assignment" },
            contingency: { amount: null, note: "Not applicable" },
            document: { amount: 5000, note: "Writ filing & drafting" }
        },
        slots: [2, 3, 1, 4, 2, 5, 0],
        availabilityStatus: "week",
        reviews: [
            { name: "B. Srinivas", category: "Service Matter", rating: 5, date: "2026-06-02", text: "Clear guidance on departmental appeal process. Documentation was impeccable." },
            { name: "R. Lakshmi", category: "Writ Petition", rating: 4, date: "2026-04-08", text: "Helped understand state rules. Very busy due to government duties but responsive." },
            { name: "Varma Family", category: "Criminal Appeal", rating: 4, date: "2026-01-15", text: "Professional handling of our appeal. Fees were modest and transparent." }
        ]
    },
    {
        id: "lw-004", name: "Adv. Ankita Adhikary", type: "private",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        categories: ["corporate", "ipr"],
        location: { city: "Bengaluru", state: "Karnataka", area: "Koramangala", pin: "560034" },
        experience: 11, rating: 4.7, reviewCount: 264,
        qualifications: ["BA LL.B (Hons) - NLSIU Bangalore (2012)", "LL.M - Corporate Law, LSE London (2014)"],
        specializations: ["M&A", "Startup Advisory", "Contract Drafting", "Trademarks", "Commercial Litigation"],
        barCouncil: "Bar Council of Karnataka - KA/2876/2012",
        languages: ["English", "Hindi", "Kannada", "Tamil"],
        bio: "Corporate lawyer serving 200+ startups and established companies. Expert in founder agreements, ESOP structures, fundraising rounds, and trademark portfolio management. Practical advice with flat-fee predictability.",
        fees: {
            consultation: { amount: 3500, note: "Business consultation (45 mins)" },
            hearing: { amount: 6000, note: "Per hearing appearance" },
            retainer: { amount: 200000, note: "Monthly business retainer from 25,000" },
            contingency: { amount: null, note: "Milestone-based for commercial disputes" },
            document: { amount: 12000, note: "Complex contract drafting" }
        },
        slots: [5, 4, 6, 3, 5, 2, 1],
        availabilityStatus: "online",
        reviews: [
            { name: "Rahul Bansal", category: "Startup Funding", rating: 5, date: "2026-07-28", text: "Closed our Series A in 6 weeks. Cap table and term sheet review were flawless." },
            { name: "Divya Ramachandran", category: "Trademark", rating: 5, date: "2026-06-15", text: "Registered 14 trademarks across classes without a single objection." },
            { name: "TechNest Founders", category: "M&A", rating: 4, date: "2026-03-30", text: "Steered a complex acquisition. Communication could be quicker during hearings." }
        ]
    },
    {
        id: "lw-005", name: "Adv. Sreeja Ghosh", type: "private",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jaspreet",
        categories: ["criminal", "consumer"],
        location: { city: "Ludhiana", state: "Punjab", area: "Ludhiana District Court", pin: "141001" },
        experience: 9, rating: 4.5, reviewCount: 187,
        qualifications: ["LL.B - Panjab University (2014)", "PG Diploma - Consumer Protection Law"],
        specializations: ["Bail Matters", "Consumer Complaints", "Cheque Bounce (138)", "Motor Accident Claims", "Trial Advocacy"],
        barCouncil: "Bar Council of Punjab & Haryana - PB/5893/2014",
        languages: ["English", "Hindi", "Punjabi"],
        bio: "Trial-centric advocate known for high success on cheque bounce and consumer forum matters. Transparent fee schedule with EMI option for client convenience. Appears daily at Ludhiana District Courts.",
        fees: {
            consultation: { amount: 1500, note: "First consultation" },
            hearing: { amount: 2500, note: "Per hearing appearance" },
            retainer: { amount: 60000, note: "Annual case-pack for SMEs" },
            contingency: { amount: 10, note: "10% of recovered amount for recovery matters" },
            document: { amount: 3500, note: "Legal notice & drafting" }
        },
        slots: [6, 5, 4, 3, 6, 5, 2],
        availabilityStatus: "online",
        reviews: [
            { name: "Harpreet Singh", category: "Cheque Bounce", rating: 5, date: "2026-07-05", text: "Recovered 8.4 lakh. Contingency fee made it easy to start the case." },
            { name: "Simran Kaur", category: "Consumer Forum", rating: 5, date: "2026-05-22", text: "Refund of full flat booking amount with interest. Brilliant drafting." },
            { name: "Gurpreet Gill", category: "Bail", rating: 4, date: "2026-03-14", text: "Regular bail granted within a month. Fees very reasonable for the quality." }
        ]
    },
    {
        id: "lw-006", name: "Adv. Misti Sarkar", type: "pro-bono",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=farhan",
        categories: ["constitutional", "labor"],
        location: { city: "Lucknow", state: "Uttar Pradesh", area: "Allahabad HC (Lucknow Bench)", pin: "226010" },
        experience: 12, rating: 4.9, reviewCount: 96,
        qualifications: ["LL.B - Lucknow University (2011)", "LL.M - Labour Law (2013)", "Certified Rights Activist"],
        specializations: ["Writ Petitions", "Labour Rights", "SC/ST Atrocities Act", "Right to Information", "PIL Litigation"],
        barCouncil: "Bar Council of UP - UP/9145/2011",
        languages: ["English", "Hindi", "Urdu"],
        bio: "Public interest litigator offering pro bono services to workers, minorities and marginalized communities. 60% of practice devoted to free legal aid; listed with National Legal Services Authority (NALSA) emergency helpline 15100.",
        fees: {
            consultation: { amount: 0, note: "FREE - NALSA empanelled" },
            hearing: { amount: 0, note: "FREE for eligible clients (BPL certificate)" },
            retainer: { amount: null, note: "Not applicable" },
            contingency: { amount: null, note: "No fee for relief received" },
            document: { amount: 0, note: "Pro bono filing support" }
        },
        slots: [6, 0, 5, 4, 6, 3, 4],
        availabilityStatus: "today",
        reviews: [
            { name: "Mumtaz Begum", category: "Labour Rights", rating: 5, date: "2026-07-30", text: "Got my husband's 6-month withheld wages released without a single rupee charged." },
            { name: "Cooperative Society", category: "RTI", rating: 5, date: "2026-05-02", text: "Fought for our housing colony rights for 2 years. True public servant." },
            { name: "NGO Aagaaz", category: "PIL", rating: 5, date: "2026-01-20", text: "Pro bono PIL that changed district drinking water policy. Extraordinary human being." }
        ]
    },
    {
        id: "lw-007", name: "Adv. Amrita Das", type: "private",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=venkatesh",
        categories: ["tax", "corporate"],
        location: { city: "Chennai", state: "Tamil Nadu", area: "Madras High Court", pin: "600104" },
        experience: 20, rating: 4.7, reviewCount: 221,
        qualifications: ["LL.B - Madras Law College (2003)", "CA (Inter) - ICAI", "LL.M - Taxation Laws"],
        specializations: ["Income Tax Appeals", "GST Litigation", "Customs & Excise", "Transfer Pricing", "Wealth & Estate Planning"],
        barCouncil: "Bar Council of Tamil Nadu - TN/7654/2003",
        languages: ["English", "Tamil", "Telugu", "Sanskrit"],
        bio: "Tax litigator with dual qualification in law and accountancy. Success rate of 78% before ITAT and 65% before High Court in tax matters. Prefers negotiated settlements to minimize client costs.",
        fees: {
            consultation: { amount: 3000, note: "Tax consultation (45 mins)" },
            hearing: { amount: 6000, note: "Per appearance before ITAT/HC" },
            retainer: { amount: 100000, note: "Annual tax compliance retainer" },
            contingency: { amount: null, note: "Not offered for tax matters" },
            document: { amount: 15000, note: "Appeal drafting & filing" }
        },
        slots: [3, 2, 4, 5, 2, 3, 1],
        availabilityStatus: "week",
        reviews: [
            { name: "Tata Consultancy Ltd", category: "Service Tax", rating: 5, date: "2026-06-25", text: "Saved 1.2 crore in wrongly levied duty. Excellent command of case law." },
            { name: "M. Subramanian", category: "Income Tax Appeal", rating: 4, date: "2026-04-17", text: "Appeal allowed at ITAT. Process took time but result was worth it." },
            { name: "Ramya Krishnan", category: "GST", rating: 5, date: "2026-02-09", text: "Handled stuck input tax credit refund within 6 months of filing." }
        ]
    },
    {
        id: "lw-008", name: "Adv. Neha Agarwal", type: "private",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=neha",
        categories: ["consumer", "civil"],
        location: { city: "Jaipur", state: "Rajasthan", area: "District Consumer Forum", pin: "302006" },
        experience: 8, rating: 4.6, reviewCount: 143,
        qualifications: ["BA LL.B - MNLU Jodhpur (2015)", "PG Diploma - Consumer & Competition Law"],
        specializations: ["Consumer Forums", "Real Estate Disputes", "Insurance Claims", "Medical Negligence", "Deficiency of Services"],
        barCouncil: "Bar Council of Rajasthan - RJ/3327/2015",
        languages: ["English", "Hindi", "Marwari"],
        bio: "Consumer rights specialist with 90%+ success across National and State Consumer Forums. Specializes in builder delay, insurance claim repudiation, and medical negligence. Transparent 'success-fee' structured billing.",
        fees: {
            consultation: { amount: 1000, note: "First consultation (30 mins)" },
            hearing: { amount: 2000, note: "Per hearing appearance" },
            retainer: { amount: null, note: "Not offered" },
            contingency: { amount: 12, note: "12% of awarded compensation (optional)" },
            document: { amount: 4000, note: "Complaint drafting & filing" }
        },
        slots: [5, 4, 3, 6, 5, 2, 0],
        availabilityStatus: "online",
        reviews: [
            { name: "Builder Victims Group", category: "Real Estate", rating: 5, date: "2026-07-12", text: "Led a 40-member builder dispute to a 7 crore compensation award." },
            { name: "Kamal Joshi", category: "Medical Negligence", rating: 5, date: "2026-05-28", text: "Hospital settled after our strong evidence preparation. Outstanding." },
            { name: "Reena Sharma", category: "Insurance Claim", rating: 4, date: "2026-03-19", text: "Rejected claim overturned with 12% interest. Kept us informed throughout." }
        ]
    },
    {
        id: "lw-009", name: "Adv. Dev Prakash Mishra", type: "government",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
        categories: ["civil", "criminal"],
        location: { city: "Patna", state: "Bihar", area: "Patna High Court", pin: "800001" },
        experience: 16, rating: 4.2, reviewCount: 76,
        qualifications: ["LL.B - Patna Law College (2007)", "PG Diploma - Cyber Law"],
        specializations: ["Civil Appeals", "State Revenue Cases", "Criminal Trials", "Preventive Detention", "Cyber Crime"],
        barCouncil: "Bar Council of Bihar - BR/4206/2007",
        languages: ["English", "Hindi", "Bhojpuri"],
        bio: "Deputy Government Advocate, Bihar. Handles state revenue recovery and civil appeals before Patna High Court. Maintains fixed office hours for collegiate legal advice at subsidized rates.",
        fees: {
            consultation: { amount: 2000, note: "Consultation with document review" },
            hearing: { amount: 3000, note: "Per hearing appearance" },
            retainer: { amount: 90000, note: "Corporate state-practice retainer" },
            contingency: { amount: null, note: "Not applicable" },
            document: { amount: 6000, note: "Appeal & reply drafting" }
        },
        slots: [3, 2, 0, 2, 3, 4, 1],
        availabilityStatus: "week",
        reviews: [
            { name: "Bihar Builders Assn", category: "Revenue Case", rating: 4, date: "2026-05-09", text: "Stable and experienced counsel for revenue matters." },
            { name: "S. Prasad", category: "Civil Suit", rating: 4, date: "2026-02-22", text: "Honest assessment of case prospects upfront. Appreciated the transparency." },
            { name: "NGO Savera", category: "Consultation", rating: 3, date: "2025-11-30", text: "Knowledgeable but availability limited on court-heavy weeks." }
        ]
    },
    {
        id: "lw-010", name: "Adv. Ishita Banerjee", type: "private",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ishita",
        categories: ["ipr", "corporate"],
        location: { city: "Kolkata", state: "West Bengal", area: "Calcutta High Court", pin: "700001" },
        experience: 13, rating: 4.8, reviewCount: 205,
        qualifications: ["BA LL.B (Hons) - NUJS Kolkata (2010)", "LL.M - IP Law, WIPO Academy Geneva"],
        specializations: ["Patents", "Trademarks & GI", "Copyright Infringement", "Licensing", "Domain Disputes (UDRP)"],
        barCouncil: "Bar Council of West Bengal - WB/6831/2010",
        languages: ["English", "Hindi", "Bengali"],
        bio: "IP litigator with successes in landmark pharmaceutical patents and heritage GI tags. Drafts robust IP strategies for inventors and artists. Member of INTA and APAA.",
        fees: {
            consultation: { amount: 2500, note: "IP strategy consultation" },
            hearing: { amount: 5000, note: "Per hearing appearance" },
            retainer: { amount: 150000, note: "Portfolio management (12+ filings)" },
            contingency: { amount: null, note: "Not offered" },
            document: { amount: 20000, note: "Patent specification drafting" }
        },
        slots: [4, 3, 5, 2, 4, 3, 2],
        availabilityStatus: "online",
        reviews: [
            { name: "Inventor R. Dutta", category: "Patent", rating: 5, date: "2026-07-20", text: "PCT application filed flawlessly. Explained the entire claims strategy in plain language." },
            { name: "Bengal Handlooms", category: "GI Tag", rating: 5, date: "2026-06-03", text: "Won GI infringement case for our heritage weaves. Deep respect for her." },
            { name: "MediaHouse Pvt Ltd", category: "Copyright", rating: 4, date: "2026-03-08", text: "Registered copyrights across 200 works in 3 months." }
        ]
    },
    {
        id: "lw-011", name: "Adv. Mohanlal Menon", type: "private",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohanlal",
        categories: ["environment", "civil"],
        location: { city: "Kochi", state: "Kerala", area: "Kochi Munsiff Court", pin: "682031" },
        experience: 15, rating: 4.7, reviewCount: 158,
        qualifications: ["LL.B - Government Law College, Kochi (2008)", "PG Diploma - Environmental Law, CEP"],
        specializations: ["Environmental Impact", "Pollution Cases", "Coastal Regulation", "Water Disputes", "Land Acquisition"],
        barCouncil: "Bar Council of Kerala - KL/5290/2008",
        languages: ["English", "Malayalam", "Tamil", "Hindi"],
        bio: "Environmental law practitioner known for representing fishing and farming communities against polluting industries, plus a decade of land acquisition compensation victories. Associated with NGT regional circuit.",
        fees: {
            consultation: { amount: 2000, note: "First consultation (40 mins)" },
            hearing: { amount: 4000, note: "Per hearing appearance" },
            retainer: { amount: 80000, note: "Community & NGO retainer" },
            contingency: { amount: 8, note: "8% on enhanced compensation" },
            document: { amount: 5000, note: "Petition & objections drafting" }
        },
        slots: [5, 4, 4, 3, 5, 2, 0],
        availabilityStatus: "today",
        reviews: [
            { name: "Fisherfolk Co-op", category: "NGT Case", rating: 5, date: "2026-06-14", text: "Halted the discharge polluting our backwaters. A voice for our community." },
            { name: "A. Pillai", category: "Land Acquisition", rating: 5, date: "2026-04-04", text: "Compensation increased from 38L to 72L through his appeal." },
            { name: "GreenKerala", category: "PIL", rating: 4, date: "2026-01-27", text: "Committed counsel for environmental causes." }
        ]
    },
    {
        id: "lw-012", name: "Adv. Rashmi Saxena", type: "private",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rashmi",
        categories: ["family", "criminal"],
        location: { city: "Kanpur", state: "Uttar Pradesh", area: "Kanpur District Court", pin: "208001" },
        experience: 7, rating: 4.4, reviewCount: 121,
        qualifications: ["BA LL.B - Chhatrapati Shahu Ji Maharaj University (2016)"],
        specializations: ["Dowry & 498A", "Maintenance", "Restitution of Conjugal Rights", "Juvenile Justice", "Protection of Women"],
        barCouncil: "Bar Council of UP - UP/10248/2016",
        languages: ["English", "Hindi"],
        bio: "Young but fierce advocate for women's legal rights. Counsels for reconciliation-first approach and maintains a 24-hour helpline for distressed women. Handles both family and related penal matters.",
        fees: {
            consultation: { amount: 800, note: "First consultation (30 mins)" },
            hearing: { amount: 1800, note: "Per hearing appearance" },
            retainer: { amount: 30000, note: "Full-case annual plan" },
            contingency: { amount: null, note: "Not offered" },
            document: { amount: 2200, note: "Petition drafting & filing" }
        },
        slots: [6, 5, 5, 4, 6, 3, 2],
        availabilityStatus: "online",
        reviews: [
            { name: "Kavita Devi", category: "498A Matter", rating: 5, date: "2026-07-25", text: "She answered my midnight call when no one else would. A true shield." },
            { name: "Shalini Gupta", category: "Maintenance", rating: 4, date: "2026-05-16", text: "Interim maintenance secured in first hearing. Empathetic but firm." },
            { name: "Nandini T.", category: "Divorce", rating: 4, date: "2026-02-02", text: "Mutual consent divorce quickly processed after she negotiated terms." }
        ]
    },
    {
        id: "lw-013", name: "Adv. Suresh Chandra Patil", type: "pro-bono",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=suresh",
        categories: ["labor", "civil"],
        location: { city: "Nagpur", state: "Maharashtra", area: "Nagpur District Court", pin: "440001" },
        experience: 24, rating: 4.6, reviewCount: 88,
        qualifications: ["LL.B - Amravati University (1999)", "LL.M - Labour Law (2001)"],
        specializations: ["Industrial Disputes", "Wrongful Termination", "ESI & PF Litigation", "Minimum Wages Act", "Trade Union Issues"],
        barCouncil: "Bar Council of Maharashtra & Goa - Mah/2844/1999",
        languages: ["English", "Hindi", "Marathi"],
        bio: "Veteran labour rights lawyer. Represented 3,000+ workers in industrial disputes. Half of practice dedicated to pro bono via trade unions and legal aid clinics. Institution in the Nagpur industrial belt.",
        fees: {
            consultation: { amount: 500, note: "Nominal consultation" },
            hearing: { amount: 1500, note: "Subsidized per hearing" },
            retainer: { amount: 40000, note: "Union retainer" },
            contingency: { amount: 0, note: "FREE for industrial workers" },
            document: { amount: 1500, note: "Subsidized drafting" }
        },
        slots: [3, 4, 2, 5, 3, 4, 1],
        availabilityStatus: "week",
        reviews: [
            { name: "Textile Workers Union", category: "Industrial Dispute", rating: 5, date: "2026-06-19", text: "Won back pay for 1,100 workers. Sixty-two years old and still fighting for us." },
            { name: "Ganesh Bagde", category: "Wrongful Termination", rating: 5, date: "2026-04-11", text: "Reinstated with continuity of service. He charged us nothing." },
            { name: "Midland Factory", category: "PF Litigation", rating: 4, date: "2026-01-31", text: "Provident fund dues recovered for 300 workers." }
        ]
    },
    {
        id: "lw-014", name: "Adv. Tanmay Roy", type: "private",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tanmay",
        categories: ["corporate", "tax"],
        location: { city: "Gurugram", state: "Haryana", area: "DLF Phase 2, Gurugram", pin: "122002" },
        experience: 10, rating: 4.5, reviewCount: 142,
        qualifications: ["BA LL.B - Symbiosis Law School (2013)", "LL.M - International Taxation, NALSAR (2015)"],
        specializations: ["Insolvency (IBC)", "Arbitration", "GST & Indirect Tax", "Foreign Investment", "Commercial Arbitration"],
        barCouncil: "Bar Council of Punjab & Haryana - HR/3301/2013",
        languages: ["English", "Hindi", "Bengali"],
        bio: "Young commercial disputes counsel focused on NCLT insolvency and arbitration. Handles disputes valued over 500 crore. No-nonsense, timeline-driven practice with weekly client briefings.",
        fees: {
            consultation: { amount: 4000, note: "Commercial consultation (45 mins)" },
            hearing: { amount: 8000, note: "Per hearing before NCLT/Arbitral" },
            retainer: { amount: 250000, note: "Corporate retainer" },
            contingency: { amount: 15, note: "15% of disputed recovery (select matters)" },
            document: { amount: 18000, note: "Arbitration/insolvency filings" }
        },
        slots: [4, 5, 3, 4, 5, 2, 0],
        availabilityStatus: "online",
        reviews: [
            { name: "Vertex Infra Ltd", category: "IBC Resolution", rating: 5, date: "2026-07-16", text: "Resolution plan worth 340 crore approved. Exceptionally prepared." },
            { name: "QuickPay Fintech", category: "Arbitration", rating: 4, date: "2026-04-23", text: "Awarded full claim with costs. He fights every comma correctly." },
            { name: "Goyal Logistics", category: "GST", rating: 4, date: "2026-02-14", text: "Reduced penalty exposure by 70% in a tight statutory timeline." }
        ]
    },
    {
        id: "lw-015", name: "Adv. Kamala Devi", type: "government",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kamala",
        categories: ["consumer", "family"],
        location: { city: "Madurai", state: "Tamil Nadu", area: "Madurai District Court", pin: "625020" },
        experience: 13, rating: 4.3, reviewCount: 67,
        qualifications: ["LL.B - Madurai Kamaraj University (2010)", "Certificate - Legal Aid Administration"],
        specializations: ["Legal Aid", "Consumer Forums", "Family Counselling", "Free Legal Clinics", "SC/ST Claim Cases"],
        barCouncil: "Bar Council of Tamil Nadu - TN/5588/2010",
        languages: ["English", "Tamil"],
        bio: "District Legal Services Authority panel lawyer distributing free legal services in Madurai district. Runs weekly legal clinics at three taluk offices. Government-empanelled with strict compliance record.",
        fees: {
            consultation: { amount: 0, note: "FREE under DLSA panel" },
            hearing: { amount: 0, note: "FREE for BPL & subsidized for others" },
            retainer: { amount: null, note: "Not applicable" },
            contingency: { amount: null, note: "Not applicable" },
            document: { amount: 500, note: "Admin cost only" }
        },
        slots: [5, 3, 4, 2, 5, 0, 3],
        availabilityStatus: "today",
        reviews: [
            { name: "M. Eswari", category: "Legal Aid", rating: 5, date: "2026-06-27", text: "Fought my mother's pension case for free and we won before the tribunal." },
            { name: "Panchayat Union", category: "Consumer", rating: 4, date: "2026-04-01", text: "Genuinely helpful counsel for pensioners' consumer issues." },
            { name: "District SC Association", category: "Claim Case", rating: 4, date: "2026-01-18", text: "Reliable government empanelled counsel." }
        ]
    },
    {
        id: "lw-016", name: "Adv. Pankaj Bhatt", type: "private",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pankaj",
        categories: ["criminal", "constitutional"],
        location: { city: "Ahmedabad", state: "Gujarat", area: "Gujarat High Court", pin: "380009" },
        experience: 17, rating: 4.6, reviewCount: 174,
        qualifications: ["LL.B - Gujarat University (2006)", "LL.M - Constitutional Governance (2008)"],
        specializations: ["Criminal Appeals", "Anticipatory Bail", "Cruelty Cases", "Habeas Corpus", "Media Trial Law"],
        barCouncil: "Bar Council of Gujarat - GJ/4890/2006",
        languages: ["English", "Hindi", "Gujarati"],
        bio: "High Court criminalist specializing in appeals and anticipatory bail. Known for fast-track disposals: average bail grant under 21 days. Media-savvy yet discreet - protects client privacy rigorously.",
        fees: {
            consultation: { amount: 2000, note: "First consultation (30 mins)" },
            hearing: { amount: 4500, note: "Per hearing at High Court" },
            retainer: { amount: 120000, note: "Annual personal protection plan" },
            contingency: { amount: null, note: "Not offered for criminal matters" },
            document: { amount: 6000, note: "Bail & appeal filings" }
        },
        slots: [4, 4, 3, 5, 0, 4, 2],
        availabilityStatus: "week",
        reviews: [
            { name: "Zaveri Family", category: "Anticipatory Bail", rating: 5, date: "2026-06-09", text: "Pre-arrest bail in 5 days. Calm and strategic throughout a scary period." },
            { name: "H. Desai", category: "Criminal Appeal", rating: 5, date: "2026-03-27", text: "Appeal in a 2019 conviction is now before High Court with strong grounds." },
            { name: "V. Mehta", category: "Habeas Corpus", rating: 4, date: "2026-01-10", text: "Son traced and produced within weeks. Grateful for his urgency." }
        ]
    }
];

/* ============ Case Law Database ============ */
const COURT_CASES = [
    { id: "c1", title: "Kesavananda Bharati v. State of Kerala", citation: "AIR 1973 SC 1461", category: "constitutional", court: "Supreme Court", courtLevel: "supreme", year: 1973, winRate: 100, citations: 4521, summary: "Basic structure doctrine established - Parliament cannot alter the basic structure of the Constitution. Landmark 13-judge bench decision.", tags: ["basic structure", "amendment", "13 judge bench"] },
    { id: "c2", title: "Maneka Gandhi v. Union of India", citation: "AIR 1978 SC 597", category: "constitutional", court: "Supreme Court", courtLevel: "supreme", year: 1978, winRate: 100, citations: 3890, summary: "Article 21 expanded - right to life and liberty cannot be curtailed except by procedure established by a fair, just and reasonable law.", tags: ["article 21", "due process", "passport"] },
    { id: "c3", title: "K.S. Puttaswamy v. Union of India", citation: "(2017) 10 SCC 1", category: "constitutional", court: "Supreme Court", courtLevel: "supreme", year: 2017, winRate: 100, citations: 2105, summary: "Right to privacy declared a fundamental right under Articles 14, 19 and 21 of the Constitution.", tags: ["privacy", "article 21", "aadhaar"] },
    { id: "c4", title: "Navtej Singh Johar v. Union of India", citation: "(2018) 10 SCC 1", category: "constitutional", court: "Supreme Court", courtLevel: "supreme", year: 2018, winRate: 100, citations: 1876, summary: "Section 377 IPC struck down insofar as it criminalized consensual same-sex relations between adults.", tags: ["section 377", "lgbtq", "article 21"] },
    { id: "c5", title: "Vishaka v. State of Rajasthan", citation: "AIR 1997 SC 3011", category: "labor", court: "Supreme Court", courtLevel: "supreme", year: 1997, winRate: 100, citations: 2945, summary: "Laid down the Vishaka Guidelines for prevention of sexual harassment at workplace - precursor to POSH Act 2013.", tags: ["posh", "harassment", "workplace"] },
    { id: "c6", title: "M.C. Mehta v. Union of India (Taj Corridor)", citation: "(2007) 1 SCC 110", category: "environment", court: "Supreme Court", courtLevel: "supreme", year: 2007, winRate: 100, citations: 623, summary: "Supreme Court ordered demolition of commercial complexes near Taj Mahal and prohibited polluting industries in the Taj Trapezium Zone.", tags: ["taj mahal", "pollution", "ngt"] },
    { id: "c7", title: "Vellore Citizens Welfare Forum v. Union of India", citation: "AIR 1996 SC 2715", category: "environment", court: "Supreme Court", courtLevel: "supreme", year: 1996, winRate: 100, citations: 1420, summary: "Recognized the Precautionary Principle and Polluter Pays Principle as part of environmental law in India.", tags: ["polluter pays", "precautionary", "tanneries"] },
    { id: "c8", title: "Shabnam Hashmi v. Union of India", citation: "(2014) 4 SCC 1", category: "family", court: "Supreme Court", courtLevel: "supreme", year: 2014, winRate: 100, citations: 312, summary: "Held that guidelines for adoption of children under Juvenile Justice Act are optional; adoption not restricted to religion under Hindu Adoption Act.", tags: ["adoption", "juvenile", "child rights"] },
    { id: "c9", title: "Joseph Shine v. Union of India", citation: "(2018) 2 SCC 167", category: "criminal", court: "Supreme Court", courtLevel: "supreme", year: 2018, winRate: 100, citations: 1457, summary: "Section 497 IPC (adultery) struck down as unconstitutional - arbitrary discrimination against women.", tags: ["adultery", "497 ipc", "article 14"] },
    { id: "c10", title: "Rajagopal v. State of Tamil Nadu", citation: "AIR 1995 SC 264", category: "constitutional", court: "Supreme Court", courtLevel: "supreme", year: 1995, winRate: 100, citations: 986, summary: "Right to privacy against publication involving public figures exists even after death; freedom of press defined.", tags: ["privacy", "press", "defamation"] },
    { id: "c11", title: "Rashid Khan v. State of UP", citation: "AIR 1954 SC 207", category: "civil", court: "Supreme Court", courtLevel: "supreme", year: 1954, winRate: 100, citations: 415, summary: "Freedom of business under Article 19(1)(g) subject to reasonable restrictions; state machinery cannot be used to throttle private commerce.", tags: ["article 19", "business"] },
    { id: "c12", title: "I.C. Golaknath v. State of Punjab", citation: "AIR 1967 SC 1643", category: "constitutional", court: "Supreme Court", courtLevel: "supreme", year: 1967, winRate: 100, citations: 1330, summary: "Parliament cannot amend fundamental rights; later overturned by 24th Amendment but instrumental in basic structure doctrine.", tags: ["amendment", "fundamental rights"] },
    { id: "c13", title: "Union of India v. Raghubir Singh", citation: "AIR 1989 SC 1933", category: "tax", court: "Supreme Court", courtLevel: "supreme", year: 1989, winRate: 56, citations: 552, summary: "Doctrine of precedence - Supreme Court decisions are law of the land; later decisions supersede earlier conflicting rulings.", tags: ["precedent", "capital gains"] },
    { id: "c14", title: "Tata Consultancy Services v. State of AP", citation: "(2005) 1 SCC 308", category: "tax", court: "Supreme Court", courtLevel: "supreme", year: 2005, winRate: 100, citations: 488, summary: "Software is 'goods' under state sales tax law - can be taxed as intangible property.", tags: ["software", "sales tax"] },
    { id: "c15", title: "State of Rajasthan v. Prakash Chand", citation: "(1998) 1 SCC 1", category: "labor", court: "Supreme Court", courtLevel: "supreme", year: 1998, winRate: 43, citations: 210, summary: "Casual workers claiming absorption into government rolls - denial upheld where appointment was irregular.", tags: ["casual workers", "absorption"] },
    { id: "c16", title: "Natraj Constructions v. Union of India", citation: "AIR 1986 SC 71", category: "consumer", court: "Supreme Court", courtLevel: "supreme", year: 1986, winRate: 100, citations: 321, summary: "Deficiency in service by a public undertaking - consumer law applied to public sector companies.", tags: ["deficiency", "public sector"] },
    { id: "c17", title: "Novartis AG v. Union of India", citation: "(2013) 6 SCC 1", category: "ipr", court: "Supreme Court", courtLevel: "supreme", year: 2013, winRate: 0, citations: 1870, summary: "Pharmaceutical patent for Imatinib rejected - Section 3(d) IPCA prevents evergreening of drug patents.", tags: ["patent", "evergreening", "glivec"] },
    { id: "c18", title: "D.K. Basu v. State of West Bengal", citation: "AIR 1997 SC 610", category: "criminal", court: "Supreme Court", courtLevel: "supreme", year: 1997, winRate: 100, citations: 2210, summary: "Guidelines on arrest procedures - disclosure of arrest memo, informing family, medical examination mandate for custodial torture prevention.", tags: ["arrest", "custodial torture", "guidelines"] },
    { id: "c19", title: "Sheela Barse v. State of Maharashtra", citation: "AIR 1983 SC 378", category: "criminal", court: "Supreme Court", courtLevel: "supreme", year: 1983, winRate: 100, citations: 654, summary: "Legal aid for under-trial prisoners - right to free legal services for those unable to afford counsel.", tags: ["legal aid", "undertrial"] },
    { id: "c20", title: "S. Khushboo v. Kanniammal", citation: "(2010) 5 SCC 600", category: "criminal", court: "Supreme Court", courtLevel: "supreme", year: 2010, winRate: 100, citations: 431, summary: "Freedom of speech includes the right to express views on controversial social subjects; pre-marital sex not an offence under IPC.", tags: ["free speech", "premarital sex"] },
    { id: "c21", title: "K. A. Abdul Jaleel v. T. A. Shahida", citation: "(2003) 4 SCC 166", category: "family", court: "Supreme Court", courtLevel: "supreme", year: 2003, winRate: 100, citations: 233, summary: "Proof of marriage and paternity - DNA evidence and social evidence interplay in custody matters.", tags: ["custody", "dna", "paternity"] },
    { id: "c22", title: "Manohar Lal Sharma v. Union of India", citation: "(2014) 9 SCC 516", category: "constitutional", court: "Supreme Court", courtLevel: "supreme", year: 2014, winRate: 100, citations: 510, summary: "Coal block allocation - cancellation of allocations; natural resources must be allotted through transparent mechanism.", tags: ["coal", "scam", "natural resource"] },
    { id: "c23", title: "R. Rajagopala Reddy v. State of AP", citation: "AIR 1997 SC 3392", category: "criminal", court: "Supreme Court", courtLevel: "supreme", year: 1997, winRate: 89, citations: 180, summary: "Quashing of FIR reconsideration - guidelines for exercise of inherent power under Section 482 CrPC.", tags: ["482 crpc", "fir quashing"] },
    { id: "c24", title: "Delhi Cloth & General Mills v. CIT", citation: "(1983) 140 ITR 707", category: "tax", court: "Supreme Court", courtLevel: "supreme", year: 1983, winRate: 67, citations: 155, summary: "Forum for capital gains computation; open market value vs actual consideration cases.", tags: ["capital gains", "valuation"] },
    { id: "c25", title: "L. Babu Ram v. Raghunathji", citation: "AIR 1976 SC 1734", category: "civil", court: "Supreme Court", courtLevel: "supreme", year: 1976, winRate: 47, citations: 120, summary: "Doctrine of co-ownership - possession of one co-owner presumed for all; adverse possession against co-owner requires exceptional claim.", tags: ["co-ownership", "adverse possession"] },
    { id: "c26", title: "Air India Cabin Crew Assn v. Yeshaswinee Merchant", citation: "(2003) 6 SCC 277", category: "labor", court: "Supreme Court", courtLevel: "supreme", year: 2003, winRate: 100, citations: 165, summary: "Mandatory pregnancy ground for termination struck down - gender discrimination in service rules.", tags: ["pregnancy", "discrimination"] },
    { id: "c27", title: "GE India Industrial Pvt Ltd v. CIT", citation: "(2007) 9 SCC 640", category: "tax", court: "Supreme Court", courtLevel: "supreme", year: 2007, winRate: 86, citations: 145, summary: "Withholding tax on payments to non-residents - TDS obligation scope examined under Section 195.", tags: ["tds", "non-resident", "royalty"] },
    { id: "c28", title: "Copyright Board v. Music Broadcast India", citation: "(2012) 5 SCC 298", category: "ipr", court: "Supreme Court", courtLevel: "supreme", year: 2012, winRate: 100, citations: 122, summary: "Radio broadcast licensing - statutory licence for broadcasting; revisional jurisdiction of Copyright Board.", tags: ["broadcasting", "licence"] },
    { id: "c29", title: "People's Union for Civil Liberties v. Union of India", citation: "AIR 1997 SC 568", category: "constitutional", court: "Supreme Court", courtLevel: "supreme", year: 1997, winRate: 100, citations: 893, summary: "Telephone tapping violates privacy under Article 21 - requires judicial authorization.", tags: ["telephone tapping", "privacy", "article 21"] },
    { id: "c30", title: "S. R. Bommai v. Union of India", citation: "AIR 1994 SC 1918", category: "constitutional", court: "Supreme Court", courtLevel: "supreme", year: 1994, winRate: 100, citations: 2210, summary: "Presidential rule under Article 356 subject to judicial review; federalism is part of basic structure.", tags: ["article 356", "federalism", "president rule"] },
    { id: "c31", title: "Rekha Devi v. State of UP", citation: "(2014) 4 SCC 667", category: "family", court: "Supreme Court", courtLevel: "supreme", year: 2014, winRate: 100, citations: 173, summary: "Hindu Succession Act 2005 - daughters get equal coparcenary rights in ancestral property.", tags: ["succession", "daughters rights"] },
    { id: "c32", title: "Deepak Kumar v. State of Haryana", citation: "(2012) 4 SCC 629", category: "environment", court: "Supreme Court", courtLevel: "supreme", year: 2012, winRate: 100, citations: 275, summary: "Mining leases require environmental clearance; sand mining regulation via EIA notifications upheld.", tags: ["mining", "eia"] },
    { id: "c33", title: "Pepsi Foods Ltd v. Special Judicial Magistrate", citation: "AIR 1998 SC 128", category: "criminal", court: "Supreme Court", courtLevel: "supreme", year: 1998, winRate: 100, citations: 480, summary: "Quashing of criminal proceedings - courts must exercise inherent powers to prevent abuse of process.", tags: ["quashing", "482"] },
    { id: "c34", title: "Unichem Laboratories v. Union of India", citation: "AIR 1988 SC 1543", category: "ipr", court: "Supreme Court", courtLevel: "supreme", year: 1988, winRate: 100, citations: 95, summary: "Trademark infringement - generic name cannot be trademarked.", tags: ["trademark", "generic"] },
    { id: "c35", title: "M. R. Balaji v. State of Mysore", citation: "AIR 1963 SC 649", category: "constitutional", court: "Supreme Court", courtLevel: "supreme", year: 1963, winRate: 100, citations: 780, summary: "Caste-based reservation cannot exceed 50%; sub-classification within backward classes impermissible.", tags: ["reservation", "50% cap"] },
    { id: "c36", title: "National Insurance Co v. Swaran Singh", citation: "(2004) 3 SCC 297", category: "consumer", court: "Supreme Court", courtLevel: "supreme", year: 2004, winRate: 100, citations: 1320, summary: "Third-party insurance - insurer liable even for vehicle driven with learner's license.", tags: ["insurance", "motor accident"] },
    { id: "c37", title: "K. K. Modi v. K. N. Modi", citation: "(1998) 3 SCC 573", category: "corporate", court: "Supreme Court", courtLevel: "supreme", year: 1998, winRate: 83, citations: 210, summary: "Arbitration clause validity - disputes referable to arbitration; family settlement arbitration upheld.", tags: ["arbitration", "family settlement"] },
    { id: "c38", title: "Delhi Development Authority v. B.P. Shukla", citation: "(2000) 5 SCC 656", category: "consumer", court: "Supreme Court", courtLevel: "supreme", year: 2000, winRate: 100, citations: 96, summary: "DDA flat allottees are consumers; delays in possession entitle compensation with interest.", tags: ["dda", "flat possession"] },
    { id: "c39", title: "Minority Welfare Society v. State of Karnataka", citation: "AIR 1960 SC 458", category: "civil", court: "Supreme Court", courtLevel: "supreme", year: 1960, winRate: 58, citations: 70, summary: "Article 30 - minority educational institutions can claim exemption from general laws affecting their minority character.", tags: ["minority rights", "article 30"] },
    { id: "c40", title: "Union of India v. WN Chadha", citation: "AIR 1993 SC 1082", category: "criminal", court: "Supreme Court", courtLevel: "supreme", year: 1993, winRate: 73, citations: 140, summary: "Investigation including filing of charge-sheet does not require notice to accused at each stage.", tags: ["charge sheet", "investigation"] },
    { id: "c41", title: "Sanjeev Coke Manufacturing v. BCCL", citation: "AIR 1983 SC 239", category: "corporate", court: "Supreme Court", courtLevel: "supreme", year: 1983, winRate: 100, citations: 165, summary: "Nationalization upheld; directive principles of state policy are fundamental in the governance of the country.", tags: ["nationalization", "dpsp"] },
    { id: "c42", title: "P.M. Bharate v. Pune Municipal Corporation", citation: "AIR 1974 Bom 357", category: "civil", court: "High Court", courtLevel: "high-court", year: 1974, winRate: 65, citations: 90, summary: "Public trust doctrine applied to civic amenities - municipal corporation cannot alienate public trust property.", tags: ["public trust", "municipality"] },
    { id: "c43", title: "Hakim Firdous Ali v. State of Delhi", citation: "AIR 1981 Del 328", category: "civil", court: "High Court", courtLevel: "high-court", year: 1981, winRate: 59, citations: 55, summary: "Eviction of tenant by private landlord under Delhi Rent Control Act - possession grounds examined.", tags: ["eviction", "rent control"] },
    { id: "c44", title: "Ajmira Ashrafi Brothers v. CIT", citation: "(2005) 1 SCC 214", category: "tax", court: "Supreme Court", courtLevel: "supreme", year: 2005, winRate: 79, citations: 60, summary: "Assessing officer cannot override appellate forum's findings; jurisdiction boundaries of reassessment clarified.", tags: ["reassessment", "jurisdiction"] },
    { id: "c45", title: "Intellectual Property Watch v. R Systems", citation: "2015 SCC OnLine Del 6832", category: "ipr", court: "High Court", courtLevel: "high-court", year: 2015, winRate: 62, citations: 40, summary: "Software copyright - source code copying standard of proof under copyright infringement claims.", tags: ["software copyright"] },
    { id: "c46", title: "Deepak Kumar v. State of Haryana (NGT review)", citation: "2016 SCC OnLine NGT 402", category: "environment", court: "Tribunal", courtLevel: "tribunal", year: 2016, winRate: 54, citations: 33, summary: "NGT review of mining policy compliance with environmental clearance conditions in Haryana.", tags: ["mining", "compliance"] },
    { id: "c47", title: "Govind Dhondu Barve v. State of Maharashtra", citation: "1980 CrLJ 1081", category: "criminal", court: "High Court", courtLevel: "high-court", year: 1980, winRate: 71, citations: 35, summary: "Bail on medical grounds - undertrial accused with chronic illness released on bond conditions.", tags: ["bail", "medical"] },
    { id: "c48", title: "Laxmi Devi v. State of UP", citation: "AIR 1988 All 133", category: "civil", court: "High Court", courtLevel: "high-court", year: 1988, winRate: 58, citations: 42, summary: "Land acquisition compensation assessment - market value at date of Section 4 notification.", tags: ["land acquisition", "compensation"] },
    { id: "c49", title: "Shiv Sagar Coal v. State of Jharkhand", citation: "2018 SCC OnLine Jhar 148", category: "labor", court: "High Court", courtLevel: "high-court", year: 2018, winRate: 45, citations: 18, summary: "ESI contribution for casual workers - coverage thresholds under ESI Act for intermittent engagements.", tags: ["esi", "casual workers"] },
    { id: "c50", title: "Aravind v. State of Kerala", citation: "2017 SCC OnLine Ker 1025", category: "family", court: "High Court", courtLevel: "high-court", year: 2017, winRate: 64, citations: 22, summary: "Guardianship and custody of out-of-wedlock children - mother's preferential claim in custody disputes.", tags: ["custody", "guardianship"] }
];

/* ============ Constitution of India ============ */
const CONSTITUTION = {
    preamble: {
        id: "preamble", title: "Preamble",
        text: `WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens:\n\nJUSTICE, social, economic and political;\nLIBERTY of thought, expression, belief, faith and worship;\nEQUALITY of status and of opportunity;\nand to promote among them all\nFRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation;\n\nIN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.`,
        type: "preamble",
        meta: ["Adopted: 26 Nov 1949", "Effective: 26 Jan 1950", "Amended: 42nd Amendment, 1976"]
    },
    parts: [
        { id: "part-i", title: "Part I - The Union and its Territory", articles: [
            { id: "article-1", title: "Article 1 - Name and territory of the Union", text: `(1) India, that is Bharat, shall be a Union of States.\n(2) The States and the territories thereof shall be as specified in the First Schedule.\n(3) The territory of India shall comprise - (a) the territories of the States; (b) the Union territories specified in the First Schedule; and (c) such other territories as may be acquired.` },
            { id: "article-3", title: "Article 3 - Formation of new States", text: `Parliament may by law - (a) form a new State by separation of territory from any State or by uniting two or more States or parts of States; (b) increase the area of any State; (c) diminish the area of any State; (d) alter the boundaries of any State; (e) alter the name of any State. Provided that no Bill for the purpose shall be introduced in either House of Parliament except on the recommendation of the President and unless the views of the Legislature of the affected State(s) have been obtained.` }
        ]},
        { id: "part-ii", title: "Part II - Citizenship", articles: [
            { id: "article-5", title: "Article 5 - Citizenship at the commencement of the Constitution", text: `At the commencement of this Constitution, every person who has his domicile in the territory of India and - (a) who was born in the territory of India; or (b) either of whose parents was born in the territory of India; or (c) who has been ordinarily resident in the territory of India for not less than five years immediately preceding such commencement, shall be a citizen of India.` },
            { id: "article-11", title: "Article 11 - Parliament to regulate right of citizenship by law", text: `Nothing in the foregoing provisions of this Part shall derogate from the power of Parliament to make any provision with respect to the acquisition and termination of citizenship and all other matters relating to citizenship (see Citizenship Act, 1955).` }
        ]},
        { id: "part-iii", title: "Part III - Fundamental Rights", articles: [
            { id: "article-12", title: "Article 12 - Definition", text: `In this Part, unless the context otherwise requires, "the State" includes the Government and Parliament of India and the Government and the Legislature of each of the States and all local or other authorities within the territory of India or under the control of the Government of India.` },
            { id: "article-13", title: "Article 13 - Laws inconsistent with or in derogation of the fundamental rights", text: `(1) All laws in force in the territory of India immediately before the commencement of this Constitution, in so far as they are inconsistent with the provisions of this Part, shall, to the extent of such inconsistency, be void.\n(2) The State shall not make any law which takes away or abridges the rights conferred by this Part and any law made in contravention of this clause shall, to the extent of the contravention, be void.\n(3) "Law" includes any Ordinance, order, bye-law, rule, regulation, notification, custom or usage.\n(4) Nothing in this article shall apply to any amendment of this Constitution made under Article 368.` },
            { id: "article-14", title: "Article 14 - Equality before law", text: `The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.` },
            { id: "article-15", title: "Article 15 - Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth", text: `(1) The State shall not discriminate against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them.\n(2) No citizen shall, on grounds only of religion, race, caste, sex, place of birth or any of them, be subject to any disability, liability, restriction or condition with regard to access to shops, public restaurants, hotels and places of public entertainment, or the use of wells, tanks, bathing ghats, roads and places of public resort.\n(3) Nothing in this article shall prevent the State from making any special provision for women and children.\n(4) Nothing in this article shall prevent the State from making any special provision for the advancement of any socially and educationally backward classes of citizens or for the Scheduled Castes and the Scheduled Tribes.\n(5) Special provision for admission to educational institutions including private aided or unaided institutions (inserted by 93rd Amendment, 2005).\n(6) 10% EWS reservation for economically weaker sections (inserted by 103rd Amendment, 2019).` },
            { id: "article-16", title: "Article 16 - Equality of opportunity in matters of public employment", text: `(1) There shall be equality of opportunity for all citizens in matters relating to employment or appointment to any office under the State.\n(2) No citizen shall, on grounds only of religion, race, caste, sex, descent, place of birth, residence or any of them, be ineligible for, or discriminated against in respect of, any employment or office under the State.\n(3) Parliament may prescribe residence requirements within a State or Union territory.\n(4) The State may make provision for reservation of appointments or posts in favour of any backward class of citizens which, in the opinion of the State, is not adequately represented in the services under the State.` },
            { id: "article-19", title: "Article 19 - Protection of certain rights regarding freedom", text: `(1) All citizens shall have the right - (a) to freedom of speech and expression; (b) to assemble peaceably and without arms; (c) to form associations or unions; (d) to move freely throughout the territory of India; (e) to reside and settle in any part of the territory of India; and (f) to practise any profession, or to carry on any occupation, trade or business.\n(2) Reasonable restrictions on free speech may be imposed in the interests of sovereignty and integrity of India, the security of the State, friendly relations with foreign States, public order, decency or morality, or in relation to contempt of court, defamation or incitement to an offence.\n(3)-(6) Similar reasonable-restriction clauses apply to assembly, association, movement, residence and profession.` },
            { id: "article-20", title: "Article 20 - Protection in respect of conviction for offences", text: `(1) No person shall be convicted of any offence except for violation of a law in force at the time of the commission of the act charged as an offence, nor be subjected to a penalty greater than that which might have been inflicted under the law in force at the time of the commission of the offence.\n(2) No person shall be prosecuted and punished for the same offence more than once.\n(3) No person accused of any offence shall be compelled to be a witness against himself.` },
            { id: "article-21", title: "Article 21 - Protection of life and personal liberty", text: `No person shall be deprived of his life or personal liberty except according to procedure established by law.\n(Interpreted expansively by Maneka Gandhi to require a fair, just and reasonable procedure; includes right to privacy per Puttaswamy, 2017.)` },
            { id: "article-22", title: "Article 22 - Protection against arrest and detention in certain cases", text: `(1) No person who is arrested shall be detained in custody without being informed, as soon as may be, of the grounds for such arrest nor shall he be denied the right to consult, and to be defended by, a legal practitioner of his choice.\n(2) Every person arrested and detained shall be produced before the nearest magistrate within 24 hours of arrest, excluding travel time; no detention beyond that period without magistrate's authority.\n(4)-(7) Preventive detention limited to 3 months absent Advisory Board approval; grounds must be communicated; detention subject to safeguards.` },
            { id: "article-25", title: "Article 25 - Freedom of conscience and free profession, practice and propagation of religion", text: `(1) Subject to public order, morality and health and to the other provisions of this Part, all persons are equally entitled to freedom of conscience and the right freely to profess, practise and propagate religion.\n(2) The State may regulate any economic, financial, political or other secular activity associated with religious practice, and may provide for social welfare, reform or the throwing open of Hindu religious institutions of a public character to all classes and sections.` },
            { id: "article-32", title: "Article 32 - Remedies for enforcement of rights conferred by this Part", text: `(1) The right to move the Supreme Court by appropriate proceedings for the enforcement of the fundamental rights is guaranteed.\n(2) The Supreme Court shall have power to issue directions or orders or writs, including habeas corpus, mandamus, prohibition, quo warranto and certiorari, for the enforcement of any of these rights.\n(3) Parliament may by law empower any other court to exercise these powers within its local limits.\n(4) The right guaranteed by this article shall not be suspended except as otherwise provided by the Constitution.\n(Dr. Ambedkar called this article "the very heart and soul" of the Constitution.)` }
        ]},
        { id: "part-iv", title: "Part IV - Directive Principles of State Policy", articles: [
            { id: "article-38", title: "Article 38 - State to secure a social order", text: `(1) The State shall strive to promote the welfare of the people by securing a social order in which justice, social, economic and political, shall inform all the institutions of the national life.\n(2) The State shall strive to minimise inequalities in income and endeavour to eliminate inequalities in status, facilities and opportunities, not only amongst individuals but also amongst groups.` },
            { id: "article-39", title: "Article 39 - Certain principles of policy to be followed by the State", text: `The State shall direct its policy towards securing - (a) an adequate means of livelihood for all citizens; (b) distribution of ownership and control of material resources to subserve the common good; (c) prevention of concentration of wealth to the common detriment; (d) equal pay for equal work for both men and women; (e) protection of workers' health and strength against economic necessity; (f) opportunities and facilities for healthy development of children.` },
            { id: "article-44", title: "Article 44 - Uniform civil code for the citizens", text: `The State shall endeavour to secure for the citizens a uniform civil code throughout the territory of India.` },
            { id: "article-45", title: "Article 45 - Provision for early childhood care and education", text: `The State shall endeavour to provide early childhood care and education for all children until they complete the age of six years (substituted by the 86th Amendment, 2002).` }
        ]},
        { id: "part-iva", title: "Part IVA - Fundamental Duties", articles: [
            { id: "article-51a", title: "Article 51A - Fundamental duties", text: `It shall be the duty of every citizen of India - (a) to abide by the Constitution and respect its ideals and institutions, the National Flag and the National Anthem; (b) to cherish and follow the noble ideals of our national struggle for freedom; (c) to uphold and protect the sovereignty, unity and integrity of India; (d) to defend the country and render national service when called upon; (e) to promote harmony and common brotherhood, transcending religious, linguistic and regional diversities, and to renounce practices derogatory to the dignity of women; (f) to value and preserve the rich heritage of our composite culture; (g) to protect and improve the natural environment including forests, lakes, rivers and wildlife, and to have compassion for living creatures; (h) to develop the scientific temper, humanism and the spirit of inquiry and reform; (i) to safeguard public property and to abjure violence; (j) to strive towards excellence in all spheres of individual and collective activity; (k) a parent or guardian to provide opportunities for education to his child or ward between six and fourteen years (86th Amendment, 2002).` }
        ]},
        { id: "part-v", title: "Part V - The Union", articles: [
            { id: "article-53", title: "Article 53 - Executive power of the Union", text: `(1) The executive power of the Union shall be vested in the President and shall be exercised by him either directly or through officers subordinate to him in accordance with this Constitution.\n(2) Without prejudice to the generality of the foregoing provision, the supreme command of the Defence Forces of the Union shall be vested in the President.` },
            { id: "article-74", title: "Article 74 - Council of Ministers to aid and advise President", text: `(1) There shall be a Council of Ministers with the Prime Minister at the head to aid and advise the President who shall, in the exercise of his functions, act in accordance with such advice: Provided that the President may require the Council of Ministers to reconsider such advice, and the President shall act in accordance with the advice tendered after such reconsideration.\n(2) The question whether any, and if so what, advice was tendered by Ministers to the President shall not be inquired into in any court.` },
            { id: "article-123", title: "Article 123 - Power of President to promulgate Ordinances", text: `(1) If at any time, except when both Houses of Parliament are in session, the President is satisfied that circumstances exist which render it necessary for him to take immediate action, he may promulgate such Ordinances as the circumstances appear to him to require.\n(2) An Ordinance promulgated under this article shall have the same force and effect as an Act of Parliament.\n(3) Every Ordinance shall be laid before both Houses of Parliament and shall cease to operate at the expiration of six weeks from the reassembly of Parliament, unless sooner disapproved by both Houses.` }
        ]},
        { id: "part-x", title: "Part X - The Scheduled and Tribal Areas", articles: [
            { id: "article-244", title: "Article 244 - Administration of Scheduled Areas and Tribal Areas", text: `(1) The provisions of the Fifth Schedule shall apply to the administration and control of the Scheduled Areas and Scheduled Tribes in any State other than Assam, Meghalaya, Tripura and Mizoram.\n(2) The provisions of the Sixth Schedule shall apply to the administration of the tribal areas in the States of Assam, Meghalaya, Tripura and Mizoram.` }
        ]},
        { id: "part-xii", title: "Part XII - Finance, Property, Contracts and Suits", articles: [
            { id: "article-265", title: "Article 265 - Taxes not to be imposed save by authority of law", text: `No tax shall be levied or collected except by authority of law.` },
            { id: "article-300a", title: "Article 300A - Persons not to be deprived of property save by authority of law", text: `No person shall be deprived of his property save by authority of law. (Inserted by the 44th Amendment, 1978, replacing the fundamental right to property.)` }
        ]},
        { id: "part-xv", title: "Part XV - Elections", articles: [
            { id: "article-324", title: "Article 324 - Superintendence, direction and control of elections", text: `The superintendence, direction and control of the preparation of the electoral rolls for, and the conduct of, all elections to Parliament and to the Legislature of every State and of elections to the offices of President and Vice-President shall be vested in an Election Commission.` },
            { id: "article-326", title: "Article 326 - Elections to House of People and Assemblies", text: `Elections shall be on the basis of adult suffrage - every person who is a citizen of India and who is not less than eighteen years of age (61st Amendment, 1988) and is not otherwise disqualified shall be entitled to be registered as a voter.` }
        ]},
        { id: "part-xviii", title: "Part XVIII - Emergency Provisions", articles: [
            { id: "article-352", title: "Article 352 - Proclamation of Emergency", text: `(1) If the President is satisfied that a grave emergency exists whereby the security of India or of any part thereof is threatened, whether by war or external aggression or armed rebellion, he may by Proclamation make a declaration to that effect.\n(3) The President shall not issue a Proclamation unless the decision of the Union Cabinet has been communicated to him in writing.\n(4) Every Proclamation shall be laid before each House of Parliament and shall cease to operate at the expiration of one month unless approved by resolutions of both Houses.` },
            { id: "article-356", title: "Article 356 - Provisions in case of failure of constitutional machinery in States", text: `(1) If the President, on receipt of a report from the Governor of a State or otherwise, is satisfied that a situation has arisen in which the government of the State cannot be carried on in accordance with the provisions of this Constitution, he may by Proclamation - (a) assume to himself all or any of the functions of the Government of the State; (b) declare that the powers of the Legislature of the State shall be exercisable by or under the authority of Parliament; and (c) make incidental and consequential provisions.\n(3) Every Proclamation shall be laid before each House of Parliament and shall cease to operate at the expiration of two months unless approved; once approved, maximum force six months per renewal (subject to Article 356(4)-(5)).\n(Now subject to judicial review - S.R. Bommai, 1994.)` }
        ]},
        { id: "part-xx", title: "Part XX - Amendment of the Constitution", articles: [
            { id: "article-368", title: "Article 368 - Power of Parliament to amend the Constitution", text: `(1) Parliament may in exercise of its constituent power amend by way of addition, variation or repeal any provision of this Constitution in accordance with the procedure laid down in this article.\n(2) Amendment may be initiated by a Bill in either House of Parliament; when passed in each House by a majority of the total membership and by a majority of not less than two-thirds of the members present and voting, it shall be presented to the President for assent.\n(3) Amendments affecting (a) the election of the President; (b) the executive power of the Union and the States; (c) the judiciary; (d) the lists in the Seventh Schedule; (e) representation of States in Parliament; or (f) Article 368 itself, require ratification by not less than one-half of the State Legislatures.\n(The basic structure doctrine, per Kesavananda Bharati (1973), limits the amending power.)` }
        ]},
        { id: "part-xxi", title: "Part XXI - Temporary, Transitional and Special Provisions", articles: [
            { id: "article-370", title: "Article 370 - Special provisions for Jammu & Kashmir (OBSOLETE w.e.f. 05.08.2019)", text: `Omitted by the Constitution (Application to Jammu and Kashmir) Order, 2019 read with the Constitution (One Hundred and Third Amendment) Act, 2019 and the Jammu and Kashmir Reorganisation Act, 2019. All provisions of the Constitution now apply uniformly to the Union Territory of Jammu & Kashmir and Union Territory of Ladakh.` },
            { id: "article-371", title: "Article 371 - Special provision with respect to Maharashtra and Gujarat", text: `Special responsibility of the Governor to ensure development of Vidarbha, Marathwada (Maharashtra) and Saurashtra, Kutch (Gujarat); establishment of development boards and equitable allocation of funds.` }
        ]},
        { id: "part-xxii", title: "Part XXII - Short Title, Commencement, Authoritative Text", articles: [
            { id: "article-393", title: "Article 393 - Short title", text: `This Constitution may be called the Constitution of India.` },
            { id: "article-394", title: "Article 394 - Commencement", text: `This article and articles 5, 6, 7, 8, 9, 60, 324, 366, 367, 379, 380, 388, 391, 392 and 393 shall come into force at once, and the remaining provisions of this Constitution shall come into force on the twenty-sixth day of January, 1950.` }
        ]}
    ],
    schedules: [
        { id: "schedule-1", title: "First Schedule - States & Union Territories", text: `Part I lists the 28 States: Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal.\nPart II lists the Union territories: Delhi, Chandigarh, Andaman & Nicobar Islands, Puducherry, Ladakh, Jammu & Kashmir, Lakshadweep, Dadra & Nagar Haveli and Daman & Diu.` },
        { id: "schedule-2", title: "Second Schedule - Emoluments of Constitutional Office Holders", text: `Prescribes salaries and allowances for the President, Governors, Chief Justices and Judges of the Supreme Court and High Courts, Comptroller & Auditor-General, and the Speaker/Deputy Speaker of Parliament. Adjustments flow from Pay Commission recommendations and periodic constitutional amendments.` },
        { id: "schedule-3", title: "Third Schedule - Forms of Oaths or Affirmations", text: `Contains the precise texts of oaths for: (1) Union Ministers; (2) election candidates; (3) members of Parliament; (4) judges of the Supreme Court; (5) the Comptroller & Auditor-General; (6) State Ministers; (7) State legislators; (8) judges of High Courts. Every holder swears allegiance to the Constitution and to preserve the sovereignty and integrity of India.` },
        { id: "schedule-4", title: "Fourth Schedule - Allocation of Rajya Sabha Seats", text: `Allocates seats in the Council of States (Rajya Sabha) to the States and Union territories proportional to population - e.g. Uttar Pradesh 31, Maharashtra 19, Tamil Nadu 18, West Bengal 16, Bihar 16, Karnataka 12.` },
        { id: "schedule-5", title: "Fifth Schedule - Administration of Scheduled Areas", text: `Applies to Scheduled Areas in nine states: provides for (1) Tribes Advisory Councils; (2) Governor's power to regulate transfer of tribal land and money-lending to tribals; (3) prohibition or regulation of intoxicants in Scheduled Areas; (4) exclusion of certain laws from application in tribal areas.` },
        { id: "schedule-6", title: "Sixth Schedule - Tribal Areas in Assam, Meghalaya, Tripura, Mizoram", text: `Creates Autonomous District Councils (ADCs) with legislative, executive and judicial powers over tribal areas. Councils may legislate on allotment of land, forests, shifting cultivation, village administration, inheritance, marriage and social customs; their judicial committees may decide certain tribal disputes.` },
        { id: "schedule-7", title: "Seventh Schedule - Union, State & Concurrent Lists", text: `List I (Union, 100 subjects): defence, atomic energy, foreign affairs, banking, currency, railways, airlines, ports, income tax, customs, patents, copyright, census, elections.\nList II (State, 61 subjects): public order, police, agriculture, fisheries, irrigation, local government, public health, gambling, land revenue.\nList III (Concurrent, 52 subjects): criminal law & procedure, marriage & divorce, education, forests, electricity, economic planning, trade unions, social security.` },
        { id: "schedule-8", title: "Eighth Schedule - Recognized Languages", text: `The 22 scheduled languages: Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santhali, Sindhi, Tamil, Telugu, Urdu. (Sindhi added 1967; Konkani, Manipuri, Nepali 1992; Bodo, Dogri, Maithili, Santhali 2003.)` },
        { id: "schedule-9", title: "Ninth Schedule - Laws Protected from Judicial Review", text: `Laws placed in this Schedule are protected from challenge for violating fundamental rights (Article 31B). Primarily contains land reform and tenancy abolition statutes. Post-24 April 1973 insertions remain subject to the basic structure doctrine (I.R. Coelho v. State of TN, 2007).` },
        { id: "schedule-10", title: "Tenth Schedule - Anti-Defection Law", text: `Added by the 52nd Amendment, 1985. Disqualifies a legislator who voluntarily gives up party membership or votes against party whip without condonation within 15 days. Exceptions: party merger involving two-thirds of members. Speaker decides; decision reviewable by courts (Kihoto Hollohan, 1992).` },
        { id: "schedule-11", title: "Eleventh Schedule - Panchayati Raj Subjects", text: `Added by the 73rd Amendment, 1992. Lists 29 subjects for Panchayats, including agriculture, land improvement, minor irrigation, animal husbandry, fisheries, social forestry, khadi & village industries, rural housing, drinking water, roads, rural electrification, poverty alleviation, education, health & sanitation, public distribution system and maintenance of community assets.` },
        { id: "schedule-12", title: "Twelfth Schedule - Municipal Subjects", text: `Added by the 74th Amendment, 1992. Lists 18 subjects for Municipalities, including urban planning, regulation of land use, building construction, water supply, public health, fire services, urban forestry, slum improvement, urban poverty alleviation, city transport, regulation of slaughterhouses, burial grounds, parks & gardens, cultural institutions and street lighting.` }
    ],
    amendments: [
        { id: "am-1", num: 1, year: 1951, title: "First Amendment", text: "Added the Ninth Schedule; imposed reasonable restrictions on free speech (Article 19(2)); validated land reform laws." },
        { id: "am-7", num: 7, year: 1956, title: "Seventh Amendment", text: "Reorganisation of States on linguistic basis; introduced Union Territories; abolished Part C states." },
        { id: "am-24", num: 24, year: 1971, title: "Twenty-Fourth Amendment", text: "Reaffirmed Parliament's power to amend any part of the Constitution including Fundamental Rights; mandatory Presidential assent to amendment bills." },
        { id: "am-42", num: 42, year: 1976, title: "Forty-Second Amendment (Mini Constitution)", text: "Most extensive amendment: added 'Socialist, Secular' to the Preamble; added Fundamental Duties (Part IVA); gave directives precedence over fundamental rights; extended Lok Sabha term to six years; established administrative tribunals; strengthened the executive vis-à-vis the judiciary." },
        { id: "am-44", num: 44, year: 1978, title: "Forty-Fourth Amendment", text: "Reverted 42nd Amendment excesses: restored judicial review, deleted the fundamental right to property (new Article 300A), restored the five-year Lok Sabha term, tightened emergency provisions to 'armed rebellion', and made Articles 20-21 non-suspendable during Emergency." },
        { id: "am-52", num: 52, year: 1985, title: "Fifty-Second Amendment", text: "Added the Tenth Schedule (anti-defection law) disqualifying legislators who defect from their party." },
        { id: "am-61", num: 61, year: 1988, title: "Sixty-First Amendment", text: "Lowered the voting age from 21 to 18 years (Article 326)." },
        { id: "am-73", num: 73, year: 1992, title: "Seventy-Third Amendment", text: "Constitutionalized Panchayati Raj: three-tier system, direct elections, 1/3 women's reservation, SC/ST reservation, State Finance Commissions, Eleventh Schedule." },
        { id: "am-74", num: 74, year: 1992, title: "Seventy-Fourth Amendment", text: "Constitutionalized urban local bodies: Municipalities, Ward Committees, reservation for women and SC/ST, State Finance Commissions, Twelfth Schedule." },
        { id: "am-86", num: 86, year: 2002, title: "Eighty-Sixth Amendment", text: "Made free and compulsory education for ages 6-14 a Fundamental Right (Article 21A); amended Article 45 and added Fundamental Duty Article 51A(k)." },
        { id: "am-97", num: 97, year: 2011, title: "Ninety-Seventh Amendment", text: "Added co-operative societies as a fundamental right under Article 19(1)(c); inserted Part IXB for multi-state co-operative societies." },
        { id: "am-101", num: 101, year: 2016, title: "One Hundred and First Amendment", text: "Introduced the Goods and Services Tax (GST): Article 246A, new Union list entries, GST Council constitution, abolition of 17 indirect taxes." },
        { id: "am-103", num: 103, year: 2019, title: "One Hundred and Third Amendment", text: "Introduced 10% EWS reservation in higher education and government employment via Articles 15(6) and 16(6)." },
        { id: "am-105", num: 105, year: 2021, title: "One Hundred and Fifth Amendment", text: "Restored the power of States and Union Territories to identify Socially and Educationally Backward Classes for reservation purposes." },
        { id: "am-106", num: 106, year: 2023, title: "One Hundred and Sixth Amendment (Nari Shakti Vandan)", text: "Reserved one-third of seats for women in the Lok Sabha, State Legislative Assemblies and the Delhi Assembly, including reserved SC/ST constituencies; effective after delimitation." }
    ],
    updateHistory: [
        { version: "1.4.2", date: "2026-08-10", change: "106th Amendment reflected; 44th Amendment text verified against official records." },
        { version: "1.3.0", date: "2026-06-22", change: "EWS reservation interpretation note added to Article 15." },
        { version: "1.2.1", date: "2026-04-05", change: "GST provisions (101st Amendment) verified and updated." }
    ]
};

/* ============ Courts Database ============ */
const COURTS_LIST = [
    { id: "ct-1", name: "Supreme Court of India", type: "supreme", address: "Tilak Marg, New Delhi, Delhi 110001", phone: "011-23118888", hours: "Mon-Fri 10:30 AM - 4:30 PM", lat: 28.6221, lng: 77.2390, chief: "Chief Justice of India", caseload: "78,400 pending cases", website: "www.sci.gov.in" },
    { id: "ct-2", name: "Delhi High Court", type: "high-court", address: "Sher Shah Road, New Delhi 110503", phone: "011-23385001", hours: "Mon-Fri 10:30 AM - 4:00 PM", lat: 28.6085, lng: 77.2344, chief: "Acting Chief Justice", caseload: "1.2 lakh pending cases", website: "delhihighcourt.nic.in" },
    { id: "ct-3", name: "Patiala House Court Complex", type: "session", address: "Patiala House, New Delhi 110001", phone: "011-23385117", hours: "Mon-Sat 10:00 AM - 5:00 PM", lat: 28.6095, lng: 77.2378, chief: "Special Judge (PC Act)", caseload: "62,000 pending cases", website: "delhicourts.nic.in" },
    { id: "ct-4", name: "Tis Hazari Court Complex", type: "district", address: "ISBT Road, Tis Hazari, Delhi 110054", phone: "011-23924052", hours: "Mon-Sat 10:00 AM - 5:00 PM", lat: 28.6649, lng: 77.2085, chief: "Principal District & Sessions Judge", caseload: "3.1 lakh pending cases", website: "delhicourts.nic.in" },
    { id: "ct-5", name: "Saket Court Complex", type: "district", address: "Nehru Place Road, Saket, Delhi 110017", phone: "011-29564257", hours: "Mon-Sat 10:00 AM - 5:00 PM", lat: 28.5252, lng: 77.2094, chief: "District & Sessions Judge (South)", caseload: "2.4 lakh pending cases", website: "delhicourts.nic.in" },
    { id: "ct-6", name: "Dwarka Court Complex", type: "district", address: "Sector 10, Dwarka, Delhi 110075", phone: "011-28050277", hours: "Mon-Sat 10:00 AM - 5:00 PM", lat: 28.5865, lng: 77.0494, chief: "District & Sessions Judge (South-West)", caseload: "1.8 lakh pending cases", website: "delhicourts.nic.in" },
    { id: "ct-7", name: "Rohini Court Complex", type: "district", address: "Sector 15, Rohini, Delhi 110085", phone: "011-27863343", hours: "Mon-Sat 10:00 AM - 5:00 PM", lat: 28.7424, lng: 77.1194, chief: "District & Sessions Judge (North-West)", caseload: "2.9 lakh pending cases", website: "delhicourts.nic.in" },
    { id: "ct-8", name: "Karkardooma Court Complex", type: "magistrate", address: "Vishwas Nagar, Karkardooma, Delhi 110032", phone: "011-22370632", hours: "Mon-Sat 10:00 AM - 5:00 PM", lat: 28.6567, lng: 77.3240, chief: "Chief Metropolitan Magistrate (East)", caseload: "1.6 lakh pending cases", website: "delhicourts.nic.in" },
    { id: "ct-9", name: "Family Court (Dwarka)", type: "family", address: "Sector 10, Dwarka, Delhi 110075", phone: "011-28050135", hours: "Mon-Fri 10:00 AM - 4:30 PM", lat: 28.5898, lng: 77.0516, chief: "Principal Judge (Family Court)", caseload: "62,000 pending cases", website: "delhicourts.nic.in" },
    { id: "ct-10", name: "Consumer Court (West District)", type: "consumer", address: "Janakpuri District Centre, Delhi 110058", phone: "011-25593475", hours: "Mon-Fri 10:00 AM - 4:00 PM", lat: 28.6214, lng: 77.0915, chief: "District Commission President", caseload: "18,500 pending cases", website: "consumer.nic.in" },
    { id: "ct-11", name: "Labour Court (Karkardooma)", type: "labor", address: "Karkardooma Courts Campus, Delhi 110032", phone: "011-22370631", hours: "Mon-Fri 10:00 AM - 4:00 PM", lat: 28.6552, lng: 77.3228, chief: "Presiding Officer, Labour Court", caseload: "24,000 pending cases", website: "delhicourts.nic.in" },
    { id: "ct-12", name: "NCLT (New Delhi Bench)", type: "tribunal", address: "IFCI Tower, Nehru Place, Delhi 110019", phone: "011-26259971", hours: "Mon-Fri 10:30 AM - 6:00 PM", lat: 28.5485, lng: 77.2532, chief: "President, NCLT", caseload: "11,200 pending insolvency cases", website: "nclt.gov.in" },
    { id: "ct-13", name: "National Green Tribunal (NGT)", type: "tribunal", address: "Faridkot House, Copernicus Marg, New Delhi 110001", phone: "011-23060333", hours: "Mon-Fri 10:30 AM - 5:00 PM", lat: 28.6067, lng: 77.2326, chief: "Chairperson, NGT", caseload: "9,800 pending cases", website: "greentribunal.gov.in" },
    { id: "ct-14", name: "Rouse Avenue District Court", type: "magistrate", address: "Rouse Avenue, New Delhi 110002", phone: "011-23383292", hours: "Mon-Sat 10:00 AM - 5:00 PM", lat: 28.6267, lng: 77.2128, chief: "Chief Metropolitan Magistrate (Central)", caseload: "1.1 lakh pending cases", website: "delhicourts.nic.in" },
    { id: "ct-15", name: "Bombay High Court", type: "high-court", address: "Fort, Mumbai, Maharashtra 400032", phone: "022-22683500", hours: "Mon-Fri 10:30 AM - 4:30 PM", lat: 18.9271, lng: 72.8321, chief: "Chief Justice of Bombay HC", caseload: "4.2 lakh pending cases", website: "bombayhighcourt.nic.in" },
    { id: "ct-16", name: "Madras High Court", type: "high-court", address: "High Court Campus, Chennai, Tamil Nadu 600104", phone: "044-25342151", hours: "Mon-Fri 10:15 AM - 4:45 PM", lat: 13.0867, lng: 80.2868, chief: "Chief Justice of Madras HC", caseload: "2.7 lakh pending cases", website: "hcmadras.tn.nic.in" },
    { id: "ct-17", name: "Karnataka High Court", type: "high-court", address: "Bengaluru, Karnataka 560001", phone: "080-22963000", hours: "Mon-Fri 10:00 AM - 4:30 PM", lat: 12.9618, lng: 77.6133, chief: "Chief Justice of Karnataka HC", caseload: "3.9 lakh pending cases", website: "karnatakajudiciary.kar.nic.in" },
    { id: "ct-18", name: "Calcutta High Court", type: "high-court", address: "Esplanade Row West, Kolkata 700001", phone: "033-22480804", hours: "Mon-Fri 10:30 AM - 4:30 PM", lat: 22.5720, lng: 88.3462, chief: "Chief Justice of Calcutta HC", caseload: "2.1 lakh pending cases", website: "calcuttahighcourt.gov.in" }
];

/* ============ Languages ============ */
const LANGUAGES = [
    { code: "en", name: "English", native: "English", region: "Global" },
    { code: "hi", name: "Hindi", native: "हिन्दी", region: "North & Central India" },
    { code: "bn", name: "Bengali", native: "বাংলা", region: "West Bengal, Tripura" },
    { code: "ta", name: "Tamil", native: "தமிழ்", region: "Tamil Nadu, Puducherry" },
    { code: "te", name: "Telugu", native: "తెలుగు", region: "Telangana, Andhra Pradesh" },
    { code: "mr", name: "Marathi", native: "मराठी", region: "Maharashtra" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી", region: "Gujarat, Daman" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", region: "Karnataka" },
    { code: "ml", name: "Malayalam", native: "മലയാളം", region: "Kerala, Lakshadweep" },
    { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", region: "Punjab, Chandigarh" },
    { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", region: "Odisha" },
    { code: "as", name: "Assamese", native: "অসমীয়া", region: "Assam" },
    { code: "ur", name: "Urdu", native: "اردو", region: "UP, Telangana, Jammu" },
    { code: "sa", name: "Sanskrit", native: "संस्कृतम्", region: "All India (classical)" },
    { code: "si", name: "Sindhi", native: "سنڌي", region: "Gujarat, Rajasthan" },
    { code: "ne", name: "Nepali", native: "नेपाली", region: "Sikkim, Darjeeling" },
    { code: "do", name: "Dogri", native: "डोगरी", region: "Jammu" },
    { code: "ko", name: "Konkani", native: "कोंकणी", region: "Goa, Coastal Karnataka" },
    { code: "ma", name: "Maithili", native: "मैथिली", region: "Bihar, Jharkhand" },
    { code: "mn", name: "Manipuri", native: "মৈতৈলোন্", region: "Manipur" },
    { code: "bo", name: "Bodo", native: "बर'/बड़ो", region: "Assam" },
    { code: "sa2", name: "Santhali", native: "ᱥᱟᱱᱛᱟᱲᱤ", region: "Jharkhand, WB" },
    { code: "ar", name: "Arabic", native: "العربية", region: "Middle East" },
    { code: "zh", name: "Chinese", native: "中文", region: "China" },
    { code: "fr", name: "French", native: "Français", region: "France, Africa" },
    { code: "de", name: "German", native: "Deutsch", region: "Germany" },
    { code: "es", name: "Spanish", native: "Español", region: "Spain, Americas" },
    { code: "ja", name: "Japanese", native: "日本語", region: "Japan" },
    { code: "ru", name: "Russian", native: "Русский", region: "Russia, CIS" },
    { code: "pt", name: "Portuguese", native: "Português", region: "Portugal, Brazil" },
    { code: "it", name: "Italian", native: "Italiano", region: "Italy" },
    { code: "ko2", name: "Korean", native: "한국어", region: "Korea" }
];

/* ============ Notifications ============ */
const NOTIFICATIONS = [
    { id: "n1", type: "cases", title: "Hearing: Sharma v. State", desc: "Next hearing on Friday at 11:00 AM at Tis Hazari Court, Court No. 14.", time: "2h ago", unread: true, icon: "fa-gavel" },
    { id: "n2", type: "cases", title: "Case Update: Property Dispute", desc: "Written statement filed successfully. Reply awaited from opponent.", time: "6h ago", unread: true, icon: "fa-file-signature" },
    { id: "n3", type: "appointments", title: "Consultation Reminder", desc: "Video consultation with Adv. Meera Krishnan at 6:30 PM today.", time: "8h ago", unread: true, icon: "fa-video" },
    { id: "n4", type: "appointments", title: "Booking Confirmed", desc: "Adv. Rajesh Sharma confirmed your 30-min consultation for Monday.", time: "1d ago", unread: false, icon: "fa-calendar-check" },
    { id: "n5", type: "system", title: "Constitution Updated", desc: "106th Amendment reflected in the Constitutional Library. Version 1.4.2", time: "2d ago", unread: false, icon: "fa-book" },
    { id: "n6", type: "system", title: "New Feature: AI Call Bot", desc: "Configure intake questions and forwarding rules for your practice.", time: "3d ago", unread: false, icon: "fa-phone" },
    { id: "n7", type: "cases", title: "Complaint Progress", desc: "CMP-2026-048 under review. Documents verified (5/5).", time: "4d ago", unread: false, icon: "fa-flag" },
    { id: "n8", type: "system", title: "Security Tip", desc: "Two-factor authentication is now available in Settings - Privacy.", time: "5d ago", unread: false, icon: "fa-shield-halved" }
];

/* ============ Seed Complaints ============ */
const SEED_COMPLAINTS = [
    { id: "CMP-2026-048", lawyerName: "Adv. Rakesh Tiwari", lawyerType: "private", category: "fee-collection", description: "Collected 45,000 for consultation and retained fees but did not file the suit for 4 months. Refused refund.", date: "2026-07-28", status: "under-review", progress: 45, evidence: ["receipt.pdf", "whatsapp-chat.txt"] },
    { id: "CMP-2026-052", lawyerName: "Adv. S. K. Pandey", lawyerType: "government", category: "delay", description: "Government panel lawyer missed 6 consecutive hearings without informing. Case dismissed for want of prosecution.", date: "2026-08-02", status: "investigation", progress: 70, evidence: ["court-order.pdf"] },
    { id: "CMP-2026-039", lawyerName: "Adv. Lalita Verma", lawyerType: "legal-aid", category: "communication", description: "No response to calls/emails for 3 weeks despite urgency in a custody matter.", date: "2026-07-10", status: "submitted", progress: 20, evidence: [] },
    { id: "CMP-2026-031", lawyerName: "Adv. M. K. Sinha", lawyerType: "private", category: "negligence", description: "Missed limitation period for filing appeal; client lost the right of appeal.", date: "2026-06-15", status: "resolved", progress: 100, evidence: ["appeal-draft.pdf", "email-log.txt"] },
    { id: "CMP-2026-027", lawyerName: "Adv. D. N. Chauhan", lawyerType: "government", category: "misconduct", description: "Demanded unofficial payments for court stamp papers and filings at District Court.", date: "2026-05-30", status: "dismissed", progress: 100, evidence: ["audio-recording.mp3"] }
];

/* ============ AI Call Bot Configuration ============ */
const CALL_BOT_CONFIG = {
    intakeQuestions: [
        { id: "iq1", question: "What is the purpose of your call today?", active: true },
        { id: "iq2", question: "Are you a new or existing client?", active: true },
        { id: "iq3", question: "Which court and case type does this relate to?", active: true },
        { id: "iq4", question: "Can you share your case number, if available?", active: true },
        { id: "iq5", question: "What is the urgency level - routine, urgent, or emergency?", active: true },
        { id: "iq6", question: "When would be a good time for the lawyer to call you back?", active: true }
    ],
    forwardingRules: [
        { id: "fr1", condition: "New client inquiry with criminal case", action: "Forward to Adv. Sharma (criminal desk)", active: true },
        { id: "fr2", condition: "Existing client case update", action: "Forward to case-handling advocate", active: true },
        { id: "fr3", condition: "Court notice or deadline breach", action: "Immediate alert via SMS + email + forward", active: true },
        { id: "fr4", condition: "Emergency flagged calls", action: "Escalate to senior partner within 15 min", active: true },
        { id: "fr5", condition: "Opposing counsel communication", action: "Log and forward to managing associate", active: true },
        { id: "fr6", condition: "Spam / marketing detected", action: "Auto-block with polite rejection message", active: true },
        { id: "fr7", condition: "Consultation booking request", action: "Forward to scheduling assistant", active: true },
        { id: "fr8", condition: "Unrecognized caller number", action: "Request callback number before forwarding", active: true }
    ],
    autoResponses: [
        { id: "ar1", trigger: "Greeting", response: "Namaste! You have reached the office of [FIRM NAME]. I am the AI Legal Assistant - how may I help you today?", active: true },
        { id: "ar2", trigger: "Out of hours", response: "Our office is currently closed. I can take your details and a lawyer will call you back during working hours.", active: true },
        { id: "ar3", trigger: "Fee inquiry", response: "Our fee structure is fully transparent and available on our website. A consultation guide has been sent to your registered number.", active: true },
        { id: "ar4", trigger: "Complaint", response: "I understand your concern. Your complaint has been logged and forwarded to the compliance desk for priority review.", active: true },
        { id: "ar5", trigger: "Emergency", response: "This is an emergency. I am alerting the duty lawyer immediately. Please hold - this line will be transferred.", active: true },
        { id: "ar6", trigger: "Spam detection", response: "Your call could not be processed. Goodbye.", active: true },
        { id: "ar7", trigger: "Wrong number", response: "Apologies, it seems you have reached the wrong number. Is there anything else I can help you with?", active: true },
        { id: "ar8", trigger: "Farewell", response: "Thank you for calling. Your reference number has been recorded. Have a good day!", active: true }
    ],
    botLanguages: [
        { code: "en", name: "English", active: true },
        { code: "hi", name: "Hindi", active: true },
        { code: "ta", name: "Tamil", active: true },
        { code: "te", name: "Telugu", active: true },
        { code: "bn", name: "Bengali", active: true },
        { code: "mr", name: "Marathi", active: true },
        { code: "gu", name: "Gujarati", active: true },
        { code: "kn", name: "Kannada", active: true }
    ]
};

/* ============ AI Legal Knowledge Base ============ */
const LEGAL_KB = [
    { keywords: ["420", "cheating", "fraud", "deception", "deceive"], topic: "Section 420 IPC - Cheating", response: "Section 420 IPC deals with cheating and dishonestly inducing delivery of property.\n\nKey points:\n• Punishment: up to 7 years imprisonment and fine\n• Ingredients: (1) Deception, (2) Dishonest intention from the start, (3) Inducement of the person deceived, (4) Delivery of property or creation/alteration of a valuable security\n• Eligible for settlement/compounding only with court permission in many states\n\nRemedy: File FIR under Section 154 CrPC, or complaint under Section 190 CrPC before the Magistrate. For cheques that bounce, Section 138 NI Act applies (9 months limitation).\n\nResources: FIR at police station (e-FIR in Delhi/Maharashtra online portals) and evidence preservation is critical.", cites: ["Joseph Shine v. Union of India (2018)", "R. Rajagopala Reddy v. State of AP (1997)"] },
    { keywords: ["divorce", "separation", "marriage", "mutual consent", "marital"], topic: "Divorce Procedure in India", response: "Divorce can be claimed under the Hindu Marriage Act 1955, Special Marriage Act 1954, or personal laws.\n\nMutual Consent Divorce (Section 13B HMA):\n• Step 1: Joint petition before Family Court after 1 year of marriage\n• Step 2: First motion - court records consent\n• Step 3: 6-month cooling-off period (waivable by Supreme Court ruling, Amardeep Singh 2014)\n• Step 4: Second motion after 6-18 months; court passes decree\n\nContested divorce (Section 13 HMA) grounds: cruelty, adultery, desertion (2+ years), conversion, unsoundness of mind, leprosy, venereal disease, renunciation.\n\nNote: Alimony and custody decided separately; mediation is encouraged before contested trials.", cites: ["Amardeep Singh v. Harveen Kaur (2014)", "K.A. Abdul Jaleel v. T.A. Shahida (2003)"] },
    { keywords: ["consumer", "complaint", "deficiency", "refund", "goods", "service"], topic: "Consumer Court Complaint Process", response: "Consumer complaints fall under the Consumer Protection Act, 2019 (replaces 1986 Act).\n\nThree-tier system:\n• District Commission: up to 1 crore value\n• State Commission: 1 crore - 10 crore\n• National Commission: above 10 crore\n\nProcess:\n1. Send a legal notice to the opposite party (14 days)\n2. File complaint in e-Daakhil portal with fee (100 - 2,000 depending on claim)\n3. Opposite party replies within 30 days\n4. Evidence, hearing, and final order usually within 3-6 months\n5. Appeal to next tier within 45 days\n\nLimitation: 2 years from the date of the cause of action.\n\nKey remedies: refund with interest (up to 18% p.a.), compensation for loss/mental agony, litigation costs.", cites: ["DDA v. B.P. Shukla (2000)", "Natraj Constructions v. Union of India (1986)"] },
    { keywords: ["property", "registration", "sale deed", "buy", "purchase", "flat", "land", "stamp"], topic: "Property Registration Steps", response: "Property purchase registration in India:\n\n1. Title verification - conduct a title search of 30-33 years at the Sub-Registrar's office; obtain encumbrance certificate\n2. Drafting Sale Deed - include complete property details, boundaries, schedule\n3. Stamp duty payment - varies by state (Delhi 6%, Maharashtra 6%+2% surcharge, UP 7%) - non-payment attracts 2-3x penalty\n4. Registration at Sub-Registrar office (within 4 months of execution)\n5. Pay registration fee (~1% of consideration) and apply for mutation/khata with the local municipal authority\n\nImportant: The buyer and seller must appear physically or via registered attorney. Always check for bank loans/liens before payment. Also verify sanctioned building plans for new constructions. Since 2013, sale deeds require photographs and biometrics in most states.", cites: [] },
    { keywords: ["bail", "anticipatory", "regular bail", "jail", "arrest"], topic: "Bail Application Process", response: "Bail types under BNSS (formerly CrPC):\n\n• Regular bail (Section 480 BNSS): filed by accused after arrest; court considers nature of offence, evidence, flight risk\n• Anticipatory bail (Section 482 BNSS / 438 CrPC): filed BEFORE arrest when arrest is anticipated, before Sessions Court or High Court\n• Interim bail / default bail: if charge sheet not filed within statutory period (60/90 days)\n\nProcess: Application drafted by advocate → filed with court → prosecution's reply → order. For bailable offences bail is a right (Section 478 BNSS); for non-bailable offences it is discretionary with stringent conditions for serious offences.\n\nKey authorities: Additional Sessions Judge (previously Magistrate), Sessions Court, High Court, and Supreme Court for special cases.\n\nUrgent tip: Preserve identity documents, employment proof, permanent address proof, and undertake to cooperate with investigation to strengthen bail arguments.", cites: ["Govind Dhondu Barve v. State of Maharashtra (1980)", "D.K. Basu v. State of WB (1997)"] },
    { keywords: ["rti", "right to information", "information", "transparency"], topic: "RTI Filing Procedure", response: "Right to Information Act, 2005 process:\n\n1. Application: Address a PIO (Public Information Officer) of the public authority in writing/by email; describe the information clearly; no reasons required\n2. Fees: 10 rupees (some states free/waived for BPL); first hour of inspection free\n3. Timeline: Reply within 30 days (48 hours for life/liberty matters); deemed refusal if no reply\n4. First appeal: within 30 days of refusal/dissatisfaction to the First Appellate Authority\n5. Second appeal: within 90 days to the Central/State Information Commission - can impose penalties up to 25,000 on erring PIOs\n\nTips: Sample formats available from RTI websites (rti.gov.in). Seek certified copies by paying 2 per page. Insider tip: asking for 'noting portion' and file records yields richer responses.", cites: [] },
    { keywords: ["legal notice", "notice", "sue", "demand"], topic: "Legal Notice Drafting", response: "A legal notice is the formal pre-litigation demand.\n\nContents:\n• Names and addresses of parties\n• Chronology of facts with dates\n• Breach/claim details with amounts\n• Demand + deadline (usually 15-30 days)\n• Warning of legal action if ignored\n\nServed via: registered post AD, speed post, or courier with acknowledgement. Keep proof of service and acknowledgement - crucial evidence.\n\nSection 138 NI Act and landlord-tenant matters REQUIRE mandatory legal notice; other civil disputes benefit from it (settlement + cost recovery).\n\nA well-drafted notice resolves ~30% of matters without court.", cites: [] },
    { keywords: ["dowry", "498a", "cruelty", "husband", "wife", "domestic"], topic: "Section 498A IPC - Dowry & Cruelty", response: "Section 498A IPC criminalizes cruelty by husband or his relatives toward a wife:\n\n• Cruelty includes: wilful conduct likely to drive wife to suicide or grave injury; harassment with demand for dowry\n• Punishment: up to 3 years imprisonment + fine\n• Cognizable, non-bailable (bail after court grant), non-compoundable (per Arnesh Kumar, 2014 procedure safeguards apply)\n\nImportant safeguards (Arnesh Kumar v. State of Bihar, 2014):\n• Arrest only with prior permission of Magistrate in cases with < 7 years punishment\n• Mandatory arrest memo and family notification (D.K. Basu)\n• Police must follow Section 41A CrPC: notice to appear instead of arrest\n\nAlternative remedies: DV Act 2005 protection/custody/maintenance orders, maintenance under Section 125 CrPC / 40s BNSS, and mediation for reconciliation.", cites: ["Arnesh Kumar v. State of Bihar (2014)", "D.K. Basu v. State of WB (1997)"] },
    { keywords: ["writ", "habeas corpus", "mandamus", "certiorari", "fundamental right", "article 32", "article 226"], topic: "Writ Petitions", response: "Writs are constitutional remedies:\n\n• Article 32 - Supreme Court (fundamental rights only)\n• Article 226 - High Court (fundamental rights + legal rights)\n\nFive writs:\n1. Habeas corpus - release from illegal detention\n2. Mandamus - compel public duty performance\n3. Prohibition - stop subordinate court from exceeding jurisdiction\n4. Certiorari - quash illegal orders\n5. Quo warranto - challenge illegal public office occupation\n\nAlso PIL (Public Interest Litigation) under relaxed locus standi for public causes.\n\nProcess: Draft writ petition with grounds → file with court registry → notice to respondents → interim relief often granted in urgent matters.\n\nTime: matters of urgency (habeas) are listed within days; others 3-12 months.", cites: ["S.R. Bommai v. Union of India (1994)", "PUCL v. Union of India (1997)"] },
    { keywords: ["gst", "tax", "income tax", "returns", "filing"], topic: "Taxation Basics", response: "Income Tax fundamentals:\n\n• Return filing: due date 31 July (non-audit cases); belated returns allowed with fee\n• Income categories: salary, house property, business/profession, capital gains, other sources\n• Exemption regime (2020): income up to 3 lakh exempt; 5% slab up to 7 lakh, 10% up to 10 lakh, 15% up to 12L, 20% up to 15L, 30% above\n• Old regime: deductions under 80C (1.5L), 80D (health), HRA, LTA etc.\n• Fees/penalties: late filing fee up to 5,000; under-reporting penalties 50-200% of tax\n\nGST basics:\n• Registration threshold: 40 lakh turnover (goods), 20 lakh (services)\n• Monthly GSTR-1/IFF and GSTR-3B filings\n• ITC (input tax credit) must be claimed within prescribed timelines (pre-Nov 2021 position revived)\n\nRemedies for tax disputes: Rectification under Sec 154, appeal to CIT(A), ITAT, High Court. GST portal appeals within 3 months.", cites: ["GE India Industrial v. CIT (2007)", "Tata Consultancy Services v. State of AP (2005)"] },
    { keywords: ["custody", "child", "guardian", "parent"], topic: "Child Custody Law", response: "Child custody principles:\n\n• Paramount consideration: welfare of the child (not parental rights)\n• Guardian and Wards Act 1890 + Hindu Minority and Guardianship Act 1956 govern\n• Mother is natural guardian for children below 5 years\n• Custody types: sole, joint/shared, visitation rights\n\nFactors courts weigh: child's age and preference (mature child), character of parents, existing bonds, stability of home environment, financial capacity, and continuity of schooling.\n\nProcedure: Petition in Family Court; interim custody orders within weeks; contested trials 6-18 months. Mediation strongly encouraged.\n\nEnforcement: Child recovery petitions under Habeas Corpus if the child is wrongfully retained.", cites: ["K.A. Abdul Jaleel v. T.A. Shahida (2003)", "Aravind v. State of Kerala (2017)"] },
    { keywords: ["375", "rape", "sexual assault", "posh", "harassment"], topic: "Sexual Offences & POSH", response: "Sexual offence provisions (BNSS/Bharatiya Nyaya Sanhita 2023):\n\n• Section 63 BNS (rape): 10 years to life imprisonment; aggravated forms 20 years/life\n• Consent definition: clear, voluntary, affirmative - absence of resistance not consent\n• Marital rape: not criminalized except wife aged 15-18; pending litigation\n• Section 51 BNS: sexual harassment at workplace (replaces 354A IPC)\n\nPOSH Act 2013 requires:\n• Every employer (10+ employees) to constitute Internal Committee (ICC)\n• 4-member minimum, 50% women, presiding officer must be senior woman\n• Complaint to ICC within 3 months of incident (extension allowed)\n• Inquiry mandatory, report within 90 days, action within 60 days\n\nConfidentiality: sections 16 POSH make disclosure punishable. False complaints actionable separately.", cites: ["Vishaka v. State of Rajasthan (1997)"] },
    { keywords: ["will", "succession", "inheritance", "property", "legal heir", "probate"], topic: "Wills & Succession", response: "Succession law essentials:\n\nIntestate succession (no will):\n• Hindu Succession Act 1956: Class I heirs (spouse, children, mother) get equal shares; daughters have equal coparcenary rights since 2005 (Rekha Devi, 2014)\n• Muslim law: Shariat-determined shares\n• Christian/Parsi: Indian Succession Act 1925\n\nWith a WILL:\n• Execute on plain paper with 2 witnesses (valid everywhere except Kolkata, Mumbai, Chennai where probate needed for some cases)\n• Registration optional but recommended\n• Will can be revoked/amended anytime before death\n\nProbate: court certification process for executing the will; mandatory for jurisdiction cities in specified cases.\n\nEstate planning: nomination (bank, shares, insurance), joint tenancy, and trust structures for HNI estates.", cites: ["Rekha Devi v. State of UP (2014)"] },
    { keywords: ["cheque", "138", "bounce", "dishonour"], topic: "Cheque Bounce - Section 138 NI Act", response: "Cheque dishonour process under Section 138 NI Act:\n\nRequirements:\n1. Cheque issued for debt/liability\n2. Presented within validity (3 months)\n3. Dishonoured with memo 'insufficient funds'\n4. Legal notice within 30 days of dishonour memo\n5. No payment within 15 days of notice\n6. Complaint filed within 30 days from expiry of 15-day window\n\nPenalty: up to 2x cheque amount or 2 years imprisonment (summons trial).\n\nImportant: compulsory attendance can be waived (Bhaskar Industries, 2001); compoundable with court consent; recovery proceedings possible in parallel.\n\nSettlement option: one-time payment + withdrawal of complaint with mutual terms.", cites: [] },
    { keywords: ["labour", "termination", "dismissal", "employee", "vrs", "retrenchment"], topic: "Wrongful Termination & Labour Rights", response: "Employee termination protections:\n\n• Industrial Disputes Act: retrenchment requires 30-60 days notice + compensation (15 days wages per year served)\n• Standing orders / service rules: must be followed strictly; violation = illegal termination\n• Workmen: severance = 15 days wages per completed year\n• Employees' State Insurance / PF: deductions must be credited; non-credit is an offence\n\nRemedies:\n1. Raise dispute with Labour Commissioner within 3 years\n2. Civil suit for wrongful termination\n3. Industrial Tribunal reference for workmen\n\nKey judgments: reinstatement with back wages in genuine illegal terminations; compensation in lieu where trust is broken.\n\nAlso: POSH violations, maternity benefit, and equal pay claims under Equal Remuneration Act.", cites: ["Vishaka v. State of Rajasthan (1997)", "Air India Cabin Crew Assn v. Yeshaswinee Merchant (2003)"] },
    { keywords: ["landlord", "tenant", "eviction", "rent", "lease"], topic: "Rent & Eviction Laws", response: "Rent control and eviction:\n\n• Model Tenancy Act 2021 (adopting states): fixed 3-year tenure, standard rent rules\n• Delhi Rent Act 1995 / state rent control acts: eviction only on 7+ specific grounds\n• Civil courts: summary suits for recovery of possession of premises\n\nGrounds for eviction: non-payment of rent (2 consecutive months), subletting without consent, damage, breach of conditions, bonafide requirement of landlord (varies by state).\n\nSecurity deposit: typically 2 months rent (varies); interest rules differ by state.\n\nProcedure: legal notice → civil suit / rent control application → trial 1-3 years. Tribunals and fast-track options in some states.\n\nLesson: ALWAYS register the rental agreement and sign on 100-rupee stamp paper minimum.", cites: ["Hakim Firdous Ali v. State of Delhi (1981)", "L. Babu Ram v. Raghunathji (1976)"] },
    { keywords: ["arbitration", "dispute", "adr", "mediation", "conciliation"], topic: "Arbitration & Mediation", response: "Alternative Dispute Resolution:\n\nArbitration (Arbitration & Conciliation Act 1996, as amended 2015/2019):\n• Arbitration agreement mandatory for court referral\n• Arbitral tribunal of 1-3 arbitrators (Section 11 appointment incl. High Court)\n• Award binding; challenge limited to Section 34 grounds (fraud, bias, public policy)\n• Timeline: arbitral award within 12 months (extendable 6)\n\nMediation:\n• Part of pre-institution mediation mandate since 2019 amendment (commercial disputes)\n• Mediated settlement agreement has enforceability under Mediation Act 2023\n\nFamily matters: Section 9 FLA - mandatory pre-litigation mediation attempt first.\n\nCosts: arbitration = first day hearing fee (arbitrator appointment + 4 hearings against 6 for court); court litigation adversarial and often slower.", cites: ["K.K. Modi v. K.N. Modi (1998)"] },
    { keywords: ["insolvency", "ibc", "bankruptcy", "nclt", "resolution"], topic: "Insolvency & Bankruptcy Code", response: "IBC 2016 process overview:\n\n• Purpose: time-bound resolution of corporate insolvency\n• Initiation: financial creditor (Sec 7), operational creditor (Sec 9), corporate debtor (Sec 10)\n• Timeline: CIRP must complete within 330 days (extensions rare)\n• Committee of Creditors (CoC): voting rights by financial debt\nd\n• Resolution plan must be approved by 66% CoC vote and satisfy NCLT\n\nKey features:\n• Moratorium: stays all claims/proceedings during CIRP\n• Resolution applicant eligibility (Sec 29A) restrictions on promoters with NPAs\n• Liquidation waterfall: secured creditors → workmen dues (capped) → unsecured creditors → shareholders\n\nPersonal guarantors: insolvency process now extendable (2019 amendment).\n\nAlternatives: One Time Settlement (OTS), pre-packaged insolvency (2021) for MSMEs.", cites: [] },
    { keywords: ["possession", "adverse", "property", "encroachment"], topic: "Possession & Encroachment", response: "Possession law essentials:\n\n• Lawful possession protected by specific relief; summary eviction for licensees (Section 6 Specific Relief Act)\n• Adverse possession: 12 years continuous, open, hostile possession extinguishes title (Limitation Act Article 65)\n• Co-owners: possession is deemed joint; ouster of one co-owner requires open assertion\n\nRemedies for encroachment:\n1. Injunction suit (temporary + permanent)\n2. Declaration + possession suit (Section 34/38 Specific Relief Act)\n3. Police/green channel for public land\n4. Legal notice before suit\n\nThe burden of proving adverse possession lies on the encroacher; courts require 'clear and unequivocal' evidence (higher standard for government land: 30 years).", cites: ["L. Babu Ram v. Raghunathji (1976)"] },
    { keywords: ["nominee", "insurance", "claim", "death", "policy"], topic: "Insurance Claims", response: "Insurance claim process:\n\nLife insurance:\n• Claim form + death certificate + policy documents\n• 30 days to settle after documents; 15 days if awaited info\n• IRDAI mandate: settlement within declared timelines\n• Nominee gets money; legal heirs have equal rights as beneficiaries\n\nHealth insurance:\n• Cashless via network hospitals or reimbursement (14 days)\n• TPA/insurer may require pre-authorization\n\nMotor accident (third party):\n• Claims Tribunal - compensation structure under MV Act 2019\n• 'No fault' compensation: 50,000 death / 25,000 injury within 30 days\n\nIf claim unfairly repudiated: file consumer complaint (2-year limitation), or approach IRDAI ombudsman free of cost.", cites: ["National Insurance Co v. Swaran Singh (2004)"] },
    { keywords: ["legal aid", "free", "poor", "bpl", "nala", "dlsa"], topic: "Free Legal Aid", response: "Free legal aid entitlements (Legal Services Authorities Act 1987):\n\nEligible categories: women, children, SC/ST, industrial workmen, income below threshold (up to 3 lakh gross), persons with disabilities, victims of trafficking, transgender persons, persons in custody.\n\nWhere to go:\n• National Legal Services Authority (NALSA): helpline 15100\n• State Legal Services Authority / District Legal Services Authority (DLSA) offices\n• High Court Legal Services Committees (8040410666 / 8040410667)\n\nServices: free lawyer representation, filing fees, drafting, court fees (Section 304 BNSS ensures counsel for undertrials).\n\nPre-arrest legal aid: 1969 Emergency Legal Aid Cell; 24-hour help at police stations via Front Offices.\n\nLocations: legal aid clinics at every police station, jail and taluk.", cites: ["Sheela Barse v. State of Maharashtra (1983)", "D.K. Basu v. State of WB (1997)"] },
    { keywords: ["environment", "pollution", "ngt", "clearance"], topic: "Environmental Remedies & NGT", response: "Environmental legal remedies:\n\nNGT (National Green Tribunal Act 2010):\n• Exclusive jurisdiction over environmental disputes (schedules: pollution, forests, biodiversity)\n• 6-month limitation for relief claims; appeals against orders/defaults\n• Wide remedies: compensation, restoration, penalty, injunctions\n\nKey principles: precautionary principle, polluter-pays, sustainable development, public trust doctrine.\n\nOther avenues:\n• Nuisance suits / civil courts for local pollution\n• PIL in High Court (Article 226)\n• Criminal complaints under Environmental (Protection) Act / Water Act / Air Act\n• CPCB/SPCB complaint mechanisms (24x7 portal with 7-day action mandate)\n\nDocument everything: photographs, lab reports, medical records, witnesses.", cites: ["Vellore Citizens Welfare Forum v. Union of India (1996)", "M.C. Mehta v. Union of India (2007)"] },
    { keywords: ["kharcha", "grievance", "police", "fir", "complaint", "report"], topic: "FIR Filing Procedure", response: "FIR & complaint procedure:\n\n• Section 154 CrPC / 173 BNSS: oral/written information to police → FIR mandatory for cognizable offences\n• Police must give a free copy of FIR\n• Refusal to register: complaint to S.P. (Section 154(3)); if still refused, Magistrate complaint (Section 190/200)\n\nZero FIR: can file anywhere; transferable to jurisdiction\n\nE-FIR & Apps: NCG portal (Delhi), e-FIR portals in states, Punjab, Maharashtra; emergency 112 / 1091 (women helpline).\n\nKnow your rights:\n• Gender-sensitized desks; women can register in presence of woman officer\n• FIR not required for non-cognizable offences — file complaint (Section 155 CrPC)\n• Bail on FIR for bailable offences is a right\n\nEvidence: preserve medical reports, messages, CCTV; statement under 164 recorded before Magistrate is stronger.", cites: ["R. Rajagopala Reddy v. State of AP (1997)"] },
    { keywords: ["gift", "sale", "agreement", "contract", "breach"], topic: "Contract Breach Remedies", response: "Contract law essentials (Indian Contract Act 1872):\n\nValid contract: offer, acceptance, consideration (2-sided), intention, capacity, legality.\n\nBreach remedies:\n• Damages: Section 73 - those 'arising naturally' or in contemplation of parties; special damages for notice of special circumstances\n• Specific performance: Specific Relief Act - only when money inadequate (land, unique goods)\n• Injunctions: prohibitory/mandatory - stop/force doing something\n• Quantum meruit: reasonable value for partially performed work\n• Liquidated damages: agreed penalty enforceable only if reasonable estimate\n\nLimitation: 3 years for contract suits.\n\nPractical steps: written agreements, exchange of emails, track deliverables, legal notice before litigation.", cites: ["K.K. Modi v. K.N. Modi (1998)"] },
    { keywords: ["bonus", "pf", "gratuity", "salary", "wages"], topic: "Wage & Benefit Laws", response: "Employer obligations:\n\n• EPF: 12% employee + 12% employer (8.67% PF + 3.67% EPS); must be remitted by 15th of following month\n• ESI (wage limit 21,000/month): 0.75% employee, 3.25% employer\n• Gratuity (Payment of Gratuity Act 1972): 15 days wages per year after 5 years continuous service - 4.81% employer contribution\n• Bonus: 8.33-20% as per Payment of Bonus Act (eligibility threshold 21,000)\n• Minimum Wages / Code on Wages 2019: state-wise notified rates\n\nNon-payment remedies:\n1. EPFO complaint (regional office) / e-complaint portal - criminal liability u/s 406/409 IPC for diversion\n2. Labour Commissioner complaint\n3. Civil suit for recovery with interest\n\nMaternity Benefit Act: 26 weeks paid leave; prohibition of dismissal during pregnancy.", cites: ["Air India Cabin Crew Assn v. Yeshaswinee Merchant (2003)"] },
    { keywords: ["salary", "termination", "notice period", "bond"], topic: "Employee Bonds & Notice Periods", response: "Employee bond & notice period law:\n\n• Bonds requiring payment of liquidated sums are enforceable only if reasonable and with actual training costs\n• Courts reduced exorbitant bond amounts; 'genuine damages' standard (State Bank of India v. Ajit Jain, 1995)\n• Notice period: contract governs; statutory minimums differ (Shops & Establishments Acts)\n• Garden leave / non-compete: non-compete restrictions post-employment generally unenforceable in India (only during employment valid)\n\nIf employer withholds salary/experience letter:\n• Serve legal notice\n• Complaint to Labour Commissioner\n• Suit for salary recovery (wages are a preferential claim)\n\nEmployees should document: appointment letter, salary slips, PF records, and company policies in force at time of joining.", cites: ["State Bank of India v. Ajit Jain (1995)"] }
];

/* ============ Flagged Government Lawyers (complaint analytics) ============ */
const FLAGGED_LAWYERS = [
    { name: "Adv. S. K. Pandey", type: "government", location: "Patna High Court", flags: ["6 consecutive missed hearings", "Pattern of case withdrawals (11)", "Complaint-to-case ratio 1:14"], severity: "high", barNumber: "BR/4206/2007" },
    { name: "Adv. Ram Singh Yadav", type: "government", location: "Allahabad HC", flags: ["3 fee collections without progress", "Extended inactivity 8 months"], severity: "medium", barNumber: "UP/8865/2002" },
    { name: "Adv. D. N. Chauhan", type: "government", location: "District Court, Ghaziabad", flags: ["Demanded unofficial fees", "2 complaints in 12 months"], severity: "high", barNumber: "UP/5841/1998" },
    { name: "Adv. K. B. Nayak", type: "public-prosecutor", location: "Nagpur Sessions Court", flags: ["Inactivity flagged 2 cycles", "1 complaint under review"], severity: "low", barNumber: "Mah/3902/2004" }
];