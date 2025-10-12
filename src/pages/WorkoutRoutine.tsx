import { useState, useEffect } from "react";
import { Dumbbell, Search, Plus, Edit, Trash2 } from "lucide-react";
import { FormCard } from "@/components/FormCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Workout {
  _id: string;
  workoutName: string;
  exercises: string;
  duration: number;
  difficulty: string;
  targetMuscles: string;
}

const WorkoutRoutine = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [formData, setFormData] = useState({ workoutName: "", exercises: "", duration: "", difficulty: "", targetMuscles: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const data = await api.getAll("workouts");
      setWorkouts(data);
    } catch (error) {
      toast.error("Failed to fetch workouts");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.workoutName.trim()) newErrors.workoutName = "Workout name is required";
    if (!formData.exercises.trim()) newErrors.exercises = "Exercises are required";
    if (!formData.duration || parseInt(formData.duration) <= 0) newErrors.duration = "Duration must be greater than 0";
    if (!formData.difficulty) newErrors.difficulty = "Difficulty is required";
    if (!formData.targetMuscles.trim()) newErrors.targetMuscles = "Target muscles are required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = {
        workoutName: formData.workoutName,
        exercises: formData.exercises,
        duration: parseInt(formData.duration),
        difficulty: formData.difficulty,
        targetMuscles: formData.targetMuscles,
      };
      if (editingId) {
        await api.update("workouts", editingId, submitData);
        toast.success("Workout updated successfully");
      } else {
        await api.create("workouts", submitData);
        toast.success("Workout created successfully");
      }
      setFormData({ workoutName: "", exercises: "", duration: "", difficulty: "", targetMuscles: "" });
      setEditingId(null);
      setErrors({});
      fetchWorkouts();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (workout: Workout) => {
    setFormData({
      workoutName: workout.workoutName,
      exercises: workout.exercises,
      duration: workout.duration.toString(),
      difficulty: workout.difficulty,
      targetMuscles: workout.targetMuscles,
    });
    setEditingId(workout._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete("workouts", id);
        toast.success("Workout deleted successfully");
        fetchWorkouts();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchWorkouts();
      return;
    }
    try {
      const data = await api.search("workouts", searchQuery);
      setWorkouts(data);
    } catch (error) {
      toast.error("Search failed");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <FormCard
        title="Workout Routine"
        description="Create and manage workout routines"
        icon={<Dumbbell className="h-8 w-8" />}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workoutName">Workout Name *</Label>
              <Input
                id="workoutName"
                value={formData.workoutName}
                onChange={(e) => setFormData({ ...formData, workoutName: e.target.value })}
                className={errors.workoutName ? "border-destructive" : ""}
              />
              {errors.workoutName && <p className="text-sm text-destructive">{errors.workoutName}</p>}
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
              <Label htmlFor="difficulty">Difficulty Level *</Label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger className={errors.difficulty ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              {errors.difficulty && <p className="text-sm text-destructive">{errors.difficulty}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetMuscles">Target Muscles *</Label>
              <Input
                id="targetMuscles"
                placeholder="e.g., Chest, Back, Legs"
                value={formData.targetMuscles}
                onChange={(e) => setFormData({ ...formData, targetMuscles: e.target.value })}
                className={errors.targetMuscles ? "border-destructive" : ""}
              />
              {errors.targetMuscles && <p className="text-sm text-destructive">{errors.targetMuscles}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="exercises">Exercises List *</Label>
              <Textarea
                id="exercises"
                rows={4}
                placeholder="e.g., Bench Press 3x10, Squats 4x12, Deadlifts 3x8..."
                value={formData.exercises}
                onChange={(e) => setFormData({ ...formData, exercises: e.target.value })}
                className={errors.exercises ? "border-destructive" : ""}
              />
              {errors.exercises && <p className="text-sm text-destructive">{errors.exercises}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="h-4 w-4 mr-2" />
              {editingId ? "Update Workout" : "Create Workout"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => { setEditingId(null); setFormData({ workoutName: "", exercises: "", duration: "", difficulty: "", targetMuscles: "" }); setErrors({}); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </FormCard>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search workouts..."
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
                <TableHead>Workout Name</TableHead>
                <TableHead>Duration (min)</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Target Muscles</TableHead>
                <TableHead>Exercises</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workouts.map((workout) => (
                <TableRow key={workout._id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{workout.workoutName}</TableCell>
                  <TableCell>{workout.duration}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        workout.difficulty === "Beginner"
                          ? "bg-accent/20 text-accent-foreground"
                          : workout.difficulty === "Expert"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {workout.difficulty}
                    </span>
                  </TableCell>
                  <TableCell>{workout.targetMuscles}</TableCell>
                  <TableCell className="max-w-xs truncate">{workout.exercises}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(workout)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(workout._id)}>
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

export default WorkoutRoutine;
