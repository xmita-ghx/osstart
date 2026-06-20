import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { supabase } from '@/lib/supabase-server';

// Type definitions for the structured response
interface MicroStep {
  name: string;
  description: string;
}

interface MatrixItem {
  task_name: string;
  category: string;
  confidence_level: string;
  micro_steps: string[];
}

interface Simulation {
  churn_risk: string;
  adoption_score: number;
  logs: string[];
}

interface CrashTestResponse {
  clarity_score: number;
  current_sprint: string;
  simulation: Simulation;
  matrix: MatrixItem[];
  consultancy_brief: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const { core_idea, target_audience, biggest_assumption } = body;

    if (!core_idea || !target_audience || !biggest_assumption) {
      return NextResponse.json(
        {
          error: 'Missing required fields: core_idea, target_audience, biggest_assumption',
        },
        { status: 400 }
      );
    }

    // 2. Initialize Supabase server client
    if (!supabase) {
      throw new Error('Supabase client initialization failed');
    }

    // 3. Initialize Gemini API client
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const client = new GoogleGenerativeAI(geminiApiKey);

    // 4. Define the response schema for structured outputs
    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        clarity_score: { type: SchemaType.INTEGER },
        current_sprint: { type: SchemaType.STRING },
        simulation: {
          type: SchemaType.OBJECT,
          properties: {
            churn_risk: { type: SchemaType.STRING },
            adoption_score: { type: SchemaType.INTEGER },
            logs: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          },
          required: ['churn_risk', 'adoption_score', 'logs'],
        },
        matrix: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              task_name: { type: SchemaType.STRING },
              category: { type: SchemaType.STRING },
              confidence_level: { type: SchemaType.STRING },
              micro_steps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            },
            required: ['task_name', 'category', 'confidence_level', 'micro_steps'],
          },
        },
        consultancy_brief: { type: SchemaType.STRING },
      },
      required: ['clarity_score', 'current_sprint', 'simulation', 'matrix', 'consultancy_brief'],
    };

    // 5. Prepare system instruction
    const systemInstruction = `You are a hard-hitting startup validator and operational excellence advisor. Your role is to stress-test startup ideas with brutal honesty and provide actionable insights.

When analyzing a startup, you MUST execute the following three-stage process:

**STAGE 1: Market Stress Test**
- Simulate 1,000 virtual consumer personas based on the target_audience provided
- Calculate a "Churn Risk" as a percentage (e.g., "45% HIGH CHURN RISK")
- Calculate an "Adoption Score" from 0-100 representing market readiness
- Generate exactly 4 monospaced console logs detailing customer friction points
- Format logs as: "[WARN] 34% flagged cost concerns..." or "[CRITICAL] Poor onboarding UX..."

**STAGE 2: 30-Day Execution Matrix**
- Create exactly 3 core milestones for immediate execution
- Each milestone must have:
  - task_name: Clear, actionable milestone
  - category: One of "Market", "Financial", "Tech", "Operations"
  - confidence_level: "HIGH", "MEDIUM", or "LOW"
  - micro_steps: Exactly 3 operational micro-steps to achieve this milestone
- These form your execution roadmap for the next 30 days

**STAGE 3: AI Consultancy Brief**
- Write a direct, highly constructive Markdown "Consultancy Brief" (200-300 words)
- Expose core operational risks with specific evidence
- Include mitigation plans and growth opportunities
- Be constructive but unafraid to highlight potential pitfalls

Your response must be valid JSON matching the exact schema provided. Every field must be populated accurately.`;

    // Create the user prompt with the startup data
    const userPrompt = `Please analyze this startup idea and provide your complete assessment:

**Core Idea:** ${core_idea}

**Target Audience:** ${target_audience}

**Biggest Assumption:** ${biggest_assumption}

Execute your three-stage validation process and provide the full structured response.`;

    // 6. Call Gemini API with structured output
    const model = client.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
    });

    // Use generationConfig with responseSchema for structured outputs
    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema as any,
      },
    });

    // Extract and parse the response
    const responseText = response.response.text();
    let parsedResponse: CrashTestResponse;

    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', responseText);
      throw new Error('Invalid JSON response from Gemini API');
    }

    // 7. Insert data into Supabase
    // 7a. Insert into projects table
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        core_idea,
        target_audience,
        biggest_assumption,
        clarity_score: parsedResponse.clarity_score,
        current_sprint: parsedResponse.current_sprint,
      })
      .select('id');

    if (projectError) {
      console.error('Error inserting project:', projectError);
      throw new Error(`Failed to insert project: ${projectError.message}`);
    }

    if (!projectData || projectData.length === 0) {
      throw new Error('No project ID returned from insertion');
    }

    const project_id = projectData[0].id;

    // 7b. Batch insert matrix items
    if (parsedResponse.matrix && parsedResponse.matrix.length > 0) {
      const matrixItems = parsedResponse.matrix.map((item) => ({
        project_id,
        task_name: item.task_name,
        category: item.category,
        confidence_level: item.confidence_level,
        micro_steps: item.micro_steps,
      }));

      const { error: matrixError } = await supabase
        .from('execution_matrix')
        .insert(matrixItems);

      if (matrixError) {
        console.error('Error inserting execution matrix:', matrixError);
        throw new Error(`Failed to insert execution matrix: ${matrixError.message}`);
      }
    }

    // 7c. Insert simulation report
    const { error: reportError } = await supabase.from('simulation_reports').insert({
      project_id,
      churn_risk: parsedResponse.simulation.churn_risk,
      adoption_score: parsedResponse.simulation.adoption_score,
      logs: parsedResponse.simulation.logs,
      consultancy_brief: parsedResponse.consultancy_brief,
    });

    if (reportError) {
      console.error('Error inserting simulation report:', reportError);
      throw new Error(`Failed to insert simulation report: ${reportError.message}`);
    }

    // 8. Return response with project_id and full parsed data
    return NextResponse.json(
      {
        success: true,
        project_id,
        ...parsedResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
