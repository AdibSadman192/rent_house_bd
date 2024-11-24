const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

class FileAnalyzer {
  constructor(options = {}) {
    this.scriptPath = path.join(__dirname, 'analyze-files.ps1');
    this.options = {
      verbose: false,
      ...options
    };
  }

  /**
   * Run file analysis
   * @param {Object} params Analysis parameters
   * @param {string} params.path Directory path to analyze
   * @param {string} params.pattern File pattern to match
   * @param {string} params.search Text to search for
   * @returns {Promise<Object>} Analysis results
   */
  async analyze({ path = '.', pattern = '*.*', search = '' } = {}) {
    try {
      // Ensure the PowerShell script exists
      await fs.access(this.scriptPath);

      // Build PowerShell command
      const command = `powershell.exe -ExecutionPolicy Bypass -File "${this.scriptPath}" -Path "${path}" -SearchPattern "${pattern}" ${search ? `-TextSearch "${search}"` : ''} ${this.options.verbose ? '-Verbose' : ''}`;

      return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout, stderr) => {
          if (error) {
            console.error('Error executing PowerShell script:', error);
            reject(error);
            return;
          }

          try {
            // Read the results file
            const resultsPath = path.join(path, 'file-analysis-results.json');
            const resultsJson = await fs.readFile(resultsPath, 'utf8');
            const results = JSON.parse(resultsJson);

            // Read the log file
            const logPath = path.join(path, 'file-analysis.log');
            const log = await fs.readFile(logPath, 'utf8');

            resolve({
              results,
              log,
              stdout: stdout.toString(),
              stderr: stderr.toString()
            });
          } catch (readError) {
            console.error('Error reading analysis results:', readError);
            reject(readError);
          }
        });
      });
    } catch (error) {
      console.error('Error in file analysis:', error);
      throw error;
    }
  }

  /**
   * Check specific file access and encoding
   * @param {string} filePath Path to the file
   * @returns {Promise<Object>} File analysis results
   */
  async checkFile(filePath) {
    return this.analyze({
      path: path.dirname(filePath),
      pattern: path.basename(filePath)
    });
  }

  /**
   * Search for text in files
   * @param {string} searchText Text to search for
   * @param {string} directory Directory to search in
   * @param {string} filePattern File pattern to match
   * @returns {Promise<Object>} Search results
   */
  async searchFiles(searchText, directory = '.', filePattern = '*.*') {
    return this.analyze({
      path: directory,
      pattern: filePattern,
      search: searchText
    });
  }

  /**
   * Get common file issues
   * @param {Object} results Analysis results
   * @returns {Object} Common issues found
   */
  static getCommonIssues(results) {
    const issues = {
      accessDenied: [],
      encodingIssues: [],
      searchFailures: [],
      recommendations: []
    };

    results.FileDetails.forEach(file => {
      // Check access issues
      if (!file.AccessCheck.Success) {
        issues.accessDenied.push({
          file: file.Path,
          error: file.AccessCheck.Error
        });
      }

      // Check encoding issues
      if (file.Encoding === 'Unknown' || file.Encoding.includes('UTF-16')) {
        issues.encodingIssues.push({
          file: file.Path,
          encoding: file.Encoding
        });
      }

      // Check search issues
      if (file.SearchResults && !file.SearchResults.Success) {
        issues.searchFailures.push({
          file: file.Path,
          error: file.SearchResults.Error
        });
      }
    });

    // Generate recommendations
    if (issues.accessDenied.length > 0) {
      issues.recommendations.push('Check file permissions and run as administrator if needed');
    }
    if (issues.encodingIssues.length > 0) {
      issues.recommendations.push('Consider converting files to UTF-8 encoding');
    }
    if (issues.searchFailures.length > 0) {
      issues.recommendations.push('Verify file formats and try searching with different encoding');
    }

    return issues;
  }
}

module.exports = FileAnalyzer;
