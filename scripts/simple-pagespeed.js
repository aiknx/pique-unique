#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

// Simple PageSpeed checker without API key (limited requests)
class SimplePageSpeedChecker {
  constructor() {
    this.baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  }

  async checkPageSpeed(url, strategy = 'mobile') {
    const params = new URLSearchParams({
      url: url,
      strategy: strategy,
      category: 'performance',
      category: 'best-practices',
      category: 'accessibility', 
      category: 'seo'
    });

    const apiUrl = `${this.baseUrl}?${params.toString()}`;
    
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
              if (result.error.message.includes('Quota exceeded')) {
                console.log('💡 Tip: Get API key from Google Cloud Console to avoid quota limits');
                console.log('🔗 https://console.cloud.google.com/apis/credentials');
              }
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

      // Timeout after 30 seconds
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

  async checkAndDisplay(url) {
    console.log(`🔍 Checking PageSpeed for: ${url}`);
    console.log('⏳ This may take 30-60 seconds...\n');
    
    try {
      // Check both mobile and desktop
      const [mobileResult, desktopResult] = await Promise.allSettled([
        this.checkPageSpeed(url, 'mobile'),
        this.checkPageSpeed(url, 'desktop')
      ]);

      console.log('\n📊 PAGEspeed INSIGHTS RESULTS');
      console.log('=' .repeat(50));

      if (mobileResult.status === 'fulfilled') {
        const mobile = mobileResult.value;
        console.log('\n📱 MOBILE RESULTS:');
        this.displayScores(mobile);
        
        // Save mobile results
        fs.writeFileSync('pagespeed-mobile.json', JSON.stringify(mobile, null, 2));
      } else {
        console.log('\n📱 MOBILE: ❌ Failed -', mobileResult.reason.message);
      }

      if (desktopResult.status === 'fulfilled') {
        const desktop = desktopResult.value;
        console.log('\n💻 DESKTOP RESULTS:');
        this.displayScores(desktop);
        
        // Save desktop results
        fs.writeFileSync('pagespeed-desktop.json', JSON.stringify(desktop, null, 2));
      } else {
        console.log('\n💻 DESKTOP: ❌ Failed -', desktopResult.reason.message);
      }

      console.log('\n⏰ Checked at:', new Date().toISOString());
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      
      if (error.message.includes('Quota exceeded')) {
        console.log('\n💡 SOLUTIONS:');
        console.log('1. Wait 24 hours for quota reset');
        console.log('2. Get API key: https://console.cloud.google.com/apis/credentials');
        console.log('3. Use manual check: https://pagespeed.web.dev/');
      }
    }
  }

  displayScores(data) {
    const categories = [
      { key: 'performance', name: 'Performance' },
      { key: 'bestPractices', name: 'Best Practices' },
      { key: 'accessibility', name: 'Accessibility' },
      { key: 'seo', name: 'SEO' }
    ];

    categories.forEach(category => {
      const score = data[category.key];
      if (score === null) return;
      
      const scoreNum = Math.round(score * 100);
      const emoji = this.getScoreEmoji(scoreNum);
      
      console.log(`  ${emoji} ${category.name}: ${scoreNum}/100`);
    });
  }
}

// CLI usage
if (require.main === module) {
  const url = process.argv[2] || 'https://pique-unique.vercel.app';
  const checker = new SimplePageSpeedChecker();
  checker.checkAndDisplay(url).catch(console.error);
}

module.exports = SimplePageSpeedChecker;


