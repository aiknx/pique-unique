#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

// PageSpeed Insights API wrapper
class PageSpeedChecker {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  }

  async checkPageSpeed(url, strategy = 'mobile') {
    const params = new URLSearchParams({
      url: url,
      strategy: strategy,
      category: 'performance',
      category: 'best-practices'
    });

    if (this.apiKey) {
      params.append('key', this.apiKey);
    }

    const apiUrl = `${this.baseUrl}?${params.toString()}`;
    
    return new Promise((resolve, reject) => {
      https.get(apiUrl, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (result.error) {
              reject(new Error(`API Error: ${result.error.message}`));
              return;
            }
            
            const scores = this.extractScores(result);
            resolve(scores);
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
  }

  extractScores(data) {
    const categories = data.lighthouseResult?.categories;
    if (!categories) {
      throw new Error('No categories found in response');
    }

    return {
      performance: categories.performance?.score || null,
      bestPractices: categories['best-practices']?.score || null,
      accessibility: categories.accessibility?.score || null,
      seo: categories.seo?.score || null,
      timestamp: new Date().toISOString()
    };
  }

  async compareScores(url, beforeFile, afterFile) {
    console.log(`🔍 Checking PageSpeed for: ${url}`);
    
    try {
      const currentScores = await this.checkPageSpeed(url);
      
      let beforeScores = null;
      let afterScores = null;
      
      // Try to read previous results
      try {
        if (fs.existsSync(beforeFile)) {
          beforeScores = JSON.parse(fs.readFileSync(beforeFile, 'utf8'));
        }
      } catch (error) {
        console.log('⚠️  Could not read before scores');
      }
      
      try {
        if (fs.existsSync(afterFile)) {
          afterScores = JSON.parse(fs.readFileSync(afterFile, 'utf8'));
        }
      } catch (error) {
        console.log('⚠️  Could not read after scores');
      }

      // Save current results
      fs.writeFileSync('pagespeed-current.json', JSON.stringify(currentScores, null, 2));
      
      // Display results
      this.displayResults(currentScores, beforeScores, afterScores);
      
      return currentScores;
    } catch (error) {
      console.error('❌ Error checking PageSpeed:', error.message);
      return null;
    }
  }

  displayResults(current, before, after) {
    console.log('\n📊 PAGESPEED INSIGHTS RESULTS');
    console.log('=' .repeat(50));
    
    const categories = [
      { key: 'performance', name: 'Performance' },
      { key: 'bestPractices', name: 'Best Practices' },
      { key: 'accessibility', name: 'Accessibility' },
      { key: 'seo', name: 'SEO' }
    ];

    categories.forEach(category => {
      const currentScore = current[category.key];
      if (currentScore === null) return;
      
      const score = Math.round(currentScore * 100);
      const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
      
      console.log(`${emoji} ${category.name}: ${score}/100`);
      
      // Show comparison if available
      if (before && before[category.key] !== null) {
        const beforeScore = Math.round(before[category.key] * 100);
        const diff = score - beforeScore;
        const diffEmoji = diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️';
        console.log(`   Before: ${beforeScore}/100 (${diff > 0 ? '+' : ''}${diff}) ${diffEmoji}`);
      }
      
      if (after && after[category.key] !== null) {
        const afterScore = Math.round(after[category.key] * 100);
        const diff = score - afterScore;
        const diffEmoji = diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️';
        console.log(`   After:  ${afterScore}/100 (${diff > 0 ? '+' : ''}${diff}) ${diffEmoji}`);
      }
    });
    
    console.log('\n⏰ Checked at:', current.timestamp);
  }
}

// CLI usage
if (require.main === module) {
  const url = process.argv[2] || 'https://pique-unique.vercel.app';
  const apiKey = process.env.PAGESPEED_API_KEY || null;
  
  const checker = new PageSpeedChecker(apiKey);
  
  checker.compareScores(
    url,
    'pagespeed-before.json',
    'pagespeed-after.json'
  ).catch(console.error);
}

module.exports = PageSpeedChecker;
