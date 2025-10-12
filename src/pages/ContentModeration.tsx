import { Component } from "react";
import { FileCheck, Search, Plus, Edit, Trash2 } from "lucide-react";
import { FormCard } from "@/components/FormCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Content {
  _id: string;
  title: string;
  contentType: string;
  author: string;
  status: string;
}

interface State {
  contents: Content[];
  formData: { title: string; contentType: string; author: string; status: string };
  editingId: string | null;
  searchQuery: string;
  errors: Record<string, string>;
}

// CLASS COMPONENT (ReactJS requirement)
class ContentModeration extends Component<{}, State> {
  state: State = {
    contents: [],
    formData: { title: "", contentType: "", author: "", status: "" },
    editingId: null,
    searchQuery: "",
    errors: {},
  };

  componentDidMount() {
    this.fetchContents();
  }

  fetchContents = async () => {
    try {
      const data = await api.getAll("contents");
      this.setState({ contents: data });
    } catch (error) {
      toast.error("Failed to fetch contents");
    }
  };

  validateForm = () => {
    const newErrors: Record<string, string> = {};
    const { formData } = this.state;
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.contentType) newErrors.contentType = "Content type is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.status) newErrors.status = "Status is required";
    
    this.setState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.validateForm()) return;

    try {
      const { formData, editingId } = this.state;
      if (editingId) {
        await api.update("contents", editingId, formData);
        toast.success("Content updated successfully");
      } else {
        await api.create("contents", formData);
        toast.success("Content created successfully");
      }
      this.setState({
        formData: { title: "", contentType: "", author: "", status: "" },
        editingId: null,
        errors: {},
      });
      this.fetchContents();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  handleEdit = (content: Content) => {
    this.setState({
      formData: {
        title: content.title,
        contentType: content.contentType,
        author: content.author,
        status: content.status,
      },
      editingId: content._id,
    });
  };

  handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete("contents", id);
        toast.success("Content deleted successfully");
        this.fetchContents();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  handleSearch = async () => {
    const { searchQuery } = this.state;
    if (!searchQuery.trim()) {
      this.fetchContents();
      return;
    }
    try {
      const data = await api.search("contents", searchQuery);
      this.setState({ contents: data });
    } catch (error) {
      toast.error("Search failed");
    }
  };

  render() {
    const { contents, formData, editingId, searchQuery, errors } = this.state;

    return (
      <div className="container mx-auto p-6 space-y-6">
        <FormCard
          title="Content Moderation"
          description="Review and moderate user-generated content"
          icon={<FileCheck className="h-8 w-8" />}
        >
          <form onSubmit={this.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Content Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => this.setState({ formData: { ...formData, title: e.target.value } })}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type *</Label>
                <Select
                  value={formData.contentType}
                  onValueChange={(value) => this.setState({ formData: { ...formData, contentType: value } })}
                >
                  <SelectTrigger className={errors.contentType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Comment">Comment</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                  </SelectContent>
                </Select>
                {errors.contentType && <p className="text-sm text-destructive">{errors.contentType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => this.setState({ formData: { ...formData, author: e.target.value } })}
                  className={errors.author ? "border-destructive" : ""}
                />
                {errors.author && <p className="text-sm text-destructive">{errors.author}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Moderation Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => this.setState({ formData: { ...formData, status: value } })}
                >
                  <SelectTrigger className={errors.status ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-gradient-to-r from-primary to-primary-glow">
                <Plus className="h-4 w-4 mr-2" />
                {editingId ? "Update Content" : "Add Content"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    this.setState({
                      editingId: null,
                      formData: { title: "", contentType: "", author: "", status: "" },
                      errors: {},
                    })
                  }
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </FormCard>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search contents..."
              value={searchQuery}
              onChange={(e) => this.setState({ searchQuery: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && this.handleSearch()}
            />
            <Button onClick={this.handleSearch} variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contents.map((content) => (
                  <TableRow key={content._id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{content.title}</TableCell>
                    <TableCell>{content.contentType}</TableCell>
                    <TableCell>{content.author}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          content.status === "Approved"
                            ? "bg-accent/20 text-accent-foreground"
                            : content.status === "Rejected"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-secondary/20 text-secondary-foreground"
                        }`}
                      >
                        {content.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => this.handleEdit(content)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => this.handleDelete(content._id)}>
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
  }
}

export default ContentModeration;
