import * as React from "react"
import { recordingApi, RecordingResponse } from "../services/api"

export function LocationsPage() {
  const [recordings, setRecordings] = React.useState<RecordingResponse[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [locations, setLocations] = React.useState<{[key: string]: RecordingResponse[]}>({})

  React.useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setIsLoading(true)
        const data = await recordingApi.getRecordings()
        setRecordings(data)
        
        const locationGroups: {[key: string]: RecordingResponse[]} = {}
        data.forEach(recording => {
          const locationKey = recording.city || "未知位置"
          if (!locationGroups[locationKey]) {
            locationGroups[locationKey] = []
          }
          locationGroups[locationKey].push(recording)
        })
        
        setLocations(locationGroups)
        setError(null)
      } catch (err) {
        console.error("Error fetching recordings:", err)
        setError("获取地点数据失败，请重试")
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
      <h1 className="text-3xl font-bold mb-6">地点</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : Object.keys(locations).length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>暂无地点数据</p>
          <p className="text-sm mt-2">使用录音功能记录你的想法</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(locations).map(([location, items]) => (
            <div key={location} className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4 font-medium flex justify-between items-center">
                <h3>{location}</h3>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  {items.length} 条记录
                </span>
              </div>
              <div className="divide-y">
                {items.map(recording => (
                  <div key={recording.id} className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="text-sm text-muted-foreground mb-1">
                      {formatDate(recording.timestamp)}
                    </div>
                    <p className="line-clamp-2">{recording.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
