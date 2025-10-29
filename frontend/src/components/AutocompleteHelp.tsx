// IMPORT PACKAGES
import { HelpCircle } from "lucide-react";

// IMPORT INFRA
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

/**
 * AutocompleteHelp Component
 *
 * A help popover component that provides guidance on using autocomplete shortcuts
 * for form field generation. Displays a comprehensive guide including field type
 * shortcuts, additional snippets, and usage instructions.
 *
 * @component
 * @example
 * ```tsx
 * <AutocompleteHelp />
 * ```
 *
 * Features:
 * - Field type shortcuts (text, email, textarea, select, etc.)
 * - Additional form snippets (form-complete, form-section, validation-required, etc.)
 * - Step-by-step usage instructions
 * - Keyboard navigation guidance
 *
 * @returns JSX element containing a popover with autocomplete help content
 */
export function AutocompleteHelp() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle className="h-3.5 w-3.5" />
          Autocomplete Guide
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 h-100" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="mb-2">Field Type Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  text-field
                </code>
              </div>
              <div className="text-muted-foreground">Text input</div>

              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  email-field
                </code>
              </div>
              <div className="text-muted-foreground">Email input</div>

              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  textarea-field
                </code>
              </div>
              <div className="text-muted-foreground">Multi-line text</div>

              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  select-field
                </code>
              </div>
              <div className="text-muted-foreground">Dropdown</div>

              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  checkbox-field
                </code>
              </div>
              <div className="text-muted-foreground">Checkbox</div>

              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  radio-field
                </code>
              </div>
              <div className="text-muted-foreground">Radio buttons</div>

              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  number-field
                </code>
              </div>
              <div className="text-muted-foreground">Number input</div>

              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  date-field
                </code>
              </div>
              <div className="text-muted-foreground">Date picker</div>

              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  password-field
                </code>
              </div>
              <div className="text-muted-foreground">Password input</div>

              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  tel-field
                </code>
              </div>
              <div className="text-muted-foreground">Phone number</div>

              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  url-field
                </code>
              </div>
              <div className="text-muted-foreground">URL input</div>

              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  file-field
                </code>
              </div>
              <div className="text-muted-foreground">File upload</div>

              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  rating-field
                </code>
              </div>
              <div className="text-muted-foreground">Star rating</div>
            </div>
          </div>

          <div className="border-t pt-3">
            <h4 className="mb-2">Additional Snippets</h4>
            <div className="space-y-1.5 text-xs">
              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  form-complete
                </code>
                <span className="text-muted-foreground ml-2">
                  Complete form structure
                </span>
              </div>
              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  form-section
                </code>
                <span className="text-muted-foreground ml-2">
                  Form section template
                </span>
              </div>
              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  validation-required
                </code>
                <span className="text-muted-foreground ml-2">
                  Validation rules
                </span>
              </div>
              <div>
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  conditional-logic
                </code>
                <span className="text-muted-foreground ml-2">
                  Conditional logic
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-3">
            <h4 className="mb-2">How to Use</h4>
            <ol className="text-xs space-y-1.5 list-decimal list-inside text-muted-foreground">
              <li>Start typing a field type (e.g., "text")</li>
              <li>Select from the autocomplete menu</li>
              <li>
                Press <kbd className="bg-muted px-1 rounded">Enter</kbd> or{" "}
                <kbd className="bg-muted px-1 rounded">Tab</kbd>
              </li>
              <li>
                Navigate placeholders with{" "}
                <kbd className="bg-muted px-1 rounded">Tab</kbd>
              </li>
              <li>The editor auto-wraps fields in form structure if needed!</li>
            </ol>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
