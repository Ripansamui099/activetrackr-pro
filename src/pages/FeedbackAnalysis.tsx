import { useState, useEffect } from "react";
import { MessageSquare, Search, Plus, Edit, Trash2 } from "lucide-react";
import { FormCard } from "@/components/FormCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Feedback {
  _id: string;
  userName: string;
  feedbackType: string;
  rating: number;
  comment: string;
}

const FeedbackAnalysis = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [formData, setFormData] = useState({ userName: "", feedbackType: "", rating: "5", comment: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const data = await api.getAll("feedbacks");
      setFeedbacks(data);
    } catch (error) {
      toast.error("Failed to fetch feedbacks");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.userName.trim()) newErrors.userName = "User name is required";
    if (!formData.feedbackType) newErrors.feedbackType = "Feedback type is required";
    if (!formData.rating || parseInt(formData.rating) < 1 || parseInt(formData.rating) > 5) 
      newErrors.rating = "Rating must be between 1-5";
    if (!formData.comment.trim()) newErrors.comment = "Comment is required";
    if (formData.comment.length < 10) newErrors.comment = "Comment must be at least 10 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = { ...formData, rating: parseInt(formData.rating) };
      if (editingId) {
        await api.update("feedbacks", editingId, submitData);
        toast.success("Feedback updated successfully");
      } else {
        await api.create("feedbacks", submitData);
        toast.success("Feedback created successfully");
      }
      setFormData({ userName: "", feedbackType: "", rating: "5", comment: "" });
      setEditingId(null);
      setErrors({});
      fetchFeedbacks();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (feedback: Feedback) => {
    setFormData({
      userName: feedback.userName,
      feedbackType: feedback.feedbackType,
      rating: feedback.rating.toString(),
      comment: feedback.comment,
    });
    setEditingId(feedback._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete("feedbacks", id);
        toast.success("Feedback deleted successfully");
        fetchFeedbacks();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchFeedbacks();
      return;
    }
    try {
      const data = await api.search("feedbacks", searchQuery);
      setFeedbacks(data);
    } catch (error) {
      toast.error("Search failed");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <FormCard
        title="Feedback Analysis"
        description="Collect and analyze user feedback"
        icon={<MessageSquare className="h-8 w-8" />}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">User Name *</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className={errors.userName ? "border-destructive" : ""}
              />
              {errors.userName && <p className="text-sm text-destructive">{errors.userName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedbackType">Feedback Type *</Label>
              <Select value={formData.feedbackType} onValueChange={(value) => setFormData({ ...formData, feedbackType: value })}>
                <SelectTrigger className={errors.feedbackType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Feature Request">Feature Request</SelectItem>
                  <SelectItem value="Bug Report">Bug Report</SelectItem>
                  <SelectItem value="General Feedback">General Feedback</SelectItem>
                  <SelectItem value="Complaint">Complaint</SelectItem>
                  <SelectItem value="Praise">Praise</SelectItem>
                </SelectContent>
              </Select>
              {errors.feedbackType && <p className="text-sm text-destructive">{errors.feedbackType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5) *</Label>
              <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                <SelectTrigger className={errors.rating ? "border-destructive" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {"⭐".repeat(num)} ({num})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rating && <p className="text-sm text-destructive">{errors.rating}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="comment">Comment *</Label>
              <Textarea
                id="comment"
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className={errors.comment ? "border-destructive" : ""}
              />
              {errors.comment && <p className="text-sm text-destructive">{errors.comment}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-gradient-to-r from-secondary to-orange-500">
              <Plus className="h-4 w-4 mr-2" />
              {editingId ? "Update Feedback" : "Submit Feedback"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => { setEditingId(null); setFormData({ userName: "", feedbackType: "", rating: "5", comment: "" }); setErrors({}); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </FormCard>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search feedbacks..."
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
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((feedback) => (
                <TableRow key={feedback._id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{feedback.userName}</TableCell>
                  <TableCell>{feedback.feedbackType}</TableCell>
                  <TableCell>{"⭐".repeat(feedback.rating)}</TableCell>
                  <TableCell className="max-w-md truncate">{feedback.comment}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(feedback)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(feedback._id)}>
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

export default FeedbackAnalysis;
