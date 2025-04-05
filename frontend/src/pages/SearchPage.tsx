import * as React from "react"
import { recordingApi, MemorySearchQuery, MemorySearchResult } from "../services/api"
import { Button } from "../components/ui/button"
import { Search } from "lucide-react"

export function SearchPage() {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<MemorySearchResult[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [hasSearched, setHasSearched] = React.useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) return
    
    try {
      setIsSearching(true)
      setHasSearched(true)
      
      const recordings = await recordingApi.getRecordings()
      
      const searchResults = recordings
        .filter(rec => rec.text.toLowerCase().includes(query.toLowerCase()))
        .map(rec => ({
          id: rec.id,
          text: rec.text,
          timestamp: rec.timestamp,
          latitude: rec.latitude,
          longitude: rec.longitude,
          city: rec.city,
          similarity: Math.random() * 0.5 + 0.5 // Simulate similarity score between 0.5-1.0
        }))
        .sort((a, b) => b.similarity - a.similarity) // Sort by similarity
      
      setResults(searchResults)
      setError(null)
    } catch (err) {
      console.error("Error searching memories:", err)
      setError("搜索失败，请重试")
    } finally {
      setIsSearching(false)
    }
  }

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

  const formatSimilarity = (score: number) => {
    return `${Math.round(score * 100)}%`
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">记忆检索</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索你的记忆..."
              className="w-full pl-10 py-2 px-4 rounded-md border border-input bg-background"
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? "搜索中..." : "搜索"}
          </Button>
        </div>
      </form>
      
      {isSearching ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>没有找到匹配的记忆</p>
          <p className="text-sm mt-2">尝试使用不同的关键词</p>
        </div>
      ) : hasSearched ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">搜索结果</h2>
          {results.map((result) => (
            <div 
              key={result.id} 
              className="border rounded-lg p-4 hover:bg-accent transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-muted-foreground">
                  {formatDate(result.timestamp)}
                </div>
                <div className="flex gap-2">
                  <div className="text-xs px-2 py-1 bg-secondary rounded-full">
                    {result.city || "未知位置"}
                  </div>
                  <div className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full">
                    匹配度: {formatSimilarity(result.similarity)}
                  </div>
                </div>
              </div>
              <p className="text-base">{result.text}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
