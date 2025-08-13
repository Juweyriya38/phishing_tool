"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Upload, AlertTriangle, CheckCircle, XCircle, Shield } from "lucide-react"

interface FileAnalysis {
  fileName: string
  extension: string
  size: string
  isDangerous: boolean
  riskLevel: "low" | "medium" | "high" | "critical"
  warnings: string[]
}

export function BaitingFile() {
  const [fileAnalysis, setFileAnalysis] = useState<FileAnalysis | null>(null)
  const [dragOver, setDragOver] = useState(false)

  // Dangerous file extensions categorized by risk level
  const dangerousExtensions = {
    critical: [".exe", ".bat", ".cmd", ".com", ".pif", ".scr", ".vbs", ".js", ".jar"],
    high: [".msi", ".deb", ".rpm", ".dmg", ".pkg", ".app", ".run"],
    medium: [".zip", ".rar", ".7z", ".tar", ".gz", ".iso", ".img"],
    low: [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"],
  }

  const getRiskLevel = (extension: string): "low" | "medium" | "high" | "critical" => {
    const ext = extension.toLowerCase()
    if (dangerousExtensions.critical.includes(ext)) return "critical"
    if (dangerousExtensions.high.includes(ext)) return "high"
    if (dangerousExtensions.medium.includes(ext)) return "medium"
    if (dangerousExtensions.low.includes(ext)) return "low"
    return "low"
  }

  const getWarnings = (extension: string, riskLevel: string): string[] => {
    const warnings: string[] = []
    const ext = extension.toLowerCase()

    if (riskLevel === "critical") {
      warnings.push("CRITICAL: This file type can execute code and install malware")
      if ([".exe", ".bat", ".cmd"].includes(ext)) {
        warnings.push("Never run executable files from unknown sources")
      }
      if ([".vbs", ".js"].includes(ext)) {
        warnings.push("Script files can perform malicious actions automatically")
      }
    } else if (riskLevel === "high") {
      warnings.push("HIGH RISK: Installation packages can modify your system")
      warnings.push("Only install software from trusted sources")
    } else if (riskLevel === "medium") {
      warnings.push("MEDIUM RISK: Archive files may contain hidden malware")
      warnings.push("Scan contents before extracting")
    } else if (riskLevel === "low") {
      warnings.push("LOW RISK: Document files can contain macros or embedded content")
      warnings.push("Disable macros unless from trusted source")
    }

    return warnings
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const analyzeFile = (file: File) => {
    const fileName = file.name
    const extension = "." + fileName.split(".").pop()?.toLowerCase() || ""
    const size = formatFileSize(file.size)
    const riskLevel = getRiskLevel(extension)
    const isDangerous = riskLevel === "critical" || riskLevel === "high"
    const warnings = getWarnings(extension, riskLevel)

    setFileAnalysis({
      fileName,
      extension,
      size,
      isDangerous,
      riskLevel,
      warnings,
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      analyzeFile(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      analyzeFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
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
        return "border-blue-500 bg-blue-50 text-blue-800"
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
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      default:
        return <Shield className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">File Baiting Detection</h1>
        </div>
        <p className="text-gray-600">
          Upload files to check for dangerous extensions and potential security threats commonly used in baiting
          attacks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File Security Scanner</CardTitle>
          <CardDescription>Analyze files for dangerous extensions and security risks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Drop a file here or click to browse</p>
              <p className="text-sm text-gray-500">Any file type accepted for analysis</p>
            </div>
            <Input
              type="file"
              onChange={handleFileUpload}
              className="mt-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* File Analysis Results */}
          {fileAnalysis && (
            <div className="space-y-4">
              <Alert className={getRiskColor(fileAnalysis.riskLevel)}>
                <div className="flex items-start gap-3">
                  {getRiskIcon(fileAnalysis.riskLevel)}
                  <div className="flex-1">
                    <AlertDescription>
                      <div className="font-semibold text-lg mb-2">
                        Risk Level: {fileAnalysis.riskLevel.toUpperCase()}
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div>
                          <strong>File:</strong> {fileAnalysis.fileName}
                        </div>
                        <div>
                          <strong>Extension:</strong> {fileAnalysis.extension}
                        </div>
                        <div>
                          <strong>Size:</strong> {fileAnalysis.size}
                        </div>
                      </div>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>

              {/* Warnings */}
              {fileAnalysis.warnings.length > 0 && (
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Security Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {fileAnalysis.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-red-600 font-bold">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Educational Content */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">File Baiting Attack Prevention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3 text-red-700">Dangerous File Types:</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong className="text-red-600">Critical:</strong> .exe, .bat, .cmd, .vbs, .js
                    </div>
                    <div>
                      <strong className="text-orange-600">High:</strong> .msi, .deb, .dmg, .pkg
                    </div>
                    <div>
                      <strong className="text-yellow-600">Medium:</strong> .zip, .rar, .7z, .iso
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">Safety Tips:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Never run files from unknown sources</li>
                    <li>• Use antivirus software to scan files</li>
                    <li>• Be suspicious of unexpected attachments</li>
                    <li>• Verify sender before opening files</li>
                    <li>• Keep software updated</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
