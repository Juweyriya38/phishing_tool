"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, AlertTriangle, CheckCircle, XCircle, Shield } from "lucide-react"

interface PhoneAnalysis {
  phoneNumber: string
  isSuspicious: boolean
  riskLevel: "low" | "medium" | "high" | "critical"
  suspiciousIndicators: string[]
  warnings: string[]
  legitimacyScore: number
}

interface VishingScenario {
  id: string
  callerDisplay: string
  actualNumber: string
  scenario: string
  redFlags: string[]
}

const vishingScenarios: VishingScenario[] = [
  {
    id: "bank-fraud",
    callerDisplay: "First National Bank",
    actualNumber: "+1-555-0123",
    scenario:
      "Caller claims to be from your bank's fraud department. They say there's suspicious activity on your account and need to verify your identity by confirming your PIN and account number.",
    redFlags: [
      "Requests sensitive information over phone",
      "Creates urgency about account security",
      "Asks for PIN or passwords",
      "Number doesn't match bank's official number",
    ],
  },
  {
    id: "irs-scam",
    callerDisplay: "IRS Tax Department",
    actualNumber: "+1-202-555-0199",
    scenario:
      "Caller claims to be from the IRS saying you owe back taxes and will be arrested unless you pay immediately with gift cards or wire transfer.",
    redFlags: [
      "Threatens immediate arrest",
      "Demands payment via gift cards",
      "Creates extreme urgency",
      "IRS doesn't call about taxes owed",
    ],
  },
  {
    id: "tech-support",
    callerDisplay: "Microsoft Support",
    actualNumber: "+1-800-555-0156",
    scenario:
      "Caller claims your computer is infected with viruses and offers to help fix it remotely. They ask you to download software to give them access.",
    redFlags: [
      "Unsolicited tech support call",
      "Requests remote computer access",
      "Claims to detect problems remotely",
      "Microsoft doesn't make unsolicited calls",
    ],
  },
]

export function Vishing() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [analysis, setAnalysis] = useState<PhoneAnalysis | null>(null)
  const [currentScenario, setCurrentScenario] = useState<VishingScenario | null>(null)
  const [userResponse, setUserResponse] = useState<string>("")
  const [showScenarioResult, setShowScenarioResult] = useState(false)

  const suspiciousPatterns = {
    // Common spoofed/fake numbers
    fakeNumbers: [
      /^(\+1-?)?555-?555-?5555$/,
      /^(\+1-?)?123-?456-?7890$/,
      /^(\+1-?)?000-?000-?0000$/,
      /^(\+1-?)?111-?111-?1111$/,
      /^(\+1-?)?999-?999-?9999$/,
    ],
    // Repeated digits (often spoofed)
    repeatedDigits: /^(\+1-?)?(\d)\2{2}-?\2{3}-?\2{4}$/,
    // Sequential numbers
    sequential: /^(\+1-?)?123-?456-?7890$/,
    // International numbers trying to look local
    internationalSpoofing: /^\+(?!1)[0-9]{1,3}-?/,
    // Premium rate numbers
    premiumRate: /^(\+1-?)?900-?/,
  }

  const analyzePhoneNumber = () => {
    if (!phoneNumber.trim()) return

    const cleanNumber = phoneNumber.replace(/\s+/g, "")
    const suspiciousIndicators: string[] = []
    let riskLevel: "low" | "medium" | "high" | "critical" = "low"
    const warnings: string[] = []
    let legitimacyScore = 100

    // Check for fake/test numbers
    if (suspiciousPatterns.fakeNumbers.some((pattern) => pattern.test(cleanNumber))) {
      suspiciousIndicators.push("Known fake/test number pattern")
      riskLevel = "critical"
      legitimacyScore -= 50
    }

    // Check for repeated digits
    if (suspiciousPatterns.repeatedDigits.test(cleanNumber)) {
      suspiciousIndicators.push("Repeated digit pattern (often spoofed)")
      riskLevel = riskLevel === "critical" ? "critical" : "high"
      legitimacyScore -= 30
    }

    // Check for sequential numbers
    if (suspiciousPatterns.sequential.test(cleanNumber)) {
      suspiciousIndicators.push("Sequential number pattern")
      riskLevel = riskLevel === "critical" ? "critical" : "high"
      legitimacyScore -= 25
    }

    // Check for international spoofing
    if (suspiciousPatterns.internationalSpoofing.test(cleanNumber)) {
      suspiciousIndicators.push("International number attempting to appear local")
      riskLevel = riskLevel === "critical" ? "critical" : "medium"
      legitimacyScore -= 20
    }

    // Check for premium rate numbers
    if (suspiciousPatterns.premiumRate.test(cleanNumber)) {
      suspiciousIndicators.push("Premium rate number (900 area code)")
      riskLevel = riskLevel === "critical" ? "critical" : "medium"
      legitimacyScore -= 15
    }

    // Check for invalid format
    if (!/^(\+1-?)?[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/.test(cleanNumber) && cleanNumber.length > 0) {
      suspiciousIndicators.push("Invalid phone number format")
      legitimacyScore -= 10
    }

    // Generate warnings based on risk level
    if (riskLevel === "critical") {
      warnings.push("CRITICAL: This number shows clear signs of spoofing or fraud")
      warnings.push("Never provide personal information to calls from this number")
    } else if (riskLevel === "high") {
      warnings.push("HIGH RISK: This number has suspicious characteristics")
      warnings.push("Be extremely cautious with calls from this number")
    } else if (riskLevel === "medium") {
      warnings.push("MEDIUM RISK: Some suspicious indicators detected")
      warnings.push("Verify caller identity through official channels")
    } else if (suspiciousIndicators.length === 0) {
      warnings.push("Number format appears normal")
      warnings.push("Still verify caller identity for sensitive requests")
    }

    const isSuspicious = suspiciousIndicators.length > 0
    legitimacyScore = Math.max(0, legitimacyScore)

    setAnalysis({
      phoneNumber: cleanNumber,
      isSuspicious,
      riskLevel,
      suspiciousIndicators,
      warnings,
      legitimacyScore,
    })
  }

  const startScenario = (scenario: VishingScenario) => {
    setCurrentScenario(scenario)
    setUserResponse("")
    setShowScenarioResult(false)
  }

  const submitScenarioResponse = () => {
    setShowScenarioResult(true)
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return "border-red-500 bg-red-50 text-red-800"
      case "high":
        return "border-orange-500 bg-orange-50 text-orange-800"
      case "medium":
        return "border-yellow-500 bg-yellow-50 text-yellow-800"
      case "low":
        return "border-green-500 bg-green-50 text-green-800"
      default:
        return "border-gray-500 bg-gray-50 text-gray-800"
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <Shield className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Phone className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Vishing Phone Checker</h1>
        </div>
        <p className="text-gray-600">
          Analyze phone numbers for spoofing indicators and practice responding to vishing (voice phishing) attack
          scenarios.
        </p>
      </div>

      <div className="space-y-6">
        {/* Phone Number Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Phone Number Spoofing Detector</CardTitle>
            <CardDescription>Enter a phone number to check for common spoofing patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="phone-input" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <Input
                id="phone-input"
                type="tel"
                placeholder="+1-555-123-4567 or (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <Button onClick={analyzePhoneNumber} disabled={!phoneNumber.trim()} className="w-full">
              Analyze Phone Number
            </Button>

            {analysis && (
              <Alert className={getRiskColor(analysis.riskLevel)}>
                <div className="flex items-start gap-3">
                  {getRiskIcon(analysis.riskLevel)}
                  <div className="flex-1">
                    <AlertDescription>
                      <div className="font-semibold text-lg mb-2">Risk Level: {analysis.riskLevel.toUpperCase()}</div>
                      <div className="mb-2">
                        <strong>Legitimacy Score:</strong> {analysis.legitimacyScore}/100
                      </div>

                      {analysis.suspiciousIndicators.length > 0 && (
                        <div className="mb-3">
                          <strong>Suspicious Indicators:</strong>
                          <ul className="mt-1 ml-4">
                            {analysis.suspiciousIndicators.map((indicator, index) => (
                              <li key={index} className="text-sm">
                                • {indicator}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <strong>Security Recommendations:</strong>
                        <ul className="mt-1 ml-4">
                          {analysis.warnings.map((warning, index) => (
                            <li key={index} className="text-sm">
                              • {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Vishing Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Vishing Attack Scenarios</CardTitle>
            <CardDescription>Practice identifying and responding to common vishing attacks</CardDescription>
          </CardHeader>
          <CardContent>
            {!currentScenario ? (
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                {vishingScenarios.map((scenario) => (
                  <Card key={scenario.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <div className="font-semibold text-green-700">Caller ID Display:</div>
                        <div className="text-sm bg-green-100 p-2 rounded border">{scenario.callerDisplay}</div>
                      </div>
                      <div className="mb-3">
                        <div className="font-semibold text-red-700">Actual Number:</div>
                        <div className="text-sm bg-red-100 p-2 rounded border font-mono">{scenario.actualNumber}</div>
                      </div>
                      <Button onClick={() => startScenario(scenario)} className="w-full" size="sm">
                        Start Scenario
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <div className="font-semibold text-green-700 mb-1">What You See (Caller ID):</div>
                      <div className="bg-green-100 p-2 rounded text-sm">{currentScenario.callerDisplay}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-red-700 mb-1">Actual Number:</div>
                      <div className="bg-red-100 p-2 rounded text-sm font-mono">{currentScenario.actualNumber}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold mb-2">Scenario:</h4>
                  <p className="text-sm">{currentScenario.scenario}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">How would you respond to this call?</label>
                  <textarea
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={3}
                    placeholder="Describe how you would handle this situation..."
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                  />
                </div>

                {!showScenarioResult ? (
                  <div className="flex gap-3">
                    <Button onClick={submitScenarioResponse} disabled={!userResponse.trim()} className="flex-1">
                      Submit Response
                    </Button>
                    <Button onClick={() => setCurrentScenario(null)} variant="outline">
                      Back to Scenarios
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <div className="font-semibold mb-2">Red Flags in This Scenario:</div>
                        <ul className="space-y-1">
                          {currentScenario.redFlags.map((flag, index) => (
                            <li key={index} className="text-sm">
                              • {flag}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>

                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <div className="font-semibold mb-2">Correct Response:</div>
                        <div className="text-sm space-y-1">
                          <p>• Hang up immediately - don't engage with the caller</p>
                          <p>• Never provide personal information over unsolicited calls</p>
                          <p>• Contact the organization directly using official phone numbers</p>
                          <p>• Report the suspicious call to relevant authorities</p>
                        </div>
                      </AlertDescription>
                    </Alert>

                    <Button onClick={() => setCurrentScenario(null)} className="w-full">
                      Try Another Scenario
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Educational Content */}
        <Card>
          <CardHeader>
            <CardTitle>Vishing Attack Prevention</CardTitle>
            <CardDescription>Learn to recognize and defend against voice phishing attacks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-3 text-red-700">Common Vishing Tactics:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Caller ID spoofing to appear legitimate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Creating urgency or fear (account closure, arrest)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Requesting sensitive information for "verification"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Impersonating trusted organizations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Offering fake prizes or rewards</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-700">Protection Strategies:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Never give personal info to unsolicited callers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Hang up and call back using official numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Be suspicious of urgent requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Verify caller identity through other channels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Report suspicious calls to authorities</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
