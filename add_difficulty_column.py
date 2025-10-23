#!/usr/bin/env python3
"""
Script to add a 'Difficulty' column to ortho_questions.csv
Marks questions with Ch#_Q# format as 'Difficult'
"""

import csv

def add_difficulty_column():
    input_file = 'ortho_questions.csv'
    output_file = 'ortho_questions_new.csv'

    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:

        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        # Read header
        headers = next(reader)

        # Add 'Difficulty' column if it doesn't exist
        if 'Difficulty' not in headers:
            headers.append('Difficulty')

        writer.writerow(headers)

        # Get column index for ID
        id_index = headers.index('ID')

        # Process each row
        for row in reader:
            if len(row) > id_index:
                question_id = row[id_index]

                # Check if ID matches Ch#_Q# format (difficult question)
                if question_id.startswith('Ch') and '_Q' in question_id:
                    # Add 'Difficult' marker
                    if len(row) == len(headers) - 1:
                        row.append('Difficult')
                    else:
                        row[-1] = 'Difficult'
                else:
                    # Add 'Normal' marker
                    if len(row) == len(headers) - 1:
                        row.append('Normal')
                    else:
                        row[-1] = 'Normal'

            writer.writerow(row)

    print(f"✓ Created {output_file} with Difficulty column")
    print(f"✓ Questions with Ch#_Q# format marked as 'Difficult'")
    print(f"✓ Other questions marked as 'Normal'")

if __name__ == '__main__':
    add_difficulty_column()
