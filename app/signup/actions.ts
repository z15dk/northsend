"use server";

import { redirect } from "next/navigation";
import { createSession, hashPassword } from "@/lib/auth";
import { t, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export type AuthActionState = {
  error?: string;
};

export async function signupAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const locale = (String(formData.get("locale") ?? "en") === "da" ? "da" : "en") as Locale;
  const copy = t(locale);
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: copy.signup.required };
  }

  if (password.length < 8) {
    return { error: copy.signup.shortPassword };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return { error: copy.signup.exists };
  }

  const user = await prisma.user.create({
    data: {
      name: name || null,
      email,
      passwordHash: hashPassword(password),
      planCode: "free",
    },
    select: { id: true },
  });

  await createSession(user.id);
  redirect("/dashboard");
}
