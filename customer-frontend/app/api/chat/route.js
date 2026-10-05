import { NextResponse } from 'next/server';
import { processCustomerMessage, searchProductsTool, getOrderStatusTool, getShippingInfoTool } from '../../../lib/aiAssistantEngine';

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], authenticatedUser = null, activeFaqs = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    // Rate-limiting / message length protection
    const sanitizedMessage = message.slice(0, 1000).trim();

    // Process through Knowledge Base & Dynamic Tool Execution Engine
    const response = await processCustomerMessage({
      message: sanitizedMessage,
      conversationHistory,
      authenticatedUser,
      activeFaqs,
    });

    return NextResponse.json({
      success: true,
      reply: response.reply,
      products: response.products || [],
      quickReplies: response.quickReplies || [],
      action: response.action || null,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Chatbot API Route error:', err);
    return NextResponse.json(
      {
        success: false,
        reply: "I'm experiencing a momentary connection fluctuation with our sanctuary registry. Please try again in a moment or reach out directly to our WhatsApp support (+91 91117 16355).",
        products: [],
        quickReplies: ['WhatsApp Support', 'Find a Crystal', 'Shipping Info'],
      },
      { status: 500 }
    );
  }
}
