import { FC } from "react";
import {Brain} from "lucide-react"

const Navigation: FC = () => {
    return (
       <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                CV-Vision
              </h1>
              <p className="text-xs text-muted-foreground">Resume Analysis Tool</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4" />
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
    )
}

export default Navigation