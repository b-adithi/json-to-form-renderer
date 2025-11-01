import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Copy, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { FormSchema } from "../types/schema";

interface FormUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
  formName: string;
  formSchema: FormSchema;
}

export function FormUrlDialog({
  open,
  onOpenChange,
  formId,
  formName,
  formSchema,
}: FormUrlDialogProps) {
  const [copied, setCopied] = useState(false);

  // Encode form data in URL for sharing across sessions
  const formData = {
    name: formName,
    schema: formSchema,
  };
  const encodedData = btoa(JSON.stringify(formData));
  const formUrl = `${window.location.origin}/submit/${formId}?data=${encodedData}`;

  const copyToClipboard = async () => {
    try {
      // Try modern clipboard API first
      let success = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(formUrl);
          success = true;
        }
      } catch (clipboardError) {
        // Clipboard API blocked, will use fallback
        success = false;
      }

      // Fallback method if clipboard API failed or unavailable
      if (!success) {
        const textArea = document.createElement("textarea");
        textArea.value = formUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);
        document.execCommand("copy");
        textArea.remove();
      }

      setCopied(true);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy URL");
    }
  };

  const openForm = () => {
    window.open(formUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            Form Published Successfully!
          </DialogTitle>
          <DialogDescription>
            Your form "{formName}" is now live and ready to collect responses.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Public Form URL</Label>
            <div className="flex gap-2">
              <Input
                value={formUrl}
                readOnly
                className="font-mono text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this URL with anyone to collect form responses. The form
              data is encoded in the URL, so it works across all browsers and
              sessions.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="mb-2 flex items-center gap-2">
              <span className="text-sm">📋 How it works</span>
            </h4>
            <ol className="text-xs space-y-1 list-decimal list-inside text-blue-900 dark:text-blue-100">
              <li>Respondents will first be asked for their Name and Email</li>
              <li>After registration, they'll see your form</li>
              <li>Responses are collected in your browser's storage</li>
              <li>You can view and export all responses as JSON or CSV</li>
              <li>The form works in any browser, including incognito mode</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button onClick={openForm} className="flex-1" variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Form in New Tab
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
