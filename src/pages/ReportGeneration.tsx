import { useState, useEffect } from "react";
import { BarChart3, Search, Plus, Edit, Trash2 } from "lucide-react";
import { FormCard } from "@/components/FormCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Report {
  _id: string;
  reportName: string;
  reportType: string;
  dateRange: string;
  metrics: string;
}

const ReportGeneration = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [formData, setFormData] = useState({ reportName: "", reportType: "", dateRange: "", metrics: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await api.getAll("reports");
      setReports(data);
    } catch (error) {
      toast.error("Failed to fetch reports");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.reportName.trim()) newErrors.reportName = "Report name is required";
    if (!formData.reportType) newErrors.reportType = "Report type is required";
    if (!formData.dateRange.trim()) newErrors.dateRange = "Date range is required";
    if (!formData.metrics.trim()) newErrors.metrics = "Metrics are required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await api.update("reports", editingId, formData);
        toast.success("Report updated successfully");
      } else {
        await api.create("reports", formData);
        toast.success("Report created successfully");
      }
      setFormData({ reportName: "", reportType: "", dateRange: "", metrics: "" });
      setEditingId(null);
      setErrors({});
      fetchReports();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (report: Report) => {
    setFormData({
      reportName: report.reportName,
      reportType: report.reportType,
      dateRange: report.dateRange,
      metrics: report.metrics,
    });
    setEditingId(report._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete("reports", id);
        toast.success("Report deleted successfully");
        fetchReports();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchReports();
      return;
    }
    try {
      const data = await api.search("reports", searchQuery);
      setReports(data);
    } catch (error) {
      toast.error("Search failed");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <FormCard
        title="Report Generation"
        description="Create and manage analytics reports"
        icon={<BarChart3 className="h-8 w-8" />}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name *</Label>
              <Input
                id="reportName"
                value={formData.reportName}
                onChange={(e) => setFormData({ ...formData, reportName: e.target.value })}
                className={errors.reportName ? "border-destructive" : ""}
              />
              {errors.reportName && <p className="text-sm text-destructive">{errors.reportName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type *</Label>
              <Select value={formData.reportType} onValueChange={(value) => setFormData({ ...formData, reportType: value })}>
                <SelectTrigger className={errors.reportType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User Activity">User Activity</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Engagement">Engagement</SelectItem>
                </SelectContent>
              </Select>
              {errors.reportType && <p className="text-sm text-destructive">{errors.reportType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range *</Label>
              <Input
                id="dateRange"
                placeholder="e.g., 2025-01-01 to 2025-01-31"
                value={formData.dateRange}
                onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
                className={errors.dateRange ? "border-destructive" : ""}
              />
              {errors.dateRange && <p className="text-sm text-destructive">{errors.dateRange}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="metrics">Metrics *</Label>
              <Input
                id="metrics"
                placeholder="e.g., Active Users, Revenue, Conversions"
                value={formData.metrics}
                onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                className={errors.metrics ? "border-destructive" : ""}
              />
              {errors.metrics && <p className="text-sm text-destructive">{errors.metrics}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-gradient-to-r from-secondary to-orange-500">
              <Plus className="h-4 w-4 mr-2" />
              {editingId ? "Update Report" : "Generate Report"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => { setEditingId(null); setFormData({ reportName: "", reportType: "", dateRange: "", metrics: "" }); setErrors({}); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </FormCard>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Metrics</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report._id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{report.reportName}</TableCell>
                  <TableCell>{report.reportType}</TableCell>
                  <TableCell>{report.dateRange}</TableCell>
                  <TableCell>{report.metrics}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(report)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(report._id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneration;
