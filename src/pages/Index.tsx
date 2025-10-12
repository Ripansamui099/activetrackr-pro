import { Activity, BarChart3, ShoppingCart, Target, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Admin Dashboard",
      description: "Manage users and moderate content",
      icon: <Activity className="h-12 w-12" />,
      color: "from-primary to-primary-glow",
      link: "/user-management"
    },
    {
      title: "Analytics & Reports",
      description: "Generate reports and analyze feedback",
      icon: <BarChart3 className="h-12 w-12" />,
      color: "from-secondary to-orange-500",
      link: "/report-generation"
    },
    {
      title: "E-commerce",
      description: "Manage fitness products and inventory",
      icon: <ShoppingCart className="h-12 w-12" />,
      color: "from-accent to-green-500",
      link: "/product-management"
    },
    {
      title: "Activity Tracking",
      description: "Track daily activities and goals",
      icon: <Target className="h-12 w-12" />,
      color: "from-blue-500 to-cyan-500",
      link: "/daily-activity"
    },
    {
      title: "Workout & Trainer",
      description: "Manage workouts and trainer assignments",
      icon: <Dumbbell className="h-12 w-12" />,
      color: "from-purple-500 to-pink-500",
      link: "/workout-routine"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Health & Fitness Platform
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Your complete solution for managing fitness, tracking progress, and achieving wellness goals
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((module, index) => (
            <div
              key={module.title}
              className="group relative overflow-hidden rounded-xl bg-card border border-border/50 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              onClick={() => navigate(module.link)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="relative space-y-4">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${module.color}`}>
                  {module.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground">{module.title}</h3>
                <p className="text-muted-foreground">{module.description}</p>
                <Button variant="ghost" className="mt-4 group-hover:bg-primary/10">
                  Explore Module →
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-24 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Comprehensive Features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
            {["Create", "Read", "Update", "Delete", "Search", "Validate", "Track", "Analyze"].map((feature) => (
              <div
                key={feature}
                className="p-4 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors"
              >
                <p className="font-semibold text-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
