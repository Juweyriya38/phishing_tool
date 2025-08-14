"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { PhishingEmail } from "@/components/modules/phishing-email"
import { MaliciousUrl } from "@/components/modules/malicious-url"
import { BaitingFile } from "@/components/modules/baiting-file"
import { Pretexting } from "@/components/modules/pretexting"
import { Tailgating } from "@/components/modules/tailgating"
import { Vishing } from "@/components/modules/vishing"
import { QuidProQuo } from "@/components/modules/quid-pro-quo"
import { useIsMobile } from "@/hooks/use-mobile"

export default function HomePage() {
  const [activeModule, setActiveModule] = useState("phishing-email")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()

  const renderModule = () => {
    switch (activeModule) {
      case "phishing-email":
        return <PhishingEmail />
      case "malicious-url":
        return <MaliciousUrl />
      case "baiting-file":
        return <BaitingFile />
      case "pretexting":
        return <Pretexting />
      case "tailgating":
        return <Tailgating />
      case "vishing":
        return <Vishing />
      case "quid-pro-quo":
        return <QuidProQuo />
      default:
        return <PhishingEmail />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule}
        isOpen={isMobile ? sidebarOpen : true}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="flex-1 overflow-auto">
        {isMobile && (
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        )}
        <div className="p-8">{renderModule()}</div>
      </main>
    </div>
  )
}
