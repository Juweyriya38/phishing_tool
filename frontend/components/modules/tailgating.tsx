"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DoorOpen, Users, Shield, CheckCircle, XCircle } from "lucide-react"

type Scenario = {
  id: string
  title: string
  description: string
  image: string
  situation: string
  options: {
    text: string
    correct: boolean
    explanation: string
  }[]
}

const scenarios: Scenario[] = [
  {
    id: "office-entry",
    title: "Office Building Entry",
    description: "You're entering your office building with your access card",
    image: "/placeholder-7yd8u.png",
    situation:
      "As you badge in through the secure entrance, a person in business attire approaches behind you carrying a coffee and briefcase. They say 'Thanks for holding the door!' and move to follow you through.",
    options: [
      {
        text: "Hold the door open for them - they look like they belong here",
        correct: false,
        explanation:
          "INCORRECT: Never allow unauthorized access. Appearance can be deceiving and is often used by attackers to blend in.",
      },
      {
        text: "Let the door close and ask them to use their own access card",
        correct: true,
        explanation:
          "CORRECT: Always require proper authentication. Legitimate employees will understand and have their own access.",
      },
      {
        text: "Ask to see their employee ID before letting them through",
        correct: false,
        explanation:
          "PARTIALLY CORRECT: While verification is good, IDs can be faked. It's better to require proper badge access.",
      },
    ],
  },
  {
    id: "server-room",
    title: "Server Room Access",
    description: "You're accessing the secure server room for maintenance",
    image: "/placeholder-3qvhh.png",
    situation:
      "You badge into the server room for scheduled maintenance. A person in an IT uniform approaches saying 'I'm the new tech support guy, can you let me in? I forgot my badge on my first day.'",
    options: [
      {
        text: "Let them in - they're wearing an IT uniform and seem legitimate",
        correct: false,
        explanation:
          "INCORRECT: Uniforms and stories are common social engineering tactics. Never bypass security protocols.",
      },
      {
        text: "Direct them to security or their supervisor to get proper access",
        correct: true,
        explanation:
          "CORRECT: Always follow proper procedures. Legitimate employees can get access through official channels.",
      },
      {
        text: "Ask them to wait while you verify their identity with IT management",
        correct: true,
        explanation:
          "CORRECT: Verification through official channels is the right approach for security-sensitive areas.",
      },
    ],
  },
  {
    id: "delivery-person",
    title: "Delivery Access",
    description: "A delivery person needs access to your secure facility",
    image: "/delivery-person-office.png",
    situation:
      "You're leaving the building when a delivery person with packages approaches. They say 'I have an urgent delivery for the 5th floor, but the front desk is closed. Can you let me in quickly?'",
    options: [
      {
        text: "Let them in - they have legitimate packages to deliver",
        correct: false,
        explanation:
          "INCORRECT: Packages can be fake props. Delivery personnel should have proper procedures for after-hours access.",
      },
      {
        text: "Direct them to use the proper delivery entrance or contact security",
        correct: true,
        explanation:
          "CORRECT: All visitors, including delivery personnel, should follow established security procedures.",
      },
      {
        text: "Take the packages and deliver them yourself",
        correct: false,
        explanation:
          "INCORRECT: You shouldn't accept responsibility for unverified packages or bypass security protocols.",
      },
    ],
  },
]

export function Tailgating() {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const startScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario)
    setSelectedOption(null)
    setShowResult(false)
  }

  const selectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  const submitAnswer = () => {
    if (selectedOption !== null && currentScenario) {
      const isCorrect = currentScenario.options[selectedOption].correct
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }))
      setShowResult(true)
    }
  }

  const resetScenario = () => {
    setCurrentScenario(null)
    setSelectedOption(null)
    setShowResult(false)
  }

  const resetScore = () => {
    setScore({ correct: 0, total: 0 })
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <DoorOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Tailgating Security Simulation</h1>
        </div>
        <p className="text-gray-600">
          Practice identifying and preventing tailgating attacks where unauthorized individuals follow authorized
          personnel through secure areas.
        </p>
      </div>

      {/* Score Display */}
      {score.total > 0 && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-800">
                    Security Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
                  </div>
                  <div className="text-sm text-blue-600">
                    {score.correct === score.total
                      ? "Perfect security awareness!"
                      : "Keep practicing to improve your security instincts"}
                  </div>
                </div>
              </div>
              <Button onClick={resetScore} variant="outline" size="sm">
                Reset Score
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!currentScenario ? (
        /* Scenario Selection */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Tailgating Scenario</CardTitle>
              <CardDescription>
                Select a scenario to practice your response to potential tailgating attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {scenarios.map((scenario) => (
                  <Card key={scenario.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <img
                        src={scenario.image || "/placeholder.svg"}
                        alt={scenario.title}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                      <h3 className="font-semibold mb-2">{scenario.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                      <Button onClick={() => startScenario(scenario)} className="w-full" size="sm">
                        Start Scenario
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Educational Content */}
          <Card>
            <CardHeader>
              <CardTitle>Understanding Tailgating Attacks</CardTitle>
              <CardDescription>Learn about this common physical security threat and how to prevent it</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3 text-red-700">What is Tailgating?</h4>
                  <p className="text-sm mb-3">
                    Tailgating (or "piggybacking") is when an unauthorized person follows an authorized person into a
                    restricted area without proper authentication.
                  </p>
                  <h4 className="font-semibold mb-2 text-red-700">Common Tactics:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Carrying items to appear busy/legitimate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Wearing uniforms or business attire</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Creating urgency or time pressure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Claiming to be new employees or contractors</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">Prevention Strategies:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Always require proper authentication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Don't hold doors open for strangers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Verify identity through official channels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Report suspicious behavior to security</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Follow company security policies</span>
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
      ) : (
        /* Active Scenario */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {currentScenario.title}
              </CardTitle>
              <CardDescription>{currentScenario.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <img
                    src={currentScenario.image || "/placeholder.svg"}
                    alt={currentScenario.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Situation:</h4>
                  <p className="text-sm mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    {currentScenario.situation}
                  </p>
                  <h4 className="font-semibold mb-3">How do you respond?</h4>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Choose Your Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentScenario.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectOption(index)}
                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedOption === index
                        ? showResult
                          ? option.correct
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                          : "border-blue-500 bg-blue-50"
                        : showResult && option.correct
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                    } ${showResult ? "cursor-default" : "cursor-pointer hover:bg-gray-50"}`}
                  >
                    <div className="flex items-start gap-3">
                      {showResult && (
                        <div className="mt-1">
                          {option.correct ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : selectedOption === index ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : null}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{option.text}</div>
                        {showResult && (
                          <div
                            className={`text-sm mt-2 ${option.correct ? "text-green-700" : selectedOption === index ? "text-red-700" : "text-gray-600"}`}
                          >
                            {option.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                {!showResult ? (
                  <Button onClick={submitAnswer} disabled={selectedOption === null} className="flex-1">
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={resetScenario} className="flex-1">
                    Try Another Scenario
                  </Button>
                )}
                <Button onClick={resetScenario} variant="outline">
                  Back to Scenarios
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
