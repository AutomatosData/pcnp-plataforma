import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PCNP - Plataforma de Consulta",
  description:
    "Plataforma moderna para consulta de processos licitatórios do PCNP. Acesse dados atualizados de licitações, filtros avançados e exportação de dados.",
  keywords: ["licitação", "PCNP", "pregão", "consulta", "governo"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
