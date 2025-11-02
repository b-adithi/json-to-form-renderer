import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Download, BarChart3 } from "lucide-react";

interface ResponsesPageProps {
  responses: any[];
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export function ResponsesPage({
  responses,
  onExportCSV,
  onExportJSON,
}: ResponsesPageProps) {
  return (
    <>
      <div className="pb-20" data-testid="responses-page">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2>Form Responses</h2>
              <p className="text-muted-foreground mt-1">
                {responses.length} total{" "}
                {responses.length === 1 ? "response" : "responses"} collected
              </p>
            </div>
          </div>
        </div>

        {responses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-muted-foreground mb-2">No Responses Yet</h3>
              <p className="text-sm text-muted-foreground">
                Responses will appear here once users submit the form
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {responses.map((response, index) => (
              <Card key={response._id ?? index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Response #{index + 1}
                      </CardTitle>
                      <CardDescription>
                        {response.submittedOn
                          ? new Date(response.submittedOn).toLocaleString()
                          : ""}
                        {response.userFullName && response.userId
                          ? ` • ${response.userFullName} (${response.userId})`
                          : response.userFullName
                          ? ` • ${response.userFullName}`
                          : response.userId
                          ? ` • ${response.userId}`
                          : ""}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{response._id}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {Object.entries(response.responses ?? {}).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="grid grid-cols-3 gap-4 py-2 border-b last:border-b-0"
                        >
                          <div className="col-span-1 text-sm text-muted-foreground">
                            {key}:
                          </div>
                          <div className="col-span-2 text-sm">
                            {Array.isArray(value)
                              ? value.join(", ")
                              : typeof value === "object"
                              ? JSON.stringify(value, null, 2)
                              : String(value)}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Action Buttons Footer */}
      <div className="fixed bottom-0 left-63 right-0 bg-white dark:bg-zinc-900 border-t p-4 flex justify-end gap-2 z-10">
        {responses.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={onExportJSON}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
