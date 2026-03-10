import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Copy, Check, Sun, Moon, Pencil, X } from 'lucide-react';

const ModerationToolGermany = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedTemplates, setExpandedTemplates] = useState<Record<string, boolean>>({});
  const [showSection, setShowSection] = useState({ templates: false, ban: false, admin: false });
  const adminSectionRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [notepad, setNotepad] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [customTemplates, setCustomTemplates] = useState<Record<string, string>>({});

  // Shift timer
  const [shiftRunning, setShiftRunning] = useState(false);
  const [shiftSeconds, setShiftSeconds] = useState(0);
  const [shiftStartTime, setShiftStartTime] = useState<Date | null>(null);

  const [templateInputs, setTemplateInputs] = useState({
    removePost: { name: '', topicUrl: '', topic: '', grundsatz: '', beitrag: '' },
    editPost: { name: '', topicUrl: '', topic: '', grundsatz: '', beitrag: '' },
    csRedirect: { username: '' },
    banCombined: { banPeriod: '1 Day', reasoning: '', username: '', email: '', ip: '', spamUrl: '', startDate: '' }
  });

  const [adminNoteInputs, setAdminNoteInputs] = useState({
    edited: { link: '', violation: '' },
    removed: { link: '', violation: '' }
  });
  const [customViolation, setCustomViolation] = useState<Record<string, boolean>>({});
  const [customGrundsatz, setCustomGrundsatz] = useState<Record<string, boolean>>({});

  const defaultTemplateInputs = {
    removePost: { name: '', topicUrl: '', topic: '', grundsatz: '', beitrag: '' },
    editPost: { name: '', topicUrl: '', topic: '', grundsatz: '', beitrag: '' },
    csRedirect: { username: '' },
    banCombined: { banPeriod: '1 Day', reasoning: '', username: '', email: '', ip: '', spamUrl: '', startDate: '' }
  };
  const defaultAdminNoteInputs = {
    edited: { link: '', violation: '' },
    removed: { link: '', violation: '' }
  };

  // Ban period options (UI labels in English, output values in German for customer-facing content)
  const banPeriods = ['1 Day', '3 Days', '7 Days', '30 Days', 'Indefinite'];
  const banLenMap: Record<string, string> = {
    '1 Day': '1 Tag',
    '3 Days': '3 Tage',
    '7 Days': '7 Tage',
    '30 Days': '30 Tage',
    'Indefinite': 'unbegrenzt'
  };

  useEffect(() => {
    try {
      const savedTemplateInputs = localStorage.getItem('ebay-de-mod-template-inputs');
      const savedAdminNotes = localStorage.getItem('ebay-de-mod-admin-notes');
      const savedDarkMode = localStorage.getItem('ebay-de-mod-dark-mode');
      const savedNotepad = localStorage.getItem('ebay-de-mod-notepad');
      const savedCustomTemplates = localStorage.getItem('ebay-de-mod-custom-templates');
      if (savedTemplateInputs) {
        const parsed = JSON.parse(savedTemplateInputs) as Record<string, Record<string, string>>;
        setTemplateInputs({
          ...defaultTemplateInputs,
          ...parsed,
          removePost: { ...defaultTemplateInputs.removePost, ...parsed?.removePost },
          editPost: { ...defaultTemplateInputs.editPost, ...parsed?.editPost },
          csRedirect: { ...defaultTemplateInputs.csRedirect, ...parsed?.csRedirect },
          banCombined: { ...defaultTemplateInputs.banCombined, ...parsed?.banCombined }
        });
      }
      if (savedAdminNotes) {
        const parsed = JSON.parse(savedAdminNotes) as typeof defaultAdminNoteInputs;
        setAdminNoteInputs({
          edited: { ...defaultAdminNoteInputs.edited, ...parsed?.edited },
          removed: { ...defaultAdminNoteInputs.removed, ...parsed?.removed }
        });
      }
      if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
      if (savedNotepad) setNotepad(savedNotepad);
      if (savedCustomTemplates) setCustomTemplates(JSON.parse(savedCustomTemplates));
    } catch (e) { console.error('Error loading saved data:', e); }
  }, []);

  useEffect(() => { try { localStorage.setItem('ebay-de-mod-template-inputs', JSON.stringify(templateInputs)); } catch (e) {} }, [templateInputs]);
  useEffect(() => { try { localStorage.setItem('ebay-de-mod-admin-notes', JSON.stringify(adminNoteInputs)); } catch (e) {} }, [adminNoteInputs]);
  useEffect(() => { try { localStorage.setItem('ebay-de-mod-notepad', notepad); } catch (e) {} }, [notepad]);
  useEffect(() => { try { localStorage.setItem('ebay-de-mod-dark-mode', JSON.stringify(darkMode)); } catch (e) {} }, [darkMode]);
  useEffect(() => { try { localStorage.setItem('ebay-de-mod-custom-templates', JSON.stringify(customTemplates)); } catch (e) {} }, [customTemplates]);

  // ─── GERMAN USER-FACING MESSAGE TEMPLATES ─────────────────────────────────
  const templates: Record<string, string> = {
    removePost: `<p> Hallo [NAME],<br /><br /> wir möchten Dich darüber informieren, dass Dein Beitrag: <a href="[TOPIC_URL]">[TOPIC]</a>, von uns entfernt wurde, da dieser gegen unsere <a href="https://community.ebay.de/t5/Community-Schwarzes-Brett/Unsere-neue-Community-Netiquette/ba-p/4604443"> unsere neue Community-Netiquette </a> verstößt.<br /><br /> Bei der Veröffentlichung von Beiträgen und Inhalten auf eBay ist insbesondere untersagt:<br /> [Zitiere_als_Text_den_entsprechenden_Grundsatz]<br /><br /> [BEITRAG_EINFUEGEN] </p> <br> <p> Du kannst die vollständigen Community Richtlinien jederzeit hier finden: </p> <p> <a href="https://www.ebay.de/help/policies/member-behavior-policies/grundsatz-zur-verffentlichung-von-beitrgen-und-inhalten-der-ebaycommunity?id=4265#section1"> Grundsatz zu Beiträgen und Inhalten/Policies </a> </p> <p> <a href="https://www.ebay.de/help/policies/member-behavior-policies/grundsatz-zur-verffentlichung-von-beitrgen-und-inhalten-der-ebaycommunity?id=4265#section3"> Grundsatz zur Veröffentlichung von Beiträgen </a> </p> <p> <br /> Du kannst gerne einen überarbeiteten Beitrag erstellen. Deine Beiträge sind für eBay und die anderen Mitglieder des Forums wichtig.<br /><br /> <br> <p> Für Rückfragen oder zur Klärung der Moderationsentscheidung kontaktiere bitte contactcommunity@ebay.com. </p> Mit freundlichen Grüßen<br /><br /> </p>`,
    editPost: `<p>Hallo [NAME],</p> <br> <p>wir möchten Dich darüber informieren, dass Dein Beitrag: <a href="[TOPIC_URL]">[TOPIC]</a>, von uns bearbeitet wurde, da dieser gegen unsere <a href="https://community.ebay.de/t5/Community-Schwarzes-Brett/Unsere-neue-Community-Netiquette/ba-p/4604443">unsere neue Community-Netiquette</a> verstößt. <br>Bei der Veröffentlichung von Beiträgen und Inhalten auf eBay ist insbesondere untersagt:</p> <p>[Zitiere_als_Text_den_entsprechenden_Grundsatz]</p> <br> <p>[BEITRAG_EINFUEGEN]</p> <br> <p>Du kannst die vollständigen Community Richtlinien jederzeit hier finden:</p> <p><a href="https://www.ebay.de/help/policies/member-behavior-policies/grundsatz-zur-verffentlichung-von-beitrgen-und-inhalten-der-ebaycommunity?id=4265#section1">Grundsatz zu Beiträgen und Inhalten/Policies&nbsp; </a></p> <p><a href="https://www.ebay.de/help/policies/member-behavior-policies/grundsatz-zur-verffentlichung-von-beitrgen-und-inhalten-der-ebaycommunity?id=4265#section3">Grundsatz zur Veröffentlichung von Beiträgen&nbsp; </a></p> <br> <p>Unsere Grundsätze sollen sicherstellen, dass alle Mitglieder unser Forum erfolgreich nutzen können. Wir freuen uns über Deine Mitwirkung.</p> <br> <p> Für Rückfragen oder zur Klärung der Moderationsentscheidung kontaktiere bitte contactcommunity@ebay.com. </p> <br> <p>Mit freundlichen Grüßen</p>`,
    necroThread: 'Hallo zusammen,\n \nAufgrund des Alters dieses Threads wurde er für weitere Antworten geschlossen. Du kannst gerne einen neuen Thread starten, wenn du dieses Thema weiter diskutieren möchtest.\n \nVielen Dank für dein Verständnis.',
    opRequest: 'Hallo zusammen,\n \nDieser Thread wurde auf Wunsch des ursprünglichen Verfassers geschlossen.\n \nVielen Dank für dein Verständnis.',
    lockingOffTopic: 'Hallo zusammen,\n \nWir schätzen eure Beteiligung an dieser Diskussion. Allerdings hat sich das Gespräch vom Thema entfernt und ist etwas hitzig geworden. Um die Community für alle Mitglieder einladend und konstruktiv zu halten, sperren wir diesen Thread für weitere Antworten.\n \nBitte denkt daran, zukünftige Diskussionen gemäß unseren Community-Richtlinien respektvoll und themenrelevant zu halten.\n \nVielen Dank für euer Verständnis und dafür, dass ihr uns helft, die Foren freundlich und produktiv zu halten.\n \n— Das eBay Community-Team',
    heatedDiscussion: 'Hallo zusammen,\n \nDiese Diskussion ist etwas hitzig geworden. Bitte denkt daran, dass es zwar in Ordnung ist, anderer Meinung zu sein, die Diskussion jedoch gemäß den Community-Richtlinien immer freundlich und respektvoll bleiben muss.\n \nVielen Dank für eure Mitarbeit.',
    offTopic: 'Hallo zusammen,\n \nDiese Diskussion ist etwas vom Thema abgekommen. Bitte bringt die Diskussion zum ursprünglich im Eröffnungsbeitrag festgelegten Thema zurück.\n \nVielen Dank.',
    bullying: 'Entfernt, da unsere Community-Richtlinien nicht eingehalten wurden: Bitte haltet die Diskussionen respektvoll und offen. Unterschiedliche Meinungen sind willkommen, aber Gespräche müssen freundlich, inklusiv und respektvoll gegenüber allen Mitgliedern bleiben.',
    giftCardScam: 'Hallo zusammen, Wenn du glaubst, dass du oder jemand, den du kennst, dazu verleitet wurde, eBay-Geschenkkarten zu kaufen, besuche unsere Geschenkkarten-Seite, um den Kundendienst zu kontaktieren und weitere Informationen zu Geschenkkarten-Betrug zu erhalten. Vielen Dank.',
    csRedirect: 'Hallo [USERNAME], Vielen Dank, dass du einen Bericht über unangemessene Inhalte eingereicht hast. Wir möchten dich jedoch darauf hinweisen, dass du das eBay Community-Moderationsteam erreicht hast. Leider können wir dir bei deinem Problem nicht helfen, da wir uns ausschließlich um die Community kümmern.',
    gg01: 'Sei respektvoll.',
    gg02: 'Teile bedeutungsvolle Beiträge.',
    gg03: 'Konsequenzen und Überlegungen: Wenn Beiträge vom Thema abweichen, kann das eBay Community-Team Inhalte nach eigenem Ermessen verschieben.',
    gg04: 'Melden von unangemessenen Inhalten: Die eBay Community ist für eBay-Nutzer aufgebaut, und es ist wahrscheinlich, dass ihr als erste Beiträge seht, die die Community schädigen und gegen die Community-Richtlinien verstoßen.',
    gg05: 'Nicht erlaubt: Das Veröffentlichen persönlicher Kontaktdaten einer Person in einem öffentlichen Bereich von eBay, einschließlich E-Mail, Telefonnummern, Name, Adresse usw.',
    sg00: 'Bitte unterlasse es, Inhalte zu veröffentlichen oder Aktionen durchzuführen, die:',
    sg01: 'Einen sexuellen, pornografischen, gewalttätigen oder für Erwachsene bestimmten Charakter haben',
    sg02: 'Sprache oder Drohungen enthalten, die gegen die Richtlinie zu Drohungen und beleidigender Sprache verstoßen',
    sg03: 'Unehrlich, unbewiesen oder darauf ausgelegt sind, andere zu täuschen',
    sg04: 'Doppelt oder repetitiv sind – einschließlich Forenbeiträgen und Antworten',
    sg05: 'Zu Petitionen, Boykotten, Klagen oder anderen Formen des Aktivismus aufrufen',
    sg06: 'Für Angebote, Produkte oder Dienstleistungen werben, um Verkäufe zu fördern',
    sg07: 'Für Seiten, Gruppen oder Foren außerhalb von eBay werben',
    sg08: 'Inhalte erneut veröffentlichen, die vom eBay Community-Personal bearbeitet oder entfernt wurden',
    sg09: 'Moderationshinweise oder Konsequenzen betreffen',
    sg10: 'Einen anderen Nutzer, ein Angebot oder eine Nutzer-ID nennen, um dessen Ruf zu schädigen',
    sg11: 'Andere dazu ermutigen, die Nutzungsvereinbarung oder eBay-Richtlinien zu verletzen',
    sg12: 'Urheberrechtlich geschützte Inhalte ohne Erlaubnis des Inhabers des Urheberrechts enthalten'
  };
  // ──────────────────────────────────────────────────────────────────────────

  const violationOptions = [
    { value: '', label: 'Select a violation...' },
    { value: 'GG01: ' + templates.gg01, label: 'GG01: ' + templates.gg01 },
    { value: 'GG02: ' + templates.gg02, label: 'GG02: ' + templates.gg02 },
    { value: 'GG03: ' + templates.gg03, label: 'GG03: ' + templates.gg03.substring(0, 50) + '...' },
    { value: 'GG04: ' + templates.gg04, label: 'GG04: ' + templates.gg04.substring(0, 50) + '...' },
    { value: 'GG05: ' + templates.gg05, label: 'GG05: ' + templates.gg05.substring(0, 50) + '...' },
    { value: 'SG00: ' + templates.sg00, label: 'SG00: ' + templates.sg00.substring(0, 50) + '...' },
    { value: 'SG01: ' + templates.sg01, label: 'SG01: ' + templates.sg01.substring(0, 50) + '...' },
    { value: 'SG02: ' + templates.sg02, label: 'SG02: ' + templates.sg02.substring(0, 50) + '...' },
    { value: 'SG03: ' + templates.sg03, label: 'SG03: ' + templates.sg03.substring(0, 50) + '...' },
    { value: 'SG04: ' + templates.sg04, label: 'SG04: ' + templates.sg04.substring(0, 50) + '...' },
    { value: 'SG05: ' + templates.sg05, label: 'SG05: ' + templates.sg05.substring(0, 50) + '...' },
    { value: 'SG06: ' + templates.sg06, label: 'SG06: ' + templates.sg06.substring(0, 50) + '...' },
    { value: 'SG07: ' + templates.sg07, label: 'SG07: ' + templates.sg07.substring(0, 50) + '...' },
    { value: 'SG08: ' + templates.sg08, label: 'SG08: ' + templates.sg08.substring(0, 50) + '...' },
    { value: 'SG09: ' + templates.sg09, label: 'SG09: ' + templates.sg09.substring(0, 50) + '...' },
    { value: 'SG10: ' + templates.sg10, label: 'SG10: ' + templates.sg10.substring(0, 50) + '...' },
    { value: 'SG11: ' + templates.sg11, label: 'SG11: ' + templates.sg11.substring(0, 50) + '...' },
    { value: 'SG12: ' + templates.sg12, label: 'SG12: ' + templates.sg12.substring(0, 50) + '...' },
    { value: '__custom__', label: 'Custom...' },
  ];

  const grundsatzOptions = [
    { value: '', label: 'Select a guideline...' },
    ...(['gg01','gg02','gg03','gg04','gg05','sg00','sg01','sg02','sg03','sg04','sg05','sg06','sg07','sg08','sg09','sg10','sg11','sg12'] as const).map(id => ({
      value: templates[id],
      label: id.toUpperCase() + ': ' + templates[id].substring(0, 60) + (templates[id].length > 60 ? '...' : ''),
    })),
    { value: '__custom__', label: 'Custom...' },
  ];

  type TemplateItem = {
    id: string;
    name: string;
    content: string;
    isDynamic?: boolean;
    type?: string;
  };

  const templateList: TemplateItem[] = [
    { id: 'removedByMod', name: 'Removed by Moderator', content: '[Vom Moderator entfernt]' },
    { id: 'removePost', name: 'Remove Post', content: templates.removePost, isDynamic: true, type: 'removePost' },
    { id: 'editPost', name: 'Edit Post', content: templates.editPost, isDynamic: true, type: 'removePost' },
    { id: 'necroThread', name: 'Locking: Necro Thread', content: templates.necroThread },
    { id: 'opRequest', name: 'Locking: OP Request', content: templates.opRequest },
    { id: 'lockingOffTopic', name: 'Locking: Off Topic', content: templates.lockingOffTopic },
    { id: 'heatedDiscussion', name: 'Steering: Heated Discussion', content: templates.heatedDiscussion },
    { id: 'offTopic', name: 'Steering: Off Topic', content: templates.offTopic },
    { id: 'bullying', name: 'Bullying Reply', content: templates.bullying },
    { id: 'giftCardScam', name: 'Gift Card Scam', content: templates.giftCardScam },
    { id: 'csRedirect', name: 'CS Redirect', content: templates.csRedirect, isDynamic: true, type: 'username' },
    ...(['gg01','gg05','sg02','sg04','sg05','sg08','sg09','sg10','sg11','gg02','gg03','gg04','sg00','sg01','sg03','sg06','sg07','sg12'] as const).map(id => ({ id, name: id.toUpperCase() + ': ' + templates[id].substring(0, 30), content: templates[id] }))
  ];

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (e) { alert('Copy failed. Please copy manually:\n\n' + text); }
      textArea.remove();
    }
  };

  const updateInput = (templateId: string, field: string, value: string) => {
    setTemplateInputs(prev => ({ ...prev, [templateId]: { ...(prev as Record<string, Record<string, string>>)[templateId], [field]: value } }));
  };

  const clearInputs = (templateId: string) => {
    const defaults: Record<string, Record<string, string>> = {
      removePost: { name: '', topicUrl: '', topic: '', grundsatz: '', beitrag: '' },
      editPost: { name: '', topicUrl: '', topic: '', grundsatz: '', beitrag: '' },
      csRedirect: { username: '' },
      banCombined: { banPeriod: '1 Day', reasoning: '', username: '', email: '', ip: '', spamUrl: '', startDate: '' }
    };
    if (defaults[templateId]) {
      setTemplateInputs(prev => ({ ...prev, [templateId]: defaults[templateId] }));
      setCustomGrundsatz(prev => ({ ...prev, [templateId]: false }));
    }
  };

  const getPopulated = (templateId: string, base: string): string => {
    const i = (templateInputs as Record<string, Record<string, string>>)[templateId] || {};
    let p = base;
    if (templateId === 'removePost' || templateId === 'editPost') {
      const baseContent = customTemplates[templateId] ?? templates[templateId];
      p = baseContent
        .replace('[NAME]', i.name || '[NAME]')
        .replace(/\[TOPIC_URL\]/g, i.topicUrl || '[TOPIC_URL]')
        .replace('[TOPIC]', i.topic || '[TOPIC]')
        .replace('[Zitiere_als_Text_den_entsprechenden_Grundsatz]', i.grundsatz || '[Zitiere_als_Text_den_entsprechenden_Grundsatz]')
        .replace('[BEITRAG_EINFUEGEN]', i.beitrag || '[BEITRAG_EINFUEGEN]');
    } else if (templateId === 'csRedirect') {
      p = templates.csRedirect.replace('[USERNAME]', i.username || '[USERNAME]');
    } else if (templateId === 'banCombined') {
      const len = banLenMap[i.banPeriod] || '1 Tag';
      p = 'Internal Reason\n\n' + i.banPeriod + ' Login Restriction\n\n' +
        'Reasoning: ' + (i.reasoning || '[Reasoning]') + '\n' +
        'Username: ' + (i.username || '[Username]') + '\n' +
        'Email: ' + (i.email || '[Email]') + '\n' +
        'IP: ' + (i.ip || '[IP]') + '\n' +
        'Relevant Post URL: ' + (i.spamUrl || '[URL]') + '\n' +
        'Start Date: ' + (i.startDate || '[DATE]') + '\n' +
        'Ban Length: ' + len +
        '\n\n---\n\n' +
        'Public Reason\n\n' +
        'Verstoß gegen die Regeln und Richtlinien der eBay Community durch Handlungen wie ' +
        (i.reasoning || '[Reasoning]') +
        '. Deine Sperre gilt ab dem ' + (i.startDate || '[DATUM]') +
        ' und dauert ' + len + '.';
    }
    return p;
  };

  const updateAdminNote = (noteId: string, field: string, value: string) => {
    if (noteId === 'edited') setAdminNoteInputs(prev => ({ ...prev, edited: { ...prev.edited, [field]: value } }));
    else if (noteId === 'removed') setAdminNoteInputs(prev => ({ ...prev, removed: { ...prev.removed, [field]: value } }));
  };
  const clearAdminNotes = (noteId: string) => {
    if (noteId === 'edited') setAdminNoteInputs(prev => ({ ...prev, edited: { link: '', violation: '' } }));
    else if (noteId === 'removed') setAdminNoteInputs(prev => ({ ...prev, removed: { link: '', violation: '' } }));
    setCustomViolation(prev => ({ ...prev, [noteId]: false }));
  };
  const getAdminNote = (noteId: string): string => {
    if (noteId === 'edited') {
      const i = adminNoteInputs.edited;
      return 'Beitrag bearbeitet (' + (i.violation || '[violation]') + ') PN gesendet. <a href="' + (i.link || '[URL]') + '">Beitrag</a>';
    }
    if (noteId === 'removed') {
      const i = adminNoteInputs.removed;
      return 'Beitrag entfernt (' + (i.violation || '[violation]') + ') PN gesendet. <a href="' + (i.link || '[URL]') + '">Beitrag</a>';
    }
    return '';
  };
  const copyToAdminNotes = (templateId: string) => {
    const i = (templateInputs as Record<string, Record<string, string>>)[templateId] || {};
    if (templateId === 'removePost') {
      setAdminNoteInputs(prev => ({ ...prev, removed: { link: i.topicUrl || prev.removed.link, violation: i.grundsatz || '' } }));
    } else if (templateId === 'editPost') {
      setAdminNoteInputs(prev => ({ ...prev, edited: { link: i.topicUrl || prev.edited.link, violation: i.grundsatz || '' } }));
    }
    setShowSection(prev => ({ ...prev, admin: true }));
    setTimeout(() => adminSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const startEditing = (templateId: string, currentContent: string) => {
    setEditingTemplate(templateId);
    setEditDraft(customTemplates[templateId] ?? currentContent);
    setExpandedTemplates(prev => ({ ...prev, [templateId]: true }));
  };

  const saveEdit = (templateId: string) => {
    setCustomTemplates(prev => ({ ...prev, [templateId]: editDraft }));
    setEditingTemplate(null);
    setEditDraft('');
  };

  const cancelEdit = () => {
    setEditingTemplate(null);
    setEditDraft('');
  };

  const resetToDefault = (templateId: string, _defaultContent: string) => {
    setCustomTemplates(prev => { const n = { ...prev }; delete n[templateId]; return n; });
    setEditingTemplate(null);
    setEditDraft('');
  };

  const getTemplateContent = (t: TemplateItem): string => customTemplates[t.id] ?? t.content;

  const getInputsForTemplate = (id: string): Record<string, string> => {
    const key = id as keyof typeof templateInputs;
    return templateInputs[key] ?? {};
  };

  // Shift timer tick
  useEffect(() => {
    if (!shiftRunning) return;
    const interval = setInterval(() => setShiftSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [shiftRunning]);

  const startShift = () => {
    setShiftSeconds(0);
    setShiftStartTime(new Date());
    setShiftRunning(true);
  };
  const resumeShift = () => setShiftRunning(true);
  const stopShift = () => setShiftRunning(false);
  const resetShift = () => { setShiftRunning(false); setShiftSeconds(0); setShiftStartTime(null); };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return (h > 0 ? h + 'h ' : '') + String(m).padStart(2, '0') + 'min ' + String(s).padStart(2, '0') + 's';
  };

  // Warning thresholds in seconds
  const WARN_90 = 60 * 60;
  const timerColor = shiftSeconds >= WARN_90
    ? 'text-red-500'
    : shiftSeconds >= 45 * 60
    ? 'text-yellow-500'
    : 'text-green-500';

  const bg = darkMode ? 'min-h-screen bg-slate-900 p-6' : 'min-h-screen bg-slate-50 p-6';
  const card = darkMode ? 'bg-slate-800' : 'bg-white';
  const text1 = darkMode ? 'text-slate-100' : 'text-slate-800';
  const text2 = darkMode ? 'text-slate-400' : 'text-slate-600';
  const border = darkMode ? 'border-slate-700' : 'border-slate-200';

  return (
    <div className={bg}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className={`${card} rounded-lg shadow-lg p-6 mb-6 ${border} border`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className={`text-3xl font-bold ${text1}`}>eBay Community Moderation <span className="text-yellow-500">🇩🇪 Deutschland</span></h1>
              <p className={text2}>Quick reference guide with ready-to-use templates</p>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://community.ebay.de/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg font-semibold text-sm bg-yellow-500 hover:bg-yellow-600 text-white">Go to eBay DE</a>
              <button onClick={() => setDarkMode(!darkMode)} className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
                {darkMode ? <><Sun className="w-5 h-5" /><span>Light</span></> : <><Moon className="w-5 h-5" /><span>Dark</span></>}
              </button>
            </div>
          </div>
        </div>

        {/* Shift Timer */}
        <div className={`${card} rounded-lg shadow p-4 mb-6 border ${border}`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">⏱️</span>
              <div>
                <div className={`text-xs font-semibold uppercase tracking-wide ${text2}`}>Shift Timer</div>
                <div className={`text-2xl font-mono font-bold ${timerColor}`}>{formatTime(shiftSeconds)}</div>
                {shiftStartTime && (
                  <div className={`text-xs ${text2}`}>Started at {shiftStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {shiftSeconds >= WARN_90 && (
                <span className="text-xs font-semibold text-red-500 bg-red-100 px-2 py-1 rounded-full animate-pulse">⚠️ 60 min target exceeded</span>
              )}
              {!shiftRunning && shiftSeconds === 0 && (
                <button onClick={startShift} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm">Start Shift</button>
              )}
              {shiftRunning && (
                <button onClick={stopShift} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold text-sm">Pause</button>
              )}
              {!shiftRunning && shiftSeconds > 0 && (
                <button onClick={resumeShift} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm">Resume</button>
              )}
              {shiftSeconds > 0 && (
                <button onClick={resetShift} className={`px-4 py-2 rounded-lg font-semibold text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>Reset</button>
              )}
            </div>
          </div>
          {/* Progress bar */}
          <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <div
              className={`h-full rounded-full transition-all duration-1000 ${shiftSeconds >= WARN_90 ? 'bg-red-500' : shiftSeconds >= 45 * 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: Math.min((shiftSeconds / WARN_90) * 100, 100) + '%' }}
            />
          </div>
          <div className={`flex justify-between text-xs mt-1 ${text2}`}>
            <span>0</span>
            <span>45 min</span>
            <span>60 min target</span>
          </div>
        </div>

        {/* Collapsible Sections */}
        {[
          { key: 'ban', title: 'Ban Templates', render: () => {
            const ban = templateInputs.banCombined ?? defaultTemplateInputs.banCombined;
            return (
            <div className={`border rounded-lg overflow-hidden ${border}`}>
              <div className={`${darkMode ? 'bg-orange-900' : 'bg-orange-100'} px-3 py-2 flex items-center justify-between border-b ${border}`}>
                <span className={`text-sm font-semibold ${darkMode ? 'text-orange-100' : 'text-slate-700'}`}>Fill ban details</span>
                <div className="flex gap-2">
                  <button onClick={() => clearInputs('banCombined')} className={`px-3 py-1 rounded text-xs font-medium ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-300 hover:bg-slate-400 text-slate-700'}`}>Clear</button>
                  <button onClick={() => copy(getPopulated('banCombined', ''), 'banCombined')} className="flex items-center gap-2 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-medium">{copiedId === 'banCombined' ? <><Check className="w-4 h-4" />Copied</> : <><Copy className="w-4 h-4" />Copy</>}</button>
                </div>
              </div>
              <div className={`${darkMode ? 'bg-slate-900' : 'bg-orange-50'} p-3 space-y-2`}>
                <select value={ban.banPeriod ?? '1 Day'} onChange={(e) => updateInput('banCombined', 'banPeriod', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}`}>
                  {banPeriods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <textarea placeholder="Reasoning" value={ban.reasoning ?? ''} onChange={(e) => updateInput('banCombined', 'reasoning', e.target.value)} rows={3} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                {[{ f: 'username', label: 'Username' }, { f: 'email', label: 'Email' }, { f: 'ip', label: 'IP' }, { f: 'spamUrl', label: 'Relevant Post URL' }].map(({ f, label }) => (
                  <input key={f} type="text" placeholder={label} value={ban[f as keyof typeof ban] ?? ''} onChange={(e) => updateInput('banCombined', f, e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                ))}
                <input type="date" value={ban.startDate ?? ''} onChange={(e) => updateInput('banCombined', 'startDate', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}`} />
              </div>
              <div className={`${card} p-3`}><pre className={`text-xs ${text2} whitespace-pre-wrap font-mono`}>{getPopulated('banCombined', '')}</pre></div>
            </div>
            );
          }},
          { key: 'templates', title: 'Additional Templates', render: () => (
            <>
              <div className="mb-3 flex gap-2">
                <input type="text" placeholder="Search templates..." value={templateSearch} onChange={(e) => setTemplateSearch(e.target.value)} className={`flex-1 px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                {Object.values(expandedTemplates).some(v => v) && (
                  <button onClick={() => setExpandedTemplates({})} className={`px-3 py-2 rounded text-xs font-medium whitespace-nowrap ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>Collapse All</button>
                )}
              </div>
              <div className="space-y-2">
                {templateList.filter(t => t.name.toLowerCase().includes(templateSearch.toLowerCase())).map((t) => {
                  const isExp = expandedTemplates[t.id] === true;
                  const isEditing = editingTemplate === t.id;
                  const currentContent = getTemplateContent(t);
                  const isCustomized = !!customTemplates[t.id];
                  const pop = t.isDynamic ? getPopulated(t.id, currentContent) : currentContent;
                  return (
                    <div key={t.id}>
                    {t.id === 'gg01' && <div className={`my-4 border-t-2 ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}><span className={`text-xs font-semibold uppercase tracking-wide ${text2} relative -top-2.5 ${darkMode ? 'bg-slate-800' : 'bg-white'} px-2`}>Guidelines & Rules</span></div>}
                    <div className={`border rounded-lg overflow-hidden ${border}`}>
                      {/* Header row */}
                      <div className={`${darkMode ? 'bg-slate-700' : 'bg-slate-100'} px-3 py-2 flex items-center justify-between border-b ${border}`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${text1}`}>{t.name}</span>
                          {isCustomized && <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500 text-white font-medium">Edited</span>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => isEditing ? cancelEdit() : startEditing(t.id, currentContent)}
                            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium ${isEditing ? 'bg-red-500 hover:bg-red-600 text-white' : darkMode ? 'bg-slate-500 hover:bg-slate-400 text-white' : 'bg-slate-400 hover:bg-slate-500 text-white'}`}
                          >
                            {isEditing ? <><X className="w-3 h-3" />Cancel</> : <><Pencil className="w-3 h-3" />Edit</>}
                          </button>
                          <button onClick={() => copy(pop || currentContent, t.id)} className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium">{copiedId === t.id ? <><Check className="w-4 h-4" />Copied</> : <><Copy className="w-4 h-4" />Copy</>}</button>
                          <button onClick={() => setExpandedTemplates({...expandedTemplates, [t.id]: !isExp})} className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExp ? 'rotate-180' : ''}`} />
                            {isExp ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>

                      {isExp && (
                        <>
                          {/* Edit mode */}
                          {isEditing && (
                            <div className={`${darkMode ? 'bg-slate-900' : 'bg-yellow-50'} p-4 border-b ${border} space-y-3`}>
                              <div className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>✏️ Editing macro content</div>
                              <textarea
                                value={editDraft}
                                onChange={(e) => setEditDraft(e.target.value)}
                                rows={10}
                                className={`w-full px-3 py-2 text-sm border-2 rounded font-mono ${darkMode ? 'bg-slate-800 border-yellow-500 text-slate-200' : 'bg-white border-yellow-400 text-slate-800'}`}
                              />
                              <div className="flex gap-2">
                                <button onClick={() => saveEdit(t.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold">Save</button>
                                <button onClick={cancelEdit} className={`px-4 py-2 rounded text-sm font-semibold ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>Cancel</button>
                                {isCustomized && <button onClick={() => resetToDefault(t.id, t.content)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-semibold">Reset to Default</button>}
                              </div>
                            </div>
                          )}

                          {/* Fill fields for dynamic templates */}
                          {!isEditing && t.isDynamic && (
                            <div className={`${darkMode ? 'bg-slate-900' : 'bg-slate-50'} p-4 border-b ${border} space-y-3`}>
                              <div className="flex items-center justify-between mb-3">
                                <div className={`text-sm font-semibold ${text1}`}>Fill fields</div>
                                <div className="flex gap-2">
                                  {(t.id === 'removePost' || t.id === 'editPost') && (
                                    <button onClick={() => copyToAdminNotes(t.id)} className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium">Copy to Admin Notes</button>
                                  )}
                                  <button onClick={() => clearInputs(t.id)} className={`px-3 py-1 rounded text-xs font-medium ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-300 hover:bg-slate-400 text-slate-700'}`}>Clear</button>
                                </div>
                              </div>
                              {t.type === 'removePost' && (
                                <>
                                  <input type="text" placeholder="NAME" value={getInputsForTemplate(t.id).name || ''} onChange={(e) => updateInput(t.id, 'name', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                  <input type="text" placeholder="TOPIC_URL" value={getInputsForTemplate(t.id).topicUrl || ''} onChange={(e) => updateInput(t.id, 'topicUrl', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                  <input type="text" placeholder="TOPIC" value={getInputsForTemplate(t.id).topic || ''} onChange={(e) => updateInput(t.id, 'topic', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                  <select
                                    value={customGrundsatz[t.id] ? '__custom__' : (grundsatzOptions.some(o => o.value === getInputsForTemplate(t.id).grundsatz) ? getInputsForTemplate(t.id).grundsatz : (getInputsForTemplate(t.id).grundsatz ? '__custom__' : ''))}
                                    onChange={(e) => {
                                      if (e.target.value === '__custom__') {
                                        setCustomGrundsatz(prev => ({ ...prev, [t.id]: true }));
                                        updateInput(t.id, 'grundsatz', '');
                                      } else {
                                        setCustomGrundsatz(prev => ({ ...prev, [t.id]: false }));
                                        updateInput(t.id, 'grundsatz', e.target.value);
                                      }
                                    }}
                                    className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}`}
                                  >
                                    {grundsatzOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                                  {(customGrundsatz[t.id] || (!grundsatzOptions.some(o => o.value === getInputsForTemplate(t.id).grundsatz) && getInputsForTemplate(t.id).grundsatz)) && (
                                    <textarea placeholder="Enter custom guideline text..." value={getInputsForTemplate(t.id).grundsatz || ''} onChange={(e) => updateInput(t.id, 'grundsatz', e.target.value)} rows={3} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                  )}
                                  <textarea placeholder="BEITRAG_EINFUEGEN" value={getInputsForTemplate(t.id).beitrag || ''} onChange={(e) => updateInput(t.id, 'beitrag', e.target.value)} rows={3} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                                </>
                              )}
                              {t.type === 'username' && (
                                <input type="text" placeholder="USERNAME" value={getInputsForTemplate(t.id).username || ''} onChange={(e) => updateInput(t.id, 'username', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                              )}
                            </div>
                          )}

                          {/* Preview */}
                          <div className={`${card} p-3`}><pre className={`text-xs ${text2} whitespace-pre-wrap font-mono`}>{isEditing ? editDraft : (pop || currentContent)}</pre></div>
                        </>
                      )}
                    </div>
                    </div>
                  );
                })}
              </div>
            </>
          )},
          { key: 'admin', title: 'Admin Notes', render: () => {
            const edited = adminNoteInputs?.edited ?? defaultAdminNoteInputs.edited;
            const removed = adminNoteInputs?.removed ?? defaultAdminNoteInputs.removed;
            return (
            <div className={`space-y-6 pt-3 border-t ${border}`}>
              {[{ id: 'edited' as const, title: 'Beitrag bearbeitet', data: edited }, { id: 'removed' as const, title: 'Beitrag entfernt', data: removed }].map(n => (
                <div key={n.id}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`text-sm font-semibold ${text1}`}>{n.title}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => clearAdminNotes(n.id)} className={`px-3 py-1 rounded text-xs font-medium ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-300 hover:bg-slate-400 text-slate-700'}`}>Clear</button>
                      <button onClick={() => copy(getAdminNote(n.id), 'admin-' + n.id)} className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium">{copiedId === 'admin-' + n.id ? <><Check className="w-4 h-4" />Copied</> : <><Copy className="w-4 h-4" />Copy</>}</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input type="text" placeholder="Link to post" value={n.data.link ?? ''} onChange={(e) => updateAdminNote(n.id, 'link', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                    <select
                      value={customViolation[n.id] ? '__custom__' : (violationOptions.some(o => o.value === n.data.violation) ? n.data.violation : '__custom__')}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setCustomViolation(prev => ({ ...prev, [n.id]: true }));
                          updateAdminNote(n.id, 'violation', '');
                        } else {
                          setCustomViolation(prev => ({ ...prev, [n.id]: false }));
                          updateAdminNote(n.id, 'violation', e.target.value);
                        }
                      }}
                      className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300'}`}
                    >
                      {violationOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    {(customViolation[n.id] || (!violationOptions.some(o => o.value === n.data.violation) && n.data.violation !== '')) && (
                      <input type="text" placeholder="Enter custom violation..." value={n.data.violation ?? ''} onChange={(e) => updateAdminNote(n.id, 'violation', e.target.value)} className={`w-full px-3 py-2 text-sm border rounded ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300'}`} />
                    )}
                    <div className={`rounded-lg p-3 border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}><pre className={`text-xs whitespace-pre-wrap font-mono ${text2}`}>{getAdminNote(n.id)}</pre></div>
                  </div>
                </div>
              ))}
            </div>
            );
          }}
        ].map(s => (
          <div key={s.key} ref={s.key === 'admin' ? adminSectionRef : undefined} className={`${card} rounded-lg shadow p-4 mb-6 border ${border}`}>
            <button onClick={() => setShowSection({...showSection, [s.key]: !showSection[s.key as keyof typeof showSection]})} className="w-full flex items-center justify-between mb-3">
              <h3 className={`font-semibold ${text1}`}>{s.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${text2}`}>{showSection[s.key as keyof typeof showSection] ? 'Hide' : 'Show'}</span>
                <ChevronDown className={`w-5 h-5 ${text2} transition-transform duration-200 ${showSection[s.key as keyof typeof showSection] ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {showSection[s.key as keyof typeof showSection] && s.render()}
          </div>
        ))}

        {/* Notepad */}
        <div className={`${card} rounded-lg shadow p-4 mb-6 border ${border}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <h3 className={`font-semibold ${text1}`}>Shift Notes</h3>
            </div>
            <button onClick={() => setNotepad('')} className={`px-3 py-1 rounded text-xs font-medium ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>Clear</button>
          </div>
          <textarea
            value={notepad}
            onChange={(e) => setNotepad(e.target.value)}
            placeholder="Jot down usernames to watch, pending escalations, reminders..."
            rows={6}
            className={`w-full px-3 py-2 text-sm border rounded resize-y ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400'}`}
          />
          <p className={`text-xs mt-1 ${text2}`}>Notes are saved automatically and persist until cleared.</p>
        </div>

        {/* Footer */}
        <div className={`rounded-lg shadow p-4 text-center text-sm ${card} ${text2} border ${border}`}>
          <p>Contact: <a href="mailto:tuna.yilmaz@ignitetech.com" className="text-yellow-500 underline">tuna.yilmaz@ignitetech.com</a></p>
          <p className="mt-2 text-xs">Version 1.0.0 - eBay Deutschland 🇩🇪</p>
        </div>

      </div>
    </div>
  );
};

export default ModerationToolGermany;
