# 🚀 Quick Setup Guide for Cursor

This guide will help you get the DES166 AI Assistant running in Cursor IDE.

## Step 1: Open in Cursor

1. Extract the ZIP file
2. Open Cursor IDE
3. Go to **File → Open Folder**
4. Select the `des166-ai-agent` folder

## Step 2: Install Dependencies

Open the terminal in Cursor (`` Ctrl+` `` or `` Cmd+` ``):

```bash
npm install
```

This will install all required packages (~2-3 minutes).

## Step 3: Set Up Environment Variables

1. Create a new file called `.env.local` in the root folder
2. Add your Gemini API key:

```env
GEMINI_API_KEY=your-gemini-api-key-here
```

**How to get a Gemini API key:**
1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign up or log in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `.env.local`

**Note:** Gemini API offers a generous free tier. Check the [pricing page](https://ai.google.dev/pricing) for current rates.

## Step 4: Run the Development Server

In the terminal:

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.3s
○ Local:   http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Step 5: Customize the Data

### Add Your QA Data

Edit `data/qa-data.ts`:

1. Find the `qaData` array
2. Add new questions following this format:

```typescript
{
  id: 16, // Increment from last ID
  category: "application", // Choose from: application, portfolio, major, grade, advising, project
  question: "Your question here",
  answer: "Your answer here",
  links: ["https://link1.com", "https://link2.com"], // Optional
  keywords: ["keyword1", "keyword2"], // Optional, helps with search
},
```

### Extract More Data from PDF

The PDF you uploaded has ~3000 lines of QA content. You can:

**Option 1: Manual Entry**
- Copy questions from the PDF
- Format them in `qa-data.ts`
- Takes time but gives you control

**Option 2: Use AI to Help**
- Use Cursor's AI to convert PDF text to the format
- Select PDF text → Ask AI: "Convert this to QAItem format"
- Review and paste into `qa-data.ts`

**Option 3: Batch Processing Script**
- Create a script to parse the PDF
- Auto-generate `qa-data.ts`
- Fastest for large datasets

## 🎯 Testing Your Changes

After adding data:

1. Save the file
2. The dev server will auto-reload
3. Test in browser:
   - Try the chat interface
   - Browse by category
   - Check that links work

## 🎨 Customizing the UI

### Change Colors

Edit `tailwind.config.ts` or use Tailwind classes in components:

```typescript
// In components, change classes like:
className="bg-blue-600" // Change blue-600 to any Tailwind color
```

### Modify Layout

- **Header**: Edit `app/page.tsx` (lines 15-22)
- **Chat Interface**: Edit `components/ChatInterface.tsx`
- **Category Browser**: Edit `components/CategoryBrowser.tsx`

## 📦 Building for Production

When ready to deploy:

```bash
npm run build
```

This creates an optimized production build in `.next/` folder.

## 🐛 Common Issues

### Issue: "Cannot find module '@google/generative-ai'"

**Solution:**
```bash
npm install @google/generative-ai
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill the process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
npm run dev -- -p 3001
```

### Issue: Styles not applying

**Solution:**
1. Check that `app/globals.css` has Tailwind imports
2. Restart dev server: `Ctrl+C` then `npm run dev`

### Issue: API key not working

**Solution:**
1. Check `.env.local` has the correct key format
2. No quotes needed around the key
3. Restart the dev server after adding the key

## 🔧 Cursor-Specific Tips

### Use AI Features

1. **Cmd+K** (or **Ctrl+K**): Generate code
2. **Cmd+L** (or **Ctrl+L**): Ask questions about code
3. Select code → Right-click → "Ask Cursor": Get explanations

### Example Prompts

```
"Add error handling to the chat API"
"Create a loading skeleton for the chat"
"Add pagination to the category browser"
"Convert this QA text to the QAItem format"
```

## 📚 Next Steps

1. **Add More Data**: Fill out `qa-data.ts` with all QAs
2. **Test Thoroughly**: Try various questions
3. **Customize Design**: Make it match your style
4. **Deploy**: Follow README.md deployment section
5. **Gather Feedback**: Share with students, iterate

## 💡 Pro Tips

1. **Keep it Simple**: Start with basic features, add complexity later
2. **Test Often**: Check chat responses regularly
3. **Monitor Costs**: Google AI Studio dashboard shows API usage
4. **Version Control**: Use Git to track changes
5. **Document Changes**: Add comments for future you

## 🆘 Need Help?

1. Check the main `README.md` for detailed docs
2. Review code comments in each file
3. Use Cursor's AI to explain code sections
4. Search error messages online

---

Happy coding! 🎉
