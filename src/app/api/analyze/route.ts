import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const ANALYSIS_PROMPT = `あなたは心理分析の専門家である。
ユーザーが「影の法廷」で行った証言（嫉妬・怒り・喪失についての回答）から、その人物のコア価値観を特定せよ。

【価値観リスト（一部）】
- 達成: 目標達成、成功、結果を出すこと
- 誠実: 正直さ、約束を守ること、信頼
- 自由: 自己決定、束縛からの解放
- 成長: 学習、自己改善、スキル向上
- 貢献: 他者への奉仕、社会的意義
- 創造: 新しいものを生み出すこと
- 調和: 平和、バランス、争いの回避
- 安全: リスク回避、安定、保護
- 愛情: 親密さ、愛、つながり
- 承認: 認められること、尊敬、評価
- 権力: 影響力、コントロール、地位
- 快楽: 楽しみ、喜び、満足

【出力形式】
以下のJSON形式で返答せよ：
{
  "primaryValue": { "name": "価値観名", "confidence": 85, "evidence": "この価値観を示す証言の要約" },
  "secondaryValue": { "name": "価値観名", "confidence": 70, "evidence": "この価値観を示す証言の要約" },
  "tertiaryValue": { "name": "価値観名", "confidence": 60, "evidence": "この価値観を示す証言の要約" },
  "analysis": "総合分析（100文字以内）"
}`;

export async function POST(request: NextRequest) {
    try {
        const { envyResponses, rageResponses, lossResponses } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const prompt = `${ANALYSIS_PROMPT}

【被告人の証言記録】

■ 嫉妬フェーズ
${envyResponses.map((r: string, i: number) => `Q${i + 1}: ${r}`).join('\n')}

■ 怒りフェーズ
${rageResponses.map((r: string, i: number) => `Q${i + 1}: ${r}`).join('\n')}

■ 喪失フェーズ
${lossResponses.map((r: string, i: number) => `Q${i + 1}: ${r}`).join('\n')}

上記の証言から価値観を分析し、JSON形式で返答せよ。`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // JSONを抽出
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            return NextResponse.json(analysis);
        }

        return NextResponse.json({
            error: 'Failed to parse analysis',
            raw: text,
        });
    } catch (error) {
        console.error('Analysis API error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze responses' },
            { status: 500 }
        );
    }
}
