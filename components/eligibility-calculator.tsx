"use client"

import { useState, useMemo } from "react"
import { Calculator, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export function EligibilityCalculator() {
  const [industry, setIndustry] = useState<string>("")
  const [loanAmount, setLoanAmount] = useState<string>("")
  const [turnover, setTurnover] = useState<string>("")
  const [yearsInBusiness, setYearsInBusiness] = useState<string>("")
  const [hasKYC, setHasKYC] = useState(false)
  const [hasIncomeProof, setHasIncomeProof] = useState(false)
  const [hasBusinessProof, setHasBusinessProof] = useState(false)
  const [calculated, setCalculated] = useState(false)

  const eligibilityResult = useMemo(() => {
    if (!calculated) return null

    const loan = Number.parseFloat(loanAmount) || 0
    const turn = Number.parseFloat(turnover) || 0
    const years = Number.parseFloat(yearsInBusiness) || 0

    let score = 0
    const criteria: { name: string; passed: boolean; reason: string }[] = []

    // Industry check
    if (industry) {
      score += 15
      criteria.push({
        name: "Industry Sector",
        passed: true,
        reason: `${industry} sector is eligible for SME loans`,
      })
    } else {
      criteria.push({
        name: "Industry Sector",
        passed: false,
        reason: "Industry not selected",
      })
    }

    // Loan amount to turnover ratio
    if (turn > 0 && loan <= turn * 0.25) {
      score += 20
      criteria.push({
        name: "Loan-to-Turnover Ratio",
        passed: true,
        reason: "Loan amount is within 25% of annual turnover",
      })
    } else if (turn > 0) {
      criteria.push({
        name: "Loan-to-Turnover Ratio",
        passed: false,
        reason: "Loan amount exceeds 25% of annual turnover",
      })
    }

    // Years in business
    if (years >= 3) {
      score += 20
      criteria.push({
        name: "Business Vintage",
        passed: true,
        reason: "Business operational for 3+ years",
      })
    } else if (years >= 1) {
      score += 10
      criteria.push({
        name: "Business Vintage",
        passed: true,
        reason: "Business operational for 1-3 years (partial score)",
      })
    } else {
      criteria.push({
        name: "Business Vintage",
        passed: false,
        reason: "Business operational for less than 1 year",
      })
    }

    // KYC Documents
    if (hasKYC) {
      score += 20
      criteria.push({
        name: "KYC Documents",
        passed: true,
        reason: "All KYC documents available",
      })
    } else {
      criteria.push({
        name: "KYC Documents",
        passed: false,
        reason: "KYC documents not available - MANDATORY",
      })
    }

    // Income Proof
    if (hasIncomeProof) {
      score += 15
      criteria.push({
        name: "Income Documentation",
        passed: true,
        reason: "Income proof documents available",
      })
    } else {
      criteria.push({
        name: "Income Documentation",
        passed: false,
        reason: "Income proof not available",
      })
    }

    // Business Proof
    if (hasBusinessProof) {
      score += 10
      criteria.push({
        name: "Business Documentation",
        passed: true,
        reason: "Business proof documents available",
      })
    } else {
      criteria.push({
        name: "Business Documentation",
        passed: false,
        reason: "Business proof not available",
      })
    }

    let status: "Ready for Appraisal" | "Conditional Approval" | "On Hold" | "Rejected"
    let statusColor: string

    if (!hasKYC) {
      status = "Rejected"
      statusColor = "bg-destructive/20 text-destructive border-destructive/30"
    } else if (score >= 80) {
      status = "Ready for Appraisal"
      statusColor = "bg-accent/20 text-accent border-accent/30"
    } else if (score >= 60) {
      status = "Conditional Approval"
      statusColor = "bg-warning/20 text-warning border-warning/30"
    } else if (score >= 40) {
      status = "On Hold"
      statusColor = "bg-chart-5/20 text-chart-5 border-chart-5/30"
    } else {
      status = "Rejected"
      statusColor = "bg-destructive/20 text-destructive border-destructive/30"
    }

    return { score, criteria, status, statusColor }
  }, [calculated, industry, loanAmount, turnover, yearsInBusiness, hasKYC, hasIncomeProof, hasBusinessProof])

  const handleCalculate = () => {
    setCalculated(true)
  }

  const handleReset = () => {
    setIndustry("")
    setLoanAmount("")
    setTurnover("")
    setYearsInBusiness("")
    setHasKYC(false)
    setHasIncomeProof(false)
    setHasBusinessProof(false)
    setCalculated(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Eligibility Calculator</h2>
        <p className="text-muted-foreground">Check pre-screening eligibility before formal application</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Application Details</CardTitle>
                <CardDescription>Enter business and loan information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry Sector</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Trading">Trading</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanAmount">Requested Loan Amount (INR)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="e.g., 2500000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="turnover">Annual Turnover (INR)</Label>
                <Input
                  id="turnover"
                  type="number"
                  placeholder="e.g., 10000000"
                  value={turnover}
                  onChange={(e) => setTurnover(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Years in Business</Label>
                <Input
                  id="years"
                  type="number"
                  placeholder="e.g., 5"
                  value={yearsInBusiness}
                  onChange={(e) => setYearsInBusiness(e.target.value)}
                />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="mb-3 text-sm font-medium text-foreground">Document Availability</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="kyc" className="font-normal">
                    KYC Documents (PAN, Aadhaar, Photo)
                  </Label>
                  <Switch id="kyc" checked={hasKYC} onCheckedChange={setHasKYC} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="income" className="font-normal">
                    Income Proof (ITR, Bank Statements)
                  </Label>
                  <Switch id="income" checked={hasIncomeProof} onCheckedChange={setHasIncomeProof} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="business" className="font-normal">
                    Business Proof (Registration, GST)
                  </Label>
                  <Switch id="business" checked={hasBusinessProof} onCheckedChange={setHasBusinessProof} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCalculate}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Check Eligibility
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Eligibility Result</CardTitle>
            <CardDescription>Pre-screening assessment based on inputs</CardDescription>
          </CardHeader>
          <CardContent>
            {!eligibilityResult ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <Calculator className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  Enter application details and click &ldquo;Check Eligibility&rdquo; to see results
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative mx-auto mb-4 h-32 w-32">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${eligibilityResult.score * 2.51} 251`}
                        className={
                          eligibilityResult.score >= 80
                            ? "text-accent"
                            : eligibilityResult.score >= 60
                              ? "text-warning"
                              : eligibilityResult.score >= 40
                                ? "text-chart-5"
                                : "text-destructive"
                        }
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">{eligibilityResult.score}</span>
                      <span className="text-xs text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={eligibilityResult.statusColor}>
                    {eligibilityResult.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {eligibilityResult.criteria.map((criterion, idx) => (
                    <div key={idx} className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 p-3">
                      {criterion.passed ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{criterion.name}</p>
                        <p className="text-xs text-muted-foreground">{criterion.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {eligibilityResult.status === "Ready for Appraisal" && (
                  <Button className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                    Proceed to Full Application
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}

                {eligibilityResult.status === "Conditional Approval" && (
                  <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                      <div>
                        <p className="text-sm font-medium text-warning">Additional Documents Required</p>
                        <p className="text-xs text-muted-foreground">
                          Submit missing documents to proceed to full appraisal
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
