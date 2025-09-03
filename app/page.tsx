"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function CareersPage() {
  const [selectedPosition, setSelectedPosition] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    majorGraduation: "",
    growthMetrics: "",
    previousRole: "",
    resume: null as File | null,
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleApplyNow = (position: string) => {
    setSelectedPosition(position)
    // Scroll to the very top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isFormValid =
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      selectedPosition !== "" &&
      formData.majorGraduation.trim() !== "" &&
      formData.growthMetrics.trim() !== "" &&
      formData.previousRole.trim() !== "" &&
      formData.resume !== null

    // 入力チェックが通らない場合
    if (!isFormValid) {
      setErrorMessage("Please fill in all fields")
      setShowError(true)
      setShowSuccess(false)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    // フォームデータを設定
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      selectedPosition,
      majorGraduation: formData.majorGraduation,
      growthMetrics: formData.growthMetrics,
      previousRole: formData.previousRole,
    }

    // Google Apps Scriptに送信するためにURLSearchParamsでデータを送信形式に変換
    const body = new URLSearchParams(payload as any)

    const GAS_URL =
      "https://script.google.com/macros/s/AKfycbwFGTvG3WbHXNG-zT41t4-edNX9Vvlf3rOOfVbrc9-m9AJU6wdLzYg9BheFXzfhmKUKXQ/exec"

    try {
      // フォームデータをGoogle Apps Scriptに送信
      const res = await fetch(GAS_URL, {
        method: "POST",
        body,
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      // レスポンスをJSONとして取得
      const json = await res.json()
      console.log(json) // レスポンスの確認

      // レスポンスが成功した場合
      const ok = !!json?.ok

      if (ok) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          majorGraduation: "",
          growthMetrics: "",
          previousRole: "",
          resume: null,
        })
        setSelectedPosition("")

        // ポップアップを表示（成功）
        setShowSuccess(true)
        setShowError(false)
        setTimeout(() => setShowSuccess(false), 3000) // 3秒後にポップアップを消す
      } else {
        setErrorMessage("Transform is failure")
        setShowError(true)
        setShowSuccess(false)
        setTimeout(() => setShowError(false), 3000)
      }
    } catch (error) {
      console.error("Error submitting the form:", error)
      setErrorMessage("Transform is failure")
      setShowError(true)
      setShowSuccess(false)
      setTimeout(() => setShowError(false), 3000)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, resume: file }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Application Form Section */}
      <section id="apply-today" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-6">Apply Today</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Ready to join our mission? Submit your application and we'll be in touch soon.
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              {showSuccess && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-4">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <h3 className="text-xl font-semibold text-gray-900">Success Submit</h3>
                    </div>
                    <p className="text-gray-600 mb-6">Your application has been submitted successfully!</p>
                    <Button onClick={() => setShowSuccess(false)} className="w-full">
                      Close
                    </Button>
                  </div>
                </div>
              )}

              {showError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">{errorMessage}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter your first name"
                      className="placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter your last name"
                      className="placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                    className="placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position of Interest</Label>
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a position" className="placeholder:text-muted-foreground/60" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Senior Backend Engineer">Senior Backend Engineer</SelectItem>
                      <SelectItem value="Senior Frontend Engineer">Senior Frontend Engineer</SelectItem>
                      <SelectItem value="Junior Backend Engineer">Junior Backend Engineer</SelectItem>
                      <SelectItem value="Junior Frontend Engineer">Junior Frontend Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="majorGraduation">Major & Graduation</Label>
                  <Input
                    id="majorGraduation"
                    value={formData.majorGraduation}
                    onChange={(e) => handleInputChange("majorGraduation", e.target.value)}
                    placeholder="e.g., Computer Science, 2022"
                    className="placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="growthMetrics">Growth Metrics of Previous Job</Label>
                  <Input
                    id="growthMetrics"
                    value={formData.growthMetrics}
                    onChange={(e) => handleInputChange("growthMetrics", e.target.value)}
                    placeholder="e.g., Increased user engagement by 40%"
                    className="placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previousRole">Role at Previous or Current Company</Label>
                  <Input
                    id="previousRole"
                    value={formData.previousRole}
                    onChange={(e) => handleInputChange("previousRole", e.target.value)}
                    placeholder="e.g., Senior Software Engineer at Google"
                    className="placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Resume (PDF only)</Label>
                  <div className="relative">
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Current Openings</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">Senior Backend Engineer</CardTitle>
                  <Badge variant="secondary">Full-time</Badge>
                </div>
                <CardDescription>Build scalable backend systems for air cargo operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Remote • Engineering</span>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleApplyNow("Senior Backend Engineer")}
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">Senior Frontend Engineer</CardTitle>
                  <Badge variant="secondary">Full-time</Badge>
                </div>
                <CardDescription>Create intuitive user interfaces for complex workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Remote • Engineering</span>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleApplyNow("Senior Frontend Engineer")}
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">Junior Backend Engineer</CardTitle>
                  <Badge variant="secondary">Full-time</Badge>
                </div>
                <CardDescription>Learn and grow while building robust backend solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Remote • Engineering</span>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleApplyNow("Junior Backend Engineer")}
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">Junior Frontend Engineer</CardTitle>
                  <Badge variant="secondary">Full-time</Badge>
                </div>
                <CardDescription>Develop your skills in modern frontend technologies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Remote • Engineering</span>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleApplyNow("Junior Frontend Engineer")}
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Employee Stories Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Employee Stories</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto text-pretty">
              Hear directly from our team about why they love working at Belli AI.
            </p>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              <Card className="w-80 flex-shrink-0 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src="/professional-headshot-of-sarah-chen--software-engi.jpg"
                      alt="Sarah Chen"
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                    <blockquote className="text-muted-foreground mb-4 italic text-pretty">
                      "Belli's flexible work culture has made a huge difference in my life. I feel empowered to do my
                      best work every day!"
                    </blockquote>
                    <div>
                      <h3 className="font-semibold text-foreground">Sarah Chen</h3>
                      <p className="text-sm text-muted-foreground">Senior Software Engineer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-80 flex-shrink-0 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src="/professional-headshot-of-marcus-rodriguez--product.jpg"
                      alt="Marcus Rodriguez"
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                    <blockquote className="text-muted-foreground mb-4 italic text-pretty">
                      "Working at Belli means being at the forefront of innovation. Every day brings new challenges and
                      opportunities to grow."
                    </blockquote>
                    <div>
                      <h3 className="font-semibold text-foreground">Marcus Rodriguez</h3>
                      <p className="text-sm text-muted-foreground">Product Manager</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-80 flex-shrink-0 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src="/professional-headshot-of-priya-patel--data-scienti.jpg"
                      alt="Priya Patel"
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                    <blockquote className="text-muted-foreground mb-4 italic text-pretty">
                      "The collaborative environment here is incredible. My ideas are heard and I'm constantly learning
                      from brilliant colleagues."
                    </blockquote>
                    <div>
                      <h3 className="font-semibold text-foreground">Priya Patel</h3>
                      <p className="text-sm text-muted-foreground">Data Scientist</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-80 flex-shrink-0 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src="/professional-headshot-of-alex-thompson--ux-designe.jpg"
                      alt="Alex Thompson"
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                    <blockquote className="text-muted-foreground mb-4 italic text-pretty">
                      "Belli gives me the freedom to create meaningful user experiences while working with cutting-edge
                      technology."
                    </blockquote>
                    <div>
                      <h3 className="font-semibold text-foreground">Alex Thompson</h3>
                      <p className="text-sm text-muted-foreground">UX Designer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-80 flex-shrink-0 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src="/professional-headshot-of-david-kim--devops-enginee.jpg"
                      alt="David Kim"
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                    <blockquote className="text-muted-foreground mb-4 italic text-pretty">
                      "The technical challenges at Belli push me to grow every day. Plus, the remote-first culture is
                      fantastic!"
                    </blockquote>
                    <div>
                      <h3 className="font-semibold text-foreground">David Kim</h3>
                      <p className="text-sm text-muted-foreground">DevOps Engineer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-sidebar py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Plane className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">Belli AI</span>
            </div>
            <p className="text-muted-foreground text-pretty">
              Belli AI is an equal opportunity employer. We celebrate diversity and are committed to creating an
              inclusive environment for all employees.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
