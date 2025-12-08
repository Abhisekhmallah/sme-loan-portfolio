"use client"

import { useState } from "react"
import { FileText, CheckCircle2, AlertCircle, XCircle, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ChecklistItem {
  id: string
  name: string
  description: string
  required: boolean
  status: "complete" | "pending" | "missing"
  examples: string[]
}

const kycDocuments: ChecklistItem[] = [
  {
    id: "kyc-1",
    name: "PAN Card",
    description: "Permanent Account Number card of the proprietor/partners/directors",
    required: true,
    status: "complete",
    examples: ["Individual PAN", "Company PAN (for Pvt Ltd)"],
  },
  {
    id: "kyc-2",
    name: "Aadhaar Card",
    description: "Aadhaar card of all owners/directors",
    required: true,
    status: "complete",
    examples: ["Self-attested copy", "e-Aadhaar printout"],
  },
  {
    id: "kyc-3",
    name: "Photograph",
    description: "Recent passport-size photographs",
    required: true,
    status: "pending",
    examples: ["2 copies per applicant", "White background"],
  },
  {
    id: "kyc-4",
    name: "Address Proof",
    description: "Current residential address verification",
    required: true,
    status: "missing",
    examples: ["Utility bill", "Passport", "Voter ID"],
  },
]

const incomeDocuments: ChecklistItem[] = [
  {
    id: "inc-1",
    name: "ITR (3 Years)",
    description: "Income Tax Returns for the last 3 financial years",
    required: true,
    status: "complete",
    examples: ["ITR-3 for business", "ITR-4 for presumptive"],
  },
  {
    id: "inc-2",
    name: "Bank Statements",
    description: "Last 12 months bank statements of primary account",
    required: true,
    status: "pending",
    examples: ["All business accounts", "Scanned or PDF"],
  },
  {
    id: "inc-3",
    name: "Audited Financials",
    description: "Balance sheet and P&L statement",
    required: false,
    status: "missing",
    examples: ["Last 2 years", "CA certified"],
  },
  {
    id: "inc-4",
    name: "GST Returns",
    description: "GSTR-3B for the last 12 months",
    required: true,
    status: "complete",
    examples: ["Monthly filings", "Annual return GSTR-9"],
  },
]

const businessDocuments: ChecklistItem[] = [
  {
    id: "bus-1",
    name: "Business Registration",
    description: "Certificate of incorporation or registration",
    required: true,
    status: "complete",
    examples: ["COI for Pvt Ltd", "Partnership deed", "Udyam registration"],
  },
  {
    id: "bus-2",
    name: "GST Certificate",
    description: "GST registration certificate",
    required: true,
    status: "complete",
    examples: ["REG-06 certificate", "GST portal download"],
  },
  {
    id: "bus-3",
    name: "Trade License",
    description: "Municipal trade license for business premises",
    required: false,
    status: "pending",
    examples: ["Shop license", "Factory license"],
  },
  {
    id: "bus-4",
    name: "Business Address Proof",
    description: "Proof of business premises ownership/lease",
    required: true,
    status: "missing",
    examples: ["Rent agreement", "Property deed", "Utility bill"],
  },
]

function DocumentSection({
  title,
  description,
  documents,
}: {
  title: string
  description: string
  documents: ChecklistItem[]
}) {
  const [isOpen, setIsOpen] = useState(true)

  const complete = documents.filter((d) => d.status === "complete").length
  const total = documents.length
  const progress = (complete / total) * 100

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border bg-card">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-foreground">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {complete}/{total} Complete
                  </p>
                  <Progress value={progress} className="mt-1 h-2 w-24" />
                </div>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
                  <div className="mt-0.5">
                    {doc.status === "complete" && <CheckCircle2 className="h-5 w-5 text-accent" />}
                    {doc.status === "pending" && <AlertCircle className="h-5 w-5 text-warning" />}
                    {doc.status === "missing" && <XCircle className="h-5 w-5 text-destructive" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{doc.name}</p>
                      {doc.required && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{doc.description}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Info className="h-3 w-3" />
                      <span>Examples: {doc.examples.join(", ")}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      doc.status === "complete"
                        ? "bg-accent/20 text-accent border-accent/30"
                        : doc.status === "pending"
                          ? "bg-warning/20 text-warning border-warning/30"
                          : "bg-destructive/20 text-destructive border-destructive/30"
                    }
                  >
                    {doc.status === "complete" ? "Submitted" : doc.status === "pending" ? "Pending" : "Missing"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

export function DocumentChecklist() {
  const allDocs = [...kycDocuments, ...incomeDocuments, ...businessDocuments]
  const complete = allDocs.filter((d) => d.status === "complete").length
  const pending = allDocs.filter((d) => d.status === "pending").length
  const missing = allDocs.filter((d) => d.status === "missing").length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Document Checklist</h2>
        <p className="text-muted-foreground">Required documentation for SME loan pre-screening</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{complete}</p>
                <p className="text-sm text-muted-foreground">Documents Submitted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{missing}</p>
                <p className="text-sm text-muted-foreground">Documents Missing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <DocumentSection
          title="KYC Documents"
          description="Identity verification and address proof"
          documents={kycDocuments}
        />
        <DocumentSection
          title="Income Documents"
          description="Financial records and tax filings"
          documents={incomeDocuments}
        />
        <DocumentSection
          title="Business Documents"
          description="Registration and compliance certificates"
          documents={businessDocuments}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Save Progress</Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Submit for Pre-Screen</Button>
      </div>
    </div>
  )
}
