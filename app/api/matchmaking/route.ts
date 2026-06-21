export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

interface MatchItem {
  category: 'Venture Capitalist' | 'Regional Incubator' | 'Complementary Peer Founder';
  name: string;
  details: string;
  value_proposition: string;
  is_wildcard: boolean;
  wildcard_reason: string;
  alignment_score: number;
}

interface MatchmakingResponse {
  matches: MatchItem[];
}

// Programmatic Blind Pitch Matching Mode filter: strips demographics, regions, and buzzwords
function applyBlindMatchingFilter(text: string): string {
  if (!text) return '';
  const wordsToRemove = [
    // Demographics/Audience
    'urban', 'suburban', 'rural', 'high-rise', 'apartment', 'city', 'neighborhood', 'local',
    'teenager', 'adult', 'kid', 'parent', 'toddler', 'freelancer', 'creator', 'student',
    'professional', 'stranger', 'people', 'busy', 'working class', 'middle class', 'rich',
    // Regional/Geographic
    'chicago', 'new york', 'san francisco', 'london', 'tokyo', 'local area',
    // Superficial Buzzwords
    'disruptive', 'synergy', 'growth hack', 'paradigm shift', 'hyper-local', 'next-gen',
    'cutting-edge', 'revolutionize', 'world-class', 'game-changing', 'uber for', 'airbnb for'
  ];
  let cleaned = text;
  wordsToRemove.forEach(word => {
    const regex = new RegExp(`\\b${word}s?\\b`, 'gi');
    cleaned = cleaned.replace(regex, '[REDACTED_CONTEXT]');
  });
  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { business_model_parameters, target_demographic_strings, risk_vector_scores } = body;

    const coreIdea = business_model_parameters?.core_idea || '';
    const biggestAssumption = business_model_parameters?.biggest_assumption || '';
    const targetAudience = target_demographic_strings?.join(', ') || '';

    // Apply Blind Pitch filter to strip non-essential demographic & buzzword indicators
    const blindCoreIdea = applyBlindMatchingFilter(coreIdea);
    const blindAssumption = applyBlindMatchingFilter(biggestAssumption);
    const blindAudience = applyBlindMatchingFilter(targetAudience);

    const compiledBlindPayload = {
      business_model_parameters: {
        core_idea: blindCoreIdea,
        biggest_assumption: blindAssumption,
        categories: business_model_parameters?.categories || []
      },
      milestone_metrics: {
        clarity_score: risk_vector_scores?.clarity_score || 50,
        adoption_score: risk_vector_scores?.adoption_score || 50,
        churn_risk: risk_vector_scores?.churn_risk || '50% MEDIUM RISK',
        milestones_validated: risk_vector_scores?.milestones_validated || 0,
        total_milestones: risk_vector_scores?.total_milestones || 3
      }
    };

    // Attempt Gemini call
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const client = new GoogleGenerativeAI(geminiApiKey);
        const responseSchema = {
          type: SchemaType.OBJECT,
          properties: {
            matches: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  category: { type: SchemaType.STRING },
                  name: { type: SchemaType.STRING },
                  details: { type: SchemaType.STRING },
                  value_proposition: { type: SchemaType.STRING },
                  is_wildcard: { type: SchemaType.BOOLEAN },
                  wildcard_reason: { type: SchemaType.STRING },
                  alignment_score: { type: SchemaType.INTEGER }
                },
                required: ['category', 'name', 'details', 'value_proposition', 'is_wildcard', 'alignment_score']
              }
            }
          },
          required: ['matches']
        };

        const systemInstruction = `You are a blind, non-biased matchmaking engine connecting validated startups to Venture Capitalists, Regional Incubators, and Complementary Peer Founders.
Your matchmaking payload is programmatically stripped of demographics, buzzwords, and regional indicators to eliminate systemic gatekeeping bias. You MUST evaluate alignment solely on objective milestone metrics, traction indicators, and core business mechanics.

You must return a structured JSON response containing exactly 15 matches (5 under category "Venture Capitalist", 5 under "Regional Incubator", and 5 under "Complementary Peer Founder").
Under EACH category:
- Exactly 1 out of the 5 profiles MUST be a "Wildcard" match (is_wildcard: true), representing a peer network, VC, or mentor positioned slightly outside the startup's primary vertical (e.g. if the startup is in route logistics, a wildcard might be in green transit or cloud optimization). Define a strong wildcard_reason explaining how it breaks algorithmic echo chambers.
- The remaining 4 profiles must be standard matches (is_wildcard: false).
- Provide highly realistic Names, Details, Value Propositions, and Alignment Scores (75-99).`;

        const userPrompt = `Generate the structured matchmaking matches based on the following blind, redacted business profile:
${JSON.stringify(compiledBlindPayload, null, 2)}`;

        const model = client.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction,
        });

        const response = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema as any,
          },
        });

        const responseText = response.response.text();
        const parsedResponse = JSON.parse(responseText);

        if (parsedResponse && Array.isArray(parsedResponse.matches)) {
          // Verify exact 20% wildcard metric programmatically to be double-safe
          const matches = enforceWildcardPercentages(parsedResponse.matches);
          return NextResponse.json({
            success: true,
            blind_payload: compiledBlindPayload,
            matches
          });
        }
      } catch (geminiError) {
        console.error('Gemini matchmaking call failed, rolling back to high-fidelity generator:', geminiError);
      }
    }

    // Fallback High-Fidelity Matchmaking Generator
    const matches = generateHighFidelityMatches(coreIdea, compiledBlindPayload);
    return NextResponse.json({
      success: true,
      blind_payload: compiledBlindPayload,
      matches,
      is_fallback: true
    });

  } catch (error) {
    console.error('Matchmaking API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown matchmaking error' },
      { status: 500 }
    );
  }
}

// Function to guarantee exactly 20% (1 per category) are wildcards
function enforceWildcardPercentages(matches: MatchItem[]): MatchItem[] {
  const categories: ('Venture Capitalist' | 'Regional Incubator' | 'Complementary Peer Founder')[] = [
    'Venture Capitalist',
    'Regional Incubator',
    'Complementary Peer Founder'
  ];

  categories.forEach(cat => {
    const catMatches = matches.filter(m => m.category === cat);
    if (catMatches.length === 0) return;

    // Reset wildcards
    catMatches.forEach(m => {
      m.is_wildcard = false;
      m.wildcard_reason = '';
    });

    // Make exactly 1 match a wildcard (e.g., the last one)
    const wildcardIndex = Math.min(4, catMatches.length - 1);
    if (catMatches[wildcardIndex]) {
      catMatches[wildcardIndex].is_wildcard = true;
      catMatches[wildcardIndex].wildcard_reason = `Cross-industry learning in adjacent technology spaces, deliberately introduced to break vertical-specific operational echo chambers.`;
    }
  });

  return matches;
}

// Custom Fallback Generator to guarantee production-ready fidelity matching target startup ideas
function generateHighFidelityMatches(coreIdea: string, blindPayload: any): MatchItem[] {
  const ideaLower = coreIdea.toLowerCase();
  
  // 1. Pet Grooming / Logistics / Service Fleet
  if (ideaLower.includes('pet') || ideaLower.includes('groom') || ideaLower.includes('van') || ideaLower.includes('dog')) {
    return [
      // Venture Capitalists
      {
        category: 'Venture Capitalist',
        name: 'Apex Ventures',
        details: 'Specializes in Pre-Seed Urban Logistics & Route Optimization',
        value_proposition: 'Provides $150k pre-seed funding, logistics dashboard tools, and a fleet operations mentorship network.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 94
      },
      {
        category: 'Venture Capitalist',
        name: 'Veloce Capital',
        details: 'Early Stage Mobility, Gig Supply Chains & Service Networks',
        value_proposition: 'Offers $250k initial checks alongside operational assistance in gig-economy supply recruitment.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 89
      },
      {
        category: 'Venture Capitalist',
        name: 'Beacon Horizon',
        details: 'Consumer Marketplace & Location-Based Services Fund',
        value_proposition: 'Specializes in B2C marketplaces, advising on localized customer acquisition strategies and pricing metrics.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 87
      },
      {
        category: 'Venture Capitalist',
        name: 'PrimeRun Ventures',
        details: 'Micro-fleet and Hyper-local Fulfillment Syndicate',
        value_proposition: 'Investment syndicate with deep knowledge of asset-heavy mobile models and vehicle depreciation management.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 81
      },
      {
        category: 'Venture Capitalist',
        name: 'Aero Green Partners',
        details: 'Smart Transit Infrastructure & Clean Fleet Electrification',
        value_proposition: 'Focuses on commercial EV transitions. Provides expertise in fleet charging infrastructure and green tax credits.',
        is_wildcard: true,
        wildcard_reason: 'While focused on green energy, their fleet expertise helps optimize route networks and offsets mobile fuel/charging challenges.',
        alignment_score: 78
      },

      // Regional Incubators
      {
        category: 'Regional Incubator',
        name: 'Launchpad Local',
        details: 'Structured Scale Program for Local Service Platforms',
        value_proposition: '12-week accelerator featuring pilot sandboxes, access to municipality parking agreements, and operations labs.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 91
      },
      {
        category: 'Regional Incubator',
        name: 'Metro Accelerator',
        details: 'Urban Transit & Gig Labor Development Cohort',
        value_proposition: 'Offers co-working space, gig-labor compliance legal guides, and relationships with contractor networks.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 88
      },
      {
        category: 'Regional Incubator',
        name: 'Foundry North',
        details: 'Asset-Optimized Consumer Services Sandbox',
        value_proposition: 'Specialized program helping founders design safety guidelines, customer trust frameworks, and liability policies.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 85
      },
      {
        category: 'Regional Incubator',
        name: 'Hub Centric',
        details: 'Direct-to-Consumer Physical Operations Lab',
        value_proposition: 'Provides physical hardware prototyping space, fleet tracking API credits, and warehouse spaces.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 82
      },
      {
        category: 'Regional Incubator',
        name: 'Circular City Labs',
        details: 'Urban Waste & Efficiency Resource Incubator',
        value_proposition: 'Accelerator advising on urban route density optimization to minimize fuel emissions.',
        is_wildcard: true,
        wildcard_reason: 'Provides deep mentorship on mapping algorithms and carbon offset incentives, taking a green angle on routing.',
        alignment_score: 76
      },

      // Peer Networks
      {
        category: 'Complementary Peer Founder',
        name: 'Founders Circle',
        details: 'Micro-group of 4 Local Marketplace Creators',
        value_proposition: 'Weekly peer advisory meetings focused on trust metrics, contractor engagement rates, and local user acquisition.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 96
      },
      {
        category: 'Complementary Peer Founder',
        name: 'Gig Dispatch Alliance',
        details: 'Peer Coalition of Routing & Delivery Founders',
        value_proposition: 'Slack workspace for sharing custom routing APIs, vehicle maintenance tricks, and driver onboarding pipelines.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 90
      },
      {
        category: 'Complementary Peer Founder',
        name: 'TrustGuard Networks',
        details: 'Peer Group of Home-Access Platform Builders',
        value_proposition: 'Active forum of founders sharing patterns on keyless entries, contractor background checking, and customer liability.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 86
      },
      {
        category: 'Complementary Peer Founder',
        name: 'SaaS-to-Physical Guild',
        details: 'Peer Group balancing Tech with Real World Operations',
        value_proposition: 'Monthly roundtable discussions centered around vehicle leasing contracts, field service equipment, and supply-chain logistics.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 83
      },
      {
        category: 'Complementary Peer Founder',
        name: 'VoltShare Connect',
        details: 'Founder of a Decentralized Charging Network',
        value_proposition: 'Direct Slack access to founder sharing micro-grid resource management, battery life cycles, and localized charging access.',
        is_wildcard: true,
        wildcard_reason: 'Operating in smart energy sharing, this founder provides peer insights on route-to-charger mapping and fleet electricity logistics.',
        alignment_score: 79
      }
    ];
  }

  // 2. Freelance Contract / AI Compliance / Legal Tech
  if (ideaLower.includes('contract') || ideaLower.includes('legal') || ideaLower.includes('compliance') || ideaLower.includes('freelance') || ideaLower.includes('editor')) {
    return [
      // Venture Capitalists
      {
        category: 'Venture Capitalist',
        name: 'LexTech Ventures',
        details: 'Specializes in Pre-Seed Legal Tech & Automated Workflows',
        value_proposition: 'Provides $200k pre-seed checks, proprietary legal dataset access, and connections to general counsels.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 95
      },
      {
        category: 'Venture Capitalist',
        name: 'SaaS Alpha Fund',
        details: 'Early Stage B2B Workflow & AI Application Capital',
        value_proposition: 'Offers $300k seed funding, GTM mentorship for developer tools, and an corporate buyer network.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 90
      },
      {
        category: 'Venture Capitalist',
        name: 'Trust Seed Partners',
        details: 'B2B Compliance & Document Integrity Pioneers',
        value_proposition: 'Focuses on security, digital signatures, and audit trails. Advises on corporate regulatory compliance.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 86
      },
      {
        category: 'Venture Capitalist',
        name: 'DecentWork Ventures',
        details: 'Gig-Economy, Future of Work & Creator Economy Fund',
        value_proposition: 'Invests in software solutions that optimize freelancer infrastructure, tax planning, and client relations.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 84
      },
      {
        category: 'Venture Capitalist',
        name: 'SecureCore Capital',
        details: 'Enterprise Cyber Security & Threat Intelligence Fund',
        value_proposition: 'Invests in zero-trust architectures. Offers deep mentorship in data privacy compliance and leak protection.',
        is_wildcard: true,
        wildcard_reason: 'While focused on cyber threats, their security audits ensure that AI-drafted legal contracts satisfy strict corporate file security.',
        alignment_score: 77
      },

      // Regional Incubators
      {
        category: 'Regional Incubator',
        name: 'Launchpad Legal',
        details: 'Structured Scale Program for Legal SaaS Products',
        value_proposition: '12-week program including legal advisor reviews, liability sandboxes, and bar association compliance labs.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 92
      },
      {
        category: 'Regional Incubator',
        name: 'Creator Hub Accelerator',
        details: 'Creator Infrastructure & Tools Incubator',
        value_proposition: 'Offers co-working workspace, pilot testing with 500+ freelance content creators, and marketing channels.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 89
      },
      {
        category: 'Regional Incubator',
        name: 'B2B Scale Labs',
        details: 'Pre-Seed SaaS Metric Optimization Studio',
        value_proposition: 'Assists founders in designing self-serve customer onboarding, ARR models, and product-led growth (PLG) loops.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 84
      },
      {
        category: 'Regional Incubator',
        name: 'Integrity Sandbox',
        details: 'Algorithmic Safety & Compliance Accelerator',
        value_proposition: 'Provides compute grants, AI bias auditing tools, and connections to regulatory policy advisors.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 81
      },
      {
        category: 'Regional Incubator',
        name: 'Cyber Shield Incubator',
        details: 'Secure Document Exchange & Encryption Cohort',
        value_proposition: 'Specialized lab focusing on end-to-end encryption protocols and digital metadata sanitization.',
        is_wildcard: true,
        wildcard_reason: 'Provides deep mentorship on secure metadata scrubbing, assisting legal compliance founders in protecting client contract secrets.',
        alignment_score: 79
      },

      // Peer Networks
      {
        category: 'Complementary Peer Founder',
        name: 'Founders Circle',
        details: 'Micro-group of 4 Freelance Infrastructure Creators',
        value_proposition: 'Weekly peer discussions centered on API pricing, contract generation templates, and freelancer trust metrics.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 96
      },
      {
        category: 'Complementary Peer Founder',
        name: 'B2B SaaS Guild',
        details: 'Peer Coalition of Developer & Compliance SaaS Builders',
        value_proposition: 'Slack community for sharing Stripe billing hooks, enterprise security questionnaires, and SLA structures.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 91
      },
      {
        category: 'Complementary Peer Founder',
        name: 'LegalTech Innovators',
        details: 'Peer Alliance of AI Legal Drafting Founders',
        value_proposition: 'Monthly roundtables detailing LLM prompt optimization, training data legalities, and AI liability policies.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 88
      },
      {
        category: 'Complementary Peer Founder',
        name: 'Creator Infrastructure Alliance',
        details: 'Founders building back-office tools for the creator economy',
        value_proposition: 'Active forum detailing creator payment corridors, multi-currency cash flow, and tax filing APIs.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 82
      },
      {
        category: 'Complementary Peer Founder',
        name: 'SecureHealth Connect',
        details: 'Founder of a HIPAA-Compliant Medical Records CRM',
        value_proposition: 'Peer advisory on building strict audit trails, handling sensitive personal identifiers, and database isolation.',
        is_wildcard: true,
        wildcard_reason: 'Positioned in healthcare software, this founder shares battle-tested strategies for database security and strict document privacy.',
        alignment_score: 75
      }
    ];
  }

  // 3. Meal Kits / Subscription Box / Busy Parents
  if (ideaLower.includes('meal') || ideaLower.includes('prep') || ideaLower.includes('food') || ideaLower.includes('box') || ideaLower.includes('parent') || ideaLower.includes('chef')) {
    return [
      // Venture Capitalists
      {
        category: 'Venture Capitalist',
        name: 'Apex Ventures',
        details: 'Specializes in Pre-Seed Cold Chain Supply & Box Logistics',
        value_proposition: 'Provides $150k pre-seed checks, packaging vendor relationships, and shipping network audits.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 93
      },
      {
        category: 'Venture Capitalist',
        name: 'Consumer Route Capital',
        details: 'Early Stage Direct-to-Consumer & Subscription Commerce',
        value_proposition: 'Offers $250k seed funding, cohort-retention analytics toolkits, and marketing agency introductions.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 90
      },
      {
        category: 'Venture Capitalist',
        name: 'Harvest Seed Partners',
        details: 'FoodTech, Kitchen Operations & Local Sourcing Syndicate',
        value_proposition: 'Syndicate with deep knowledge of commercial kitchens, farm-to-table supply chains, and safety protocols.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 86
      },
      {
        category: 'Venture Capitalist',
        name: 'Subscrilla Capital',
        details: 'SaaS & Physical Subscription Recurring Revenue Fund',
        value_proposition: 'Invests strictly in recurring revenue models. Focuses on customer lifetime value (LTV) and churn reduction.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 83
      },
      {
        category: 'Venture Capitalist',
        name: 'Aero Green Capital',
        details: 'Sustainable Packaging, Eco-Transit & Supply Chain Carbon Offsets',
        value_proposition: 'Invests in biodegradable solutions. Helps brands transition to zero-plastic supply chains.',
        is_wildcard: true,
        wildcard_reason: 'While focused on sustainability, their bio-packaging connections help food founders reduce thermal box costs and plastic taxes.',
        alignment_score: 79
      },

      // Regional Incubators
      {
        category: 'Regional Incubator',
        name: 'Launchpad Local',
        details: 'Structured Scale Program for FoodTech and Supply Chain',
        value_proposition: '12-week program including access to shared incubator kitchens, cold storage, and food handler certifications.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 92
      },
      {
        category: 'Regional Incubator',
        name: 'DTC Accelerator',
        details: 'Subscription Box Operations & Cohort Engagement',
        value_proposition: 'Offers co-working, mentor networks for subscription landing page optimization, and packaging designers.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 88
      },
      {
        category: 'Regional Incubator',
        name: 'Metro Culinary Labs',
        details: 'Shared Commercial Cooking & Scale Laboratory',
        value_proposition: 'Provides shared food preparation workspace, FDA inspection compliance walkthroughs, and recipe scaling advice.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 85
      },
      {
        category: 'Regional Incubator',
        name: 'Hub Centric',
        details: 'Hyper-Local Fulfillment & Route Dispatch Lab',
        value_proposition: 'Provides physical logistics dispatch sandboxes, carrier rate negotiations, and shipping software.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 81
      },
      {
        category: 'Regional Incubator',
        name: 'Circular City Labs',
        details: 'Zero-Waste & Packaging Circularity Incubator',
        value_proposition: 'Specialized lab supporting reusable container logistics and local returns pickup systems.',
        is_wildcard: true,
        wildcard_reason: 'Provides valuable mentorship on reusable container loops, allowing subscription box founders to bypass single-use box packaging overhead.',
        alignment_score: 77
      },

      // Peer Networks
      {
        category: 'Complementary Peer Founder',
        name: 'Founders Circle',
        details: 'Micro-group of 4 Subscription Commerce Founders',
        value_proposition: 'Weekly peer roundtables centered on CAC-to-LTV ratios, subscription pricing strategies, and box design.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 95
      },
      {
        category: 'Complementary Peer Founder',
        name: 'FoodTech Founders Guild',
        details: 'Peer Alliance of Local Culinary Marketplace Creators',
        value_proposition: 'Slack workspace detailing commercial kitchen rental rates, regional food supply vendors, and local courier rates.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 91
      },
      {
        category: 'Complementary Peer Founder',
        name: 'DTC Logistics Alliance',
        details: 'Peer Network of Box Shipments & Courier Delivery',
        value_proposition: 'Active forum detailing regional carrier performance, dry ice shipping regulations, and custom box manufacturing.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 87
      },
      {
        category: 'Complementary Peer Founder',
        name: 'Family Brand Network',
        details: 'Founders targeting busy parents & dual-income homes',
        value_proposition: 'Roundtable on parent demographic trust patterns, family pricing structures, and school term schedules.',
        is_wildcard: false,
        wildcard_reason: '',
        alignment_score: 84
      },
      {
        category: 'Complementary Peer Founder',
        name: 'VoltShare Connect',
        details: 'Founder of a Decentralized Electric Courier Platform',
        value_proposition: 'Direct Slack exchange sharing fleet routing software, courier insurance plans, and dispatch logistics.',
        is_wildcard: true,
        wildcard_reason: 'Operating in smart courier transit, this peer sharing provides valuable routing advice for optimizing morning meal drop-offs.',
        alignment_score: 78
      }
    ];
  }

  // 4. Default Generic Tech Startup
  return [
    // Venture Capitalists
    {
      category: 'Venture Capitalist',
      name: 'Apex Ventures',
      details: 'Specializes in Pre-Seed B2B Software & Market Mechanics',
      value_proposition: 'Provides $150k pre-seed checks, go-to-market playbook guidance, and early stage talent hiring pipelines.',
      is_wildcard: false,
      wildcard_reason: '',
      alignment_score: 91
    },
    {
      category: 'Venture Capitalist',
      name: 'Veloce Capital',
      details: 'Early Stage Software-as-a-Service (SaaS) and Digital Platforms',
      value_proposition: 'Offers $250k initial funding along with operational help in SaaS sales structures and pricing modeling.',
      is_wildcard: false,
      wildcard_reason: '',
      alignment_score: 88
    },
    {
      category: 'Venture Capitalist',
      name: 'Beacon Horizon',
      details: 'Product-Led Growth & Digital Customer Acquisition Fund',
      value_proposition: 'Invests in high-growth software, providing metric audit resources and growth agency recommendations.',
      is_wildcard: false,
      wildcard_reason: '',
      alignment_score: 85
    },
    {
      category: 'Venture Capitalist',
      name: 'PrimeRun Ventures',
      details: 'Structured Workflow Optimization Syndicate',
      value_proposition: 'Syndicate investing in core software operations, helping founders scale automated backend pipelines.',
      is_wildcard: false,
      wildcard_reason: '',
      alignment_score: 81
    },
    {
      category: 'Venture Capitalist',
      name: 'Aero Green Partners',
      details: 'Sustainability Infrastructure & Carbon Management software',
      value_proposition: 'Focuses on sustainable software efficiency. Provides carbon footprint calculations and tax optimization.',
      is_wildcard: true,
      wildcard_reason: 'While focused on green software carbon metrics, their server load optimization strategies help scale high-volume API transaction flows.',
      alignment_score: 75
    },

    // Regional Incubators
    {
      category: 'Regional Incubator',
      name: 'Launchpad Local',
      details: 'Structured Scale Program for Tech Startups',
      value_proposition: '12-week accelerator containing pilot testing networks, marketing masterclasses, and corporate pitch nights.',
      is_wildcard: false,
      wildcard_reason: '',
      alignment_score: 90
    },
    {
      category: 'Regional Incubator',
      name: 'Metro Accelerator',
      details: 'Digital Product Design and Product-Market Fit Cohort',
      value_proposition: 'Offers digital workspace, design system mentor audits, and a database of pre-validated product testers.',
      is_wildcard: false,
      wildcard_reason: '',
      alignment_score: 87
    },
    {
      category: 'Regional Incubator',
      name: 'Foundry North',
      details: 'Self-Serve SaaS & PLG Sandbox Program',
      value_proposition: 'Incubator focusing on low-code MVP builders, digital signature integrations, and self-serve onboarding metrics.',
      is_wildcard: false,
      wildcard_reason: '',
      alignment_score: 84
    },
    {
      category: 'Regional Incubator',
      name: 'Hub Centric',
      details: 'Cloud Database Architecture & Scale Studio',
      value_proposition: 'Provides cloud compute grants, technical database mentoring, and load-testing simulation environments.',
      is_wildcard: false,
      wildcard_reason: '',
      alignment_score: 80
    },
    {
      category: 'Regional Incubator',
      name: 'Circular City Labs',
      details: 'Resource Circularity & Materials Lifecycle Incubator',
      value_proposition: 'Specialized lab supporting reusable assets and resource optimization software.',
      is_wildcard: true,
      wildcard_reason: 'Provides deep mentorship on asset sharing and localized database networks, taking a distributed angle on software scaling.',
      alignment_score: 76
    },

    // Peer Networks
    {
      category: 'Complementary Peer Founder',
      name: 'Founders Circle',
      details: 'Micro-group of 4 Software Platform Creators',
      value_proposition: 'Weekly peer mastermind meetings focused on SaaS metrics, Stripe integration, and customer support loops.',
      is_wildcard: false,
      wildcard_reason: '',
      alignment_score: 94
    },
    {
      category: 'Complementary Peer Founder',
      name: 'SaaS Scale Alliance',
      details: 'Peer Group of Product-Led Growth (PLG) Founders',
      value_proposition: 'Slack workspace sharing customer activation pipelines, analytics tool configurations, and conversion analytics.',
      is_wildcard: false,
      wildcard_reason: '',
      alignment_score: 89
    },
    {
      category: 'Complementary Peer Founder',
      name: 'TrustGuard Networks',
      details: 'Peer Group focused on App Privacy & User Trust',
      value_proposition: 'Active community of builders detailing terms of service, compliance checklists, and secure database isolation.',
      is_wildcard: false,
      wildcard_reason: '',
      alignment_score: 86
    },
    {
      category: 'Complementary Peer Founder',
      name: 'No-Code/Low-Code Guild',
      details: 'Peer Group scaling MVPs using visual tools and APIs',
      value_proposition: 'Monthly discussions centered around API limits, database synching, and transition to custom code bases.',
      is_wildcard: false,
      wildcard_reason: '',
      alignment_score: 82
    },
    {
      category: 'Complementary Peer Founder',
      name: 'VoltShare Connect',
      details: 'Founder of a Distributed EV Charging App',
      value_proposition: 'Direct Slack exchange with founder sharing scaling tips for high-volume API queries and user localization.',
      is_wildcard: true,
      wildcard_reason: 'Operating in mapping and hardware sharing, this founder provides peer insights on location tracking and geographic DB queries.',
      alignment_score: 77
    }
  ];
}
