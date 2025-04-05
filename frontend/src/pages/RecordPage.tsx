import * as React from "react"
import { Button } from "../components/ui/button"
import { Mic, StopCircle } from "lucide-react"
import { recordingApi, RecordingCreateRequest } from "../services/api"

const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>{children}</div>
)
const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>{children}</div>
)
const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</h3>
)
const CardDescription = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>{children}</p>
)
const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>{children}</div>
)
const CardFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>{children}</div>
)

const Progress = ({ value = 0, className, ...props }: { value?: number } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`} {...props}>
    <div 
      className="h-full bg-primary transition-all" 
      style={{ width: `${value}%` }}
    />
  </div>
)

export function RecordPage() {
  const [isRecording, setIsRecording] = React.useState(false)
  const [recordingTime, setRecordingTime] = React.useState(0)
  const [recordingProgress, setRecordingProgress] = React.useState(0)
  const [audioData, setAudioData] = React.useState<string | null>(null)
  const [location, setLocation] = React.useState<{latitude?: number, longitude?: number, city?: string}>({})
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [recordingResult, setRecordingResult] = React.useState<string | null>(null)
  
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }, [])

  React.useEffect(() => {
    let interval: number
    
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime(prev => prev + 1)
        setRecordingProgress(prev => Math.min(prev + 1, 100))
      }, 1000)
    }
    
    return () => {
      if (interval) window.clearInterval(interval)
    }
  }, [isRecording])
  
  const simulateAudioRecording = () => {
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
  }
  
  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    setRecordingProgress(0)
    setRecordingResult(null)
  }
  
  const handleStopRecording = async () => {
    setIsRecording(false)
    setIsProcessing(true)
    
    try {
      const mockAudioData = simulateAudioRecording()
      setAudioData(mockAudioData)
      
      const recordingData: RecordingCreateRequest = {
        audio_data: mockAudioData,
        timestamp: new Date().toISOString(),
        latitude: location.latitude,
        longitude: location.longitude
      }
      
      const result = await recordingApi.createRecording(recordingData)
      setRecordingResult(result.text)
    } catch (error) {
      console.error("Error creating recording:", error)
      setRecordingResult("录音处理失败，请重试")
    } finally {
      setIsProcessing(false)
    }
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">语音记录</h1>
      
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>记录你的想法</CardTitle>
          <CardDescription>点击麦克风按钮开始录音，系统会自动记录时间和位置</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-6">
          {isRecording ? (
            <>
              <div className="text-2xl font-mono">{formatTime(recordingTime)}</div>
              <Progress value={recordingProgress} className="w-full" />
              <Button 
                size="lg" 
                variant="destructive" 
                className="rounded-full h-16 w-16 p-0"
                onClick={handleStopRecording}
              >
                <StopCircle className="h-8 w-8" />
              </Button>
              <p className="text-sm text-muted-foreground animate-pulse">正在录音...</p>
            </>
          ) : (
            <>
              <Button 
                size="lg" 
                className="rounded-full h-16 w-16 p-0 bg-red-500 hover:bg-red-600"
                onClick={handleStartRecording}
              >
                <Mic className="h-8 w-8" />
              </Button>
              <p className="text-sm text-muted-foreground">点击开始录音</p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {recordingResult && (
            <div className="p-3 bg-muted rounded-md w-full">
              <h4 className="font-medium mb-1">转换结果:</h4>
              <p className="text-sm">{recordingResult}</p>
            </div>
          )}
          <div className="flex justify-between text-xs text-muted-foreground w-full">
            <div>位置: {location.city || (location.latitude ? `${location.latitude.toFixed(4)}, ${location.longitude?.toFixed(4)}` : "正在获取...")}</div>
            <div>时间: {new Date().toLocaleTimeString()}</div>
          </div>
          {isProcessing && (
            <div className="text-center text-xs text-muted-foreground animate-pulse">
              正在处理录音...
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
