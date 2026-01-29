import { auth } from '@clerk/nextjs/server';
import { Resend } from 'resend';
import { createServerSupabaseClient } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prescriptionId, email, patientName } = await req.json();

  if (!prescriptionId || !email) {
    return Response.json(
      { error: 'prescriptionId and email are required' },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  try {
    // Get prescription with PDF URL
    const { data: prescription, error: prescriptionError } = await supabase
      .from('prescriptions')
      .select('pdf_url')
      .eq('id', prescriptionId)
      .eq('owner_id', userId)
      .single();

    if (prescriptionError || !prescription) {
      return Response.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    if (!prescription.pdf_url) {
      return Response.json(
        { error: 'PDF not generated yet' },
        { status: 400 }
      );
    }

    // Get clinic info for sender name
    const { data: user } = await supabase
      .from('users')
      .select('clinic_name, doctor_name')
      .eq('clerk_id', userId)
      .single();

    const clinicName = user?.clinic_name || 'Your Doctor';
    const doctorName = user?.doctor_name || 'Doctor';

    // Download PDF for attachment
    const pdfResponse = await fetch(prescription.pdf_url);
    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Send email with Resend
    const { data, error } = await resend.emails.send({
      from: `${clinicName} <prescriptions@${process.env.RESEND_DOMAIN || 'resend.dev'}>`,
      to: [email],
      subject: `Your Prescription from ${doctorName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${patientName || 'Patient'},</h2>
          <p>Please find your prescription attached to this email.</p>
          <p>If you have any questions about your medication, please contact the clinic.</p>
          <br>
          <p>Best regards,<br>${doctorName}<br>${clinicName}</p>
          <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            This is an automated message from ${clinicName}.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `prescription-${patientName?.replace(/\s+/g, '-') || 'patient'}.pdf`,
          content: Buffer.from(pdfBuffer)
        }
      ]
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return Response.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error('Email send error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send email';
    return Response.json({ error: message }, { status: 500 });
  }
}
