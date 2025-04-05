import * as React from "react"
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "../ui/sidebar"
import { Mic, Clock, MapPin, Search } from "lucide-react"

export function Navigation() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">MemoBread</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="录音" asChild>
                <a href="/record">
                  <Mic />
                  <span>录音</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="历史记录" asChild>
                <a href="/history">
                  <Clock />
                  <span>历史记录</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="地点" asChild>
                <a href="/locations">
                  <MapPin />
                  <span>地点</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="记忆检索" asChild>
                <a href="/search">
                  <Search />
                  <span>记忆检索</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">MemoBread v0.1.0</span>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
