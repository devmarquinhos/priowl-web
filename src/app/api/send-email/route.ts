// src/app/api/send-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { subject, message } = await req.json();

    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["priowlsupport@gmail.com"],
      subject: `[Suporte Priowl] ${subject}`,
      html: `<p><strong>Nova mensagem de suporte:</strong></p><p>${message}</p>`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Falha ao enviar" }, { status: 500 });
  }
}