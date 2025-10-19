import csv

with open('/Users/User/Desktop/Projects/Ortho Questions bot/ortho_questions.csv', 'r') as f:
    reader = csv.reader(f)
    lines = list(reader)

header = lines[0]
questions = lines[1:]

new_lines = [['ID','Question','OptionA','OptionB','OptionC','OptionD','OptionE','CorrectAnswer','Explanation','ImageURL']]

for row in questions:
    new_row = [''] * 10
    new_row[0] = row[0]
    new_row[1] = row[1]
    new_row[2] = row[2]
    new_row[3] = row[3]
    new_row[4] = row[4]
    new_row[5] = row[5]
    new_row[7] = row[7]
    new_row[8] = row[8]
    new_row[9] = row[9]
    new_lines.append(new_row)

with open('/Users/User/Desktop/Projects/Ortho Questions bot/ortho_questions.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(new_lines)

print('CSV file has been corrected.')
