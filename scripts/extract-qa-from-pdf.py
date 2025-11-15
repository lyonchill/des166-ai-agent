"""
Script to help extract QA data from the PDF and convert to TypeScript format.
This is a helper script - you'll need to review and clean the output.

Usage:
1. Install: pip install PyPDF2
2. Run: python scripts/extract-qa-from-pdf.py
3. Review output in scripts/extracted-qa.txt
4. Copy relevant parts to data/qa-data.ts
"""

import re
import json

def parse_pdf_text(file_path):
    """
    Parse the PDF text and extract QA pairs
    Note: This is a basic implementation - may need adjustments
    """
    
    # For this example, we'll work with text already extracted
    # In practice, you'd use PyPDF2 or similar
    
    qa_items = []
    current_category = "general"
    id_counter = 1
    
    # Sample parsing logic - adjust based on PDF structure
    # This is a simplified version
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Split by question patterns
    # Adjust regex based on your PDF format
    sections = re.split(r'\n(?=[A-Z][^.?!]*\?)', content)
    
    for section in sections:
        lines = section.strip().split('\n')
        if not lines:
            continue
            
        question = lines[0].strip()
        answer = ' '.join(lines[1:]).strip()
        
        if question and answer and len(question) > 10:
            # Extract URLs from answer
            urls = re.findall(r'https?://[^\s]+', answer)
            
            # Try to categorize based on keywords
            category = categorize_question(question + ' ' + answer)
            
            qa_item = {
                'id': id_counter,
                'category': category,
                'question': question,
                'answer': answer,
                'links': urls if urls else None,
                'keywords': extract_keywords(question + ' ' + answer)
            }
            
            qa_items.append(qa_item)
            id_counter += 1
    
    return qa_items

def categorize_question(text):
    """Categorize based on keywords"""
    text_lower = text.lower()
    
    if any(word in text_lower for word in ['application', 'apply', 'admission', 'admit']):
        return 'application'
    elif any(word in text_lower for word in ['portfolio', 'work sample', 'showcase']):
        return 'portfolio'
    elif any(word in text_lower for word in ['major', 'vcd', 'ixd', 'industrial design']):
        return 'major'
    elif any(word in text_lower for word in ['grade', 'gpa', '3.7', 'curve']):
        return 'grade'
    elif any(word in text_lower for word in ['advisor', 'advising', 'counsel']):
        return 'advising'
    elif any(word in text_lower for word in ['project', 'assignment', 'deliverable']):
        return 'project'
    else:
        return 'general'

def extract_keywords(text):
    """Extract potential keywords"""
    # Simple word frequency approach
    words = re.findall(r'\b[a-z]{4,}\b', text.lower())
    common_words = {'that', 'this', 'with', 'from', 'have', 'will', 'what', 'when', 'where', 'which', 'their', 'there', 'about', 'would', 'could', 'should'}
    
    word_freq = {}
    for word in words:
        if word not in common_words:
            word_freq[word] = word_freq.get(word, 0) + 1
    
    # Return top keywords
    keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]
    return [k[0] for k in keywords]

def convert_to_typescript(qa_items):
    """Convert parsed QA items to TypeScript format"""
    
    output = []
    for item in qa_items:
        ts_item = f"""  {{
    id: {item['id']},
    category: "{item['category']}",
    question: "{item['question'].replace('"', '\\"')}",
    answer: "{item['answer'].replace('"', '\\"')}","""
        
        if item.get('links'):
            links = '", "'.join(item['links'])
            ts_item += f'\n    links: ["{links}"],'
        
        if item.get('keywords'):
            keywords = '", "'.join(item['keywords'])
            ts_item += f'\n    keywords: ["{keywords}"],'
        
        ts_item += "\n  },"
        output.append(ts_item)
    
    return '\n'.join(output)

if __name__ == "__main__":
    print("QA Extraction Helper")
    print("=" * 50)
    print("\nThis is a template script. To use:")
    print("1. Extract text from PDF to a .txt file")
    print("2. Modify parse_pdf_text() to match your format")
    print("3. Run script and review output")
    print("4. Copy formatted QA items to data/qa-data.ts")
    print("\nFor manual extraction, use the format in qa-data.ts")
    print("and fill in questions from the PDF.")
