import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ApiKeyInstructions() {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>API Key Not Configured</AlertTitle>
        <AlertDescription>The application requires a Google API key to function properly.</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>How to Set Up Your API Key</CardTitle>
          <CardDescription>Follow these step-by-step instructions to configure your API key in Vercel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-2">1. Get a Google AI API Key</h3>
            <p className="text-muted-foreground mb-4">
              Visit the Google AI Studio (https://makersuite.google.com/) and create an API key.
            </p>
            <div className="border rounded-md p-4 bg-gray-50">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Go to{" "}
                  <a
                    href="https://makersuite.google.com/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google AI Studio
                  </a>
                </li>
                <li>Sign in with your Google account</li>
                <li>Click on "Get API key" or navigate to the API keys section</li>
                <li>Create a new API key</li>
                <li>Copy the API key to use in the next step</li>
              </ol>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-2">2. Add the API Key to Vercel</h3>
            <p className="text-muted-foreground mb-4">
              Go to your Vercel project dashboard and navigate to Settings → Environment Variables.
            </p>
            <div className="border rounded-md p-4 bg-gray-50">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Log in to your{" "}
                  <a
                    href="https://vercel.com/dashboard"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Vercel Dashboard
                  </a>
                </li>
                <li>Select your project (mmugenius)</li>
                <li>Click on the "Settings" tab</li>
                <li>In the left sidebar, click on "Environment Variables"</li>
                <li>
                  Add a new environment variable:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>
                      Name: <code className="bg-gray-200 px-1 py-0.5 rounded">GOOGLE_API_KEY</code>
                    </li>
                    <li>Value: Paste your Google AI API key</li>
                    <li>Environment: Production, Preview, and Development</li>
                  </ul>
                </li>
                <li>Click "Save"</li>
              </ol>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-2">3. Redeploy Your Application</h3>
            <p className="text-muted-foreground mb-4">
              After adding the environment variable, redeploy your application for the changes to take effect.
            </p>
            <div className="border rounded-md p-4 bg-gray-50">
              <ol className="list-decimal list-inside space-y-2">
                <li>Go to the "Deployments" tab in your Vercel project</li>
                <li>Find your latest deployment</li>
                <li>Click the three dots menu (⋮) and select "Redeploy"</li>
                <li>Confirm the redeployment</li>
                <li>Wait for the deployment to complete</li>
              </ol>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <h3 className="font-medium mb-2 text-yellow-800">Important Notes</h3>
            <ul className="list-disc list-inside space-y-1 text-yellow-700">
              <li>Keep your API key secure and never share it publicly</li>
              <li>Vercel securely stores your environment variables and they are not exposed to the client</li>
              <li>The Google AI API may have usage limits or costs associated with it</li>
              <li>If you continue to experience issues, check the Vercel deployment logs for more details</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
