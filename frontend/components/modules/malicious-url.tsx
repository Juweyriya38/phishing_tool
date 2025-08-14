"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link, Upload, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function MaliciousUrl() {
  const [url, setUrl] = useState("")
  const [urlResult, setUrlResult] = useState<{
    valid: boolean
    safe: boolean
    message: string
  } | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const suspiciousDomains = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "short.link", "tiny.cc"]

  const maliciousPatterns = [
    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP addresses
    /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+\.(tk|ml|ga|cf)/, // Suspicious TLDs with random subdomains
    /(login|secure|verify|update|confirm).*(paypal|amazon|microsoft|google|apple)/i,
    /(urgent|immediate|suspended|expired)/i,
  ]

  const validateUrl = () => {
    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname.toLowerCase()

      // Check if it's a suspicious domain
      const isSuspiciousDomain = suspiciousDomains.some((suspDomain) => domain.includes(suspDomain))

      // Check for malicious patterns
      const hasMaliciousPattern = maliciousPatterns.some((pattern) => pattern.test(url))

      // Check for suspicious characteristics
      const hasMultipleSubdomains = domain.split(".").length > 3
      const hasRandomChars = /[0-9]{5,}/.test(domain) || /[a-z]{20,}/.test(domain)

      let safe = true
      let message = "URL appears to be valid and safe"

      if (isSuspiciousDomain) {
        safe = false
        message = "Warning: This URL uses a URL shortener which could hide the real destination"
      } else if (hasMaliciousPattern) {
        safe = false
        message = "Danger: This URL contains patterns commonly used in phishing attacks"
      } else if (hasMultipleSubdomains || hasRandomChars) {
        safe = false
        message = "Suspicious: This URL has characteristics of a potentially malicious site"
      }

      setUrlResult({
        valid: true,
        safe,
        message,
      })
    } catch (error) {
      setUrlResult({
        valid: false,
        safe: false,
        message: "Invalid URL format",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Malicious URL Testing</h1>
        </div>
        <p className="text-gray-600">
          Test URLs for validity and potential security threats, plus upload files for analysis.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* URL Testing Card */}
        <Card>
          <CardHeader>
            <CardTitle>URL Validator</CardTitle>
            <CardDescription>Check if a URL is valid and potentially safe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="url-input" className="block text-sm font-medium mb-2">
                Enter URL to Test
              </label>
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <Button onClick={validateUrl} disabled={!url.trim()} className="w-full">
              Test URL
            </Button>

            {urlResult && (
              <Alert
                className={
                  !urlResult.valid
                    ? "border-red-200 bg-red-50"
                    : urlResult.safe
                      ? "border-green-200 bg-green-50"
                      : "border-yellow-200 bg-yellow-50"
                }
              >
                <div className="flex items-center gap-2">
                  {!urlResult.valid ? (
                    <XCircle className="h-4 w-4 text-red-600" />
                  ) : urlResult.safe ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                  <AlertDescription
                    className={
                      !urlResult.valid ? "text-red-800" : urlResult.safe ? "text-green-800" : "text-yellow-800"
                    }
                  >
                    <div className="flex items-center gap-2">
                      <strong>{urlResult.valid ? "✅ Valid" : "❌ Invalid"}</strong>
                      {urlResult.valid && <span>{urlResult.safe ? "& Safe" : "& Suspicious"}</span>}
                    </div>
                    <div className="mt-1">{urlResult.message}</div>
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* File Upload Card */}
        </div>

      {/* Educational Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Security Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-sm mb-2">Red Flags in URLs:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• URL shorteners (bit.ly, tinyurl.com)</li>
                <li>• IP addresses instead of domain names</li>
                <li>• Misspelled popular websites</li>
                <li>• Suspicious subdomains</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Safe Practices:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hover over links before clicking</li>
                <li>• Type URLs directly into browser</li>
                <li>• Look for HTTPS and valid certificates</li>
                <li>• Be cautious with email links</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
