
import csv
import os

def import_difficult_questions():
    # Path to the difficult questions
    difficult_questions_path = '/Users/User/Desktop/Projects/Ortho Questions bot/Difficult questions'
    # Path to the main questions file
    main_questions_file = '/Users/User/Desktop/Projects/Ortho Questions bot/ortho_questions.csv'
    # Chapter to category mapping
    chapter_mapping = {
        'Ch2': 'Hand and Wrist',
        'Ch3': 'Shoulder',
        'Ch4': 'Spine',
        'Ch5': 'Hip and Pelvis',
        'Ch6': 'Knee',
        'Ch7': 'Foot and Ankle',
        'Ch8': 'Pathology',
        'Ch9': 'Paediatrics',
        'Ch10': 'Trauma'
    }

    # Read existing questions
    with open(main_questions_file, 'r', newline='') as f:
        reader = csv.reader(f)
        existing_questions = list(reader)

    # Get the header from the existing questions
    header = existing_questions[0] if existing_questions else []
    if 'Category' not in header:
        header.append('Category')

    # Add blank Category to existing questions (skip header row)
    for i in range(1, len(existing_questions)):
        if len(existing_questions[i]) < len(header):
            existing_questions[i].append('')  # Blank category for existing questions

    # Chapter files with actual filenames
    chapter_files = [
        'MCQ_Chapter2_Complete.csv',
        'MCQ_Chapter3_FULL.csv',
        'MCQ_Chapter4_Complete.csv',
        'MCQ_Chapter5_Complete.csv',
        'MCQ_Chapter6_Complete.csv',
        'MCQ_Chapter7_Complete.csv',
        'MCQ_Chapter8_Complete.csv',
        'MCQ_Chapter9_Complete.csv',
        'MCQ_Chapter10_Complete.csv'
    ]

    # Process each chapter file
    for chapter_filename in chapter_files:
        chapter_file = os.path.join(difficult_questions_path, chapter_filename)
        if os.path.exists(chapter_file):
            with open(chapter_file, 'r', newline='', encoding='utf-8') as f:
                reader = csv.reader(f)
                # Skip header
                next(reader, None)
                for row in reader:
                    if row and row[0]:  # Skip empty rows
                        # ID is in the first column, e.g., Ch2_Q1
                        question_id = row[0]
                        chapter = question_id.split('_')[0] if '_' in question_id else ''
                        category = chapter_mapping.get(chapter, '')
                        # Add the category to the row
                        row.append(category)
                        existing_questions.append(row)
            print(f'Imported {chapter_filename}')
        else:
            print(f'File not found: {chapter_file}')

    # Write the updated questions back to the main file
    with open(main_questions_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(existing_questions)

    total_questions = len(existing_questions) - 1  # Subtract header
    print(f'\n✅ Successfully imported questions and updated {main_questions_file}')
    print(f'Total questions: {total_questions}')

if __name__ == '__main__':
    import_difficult_questions()
