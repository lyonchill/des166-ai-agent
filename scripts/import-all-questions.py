#!/usr/bin/env python3
"""
Script to import all questions from Markdown file into the database
"""

import re
import json
from pathlib import Path
from collections import defaultdict

def extract_links(text):
    """Extract URLs from text"""
    # Find markdown links [text](url)
    markdown_links = re.findall(r'\[([^\]]+)\]\(([^\)]+)\)', text)
    urls = [url for _, url in markdown_links if url.startswith('http')]
    
    # Find plain URLs
    plain_urls = re.findall(r'https?://[^\s\)]+', text)
    urls.extend(plain_urls)
    
    # Remove duplicates and clean
    unique_urls = []
    seen = set()
    for url in urls:
        url_clean = url.rstrip('.,;:')
        if url_clean not in seen:
            seen.add(url_clean)
            unique_urls.append(url_clean)
    
    return unique_urls if unique_urls else None

def categorize_question(question, answer=""):
    """Categorize question based on keywords"""
    text = (question + " " + answer).lower()
    
    # Application & Admission
    if any(word in text for word in ['application', 'apply', 'admission', 'admit', 'portfolio application', 
                                     'portfolio review', 'work samples', '5-10', 'infosession', 'info session',
                                     'deadline', '3.7', 'acceptance']):
        return 'application'
    
    # Portfolio
    if any(word in text for word in ['portfolio', 'work sample', 'showcase', 'project page', 'hero image',
                                     'template', 'organize', 'revision', 'improve past work']):
        return 'portfolio'
    
    # Major Selection
    if any(word in text for word in ['major', 'vcd', 'ixd', 'industrial design', 'id', 'choose', 'select',
                                     'creative direction', 'career', 'interior design', 'minor', 'dxarts',
                                     'animation', 'fashion', 'program', 'pathway', 'degree']):
        return 'major'
    
    # Grades & Requirements
    if any(word in text for word in ['grade', 'gpa', '3.7', 'curve', 'grading', 'canvas grade', 'final grade',
                                     'points', 'rubric', 'criteria', 'requirement', 'workshop']):
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
                                     'photoshop', 'illustrator', 'printing', 'mounting', 'bleed', 'crop mark',
                                     'canvas', 'clue', 'office hours']):
        return 'project'
    
    # Default to general (but we'll map it to a valid category)
    return 'advising'  # Default fallback

def extract_questions_from_markdown(md_path):
    """Extract all questions from Markdown file"""
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = []
    
    # Split by sections (## headers)
    sections = re.split(r'\n##+\s+', content)
    
    for section in sections:
        lines = section.split('\n')
        current_question = None
        current_answer = []
        in_answer = False
        
        for line in lines:
            line_stripped = line.strip()
            
            # Skip empty lines at start
            if not line_stripped:
                if current_question and current_answer and in_answer:
                    answer_text = '\n'.join(current_answer).strip()
                    if answer_text and len(answer_text) > 10:
                        # Extract links before cleaning
                        links = extract_links(answer_text)
                        
                        # Clean answer (keep links in text but extract them)
                        answer_clean = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', answer_text)
                        answer_clean = re.sub(r'\*\*', '', answer_clean)  # Remove bold markers
                        answer_clean = re.sub(r'\s+', ' ', answer_clean).strip()
                        
                        questions.append({
                            'question': current_question,
                            'answer': answer_clean,
                            'links': links
                        })
                    current_question = None
                    current_answer = []
                    in_answer = False
                continue
            
            # Check if line is a question (bold text ending with ?)
            if line_stripped.startswith('**') and '?' in line_stripped:
                # Save previous Q&A if exists
                if current_question and current_answer and in_answer:
                    answer_text = '\n'.join(current_answer).strip()
                    if answer_text and len(answer_text) > 10:
                        links = extract_links(answer_text)
                        answer_clean = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', answer_text)
                        answer_clean = re.sub(r'\*\*', '', answer_clean)  # Remove bold markers
                        answer_clean = re.sub(r'\s+', ' ', answer_clean).strip()
                        
                        questions.append({
                            'question': current_question,
                            'answer': answer_clean,
                            'links': links
                        })
                
                # Extract new question
                q_match = re.match(r'\*\*([^*?]+\?)\*\*', line_stripped)
                if q_match:
                    current_question = q_match.group(1).strip()
                    current_answer = []
                    in_answer = True
                    # Get answer part after question mark
                    after_q = line_stripped.split('?', 1)
                    if len(after_q) > 1 and after_q[1].strip():
                        current_answer.append(after_q[1].strip())
                else:
                    # Try to extract question from line
                    q_clean = re.sub(r'\*\*', '', line_stripped)
                    if '?' in q_clean:
                        current_question = q_clean.split('?')[0].strip() + '?'
                        current_answer = []
                        in_answer = True
            elif current_question:
                # This is part of the answer
                if line_stripped.startswith('##'):
                    # New section, save current Q&A
                    if current_answer and in_answer:
                        answer_text = '\n'.join(current_answer).strip()
                        if answer_text and len(answer_text) > 10:
                            links = extract_links(answer_text)
                            answer_clean = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', answer_text)
                            answer_clean = re.sub(r'\s+', ' ', answer_clean).strip()
                            
                            questions.append({
                                'question': current_question,
                                'answer': answer_clean,
                                'links': links
                            })
                    current_question = None
                    current_answer = []
                    in_answer = False
                elif not line_stripped.startswith('**') and len(line_stripped) > 3:
                    in_answer = True
                    current_answer.append(line_stripped)
        
        # Save last Q&A in section
        if current_question and current_answer and in_answer:
            answer_text = '\n'.join(current_answer).strip()
            if answer_text and len(answer_text) > 10:
                links = extract_links(answer_text)
                answer_clean = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', answer_text)
                answer_clean = re.sub(r'\s+', ' ', answer_clean).strip()
                
                questions.append({
                    'question': current_question,
                    'answer': answer_clean,
                    'links': links
                })
    
    return questions

def generate_typescript(qa_items):
    """Generate TypeScript code for qa-data.ts"""
    ts_lines = []
    ts_lines.append('export type QAItem = {')
    ts_lines.append('  id: number;')
    ts_lines.append('  category: string;')
    ts_lines.append('  question: string;')
    ts_lines.append('  answer: string;')
    ts_lines.append('  links?: string[];')
    ts_lines.append('  date?: string;')
    ts_lines.append('  keywords?: string[];')
    ts_lines.append('};')
    ts_lines.append('')
    ts_lines.append('export type Category = {')
    ts_lines.append('  id: string;')
    ts_lines.append('  name: string;')
    ts_lines.append('  icon: string;')
    ts_lines.append('  description: string;')
    ts_lines.append('};')
    ts_lines.append('')
    ts_lines.append('export const categories: Category[] = [')
    ts_lines.append('  {')
    ts_lines.append('    id: "application",')
    ts_lines.append('    name: "Application & Admission",')
    ts_lines.append('    icon: "📝",')
    ts_lines.append('    description: "Questions about applying to the design major",')
    ts_lines.append('  },')
    ts_lines.append('  {')
    ts_lines.append('    id: "portfolio",')
    ts_lines.append('    name: "Portfolio",')
    ts_lines.append('    icon: "🎨",')
    ts_lines.append('    description: "Portfolio requirements and tips",')
    ts_lines.append('  },')
    ts_lines.append('  {')
    ts_lines.append('    id: "major",')
    ts_lines.append('    name: "Major Selection",')
    ts_lines.append('    icon: "🎓",')
    ts_lines.append('    description: "Choosing between VCD, IxD, and ID",')
    ts_lines.append('  },')
    ts_lines.append('  {')
    ts_lines.append('    id: "grade",')
    ts_lines.append('    name: "Grades & Requirements",')
    ts_lines.append('    icon: "📊",')
    ts_lines.append('    description: "GPA requirements and grading policies",')
    ts_lines.append('  },')
    ts_lines.append('  {')
    ts_lines.append('    id: "advising",')
    ts_lines.append('    name: "Academic Advising",')
    ts_lines.append('    icon: "💬",')
    ts_lines.append('    description: "Academic planning and advising resources",')
    ts_lines.append('  },')
    ts_lines.append('  {')
    ts_lines.append('    id: "project",')
    ts_lines.append('    name: "Projects & Assignments",')
    ts_lines.append('    icon: "✏️",')
    ts_lines.append('    description: "Course projects and deliverables",')
    ts_lines.append('  },')
    ts_lines.append('];')
    ts_lines.append('')
    ts_lines.append('export const qaData: QAItem[] = [')
    
    for i, item in enumerate(qa_items, 1):
        ts_lines.append('  {')
        ts_lines.append(f'    id: {i},')
        ts_lines.append(f'    category: "{item["category"]}",')
        
        # Escape quotes in question
        question_escaped = item['question'].replace('"', '\\"')
        ts_lines.append(f'    question: "{question_escaped}",')
        
        # Escape quotes and newlines in answer
        answer_escaped = item['answer'].replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        ts_lines.append(f'    answer: "{answer_escaped}",')
        
        if item.get('links'):
            ts_lines.append('    links: [')
            for link in item['links']:
                link_escaped = link.replace('\\', '\\\\').replace('"', '\\"')
                ts_lines.append(f'      "{link_escaped}",')
            ts_lines.append('    ],')
        
        ts_lines.append('  },')
    
    ts_lines.append('];')
    
    return '\n'.join(ts_lines)

def main():
    print("=" * 70)
    print("Importing All Questions from Markdown to Database")
    print("=" * 70)
    
    md_path = Path(__file__).parent.parent / 'DES166 Questions.md'
    output_path = Path(__file__).parent.parent / 'data' / 'qa-data.ts'
    
    if not md_path.exists():
        print(f"Error: Markdown file not found at {md_path}")
        return
    
    print(f"\n1. Extracting questions from Markdown...")
    questions = extract_questions_from_markdown(md_path)
    print(f"   Found {len(questions)} questions")
    
    print("\n2. Categorizing questions...")
    categorized = defaultdict(int)
    for q in questions:
        category = categorize_question(q['question'], q.get('answer', ''))
        q['category'] = category
        categorized[category] += 1
    
    print("   Category distribution:")
    for cat, count in sorted(categorized.items()):
        print(f"     {cat}: {count} questions")
    
    print("\n3. Generating TypeScript file...")
    ts_content = generate_typescript(questions)
    
    # Backup existing file
    if output_path.exists():
        backup_path = output_path.with_suffix('.ts.backup')
        print(f"   Backing up existing file to {backup_path}")
        with open(output_path, 'r', encoding='utf-8') as f:
            backup_path.write_text(f.read(), encoding='utf-8')
    
    # Write new file
    output_path.write_text(ts_content, encoding='utf-8')
    print(f"   Saved {len(questions)} questions to {output_path}")
    
    print("\n" + "=" * 70)
    print("Import completed successfully!")
    print(f"Total questions imported: {len(questions)}")
    print("=" * 70)

if __name__ == '__main__':
    main()

