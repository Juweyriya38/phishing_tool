"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Gift, AlertTriangle, CheckCircle, XCircle, TrendingUp } from "lucide-react"

interface Question {
  id: string
  scenario: string
  question: string
  reward: string
  riskLevel: "low" | "medium" | "high" | "critical"
  consequences: string[]
  safeAlternative: string
}

interface QuizResult {
  totalQuestions: number
  safeChoices: number
  riskyChoices: number
  score: number
  riskLevel: "excellent" | "good" | "concerning" | "dangerous"
}

const questions: Question[] = [
  {
    id: "free-wifi",
    scenario:
      "You're at a coffee shop and see a 'Free Premium WiFi' network that requires you to enter your email and phone number to access.",
    question: "Would you provide your email and phone number for free premium WiFi access?",
    reward: "Free Premium WiFi Access",
    riskLevel: "medium",
    consequences: [
      "Email and phone added to spam/marketing lists",
      "Personal information sold to third parties",
      "Potential for targeted phishing attacks",
      "Network could be malicious honeypot",
    ],
    safeAlternative: "Use the coffee shop's official WiFi or your mobile data instead",
  },
  {
    id: "survey-gift-card",
    scenario:
      "You receive an email offering a $100 Amazon gift card for completing a 'quick survey' that asks for your full name, address, phone number, and income level.",
    question: "Would you complete this survey to get the $100 gift card?",
    reward: "$100 Amazon Gift Card",
    riskLevel: "high",
    consequences: [
      "Identity theft risk with full personal details",
      "Information sold to scammers and marketers",
      "Fake gift card - reward likely doesn't exist",
      "Potential for financial fraud",
    ],
    safeAlternative: "Participate only in surveys from verified, reputable organizations",
  },
  {
    id: "social-media-quiz",
    scenario:
      "A fun personality quiz on social media promises to reveal 'What Disney Character Are You?' but requires access to your profile, friends list, and posts.",
    question: "Would you grant access to this quiz app to see your Disney character match?",
    reward: "Disney Character Personality Result",
    riskLevel: "medium",
    consequences: [
      "App harvests your personal data and contacts",
      "Friends may receive spam from the app",
      "Personal information used for targeted advertising",
      "Potential privacy violations",
    ],
    safeAlternative: "Enjoy quizzes that don't require extensive permissions or personal data",
  },
  {
    id: "tech-support-discount",
    scenario:
      "A caller claims to be from your internet provider offering a 50% discount on your bill if you verify your account by providing your SSN and account password.",
    question: "Would you provide your SSN and password to get the 50% discount?",
    reward: "50% Discount on Internet Bill",
    riskLevel: "critical",
    consequences: [
      "Complete identity theft with SSN access",
      "Account takeover with password",
      "Financial fraud and unauthorized charges",
      "Credit damage and long-term identity issues",
    ],
    safeAlternative: "Contact your provider directly using official phone numbers to verify any offers",
  },
  {
    id: "app-permissions",
    scenario:
      "A new flashlight app requests access to your contacts, location, camera, and microphone, claiming it needs these for 'enhanced features' and offers ad-free experience.",
    question: "Would you grant all these permissions for the ad-free flashlight app?",
    reward: "Ad-Free Flashlight App",
    riskLevel: "high",
    consequences: [
      "Unnecessary access to sensitive personal data",
      "Location tracking and privacy invasion",
      "Contact information harvesting",
      "Potential for covert surveillance",
    ],
    safeAlternative: "Use apps that only request permissions necessary for their core function",
  },
  {
    id: "loyalty-program",
    scenario:
      "A new store offers an exclusive loyalty program with 'VIP benefits' but requires your driver's license number, birth date, and mother's maiden name for 'identity verification.'",
    question: "Would you provide this information to join the VIP loyalty program?",
    reward: "VIP Loyalty Program Benefits",
    riskLevel: "critical",
    consequences: [
      "Identity theft with driver's license and birth date",
      "Security question answers compromised",
      "Potential for financial account breaches",
      "Long-term identity fraud risk",
    ],
    safeAlternative: "Join loyalty programs that only require basic contact information",
  },
]

export function QuidProQuo() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>({})
  const [showResult, setShowResult] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [showQuestionResult, setShowQuestionResult] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleAnswer = (answer: boolean) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer }
    setAnswers(newAnswers)
    setShowQuestionResult(true)
  }

  const nextQuestion = () => {
    if (isLastQuestion) {
      calculateResults()
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowQuestionResult(false)
    }
  }

  const calculateResults = () => {
    const totalQuestions = questions.length
    const riskyChoices = Object.values(answers).filter((answer) => answer).length
    const safeChoices = totalQuestions - riskyChoices
    const score = Math.round((safeChoices / totalQuestions) * 100)

    let riskLevel: "excellent" | "good" | "concerning" | "dangerous"
    if (score >= 90) riskLevel = "excellent"
    else if (score >= 70) riskLevel = "good"
    else if (score >= 50) riskLevel = "concerning"
    else riskLevel = "dangerous"

    setQuizResult({
      totalQuestions,
      safeChoices,
      riskyChoices,
      score,
      riskLevel,
    })
    setShowResult(true)
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowResult(false)
    setQuizResult(null)
    setShowQuestionResult(false)
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "high":
        return "border-orange-500 bg-orange-50"
      case "medium":
        return "border-yellow-500 bg-yellow-50"
      case "low":
        return "border-blue-500 bg-blue-50"
      default:
        return "border-gray-500 bg-gray-50"
    }
  }

  const getResultColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "excellent":
        return "border-green-500 bg-green-50 text-green-800"
      case "good":
        return "border-blue-500 bg-blue-50 text-blue-800"
      case "concerning":
        return "border-yellow-500 bg-yellow-50 text-yellow-800"
      case "dangerous":
        return "border-red-500 bg-red-50 text-red-800"
      default:
        return "border-gray-500 bg-gray-50 text-gray-800"
    }
  }

  const getResultIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "excellent":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "good":
        return <CheckCircle className="h-6 w-6 text-blue-600" />
      case "concerning":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case "dangerous":
        return <XCircle className="h-6 w-6 text-red-600" />
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-600" />
    }
  }

  if (showResult && quizResult) {
    return (
      <div className="max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Quid Pro Quo Assessment Results</h1>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6" />
              Your Security Awareness Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={getResultColor(quizResult.riskLevel)}>
              <div className="flex items-center gap-4">
                {getResultIcon(quizResult.riskLevel)}
                <div className="flex-1">
                  <AlertDescription>
                    <div className="text-2xl font-bold mb-2">{quizResult.score}% Security Awareness</div>
                    <div className="grid gap-2 text-sm">
                      <div>
                        <strong>Safe Choices:</strong> {quizResult.safeChoices}/{quizResult.totalQuestions}
                      </div>
                      <div>
                        <strong>Risky Choices:</strong> {quizResult.riskyChoices}/{quizResult.totalQuestions}
                      </div>
                      <div>
                        <strong>Risk Level:</strong> {quizResult.riskLevel.toUpperCase()}
                      </div>
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id]
                const isCorrect = !userAnswer // Safe choice is "No"

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold mb-2">
                          Question {index + 1}: {question.reward}
                        </div>
                        <div className="text-sm mb-2">
                          <strong>Your Answer:</strong>{" "}
                          {userAnswer ? "Yes, I would take the offer" : "No, I would decline"}
                        </div>
                        <div className={`text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                          <strong>{isCorrect ? "Correct!" : "Risky Choice!"}</strong>{" "}
                          {isCorrect
                            ? "You avoided a potential security threat."
                            : "This choice could expose you to security risks."}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={restartQuiz} className="flex-1">
            Retake Assessment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Quid Pro Quo Security Assessment</h1>
        </div>
        <p className="text-gray-600">
          Test your awareness of quid pro quo attacks where criminals offer rewards in exchange for personal information
          or access.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
            <div className="text-sm text-gray-500">
              Progress: {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Scenario */}
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold mb-2">Scenario:</h4>
              <p className="text-sm">{currentQuestion.scenario}</p>
            </div>

            {/* Reward Offer */}
            <Alert className={getRiskColor(currentQuestion.riskLevel)}>
              <Gift className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">Reward Offered:</div>
                <div className="text-lg">{currentQuestion.reward}</div>
                <div className="text-sm mt-1">Risk Level: {currentQuestion.riskLevel.toUpperCase()}</div>
              </AlertDescription>
            </Alert>

            {/* Question */}
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <h4 className="font-semibold mb-4">{currentQuestion.question}</h4>

              {!showQuestionResult ? (
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleAnswer(true)}
                    variant="outline"
                    className="flex-1 hover:bg-red-50 hover:border-red-300"
                  >
                    Yes, I would take this offer
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false)}
                    variant="outline"
                    className="flex-1 hover:bg-green-50 hover:border-green-300"
                  >
                    No, I would decline
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert
                    className={
                      answers[currentQuestion.id] ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                    }
                  >
                    <div className="flex items-center gap-2">
                      {answers[currentQuestion.id] ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <AlertDescription className={answers[currentQuestion.id] ? "text-red-800" : "text-green-800"}>
                        <div className="font-semibold mb-2">
                          {answers[currentQuestion.id] ? "Risky Choice!" : "Safe Choice!"}
                        </div>
                        <div className="text-sm">
                          Your answer:{" "}
                          {answers[currentQuestion.id] ? "Yes, I would take the offer" : "No, I would decline"}
                        </div>
                      </AlertDescription>
                    </div>
                  </Alert>

                  {answers[currentQuestion.id] && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        <div className="font-semibold mb-2">Potential Consequences:</div>
                        <ul className="text-sm space-y-1">
                          {currentQuestion.consequences.map((consequence, index) => (
                            <li key={index}>• {consequence}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Alert className="border-blue-200 bg-blue-50">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <div className="font-semibold mb-2">Safe Alternative:</div>
                      <div className="text-sm">{currentQuestion.safeAlternative}</div>
                    </AlertDescription>
                  </Alert>

                  <Button onClick={nextQuestion} className="w-full">
                    {isLastQuestion ? "View Results" : "Next Question"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Content */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Quid Pro Quo Attacks</CardTitle>
          <CardDescription>Learn about this social engineering tactic and how to protect yourself</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-3 text-red-700">Common Quid Pro Quo Tactics:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Free services requiring personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Surveys offering valuable rewards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Apps requesting excessive permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Discounts requiring sensitive verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Exclusive access for personal details</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-green-700">Protection Strategies:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Question why personal info is needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Research offers before participating</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Read privacy policies and terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Use minimal necessary permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Remember: if it seems too good to be true, it probably is</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
