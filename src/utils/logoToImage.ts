export const generateLogoImage = async (format: 'png' | 'svg' = 'png'): Promise<string> => {
  // Создаём временный div с точно таким же стилем как в Header
  const logoElement = document.createElement('div');
  logoElement.innerHTML = `
    <span style="
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      font-weight: bold;
      font-size: 48px;
      background: linear-gradient(to right, hsl(262.1, 83.3%, 57.8%), hsl(263, 70%, 50.4%), hsl(262.1, 83.3%, 57.8%));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    ">
      Work<span style="
        background: none;
        -webkit-text-fill-color: hsl(262.1, 83.3%, 57.8%);
        color: hsl(262.1, 83.3%, 57.8%);
      ">4</span>Studio
    </span>
  `;
  
  // Добавляем в DOM временно для измерения
  logoElement.style.position = 'absolute';
  logoElement.style.top = '-9999px';
  logoElement.style.left = '-9999px';
  logoElement.style.padding = '20px';
  logoElement.style.backgroundColor = 'transparent';
  document.body.appendChild(logoElement);
  
  // Получаем размеры
  const rect = logoElement.getBoundingClientRect();
  
  if (format === 'svg') {
    // Создаём SVG с точными стилями
    const svg = `
      <svg width="${Math.ceil(rect.width)}" height="${Math.ceil(rect.height)}" viewBox="0 0 ${Math.ceil(rect.width)} ${Math.ceil(rect.height)}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:hsl(262.1, 83.3%, 57.8%);stop-opacity:1" />
            <stop offset="50%" style="stop-color:hsl(263, 70%, 50.4%);stop-opacity:1" />
            <stop offset="100%" style="stop-color:hsl(262.1, 83.3%, 57.8%);stop-opacity:1" />
          </linearGradient>
        </defs>
        <text x="20" y="${rect.height/2 + 16}" 
              font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" 
              font-weight="bold" 
              font-size="48" 
              fill="url(#logoGradient)">Work</text>
        <text x="160" y="${rect.height/2 + 16}" 
              font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" 
              font-weight="bold" 
              font-size="48" 
              fill="hsl(262.1, 83.3%, 57.8%)">4</text>
        <text x="190" y="${rect.height/2 + 16}" 
              font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" 
              font-weight="bold" 
              font-size="48" 
              fill="url(#logoGradient)">Studio</text>
      </svg>
    `;
    
    document.body.removeChild(logoElement);
    
    // Возвращаем data URL для SVG
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }
  
  // Для PNG используем html2canvas библиотеку (если установлена)
  // Или создаём canvas вручную
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    document.body.removeChild(logoElement);
    throw new Error('Canvas не поддерживается');
  }
  
  canvas.width = Math.ceil(rect.width);
  canvas.height = Math.ceil(rect.height);
  
  // Очищаем canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Устанавливаем шрифт
  ctx.font = 'bold 48px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  
  // Создаём градиент для "Work" и "Studio"
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, 'hsl(262.1, 83.3%, 57.8%)');
  gradient.addColorStop(0.5, 'hsl(263, 70%, 50.4%)');
  gradient.addColorStop(1, 'hsl(262.1, 83.3%, 57.8%)');
  
  // Рисуем "Work"
  ctx.fillStyle = gradient;
  ctx.fillText('Work', 20, canvas.height / 2);
  
  // Рисуем "4" 
  ctx.fillStyle = 'hsl(262.1, 83.3%, 57.8%)';
  ctx.fillText('4', 160, canvas.height / 2);
  
  // Рисуем "Studio"
  ctx.fillStyle = gradient;
  ctx.fillText('Studio', 190, canvas.height / 2);
  
  document.body.removeChild(logoElement);
  
  return canvas.toDataURL('image/png');
};

export const downloadLogo = async (format: 'png' | 'svg' = 'png') => {
  try {
    const dataUrl = await generateLogoImage(format);
    
    const link = document.createElement('a');
    link.download = `Work4Studio-logo.${format}`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Ошибка генерации логотипа:', error);
  }
};