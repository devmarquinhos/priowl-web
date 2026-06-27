import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // calls API
    const res = await fetch(`${process.env.BACKEND_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    const data = await res.json();

    // log of the API
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Erro ao fazer login" },
        { status: res.status },
      );
    }

    (
      await 
      cookies()
    ).set({
      name: "priowl_token",
      value: data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2,
    });

    return NextResponse.json({ message: "Login realizado com sucesso" });
  } catch (error) {
    console.error(error);
    
    return NextResponse.json(
      { error: "Erro interno no servidor de Front-end" },
      { status: 500 },
    );
  }
}
