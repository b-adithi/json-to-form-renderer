import { apiClient } from "./client";

export interface FormResponse {
  _id?: string;
  userId: string;
  userFullName?: string;
  formId: string;
  responses: Record<string, any>;
  submittedOn?: string;
}

/**
 * Fetches all responses for a specific form.
 *
 * @param formId - The unique identifier of the form to fetch responses for
 * @returns A Promise that resolves to an array of FormResponse objects
 * @throws Will throw an error if the API request fails or the form is not found
 *
 * @example
 * ```typescript
 * const responses = await fetchResponses('form-123');
 * console.log(responses); // Array of FormResponse objects
 * ```
 */
export async function fetchResponses(formId: string): Promise<FormResponse[]> {
  // Use the correct endpoint for responses by form
  return apiClient.get<FormResponse[]>(`/forms/${formId}/responses`);
}

/**
 * Submits a form response to the server.
 *
 * @param data - The form response data excluding the `_id` and `submittedOn` fields
 * @returns A Promise that resolves to the complete FormResponse object including server-generated fields
 *
 * @example
 * ```typescript
 * const responseData = {
 *   formId: "form123",
 *   answers: [{ questionId: "q1", value: "answer1" }]
 * };
 *
 * const submittedResponse = await submitResponse(responseData);
 * console.log(submittedResponse._id); // Server-generated ID
 * ```
 */
export async function submitResponse(
  data: Omit<FormResponse, "_id" | "submittedOn">
): Promise<FormResponse> {
  // Use the public submission endpoint that doesn't require authentication
  const { formId, ...responseData } = data;
  return apiClient.post<FormResponse>(`/forms/${formId}/submit`, responseData);
}
