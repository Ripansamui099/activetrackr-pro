import { useState, useEffect } from "react";
import { UserCheck, Search, Plus, Edit, Trash2 } from "lucide-react";
import { FormCard } from "@/components/FormCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Trainer {
  _id: string;
  trainerName: string;
  specialization: string;
  clientName: string;
  sessionType: string;
  schedule: string;
}

const TrainerAssignment = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [formData, setFormData] = useState({ trainerName: "", specialization: "", clientName: "", sessionType: "", schedule: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const data = await api.getAll("trainers");
      setTrainers(data);
    } catch (error) {
      toast.error("Failed to fetch trainer assignments");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.trainerName.trim()) newErrors.trainerName = "Trainer name is required";
    if (!formData.specialization) newErrors.specialization = "Specialization is required";
    if (!formData.clientName.trim()) newErrors.clientName = "Client name is required";
    if (!formData.sessionType) newErrors.sessionType = "Session type is required";
    if (!formData.schedule.trim()) newErrors.schedule = "Schedule is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await api.update("trainers", editingId, formData);
        toast.success("Assignment updated successfully");
      } else {
        await api.create("trainers", formData);
        toast.success("Assignment created successfully");
      }
      setFormData({ trainerName: "", specialization: "", clientName: "", sessionType: "", schedule: "" });
      setEditingId(null);
      setErrors({});
      fetchTrainers();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (trainer: Trainer) => {
    setFormData({
      trainerName: trainer.trainerName,
      specialization: trainer.specialization,
      clientName: trainer.clientName,
      sessionType: trainer.sessionType,
      schedule: trainer.schedule,
    });
    setEditingId(trainer._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete("trainers", id);
        toast.success("Assignment deleted successfully");
        fetchTrainers();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchTrainers();
      return;
    }
    try {
      const data = await api.search("trainers", searchQuery);
      setTrainers(data);
    } catch (error) {
      toast.error("Search failed");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <FormCard
        title="Trainer Assignment"
        description="Assign trainers to clients and manage sessions"
        icon={<UserCheck className="h-8 w-8" />}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trainerName">Trainer Name *</Label>
              <Input
                id="trainerName"
                value={formData.trainerName}
                onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })}
                className={errors.trainerName ? "border-destructive" : ""}
              />
              {errors.trainerName && <p className="text-sm text-destructive">{errors.trainerName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Select value={formData.specialization} onValueChange={(value) => setFormData({ ...formData, specialization: value })}>
                <SelectTrigger className={errors.specialization ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Strength Training">Strength Training</SelectItem>
                  <SelectItem value="Cardio Fitness">Cardio Fitness</SelectItem>
                  <SelectItem value="Yoga & Flexibility">Yoga & Flexibility</SelectItem>
                  <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                  <SelectItem value="Sports Performance">Sports Performance</SelectItem>
                  <SelectItem value="Nutrition">Nutrition</SelectItem>
                </SelectContent>
              </Select>
              {errors.specialization && <p className="text-sm text-destructive">{errors.specialization}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className={errors.clientName ? "border-destructive" : ""}
              />
              {errors.clientName && <p className="text-sm text-destructive">{errors.clientName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionType">Session Type *</Label>
              <Select value={formData.sessionType} onValueChange={(value) => setFormData({ ...formData, sessionType: value })}>
                <SelectTrigger className={errors.sessionType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="One-on-One">One-on-One</SelectItem>
                  <SelectItem value="Group Session">Group Session</SelectItem>
                  <SelectItem value="Virtual">Virtual</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {errors.sessionType && <p className="text-sm text-destructive">{errors.sessionType}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="schedule">Schedule *</Label>
              <Input
                id="schedule"
                placeholder="e.g., Mon/Wed/Fri 6:00 PM - 7:00 PM"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className={errors.schedule ? "border-destructive" : ""}
              />
              {errors.schedule && <p className="text-sm text-destructive">{errors.schedule}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="h-4 w-4 mr-2" />
              {editingId ? "Update Assignment" : "Create Assignment"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => { setEditingId(null); setFormData({ trainerName: "", specialization: "", clientName: "", sessionType: "", schedule: "" }); setErrors({}); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </FormCard>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search assignments..."
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
                <TableHead>Trainer</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Session Type</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainers.map((trainer) => (
                <TableRow key={trainer._id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{trainer.trainerName}</TableCell>
                  <TableCell>{trainer.specialization}</TableCell>
                  <TableCell>{trainer.clientName}</TableCell>
                  <TableCell>{trainer.sessionType}</TableCell>
                  <TableCell>{trainer.schedule}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(trainer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(trainer._id)}>
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

export default TrainerAssignment;
