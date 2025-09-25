#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

class SimpleAPIPageSpeedChecker {
  constructor() {
    // Naudosime tiesioginį API raktą iš Service Account
    this.apiKey = 'AIzaSyBxH8xK9L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6'; // Placeholder - reikės tikro rakto
  }

  async checkPageSpeed(url, strategy = 'mobile') {
    console.log(`🔍 Checking PageSpeed for: ${url} (${strategy})`);
    
    // Tiesioginis PageSpeed Insights API kvietimas
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${this.apiKey}&category=performance&category=best-practices&category=accessibility&category=seo`;
    
    return new Promise((resolve, reject) => {
      const request = https.get(apiUrl, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (result.error) {
              console.log('❌ API Error:', result.error.message);
              reject(new Error(result.error.message));
              return;
            }
            
            const scores = this.extractScores(result);
            resolve(scores);
            
          } catch (error) {
            reject(error);
          }
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.setTimeout(30000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
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
      timestamp: new Date().toISOString(),
      url: data.lighthouseResult?.requestedUrl || 'unknown'
    };
  }

  getScoreEmoji(score) {
    if (score >= 90) return '🟢';
    if (score >= 50) return '🟡';
    return '🔴';
  }

  displayResults(scores, strategy) {
    console.log(`\n📊 PAGEspeed INSIGHTS RESULTS (${strategy.toUpperCase()})`);
    console.log('=' .repeat(50));
    
    const categories = [
      { key: 'performance', name: 'Performance' },
      { key: 'bestPractices', name: 'Best Practices' },
      { key: 'accessibility', name: 'Accessibility' },
      { key: 'seo', name: 'SEO' }
    ];

    categories.forEach(category => {
      const score = scores[category.key];
      if (score === null) return;
      
      const scoreNum = Math.round(score * 100);
      const emoji = this.getScoreEmoji(scoreNum);
      
      console.log(`${emoji} ${category.name}: ${scoreNum}/100`);
    });

    console.log(`\n⏰ Checked at: ${scores.timestamp}`);
    console.log(`🌐 URL: ${scores.url}`);
  }

  showManualInstructions(url) {
    console.log('\n🔧 MANUAL PAGEspeed INSIGHTS CHECK:');
    console.log('=' .repeat(50));
    console.log('📱 MOBILE CHECK:');
    console.log(`🔗 https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}&form_factor=mobile`);
    console.log('\n💻 DESKTOP CHECK:');
    console.log(`🔗 https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}&form_factor=desktop`);
    console.log('\n💡 TIP: Manual check gives same results as API!');
  }

  async checkWithFallback(url) {
    try {
      console.log('🚀 Trying API first...');
      await this.checkPageSpeed(url, 'mobile');
      await this.checkPageSpeed(url, 'desktop');
    } catch (error) {
      console.log('\n🔄 API failed, showing manual method...');
      this.showManualInstructions(url);
      
      // Show current Lighthouse results
      console.log('\n📊 CURRENT LIGHTHOUSE RESULTS:');
      try {
        const lighthouseData = JSON.parse(fs.readFileSync('lighthouse-current.json', 'utf8'));
        const perf = lighthouseData.categories?.performance;
        if (perf) {
          const score = Math.round(perf.score * 100);
          console.log(`🟢 Performance: ${score}/100 (from Lighthouse CLI)`);
        }
      } catch (e) {
        console.log('❌ No Lighthouse data found');
      }
    }
  }
}

// CLI usage
if (require.main === module) {
  const url = process.argv[2] || 'https://pique-unique.vercel.app';
  const checker = new SimpleAPIPageSpeedChecker();
  checker.checkWithFallback(url).catch(console.error);
}

module.exports = SimpleAPIPageSpeedChecker;
