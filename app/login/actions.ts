"use server";

import { redirect } from "next/navigation";
import { createSession, verifyPassword } from "@/lib/auth";
import { t, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export type AuthActionState = {
  error?: string;
};

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const locale = (String(formData.get("locale") ?? "en") === "da" ? "da" : "en") as Locale;
  const copy = t(locale);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: copy.login.required };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return { error: copy.login.invalid };
  }

  await createSession(user.id);
  redirect("/dashboard");
}
