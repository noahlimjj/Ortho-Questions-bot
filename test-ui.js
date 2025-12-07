#!/usr/bin/env node

/**
 * Simple UI Test Script
 * Tests the category filtering functionality without browser automation
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8000';

console.log('🧪 Starting Ortho Quiz UI Tests\n');

// Test 1: Server is running
async function testServerRunning() {
    return new Promise((resolve) => {
        http.get(BASE_URL, (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Test 1: Server is running on port 8000');
                resolve(true);
            } else {
                console.log('❌ Test 1: Server returned status', res.statusCode);
                resolve(false);
            }
        }).on('error', (err) => {
            console.log('❌ Test 1: Server not accessible', err.message);
            console.log('   Run: python3 -m http.server 8000');
            resolve(false);
        });
    });
}

// Test 2: CSV file exists and has correct format
async function testCSVFile() {
    return new Promise((resolve) => {
        http.get(`${BASE_URL}/ortho_questions.csv`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const lines = data.split('\n').filter(l => l.trim());
                const header = lines[0];
                const questionCount = lines.length - 1; // Subtract header

                const hasCategory = header.includes('Category');
                const correctCount = questionCount === 336;

                if (hasCategory && correctCount) {
                    console.log(`✅ Test 2: CSV file valid (${questionCount} questions, Category column exists)`);
                    resolve(true);
                } else {
                    console.log(`❌ Test 2: CSV issues`);
                    console.log(`   Has Category column: ${hasCategory}`);
                    console.log(`   Question count: ${questionCount} (expected 336)`);
                    resolve(false);
                }
            });
        }).on('error', (err) => {
            console.log('❌ Test 2: Could not load CSV', err.message);
            resolve(false);
        });
    });
}

// Test 3: Index.html has category dropdown
async function testIndexHTML() {
    return new Promise((resolve) => {
        http.get(`${BASE_URL}/index.html`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const hasDropdown = data.includes('id="category-select"');
                const hasAllCategories = data.includes('All Categories');
                const hasHandWrist = data.includes('Hand and Wrist');
                const hasShoulder = data.includes('Shoulder');

                if (hasDropdown && hasAllCategories && hasHandWrist && hasShoulder) {
                    console.log('✅ Test 3: index.html has category filter dropdown');
                    resolve(true);
                } else {
                    console.log('❌ Test 3: index.html missing category elements');
                    resolve(false);
                }
            });
        }).on('error', (err) => {
            console.log('❌ Test 3: Could not load index.html', err.message);
            resolve(false);
        });
    });
}

// Test 4: script.js has category filtering logic
async function testScriptJS() {
    return new Promise((resolve) => {
        http.get(`${BASE_URL}/script.js`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const hasCategoryVar = data.includes('selectedCategory');
                const hasCategoryIndex = data.includes('categoryIndex');
                const hasFilterLogic = data.includes('Filter questions by category');
                const hasCategorySelect = data.includes('category-select');

                if (hasCategoryVar && hasCategoryIndex && hasFilterLogic && hasCategorySelect) {
                    console.log('✅ Test 4: script.js has category filtering logic');
                    resolve(true);
                } else {
                    console.log('❌ Test 4: script.js missing category filtering code');
                    console.log(`   Has selectedCategory: ${hasCategoryVar}`);
                    console.log(`   Has categoryIndex: ${hasCategoryIndex}`);
                    console.log(`   Has filter logic: ${hasFilterLogic}`);
                    resolve(false);
                }
            });
        }).on('error', (err) => {
            console.log('❌ Test 4: Could not load script.js', err.message);
            resolve(false);
        });
    });
}

// Test 5: Demo page exists
async function testDemoPage() {
    return new Promise((resolve) => {
        http.get(`${BASE_URL}/category_demo.html`, (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Test 5: category_demo.html exists');
                resolve(true);
            } else {
                console.log('❌ Test 5: category_demo.html not found');
                resolve(false);
            }
        }).on('error', (err) => {
            console.log('❌ Test 5: Could not load category_demo.html', err.message);
            resolve(false);
        });
    });
}

// Test 6: Test suite page exists
async function testTestPage() {
    return new Promise((resolve) => {
        http.get(`${BASE_URL}/test_category_filter.html`, (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Test 6: test_category_filter.html exists');
                resolve(true);
            } else {
                console.log('❌ Test 6: test_category_filter.html not found');
                resolve(false);
            }
        }).on('error', (err) => {
            console.log('❌ Test 6: Could not load test_category_filter.html', err.message);
            resolve(false);
        });
    });
}

// Run all tests
async function runAllTests() {
    const results = [];

    results.push(await testServerRunning());
    results.push(await testCSVFile());
    results.push(await testIndexHTML());
    results.push(await testScriptJS());
    results.push(await testDemoPage());
    results.push(await testTestPage());

    const passed = results.filter(r => r).length;
    const total = results.length;

    console.log('\n' + '='.repeat(50));
    console.log(`📊 Test Results: ${passed}/${total} tests passed`);
    console.log('='.repeat(50));

    if (passed === total) {
        console.log('\n🎉 All tests passed! Ready for manual testing.');
        console.log('\n📝 Next steps:');
        console.log('   1. Open http://localhost:8000/category_demo.html');
        console.log('   2. Open http://localhost:8000/index.html');
        console.log('   3. Test category filtering manually');
        console.log('   4. Run: http://localhost:8000/test_category_filter.html');
    } else {
        console.log('\n⚠️  Some tests failed. Check the errors above.');
        console.log('\n🔧 Troubleshooting:');
        console.log('   - Make sure server is running: python3 -m http.server 8000');
        console.log('   - Check that all files were created correctly');
        console.log('   - Review the implementation steps');
    }

    console.log('');
}

// Run the tests
runAllTests().catch(console.error);
