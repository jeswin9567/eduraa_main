const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');

// Function to update CSV with quiz results
const updatePerformanceCSV = async (quizData) => {
    try {
        const csvDir = path.join(__dirname, '../uploads/csv');
        if (!fs.existsSync(csvDir)){
            fs.mkdirSync(csvDir, { recursive: true });
        }

        const csvPath = path.join(csvDir, 'performance.csv');
        const isNewFile = !fs.existsSync(csvPath);
        let existingRecords = [];

        // Read existing records if file exists
        if (!isNewFile) {
            existingRecords = await new Promise((resolve, reject) => {
                const records = [];
                fs.createReadStream(csvPath)
                    .pipe(csv())
                    .on('data', (data) => records.push(data))
                    .on('end', () => resolve(records))
                    .on('error', reject);
            });

            // Remove existing record if same email, title AND description exists
            existingRecords = existingRecords.filter(record => 
                !(record.email === quizData.email && 
                  record.topic === quizData.topic && 
                  record.description === quizData.description)
            );
        }

        // Add the new record
        existingRecords.push({
            email: quizData.email,
            subject: quizData.subject,
            topic: quizData.topic,
            description: quizData.description,
            percentage: quizData.percentage.toString(),
            attempts: quizData.attempts.toString(),
            score: quizData.score.toString(),
            totalMarks: quizData.totalMarks.toString()
        });

        // Write all records back to CSV
        const csvWriter = createCsvWriter({
            path: csvPath,
            header: [
                {id: 'email', title: 'email'},
                {id: 'subject', title: 'subject'},
                {id: 'topic', title: 'topic'},
                {id: 'description', title: 'description'},
                {id: 'percentage', title: 'percentage'},
                {id: 'attempts', title: 'attempts'},
                {id: 'score', title: 'score'},
                {id: 'totalMarks', title: 'totalMarks'}
            ]
        });

        await csvWriter.writeRecords(existingRecords);
        console.log('CSV updated at:', csvPath);
    } catch (error) {
        console.error('Error updating CSV:', error);
        throw error; // Re-throw to handle in the route
    }
};

// Function to generate initial sample CSV
const generateSampleCSV = () => {
    const headers = ['email', 'subject', 'topic', 'description', 'percentage', 'attempts', 'score', 'totalMarks'];
    const data = [
        ['user@example.com', 'Mathematics', 'Algebra', 'Basic Algebra', '85', '1', '17', '20'],
        ['user@example.com', 'Mathematics', 'Calculus', 'Derivatives', '75', '2', '15', '20'],
        ['user@example.com', 'Physics', 'Mechanics', 'Newton Laws', '90', '1', '18', '20'],
        ['user@example.com', 'Chemistry', 'Organic', 'Basic Organic', '70', '1', '14', '20']
    ];

    const csvContent = [
        headers.join(','),
        ...data.map(row => row.join(','))
    ].join('\n');

    const filePath = path.join(__dirname, '../uploads/csv', `performance_${Date.now()}.csv`);
    fs.writeFileSync(filePath, csvContent);
    console.log('Sample CSV file created at:', filePath);
};

module.exports = {
    generateSampleCSV,
    updatePerformanceCSV
}; 