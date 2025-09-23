
import csv

def main():
    with open('/Users/User/Desktop/Projects/Ortho Questions bot/ortho_questions.csv', 'r') as f:
        reader = csv.reader(f)
        lines = list(reader)

    header = lines[0]
    first_10_questions = lines[1:11]
    rest_of_the_questions = lines[11:]

    new_lines = [header] + rest_of_the_questions + first_10_questions

    with open('/Users/User/Desktop/Projects/Ortho Questions bot/ortho_questions.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(new_lines)

if __name__ == '__main__':
    main()
