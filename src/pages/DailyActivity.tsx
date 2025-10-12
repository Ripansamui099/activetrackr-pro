import { useState, useEffect } from "react";
import { Activity, Search, Plus, Edit, Trash2 } from "lucide-react";
import { FormCard } from "@/components/FormCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface ActivityType {
  _id: string;
  activityType: string;
  duration: number;
  calories: number;
  date: string;
  notes: string;
}

const DailyActivity = () => {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [formData, setFormData] = useState({ activityType: "", duration: "", calories: "", date: "", notes: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await api.getAll("activities");
      setActivities(data);
    } catch (error) {
      toast.error("Failed to fetch activities");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.activityType) newErrors.activityType = "Activity type is required";
    if (!formData.duration || parseInt(formData.duration) <= 0) newErrors.duration = "Duration must be greater than 0";
    if (!formData.calories || parseInt(formData.calories) <= 0) newErrors.calories = "Calories must be greater than 0";
    if (!formData.date) newErrors.date = "Date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = {
        activityType: formData.activityType,
        duration: parseInt(formData.duration),
        calories: parseInt(formData.calories),
        date: formData.date,
        notes: formData.notes,
      };
      if (editingId) {
        await api.update("activities", editingId, submitData);
        toast.success("Activity updated successfully");
      } else {
        await api.create("activities", submitData);
        toast.success("Activity created successfully");
      }
      setFormData({ activityType: "", duration: "", calories: "", date: "", notes: "" });
      setEditingId(null);
      setErrors({});
      fetchActivities();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (activity: ActivityType) => {
    setFormData({
      activityType: activity.activityType,
      duration: activity.duration.toString(),
      calories: activity.calories.toString(),
      date: new Date(activity.date).toISOString().split('T')[0],
      notes: activity.notes || "",
    });
    setEditingId(activity._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete("activities", id);
        toast.success("Activity deleted successfully");
        fetchActivities();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchActivities();
      return;
    }
    try {
      const data = await api.search("activities", searchQuery);
      setActivities(data);
    } catch (error) {
      toast.error("Search failed");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <FormCard
        title="Daily Activity Tracking"
        description="Log and track your daily fitness activities"
        icon={<Activity className="h-8 w-8" />}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activityType">Activity Type *</Label>
              <Select value={formData.activityType} onValueChange={(value) => setFormData({ ...formData, activityType: value })}>
                <SelectTrigger className={errors.activityType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Running">Running</SelectItem>
                  <SelectItem value="Cycling">Cycling</SelectItem>
                  <SelectItem value="Swimming">Swimming</SelectItem>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="Weight Training">Weight Training</SelectItem>
                  <SelectItem value="Walking">Walking</SelectItem>
                </SelectContent>
              </Select>
              {errors.activityType && <p className="text-sm text-destructive">{errors.activityType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className={errors.duration ? "border-destructive" : ""}
              />
              {errors.duration && <p className="text-sm text-destructive">{errors.duration}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calories Burned *</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className={errors.calories ? "border-destructive" : ""}
              />
              {errors.calories && <p className="text-sm text-destructive">{errors.calories}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={errors.date ? "border-destructive" : ""}
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-500">
              <Plus className="h-4 w-4 mr-2" />
              {editingId ? "Update Activity" : "Log Activity"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => { setEditingId(null); setFormData({ activityType: "", duration: "", calories: "", date: "", notes: "" }); setErrors({}); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </FormCard>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search activities..."
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
                <TableHead>Activity</TableHead>
                <TableHead>Duration (min)</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity._id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{activity.activityType}</TableCell>
                  <TableCell>{activity.duration}</TableCell>
                  <TableCell>{activity.calories}</TableCell>
                  <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-xs truncate">{activity.notes || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(activity)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(activity._id)}>
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

export default DailyActivity;
