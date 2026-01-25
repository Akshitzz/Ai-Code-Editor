# Daksha IDE: An AI-Powered Code Editor

Daksha IDE is a cutting-edge, AI-powered code editor built from the ground up to provide a modern IDE experience in the browser. It combines advanced AI capabilities with a full SaaS business layer, enabling real-time collaboration, in-browser code execution, and intelligent agentic workflows.

## 🌟 Features

* 🤖 **AI Code Suggestions & Quick Edit**: Real-time, context-aware code suggestions (ghost text) and refactoring capabilities powered by external documentation.
* 🧠 **AI Agent with File Manipulation**: An intelligent chat sidebar agent that can create, modify, and manage project files autonomously.
* 📚 **Live Docs Scraping**: Uses **Firecrawl** to instantly ingest external documentation, GitHub READMEs, or API references, giving the AI context beyond its training data.
* ✏️ **CodeMirror 6 Editor**: A professional-grade editor featuring full syntax highlighting, code folding, and a functional minimap.
* ▶️ **In-Browser Execution**: Powered by **WebContainers**, allowing you to run a full Node.js environment, live previews, and dev servers directly in the browser.
* 🐙 **GitHub Integration**: Securely import private or public repositories and export projects directly to new GitHub repos.
* ⚡ **Background Workflows**: Uses **Inngest** to handle complex, long-running processes like AI agent tasks and large imports without blocking the UI.
* 🗄️ **Real-time Sync**: **Convex** serves as the real-time database engine, ensuring instant data reactivity across all components.
* 🔐 **Auth & Billing**: Secure user authentication via **BetterAuth** For User signup-signin and validation  .
* 🐛 **Observability**: **Sentry** integration for error tracking and session replays, plus LLM monitoring for token usage and cost tracking.
* 🐰 **AI Code Reviews**: Integrated **CodeRabbit** workflows for automated, AI-powered pull request reviews.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Package Manager**: [Bun](https://bun.sh/)
* **Database & Sync**: [Convex](https://www.convex.dev/)
* **Authentication**: [BetterAuth](https://www.betterauth.dev/)
* **Workflows**: [Inngest](https://www.inngest.com/)
* **Code Editor**: [CodeMirror 6](https://codemirror.net/)
* **Runtime**: [StackBlitz WebContainers](https://webcontainers.io/)
* **Web Scraping**: [Firecrawl](https://www.firecrawl.dev/)
* **Monitoring**: [Sentry](https://sentry.io/)
* **AI PR Reviews**: [CodeRabbit](https://coderabbit.ai/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **UI Components**: [Shadcn UI](https://ui.shadcn.com/)

---

## 🚀 Getting Started

### Prerequisites

* [Bun](https://bun.sh/) installed on your machine
* Git

    git clone [https://github.com/Akshitzz/Ai-Code-Editor.git](https://github.com/Akshitzz/Ai-Code-Editor.git)
    cd Daksha-ide
    ```

2.  **Install dependencies:**
    
    bun install
    
3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and add your API keys:
    ```env
    # Convex deployment
CONVEX_DEPLOYMENT= your deployment id

# Convex URLs
NEXT_PUBLIC_CONVEX_URL= your convex url
NEXT_PUBLIC_CONVEX_SITE_URL= your convex site url

# Better Auth
BETTER_AUTH_SECRET= your better auth secret
BETTER_AUTH_URL= your better auth url

    
4.  **Run the development server:**
bun dev
    
    

