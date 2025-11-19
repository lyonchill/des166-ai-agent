#!/usr/bin/env python3
"""
Script to extract questions from PDF and compare with existing database
"""

import re
import json
from pathlib import Path

try:
    from pypdf import PdfReader
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False
    print("Warning: pypdf not available. Trying alternative methods...")

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file"""
    if not PDF_AVAILABLE:
        return None
    
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None

def extract_questions_from_text(text):
    """Extract questions from text"""
    if not text:
        return []
    
    # Pattern to find questions (lines ending with ?)
    # Also look for Q: or Question: patterns
    questions = []
    
    # Split by lines
    lines = text.split('\n')
    current_question = None
    current_answer = None
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        
        # Check if line is a question
        if line.endswith('?') or line.startswith('Q:') or line.startswith('Question:'):
            # Save previous Q&A if exists
            if current_question and current_answer:
                questions.append({
                    'question': current_question,
                    'answer': current_answer.strip()
                })
            
            # Extract question
            if line.startswith('Q:') or line.startswith('Question:'):
                current_question = re.sub(r'^(Q:|Question:)\s*', '', line, flags=re.IGNORECASE).strip()
            else:
                current_question = line
            current_answer = ""
        elif current_question:
            # This is part of the answer
            if current_answer:
                current_answer += " " + line
            else:
                current_answer = line
    
    # Add last Q&A
    if current_question and current_answer:
        questions.append({
            'question': current_question,
            'answer': current_answer.strip()
        })
    
    # Also try to find standalone questions
    question_pattern = r'([A-Z][^?]*\?)'
    matches = re.findall(question_pattern, text)
    for match in matches:
        match = match.strip()
        if len(match) > 10 and match not in [q['question'] for q in questions]:
            questions.append({
                'question': match,
                'answer': ''  # Will need manual extraction
            })
    
    return questions

def load_existing_db():
    """Load existing QA data from TypeScript file"""
    db_path = Path(__file__).parent.parent / 'data' / 'qa-data.ts'
    
    if not db_path.exists():
        return []
    
    with open(db_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract QA items using regex
    qa_items = []
    
    # Pattern to match QA items
    pattern = r'\{[^}]*id:\s*(\d+),[^}]*category:\s*"([^"]+)",[^}]*question:\s*"([^"]+)",[^}]*answer:\s*"([^"]+)"'
    
    # More flexible pattern
    qa_blocks = re.findall(r'\{\s*id:\s*(\d+),.*?category:\s*"([^"]+)",.*?question:\s*"([^"]+)",.*?answer:\s*"([^"]+)"', content, re.DOTALL)
    
    for match in qa_blocks:
        if len(match) >= 4:
            qa_items.append({
                'id': int(match[0]),
                'category': match[1],
                'question': match[2].replace('\\"', '"').replace('\\n', '\n'),
                'answer': match[3].replace('\\"', '"').replace('\\n', '\n')
            })
    
    # Alternative: extract by parsing more carefully
    if not qa_items:
        # Try to find question strings
        question_pattern = r'question:\s*"([^"]+)"'
        questions = re.findall(question_pattern, content)
        for i, q in enumerate(questions):
            qa_items.append({
                'id': i + 1,
                'question': q.replace('\\"', '"').replace('\\n', '\n')
            })
    
    return qa_items

def normalize_text(text):
    """Normalize text for comparison"""
    if not text:
        return ""
    # Remove extra whitespace, convert to lowercase
    text = re.sub(r'\s+', ' ', text.lower().strip())
    # Remove punctuation for fuzzy matching
    text = re.sub(r'[^\w\s]', '', text)
    return text

def compare_questions(pdf_questions, db_questions):
    """Compare PDF questions with database questions"""
    pdf_normalized = {normalize_text(q['question']): q for q in pdf_questions}
    db_normalized = {normalize_text(q['question']): q for q in db_questions}
    
    # Find matches
    matches = []
    pdf_only = []
    db_only = []
    
    for pdf_q_norm, pdf_q in pdf_normalized.items():
        found = False
        for db_q_norm, db_q in db_normalized.items():
            # Exact match
            if pdf_q_norm == db_q_norm:
                matches.append({
                    'pdf': pdf_q,
                    'db': db_q,
                    'match_type': 'exact'
                })
                found = True
                break
            # Fuzzy match (similarity > 80%)
            elif pdf_q_norm in db_q_norm or db_q_norm in pdf_q_norm:
                if len(pdf_q_norm) > 20 and len(db_q_norm) > 20:
                    matches.append({
                        'pdf': pdf_q,
                        'db': db_q,
                        'match_type': 'fuzzy'
                    })
                    found = True
                    break
        
        if not found:
            pdf_only.append(pdf_q)
    
    # Find DB-only questions
    for db_q_norm, db_q in db_normalized.items():
        found = False
        for pdf_q_norm in pdf_normalized:
            if pdf_q_norm == db_q_norm or pdf_q_norm in db_q_norm or db_q_norm in pdf_q_norm:
                found = True
                break
        if not found:
            db_only.append(db_q)
    
    return {
        'matches': matches,
        'pdf_only': pdf_only,
        'db_only': db_only
    }

def main():
    print("=" * 70)
    print("PDF to Database Comparison Tool")
    print("=" * 70)
    
    # Paths
    pdf_path = Path(__file__).parent.parent / 'DES166 Questions (1).pdf'
    output_path = Path(__file__).parent.parent / 'scripts' / 'comparison-report.txt'
    
    if not pdf_path.exists():
        print(f"Error: PDF file not found at {pdf_path}")
        return
    
    print(f"\n1. Extracting text from PDF: {pdf_path.name}")
    pdf_text = extract_text_from_pdf(pdf_path)
    
    if not pdf_text:
        print("   Failed to extract text from PDF")
        return
    
    print(f"   Extracted {len(pdf_text)} characters")
    
    print("\n2. Extracting questions from PDF text...")
    pdf_questions = extract_questions_from_text(pdf_text)
    print(f"   Found {len(pdf_questions)} questions in PDF")
    
    print("\n3. Loading existing database...")
    db_questions = load_existing_db()
    print(f"   Found {len(db_questions)} questions in database")
    
    print("\n4. Comparing questions...")
    comparison = compare_questions(pdf_questions, db_questions)
    
    # Generate report
    report = []
    report.append("=" * 70)
    report.append("COMPARISON REPORT")
    report.append("=" * 70)
    report.append(f"\nPDF Questions Found: {len(pdf_questions)}")
    report.append(f"Database Questions: {len(db_questions)}")
    report.append(f"Matched: {len(comparison['matches'])}")
    report.append(f"PDF Only (Missing in DB): {len(comparison['pdf_only'])}")
    report.append(f"DB Only (Not in PDF): {len(comparison['db_only'])}")
    
    report.append("\n" + "=" * 70)
    report.append("QUESTIONS IN PDF BUT NOT IN DATABASE:")
    report.append("=" * 70)
    if comparison['pdf_only']:
        for i, q in enumerate(comparison['pdf_only'], 1):
            report.append(f"\n{i}. {q['question']}")
            if q.get('answer'):
                report.append(f"   Answer: {q['answer'][:100]}...")
    else:
        report.append("\nNone - All PDF questions are in the database!")
    
    report.append("\n" + "=" * 70)
    report.append("QUESTIONS IN DATABASE BUT NOT IN PDF:")
    report.append("=" * 70)
    if comparison['db_only']:
        for i, q in enumerate(comparison['db_only'], 1):
            report.append(f"\n{i}. {q['question']}")
    else:
        report.append("\nNone")
    
    report.append("\n" + "=" * 70)
    report.append("MATCHED QUESTIONS:")
    report.append("=" * 70)
    report.append(f"\nFound {len(comparison['matches'])} matching questions")
    
    # Print to console
    full_report = "\n".join(report)
    print("\n" + full_report)
    
    # Save to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_report)
        f.write("\n\n" + "=" * 70)
        f.write("\nDETAILED PDF QUESTIONS:")
        f.write("\n" + "=" * 70)
        for i, q in enumerate(pdf_questions, 1):
            f.write(f"\n\n{i}. Question: {q['question']}")
            if q.get('answer'):
                f.write(f"\n   Answer: {q['answer']}")
    
    print(f"\n\nReport saved to: {output_path}")
    print("\n" + "=" * 70)

if __name__ == "__main__":
    main()



