"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Trash2,
  Edit,
  Plus,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { applications as initialApplications, getApplicationStatus, formatCurrency, type Application } from "@/lib/data"
import { useNotifications } from "@/lib/notifications-context"

const statusStyles = {
  "Ready for Appraisal": "bg-accent/20 text-accent border-accent/30",
  "Conditional Approval": "bg-warning/20 text-warning border-warning/30",
  "On Hold": "bg-chart-5/20 text-chart-5 border-chart-5/30",
  Rejected: "bg-destructive/20 text-destructive border-destructive/30",
}

export function ApplicationsTable() {
  const [applications, setApplications] = useState(initialApplications)
  const [search, setSearch] = useState("")
  const [industryFilter, setIndustryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const itemsPerPage = 15

  const { addNotification } = useNotifications()

  const [newApp, setNewApp] = useState({
    industry: "Services" as "Services" | "Trading" | "Manufacturing",
    loanAmount: 500000,
    kycSubmitted: false,
    incomeDocSubmitted: false,
    businessProofSubmitted: false,
  })

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const status = getApplicationStatus(app)
      const matchesSearch =
        app.applicantId.toLowerCase().includes(search.toLowerCase()) ||
        app.industry.toLowerCase().includes(search.toLowerCase())
      const matchesIndustry = industryFilter === "all" || app.industry === industryFilter
      const matchesStatus = statusFilter === "all" || status === statusFilter
      const matchesCategory = categoryFilter === "all" || app.category === categoryFilter
      return matchesSearch && matchesIndustry && matchesStatus && matchesCategory
    })
  }, [applications, search, industryFilter, statusFilter, categoryFilter])

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  const paginatedApps = filteredApplications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleCreateApplication = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 500))

    const category = newApp.loanAmount <= 1000000 ? "Small" : newApp.loanAmount <= 5000000 ? "Medium" : "Large"
    const newApplication: Application = {
      sNo: applications.length + 1,
      applicantId: `SME${newApp.industry.slice(0, 4)}${applications.length + 1}`,
      industry: newApp.industry,
      loanAmount: newApp.loanAmount,
      loanCategory: "SME",
      category,
      kycSubmitted: newApp.kycSubmitted,
      incomeDocSubmitted: newApp.incomeDocSubmitted,
      businessProofSubmitted: newApp.businessProofSubmitted,
    }

    setApplications((prev) => [newApplication, ...prev])
    setIsAddingNew(false)
    setNewApp({
      industry: "Services",
      loanAmount: 500000,
      kycSubmitted: false,
      incomeDocSubmitted: false,
      businessProofSubmitted: false,
    })
    setIsSaving(false)

    addNotification({
      title: "Application Created",
      message: `New application ${newApplication.applicantId} has been created`,
      type: "success",
      link: "applications",
    })
  }

  const handleUpdateApplication = async () => {
    if (!editingApp) return
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 500))

    setApplications((prev) => prev.map((app) => (app.applicantId === editingApp.applicantId ? editingApp : app)))
    setEditingApp(null)
    setIsSaving(false)

    addNotification({
      title: "Application Updated",
      message: `Application ${editingApp.applicantId} has been updated`,
      type: "success",
      link: "applications",
    })
  }

  const handleDeleteApplication = async (appId: string) => {
    setApplications((prev) => prev.filter((app) => app.applicantId !== appId))

    addNotification({
      title: "Application Deleted",
      message: `Application ${appId} has been removed`,
      type: "info",
      link: "applications",
    })
  }

  const handleExportCSV = () => {
    const headers = ["ID", "Industry", "Amount", "Category", "KYC", "Income", "Business", "Status"]
    const rows = filteredApplications.map((app) => [
      app.applicantId,
      app.industry,
      app.loanAmount,
      app.category,
      app.kycSubmitted ? "Yes" : "No",
      app.incomeDocSubmitted ? "Yes" : "No",
      app.businessProofSubmitted ? "Yes" : "No",
      getApplicationStatus(app),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sme-applications.csv"
    a.click()
    URL.revokeObjectURL(url)

    addNotification({
      title: "Export Complete",
      message: `Exported ${filteredApplications.length} applications to CSV`,
      type: "success",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Applications Management</h2>
          <p className="text-muted-foreground">View and manage all {applications.length} SME loan applications</p>
        </div>
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Application</DialogTitle>
              <DialogDescription>Add a new SME loan application to the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select
                  value={newApp.industry}
                  onValueChange={(v) => setNewApp((prev) => ({ ...prev, industry: v as typeof prev.industry }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Trading">Trading</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Loan Amount (₹)</Label>
                <Input
                  type="number"
                  value={newApp.loanAmount}
                  onChange={(e) => setNewApp((prev) => ({ ...prev, loanAmount: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-3">
                <Label>Documents</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">KYC Submitted</span>
                  <Switch
                    checked={newApp.kycSubmitted}
                    onCheckedChange={(v) => setNewApp((prev) => ({ ...prev, kycSubmitted: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Income Proof Submitted</span>
                  <Switch
                    checked={newApp.incomeDocSubmitted}
                    onCheckedChange={(v) => setNewApp((prev) => ({ ...prev, incomeDocSubmitted: v }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Business Proof Submitted</span>
                  <Switch
                    checked={newApp.businessProofSubmitted}
                    onCheckedChange={(v) => setNewApp((prev) => ({ ...prev, businessProofSubmitted: v }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateApplication} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-foreground">Application List</CardTitle>
              <CardDescription>{filteredApplications.length} applications found</CardDescription>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExportCSV}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID or industry..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={industryFilter}
                onValueChange={(v) => {
                  setIndustryFilter(v)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                  <SelectItem value="Trading">Trading</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Ready for Appraisal">Ready for Appraisal</SelectItem>
                  <SelectItem value="Conditional Approval">Conditional Approval</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter(v)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Industry</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Size</TableHead>
                  <TableHead className="font-semibold text-center">KYC</TableHead>
                  <TableHead className="font-semibold text-center">Income</TableHead>
                  <TableHead className="font-semibold text-center">Business</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApps.map((app) => {
                  const status = getApplicationStatus(app)
                  return (
                    <TableRow key={app.applicantId} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{app.applicantId}</TableCell>
                      <TableCell>{app.industry}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(app.loanAmount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {app.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {app.kycSubmitted ? (
                          <CheckCircle2 className="mx-auto h-5 w-5 text-accent" />
                        ) : (
                          <XCircle className="mx-auto h-5 w-5 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {app.incomeDocSubmitted ? (
                          <CheckCircle2 className="mx-auto h-5 w-5 text-accent" />
                        ) : (
                          <XCircle className="mx-auto h-5 w-5 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {app.businessProofSubmitted ? (
                          <CheckCircle2 className="mx-auto h-5 w-5 text-accent" />
                        ) : (
                          <XCircle className="mx-auto h-5 w-5 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusStyles[status]}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setSelectedApp(app)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Application Details</DialogTitle>
                                <DialogDescription>
                                  Complete information for {selectedApp?.applicantId}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedApp && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Applicant ID</p>
                                      <p className="font-medium">{selectedApp.applicantId}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Industry</p>
                                      <p className="font-medium">{selectedApp.industry}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Loan Amount</p>
                                      <p className="font-medium font-mono">{formatCurrency(selectedApp.loanAmount)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Category</p>
                                      <p className="font-medium">{selectedApp.category}</p>
                                    </div>
                                  </div>
                                  <div className="border-t border-border pt-4">
                                    <p className="mb-2 text-sm font-medium">Document Status</p>
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">KYC Documents</span>
                                        {selectedApp.kycSubmitted ? (
                                          <Badge className="bg-accent/20 text-accent">Submitted</Badge>
                                        ) : (
                                          <Badge className="bg-destructive/20 text-destructive">Missing</Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">Income Proof</span>
                                        {selectedApp.incomeDocSubmitted ? (
                                          <Badge className="bg-accent/20 text-accent">Submitted</Badge>
                                        ) : (
                                          <Badge className="bg-destructive/20 text-destructive">Missing</Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">Business Proof</span>
                                        {selectedApp.businessProofSubmitted ? (
                                          <Badge className="bg-accent/20 text-accent">Submitted</Badge>
                                        ) : (
                                          <Badge className="bg-destructive/20 text-destructive">Missing</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="border-t border-border pt-4">
                                    <p className="text-sm text-muted-foreground">Pre-Screen Status</p>
                                    <Badge
                                      variant="outline"
                                      className={`mt-1 ${statusStyles[getApplicationStatus(selectedApp)]}`}
                                    >
                                      {getApplicationStatus(selectedApp)}
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {/* Edit Dialog */}
                          <Dialog
                            open={editingApp?.applicantId === app.applicantId}
                            onOpenChange={(open) => !open && setEditingApp(null)}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setEditingApp({ ...app })}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Application</DialogTitle>
                                <DialogDescription>Update {editingApp?.applicantId} details</DialogDescription>
                              </DialogHeader>
                              {editingApp && (
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Industry</Label>
                                    <Select
                                      value={editingApp.industry}
                                      onValueChange={(v) =>
                                        setEditingApp((prev) =>
                                          prev ? { ...prev, industry: v as typeof prev.industry } : null,
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Services">Services</SelectItem>
                                        <SelectItem value="Trading">Trading</SelectItem>
                                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Loan Amount (₹)</Label>
                                    <Input
                                      type="number"
                                      value={editingApp.loanAmount}
                                      onChange={(e) =>
                                        setEditingApp((prev) =>
                                          prev ? { ...prev, loanAmount: Number(e.target.value) } : null,
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="space-y-3">
                                    <Label>Documents</Label>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">KYC Submitted</span>
                                      <Switch
                                        checked={editingApp.kycSubmitted}
                                        onCheckedChange={(v) =>
                                          setEditingApp((prev) => (prev ? { ...prev, kycSubmitted: v } : null))
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">Income Proof Submitted</span>
                                      <Switch
                                        checked={editingApp.incomeDocSubmitted}
                                        onCheckedChange={(v) =>
                                          setEditingApp((prev) => (prev ? { ...prev, incomeDocSubmitted: v } : null))
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">Business Proof Submitted</span>
                                      <Switch
                                        checked={editingApp.businessProofSubmitted}
                                        onCheckedChange={(v) =>
                                          setEditingApp((prev) =>
                                            prev ? { ...prev, businessProofSubmitted: v } : null,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingApp(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateApplication} disabled={isSaving}>
                                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {/* Delete Confirmation */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Application</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {app.applicantId}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDeleteApplication(app.applicantId)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of {filteredApplications.length}{" "}
              applications
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
