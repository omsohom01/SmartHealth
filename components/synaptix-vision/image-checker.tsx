"use client"

import React from "react"
import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud, X, ArrowRight, Eye, Scan, CheckCircle, AlertTriangle, Brain, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnalysisResponse, MedicalAnalysisResult } from "@/lib/types/medical-analysis"
import { MEDICAL_MODELS, detectModelFromFilename } from "@/lib/utils/medical-models"
import { analyzeImage, validateImageFile, ApiError } from "@/lib/utils/api"
import { saveVisionAnalysis } from "@/lib/dashboard-utils"

export function ImageChecker() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [analysisStage, setAnalysisStage] = useState<string>("")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImageFile = useCallback((file: File) => {
    setUploadError(null)

    // Validate the file
    const validationError = validateImageFile(file)
    if (validationError) {
      setUploadError(validationError)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
      setUploadedFile(file)
      setAnalysisResult(null)
      setScanProgress(0)

      // Auto-detect model based on filename
      const detectedModel = detectModelFromFilename(file.name)
      console.log(`Auto-detected model: ${detectedModel}`)
    }
    reader.onerror = () => {
      setUploadError("Failed to read the image file")
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }, [processImageFile])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }, [processImageFile])

  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null)
    setUploadedFile(null)
    setAnalysisResult(null)
    setScanProgress(0)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    setAnalysisResult(null)
    setScanProgress(0)
    setAnalysisStage("")

    // Simulate realistic progress with multiple stages
    const progressStages = [
      { message: "Preparing image...", progress: 20 },
      { message: "Connecting to AI model...", progress: 40 },
      { message: "Analyzing medical image...", progress: 70 },
      { message: "Processing results...", progress: 90 },
    ]

    let currentStage = 0
    const progressInterval = setInterval(() => {
      if (currentStage < progressStages.length) {
        const stage = progressStages[currentStage]
        setScanProgress(stage.progress)
        setAnalysisStage(stage.message)
        currentStage++
      } else {
        clearInterval(progressInterval)
      }
    }, 800)

    try {
      const result = await analyzeImage(uploadedFile, "auto")

      clearInterval(progressInterval)
      setScanProgress(100)
      setAnalysisStage("Complete!")

      // Small delay for better UX
      setTimeout(async () => {
        setAnalysisResult(result)
        setIsAnalyzing(false)
        setScanProgress(0)
        setAnalysisStage("")

        // Persist a concise record for the dashboard
        try {
          if (result?.success && result?.results && result.results.length > 0) {
            const top = [...result.results].sort((a,b) => b.score - a.score)[0]
            const analysis = `${top.label} (${Math.round(top.score * 100)}%)`
            const recommendation = result.suggestions || result.explanation || 'Consider consulting a medical professional for confirmation.'
            await saveVisionAnalysis({
              imageUrl: uploadedImage || undefined,
              analysis,
              confidence: Math.round(top.score * 100),
              recommendation,
              category: result.detectedType || result.modelUsed || 'General'
            })
          } else {
            // Save a generic failure record if needed
            if (result && !result.success) {
              await saveVisionAnalysis({
                imageUrl: uploadedImage || undefined,
                analysis: 'Analysis failed',
                confidence: 0,
                recommendation: result.error || 'Try another image or check your connection.',
                category: 'Error'
              })
            }
          }
        } catch (persistErr) {
          console.error('Failed to persist vision analysis:', persistErr)
        }
      }, 500)
    } catch (error) {
      clearInterval(progressInterval)

      let errorMessage = "An unexpected error occurred"
      if (error instanceof ApiError) {
        errorMessage = error.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      setAnalysisResult({
        success: false,
        error: errorMessage,
      })
      setIsAnalyzing(false)
      setScanProgress(0)
      setAnalysisStage("")
    }
  }, [uploadedFile])

  const getResultIcon = (result: MedicalAnalysisResult) => {
    const confidence = result.score * 100
    if (confidence >= 80) return AlertTriangle
    if (confidence >= 60) return Eye
    return CheckCircle
  }

  const getResultColor = (result: MedicalAnalysisResult) => {
    const confidence = result.score * 100
    if (confidence >= 80) return "text-red-400"
    if (confidence >= 60) return "text-yellow-400"
    return "text-green-400"
  }

  const getResultSeverity = (result: MedicalAnalysisResult) => {
    const confidence = result.score * 100
    if (confidence >= 80) return "High Confidence"
    if (confidence >= 60) return "Moderate Confidence"
    return "Low Confidence"
  }

  return (
    <section className="container mx-auto max-w-4xl space-y-8 py-8 animate-fade-in relative">
      {/* Stylish background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-xl animate-pulse opacity-60" />
        <div className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-full blur-lg animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-md animate-pulse opacity-50" style={{ animationDelay: '2s' }} />
        
        {/* Gradient lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-600/20 to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-600/20 to-transparent" />
        
        {/* Decorative corner elements */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-gray-600/20 opacity-30" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-gray-600/20 opacity-30" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-gray-600/20 opacity-30" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-gray-600/20 opacity-30" />
      </div>

      {/* Header */}
      <div className="text-center space-y-4 relative z-10">
        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight relative">
          Synaptix <span className="text-gray-300">Vision</span>
          {/* Accent line under title */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
        </h1>
        <p className="text-lg lg:text-xl text-gray-400 font-light max-w-2xl mx-auto">
          AI-powered medical image analysis using advanced machine learning models
        </p>
      </div>

      {/* File Upload Area */}
      {!uploadedImage && (
        <Card
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            console.log("Upload area clicked")
            fileInputRef.current?.click()
          }}
          className={cn(
            "relative flex flex-col items-center justify-center p-8 lg:p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-700 min-h-[320px] group overflow-hidden",
            "bg-gray-900/20 backdrop-blur-sm hover:backdrop-blur-md",
            isDragging
              ? "border-gray-500/70 bg-gray-800/30 scale-[1.02] shadow-2xl animate-pulse"
              : "border-gray-700/40 hover:border-gray-600/60 hover:bg-gray-900/30 hover:shadow-xl hover:shadow-gray-900/20",
          )}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600/5 via-transparent to-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-500/20 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ animationDelay: '0s' }} />
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-gray-400/30 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-gray-500/25 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative mb-6 group-hover:scale-110 transition-transform duration-700">
            <UploadCloud
              className={cn(
                "w-16 h-16 lg:w-20 lg:h-20 transition-all duration-700",
                isDragging
                  ? "text-gray-300 scale-110 animate-pulse"
                  : "text-gray-500 group-hover:text-gray-300",
              )}
            />
            <div className="absolute inset-0 bg-gray-400/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full border-2 border-gray-500/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-1000" />
          </div>

          <div className="text-center space-y-3 group-hover:translate-y-[-2px] transition-transform duration-500">
            <p className={cn(
              "text-xl lg:text-2xl font-medium transition-all duration-500",
              isDragging
                ? "text-white scale-105"
                : "text-gray-300 group-hover:text-white"
            )}>
              {isDragging ? "Drop your medical image here" : "Upload Medical Image"}
            </p>
            <p className="text-sm lg:text-base text-gray-500 group-hover:text-gray-400 transition-colors duration-500 leading-relaxed">
              X-rays, CT scans, skin images, wounds • PNG, JPG, JPEG • Max 10MB
            </p>
            {uploadError && (
              <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-xl animate-shake">
                <p className="text-red-400 text-sm font-medium">{uploadError}</p>
              </div>
            )}
          </div>

          {/* Enhanced border animation */}
          <div className="absolute inset-0 rounded-2xl border border-gray-600/20 opacity-0 group-hover:opacity-100 transition-all duration-700" />
          <div className="absolute inset-0 rounded-2xl border border-gray-500/10 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
        </Card>
      )}

      {/* Upload Error Display */}
      {uploadError && (
        <Card className="bg-red-900/20 border-red-700/40 rounded-2xl p-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-red-300 font-semibold">Upload Error</h3>
              <p className="text-red-400 text-sm">{uploadError}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Image Preview and Analysis Section */}
      {uploadedImage && (
        <div className="space-y-6">
          <Card className="relative bg-gray-900/30 backdrop-blur-sm border-gray-700/40 rounded-2xl p-6 lg:p-8 shadow-2xl animate-fade-in hover:bg-gray-900/40 hover:border-gray-600/50 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center group-hover:text-gray-100 transition-colors duration-300">
                <Eye className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300" />
                Image Analysis
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveImage}
                className="bg-gray-800/50 hover:bg-gray-700/70 text-gray-400 hover:text-white rounded-xl w-10 h-10 transition-all duration-300 backdrop-blur-sm border border-gray-700/30 hover:border-gray-600/50"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Auto-Detection Info */}
            <div className="mb-6 relative z-10 transform group-hover:translate-y-[-1px] transition-transform duration-300">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm hover:bg-gray-800/40 hover:border-gray-600/60 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-green-400/40 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                    AI Auto-Detection Enabled
                  </span>
                  <div className="ml-auto">
                    <div className="text-xs text-green-400 font-medium px-2 py-1 bg-green-400/10 rounded-full border border-green-400/20">
                      ACTIVE
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                  The system will automatically detect the image type and select the appropriate medical AI model for analysis.
                </p>
              </div>
            </div>

            {/* Image container */}
            <div className="relative w-full h-64 lg:h-80 rounded-xl overflow-hidden border border-gray-700/40 bg-gray-800/20 group-hover:border-gray-600/50 transition-all duration-500 mb-6 group-hover:shadow-lg">
              <Image
                src={uploadedImage || "/placeholder.svg"}
                alt="Medical image for analysis"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Enhanced gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-gray-900/10" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Corner accent indicators */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-gray-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-gray-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-gray-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-gray-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>

            {/* Analyze button */}
            <div className="flex justify-center relative z-10">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={cn(
                  "group relative overflow-hidden bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-medium tracking-wider transition-all duration-500 shadow-xl hover:shadow-2xl border border-gray-600/30 hover:border-gray-500/50",
                  isAnalyzing
                    ? "px-6 lg:px-8 py-6 lg:py-8 min-w-[280px] min-h-[80px]"
                    : "px-8 lg:px-12 py-4 lg:py-5 min-w-[200px] hover:scale-105"
                )}
              >
                <span className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center space-y-2 animate-pulse">
                      <div className="flex items-center justify-center">
                        <Scan className="w-6 h-6 mr-3 animate-spin text-gray-300" />
                        <span className="text-xl font-bold text-white">
                          {Math.round(scanProgress)}%
                        </span>
                      </div>
                      {analysisStage && (
                        <div className="text-sm text-gray-300 text-center leading-tight">
                          {analysisStage}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-base lg:text-lg">
                      <Brain className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                      Analyze with AI
                      <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </span>

                {/* Animated background layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Enhanced progress bar */}
                {isAnalyzing && (
                  <>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700/50 rounded-b-xl" />
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gray-400 to-gray-300 rounded-b-xl transition-all duration-500 ease-out"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </>
                )}

                {/* Scanning animation overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse opacity-50" />
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <Card className="relative bg-gray-900/30 backdrop-blur-sm border-gray-700/40 rounded-2xl p-6 lg:p-8 shadow-2xl animate-fade-in hover:bg-gray-900/40 hover:border-gray-600/50 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

          <div className="space-y-6 relative z-10">
            {analysisResult.success && analysisResult.results ? (
              <>
                {/* Auto-Detection Info */}
                {analysisResult.detectedType && (
                  <div className="p-4 lg:p-6 bg-gray-800/30 border border-gray-600/30 rounded-xl hover:bg-gray-800/40 hover:border-gray-600/50 transition-all duration-300 transform hover:translate-y-[-1px]">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-blue-400/40 rounded-full animate-ping"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base lg:text-lg font-semibold text-gray-200 mb-3">Auto-Detection Results</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                          <div className="space-y-1">
                            <span className="text-xs text-gray-400 block">Image Type</span>
                            <span className="inline-block text-blue-400 font-medium text-sm px-3 py-1.5 bg-blue-400/10 rounded-full border border-blue-400/20">
                              {analysisResult.detectedType}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-gray-400 block">Confidence Level</span>
                            <span className="text-blue-400 font-semibold text-lg">
                              {analysisResult.detectionConfidence}%
                            </span>
                          </div>
                        </div>
                        {analysisResult.detectionReasoning && (
                          <div className="mt-4 p-3 bg-gray-700/20 rounded-lg border border-gray-600/20">
                            <p className="text-xs lg:text-sm text-gray-400 leading-relaxed">
                              <span className="font-medium text-gray-300">Detection Logic:</span> {analysisResult.detectionReasoning}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Explanation */}
                {analysisResult.explanation && (
                  <div className="p-4 lg:p-6 bg-gray-800/30 border border-gray-600/30 rounded-xl hover:bg-gray-800/40 hover:border-gray-600/50 transition-all duration-300 relative overflow-hidden">
                    {/* Stylish accent border */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-blue-500/50" />
                    
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="break-words">AI Analysis Explanation</span>
                    </h4>
                    <div className="">
                      <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
                        {analysisResult.explanation.replace(/\*\*/g, '').replace(/\*/g, '')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Results */}
                <div className="space-y-3 lg:space-y-4 relative">
                  {/* Stylish section divider */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-600/30"></div>
                    <div className="px-4 text-sm text-gray-400 font-medium">Analysis Results</div>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-600/30"></div>
                  </div>
                  
                  {analysisResult.results.map((result, index) => {
                    const IconComponent = getResultIcon(result)
                    const confidence = (result.score * 100).toFixed(1)

                    return (
                      <div
                        key={index}
                        className="p-4 lg:p-5 bg-gray-800/20 rounded-xl border border-gray-700/30 hover:bg-gray-800/30 hover:border-gray-600/40 transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-lg group/result relative overflow-hidden"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                      >
                        {/* Stylish side accent */}
                        <div className={cn(
                          "absolute left-0 top-0 w-1 h-full transition-all duration-300",
                          result.score >= 0.8 ? "bg-red-400/60" : result.score >= 0.6 ? "bg-yellow-400/60" : "bg-green-400/60"
                        )} />
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pl-2">
                          <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                            <div className="relative flex-shrink-0 mt-1 sm:mt-0">
                              <IconComponent className={cn("w-5 h-5 lg:w-6 lg:h-6 transition-all duration-300", getResultColor(result))} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-semibold text-base lg:text-lg group-hover/result:text-gray-100 transition-colors duration-300 break-words">
                                {result.label}
                              </h4>
                              <p className="text-gray-400 text-sm group-hover/result:text-gray-300 transition-colors duration-300 mt-1">
                                {getResultSeverity(result)}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
                            <div className={cn("text-2xl lg:text-3xl font-bold transition-all duration-300 group-hover/result:scale-105", getResultColor(result))}>
                              {confidence}%
                            </div>
                            <div className="w-full sm:w-24 lg:w-28 h-2 lg:h-2.5 bg-gray-700 rounded-full overflow-hidden mt-2 group-hover/result:bg-gray-600 transition-colors duration-300 relative">
                              <div
                                className={cn(
                                  "h-full transition-all duration-1000 ease-out relative",
                                  result.score >= 0.8
                                    ? "bg-red-400"
                                    : result.score >= 0.6
                                      ? "bg-yellow-400"
                                      : "bg-green-400",
                                )}
                                style={{
                                  width: `${result.score * 100}%`,
                                  animationDelay: `${index * 200 + 500}ms`
                                }}
                              >
                                {/* Shimmer effect on progress bar */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-50" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* AI Suggestions */}
                {analysisResult.suggestions && (
                  <div className="p-4 lg:p-6 bg-gray-800/30 border border-gray-600/30 rounded-xl hover:bg-gray-800/40 hover:border-gray-600/50 transition-all duration-300 relative overflow-hidden">
                    {/* Stylish accent border */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500/50 via-emerald-500/50 to-green-500/50" />
                    
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="break-words">Recommendations</span>
                    </h4>
                    <div className="">
                      <div className="text-gray-300 text-sm lg:text-base leading-relaxed">
                        {(() => {
                          // Clean the suggestions text and format it properly
                          let cleanText = analysisResult.suggestions
                            .replace(/\*\*/g, '') // Remove ** 
                            .replace(/\*/g, '') // Remove *
                            .trim()

                          // Split into sentences and format as list if multiple recommendations
                          const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0)

                          if (sentences.length > 1) {
                            return (
                              <ul className="space-y-3">
                                {sentences.map((sentence, index) => (
                                  <li key={index} className="flex items-start relative">
                                    <span className="text-green-400 mr-3 mt-1.5 text-sm flex-shrink-0">•</span>
                                    <span className="break-words">{sentence.trim()}{sentence.trim().match(/[.!?]$/) ? '' : '.'}</span>
                                  </li>
                                ))}
                              </ul>
                            )
                          } else {
                            return <p className="break-words">{cleanText}</p>
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Error state */
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-red-900/30 group-hover:bg-red-900/50 transition-all duration-300">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white">Analysis Failed</h3>
                  <p className="text-red-400 text-sm">{analysisResult.error}</p>
                </div>
              </div>
            )}

            {/* Medical disclaimer */}
            <div className="p-4 lg:p-6 bg-gray-800/30 border border-gray-600/30 rounded-xl">
              <p className="text-gray-300 text-sm lg:text-base leading-relaxed break-words">
                <strong className="text-white">Medical Disclaimer:</strong> {analysisResult.disclaimer ||
                  "This AI analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns."}
              </p>
            </div>
          </div>
        </Card>
      )}
    </section>
  )
}
