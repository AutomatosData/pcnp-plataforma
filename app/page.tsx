import Link from "next/link";
import {
  Search,
  ArrowRight,
  Database,
  Filter,
  RefreshCw,
  Download,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";

const FEATURES = [
  {
    icon: Database,
    title: "Dados em Tempo Real",
    description: "Conectado diretamente ao Google Sheets, sempre com as informações mais recentes.",
  },
  {
    icon: Filter,
    title: "Filtros Avançados",
    description: "Filtre por data, objeto, UF, município, modalidade e tipo de disputa simultaneamente.",
  },
  {
    icon: RefreshCw,
    title: "Atualização Manual",
    description: "Verifique e carregue novos dados com um clique, com feedback instantâneo.",
  },
  {
    icon: Download,
    title: "Exportação CSV",
    description: "Exporte todos os registros filtrados em formato CSV com encoding correto.",
  },
  {
    icon: Shield,
    title: "Seguro",
    description: "Credenciais nunca expostas no frontend. Acesso via conta de serviço Google.",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Cache inteligente e debounce na busca para experiência ágil mesmo com muitos registros.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 pt-24 pb-20 text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Dados atualizados automaticamente
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 max-w-3xl mx-auto leading-tight">
              Consulta de{" "}
              <span className="text-primary">Licitações</span>
              {" "}PCNP
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              Plataforma moderna para consulta de processos licitatórios. Acesse dados atualizados,
              aplique filtros avançados e exporte relatórios com facilidade.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" asChild className="gap-2 px-6">
                <Link href="/consulta">
                  <Search className="h-4 w-4" />
                  Consultar Dados
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 px-6">
                <Link href="/consulta">
                  Ver Licitações
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Tudo que você precisa
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Funcionalidades pensadas para agilizar a consulta e análise de dados de licitações.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-border/60">
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Pronto para consultar?
            </h2>
            <p className="text-muted-foreground mb-8">
              Acesse a plataforma e encontre os processos que você precisa.
            </p>
            <Button size="lg" asChild className="gap-2 px-8">
              <Link href="/consulta">
                Acessar Consulta
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-muted/30">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PCNP Plataforma. Todos os direitos reservados.</p>
          <p className="text-xs">Desenvolvido com Next.js + Google Sheets API</p>
        </div>
      </footer>
    </div>
  );
}
