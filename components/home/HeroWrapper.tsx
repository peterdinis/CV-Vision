import { FC } from "react";
import { Brain } from "lucide-react";

const HeroWrapper: FC = () => {
    return (
        <section className="container mx-auto px-6 py-8 mt-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Analyze Your Resume with AI
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Upload your resume and get instant feedback with detailed analysis, improvement suggestions, and professional tips.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Upload Resume</h2>
                            <p className="text-muted-foreground">
                                Supports PDF and image files. Get detailed analysis instantly.
                            </p>
                        </div>

                        TODO FILE UPLOAD
                    </div>

                    {/* Placeholder Section */}
                    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-8 text-center border-2 border-dashed border-muted-foreground/20 animate-scale-in">
                            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
                            <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                            <p className="text-muted-foreground mb-4">
                                Upload your resume to get started with AI-powered analysis
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 text-sm">
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">Pros & Cons</span>
                                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full">Expert Tips</span>
                                <span className="px-3 py-1 bg-success/10 text-success rounded-full">Score Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroWrapper