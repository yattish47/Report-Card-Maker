const form = document.getElementById('reportForm');
const studentList = document.getElementById('studentList');
const exportBtn = document.getElementById('exportBtn');
let students = JSON.parse(localStorage.getItem('students')) || {};

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission behavior
    const classValue = document.getElementById('class').value;
    const name = document.getElementById('name').value;
    const sex = document.getElementById('sex').value;
    const report = document.getElementById('report').value;

    // Ensure that the classValue and name are not empty
    if (!classValue || !name) {
        alert("Class and Name fields are required.");
        return;
    }

    if (!students[classValue]) {
        students[classValue] = [];
    }

    students[classValue].push({ name, sex, report });
    localStorage.setItem('students', JSON.stringify(students));
    updateStudentList();
    form.reset(); // Reset the form fields
});

function updateStudentList() {
    studentList.innerHTML = ''; // Clear the current list
    const table = document.createElement('table'); // Create a new table
    table.style.width = '100%'; // Set table width to 100%
    table.style.borderCollapse = 'collapse'; // Collapse borders for a cleaner look

    // Create table header
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th style="border: 1px solid #ccc; padding: 10px;">Name</th>
        <th style="border: 1px solid #ccc; padding: 10px;">Class</th>
        <th style="border: 1px solid #ccc; padding: 10px;">Sex</th>
        <th style="border: 1px solid #ccc; padding: 10px;">Report Card Details</th>
        <th style="border: 1px solid #ccc; padding: 10px;">Actions</th>
    `;
    table.appendChild(headerRow);

    for (const [classValue, classStudents] of Object.entries(students)) {
        classStudents.forEach((student, index) => {
            const studentRow = document.createElement('tr');
            studentRow.innerHTML = `
                <td style="border: 1px solid #ccc; padding: 10px;">${student.name}</td>
                <td style="border: 1px solid #ccc; padding: 10px;">${classValue} 2</td>
                <td style="border: 1px solid #ccc; padding: 10px;">${student.sex}</td>
                <td style="border: 1px solid #ccc; padding: 10px;">
                    <p>${student.report}</p>
                </td>
                <td style="border: 1px solid #ccc; padding: 10px;">
                    <button onclick="removeStudent('${classValue}', ${index})">Remove</button>
                </td>
            `;
            table.appendChild(studentRow);
        });
    }

    studentList.appendChild(table); // Append the table to the student list
    exportBtn.style.display = Object.keys(students).length > 0 ? 'block' : 'none'; // Show/hide export button
}

function removeStudent(classValue, index) {
    students[classValue].splice(index, 1);
    if (students[classValue].length === 0) {
        delete students[classValue];
    }
    localStorage.setItem('students', JSON.stringify(students));
    updateStudentList();
}

exportBtn.addEventListener('click', function() {
    let content = '';
    for (const [classValue, classStudents] of Object.entries(students)) {
        classStudents.forEach(student => {
            content += `
                <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Name:</td>
                        <td style="border: 1px solid black; padding: 5px;">${student.name}</td>
                        <td style="border: 1px solid black; padding: 5px;">Class:</td>
                        <td style="border: 1px solid black; padding: 5px;">${classValue} 2</td>
                        <td style="border: 1px solid black; padding: 5px;">Sex:</td>
                        <td style="border: 1px solid black; padding: 5px;">${student.sex}</td>
                    </tr>
            `;

            // Split the report into sentences
            const sentences = student.report.split('. ').map(sentence => sentence.trim()).filter(sentence => sentence);

            // Create a new row for each sentence
            sentences.forEach(sentence => {
                content += `
                    <tr>
                        <td colspan="6" style="border: 1px solid black; padding: 5px;">${sentence}.</td>
                    </tr>
                `;
            });

            content += `
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">Class Teacher:</td>
                        <td style="border: 1px solid black; padding: 5px;">Teacher Jothi</td>   
                        <td style="border: 1px solid black; padding: 5px;">Cards:</td>
                        <td style="border: 1px solid black; padding: 5px;">/</td>
                        <td style="border: 1px solid black; padding: 5px;">Reader:</td>
                        <td style="border: 1px solid black; padding: 5px;">W / M / W</td>
                    </tr>
                </table>
                <br/> <!-- Add space between students -->
            `;
        });
        content += '<br/>'; // Add space between classes
    }

    const blob = new Blob([content], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'report_cards.docx';
    link.click();
});
updateStudentList();