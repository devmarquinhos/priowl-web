import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // calls API
    const res = await fetch(`${process.env.BACKEND_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: body.username,
        email: body.email,
        password: body.password,
      }),
    });

    // log of the API
    if (!res.ok) {
      const rawText = await res.text();
      let finalMessage = 'Erro ao realizar cadastro.';

      try {
        const jsonError = JSON.parse(rawText);
        finalMessage = jsonError.error || jsonError.message || finalMessage;
      } catch {
        finalMessage = rawText || finalMessage;
      }

      return NextResponse.json({ error: finalMessage }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Erro interno no servidor do Next.js.' },
      { status: 500 }
    );
  }
}