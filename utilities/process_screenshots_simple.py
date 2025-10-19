import os
import re
import csv
from PIL import Image
import pytesseract


def extract_text_from_image(image_path):
    """Extract text from an image using OCR."""
    try:
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"Error processing image {image_path}: {str(e)}")
        return ""




def parse_questions_from_text(text):
    questions = []
    lines = text.split('\n')
    state = "SEARCHING_FOR_QUESTION"
    question = ""
    options = []
    answer = ""
    explanation = ""

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if state == "SEARCHING_FOR_QUESTION":
            if re.match(r'^\d+\.', line):
                question = line
                state = "PARSING_QUESTION"
        elif state == "PARSING_QUESTION":
            if re.match(r'^[a-eA-E][\\\\.\\)]', line):
                options.append(line)
                state = "PARSING_OPTIONS"
            else:
                question += " " + line
        elif state == "PARSING_OPTIONS":
            if re.match(r'^[a-eA-E][\\\\.\\)]', line):
                options.append(line)
            elif line.lower().startswith('answer'):
                answer_match = re.search(r'([a-eA-E])', line)
                if answer_match:
                    answer = answer_match.group(1).lower()
                explanation = line
                state = "PARSING_ANSWER"
            else:
                if options:
                    options[-1] += " " + line
        elif state == "PARSING_ANSWER":
            if re.match(r'^\d+\.', line):
                # new question found
                questions.append({
                    'question': question,
                    'options': options,
                    'answer': answer,
                    'explanation': explanation
                })
                question = line
                options = []
                answer = ""
                explanation = ""
                state = "PARSING_QUESTION"
            else:
                explanation += " " + line
    
    if question: # Add the last question
        questions.append({
            'question': question,
            'options': options,
            'answer': answer,
            'explanation': explanation
        })

    return questions


def format_questions_to_csv(questions, output_file):
    """Format questions to CSV and append to file."""
    # Determine the next ID based on existing questions
    last_id = 102  # Starting after the previous questions
    
    if os.path.exists('/Users/User/Desktop/Projects/Ortho Questions bot/ortho_questions.csv'):
        with open('/Users/User/Desktop/Projects/Ortho Questions bot/ortho_questions.csv', 'r') as f:
            reader = csv.reader(f)
            lines = list(reader)
            if len(lines) > 1:
                last_id = int(lines[-1][0])  # Get the last ID from the CSV
    
    with open(output_file, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        
        # If file is empty, write header
        if os.path.getsize(output_file) == 0:
            writer.writerow([
                'ID', 'Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'OptionE', 
                'CorrectAnswer', 'Explanation', 'ImageURL'
            ])
        
        for i, q in enumerate(questions):
            # Ensure we have at least 4 options
            options = q['options'][:5]  # Take up to 5 options
            while len(options) < 4:
                options.append("")
            
            # Ensure answer is valid
            answer = q['answer'].lower() if q['answer'] else 'a'
            if answer not in ['a', 'b', 'c', 'd', 'e']:
                answer = 'a'  # Default to first option if invalid
            
            row = [
                last_id + i + 1,
                q['question'],
                options[0] if len(options) > 0 else '',
                options[1] if len(options) > 1 else '',
                options[2] if len(options) > 2 else '',
                options[3] if len(options) > 3 else '',
                options[4] if len(options) > 4 else '',
                answer,
                q['explanation'],
                ''  # ImageURL
            ]
            writer.writerow(row)
    
    print(f"Added {len(questions)} questions to {output_file}")


def main():
    screenshot_dir = "/Users/User/Desktop/Projects/Ortho Questions bot/Questions to extract (SS)"
    
    # Get all screenshot files
    screenshot_files = []
    for filename in os.listdir(screenshot_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            screenshot_files.append(os.path.join(screenshot_dir, filename))
    
    # Sort files to process them in order
    screenshot_files.sort()
    
    all_questions = []
    
    for screenshot_file in screenshot_files:
        print(f"Processing {screenshot_file}...")
        text = extract_text_from_image(screenshot_file)
        print(f"Extracted text: {text[:200]}...")  # Print first 200 chars to verify
        questions = parse_questions_from_text(text)
        all_questions.extend(questions)
        print(f"Found {len(questions)} questions in {screenshot_file}")
    
    if all_questions:
        output_file = '/Users/User/Desktop/Projects/Ortho Questions bot/screenshot_questions.csv'
        
        # Clear the output file and add header
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                'ID', 'Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'OptionE', 
                'CorrectAnswer', 'Explanation', 'ImageURL'
            ])
        
        format_questions_to_csv(all_questions, output_file)
        print(f"Processing complete. Questions saved to {output_file}")
    else:
        print("No questions found in screenshots.")


if __name__ == "__main__":
    main()