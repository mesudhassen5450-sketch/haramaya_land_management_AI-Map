import { Plus, FileSearch, Receipt, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    icon: Plus,
    label: "Register Land",
    description: "Add new parcel",
    color: "bg-primary hover:bg-primary/90",
  },
  {
    icon: FileSearch,
    label: "Property Search",
    description: "Find parcels",
    color: "bg-accent hover:bg-accent/90",
  },
  {
    icon: Receipt,
    label: "Generate Tax Bill",
    description: "Create invoice",
    color: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
  },
  {
    icon: MapPinned,
    label: "View GIS Map",
    description: "Open spatial data",
    color: "bg-primary hover:bg-primary/90",
  },
];

export function QuickActions() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-slide-up">
      <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            className={`h-auto py-4 px-4 flex flex-col items-start gap-2 ${action.color}`}
          >
            <action.icon className="w-5 h-5" />
            <div className="text-left">
              <p className="text-sm font-medium">{action.label}</p>
              <p className="text-xs opacity-80">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
