#!/usr/bin/env python3
"""
Script to categorize missing questions from Markdown file
"""

import re
from pathlib import Path
from collections import defaultdict

def categorize_question(question, answer=""):
    """Categorize question based on keywords"""
    text = (question + " " + answer).lower()
    
    # Application & Admission
    if any(word in text for word in ['application', 'apply', 'admission', 'admit', 'portfolio application', 
                                     'portfolio review', 'work samples', '5-10', 'infosession', 'info session']):
        return 'application'
    
    # Portfolio
    if any(word in text for word in ['portfolio', 'work sample', 'showcase', 'project page', 'hero image',
                                     'template', 'organize', 'revision', 'improve past work']):
        return 'portfolio'
    
    # Major Selection
    if any(word in text for word in ['major', 'vcd', 'ixd', 'industrial design', 'id', 'choose', 'select',
                                     'creative direction', 'career', 'interior design', 'minor', 'dxarts',
                                     'animation', 'fashion', 'program', 'pathway']):
        return 'major'
    
    # Grades & Requirements
    if any(word in text for word in ['grade', 'gpa', '3.7', 'curve', 'grading', 'canvas grade', 'final grade',
                                     'points', 'rubric', 'criteria', 'requirement']):
        return 'grade'
    
    # Academic Advising
    if any(word in text for word in ['advisor', 'advising', 'counsel', 'academic advisor', 'contact', 'appointment',
                                     'opt', 'stem', 'visa', 'international', 'study abroad', 'internship',
                                     'transfer', 'credit']):
        return 'advising'
    
    # Projects & Assignments
    if any(word in text for word in ['project', 'assignment', 'deliverable', 'critique', 'submission', 'stool',
                                     'cardboard', 'mockup', 'slide', 'deck', 'template', 'process', 'concept',
                                     'photography', 'photo', 'cover', 'magazine', 'illustration', 'collage',
                                     'photoshop', 'illustrator', 'printing', 'mounting', 'bleed', 'crop mark']):
        return 'project'
    
    # Default to general
    return 'general'

def extract_questions_from_markdown(md_path):
    """Extract questions from Markdown file"""
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = []
    
    # Pattern: **Question?** format
    qa_pattern = r'\*\*([^*?]+\?)\*\*\s*\n(.+?)(?=\n\*\*|\n\n\*\*|$)'
    matches = re.findall(qa_pattern, content, re.MULTILINE | re.DOTALL)
    
    for q, a in matches:
        # Clean answer
        a_clean = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', a)
        a_clean = re.sub(r'https?://[^\s]+', '', a_clean)
        a_clean = re.sub(r'\s+', ' ', a_clean).strip()
        
        questions.append({
            'question': q.strip(),
            'answer': a_clean
        })
    
    # Also extract from lines ending with ?
    lines = content.split('\n')
    current_question = None
    current_answer = []
    in_answer = False
    
    for line in lines:
        line_stripped = line.strip()
        
        if not line_stripped:
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
                current_question = None
                current_answer = []
                in_answer = False
            continue
        
        if line_stripped.endswith('?') and len(line_stripped) > 15:
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
            
            q_clean = re.sub(r'\*\*', '', line_stripped).strip()
            current_question = q_clean
            current_answer = []
            in_answer = False
        elif current_question:
            if line_stripped.startswith('##'):
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
                in_answer = True
                if len(line_stripped) > 5:
                    current_answer.append(line_stripped)
    
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
    
    # Remove duplicates
    seen = set()
    unique_questions = []
    for q in questions:
        q_norm = re.sub(r'\s+', ' ', q['question'].lower().strip())
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
    text = re.sub(r'\s+', ' ', text.lower().strip())
    text = re.sub(r'[^\w\s]', '', text)
    return text

def main():
    print("=" * 70)
    print("Categorizing Missing Questions from Markdown")
    print("=" * 70)
    
    md_path = Path(__file__).parent.parent / 'DES166 Questions.md'
    output_path = Path(__file__).parent.parent / 'scripts' / 'categorized-missing-questions.txt'
    
    if not md_path.exists():
        print(f"Error: Markdown file not found at {md_path}")
        return
    
    print(f"\n1. Extracting questions from Markdown...")
    md_questions = extract_questions_from_markdown(md_path)
    print(f"   Found {len(md_questions)} questions")
    
    print("\n2. Loading existing database...")
    db_questions = load_existing_db()
    print(f"   Found {len(db_questions)} questions in database")
    
    print("\n3. Finding missing questions...")
    db_normalized = {normalize_text(q['question']): q for q in db_questions}
    missing_questions = []
    
    for md_q in md_questions:
        md_q_norm = normalize_text(md_q['question'])
        found = False
        for db_q_norm in db_normalized:
            if md_q_norm == db_q_norm or md_q_norm in db_q_norm or db_q_norm in md_q_norm:
                found = True
                break
        if not found:
            missing_questions.append(md_q)
    
    print(f"   Found {len(missing_questions)} missing questions")
    
    print("\n4. Categorizing missing questions...")
    categorized = defaultdict(list)
    
    for q in missing_questions:
        category = categorize_question(q['question'], q.get('answer', ''))
        categorized[category].append(q)
    
    # Generate report
    report = []
    report.append("=" * 70)
    report.append("CATEGORIZED MISSING QUESTIONS REPORT")
    report.append("=" * 70)
    report.append(f"\nTotal Missing Questions: {len(missing_questions)}")
    report.append(f"\nBreakdown by Category:\n")
    
    category_names = {
        'application': 'Application & Admission',
        'portfolio': 'Portfolio',
        'major': 'Major Selection',
        'grade': 'Grades & Requirements',
        'advising': 'Academic Advising',
        'project': 'Projects & Assignments',
        'general': 'General/Other'
    }
    
    # Sort categories by count
    sorted_categories = sorted(categorized.items(), key=lambda x: len(x[1]), reverse=True)
    
    for category, questions in sorted_categories:
        category_display = category_names.get(category, category.title())
        report.append(f"{category_display}: {len(questions)} questions")
    
    # Detailed breakdown
    report.append("\n" + "=" * 70)
    report.append("DETAILED BREAKDOWN BY CATEGORY")
    report.append("=" * 70)
    
    for category, questions in sorted_categories:
        category_display = category_names.get(category, category.title())
        report.append(f"\n{'=' * 70}")
        report.append(f"{category_display.upper()} ({len(questions)} questions)")
        report.append("=" * 70)
        
        for i, q in enumerate(questions, 1):
            report.append(f"\n{i}. {q['question']}")
            answer_preview = q.get('answer', '')[:150]
            if len(q.get('answer', '')) > 150:
                answer_preview += "..."
            report.append(f"   Answer: {answer_preview}")
    
    # Print summary
    full_report = "\n".join(report)
    print("\n" + "\n".join(report[:50]))  # Print first part
    
    # Save to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_report)
    
    print(f"\n\n📄 Full report saved to: {output_path}")
    print("\n" + "=" * 70)
    
    # Summary statistics
    print("\n📊 SUMMARY BY CATEGORY:")
    for category, questions in sorted_categories:
        category_display = category_names.get(category, category.title())
        percentage = (len(questions) / len(missing_questions) * 100) if missing_questions else 0
        print(f"   {category_display:25s}: {len(questions):3d} questions ({percentage:5.1f}%)")

if __name__ == "__main__":
    main()



