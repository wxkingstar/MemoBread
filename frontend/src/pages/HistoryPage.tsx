import * as React from "react"
import { recordingApi, RecordingResponse } from "../services/api"

export function HistoryPage() {
  const [recordings, setRecordings] = React.useState<RecordingResponse[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setIsLoading(true)
        const data = await recordingApi.getRecordings()
        setRecordings(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching recordings:", err)
        setError("获取历史记录失败，请重试")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecordings()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">历史记录</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : recordings.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>暂无历史记录</p>
          <p className="text-sm mt-2">使用录音功能记录你的想法</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recordings.map((recording) => (
            <div 
              key={recording.id} 
              className="border rounded-lg p-4 hover:bg-accent transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-muted-foreground">
                  {formatDate(recording.timestamp)}
                </div>
                <div className="text-xs px-2 py-1 bg-secondary rounded-full">
                  {recording.city || "未知位置"}
                </div>
              </div>
              <p className="text-base">{recording.text}</p>
              {(recording.latitude && recording.longitude) && (
                <div className="text-xs text-muted-foreground mt-2">
                  位置: {recording.latitude.toFixed(4)}, {recording.longitude.toFixed(4)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
