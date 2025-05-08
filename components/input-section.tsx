"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Loader2, AlertCircle, Sparkles, File, FileIcon, X } from "lucide-react"
import { processNotes } from "@/lib/actions"
import type { ProcessedNotes } from "@/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCurrentUser, saveUserActivity } from "@/lib/auth"
import { extractTextFromFile, truncateText, isFileTooLarge, formatFileSize } from "@/lib/file-utils"

interface InputSectionProps {
  onProcessComplete: (data: ProcessedNotes) => void
}

export function InputSection({ onProcessComplete }: InputSectionProps) {
  const [notes, setNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const MAX_CHARS = 2000 // Character limit for processing
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string; size: number } | null>(null)
  const [isOverLimit, setIsOverLimit] = useState(false)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [extractionWarning, setExtractionWarning] = useState<string | null>(null)

  useEffect(() => {
    // Check if notes exceed the character limit
    setIsOverLimit(notes.length > MAX_CHARS)
  }, [notes])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setNotes(value)
    // Clear any warnings when user edits text
    setExtractionWarning(null)
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "application/pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword":
        return <FileIcon className="h-4 w-4 text-blue-500" />
      case "text/plain":
        return <File className="h-4 w-4 text-gray-500" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const processFile = async (file: File) => {
    const validTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid .txt, .pdf, .doc, or .docx file.")
      return
    }

    // Check file size
    if (isFileTooLarge(file)) {
      setError("File size exceeds the limit of 5MB. Please upload a smaller file.")
      return
    }

    setIsExtracting(true)
    setError(null)
    setExtractionWarning(null)
    setExtractionProgress(0)

    try {
      // Set up progress simulation for extraction
      const progressInterval = setInterval(() => {
        setExtractionProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + (file.type === "application/pdf" ? 5 : 10) // Slower for PDFs
        })
      }, 300)

      // Extract text from the file
      let extractedText = ""

      try {
        // Try to extract text from the file
        extractedText = await extractTextFromFile(file)
      } catch (extractError) {
        console.error("Error during text extraction:", extractError)

        // Handle PDF extraction errors specifically
        if (file.type === "application/pdf") {
          extractedText =
            "We were unable to extract text from this PDF. It may be scanned, secured, or contain only images. Please try converting it to a Word document or manually paste the text."
          setExtractionWarning(extractedText)
        } else {
          throw extractError // Re-throw for other file types
        }
      }

      // Complete progress
      clearInterval(progressInterval)
      setExtractionProgress(100)

      // Check if the extraction returned a warning message (for PDFs that couldn't be properly extracted)
      if (
        file.type === "application/pdf" &&
        (extractedText.includes("We were unable to extract text from this PDF") ||
          extractedText.includes("may be scanned") ||
          extractedText.includes("security restrictions"))
      ) {
        setExtractionWarning(extractedText)
        // Still set the text if there was some content extracted
        if (extractedText.length > 100) {
          setNotes(extractedText)
          setUploadedFile({ name: file.name, type: file.type, size: file.size })
        } else {
          // If almost no content was extracted, don't set it
          setNotes("")
        }
      } else {
        // Set the extracted text
        if (extractedText.length <= MAX_CHARS) {
          setNotes(extractedText)
          setUploadedFile({ name: file.name, type: file.type, size: file.size })
        } else {
          // Truncate text if it exceeds the limit
          const truncatedText = truncateText(extractedText, MAX_CHARS)
          setNotes(truncatedText)
          setUploadedFile({ name: file.name, type: file.type, size: file.size })
          setError(
            `The extracted text was too long and has been truncated to ${MAX_CHARS} characters for optimal processing.`,
          )
        }
      }

      // Focus the textarea for editing
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    } catch (error) {
      console.error("Error extracting text:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Failed to extract text from the file. Please try another file or paste your text directly.",
      )
    } finally {
      setIsExtracting(false)
      setExtractionProgress(0)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      await processFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notes.trim() || isOverLimit) return

    setIsProcessing(true)
    setProgress(0)
    setError(null)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 300)

    try {
      const formData = new FormData()
      formData.append("notes", notes)

      const result = await processNotes(formData)

      // Complete progress
      clearInterval(interval)
      setProgress(100)

      // Pass the processed data up to the parent component
      onProcessComplete(result)

      // Save activity to local storage if user is logged in
      const currentUser = getCurrentUser()
      if (currentUser) {
        // Extract a title from the summary tags or text
        let title = "Study Notes"
        if (result.summary.tags && result.summary.tags.length > 0) {
          title = result.summary.tags[0].name
        } else if (result.summary.text) {
          // Use first few words of summary as title
          const words = result.summary.text.split(" ").slice(0, 5).join(" ")
          title = words + (words.length < result.summary.text.length ? "..." : "")
        }

        // Save summary activity
        saveUserActivity(currentUser.id, "summary", title, result)

        // Save flashcards activity if there are flashcards
        if (result.flashcards && result.flashcards.length > 0) {
          saveUserActivity(currentUser.id, "flashcards", title + " Flashcards", result.flashcards)
        }

        // Save Q&A activity if there are questions
        if (result.questions && result.questions.length > 0) {
          saveUserActivity(currentUser.id, "qa", title + " Practice Questions", result.questions)
        }
      }

      // Reset after a short delay
      setTimeout(() => {
        setIsProcessing(false)
        setProgress(0)
      }, 500)
    } catch (error) {
      console.error("Error processing notes:", error)
      clearInterval(interval)
      setIsProcessing(false)
      setProgress(0)

      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          setError("API key is not configured properly. Please check your environment variables.")
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          setError("Network error. Please check your internet connection and try again.")
        } else if (error.message.includes("timeout") || error.message.includes("timed out")) {
          setError("The request took too long to process. Please try with shorter notes or try again later.")
        } else {
          setError(error.message)
        }
      } else {
        setError("Failed to process notes. Please try again with shorter content.")
      }
    }
  }

  const handleClearFile = () => {
    setUploadedFile(null)
    setExtractionWarning(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Sparkles className="h-5 w-5 text-study-accent mr-2" />
          Input Your Study Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {uploadedFile && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  {getFileIcon(uploadedFile.type)}
                  <div className="ml-2">
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFile}
                  disabled={isProcessing || isExtracting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Drag and drop area */}
            <div
              className={`relative ${dragActive ? "border-study-purple bg-study-purple/5" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Textarea
                ref={textareaRef}
                placeholder="Paste your study notes here or drag & drop a file. Our AI will transform them into summaries, flashcards, and practice questions!"
                className={`min-h-[200px] resize-y ${isOverLimit ? "border-red-500 focus:ring-red-500" : ""}`}
                value={notes}
                onChange={handleTextChange}
                disabled={isProcessing || isExtracting}
              />

              {dragActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-study-purple/10 border-2 border-dashed border-study-purple rounded-md">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-study-purple" />
                    <p className="font-medium text-study-purple">Drop your file here</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <span className={isOverLimit ? "text-red-500 font-medium" : ""}>
                {notes.length} / {MAX_CHARS} characters
                {isOverLimit && <span className="ml-2">(Reduce text to continue)</span>}
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  disabled={isProcessing || isExtracting}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing || isExtracting}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </div>

            {isExtracting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Extracting text from file...</span>
                  <span>{extractionProgress}%</span>
                </div>
                <Progress value={extractionProgress} className="h-2" />
              </div>
            )}

            {extractionWarning && (
              <Alert className="border border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-800 dark:text-yellow-200" />
                <AlertTitle className="text-yellow-800 dark:text-yellow-200">PDF Extraction Warning</AlertTitle>
                <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                  {extractionWarning}
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>Tips:</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Try converting your PDF to a Word document</li>
                      <li>Copy and paste the text directly into the text area</li>
                      <li>Make sure your PDF contains selectable text, not just images</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert
                variant={error.includes("truncated") ? "default" : "destructive"}
                className="text-foreground dark:text-white"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-foreground dark:text-white">
                  {error.includes("truncated") ? "Notice" : "Error"}
                </AlertTitle>
                <AlertDescription className="text-foreground dark:text-white">{error}</AlertDescription>
              </Alert>
            )}

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing your notes...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-study-accent hover:bg-study-accent2 text-black font-medium"
              disabled={!notes.trim() || isProcessing || isExtracting || isOverLimit}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Summarize My Notes!
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
