import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'data', 'authorized-emails.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (data.emails.includes(email.toLowerCase())) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
