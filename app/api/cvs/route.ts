import { NextResponse } from 'next/server';
import CV from '@/models/CV';
import dbConnect from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Basic validation
    if (!body.fullName || !body.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if CV already exists by passport number
    const existingCV = await CV.findOne({ passportNumber: body.passportNumber });
    
    if (existingCV) {
      existingCV.fullName = body.fullName;
      existingCV.email = body.email;
      existingCV.phone = body.phone;
      existingCV.applyingFor = body.applyingFor;
      existingCV.fullData = JSON.stringify(body);
      await existingCV.save();
      return NextResponse.json({ success: true, data: existingCV }, { status: 200 });
    }

    const newCV = await CV.create({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      passportNumber: body.passportNumber,
      applyingFor: body.applyingFor,
      fullData: JSON.stringify(body),
    });

    return NextResponse.json({ success: true, data: newCV }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving CV to MongoDB:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const count = await CV.countDocuments();
    const recent = await CV.find().sort({ createdAt: -1 }).limit(5);
    return NextResponse.json({ count, recent });
  } catch (error: any) {
    console.error('Error fetching CV data from MongoDB:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
