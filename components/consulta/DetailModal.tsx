"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Building2, MapPin, Calendar, DollarSign, FileText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { LicitacaoRow } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";

interface DetailModalProps {
  row: LicitacaoRow | null;
  onClose: () => void;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}

function DetailItem({ icon, label, value, mono }: DetailItemProps) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-muted-foreground shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className={`text-sm font-medium break-words ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

export function DetailModal({ row, onClose }: DetailModalProps) {
  return (
    <Dialog.Root open={!!row} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-2xl border bg-background shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] focus:outline-none max-h-[90vh] overflow-y-auto scrollbar-thin">
          {row && (
            <>
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="pr-8">
                  <Dialog.Title className="text-base font-semibold leading-tight">
                    {row.objeto || "Licitação sem título"}
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-muted-foreground mt-1">
                    Processo: {row.processo || "N/D"} — {row.unidade || "N/D"}
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </Dialog.Close>
              </div>

              <Separator />

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Data de Abertura"
                    value={formatDate(row.abertura)}
                  />
                  <DetailItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Data de Encerramento"
                    value={formatDate(row.encerramento)}
                  />
                  <DetailItem
                    icon={<DollarSign className="h-4 w-4" />}
                    label="Valor Estimado"
                    value={row.valorEstimado ? formatCurrency(row.valorEstimado) : ""}
                  />
                  <DetailItem
                    icon={<Building2 className="h-4 w-4" />}
                    label="Unidade"
                    value={row.unidade}
                  />
                  <DetailItem
                    icon={<FileText className="h-4 w-4" />}
                    label="Nº do Processo"
                    value={row.processo}
                    mono
                  />
                  <DetailItem
                    icon={<Tag className="h-4 w-4" />}
                    label="CNPJ"
                    value={row.cnpj}
                    mono
                  />
                  <DetailItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="Localização"
                    value={[row.municipio, row.uf].filter(Boolean).join(" — ")}
                  />
                </div>

                {(row.modalidade || row.disputa) && (
                  <>
                    <Separator />
                    <div className="flex flex-wrap gap-2">
                      {row.modalidade && (
                        <Badge variant="info" className="text-xs">
                          {row.modalidade}
                        </Badge>
                      )}
                      {row.disputa && (
                        <Badge variant="secondary" className="text-xs">
                          {row.disputa}
                        </Badge>
                      )}
                    </div>
                  </>
                )}

                {row.objeto && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Objeto completo</p>
                      <p className="text-sm leading-relaxed">{row.objeto}</p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
