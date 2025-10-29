import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { FileText, Copy, Eye, MoreVertical } from "lucide-react";
import { exampleSchemas } from "../data/exampleSchemas";

interface ExamplesPageProps {
  onClone: (key: string) => void;
  onPreview: (key: string) => void;
}

export function ExamplesPage({ onClone, onPreview }: ExamplesPageProps) {
  const gradients = [
    "from-purple-500 to-indigo-600",
    "from-cyan-500 to-blue-600",
    "from-green-500 to-emerald-600",
    "from-amber-500 to-orange-600",
    "from-pink-500 to-rose-600",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2>Example Schemas</h2>
        <p className="text-muted-foreground mt-1">
          Explore pre-built form schemas and load them into the editor
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(exampleSchemas).map(([key, schema], index) => (
          <Card
            key={key}
            className="hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 group overflow-hidden relative"
          >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-indigo-50/0 group-hover:from-purple-50/50 group-hover:to-indigo-50/50 dark:group-hover:from-purple-950/20 dark:group-hover:to-indigo-950/20 transition-all duration-300 pointer-events-none" />

            <CardHeader className="pb-4 relative">
              <div className="flex  items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="mb-1.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {schema.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {schema.description}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onClone(key)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Clone
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPreview(key)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            {/* <CardContent className="pt-0 relative">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  {schema.sections
                    ? `${schema.sections.length} sections`
                    : `${schema.fields?.length || 0} fields`}
                </Badge>
                {schema.enableMarks && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 px-3 py-1 shadow-sm">
                    Quiz Mode
                  </Badge>
                )}
              </div>
            </CardContent> */}
          </Card>
        ))}
      </div>
    </div>
  );
}
