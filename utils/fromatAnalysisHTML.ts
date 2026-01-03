export const formatAnalysisHTML = (analysis: string): string => {
    let formatted = analysis
        .replace(/```[\s\S]*?```/g, '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    
    formatted = formatted.replace(/^##\s+(.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2 text-primary">$1</h2>');
    formatted = formatted.replace(/^###\s+(.+)$/gm, '<h3 class="text-lg font-semibold mt-3 mb-1 text-secondary">$1</h3>');
    
    formatted = formatted.replace(/^\s*-\s+(.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
    formatted = formatted.replace(/(<li[^>]*>.*?<\/li>\n?)+/g, (match) => `<ul class="list-disc ml-6 mb-3">${match}</ul>`);
    
    formatted = formatted.replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
    formatted = formatted.replace(/(<li[^>]*>.*?<\/li>\n?){2,}/g, (match) => `<ol class="list-decimal ml-6 mb-3">${match}</ol>`);
    
    formatted = formatted.replace(/^\s*🚀\s*(.+)$/gm, '<div class="font-bold text-green-600 dark:text-green-400 mt-2">🚀 $1</div>');
    formatted = formatted.replace(/^\s*✅\s*(.+)$/gm, '<div class="font-bold text-green-600 dark:text-green-400">✅ $1</div>');
    formatted = formatted.replace(/^\s*⚠️\s*(.+)$/gm, '<div class="font-bold text-yellow-600 dark:text-yellow-400">⚠️ $1</div>');
    formatted = formatted.replace(/^\s*❌\s*(.+)$/gm, '<div class="font-bold text-red-600 dark:text-red-400">❌ $1</div>');
    formatted = formatted.replace(/^\s*💡\s*(.+)$/gm, '<div class="font-bold text-blue-600 dark:text-blue-400">💡 $1</div>');
    formatted = formatted.replace(/^\s*📊\s*(.+)$/gm, '<div class="font-bold text-purple-600 dark:text-purple-400">📊 $1</div>');
    
    formatted = formatted.replace(/\n{2,}/g, '</p><p>');
    formatted = formatted.replace(/^\s*([^<\n].+)$/gm, '<p class="mb-2">$1</p>');
    
    return formatted;
};