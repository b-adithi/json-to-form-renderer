import "@testing-library/jest-dom";
import {
  TextField,
  TextareaField,
  SelectField,
  RadioField,
  CheckboxField,
  RatingField,
  RangeField,
  MatrixField,
} from "../../src/components/FormFields";

import { render, screen, fireEvent } from "@testing-library/react";
const baseField = {
  id: "test",
  label: "Test Label",
  type: "text",
};

describe("FormFields Components", () => {
  it("renders TextField", () => {
    render(
      <TextField
        field={{ ...baseField, label: "Name", id: "name", type: "text" }}
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it("renders TextareaField", () => {
    render(
      <TextareaField
        field={{
          ...baseField,
          label: "Description",
          id: "desc",
          type: "textarea",
        }}
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("renders SelectField with options", () => {
    render(
      <SelectField
        field={{
          ...baseField,
          label: "Options",
          id: "options",
          type: "select",
          options: [
            { label: "A", value: "a" },
            { label: "B", value: "b" },
          ],
        }}
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("renders RadioField with options", () => {
    render(
      <RadioField
        field={{
          ...baseField,
          label: "Radio",
          id: "radio",
          type: "radio",
          options: [
            { label: "A", value: "a" },
            { label: "B", value: "b" },
          ],
        }}
        value="a"
        onChange={() => {}}
      />
    );
    // RadioField uses custom UI, check for radiogroup role and options
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    // RadioField uses custom UI, check for radiogroup role and options
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders CheckboxField", () => {
    render(
      <CheckboxField
        field={{
          ...baseField,
          label: "Accept",
          id: "accept",
          type: "checkbox",
          options: [
            { label: "Accept", value: "accept" },
            { label: "Decline", value: "decline" },
          ],
        }}
        value={[]}
        onChange={() => {}}
      />
    );
    expect(screen.getByLabelText("Accept")).toBeInTheDocument();
    expect(screen.getByLabelText("Decline")).toBeInTheDocument();
  });

  it("renders RatingField", () => {
    render(
      <RatingField
        field={{
          ...baseField,
          label: "Rating",
          id: "rating",
          type: "rating",
          maxRating: 5,
        }}
        value={3}
        onChange={() => {}}
      />
    );
    // RatingField uses custom UI, check for button and label
    // RatingField uses custom UI, check for button and label
    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("renders RangeField", () => {
    render(
      <RangeField
        field={{
          ...baseField,
          label: "Range",
          id: "range",
          type: "range",
          validation: { min: 0, max: 100 },
        }}
        value={50}
        onChange={() => {}}
      />
    );
    // RangeField uses custom UI, check for slider role and label
    // RangeField uses custom UI, check for slider role and label
    expect(screen.getByText("Range")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("renders MatrixField", () => {
    render(
      <MatrixField
        field={{
          ...baseField,
          label: "Matrix",
          id: "matrix",
          type: "matrix",
          rows: [{ id: "r1", label: "Row 1" }],
          columns: [{ label: "Col 1", value: "c1" }],
        }}
        value={[[1]]}
        onChange={() => {}}
      />
    );
    expect(screen.getByText(/matrix/i)).toBeInTheDocument();
  });
});
