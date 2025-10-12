import { useState, useEffect } from "react";
import { Target, Search, Plus, Edit, Trash2 } from "lucide-react";
import { FormCard } from "@/components/FormCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Goal {
  _id: string;
  goalName: string;
  goalType: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
}

const GoalTracking = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [formData, setFormData] = useState({ goalName: "", goalType: "", targetValue: "", currentValue: "", deadline: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await api.getAll("goals");
      setGoals(data);
    } catch (error) {
      toast.error("Failed to fetch goals");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.goalName.trim()) newErrors.goalName = "Goal name is required";
    if (!formData.goalType) newErrors.goalType = "Goal type is required";
    if (!formData.targetValue || parseInt(formData.targetValue) <= 0) newErrors.targetValue = "Target value must be greater than 0";
    if (!formData.currentValue || parseInt(formData.currentValue) < 0) newErrors.currentValue = "Current value cannot be negative";
    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = {
        goalName: formData.goalName,
        goalType: formData.goalType,
        targetValue: parseInt(formData.targetValue),
        currentValue: parseInt(formData.currentValue),
        deadline: formData.deadline,
      };
      if (editingId) {
        await api.update("goals", editingId, submitData);
        toast.success("Goal updated successfully");
      } else {
        await api.create("goals", submitData);
        toast.success("Goal created successfully");
      }
      setFormData({ goalName: "", goalType: "", targetValue: "", currentValue: "", deadline: "" });
      setEditingId(null);
      setErrors({});
      fetchGoals();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (goal: Goal) => {
    setFormData({
      goalName: goal.goalName,
      goalType: goal.goalType,
      targetValue: goal.targetValue.toString(),
      currentValue: goal.currentValue.toString(),
      deadline: new Date(goal.deadline).toISOString().split('T')[0],
    });
    setEditingId(goal._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete("goals", id);
        toast.success("Goal deleted successfully");
        fetchGoals();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchGoals();
      return;
    }
    try {
      const data = await api.search("goals", searchQuery);
      setGoals(data);
    } catch (error) {
      toast.error("Search failed");
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <FormCard
        title="Goal Tracking"
        description="Set and track your fitness goals"
        icon={<Target className="h-8 w-8" />}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goalName">Goal Name *</Label>
              <Input
                id="goalName"
                value={formData.goalName}
                onChange={(e) => setFormData({ ...formData, goalName: e.target.value })}
                className={errors.goalName ? "border-destructive" : ""}
              />
              {errors.goalName && <p className="text-sm text-destructive">{errors.goalName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="goalType">Goal Type *</Label>
              <Select value={formData.goalType} onValueChange={(value) => setFormData({ ...formData, goalType: value })}>
                <SelectTrigger className={errors.goalType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weight Loss">Weight Loss (kg)</SelectItem>
                  <SelectItem value="Muscle Gain">Muscle Gain (kg)</SelectItem>
                  <SelectItem value="Distance">Distance (km)</SelectItem>
                  <SelectItem value="Workouts">Number of Workouts</SelectItem>
                  <SelectItem value="Calories">Calories Burned</SelectItem>
                </SelectContent>
              </Select>
              {errors.goalType && <p className="text-sm text-destructive">{errors.goalType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value *</Label>
              <Input
                id="targetValue"
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                className={errors.targetValue ? "border-destructive" : ""}
              />
              {errors.targetValue && <p className="text-sm text-destructive">{errors.targetValue}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value *</Label>
              <Input
                id="currentValue"
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                className={errors.currentValue ? "border-destructive" : ""}
              />
              {errors.currentValue && <p className="text-sm text-destructive">{errors.currentValue}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className={errors.deadline ? "border-destructive" : ""}
              />
              {errors.deadline && <p className="text-sm text-destructive">{errors.deadline}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-500">
              <Plus className="h-4 w-4 mr-2" />
              {editingId ? "Update Goal" : "Set Goal"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => { setEditingId(null); setFormData({ goalName: "", goalType: "", targetValue: "", currentValue: "", deadline: "" }); setErrors({}); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </FormCard>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search goals..."
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
                <TableHead>Goal Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Current / Target</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goals.map((goal) => {
                const progress = calculateProgress(goal.currentValue, goal.targetValue);
                return (
                  <TableRow key={goal._id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{goal.goalName}</TableCell>
                    <TableCell>{goal.goalType}</TableCell>
                    <TableCell className="min-w-[200px]">
                      <div className="space-y-1">
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">{progress.toFixed(1)}%</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {goal.currentValue} / {goal.targetValue}
                    </TableCell>
                    <TableCell>{new Date(goal.deadline).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(goal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(goal._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default GoalTracking;
