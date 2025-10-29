import { FieldSchema } from "../types/schema";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Star, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface FormFieldProps {
  field: FieldSchema;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function TextField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  required,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={field.id}>
          {field.label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{field.helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Input
        id={field.id}
        type={field.type}
        placeholder={field.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={error ? "border-destructive" : ""}
        {...(field.type === "file" && field.accept
          ? { accept: field.accept }
          : {})}
      />
      {field.type === "file" && field.accept && (
        <p className="text-xs text-muted-foreground mt-1">
          Accepted formats: {field.accept}
        </p>
      )}
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

export function TextareaField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  required,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={field.id}>
          {field.label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{field.helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Textarea
        id={field.id}
        placeholder={field.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={error ? "border-destructive" : ""}
        rows={4}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

export function SelectField({
  field,
  value,
  onChange,
  error,
  disabled,
  required,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={field.id}>
          {field.label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{field.helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Select value={value || ""} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={error ? "border-destructive" : ""}>
          <SelectValue placeholder={field.placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

export function RadioField({
  field,
  value,
  onChange,
  error,
  disabled,
  required,
}: FormFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label>
          {field.label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{field.helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <RadioGroup
        value={value || ""}
        onValueChange={onChange}
        disabled={disabled}
      >
        {field.options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={String(option.value)}
              id={`${field.id}-${option.value}`}
            />
            <Label
              htmlFor={`${field.id}-${option.value}`}
              className="cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

export function CheckboxField({
  field,
  value,
  onChange,
  error,
  disabled,
  required,
}: FormFieldProps) {
  const values = Array.isArray(value) ? value : [];

  const handleChange = (optionValue: string | number, checked: boolean) => {
    const newValues = checked
      ? [...values, optionValue]
      : values.filter((v) => v !== optionValue);
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label>
          {field.label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{field.helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="space-y-2">
        {field.options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${field.id}-${option.value}`}
              checked={values.includes(option.value)}
              onCheckedChange={(checked) =>
                handleChange(option.value, checked as boolean)
              }
              disabled={disabled}
            />
            <Label
              htmlFor={`${field.id}-${option.value}`}
              className="cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

export function RatingField({
  field,
  value,
  onChange,
  error,
  disabled,
  required,
}: FormFieldProps) {
  const maxRating = field.maxRating || 5;
  const currentRating = value || 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>
          {field.label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{field.helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => !disabled && onChange(rating)}
            disabled={disabled}
            className="p-1 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Star
              className={`w-8 h-8 ${
                rating <= currentRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

export function RangeField({
  field,
  value,
  onChange,
  error,
  disabled,
  required,
}: FormFieldProps) {
  const min = field.validation?.min || 0;
  const max = field.validation?.max || 100;
  const step = field.step || 1;
  const currentValue = value !== undefined ? value : min;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>
            {field.label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {field.helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{field.helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <span className="bg-primary text-primary-foreground px-3 py-1 rounded">
          {currentValue}
        </span>
      </div>
      <Slider
        value={[currentValue]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="py-4"
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

export function MatrixField({
  field,
  value,
  onChange,
  error,
  disabled,
  required,
}: FormFieldProps) {
  const matrixValue = value || {};

  const handleChange = (rowId: string, columnValue: string) => {
    onChange({
      ...matrixValue,
      [rowId]: columnValue,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label>
          {field.label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{field.helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left"></th>
              {field.columns?.map((col) => (
                <th key={col.value} className="p-3 text-center">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {field.rows?.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
              >
                <td className="p-3">{row.label}</td>
                {field.columns?.map((col) => (
                  <td key={col.value} className="p-3 text-center">
                    <RadioGroup
                      value={matrixValue[row.id] || ""}
                      onValueChange={(val) => handleChange(row.id, val)}
                      disabled={disabled}
                    >
                      <RadioGroupItem value={String(col.value)} />
                    </RadioGroup>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </div>
  );
}
