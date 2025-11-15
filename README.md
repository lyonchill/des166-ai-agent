# DES166 AI Assistant

An AI-powered FAQ system for UW DES166 course, helping students get instant answers to their questions about applications, portfolios, majors, and course requirements.

## 🚀 Features

- **💬 Chat Interface**: Interactive AI assistant powered by Google Gemini
- **🔍 Browse by Category**: Organized QA sections for easy navigation
- **🎯 Smart Search**: Keyword-based relevance matching (upgradeable to vector search)
- **📱 Responsive Design**: Works on desktop and mobile
- **🌙 Dark Mode Support**: Automatic theme switching
- **🔗 Source Links**: Direct links to official resources

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API key
- (Optional) Supabase account for vector search

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Optional (for future vector search implementation):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
des166-ai-agent/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Chat API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ChatInterface.tsx         # Chat UI component
│   └── CategoryBrowser.tsx       # Browse by category UI
├── data/
│   └── qa-data.ts                # QA knowledge base
├── lib/
│   └── rag.ts                    # RAG logic (keyword search)
├── .env.example                  # Environment variables template
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🎨 Customization

### Adding New QA Data

Edit `data/qa-data.ts`:

```typescript
export const qaData: QAItem[] = [
  {
    id: 1,
    category: "application",
    question: "Your question here",
    answer: "Your answer here",
    links: ["https://example.com"],
    keywords: ["keyword1", "keyword2"],
  },
  // Add more...
];
```

### Adding New Categories

Edit the `categories` array in `data/qa-data.ts`:

```typescript
export const categories: Category[] = [
  {
    id: "new-category",
    name: "New Category",
    icon: "🎯",
    description: "Category description",
  },
  // Add more...
];
```

### Styling

- Edit `app/globals.css` for global styles
- Modify Tailwind classes in components
- Update `tailwind.config.ts` for custom theme colors

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

### Alternative Deployment

You can also deploy to:
- Railway
- Fly.io
- Netlify
- Any Node.js hosting platform

## 🔄 Future Upgrades

### 1. Vector Search Implementation

Replace keyword matching with semantic search:

**Steps:**
1. Set up Supabase with pgvector extension
2. Generate embeddings for all QAs using Gemini or other embedding models
3. Store embeddings in Supabase
4. Implement vector similarity search in `lib/rag.ts`

**Benefits:**
- Better understanding of user intent
- More accurate results
- Handles synonyms and paraphrasing

### 2. Analytics Dashboard

Track:
- Most asked questions
- Search success rate
- User satisfaction
- Common topics

### 3. Admin Panel

Features:
- Add/edit/delete QAs
- Bulk import from CSV
- Usage statistics
- API key management

### 4. Enhanced Features

- Multi-turn conversations with context
- Question suggestions as user types
- Export conversation history
- Email integration for unanswered questions

## 💰 Cost Estimation

**Current Setup (Monthly):**
- Gemini API: Free tier available, then pay-as-you-go
- Vercel Hosting: Free
- **Total: ~$0-10/month (depending on usage)**

**With Vector Search:**
- Add Supabase: Free tier available
- Embeddings: ~$1-2/month
- **Total: ~$1-12/month**

## 🐛 Troubleshooting

### API Key Issues

```bash
Error: Gemini API key not found
```
**Solution:** Check that `.env.local` has `GEMINI_API_KEY` set correctly.

### Build Errors

```bash
npm run build
```
Check console for specific errors. Common issues:
- Missing dependencies: run `npm install`
- TypeScript errors: fix type issues in code

### Styling Issues

If Tailwind styles aren't working:
1. Check `tailwind.config.ts` paths
2. Ensure `globals.css` imports Tailwind
3. Restart dev server

## 📝 License

MIT License - feel free to use this for educational purposes!

## 🤝 Contributing

This is a TA project, but suggestions are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For questions about the project:
- Check the code comments
- Review this README
- Consult your academic advisor for course-specific questions

---

Built with ❤️ for UW DES166 students
