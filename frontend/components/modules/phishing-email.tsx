"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, AlertTriangle, CheckCircle } from "lucide-react"

export function PhishingEmail() {
  const [emailContent, setEmailContent] = useState("")
  const [analysis, setAnalysis] = useState<{
    suspicious: boolean
    keywords: string[]
    score: number
  } | null>(null)

  const [email, setEmail] = useState("");
  const suspiciousKeywords = [
    "urgent",
    "immediate",
    "verify",
    "suspend",
    "click here",
    "act now",
    "limited time",
    "congratulations",
    "winner",
    "free",
    "prize",
    "bank account",
    "social security",
    "password",
    "login",
    "confirm",
  ]

  const analyzeEmail = () => {
    const content = emailContent.toLowerCase()
    const foundKeywords = suspiciousKeywords.filter((keyword) => content.includes(keyword.toLowerCase()))

    const score = foundKeywords.length
    const suspicious = score >= 2

    setAnalysis({
      suspicious,
      keywords: foundKeywords,
      score,
    })
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Phishing Email Detection</h1>
        </div>
        <p className="text-gray-600">
          Paste an email below to analyze it for suspicious content and potential phishing indicators.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Analysis Tool</CardTitle>
          <CardDescription>This tool scans for common phishing keywords and patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium mb-2">
              Email address
            </label>

              <input
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="email"
        id="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
          </div>
          <div>
            <label htmlFor="email-content" className="block text-sm font-medium mb-2">
              Email Content
            </label>
            <Textarea
              id="email-content"
              placeholder="Paste the email content here..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="min-h-32"
            />
          </div>

          <Button onClick={analyzeEmail} disabled={!emailContent.trim()} className="w-full">
            Analyze Email
          </Button>

          {analysis && (
            <Alert className={analysis.suspicious ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
              <div className="flex items-center gap-2">
                {analysis.suspicious ? (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <AlertDescription className={analysis.suspicious ? "text-red-800" : "text-green-800"}>
                  <strong>{analysis.suspicious ? "Suspicious Email Detected!" : "Email Appears Safe"}</strong>
                  <div className="mt-2">Risk Score: {analysis.score}/10</div>
                  {analysis.keywords.length > 0 && (
                    <div className="mt-2">
                      <strong>Suspicious keywords found:</strong> {analysis.keywords.join(", ")}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
