"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, UploadCloud } from "lucide-react"

export function RecordsCard() {
  return (
    <Card id="records" className="border-0 ring-1 ring-black/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileText className="size-4" aria-hidden />
          </span>
          Health Records
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input type="file" aria-label="Upload medical record" />
          <Button variant="secondary">
            <UploadCloud className="mr-2 size-4" aria-hidden />
            Upload
          </Button>
        </div>

        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between rounded-md border bg-card px-3 py-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-primary" aria-hidden />
              <span>Prescription - 2025-08-01.pdf</span>
            </div>
            <Button variant="outline" size="sm">
              Share
            </Button>
          </li>
          <li className="flex items-center justify-between rounded-md border bg-card px-3 py-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-primary" aria-hidden />
              <span>Lab Report - 2025-07-21.pdf</span>
            </div>
            <Button variant="outline" size="sm">
              Share
            </Button>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}