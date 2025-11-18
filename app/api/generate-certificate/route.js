import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { overlayNameOnCertificate } from '@/lib/overlayName';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, fullName } = await request.json();

    if (!email || !fullName) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    const certificateId = `cert_${Date.now()}`;
    const buffer = await overlayNameOnCertificate(fullName);

    const certDir = path.join(process.cwd(), 'public', 'certificates');
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }
    
    const filePath = path.join(certDir, `${certificateId}.png`);
    fs.writeFileSync(filePath, buffer);

    try {
      await resend.emails.send({
        from: 'ThryveZ <onboarding@resend.dev>',
        to: email,
        subject: 'Your Certificate',
        html: `<h1>Congratulations ${fullName}!</h1><p>Your certificate is attached.</p>`,
        attachments: [{
          filename: 'certificate.png',
          content: buffer,
        }],
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    return NextResponse.json({ success: true, certificateId });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
  }
}
