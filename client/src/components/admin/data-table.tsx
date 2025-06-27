import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { EducationForm } from "./education-form";

interface Column {
  key: string;
  label: string;
  render?: (value: any) => string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  compact?: boolean;
}

export function DataTable({ data, columns, onEdit, onDelete, compact = false }: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No items found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <Card key={item.id} className={compact ? "shadow-sm" : ""}>
          <CardContent className={compact ? "p-4" : "p-6"}>
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-1 gap-2 flex-1">
                {columns.map((column) => (
                  <div key={column.key} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      {column.label}:
                    </span>
                    <span className="text-sm text-foreground">
                      {column.render 
                        ? column.render(item[column.key])
                        : item[column.key] || "—"
                      }
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex space-x-1 ml-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => onDelete(item)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
