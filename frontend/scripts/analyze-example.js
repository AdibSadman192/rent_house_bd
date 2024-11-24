const FileAnalyzer = require('./fileAnalyzer');

async function runAnalysis() {
  try {
    const analyzer = new FileAnalyzer();

    console.log('Running file analysis...');

    // Example 1: Analyze all JavaScript files
    const jsAnalysis = await analyzer.analyze({
      path: '.',  // Changed from '../' to '.'
      pattern: '*.js',
    });
    
    // Example 2: Search for specific text
    const searchResults = await analyzer.searchFiles(
      'import.*from',  // Search for import statements
      'components',    // In components directory
      '*.js'          // Only JavaScript files
    );

    // Example 3: Check specific file
    const fileCheck = await analyzer.checkFile('components/auth/ProtectedRoute.js');

    // Get common issues
    const issues = FileAnalyzer.getCommonIssues(jsAnalysis.results);

    // Output results
    console.log('\nAnalysis Results:');
    console.log('----------------');
    console.log(`Total Files: ${jsAnalysis.results.TotalFiles}`);
    console.log(`Accessible: ${jsAnalysis.results.AccessibleFiles}`);
    console.log(`Inaccessible: ${jsAnalysis.results.InaccessibleFiles}`);
    
    console.log('\nCommon Issues:');
    console.log('--------------');
    if (issues.accessDenied.length > 0) {
      console.log('Access Denied Issues:', issues.accessDenied.length);
      issues.accessDenied.forEach(issue => 
        console.log(`  - ${issue.file}: ${issue.error}`)
      );
    }

    if (issues.encodingIssues.length > 0) {
      console.log('Encoding Issues:', issues.encodingIssues.length);
      issues.encodingIssues.forEach(issue => 
        console.log(`  - ${issue.file}: ${issue.encoding}`)
      );
    }

    console.log('\nRecommendations:');
    console.log('---------------');
    issues.recommendations.forEach(rec => console.log(`- ${rec}`));

  } catch (error) {
    console.error('Error running analysis:', error);
  }
}

// Run the analysis
runAnalysis();
