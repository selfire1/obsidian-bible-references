import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface BibleReferencesSettings {
  bibleFolder: string;
  customLinkScheme: string;
  foldersEnabled: boolean;
}

function fixBibleReferences(app) {
  let BOOKS:any = {
    'Genesis': /Genesis|Gen\.?|Ge\.?|Gn\.?/,
    'Exodus': /Exodus|Ex\.?|Exod\.?|Exo\.?/,
    'Leviticus': /Leviticus|Lev\.?|Le\.?|Lv\.?/,
    'Numbers': /Numbers|Num\.?|Nu\.?|Nm\.?|Nb\.?/,
    'Deuteronomy': /Deuteronomy|Deut\.?|De\.?|Dt\.?/,
    'Joshua': /Joshua|Josh\.?|Jos\.?|Jsh\.?/,
    'Judges': /Judges|Judg\.?|Jdg\.?|Jg\.?|Jdgs\.?/,
    'Ruth': /Ruth|Ruth|Rth\.?|Ru\.?/,
    '1 Samuel': /1 Samuel|1 Sam\.?|1 Sm\.?|1 Sa\.?|1 S\.?|I Sam\.?|I Sa\.?|1Sam\.?|1Sa\.?|1S\.?|1st Samuel|1st Sam\.?|First Samuel|First Sam\.?/,
    '2 Samuel': /2 Samuel|2 Sam\.?|2 Sm\.?|2 Sa\.?|2 S\.?|II Sam\.?|II Sa\.?|2Sam\.?|2Sa\.?|2S\.?|2nd Samuel|2nd Sam\.?|Second Samuel|Second Sam\.?/,
    '1 Kings': /1 Kings|1 Kings|1 Kgs|1 Ki|1Kgs|1Kin|1Ki|1K|I Kgs|I Ki|1st Kings|1st Kgs|First Kings|First Kgs/,
    '2 Kings': /2 Kings|2 Kings|2 Kgs\.?|2 Ki\.?|2Kgs\.?|2Kin\.?|2Ki\.?|2K\.?|II Kgs\.?|II Ki\.?|2nd Kings|2nd Kgs\.?|Second Kings|Second Kgs\.?/,
    '1 Chronicles': /1 Chronicles|1 Chron\.?|1 Chr\.?|1 Ch\.?|1Chron\.?|1Chr\.?|1Ch\.?|I Chron\.?|I Chr\.?|I Ch\.?|1st Chronicles|1st Chron\.?|First Chronicles|First Chron\.?/,
    '2 Chronicles': /2 Chronicles|2 Chron\.?|2 Chr\.?|2 Ch\.?|2Chron\.?|2Chr\.?|2Ch\.?|II Chron\.?|II Chr\.?|II Ch\.?|2nd Chronicles|2nd Chron\.?|Second Chronicles|Second Chron\.?/,
    'Ezra': /Ezra|Ezra|Ezr\.?|Ez\.?/,
    'Nehemiah': /Nehemiah|Neh\.?|Ne\.?/,
    'Esther': /Esther|Est\.?|Esth\.?|Es\.?/,
    'Job': /Job|Job|Jb\.?/,
    'Psalms': /Psalms|Ps\.?|Psalm|Pslm\.?|Psa\.?|Psm\.?|Pss\.?/,
    'Proverbs': /Proverbs|Prov|Pro\.?|Prv\.?|Pr\.?/,
    'Ecclesiastes': /Ecclesiastes|Eccles\.?|Eccle\.?|Ecc\.?|Ec\.?|Qoh\.?/,
    'Song of Solomon': /Song of Solomon|Song|Song of Songs|SOS\.?|So\.?|Canticle of Canticles|Canticles|Cant\.?/,
    'Isaiah': /Isaiah|Isa\.?|Is\.?/,
    'Jeremiah': /Jeremiah|Jer\.?|Je\.?|Jr\.?/,
    'Lamentations': /Lamentations|Lam\.?|La\.?/,
    'Ezekiel': /Ezekiel|Ezek\.?|Eze\.?|Ezk\.?/,
    'Daniel': /Daniel|Dan\.?|Da\.?|Dn\.?/,
    'Hosea': /Hosea|Hos\.?|Ho\.?/,
    'Joel': /Joel|Joel|Jl\.?/,
    'Amos': /Amos|Amos|Am\.?/,
    'Obadiah': /Obadiah|Obad\.?|Ob\.?/,
    'Jonah': /Jonah|Jonah|Jnh\.?|Jon\.?/,
    'Micah': /Micah|Mic\.?|Mc\.?/,
    'Nahum': /Nahum|Nah\.?|Na\.?/,
    'Habakkuk': /Habakkuk|Hab\.?|Hb\.?/,
    'Zephaniah': /Zephaniah|Zeph\.?|Zep\.?|Zp\.?/,
    'Haggai': /Haggai|Hag\.?|Hg\.?/,
    'Zechariah': /Zechariah|Zech\.?|Zec\.?|Zc\.?/,
    'Malachi': /Malachi|Mal\.?|Ml\.?/,
    'Matthew': /Matthew|Matt\.?|Mt\.?/,
    'Mark': /Mark|Mark|Mrk|Mk|Mr/,
    'Luke': /Luke|Luke|Luk|Lk/,
    'John': /John|John|Joh|Jhn|Jn/,
    'Acts': /Acts|Acts|Act|Ac/,
    'Romans': /Romans|Rom\.?|Ro\.?|Rm\.?/,
    '1 Corinthians': /1 Corinthians|1 Cor\.?|1 Co\.?|I Cor\.?|I Co\.?|1Cor\.?|1Co\.?|I Corinthians|1Corinthians|1st Corinthians|2nd Corinthians/,
    '2 Corinthians': /2 Corinthians|2 Cor\.?|2 Co\.?|II Cor\.?|II Co\.?|2Cor\.?|2Co\.?|II Corinthians|2Corinthians|2nd Corinthians|Second Corinthians/,
    'Galatians': /Galatians|Gal\.?|Ga\.?/,
    'Ephesians': /Ephesians|Eph\.?|Ephes\.?/,
    'Philippians': /Philippians|Phil\.?|Php\.?|Pp\.?/,
    'Colossians': /Colossians|Col\.?|Co\.?/,
    '1 Thessalonians': /1 Thessalonians|1 Thess\.?|1 Thes\.?|1 Th\.?|I Thessalonians|I Thess\.?|I Thes\.?|I Th\.?|1Thessalonians|1Thess\.?|1Thes\.?|1Th\.?|1st Thessalonians|1st Thess\.?|First Thessalonians|First Thess\.?/,
    '2 Thessalonians': /2 Thessalonians|2 Thess\.?|2 Thes\.?|II Thessalonians|II Thess\.?|II Thes\.?|II Th\.?|2Thessalonians|2Thess\.?|2Thes\.?|2Th\.?|2nd Thessalonians|2nd Thess\.?|Second Thessalonians|Second Thess\.?/,
    '1 Timothy': /1 Timothy|1 Tim\.?|1 Ti\.?|I Timothy|I Tim\.?|I Ti\.?|1Timothy|1Tim\.?|1Ti\.?|1st Timothy|1st Tim\.?|First Timothy|First Tim\.?/,
    '2 Timothy': /2 Timothy|2 Tim\.?|2 Ti\.?|II Timothy|II Tim\.?|II Ti\.?|2Timothy|2Tim\.?|2Ti\.?|2nd Timothy|2nd Tim\.?|Second Timothy|Second Tim\.?/,
    'Titus': /Titus|Titus|Tit|ti/,
    'Philemon': /Philemon|Philem\.?|Phm\.?|Pm\.?/,
    'Hebrews': /Hebrews|Heb\.?/,
    'James': /James|James|Jas|Jm/,
    '1 Peter': /1 Peter|1 Pet\.?|1 Pe\.?|1 Pt\.?|1 P\.?|I Pet\.?|I Pt\.?|I Pe\.?|1Peter|1Pet\.?|1Pe\.?|1Pt\.?|1P\.?|I Peter|1st Peter|First Peter/,
    '2 Peter': /2 Peter|2 Pet\.?|2 Pe\.?|2 Pt\.?|2 P\.?|II Peter|II Pet\.?|II Pt\.?|II Pe\.?|2Peter|2Pet\.?|2Pe\.?|2Pt\.?|2P\.?|2nd Peter|Second Peter/,
    '1 John': /1 John|1 John|1 Jhn\.?|1 Jn\.?|1 J\.?|1John|1Jhn\.?|1Joh\.?|1Jn\.?|1Jo\.?|1J\.?|I John|I Jhn\.?|I Joh\.?|I Jn\.?|I Jo\.?|1st John|First John/,
    '2 John': /2 John|2 John|2 Jhn\.?|2 Jn\.?|2 J\.?|2John|2Jhn\.?|2Joh\.?|2Jn\.?|2Jo\.?|2J\.?|II John|II Jhn\.?|II Joh\.?|II Jn\.?|II Jo\.?|2nd John|Second John/,
    '3 John': /3 John|3 John|3 Jhn\.?|3 Jn\.?|3 J\.?|3John|3Jhn\.?|3Joh\.?|3Jn\.?|3Jo\.?|3J\.?|III John|III Jhn\.?|III Joh\.?|III Jn\.?|III Jo\.?|3rd John|Third John/,
    'Jude': /Jude|Jude|Jud\.?|Jd\.?/,
    'Revelation': /Revelation|Rev|Re|The Revelation/
  }

  let verseRegex = /((?:\d )?\w+) (\d+)(?::(\d+)(?:-(\d+))?)?/g;

  let normalize_book = function(attempt: string) {
    for (let book in BOOKS) {
      if (attempt.match(BOOKS[book])) {
        return book;
      }
    }
    throw "Book not found, " + attempt;
  }

  let is_book = function(attempt: string) {
    for (let book in BOOKS) {
      if (attempt.match(BOOKS[book])) {
        return true;
      }
    }
    return false;
  }

  let prefix = function(str: any, pre: string) {
    if (str) {
      return `${pre}${str}`;
    }
    else {
      return "";
    }
  }

  let wikiBible = function(b: { book: any; chapter: any; verse: any; ref: any; }) {
    /*
      Replaces a custom pattern like "{{book}}/{{book}}-{{chapter}}#{{verse}}|{{input}}"
      with the variables stored.
    */

    // There is surely a prettier way to do this – maybe objects?
    let toReplace = ["{{book}}", "{{chapter}}", "{{verse}}", "{{input}}"]
    let replaceWith = [`${b.book}`, `${b.chapter}`, `${b.verse}`, `${b.ref}`]


    for (let i = 0; i <= toReplace.length; i++){
      if (i === 0) {
        // For the first iteration, pull the custom pattern in the settings
        var linkPattern = this.plugin.settings.customLinkScheme;
      }
      // Replace custom patterns with the variables
      var linkPattern:any = linkPattern.replaceAll(toReplace[i], replaceWith[i])
    }

    if (this.plugin.settings.foldersEnabled && this.plugin.settings.bibleFolder !== '') {
      // If folders are enabled, add the folder in front

      // Delete unnecessary '/' if that's the first character
      let bibleFolder:any = this.plugin.settings.bibleFolder
      bibleFolder.value = bibleFolder.replace(/^\//, '');

      // Prefixes the link pattern with the bible folder and the name of the book
      return bibleFolder + "/" + `${b.book}/` + linkPattern

    } else {
      // If folders aren't enabled, don't add a folder
      return linkPattern

      }

  }

  let view = app.workspace.activeLeaf.view;
  let content = view.data
  for (let match of content.matchAll(verseRegex)) {
    let [str, book, chapter, startVerse, _endVerse] = match;
    if (is_book(book)) {
      let ref = {book: normalize_book(book), chapter: chapter, verse: startVerse, ref: str};
      content = content.replace(str, wikiBible(ref))
    }
  }
  app.vault.modify(view.file, content);
}

const DEFAULT_SETTINGS: BibleReferencesSettings = {
  customLinkScheme: 'default',
  foldersEnabled: false,
  bibleFolder: 'default'
}

export default class BibleReferences extends Plugin {
  settings: BibleReferencesSettings;

  async onload() {
    console.log('loading plugin');

    await this.loadSettings();

    this.addCommand({
      id: 'fix-bible-references',
      name: 'Replace',
      callback: () => {
        fixBibleReferences(this.app)
      },
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));
  }

  onunload() {
    console.log('unloading plugin');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: BibleReferences;

  constructor(app: App, plugin: BibleReferences) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let {containerEl} = this;

    containerEl.empty();

    containerEl.createEl('h2', {text: 'Bible References'});

    new Setting(containerEl)
      .setName("Include folder in links.")
      .setDesc("Turn folders (e.g. [[ESV/…]]) in links on or off.")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.foldersEnabled);
        toggle.onChange(async (value) => {
          console.log('Folders in links: ' + value);
          this.plugin.settings.foldersEnabled = value;
          await this.plugin.saveSettings();
          // Force refresh
          this.display();
        });
      });

    if (this.plugin.settings.foldersEnabled){
    new Setting(containerEl)
      .setName('Path to Bible Folder')
      .setDesc('Enter the path to the Bible Folder.')
      .addText(text => text
        .setPlaceholder('BibleFolder')
        .setValue('')
        .onChange(async (value) => {
          console.log('Bible Folder: ' + value);
          this.plugin.settings.bibleFolder = value;
          await this.plugin.saveSettings();
        }));
    }

    new Setting(containerEl)
      .setName('Bible Reference pattern')
      .setDesc('Enter the pattern that should replace the input. Supported: {{book}}, {{chapter}}, {{verse}}, {{endverse}}, {{input}}.')
      .addText(text => text
        .setPlaceholder('Link pattern')
        .setValue('{{book}}/{{book}}-{{chapter}}#{{verse}}|{{input}}')
        .onChange(async (value) => {
          console.log('Linkpattern: ' + value);
          this.plugin.settings.customLinkScheme = value;
          await this.plugin.saveSettings();
        }));

    }
  }

