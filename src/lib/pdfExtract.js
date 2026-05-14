// PDF.js をCDNから動的ロードしてテキスト抽出
export async function extractTextFromPDF(file) {
  // PDF.jsがまだロードされていなければ動的に読み込む
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
      script.type = 'module';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    // ESモジュール版は window に入らないので別アプローチ
  }

  // ArrayBufferとして読み込む
  const arrayBuffer = await file.arrayBuffer();

  // CDN版PDF.jsをimport()で動的インポート
  const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}
