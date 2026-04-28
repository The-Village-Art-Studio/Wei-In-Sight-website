import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';



// Validation schema for the unified submission
const submissionSchema = z.object({
  type: z.enum(['contact', 'commission']),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message is too short'),
  // Optional fields
  phone: z.string().optional(),
  budget: z.string().optional(),
  project_type: z.string().optional(),
  subject: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = submissionSchema.parse(body);
    const resend = new Resend(process.env.RESEND_API_KEY || 'missing_key');

    // 1. Store in Supabase
    const { data: dbData, error: dbError } = await supabase
      .from('inquiries')
      .insert([
        {
          type: validatedData.type,
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          budget: validatedData.budget,
          project_type: validatedData.project_type,
          subject: validatedData.subject,
          message: validatedData.message,
          status: 'new'
        }
      ]);

    if (dbError) {
      console.error('Supabase Error:', dbError);
      return NextResponse.json({ error: 'Failed to record submission' }, { status: 500 });
    }

    // 2. Send Email via Resend
    const emailSubject = validatedData.type === 'commission' 
      ? `New Commission Request: ${validatedData.name}` 
      : `New Contact Inquiry: ${validatedData.subject || validatedData.name}`;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Wei In Sight <onboarding@resend.dev>', // Update this with a verified domain later
      to: ['jackyho.art@gmail.com'], // Replace with artist's email or identity.email
      subject: emailSubject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #ff69b4;">New ${validatedData.type} Submission</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
          ${validatedData.budget ? `<p><strong>Budget:</strong> ${validatedData.budget}</p>` : ''}
          ${validatedData.project_type ? `<p><strong>Project Type:</strong> ${validatedData.project_type}</p>` : ''}
          ${validatedData.subject ? `<p><strong>Subject:</strong> ${validatedData.subject}</p>` : ''}
          <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #ff69b4;">
            <p><strong>Message:</strong></p>
            <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            This was sent from the Wei In Sight Portfolio.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Resend Error:', emailError);
      // We don't fail the whole request if email fails but DB succeeded, 
      // but we should warn the user.
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Submission received successfully' 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Submission Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
