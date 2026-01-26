// ====================================
// HORADRIC AI - INTERNATIONALIZATION (i18n)
// ====================================

/**
 * Multi-language support module
 * Handles language detection, switching, and translation
 */

const i18n = {
    // Current language setting
    currentLanguage: 'en',
    
    // Supported languages
    supportedLanguages: {
        'en': 'English',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'pt': 'Português',
        'ru': 'Русский',
        'zh': '中文 (简体)',
        'ja': '日本語'
    },
    
    // Translation data structure
    translations: {
        en: {
            // Header & Navigation
            'app_title': 'Horadric AI',
            'app_subtitle': 'Diablo 4 Loot Analyzer',
            'app_description': 'AI-powered Diablo 4 loot analyzer - Identify and evaluate your items instantly with Google Gemini',
            'skip_to_content': 'Skip to content',
            
            // Main Content
            'how_it_works': 'How it works',
            'upload_image': 'Upload Image',
            'paste_description': 'Paste Description',
            'analyze_item': 'Analyze Item',
            'analyzing': 'Analyzing item...',
            'clear_analysis': 'Clear Analysis',
            'copy_analysis': 'Copy Analysis',
            'share_analysis': 'Share Analysis',
            
            // Results
            'analysis_results': 'Analysis Results',
            'item_analysis': 'Item Analysis',
            'rarity': 'Rarity',
            'estimated_price': 'Estimated Price',
            'value': 'Value',
            'recommendation': 'Recommendation',
            'sell': 'Sell',
            'keep': 'Keep',
            'upgrade': 'Upgrade',
            
            // UI Elements
            'settings': 'Settings',
            'language': 'Language',
            'about': 'About',
            'contact': 'Contact',
            'feedback': 'Feedback',
            'help': 'Help',
            'close': 'Close',
            'cancel': 'Cancel',
            'save': 'Save',
            'delete': 'Delete',
            'loading': 'Loading...',
            'error': 'Error',
            'success': 'Success',
            'warning': 'Warning',
            'info': 'Information',
            
            // Error Messages
            'error_loading': 'Error loading application',
            'error_analyzing': 'Error analyzing item. Please try again.',
            'error_no_image': 'Please select an image first',
            'error_invalid_image': 'Invalid image format',
            'error_no_description': 'Please paste an item description',
            'error_api_key': 'API key not configured',
            'error_offline': 'You appear to be offline',
            'error_generic': 'Something went wrong. Please try again.',
            
            // Features
            'price_tracking': 'Price Tracking',
            'item_history': 'Item History',
            'analytics': 'Analytics',
            'session_stats': 'Session Statistics',
            'total_scans': 'Total Scans',
            'session_cost': 'Session Cost',
            
            // Placeholders
            'search_placeholder': 'Search items...',
            'input_placeholder': 'Enter text here...',
            
            // Messages
            'welcome_message': 'Welcome to Horadric AI',
            'first_visit': 'This appears to be your first visit',
            'offline_message': 'You\'re currently offline. Some features may be limited.',
            'session_info': 'Session active',
            
            // Buttons & Actions
            'start': 'Start',
            'continue': 'Continue',
            'next': 'Next',
            'previous': 'Previous',
            'finish': 'Finish',
            'reset': 'Reset',
            'download': 'Download',
            'export': 'Export',
            'import': 'Import',
            
            // Data
            'no_data': 'No data available',
            'no_results': 'No results found',
            'empty_history': 'History is empty',
        },
        
        es: {
            'app_title': 'Horadric AI',
            'app_subtitle': 'Analizador de Botín de Diablo 4',
            'app_description': 'Analizador de botín de Diablo 4 impulsado por IA - Identifica y evalúa tus objetos al instante con Google Gemini',
            'skip_to_content': 'Saltar al contenido',
            'how_it_works': 'Cómo funciona',
            'upload_image': 'Cargar imagen',
            'paste_description': 'Pegar descripción',
            'analyze_item': 'Analizar objeto',
            'analyzing': 'Analizando objeto...',
            'clear_analysis': 'Borrar análisis',
            'copy_analysis': 'Copiar análisis',
            'share_analysis': 'Compartir análisis',
            'analysis_results': 'Resultados del análisis',
            'item_analysis': 'Análisis del artículo',
            'rarity': 'Rareza',
            'estimated_price': 'Precio estimado',
            'value': 'Valor',
            'recommendation': 'Recomendación',
            'sell': 'Vender',
            'keep': 'Mantener',
            'upgrade': 'Mejorar',
            'settings': 'Configuración',
            'language': 'Idioma',
            'about': 'Acerca de',
            'contact': 'Contacto',
            'feedback': 'Comentarios',
            'help': 'Ayuda',
            'close': 'Cerrar',
            'cancel': 'Cancelar',
            'save': 'Guardar',
            'delete': 'Eliminar',
            'loading': 'Cargando...',
            'error': 'Error',
            'success': 'Éxito',
            'warning': 'Advertencia',
            'info': 'Información',
            'error_loading': 'Error al cargar la aplicación',
            'error_analyzing': 'Error al analizar el objeto. Intenta de nuevo.',
            'error_no_image': 'Por favor selecciona una imagen primero',
            'error_invalid_image': 'Formato de imagen inválido',
            'error_no_description': 'Por favor pega una descripción del objeto',
            'error_api_key': 'Clave de API no configurada',
            'error_offline': 'Parece que estás desconectado',
            'error_generic': 'Algo salió mal. Intenta de nuevo.',
            'price_tracking': 'Seguimiento de precios',
            'item_history': 'Historial de objetos',
            'analytics': 'Análisis',
            'session_stats': 'Estadísticas de sesión',
            'total_scans': 'Escaneos totales',
            'session_cost': 'Costo de sesión',
            'search_placeholder': 'Buscar objetos...',
            'input_placeholder': 'Ingresa texto aquí...',
            'welcome_message': 'Bienvenido a Horadric AI',
            'first_visit': 'Esta parece ser tu primera visita',
            'offline_message': 'Estás desconectado. Algunas funciones pueden ser limitadas.',
            'session_info': 'Sesión activa',
            'start': 'Comenzar',
            'continue': 'Continuar',
            'next': 'Siguiente',
            'previous': 'Anterior',
            'finish': 'Finalizar',
            'reset': 'Reiniciar',
            'download': 'Descargar',
            'export': 'Exportar',
            'import': 'Importar',
            'no_data': 'No hay datos disponibles',
            'no_results': 'No se encontraron resultados',
            'empty_history': 'El historial está vacío',
        },
        
        fr: {
            'app_title': 'Horadric AI',
            'app_subtitle': 'Analyseur de Butin Diablo 4',
            'app_description': 'Analyseur de butin Diablo 4 alimenté par l\'IA - Identifiez et évaluez vos objets instantanément avec Google Gemini',
            'skip_to_content': 'Aller au contenu',
            'how_it_works': 'Comment ça marche',
            'upload_image': 'Télécharger une image',
            'paste_description': 'Coller la description',
            'analyze_item': 'Analyser l\'objet',
            'analyzing': 'Analyse de l\'objet...',
            'clear_analysis': 'Effacer l\'analyse',
            'copy_analysis': 'Copier l\'analyse',
            'share_analysis': 'Partager l\'analyse',
            'analysis_results': 'Résultats de l\'analyse',
            'item_analysis': 'Analyse de l\'article',
            'rarity': 'Rareté',
            'estimated_price': 'Prix estimé',
            'value': 'Valeur',
            'recommendation': 'Recommandation',
            'sell': 'Vendre',
            'keep': 'Garder',
            'upgrade': 'Améliorer',
            'settings': 'Paramètres',
            'language': 'Langue',
            'about': 'À propos',
            'contact': 'Contact',
            'feedback': 'Commentaires',
            'help': 'Aide',
            'close': 'Fermer',
            'cancel': 'Annuler',
            'save': 'Enregistrer',
            'delete': 'Supprimer',
            'loading': 'Chargement...',
            'error': 'Erreur',
            'success': 'Succès',
            'warning': 'Avertissement',
            'info': 'Information',
            'error_loading': 'Erreur lors du chargement de l\'application',
            'error_analyzing': 'Erreur lors de l\'analyse de l\'objet. Réessayez.',
            'error_no_image': 'Veuillez d\'abord sélectionner une image',
            'error_invalid_image': 'Format d\'image invalide',
            'error_no_description': 'Veuillez coller une description d\'objet',
            'error_api_key': 'Clé API non configurée',
            'error_offline': 'Vous semblez être hors ligne',
            'error_generic': 'Quelque chose s\'est mal passé. Réessayez.',
            'price_tracking': 'Suivi des prix',
            'item_history': 'Historique des articles',
            'analytics': 'Analyse',
            'session_stats': 'Statistiques de session',
            'total_scans': 'Analyses totales',
            'session_cost': 'Coût de la session',
            'search_placeholder': 'Rechercher des articles...',
            'input_placeholder': 'Entrez du texte ici...',
            'welcome_message': 'Bienvenue dans Horadric AI',
            'first_visit': 'C\'est apparemment votre première visite',
            'offline_message': 'Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.',
            'session_info': 'Session active',
            'start': 'Commencer',
            'continue': 'Continuer',
            'next': 'Suivant',
            'previous': 'Précédent',
            'finish': 'Terminer',
            'reset': 'Réinitialiser',
            'download': 'Télécharger',
            'export': 'Exporter',
            'import': 'Importer',
            'no_data': 'Aucune donnée disponible',
            'no_results': 'Aucun résultat trouvé',
            'empty_history': 'L\'historique est vide',
        },
        
        de: {
            'app_title': 'Horadric AI',
            'app_subtitle': 'Diablo 4 Loot-Analyzer',
            'app_description': 'KI-gestützter Diablo 4 Loot-Analyzer - Identifizieren und bewerten Sie Ihre Gegenstände sofort mit Google Gemini',
            'skip_to_content': 'Zum Inhalt springen',
            'how_it_works': 'Wie es funktioniert',
            'upload_image': 'Bild hochladen',
            'paste_description': 'Beschreibung einfügen',
            'analyze_item': 'Gegenstand analysieren',
            'analyzing': 'Gegenstand wird analysiert...',
            'clear_analysis': 'Analyse löschen',
            'copy_analysis': 'Analyse kopieren',
            'share_analysis': 'Analyse teilen',
            'analysis_results': 'Analyseergebnisse',
            'item_analysis': 'Gegenstandsanalyse',
            'rarity': 'Seltenheit',
            'estimated_price': 'Geschätzter Preis',
            'value': 'Wert',
            'recommendation': 'Empfehlung',
            'sell': 'Verkaufen',
            'keep': 'Behalten',
            'upgrade': 'Verbessern',
            'settings': 'Einstellungen',
            'language': 'Sprache',
            'about': 'Über',
            'contact': 'Kontakt',
            'feedback': 'Rückmeldung',
            'help': 'Hilfe',
            'close': 'Schließen',
            'cancel': 'Abbrechen',
            'save': 'Speichern',
            'delete': 'Löschen',
            'loading': 'Wird geladen...',
            'error': 'Fehler',
            'success': 'Erfolg',
            'warning': 'Warnung',
            'info': 'Information',
            'error_loading': 'Fehler beim Laden der Anwendung',
            'error_analyzing': 'Fehler beim Analysieren des Gegenstands. Bitte versuchen Sie es erneut.',
            'error_no_image': 'Bitte wählen Sie zuerst ein Bild',
            'error_invalid_image': 'Ungültiges Bildformat',
            'error_no_description': 'Bitte fügen Sie eine Gegenstandsbeschreibung ein',
            'error_api_key': 'API-Schlüssel nicht konfiguriert',
            'error_offline': 'Sie scheinen offline zu sein',
            'error_generic': 'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.',
            'price_tracking': 'Preisverfolgung',
            'item_history': 'Gegenstandsverlauf',
            'analytics': 'Analytik',
            'session_stats': 'Sitzungsstatistiken',
            'total_scans': 'Gesamtscans',
            'session_cost': 'Sitzungskosten',
            'search_placeholder': 'Gegenstände suchen...',
            'input_placeholder': 'Geben Sie hier Text ein...',
            'welcome_message': 'Willkommen bei Horadric AI',
            'first_visit': 'Dies scheint Ihr erster Besuch zu sein',
            'offline_message': 'Sie sind derzeit offline. Einige Funktionen könnten eingeschränkt sein.',
            'session_info': 'Sitzung aktiv',
            'start': 'Start',
            'continue': 'Fortfahren',
            'next': 'Nächste',
            'previous': 'Vorherige',
            'finish': 'Fertig',
            'reset': 'Zurücksetzen',
            'download': 'Herunterladen',
            'export': 'Exportieren',
            'import': 'Importieren',
            'no_data': 'Keine Daten verfügbar',
            'no_results': 'Keine Ergebnisse gefunden',
            'empty_history': 'Verlauf ist leer',
        },
        
        pt: {
            'app_title': 'Horadric AI',
            'app_subtitle': 'Analisador de Saque do Diablo 4',
            'app_description': 'Analisador de saque do Diablo 4 alimentado por IA - Identifique e avalie seus itens instantaneamente com Google Gemini',
            'skip_to_content': 'Pular para conteúdo',
            'how_it_works': 'Como funciona',
            'upload_image': 'Fazer upload de imagem',
            'paste_description': 'Colar descrição',
            'analyze_item': 'Analisar item',
            'analyzing': 'Analisando item...',
            'clear_analysis': 'Limpar análise',
            'copy_analysis': 'Copiar análise',
            'share_analysis': 'Compartilhar análise',
            'analysis_results': 'Resultados da análise',
            'item_analysis': 'Análise do item',
            'rarity': 'Raridade',
            'estimated_price': 'Preço estimado',
            'value': 'Valor',
            'recommendation': 'Recomendação',
            'sell': 'Vender',
            'keep': 'Manter',
            'upgrade': 'Atualizar',
            'settings': 'Configurações',
            'language': 'Idioma',
            'about': 'Sobre',
            'contact': 'Contato',
            'feedback': 'Feedback',
            'help': 'Ajuda',
            'close': 'Fechar',
            'cancel': 'Cancelar',
            'save': 'Salvar',
            'delete': 'Excluir',
            'loading': 'Carregando...',
            'error': 'Erro',
            'success': 'Sucesso',
            'warning': 'Aviso',
            'info': 'Informação',
            'error_loading': 'Erro ao carregar aplicativo',
            'error_analyzing': 'Erro ao analisar o item. Tente novamente.',
            'error_no_image': 'Selecione uma imagem primeiro',
            'error_invalid_image': 'Formato de imagem inválido',
            'error_no_description': 'Cole uma descrição do item',
            'error_api_key': 'Chave da API não configurada',
            'error_offline': 'Você parece estar offline',
            'error_generic': 'Algo deu errado. Tente novamente.',
            'price_tracking': 'Rastreamento de preços',
            'item_history': 'Histórico de itens',
            'analytics': 'Análise',
            'session_stats': 'Estatísticas da sessão',
            'total_scans': 'Digitalizações totais',
            'session_cost': 'Custo da sessão',
            'search_placeholder': 'Pesquisar itens...',
            'input_placeholder': 'Digite o texto aqui...',
            'welcome_message': 'Bem-vindo ao Horadric AI',
            'first_visit': 'Esta parece ser sua primeira visita',
            'offline_message': 'Você está offline. Alguns recursos podem ser limitados.',
            'session_info': 'Sessão ativa',
            'start': 'Iniciar',
            'continue': 'Continuar',
            'next': 'Próximo',
            'previous': 'Anterior',
            'finish': 'Finalizar',
            'reset': 'Redefinir',
            'download': 'Baixar',
            'export': 'Exportar',
            'import': 'Importar',
            'no_data': 'Sem dados disponíveis',
            'no_results': 'Nenhum resultado encontrado',
            'empty_history': 'Histórico vazio',
        },
        
        ru: {
            'app_title': 'Horadric AI',
            'app_subtitle': 'Анализатор Добычи Диабло 4',
            'app_description': 'Анализатор добычи Diablo 4 на основе ИИ - Определяйте и оценивайте свои предметы мгновенно с помощью Google Gemini',
            'skip_to_content': 'Перейти к содержанию',
            'how_it_works': 'Как это работает',
            'upload_image': 'Загрузить изображение',
            'paste_description': 'Вставить описание',
            'analyze_item': 'Анализировать предмет',
            'analyzing': 'Анализирование предмета...',
            'clear_analysis': 'Очистить анализ',
            'copy_analysis': 'Копировать анализ',
            'share_analysis': 'Поделиться анализом',
            'analysis_results': 'Результаты анализа',
            'item_analysis': 'Анализ предмета',
            'rarity': 'Редкость',
            'estimated_price': 'Ориентировочная цена',
            'value': 'Стоимость',
            'recommendation': 'Рекомендация',
            'sell': 'Продать',
            'keep': 'Оставить',
            'upgrade': 'Улучшить',
            'settings': 'Параметры',
            'language': 'Язык',
            'about': 'О программе',
            'contact': 'Контакт',
            'feedback': 'Отзыв',
            'help': 'Помощь',
            'close': 'Закрыть',
            'cancel': 'Отмена',
            'save': 'Сохранить',
            'delete': 'Удалить',
            'loading': 'Загрузка...',
            'error': 'Ошибка',
            'success': 'Успех',
            'warning': 'Предупреждение',
            'info': 'Информация',
            'error_loading': 'Ошибка загрузки приложения',
            'error_analyzing': 'Ошибка при анализе предмета. Пожалуйста, попробуйте еще раз.',
            'error_no_image': 'Пожалуйста, сначала выберите изображение',
            'error_invalid_image': 'Недопустимый формат изображения',
            'error_no_description': 'Пожалуйста, вставьте описание предмета',
            'error_api_key': 'Ключ API не настроен',
            'error_offline': 'Вы находитесь в режиме оффлайн',
            'error_generic': 'Что-то пошло не так. Пожалуйста, попробуйте еще раз.',
            'price_tracking': 'Отслеживание цен',
            'item_history': 'История предметов',
            'analytics': 'Аналитика',
            'session_stats': 'Статистика сеанса',
            'total_scans': 'Всего сканирований',
            'session_cost': 'Стоимость сеанса',
            'search_placeholder': 'Поиск предметов...',
            'input_placeholder': 'Введите текст здесь...',
            'welcome_message': 'Добро пожаловать в Horadric AI',
            'first_visit': 'Это кажется вашим первым визитом',
            'offline_message': 'Вы находитесь в режиме офлайн. Некоторые функции могут быть ограничены.',
            'session_info': 'Сеанс активен',
            'start': 'Начать',
            'continue': 'Продолжить',
            'next': 'Далее',
            'previous': 'Назад',
            'finish': 'Готово',
            'reset': 'Сбросить',
            'download': 'Скачать',
            'export': 'Экспорт',
            'import': 'Импорт',
            'no_data': 'Нет доступных данных',
            'no_results': 'Результаты не найдены',
            'empty_history': 'История пуста',
        },
        
        zh: {
            'app_title': 'Horadric AI',
            'app_subtitle': '暗黑破坏神4战利品分析器',
            'app_description': '由人工智能驱动的暗黑破坏神4战利品分析器 - 使用Google Gemini即时识别和评估您的物品',
            'skip_to_content': '跳转到内容',
            'how_it_works': '工作原理',
            'upload_image': '上传图片',
            'paste_description': '粘贴描述',
            'analyze_item': '分析物品',
            'analyzing': '正在分析物品...',
            'clear_analysis': '清除分析',
            'copy_analysis': '复制分析',
            'share_analysis': '分享分析',
            'analysis_results': '分析结果',
            'item_analysis': '物品分析',
            'rarity': '稀有度',
            'estimated_price': '估计价格',
            'value': '价值',
            'recommendation': '建议',
            'sell': '出售',
            'keep': '保留',
            'upgrade': '升级',
            'settings': '设置',
            'language': '语言',
            'about': '关于',
            'contact': '联系',
            'feedback': '反馈',
            'help': '帮助',
            'close': '关闭',
            'cancel': '取消',
            'save': '保存',
            'delete': '删除',
            'loading': '正在加载...',
            'error': '错误',
            'success': '成功',
            'warning': '警告',
            'info': '信息',
            'error_loading': '加载应用程序出错',
            'error_analyzing': '分析物品出错。请重试。',
            'error_no_image': '请先选择一张图片',
            'error_invalid_image': '无效的图像格式',
            'error_no_description': '请粘贴物品描述',
            'error_api_key': '未配置API密钥',
            'error_offline': '您似乎离线了',
            'error_generic': '出错了。请重试。',
            'price_tracking': '价格跟踪',
            'item_history': '物品历史',
            'analytics': '分析',
            'session_stats': '会话统计',
            'total_scans': '总扫描次数',
            'session_cost': '会话成本',
            'search_placeholder': '搜索物品...',
            'input_placeholder': '在此输入文本...',
            'welcome_message': '欢迎来到Horadric AI',
            'first_visit': '这似乎是您的第一次访问',
            'offline_message': '您目前处于离线状态。某些功能可能受限。',
            'session_info': '会话活跃',
            'start': '开始',
            'continue': '继续',
            'next': '下一个',
            'previous': '上一个',
            'finish': '完成',
            'reset': '重置',
            'download': '下载',
            'export': '导出',
            'import': '导入',
            'no_data': '没有可用数据',
            'no_results': '未找到结果',
            'empty_history': '历史记录为空',
        },
        
        ja: {
            'app_title': 'Horadric AI',
            'app_subtitle': 'ディアブロ4ルートアナライザー',
            'app_description': 'AI搭載のディアブロ4ルートアナライザー - Google Geminiでアイテムを瞬時に特定・評価します',
            'skip_to_content': 'コンテンツにスキップ',
            'how_it_works': 'どのように機能するか',
            'upload_image': '画像をアップロード',
            'paste_description': '説明を貼り付ける',
            'analyze_item': 'アイテムを分析',
            'analyzing': 'アイテムを分析中...',
            'clear_analysis': '分析をクリア',
            'copy_analysis': '分析をコピー',
            'share_analysis': '分析を共有',
            'analysis_results': '分析結果',
            'item_analysis': 'アイテム分析',
            'rarity': 'レアリティ',
            'estimated_price': '推定価格',
            'value': '値',
            'recommendation': '推奨',
            'sell': '売却',
            'keep': '保持',
            'upgrade': 'アップグレード',
            'settings': '設定',
            'language': '言語',
            'about': 'について',
            'contact': '連絡先',
            'feedback': 'フィードバック',
            'help': 'ヘルプ',
            'close': '閉じる',
            'cancel': 'キャンセル',
            'save': '保存',
            'delete': '削除',
            'loading': '読み込み中...',
            'error': 'エラー',
            'success': '成功',
            'warning': '警告',
            'info': '情報',
            'error_loading': 'アプリケーションの読み込みエラー',
            'error_analyzing': 'アイテムの分析中にエラーが発生しました。もう一度お試しください。',
            'error_no_image': '最初に画像を選択してください',
            'error_invalid_image': '無効な画像形式',
            'error_no_description': 'アイテムの説明を貼り付けてください',
            'error_api_key': 'APIキーが設定されていません',
            'error_offline': 'オフラインのようです',
            'error_generic': '問題が発生しました。もう一度お試しください。',
            'price_tracking': '価格追跡',
            'item_history': 'アイテム履歴',
            'analytics': '分析',
            'session_stats': 'セッション統計',
            'total_scans': '総スキャン数',
            'session_cost': 'セッション費用',
            'search_placeholder': 'アイテムを検索...',
            'input_placeholder': 'ここにテキストを入力...',
            'welcome_message': 'Horadric AIへようこそ',
            'first_visit': 'これが初めての訪問のようです',
            'offline_message': '現在オフラインです。一部の機能が制限される場合があります。',
            'session_info': 'セッションアクティブ',
            'start': '開始',
            'continue': '続行',
            'next': '次へ',
            'previous': '前へ',
            'finish': '完了',
            'reset': 'リセット',
            'download': 'ダウンロード',
            'export': 'エクスポート',
            'import': 'インポート',
            'no_data': 'データなし',
            'no_results': '結果が見つかりません',
            'empty_history': '履歴が空です',
        }
    },
    
    /**
     * Initialize i18n system
     */
    init() {
        // Try to get saved language preference
        const savedLanguage = localStorage.getItem('horadric_language');
        
        if (savedLanguage && this.supportedLanguages[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        } else {
            // Auto-detect browser language
            this.currentLanguage = this.detectBrowserLanguage();
            localStorage.setItem('horadric_language', this.currentLanguage);
        }
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
        console.log('🌍 i18n initialized. Language:', this.currentLanguage);
    },
    
    /**
     * Detect user's browser language
     */
    detectBrowserLanguage() {
        const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
        
        if (browserLang && this.supportedLanguages[browserLang]) {
            return browserLang;
        }
        
        // Default to English
        return 'en';
    },
    
    /**
     * Get translated text by key
     * @param {string} key - Translation key
     * @param {string} defaultText - Fallback text if key not found
     * @returns {string} Translated text
     */
    get(key, defaultText = key) {
        const translation = this.translations[this.currentLanguage];
        
        if (!translation) {
            console.warn(`Language not found: ${this.currentLanguage}`);
            return defaultText;
        }
        
        return translation[key] || this.translations['en'][key] || defaultText;
    },
    
    /**
     * Set current language
     * @param {string} languageCode - Language code (e.g., 'en', 'es', 'fr')
     */
    setLanguage(languageCode) {
        if (!this.supportedLanguages[languageCode]) {
            console.warn(`Language not supported: ${languageCode}`);
            return false;
        }
        
        this.currentLanguage = languageCode;
        localStorage.setItem('horadric_language', languageCode);
        document.documentElement.lang = languageCode;
        
        // Dispatch event to notify UI of language change
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: languageCode }
        }));
        
        console.log('🌍 Language changed to:', languageCode);
        return true;
    },
    
    /**
     * Get list of supported languages
     * @returns {Object} Supported languages object
     */
    getLanguages() {
        return this.supportedLanguages;
    },
    
    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    },
    
    /**
     * Get current language name
     * @returns {string} Current language display name
     */
    getCurrentLanguageName() {
        return this.supportedLanguages[this.currentLanguage] || 'English';
    }
};

// Auto-initialize when script loads
if (document.readyState !== 'loading') {
    i18n.init();
} else {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
}
