
import csv

def main():
    with open('/Users/User/Desktop/Projects/Ortho Questions bot/ortho_questions.csv', 'r') as f:
        reader = csv.reader(f)
        lines = list(reader)

    header = lines[0]
    questions = lines[1:]

    errors = []
    ids = set()

    for i, row in enumerate(questions):
        line_number = i + 2

        # Check number of columns
        if len(row) != len(header):
            errors.append(f'Line {line_number}: Incorrect number of columns. Expected {len(header)}, got {len(row)}.')
            continue

        # Check for duplicate IDs
        question_id = row[0]
        if question_id in ids:
            errors.append(f'Line {line_number}: Duplicate ID: {question_id}')
        else:
            ids.add(question_id)

        # Check for empty fields
        if not row[1]:
            errors.append(f'Line {line_number}: Question is empty.')
        if not row[2]:
            errors.append(f'Line {line_number}: OptionA is empty.')
        if not row[3]:
            errors.append(f'Line {line_number}: OptionB is empty.')
        if not row[6]:
            errors.append(f'Line {line_number}: CorrectAnswer is empty.')

        # Check CorrectAnswer value
        correct_answer = row[6].upper()
        if correct_answer not in ['A', 'B', 'C', 'D', 'E']:
            errors.append(f'Line {line_number}: Invalid CorrectAnswer: {row[6]}')
        else:
            # Check if the number of options is consistent with the correct answer
            if correct_answer == 'E' and not row[5]:
                errors.append(f'Line {line_number}: CorrectAnswer is E, but OptionE is empty.')
            if correct_answer == 'D' and not row[4]:
                errors.append(f'Line {line_number}: CorrectAnswer is D, but OptionD is empty.')
            if correct_answer == 'C' and not row[3]:
                errors.append(f'Line {line_number}: CorrectAnswer is C, but OptionC is empty.')

    if errors:
        for error in errors:
            print(error)
    else:
        print('No errors found.')

if __name__ == '__main__':
    main()
