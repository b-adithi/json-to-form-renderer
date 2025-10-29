import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { JsonEditor } from "../components/JsonEditor";
import { Eye, FileText, CheckCircle2, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormEditorPageProps {
  formName: string;
  schemaText: string;
  schemaError: string;
  theme: "light" | "dark";
  isEditMode: boolean;
  onFormNameChange: (value: string) => void;
  onSchemaChange: (value: string) => void;
  onLoadExample: (key: string) => void;
  onFormatJSON: () => void;
  onPreview: () => void;
  onSaveAsDraft: () => void;
  onPublish: () => void;
}

export function FormEditorPage(props: FormEditorPageProps) {
  const {
    formName,
    schemaText,
    schemaError,
    theme,
    onFormNameChange,
    onSchemaChange,
    onLoadExample,
    onFormatJSON,
    onPreview,
    onSaveAsDraft,
    onPublish,
  } = props;
  const navigate = useNavigate();

  return (
    <>
      {/* Editor Card */}
      {/* space-y-6 */}
      <div className="mb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16px">
          <div className="space-y-2">
            <Label>Form Name</Label>
            <Input
              value={formName}
              onChange={(e) => onFormNameChange(e.target.value)}
              placeholder="Enter form name..."
              aria-label="FormName"
            />
          </div>

          <div className="space-y-2">
            <Label>Load Example Schema</Label>
            <Select onValueChange={onLoadExample}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an example..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contact">📝 Contact Form</SelectItem>
                <SelectItem value="survey">📊 Customer Survey</SelectItem>
                <SelectItem value="jobApplication">
                  💼 Job Application
                </SelectItem>
                <SelectItem value="quiz">🎯 JavaScript Quiz</SelectItem>
                <SelectItem value="calculator">🧮 Loan Calculator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label aria-label="JsonSchema">JSON Schema</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={onFormatJSON}
              className="h-8"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1.5" />
              Format JSON
            </Button>
          </div>
          <JsonEditor
            value={schemaText}
            onChange={onSchemaChange}
            error={schemaError}
            theme={theme}
          />
        </div>
      </div>

      {/* Fixed Action Buttons Footer */}
      <div className="fixed bottom-0 left-63 right-0 bg-white dark:bg-zinc-900 border-t p-4 flex justify-end gap-2 z-10">
        <div className="flex gap-2">
          <Button onClick={() => navigate("/forms")} variant="outline">
            Cancel
          </Button>

          <Button onClick={onPreview} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={onSaveAsDraft} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <Button
            onClick={onPublish}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>
    </>
  );
}
