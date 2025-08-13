"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserCheck, AlertTriangle, CheckCircle, XCircle, Shield } from "lucide-react"

interface FormData {
  fullName: string
  ssn: string
  dateOfBirth: string
  mothersMaiden: string
  address: string
  phoneNumber: string
}

interface ValidationResult {
  isSuspicious: boolean
  suspiciousFields: string[]
  riskScore: number
  warnings: string[]
}

export function Pretexting() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    ssn: "",
    dateOfBirth: "",
    mothersMaiden: "",
    address: "",
    phoneNumber: "",
  })
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [showSimulation, setShowSimulation] = useState(false)

  // Common fake/placeholder patterns
  const suspiciousPatterns = {
    fullName: [
      /^(john|jane)\s+(doe|smith)$/i,
      /^test\s+/i,
      /^fake\s+/i,
      /^example\s+/i,
      /^[a-z]{1,2}\s+[a-z]{1,2}$/i, // Very short names
    ],
    ssn: [
      /^123-?45-?6789$/,
      /^000-?00-?0000$/,
      /^111-?11-?1111$/,
      /^222-?22-?2222$/,
      /^999-?99-?9999$/,
      /^(\d)\1{2}-?\1{2}-?\1{4}$/, // Repeated digits
    ],
    dateOfBirth: [
      /^01\/01\/(19|20)\d{2}$/, // January 1st dates
      /^12\/25\/(19|20)\d{2}$/, // Christmas
      /^(19|20)00-01-01$/, // Year 2000 or 1900
    ],
    mothersMaiden: [
      /^(smith|johnson|williams|brown|jones|garcia|miller|davis|rodriguez|martinez)$/i,
      /^test$/i,
      /^fake$/i,
      /^example$/i,
      /^n\/a$/i,
      /^none$/i,
    ],
    address: [
      /123\s+main\s+st/i,
      /456\s+elm\s+st/i,
      /789\s+oak\s+ave/i,
      /test\s+address/i,
      /fake\s+address/i,
      /example\s+street/i,
    ],
    phoneNumber: [
      /^555-?555-?5555$/,
      /^123-?456-?7890$/,
      /^000-?000-?0000$/,
      /^111-?111-?1111$/,
      /^(\d)\1{2}-?\1{3}-?\1{4}$/, // Repeated digits
    ],
  }

  const validateForm = () => {
    const suspiciousFields: string[] = []
    let riskScore = 0
    const warnings: string[] = []

    // Check each field for suspicious patterns
    Object.entries(formData).forEach(([field, value]) => {
      if (value.trim()) {
        const patterns = suspiciousPatterns[field as keyof typeof suspiciousPatterns]
        const isSuspicious = patterns.some((pattern) => pattern.test(value.trim()))

        if (isSuspicious) {
          suspiciousFields.push(field)
          riskScore += 15
        }

        // Additional checks
        if (field === "ssn" && value.length > 0 && !/^\d{3}-?\d{2}-?\d{4}$/.test(value)) {
          warnings.push("SSN format appears invalid")
          riskScore += 10
        }

        if (field === "phoneNumber" && value.length > 0 && !/^\d{3}-?\d{3}-?\d{4}$/.test(value)) {
          warnings.push("Phone number format appears invalid")
          riskScore += 5
        }
      }
    })

    // Check for completely empty form
    const filledFields = Object.values(formData).filter((value) => value.trim()).length
    if (filledFields === 0) {
      warnings.push("No information provided - this is actually the safest approach!")
      riskScore = 0
    } else if (filledFields < 3) {
      warnings.push("Partial information provided - still risky to share any personal data")
      riskScore += 5
    }

    // Add educational warnings
    if (riskScore > 0) {
      warnings.push("Never provide personal information to unsolicited requests")
      warnings.push("Legitimate organizations don't ask for sensitive data via email or phone")
    }

    const isSuspicious = suspiciousFields.length > 0 || riskScore > 20

    setValidationResult({
      isSuspicious,
      suspiciousFields,
      riskScore: Math.min(riskScore, 100),
      warnings,
    })
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const clearForm = () => {
    setFormData({
      fullName: "",
      ssn: "",
      dateOfBirth: "",
      mothersMaiden: "",
      address: "",
      phoneNumber: "",
    })
    setValidationResult(null)
  }

  const fillWithFakeData = () => {
    setFormData({
      fullName: "John Doe",
      ssn: "123-45-6789",
      dateOfBirth: "01/01/1990",
      mothersMaiden: "Smith",
      address: "123 Main St, Anytown, USA",
      phoneNumber: "555-555-5555",
    })
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <UserCheck className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Pretexting ID Verification</h1>
        </div>
        <p className="text-gray-600">
          Learn to recognize fake ID verification requests used in pretexting attacks where criminals impersonate
          authority figures.
        </p>
      </div>

      <div className="space-y-6">
        {/* Simulation Toggle */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">Training Simulation</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Practice identifying suspicious verification requests in a safe environment
                </p>
              </div>
              <Button
                onClick={() => setShowSimulation(!showSimulation)}
                variant={showSimulation ? "destructive" : "default"}
              >
                {showSimulation ? "Exit Simulation" : "Start Simulation"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {showSimulation && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="bg-red-100 border-b border-red-200">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                <div>
                  <CardTitle className="text-red-800">URGENT: Account Verification Required</CardTitle>
                  <CardDescription className="text-red-700">
                    Your account has been flagged for suspicious activity. Verify your identity immediately to avoid
                    suspension.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Alert className="mb-4 border-red-300 bg-red-100">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>This is a FAKE verification form for training purposes!</strong> Real attackers use similar
                  tactics to steal personal information.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full legal name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Social Security Number *</label>
                  <Input
                    value={formData.ssn}
                    onChange={(e) => handleInputChange("ssn", e.target.value)}
                    placeholder="XXX-XX-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                  <Input
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    placeholder="MM/DD/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mother's Maiden Name *</label>
                  <Input
                    value={formData.mothersMaiden}
                    onChange={(e) => handleInputChange("mothersMaiden", e.target.value)}
                    placeholder="Enter maiden name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Home Address *</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Street, City, State, ZIP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="XXX-XXX-XXXX"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={validateForm} className="flex-1">
                  Analyze Form Data
                </Button>
                <Button onClick={fillWithFakeData} variant="outline">
                  Fill with Test Data
                </Button>
                <Button onClick={clearForm} variant="outline">
                  Clear Form
                </Button>
              </div>

              {validationResult && (
                <Alert
                  className={`mt-4 ${
                    validationResult.riskScore === 0
                      ? "border-green-200 bg-green-50"
                      : validationResult.isSuspicious
                        ? "border-red-200 bg-red-50"
                        : "border-yellow-200 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {validationResult.riskScore === 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : validationResult.isSuspicious ? (
                      <XCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    <AlertDescription
                      className={
                        validationResult.riskScore === 0
                          ? "text-green-800"
                          : validationResult.isSuspicious
                            ? "text-red-800"
                            : "text-yellow-800"
                      }
                    >
                      <div className="font-semibold mb-2">
                        Risk Score: {validationResult.riskScore}/100
                        {validationResult.riskScore === 0 && " - Excellent!"}
                        {validationResult.isSuspicious && " - Suspicious Data Detected"}
                      </div>

                      {validationResult.suspiciousFields.length > 0 && (
                        <div className="mb-2">
                          <strong>Suspicious fields:</strong> {validationResult.suspiciousFields.join(", ")}
                        </div>
                      )}

                      {validationResult.warnings.map((warning, index) => (
                        <div key={index} className="text-sm mt-1">
                          • {warning}
                        </div>
                      ))}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Educational Content */}
        <Card>
          <CardHeader>
            <CardTitle>Pretexting Attack Prevention</CardTitle>
            <CardDescription>
              Learn to recognize and defend against pretexting social engineering attacks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-3 text-red-700">Red Flags in Verification Requests:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Urgent language and time pressure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Requests for sensitive information via email/phone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Threats of account suspension or legal action</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Impersonation of authority figures or IT staff</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Requests for passwords or security codes</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-700">How to Protect Yourself:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Verify the requester through official channels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Never provide sensitive info via email or phone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Take time to think - don't rush decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Contact the organization directly using known numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Trust your instincts if something feels wrong</span>
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
