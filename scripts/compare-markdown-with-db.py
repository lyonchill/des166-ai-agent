#!/usr/bin/env python3
"""
Script to extract questions from Markdown file and compare with existing database
"""

import re
import json
from pathlib import Path

def extract_questions_from_markdown(md_path):
    """Extract questions from Markdown file"""
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = []
    
    # Pattern 1: **Question?** format (bold question followed by answer)
    # This matches: **Question?** followed by answer text
    qa_pattern1 = r'\*\*([^*?]+\?)\*\*\s*\n(.+?)(?=\n\*\*|\n\n\*\*|$)'
    matches1 = re.findall(qa_pattern1, content, re.MULTILINE | re.DOTALL)
    
    for q, a in matches1:
        # Clean answer - remove markdown links, keep text
        a_clean = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', a)  # Convert [text](url) to text
        a_clean = re.sub(r'https?://[^\s]+', '', a_clean)  # Remove standalone URLs
        a_clean = re.sub(r'\s+', ' ', a_clean).strip()
        
        questions.append({
            'question': q.strip(),
            'answer': a_clean
        })
    
    # Pattern 2: Regular text questions ending with ?
    # Look for lines that end with ? and are likely questions
    lines = content.split('\n')
    current_question = None
    current_answer = []
    in_answer = False
    
    for i, line in enumerate(lines):
        line_stripped = line.strip()
        
        # Skip empty lines (but save current Q&A if we have one)
        if not line_stripped:
            if current_question and current_answer and in_answer:
                answer_text = ' '.join(current_answer).strip()
                # Clean answer
                answer_text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', answer_text)
                answer_text = re.sub(r'https?://[^\s]+', '', answer_text)
                answer_text = re.sub(r'\s+', ' ', answer_text).strip()
                
                if answer_text and len(answer_text) > 10:
                    questions.append({
                        'question': current_question,
                        'answer': answer_text
                    })
                current_question = None
                current_answer = []
                in_answer = False
            continue
        
        # Check if line is a question (ends with ? and is bold or standalone)
        if line_stripped.endswith('?') and len(line_stripped) > 15:
            # Save previous Q&A
            if current_question and current_answer and in_answer:
                answer_text = ' '.join(current_answer).strip()
                answer_text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', answer_text)
                answer_text = re.sub(r'https?://[^\s]+', '', answer_text)
                answer_text = re.sub(r'\s+', ' ', answer_text).strip()
                
                if answer_text and len(answer_text) > 10:
                    questions.append({
                        'question': current_question,
                        'answer': answer_text
                    })
            
            # Extract question (remove ** markers if present)
            q_clean = re.sub(r'\*\*', '', line_stripped).strip()
            current_question = q_clean
            current_answer = []
            in_answer = False
        elif current_question:
            # This is part of the answer
            # Skip section headers (## or ###)
            if line_stripped.startswith('##'):
                # End current Q&A
                if current_answer and in_answer:
                    answer_text = ' '.join(current_answer).strip()
                    answer_text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', answer_text)
                    answer_text = re.sub(r'https?://[^\s]+', '', answer_text)
                    answer_text = re.sub(r'\s+', ' ', answer_text).strip()
                    
                    if answer_text and len(answer_text) > 10:
                        questions.append({
                            'question': current_question,
                            'answer': answer_text
                        })
                current_question = None
                current_answer = []
                in_answer = False
            else:
                # Add to answer
                in_answer = True
                # Skip very short lines that are likely formatting
                if len(line_stripped) > 5:
                    current_answer.append(line_stripped)
    
    # Add last Q&A
    if current_question and current_answer and in_answer:
        answer_text = ' '.join(current_answer).strip()
        answer_text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', answer_text)
        answer_text = re.sub(r'https?://[^\s]+', '', answer_text)
        answer_text = re.sub(r'\s+', ' ', answer_text).strip()
        
        if answer_text and len(answer_text) > 10:
            questions.append({
                'question': current_question,
                'answer': answer_text
            })
    
    # Remove duplicates based on normalized question text
    seen = set()
    unique_questions = []
    for q in questions:
        q_norm = normalize_text(q['question'])
        if q_norm not in seen and len(q['question']) > 10 and len(q.get('answer', '')) > 10:
            seen.add(q_norm)
            unique_questions.append(q)
    
    return unique_questions

def load_existing_db():
    """Load existing QA data from TypeScript file"""
    db_path = Path(__file__).parent.parent / 'data' / 'qa-data.ts'
    
    if not db_path.exists():
        return []
    
    with open(db_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    qa_items = []
    
    # Extract QA items using regex
    # Pattern: { id: X, category: "...", question: "...", answer: "..." }
    pattern = r'\{\s*id:\s*(\d+),.*?category:\s*"([^"]+)",.*?question:\s*"([^"]+)",.*?answer:\s*"([^"]+)"'
    matches = re.findall(pattern, content, re.DOTALL)
    
    for match in matches:
        if len(match) >= 4:
            qa_items.append({
                'id': int(match[0]),
                'category': match[1],
                'question': match[2].replace('\\"', '"').replace('\\n', '\n'),
                'answer': match[3].replace('\\"', '"').replace('\\n', '\n')
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

def compare_questions(md_questions, db_questions):
    """Compare Markdown questions with database questions"""
    md_normalized = {normalize_text(q['question']): q for q in md_questions}
    db_normalized = {normalize_text(q['question']): q for q in db_questions}
    
    # Find matches
    matches = []
    md_only = []
    db_only = []
    
    for md_q_norm, md_q in md_normalized.items():
        found = False
        for db_q_norm, db_q in db_normalized.items():
            # Exact match
            if md_q_norm == db_q_norm:
                matches.append({
                    'md': md_q,
                    'db': db_q,
                    'match_type': 'exact'
                })
                found = True
                break
            # Fuzzy match (one contains the other)
            elif md_q_norm in db_q_norm or db_q_norm in md_q_norm:
                if len(md_q_norm) > 20 and len(db_q_norm) > 20:
                    matches.append({
                        'md': md_q,
                        'db': db_q,
                        'match_type': 'fuzzy'
                    })
                    found = True
                    break
        
        if not found:
            md_only.append(md_q)
    
    # Find DB-only questions
    for db_q_norm, db_q in db_normalized.items():
        found = False
        for md_q_norm in md_normalized:
            if md_q_norm == db_q_norm or md_q_norm in db_q_norm or db_q_norm in md_q_norm:
                found = True
                break
        if not found:
            db_only.append(db_q)
    
    return {
        'matches': matches,
        'md_only': md_only,
        'db_only': db_only
    }

def main():
    print("=" * 70)
    print("Markdown to Database Comparison Tool")
    print("=" * 70)
    
    # Paths
    md_path = Path(__file__).parent.parent / 'DES166 Questions.md'
    output_path = Path(__file__).parent.parent / 'scripts' / 'markdown-comparison-report.txt'
    
    if not md_path.exists():
        print(f"Error: Markdown file not found at {md_path}")
        return
    
    print(f"\n1. Reading Markdown file: {md_path.name}")
    print(f"   File size: {md_path.stat().st_size} bytes")
    
    print("\n2. Extracting questions from Markdown...")
    md_questions = extract_questions_from_markdown(md_path)
    print(f"   Found {len(md_questions)} questions in Markdown")
    
    print("\n3. Loading existing database...")
    db_questions = load_existing_db()
    print(f"   Found {len(db_questions)} questions in database")
    
    print("\n4. Comparing questions...")
    comparison = compare_questions(md_questions, db_questions)
    
    # Generate report
    report = []
    report.append("=" * 70)
    report.append("MARKDOWN TO DATABASE COMPARISON REPORT")
    report.append("=" * 70)
    report.append(f"\nMarkdown Questions Found: {len(md_questions)}")
    report.append(f"Database Questions: {len(db_questions)}")
    report.append(f"Matched: {len(comparison['matches'])}")
    report.append(f"Markdown Only (Missing in DB): {len(comparison['md_only'])}")
    report.append(f"DB Only (Not in Markdown): {len(comparison['db_only'])}")
    
    report.append("\n" + "=" * 70)
    report.append("QUESTIONS IN MARKDOWN BUT NOT IN DATABASE:")
    report.append("=" * 70)
    if comparison['md_only']:
        for i, q in enumerate(comparison['md_only'][:50], 1):  # Show first 50
            report.append(f"\n{i}. {q['question'][:100]}")
            if q.get('answer'):
                report.append(f"   Answer: {q['answer'][:150]}...")
        if len(comparison['md_only']) > 50:
            report.append(f"\n... and {len(comparison['md_only']) - 50} more questions")
    else:
        report.append("\nNone - All Markdown questions are in the database!")
    
    report.append("\n" + "=" * 70)
    report.append("QUESTIONS IN DATABASE BUT NOT IN MARKDOWN:")
    report.append("=" * 70)
    if comparison['db_only']:
        for i, q in enumerate(comparison['db_only'], 1):
            report.append(f"\n{i}. {q['question']}")
    else:
        report.append("\nNone - All database questions are in the Markdown!")
    
    report.append("\n" + "=" * 70)
    report.append("MATCHED QUESTIONS:")
    report.append("=" * 70)
    report.append(f"\nFound {len(comparison['matches'])} matching questions")
    for i, match in enumerate(comparison['matches'][:10], 1):  # Show first 10 matches
        report.append(f"\n{i}. {match['md']['question'][:80]}")
        report.append(f"   Match type: {match['match_type']}")
    
    # Print to console
    full_report = "\n".join(report)
    print("\n" + full_report)
    
    # Save detailed report to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_report)
        f.write("\n\n" + "=" * 70)
        f.write("\nDETAILED MARKDOWN QUESTIONS:")
        f.write("\n" + "=" * 70)
        for i, q in enumerate(md_questions, 1):
            f.write(f"\n\n{i}. Question: {q['question']}")
            if q.get('answer'):
                f.write(f"\n   Answer: {q['answer'][:200]}")
    
    print(f"\n\nDetailed report saved to: {output_path}")
    print("\n" + "=" * 70)
    
    # Summary statistics
    coverage = (len(comparison['matches']) / len(md_questions) * 100) if md_questions else 0
    print(f"\n📊 SUMMARY:")
    print(f"   Coverage: {coverage:.1f}% of Markdown questions are in database")
    print(f"   Missing: {len(comparison['md_only'])} questions need to be added")

if __name__ == "__main__":
    main()

