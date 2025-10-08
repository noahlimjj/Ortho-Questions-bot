import re
import csv

def parse_questions(file_content):
    questions = []
    lines = file_content.split('\n')
    
    state = 'question' # question, options, answer, explanation
    
    question_text = ''
    options = []
    answer = ''
    explanation = ''

    for line in lines:
        line = line.strip()
        if not line:
            if question_text and options and answer:
                questions.append({
                    'question': question_text,
                    'options': options,
                    'answer': answer,
                    'explanation': explanation
                })
                question_text = ''
                options = []
                answer = ''
                explanation = ''
                state = 'question'
            continue

        if state == 'question':
            if re.match(r'^(\d+|q\d+:)', line, re.IGNORECASE) or '?' in line:
                question_text = re.sub(r'^(\d+|q\d+:)\s*', '', line, flags=re.IGNORECASE).strip()
                state = 'options'
        elif state == 'options':
            if line.lower().startswith('ans:'):
                answer = line.split(':', 1)[1].strip()
                state = 'explanation'
            elif line.lower().startswith('correct answer:'):
                answer = line.split(':', 1)[1].strip()
                state = 'explanation'
            elif re.match(r'^[a-z][\\.\)]', line, re.IGNORECASE):
                options.append(re.sub(r'^[a-z][\\.\)]\s*', '', line, flags=re.IGNORECASE).strip())
            else:
                if options:
                    options[-1] += ' ' + line
        elif state == 'explanation':
            explanation += line + '\n'

    if question_text and options and answer:
        questions.append({
            'question': question_text,
            'options': options,
            'answer': answer,
            'explanation': explanation.strip()
        })

    return questions

def main():
    files_to_process = [
        '/Users/User/Desktop/Projects/Ortho Questions bot/extracted_mcq_questions.txt',
        '/Users/User/Desktop/Projects/Ortho Questions bot/Sports and trauma ortho questions.txt'
    ]

    all_questions = []
    for file_path in files_to_process:
        with open(file_path, 'r') as f:
            content = f.read()
            all_questions.extend(parse_questions(content))

    last_id = 23
    with open('/Users/User/Desktop/Projects/Ortho Questions bot/ortho_questions.csv', 'a', newline='') as f:
        writer = csv.writer(f)
        for i, q in enumerate(all_questions):
            row = [
                last_id + i + 1,
                q['question'],
                q['options'][0] if len(q['options']) > 0 else '',
                q['options'][1] if len(q['options']) > 1 else '',
                q['options'][2] if len(q['options']) > 2 else '',
                q['options'][3] if len(q['options']) > 3 else '',
                q['options'][4] if len(q['options']) > 4 else '',
                q['answer'],
                q['explanation'],
                '' # ImageURL
            ]
            writer.writerow(row)

if __name__ == '__main__':
    main()
