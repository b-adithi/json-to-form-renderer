import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { LiveForm, FormSubmission, FormSchema } from "../types/schema";

export interface Form {
  _id?: string;
  name: string;
  status: string;
  createdOn?: string;
  updatedOn?: string;
  schema: FormSchema;
  responses?: FormSubmission[];
  responseCount?: number;
}

/**
 * Converts a Form object to a LiveForm object with normalized properties.
 *
 * @param form - The source Form object to convert
 * @returns A LiveForm object with guaranteed non-null values and proper typing
 *
 * @remarks
 * This function handles potential null/undefined values by providing defaults:
 * - Uses empty string for missing id or createdAt
 * - Uses empty array for missing responses
 * - Calculates responseCount from responses array length if not provided
 * - Casts status to specific union type for type safety
 */
function toLiveForm(form: Form): LiveForm {
  return {
    id: form._id ?? "",
    name: form.name,
    schema: form.schema,
    createdAt: form.createdOn ?? "",
    status: form.status as "published" | "draft",
    responses: form.responses ?? [],
    responseCount:
      form.responseCount ?? (form.responses ? form.responses.length : 0),
  };
}

/**
 * Retrieves all forms from the server and converts them to LiveForm format.
 *
 * @async
 * @function fetchForms
 * @returns {Promise<LiveForm[]>} Promise that resolves to an array of LiveForm objects
 * @throws {Error} When the API request fails or returns invalid data
 *
 * @example
 * ```typescript
 * const forms = await fetchForms();
 * console.log(`Found ${forms.length} forms`);
 * ```
 */
export async function fetchForms(): Promise<LiveForm[]> {
  const forms = await apiClient.get<Form[]>(ENDPOINTS.forms);
  return forms.map(toLiveForm);
}

/**
 * Creates a new form on the server with the provided data.
 *
 * @async
 * @function createForm
 * @param {Omit<Form, "_id" | "createdOn" | "updatedOn">} data - Form data excluding auto-generated fields
 * @returns {Promise<LiveForm>} Promise that resolves to the created form as a LiveForm object
 * @throws {Error} When the API request fails or validation errors occur
 *
 * @example
 * ```typescript
 * const newForm = await createForm({
 *   name: "Customer Survey",
 *   status: "draft",
 *   schema: { fields: [...] }
 * });
 * ```
 */
export async function createForm(
  data: Omit<Form, "_id" | "createdOn" | "updatedOn">
): Promise<LiveForm> {
  const form = await apiClient.post<Form>(ENDPOINTS.forms, data);
  return toLiveForm(form);
}

/**
 * Updates an existing form with partial data.
 *
 * @async
 * @function updateForm
 * @param {string} id - The unique identifier of the form to update
 * @param {Partial<Form>} data - Partial form data containing only fields to update
 * @returns {Promise<LiveForm>} Promise that resolves to the updated form as a LiveForm object
 * @throws {Error} When the form is not found or update fails
 *
 * @example
 * ```typescript
 * const updatedForm = await updateForm("form123", {
 *   status: "published",
 *   name: "Updated Survey Name"
 * });
 * ```
 */
export async function updateForm(
  id: string,
  data: Partial<Form>
): Promise<LiveForm> {
  const form = await apiClient.put<Form>(ENDPOINTS.form(id), data);
  return toLiveForm(form);
}

/**
 * Permanently deletes a form from the server.
 *
 * @async
 * @function deleteForm
 * @param {string} id - The unique identifier of the form to delete
 * @returns {Promise<{success: boolean}>} Promise that resolves to a success indicator
 * @throws {Error} When the form is not found or deletion fails
 *
 * @example
 * ```typescript
 * const result = await deleteForm("form123");
 * if (result.success) {
 *   console.log("Form deleted successfully");
 * }
 * ```
 */
export async function deleteForm(id: string): Promise<{ success: boolean }> {
  return apiClient.delete<{ success: boolean }>(ENDPOINTS.form(id));
}
