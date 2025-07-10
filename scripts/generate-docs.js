const fs = require('fs');
const path = require('path');

/**
 * BrainSAIT Documentation Generator
 * Generates bilingual documentation for healthcare AI projects
 */
class BrainSAITDocsGenerator {
  constructor() {
    this.docsPath = './docs';
    this.templates = {
      en: './templates/docs-template-en.md',
      ar: './templates/docs-template-ar.md'
    };
  }

  async generateFromIssue(issueData) {
    const contexts = {
      healthcare: 'BrainSAIT healthcare AI documentation',
      automation: 'BrainSAIT automation workflow documentation',
      infrastructure: 'BrainSAIT infrastructure and DevOps documentation',
      education: 'BrainSAIT educational content pipeline documentation'
    };

    const context = this.detectContext(issueData.title, issueData.body);
    
    // Generate English documentation
    const englishDoc = await this.generateDoc(issueData, 'en', contexts[context]);
    
    // Generate Arabic documentation
    const arabicDoc = await this.generateDoc(issueData, 'ar', contexts[context]);
    
    // Save both versions
    await this.saveBilingualDocs(issueData.number, englishDoc, arabicDoc);
    
    return { english: englishDoc, arabic: arabicDoc };
  }

  async generateDoc(issueData, language, context) {
    const isArabic = language === 'ar';
    
    // Simplified documentation generation without OpenAI dependency
    const template = this.getTemplate(language);
    
    const doc = template
      .replace('{TITLE}', issueData.title)
      .replace('{TITLE_AR}', this.translateTitle(issueData.title))
      .replace('{OVERVIEW_CONTENT}', this.generateOverview(issueData, language))
      .replace('{OVERVIEW_CONTENT_AR}', this.generateOverview(issueData, 'ar'))
      .replace('{IMPLEMENTATION_STEPS}', this.generateImplementationSteps(issueData, language))
      .replace('{IMPLEMENTATION_STEPS_AR}', this.generateImplementationSteps(issueData, 'ar'))
      .replace('{SERVICE_CONFIGURATION}', this.generateServiceConfig(issueData, language))
      .replace('{SERVICE_CONFIGURATION_AR}', this.generateServiceConfig(issueData, 'ar'))
      .replace('{DEPLOYMENT_STEPS}', this.generateDeploymentSteps(issueData, language))
      .replace('{DEPLOYMENT_STEPS_AR}', this.generateDeploymentSteps(issueData, 'ar'))
      .replace('{TIMESTAMP}', new Date().toISOString())
      .replace('{VERSION}', '1.0.0');

    return doc;
  }

  getTemplate(language) {
    const templatePath = this.templates[language];
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }
    
    // Return default template if file doesn't exist
    return language === 'ar' ? this.getDefaultArabicTemplate() : this.getDefaultEnglishTemplate();
  }

  getDefaultEnglishTemplate() {
    return `# {TITLE}

## Overview
{OVERVIEW_CONTENT}

## Implementation
{IMPLEMENTATION_STEPS}

## Configuration
{SERVICE_CONFIGURATION}

## Deployment
{DEPLOYMENT_STEPS}

---
Last Updated: {TIMESTAMP}
Version: {VERSION}
`;
  }

  getDefaultArabicTemplate() {
    return `# {TITLE_AR}

## نظرة عامة
{OVERVIEW_CONTENT_AR}

## التطبيق
{IMPLEMENTATION_STEPS_AR}

## التكوين
{SERVICE_CONFIGURATION_AR}

## النشر
{DEPLOYMENT_STEPS_AR}

---
آخر تحديث: {TIMESTAMP}
الإصدار: {VERSION}
`;
  }

  translateTitle(title) {
    // Simple title translation mapping
    const translations = {
      'healthcare': 'الرعاية الصحية',
      'automation': 'الأتمتة',
      'infrastructure': 'البنية التحتية',
      'education': 'التعليم',
      'feature': 'ميزة',
      'enhancement': 'تحسين',
      'workflow': 'سير العمل'
    };
    
    let arabicTitle = title.toLowerCase();
    Object.entries(translations).forEach(([en, ar]) => {
      arabicTitle = arabicTitle.replace(new RegExp(en, 'gi'), ar);
    });
    
    return arabicTitle;
  }

  generateOverview(issueData, language) {
    if (language === 'ar') {
      return `هذا المشروع جزء من منصة BrainSAIT للذكاء الاصطناعي في الرعاية الصحية.
      
الميزات الرئيسية:
- دعم ثنائي اللغة (العربية/الإنجليزية)
- الامتثال لمعايير HIPAA
- معمارية سحابية مع دعم Raspberry Pi`;
    }
    
    return `This project is part of the BrainSAIT healthcare AI platform.

Key Features:
- Bilingual support (Arabic/English)
- HIPAA compliance
- Cloud-native architecture with Raspberry Pi support`;
  }

  generateImplementationSteps(issueData, language) {
    if (language === 'ar') {
      return `### الخطوات:
1. إعداد البيئة التطويرية
2. تكوين قاعدة البيانات
3. تطبيق واجهات برمجة التطبيقات
4. إضافة الدعم العربي
5. اختبار النظام`;
    }
    
    return `### Steps:
1. Set up development environment
2. Configure database
3. Implement APIs
4. Add Arabic support
5. Test the system`;
  }

  generateServiceConfig(issueData, language) {
    if (language === 'ar') {
      return `### تكوين الخدمات:
- Docker Compose للحاويات
- إعدادات Cloudflare
- تكوين قاعدة البيانات
- إعدادات الأمان`;
    }
    
    return `### Service Configuration:
- Docker Compose for containers
- Cloudflare settings
- Database configuration
- Security settings`;
  }

  generateDeploymentSteps(issueData, language) {
    if (language === 'ar') {
      return `### خطوات النشر:
1. بناء الحاويات
2. نشر على Raspberry Pi
3. تكوين Cloudflare Tunnel
4. اختبار الوصول
5. مراقبة الأداء`;
    }
    
    return `### Deployment Steps:
1. Build containers
2. Deploy to Raspberry Pi
3. Configure Cloudflare Tunnel
4. Test access
5. Monitor performance`;
  }

  detectContext(title, body) {
    const keywords = {
      healthcare: ['patient', 'medical', 'hipaa', 'clinical', 'diagnosis'],
      automation: ['workflow', 'n8n', 'zapier', 'automation', 'pipeline'],
      infrastructure: ['docker', 'kubernetes', 'deploy', 'server', 'api'],
      education: ['course', 'learning', 'video', 'content', 'lms']
    };

    const text = (title + ' ' + body).toLowerCase();
    
    for (const [context, words] of Object.entries(keywords)) {
      if (words.some(word => text.includes(word))) {
        return context;
      }
    }
    
    return 'healthcare'; // Default context
  }

  async saveBilingualDocs(issueNumber, englishDoc, arabicDoc) {
    const baseDir = path.join(this.docsPath, `issue-${issueNumber}`);
    
    // Create directories
    fs.mkdirSync(path.join(baseDir, 'en'), { recursive: true });
    fs.mkdirSync(path.join(baseDir, 'ar'), { recursive: true });
    
    // Save English version
    fs.writeFileSync(
      path.join(baseDir, 'en', 'README.md'),
      englishDoc
    );
    
    // Save Arabic version  
    fs.writeFileSync(
      path.join(baseDir, 'ar', 'README.md'),
      arabicDoc
    );
    
    // Update GitBook summary
    await this.updateSummary(issueNumber, englishDoc, arabicDoc);
  }

  async updateSummary(issueNumber, englishDoc, arabicDoc) {
    const englishTitle = this.extractTitle(englishDoc);
    const arabicTitle = this.extractTitle(arabicDoc);
    
    // Update English SUMMARY.md
    const enSummaryPath = './docs/en/SUMMARY.md';
    if (fs.existsSync(enSummaryPath)) {
      const enSummary = fs.readFileSync(enSummaryPath, 'utf8');
      const newEnSummary = enSummary + `\n* [${englishTitle}](issue-${issueNumber}/en/README.md)`;
      fs.writeFileSync(enSummaryPath, newEnSummary);
    }
    
    // Update Arabic SUMMARY.md
    const arSummaryPath = './docs/ar/SUMMARY.md';
    if (fs.existsSync(arSummaryPath)) {
      const arSummary = fs.readFileSync(arSummaryPath, 'utf8');
      const newArSummary = arSummary + `\n* [${arabicTitle}](issue-${issueNumber}/ar/README.md)`;
      fs.writeFileSync(arSummaryPath, newArSummary);
    }
  }

  extractTitle(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1] : 'Untitled';
  }
}

// Export for use in GitHub Actions
module.exports = BrainSAITDocsGenerator;

// CLI usage
if (require.main === module) {
  const generator = new BrainSAITDocsGenerator();
  
  // Get issue data from GitHub context
  const issueData = {
    number: process.env.GITHUB_ISSUE_NUMBER || '1',
    title: process.env.GITHUB_ISSUE_TITLE || 'Sample Issue',
    body: process.env.GITHUB_ISSUE_BODY || 'Sample issue description'
  };
  
  generator.generateFromIssue(issueData)
    .then(result => {
      console.log('Documentation generated successfully');
      console.log('English docs:', result.english.length, 'characters');
      console.log('Arabic docs:', result.arabic.length, 'characters');
    })
    .catch(console.error);
}