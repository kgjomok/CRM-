import React, { useState } from 'react';
import { 
  Star, 
  Calendar, 
  Briefcase, 
  Globe, 
  Check, 
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
  BookOpen,
  CheckCircle,
  Clock,
  UserCheck,
  Building,
  Heart
} from 'lucide-react';
import { Language, translate } from '../lib/translations';

interface SpecialistsShowcaseProps {
  lang: Language;
  onBookSpecialist: (staffId: string) => void;
}

interface SpecialistTranslations {
  name: string;
  specialization: string;
  bio: string;
  languages: string;
  workingDays: string;
  services: string[];
  education: string;
  certifications: string;
  achievements: string;
  skills: string[];
  whyChoose: string;
}

interface SpecialistItem {
  id: string;
  rating: number;
  experience: number;
  completedProcedures: number;
  avatar: string;
  translations: Record<Language, SpecialistTranslations>;
}

const SPECIALISTS: SpecialistItem[] = [
  {
    id: 'stf-1',
    rating: 5.0,
    experience: 8,
    completedProcedures: 1240,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    translations: {
      kg: {
        name: 'Д-р Бакыт Мамытов',
        specialization: 'Ортодонт-Стоматолог',
        bio: 'Тиштерди түздөө жана тиш тиштеш көйгөйлөрүн чечүү боюнча жогорку даражадагы адис. Заманбап брекет-тутумдары менен иштейт.',
        languages: 'Кыргызча, Орусча, Англисче',
        workingDays: 'Дүйшөмбү - Жума, 09:00 - 18:00',
        services: ['Брекет коюу', 'Ортодонтиялык консультация', 'Тиш катарларын түздөө'],
        education: 'И.К. Ахунбаев атындагы КММА, Стоматология факультети, 2018-ж.',
        certifications: 'Эл аралык Ортодонтиялык Ассоциациясынын сертификаты (Түштүк Корея, Сеул, 2021); "Заманбап Damon брекет тутумдары" курсу (Москва, 2022).',
        achievements: 'Кыргызстанда 800дөн ашык бейтаптын тиштерин ийгиликтүү түздөгөн. Ортодонттордун республикалык симпозиумунун активдүү спикери.',
        skills: ['Damon тутумдары менен дарылоо', 'Элайнерлерди пландаштыруу', '3D моделдөө', 'Балдардын тиш тиштешин оңдоо'],
        whyChoose: 'Дарылоонун санариптик 3D моделдөөсүн колдонот. Кардар натыйжаны алдын ала көрө алат.'
      },
      ru: {
        name: 'Д-р Бакыт Мамытов',
        specialization: 'Ортодонт-Стоматолог',
        bio: 'Специалист высокой квалификации по выравниванию зубов и исправлению прикуса. Работает с современными брекет-системами.',
        languages: 'Кыргызский, Русский, Английский',
        workingDays: 'Понедельник - Пятница, 09:00 - 18:00',
        services: ['Установка брекетов', 'Ортодонтическая консультация', 'Выравнивание зубного ряда'],
        education: 'КГМА им. И.К. Ахунбаева, Стоматологический факультет, 2018 г.',
        certifications: 'Сертификат Международной Ортодонтической Ассоциации (Сеул, Южная Корея, 2021); курс "Современные брекет-системы Damon" (Москва, 2022).',
        achievements: 'Успешно исправил прикус более чем 800 пациентам в Кыргызстане. Активный спикер республиканского симпозиума ортодонтов.',
        skills: ['Лечение системами Damon', 'Планирование элайнеров', '3D клиническое моделирование', 'Исправление прикуса у детей'],
        whyChoose: 'Использует передовое цифровое 3D-моделирование лечения, что позволяет увидеть будущую улыбку еще до начала терапии.'
      },
      en: {
        name: 'Dr. Bakyt Mamytov',
        specialization: 'Orthodontist-Dentist',
        bio: 'Highly qualified specialist in teeth alignment and bite correction. Works with modern brace systems.',
        languages: 'Kyrgyz, Russian, English',
        workingDays: 'Monday - Friday, 09:00 - 18:00',
        services: ['Braces installation', 'Orthodontic consultation', 'Teeth alignment'],
        education: 'I.K. Akhunbaev Kyrgyz State Medical Academy, Faculty of Dentistry, 2018.',
        certifications: 'International Orthodontic Association Certificate (Seoul, South Korea, 2021); "Modern Damon Bracket Systems" Course (Moscow, 2022).',
        achievements: 'Successfully aligned teeth for over 800 patients in Kyrgyzstan. Active speaker at the national orthodontics symposium.',
        skills: ['Treatment with Damon systems', 'Clear aligner planning', '3D clinical modeling', 'Pediatric orthodontic correction'],
        whyChoose: 'Applies cutting-edge digital 3D-modelling, allowing patients to preview their perfect smile before beginning treatment.'
      }
    }
  },
  {
    id: 'stf-2',
    rating: 4.9,
    experience: 6,
    completedProcedures: 1850,
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300',
    translations: {
      kg: {
        name: 'Айсулуу Асанова',
        specialization: 'Дерматолог-Косметолог',
        bio: 'Терини жашартуу жана кам көрүү боюнча кесипкөй косметолог. Пилинг, бет тазалоо жана заманбап аппараттык косметология менен алектенет.',
        languages: 'Кыргызча, Орусча',
        workingDays: 'Шейшемби - Ишемби, 10:00 - 19:00',
        services: ['Бетти терең тазалоо', 'Биоревитализация', 'Химиялык пилинг'],
        education: 'Кыргыз-Россия Славян Университети (КРСУ), Медицина факультети, Дерматовенерология багыты, 2020-ж.',
        certifications: 'Лазердик косметология жана тери терапиясы боюнча эл аралык сертификаттар (Дубай, 2022; Стамбул, 2023).',
        achievements: 'Түрдүү тери маселелеринен арылтуу боюнча 1800дөн ашык ийгиликтүү процедура жасаган. Клиникадагы тери курагын калыбына келтирүү лидери.',
        skills: ['Аппараттык косметология', 'Инъекциялык плазмолифтинг', 'Пигментацияны дарылоо', 'Курактык тери терапиясы'],
        whyChoose: 'Теринин ден соолугун ичтен жана сырттан калыбына келтирүүчү комплекстүү медициналык мамиле жасайт.'
      },
      ru: {
        name: 'Айсулуу Асанова',
        specialization: 'Дерматолог-Косметолог',
        bio: 'Профессиональный косметолог по омоложению и уходу за кожей. Занимается пилингом, чисткой лица и современной аппаратной косметологией.',
        languages: 'Кыргызский, Русский',
        workingDays: 'Вторник - Суббота, 10:00 - 19:00',
        services: ['Глубокая чистка лица', 'Биоревитализация', 'Химический пилинг'],
        education: 'Кыргызско-Российский Славянский Университет (КРСУ), Медицинский факультет, специальность Дерматовенерология, 2020 г.',
        certifications: 'Международные сертификаты по лазерной косметологии и дерматотерапии (Дубай, 2022; Стамбул, 2023).',
        achievements: 'Провела более 1800 успешных косметологических сеансов. Признанный лидер клиники по безоперационному омоложению кожи.',
        skills: ['Аппаратная терапия', 'Инъекционный плазмолифтинг', 'Лечение гиперпигментации', 'Anti-age терапия лица'],
        whyChoose: 'Использует комплексный медицинский подход, восстанавливающий здоровье кожи как снаружи, так и на клеточном уровне.'
      },
      en: {
        name: 'Aisuluu Asanova',
        specialization: 'Dermatologist-Cosmetologist',
        bio: 'Professional cosmetologist for skin rejuvenation and care. Specializes in peeling, facial cleaning, and modern hardware cosmetology.',
        languages: 'Kyrgyz, Russian',
        workingDays: 'Tuesday - Saturday, 10:00 - 19:00',
        services: ['Facial deep cleaning', 'Biorevitalization', 'Chemical peeling'],
        education: 'Kyrgyz-Russian Slavic University (KRSU), Medical Faculty, Residency in Dermatoveneorology, 2020.',
        certifications: 'International Certification in Laser Cosmetology and Dermatotherapy (Dubai, 2022; Istanbul, 2023).',
        achievements: 'Conducted over 1,800 successful aesthetic procedures. Ranked as the top non-surgical skin rejuvenation expert in our clinic.',
        skills: ['Hardware cosmetology', 'Platelet-rich plasma injection', 'Hyperpigmentation correction', 'Anti-aging skin therapies'],
        whyChoose: 'Utilizes an advanced medical-grade aesthetic approach that targets skin vitality and health from both inside and out.'
      }
    }
  },
  {
    id: 'stf-3',
    rating: 5.0,
    experience: 12,
    completedProcedures: 2300,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300',
    translations: {
      kg: {
        name: 'Д-р Улан Кадыров',
        specialization: 'Хирург-Стоматолог',
        bio: 'Оорутпай тиш алуу жана сапаттуу импланттарды орнотуу боюнча 12 жылдык тажрыйбага ээ. Эң татаал хирургиялык дарылоолорду жасайт.',
        languages: 'Кыргызча, Орусча',
        workingDays: 'Дүйшөмбү, Шаршемби, Жума, 09:00 - 17:00',
        services: ['Тиш имплантациясы', 'Тиш алуу (оорутпай)', 'Хирургиялык пландаштыруу'],
        education: 'И.К. Ахунбаев атындагы КММА, Ординатура - Хирургиялык стоматология, 2014-ж.',
        certifications: 'Имплантологдордун бүткүл дүйнөлүк конгрессинин диплому (Германия, Мюнхен, 2019); Синус-лифтинг жана сөөк пластикасы боюнча сертификат (Москва, 2021).',
        achievements: '2300дөн ашык импланттарды кемчиликсиз орноткон. Сөөк ткандарын калыбына келтирүү боюнча татаал операцияларды өздөштүргөн.',
        skills: ['Сөөк трансплантациясы', 'Тиш импланттарын орнотуу', 'Азуу тиштерди татаал алып салуу', 'Синус-лифтинг'],
        whyChoose: 'Эң заманбап наркоз жана оорутпоо тутумдарын колдонот. Хирургиялык процедураларды коркунучсуз жана тез бүтүрөт.'
      },
      ru: {
        name: 'Д-р Улан Кадыров',
        specialization: 'Хирург-Стоматолог',
        bio: 'Имеет 12-летний опыт безболезненного удаления зубов и установки качественных имплантов. Проводит сложнейшие хирургические операции.',
        languages: 'Кыргызский, Русский',
        workingDays: 'Понедельник, Среда, Пятница, 09:00 - 17:00',
        services: ['Имплантация зубов', 'Удаление зубов (безболезненно)', 'Хирургическое планирование'],
        education: 'КГМА им. И.К. Ахунбаева, Ординатура по специальности Хирургическая стоматология, 2014 г.',
        certifications: 'Диплом Всемирного Конгресса Имплантологов (Мюнхен, Германия, 2019); Сертификат по синус-лифтингу и костной пластике (Москва, 2021).',
        achievements: 'Успешно установил более 2300 имплантов с приживаемостью 99.2%. Проводит сложнейшие реконструкции челюсти.',
        skills: ['Костная регенерация', 'Установка имплантационных систем', 'Сложное удаление зубов мудрости', 'Закрытый и открытый синус-лифтинг'],
        whyChoose: 'Применяет передовые методики анестезии и седации, гарантирующие абсолютное отсутствие боли и страха во время операции.'
      },
      en: {
        name: 'Dr. Ulan Kadyrov',
        specialization: 'Surgeon-Dentist',
        bio: 'Has 12 years of experience in painless tooth extraction and high-quality implant placement. Conducts complex surgical treatments.',
        languages: 'Kyrgyz, Russian',
        workingDays: 'Monday, Wednesday, Friday, 09:00 - 17:00',
        services: ['Dental implantation', 'Tooth extraction (painless)', 'Surgical planning'],
        education: 'I.K. Akhunbaev KSMA, Residency in Surgical Dentistry, 2014.',
        certifications: 'Diploma of the World Congress of Oral Implantologists (Munich, Germany, 2019); Advanced Bone Grafting and Sinus Lift Certification (Moscow, 2021).',
        achievements: 'Installed over 2,300 implants with an exceptional 99.2% success rate. Expert in reconstructive jaw surgeries.',
        skills: ['Bone tissue transplantation', 'Implant system placement', 'Complex wisdom teeth extractions', 'Open & closed sinus lifts'],
        whyChoose: 'Employs micro-surgical techniques and advanced sedation, eliminating anxiety and delivering absolute patient comfort.'
      }
    }
  },
  {
    id: 'stf-4',
    rating: 4.9,
    experience: 9,
    completedProcedures: 1420,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    translations: {
      kg: {
        name: 'Назира Токтобаева',
        specialization: 'Трихолог-Адис',
        bio: 'Чачтын түшүүсүн алдын алуу жана баштын терисин дарылоо боюнча тажрыйбалуу трихолог адис. Заманбап терапияларды колдонот.',
        languages: 'Кыргызча, Орусча, Англисче',
        workingDays: 'Дүйшөмбү, Шейшемби, Бейшемби, Жума, 09:00 - 18:00',
        services: ['Чачтын микроскопиялык диагностикасы', 'Мезотерапия (баш териси)', 'Алопецияны комплекстүү дарылоо'],
        education: 'Кыргыз Мамлекеттик Медициналык Академиясы (КММА), Жалпы медицина, 2015-ж.',
        certifications: 'Трихологиялык изилдөөлөр жана чач терапиясы боюнча эл аралык тажрыйбадан өтүү (Түштүк Корея, Сеул, 2018; Москва, 2021).',
        achievements: 'Чачтын жана баш терисинин ден соолугу калыбына келтирилген 1400дөн ашык бейтаптын ыраазычылыгы. Илимий трихологдор биримдигинин мүчөсү.',
        skills: ['Чач тамырын фототрихограммалык изилдөө', 'Плазмотерапия (PRP)', 'Баш терисин пилингдөө', 'Алопецияны эрте аныктоо'],
        whyChoose: 'Заманбап аппараттык диагностика менен чачтын түшүүсүнүн чыныгы ички себептерин таап, комплекстүү дарылайт.'
      },
      ru: {
        name: 'Назира Токтобаева',
        specialization: 'Трихолог-Адис',
        bio: 'Опытный трихолог по предотвращению выпадения волос и лечению кожи головы. Использует современные методы терапии.',
        languages: 'Кыргызский, Русский, Английский',
        workingDays: 'Понедельник, Вторник, Четверг, Пятница, 09:00 - 18:00',
        services: ['Микроскопическая диагностика волос', 'Мезотерапия кожи головы', 'Комплексное лечение алопеции'],
        education: 'Кыргызская Государственная Медицинская Академия (КГМА), Лечебное дело, 2015 г.',
        certifications: 'Стажировки по трихологии и трихотерапии (Сеул, Южная Корея, 2018; Москва, 2021).',
        achievements: 'Помогла восстановить густоту и здоровье волос более 1400 пациентам. Член Евразийской Трихологической Ассоциации.',
        skills: ['Фототрихограмма (компьютерный анализ)', 'Плазмотерапия кожи головы (PRP)', 'Лечение себорейного дерматита', 'Терапия всех видов алопеции'],
        whyChoose: 'Использует высокоточную трихоскопию для выявления скрытых причин выпадения волос и подбирает лечебную схему индивидуально.'
      },
      en: {
        name: 'Nazira Toktobaeva',
        specialization: 'Trichologist & Hair Specialist',
        bio: 'Experienced trichologist in hair loss prevention and scalp treatment. Utilizes modern therapy methods.',
        languages: 'Kyrgyz, Russian, English',
        workingDays: 'Monday, Tuesday, Thursday, Friday, 09:00 - 18:00',
        services: ['Microscopic hair diagnostics', 'Scalp mesotherapy', 'Comprehensive alopecia therapy'],
        education: 'Kyrgyz State Medical Academy (KSMA), General Medicine, 2015.',
        certifications: 'International Fellowship in Advanced Trichology & Scalp Medicine (Seoul, South Korea, 2018; Moscow, 2021).',
        achievements: 'Successfully restored hair density and health for over 1,400 patients. Proud member of the Eurasian Association of Trichology.',
        skills: ['Phototrichogram digital analysis', 'PRP hair growth restoration', 'Seborrheic dermatitis control', 'Advanced alopecia management'],
        whyChoose: 'Applies precise diagnostic trichoscopy to uncover internal causes of hair problems and builds a custom recovery plan.'
      }
    }
  },
  {
    id: 'stf-5',
    rating: 4.9,
    experience: 7,
    completedProcedures: 1620,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300',
    translations: {
      kg: {
        name: 'Рустам Алиев',
        specialization: 'Мануалдык терапевт-Массажист',
        bio: 'Муундарды жана омуртканы калыбына келтирүү, терапиялык массаж боюнча адис. Арка жана бел ооруларын эффективдүү дарылайт.',
        languages: 'Кыргызча, Орусча',
        workingDays: 'Дүйшөмбү, Шаршемби, Жума, Ишемби, 09:00 - 18:00',
        services: ['Омуртканы мануалдык оңдоо', 'Терең ткандарды укалоо', 'Спорттук калыбына келтирүү терапиясы'],
        education: 'Бишкек медициналык колледжи (БМК), Реабилитология жана физиотерапия багыты, 2017-ж.',
        certifications: 'Профессионалдык мануалдык терапия жана спорт массажы боюнча тереңдетилген сертификатталган курстар (Алматы, 2019; Новосибирск, 2021).',
        achievements: 'Спортчуларды травмадан кийин калыбына келтирүү жана омуртка ооруларын айыктыруу боюнча 1600дөн ашык ийгиликтүү натыйжалар.',
        skills: ['Остеопатикалык ыкмалар', 'Терең ткандарды мануалдык укалоо', 'Травмадан кийинки реабилитация', 'Кинезиотейпинг'],
        whyChoose: 'Ооруну гана баспастан, муундардын туура физиологиялык кыймылын жана булчуңдардын балансын толугу менен калыбына келтирет.'
      },
      ru: {
        name: 'Рустам Алиев',
        specialization: 'Мануалдык терапевт-Массажист',
        bio: 'Специалист по реабилитации суставов и позвоночника, лечебному массажу. Эффективно лечит боли в спине и пояснице.',
        languages: 'Кыргызский, Русский',
        workingDays: 'Понедельник, Среда, Пятница, Суббота, 09:00 - 18:00',
        services: ['Мануальная коррекция позвоночника', 'Глубокий массаж тканей', 'Спортивная реабилитационная терапия'],
        education: 'Бишкекский Медицинский Колледж (БМК), специальность Реабилитология и физиотерапия, 2017 г.',
        certifications: 'Сертифицированные курсы по профессиональной мануальной терапии и спортивному массажу (Алматы, 2019; Новосибирск, 2021).',
        achievements: 'Более 1600 пациентов избавились от болей в пояснице и шее. Опыт успешной реабилитации профессиональных атлетов.',
        skills: ['Остеопатические техники', 'Глубокий массаж триггерных зон', 'Посттравматическая гимнастика', 'Кинезиотейпирование'],
        whyChoose: 'Устраняет первопричину болей за счет бережного восстановления подвижности суставов и снятия спазмов.'
      },
      en: {
        name: 'Rustam Aliev',
        specialization: 'Chiropractor & Massage Therapist',
        bio: 'Specialist in joint and spine rehabilitation, therapeutic massage. Effectively treats back and lower back pain.',
        languages: 'Kyrgyz, Russian',
        workingDays: 'Monday, Wednesday, Friday, Saturday, 09:00 - 18:00',
        services: ['Manual spine correction', 'Deep tissue massage', 'Sports rehabilitation therapy'],
        education: 'Bishkek Medical College (BMC), Specialization in Physiotherapy and Rehabilitation, 2017.',
        certifications: 'Advanced Clinical Certifications in Chiropractic adjustments & Sports massage (Almaty, 2019; Novosibirsk, 2021).',
        achievements: 'Helped over 1,600 clients recover from chronic back pain. Trusted rehab specialist for national athletes.',
        skills: ['Osteopathic manipulation techniques', 'Trigger point therapy', 'Myofascial release', 'Kinesiology taping'],
        whyChoose: 'Focuses on structural alignment and physiological balance, helping you regain smooth pain-free movement quickly.'
      }
    }
  },
  {
    id: 'stf-6',
    rating: 5.0,
    experience: 10,
    completedProcedures: 2150,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
    translations: {
      kg: {
        name: 'Д-р Елена Попова',
        specialization: 'Эстетикалык медицина адиси',
        bio: 'Бет пластикасы, инъекциялык косметология жана теринин жаштыгын калыбына келтирүү боюнча эл аралык тажрыйбасы бар адис.',
        languages: 'Орусча, Англисче',
        workingDays: 'Шейшемби, Шаршемби, Жума, Ишемби, 10:00 - 19:00',
        services: ['Бет контурдук пластикасы', 'Жашартуучу инъекциялар (Ботокс)', 'Плазмолифтинг (PRP)'],
        education: 'Кыргыз Мамлекеттик Медициналык Академиясы (КММА), Жалпы дарыгерлик, 2012-ж.; Дерматокосметология боюнча адистештирилген интернатура, КРСУ, 2014-ж.',
        certifications: 'Эстетикалык медицина жана контурдук пластика боюнча эл аралык сертификаттар (Франция, Париж, 2017; Швейцария, Женева, 2021).',
        achievements: '2100дөн ашык ийгиликтүү инъекциялык процедуралар. Эл аралык бет пластикасын коррекциялоо конгрессинин туруктуу мүчөсү.',
        skills: ['Беттин 3D контурдук пластикасы', 'Ботулинотерапия (бырыштарды кетирүү)', 'Мезожиптерди орнотуу', 'Коллаген стимуляциялоо'],
        whyChoose: 'Заманбап европалык стандарттарды колдонуу менен териге минималдуу таасир тийгизип, табигый сулуулукту жана жаштыкты калыбына келтирет.'
      },
      ru: {
        name: 'Д-р Елена Попова',
        specialization: 'Эстетикалык медицина адиси',
        bio: 'Специалист международного уровня по контурной пластике лица, инъекционной косметологии и восстановлению молодости кожи.',
        languages: 'Русский, Английский',
        workingDays: 'Вторник, Среда, Пятница, Суббота, 10:00 - 19:00',
        services: ['Контурная пластика лица', 'Омолаживающие инъекции (Ботокс)', 'Плазмолифтинг (PRP-терапия)'],
        education: 'КГМА им. И.К. Ахунбаева, специальность Лечебное дело, 2012 г.; ординатура по Дерматокосметологии, КРСУ, 2014 г.',
        certifications: 'Международные дипломы по контурной пластике и инъекционным методикам (Париж, Франция, 2017; Женева, Швейцария, 2021).',
        achievements: 'Провела более 2100 успешных инъекционных омоложений. Постоянный спикер международных форумов по эстетической медицине.',
        skills: ['3D контурирование лица филлерами', 'Ботулинотерапия (инъекции красоты)', 'Нитевой лифтинг лица', 'Коллагеностимуляция кожи'],
        whyChoose: 'Сторонник естественного омоложения. Использует передовые щадящие европейские протоколы, подчеркивающие вашу индивидуальность.'
      },
      en: {
        name: 'Dr. Elena Popova',
        specialization: 'Aesthetic Medicine Specialist',
        bio: 'International level specialist in facial contouring, injection cosmetology, and skin youth restoration.',
        languages: 'Russian, English',
        workingDays: 'Tuesday, Wednesday, Friday, Saturday, 10:00 - 19:00',
        services: ['Facial contouring', 'Anti-aging injections (Botox)', 'PRP plasmolifting'],
        education: 'I.K. Akhunbaev KSMA, General Medicine, 2012; Residency in Dermatocosmetology, KRSU, 2014.',
        certifications: 'International Board Certified in Dermal Contouring & Anti-Aging Procedures (Paris, France, 2017; Geneva, Switzerland, 2021).',
        achievements: 'Performed over 2,100 successful injection-based treatments. Active delegate at global Aesthetic Medicine summits.',
        skills: ['3D facial contouring with fillers', 'Botulinum toxin wrinkle correction', 'Thread lift rejuvenation', 'Collagen neocollagenesis stimulation'],
        whyChoose: 'Champion of non-invasive natural preservation. Combines precision-focused premium European protocols for eye-safe elegant results.'
      }
    }
  }
];

export default function SpecialistsShowcase({ lang, onBookSpecialist }: SpecialistsShowcaseProps) {
  const t = (key: string) => translate(key as any, lang);
  const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistItem | null>(null);

  const openModal = (specialist: SpecialistItem) => {
    setSelectedSpecialist(specialist);
  };

  const closeModal = () => {
    setSelectedSpecialist(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-1 animate-fade-in">
          <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest block w-fit">
            {t('appSpecialistsShowcase')}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('specTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('specSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Professional Verification Active</span>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SPECIALISTS.map(specialist => {
          const trans = specialist.translations[lang] || specialist.translations['en'];
          return (
            <div 
              key={specialist.id} 
              id={`specialist-${specialist.id}`}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:shadow-xl dark:hover:shadow-slate-950/20 hover:border-blue-200 dark:hover:border-slate-700 transition-all duration-300"
            >
              {/* Photo & Main Details */}
              <div>
                <div className="relative h-48 sm:h-52 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                  <img 
                    src={specialist.avatar} 
                    alt={trans.name}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Rating / Experience Absolute Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                    <div className="flex items-center gap-0.5 bg-slate-900/80 backdrop-blur-sm border border-slate-750 text-amber-400 px-2 py-1 rounded-lg text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                      <span>{specialist.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-600/90 text-white px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      <Award className="w-3 h-3" />
                      <span>{specialist.experience} {t('specYears')} {t('specExperienceLabel')}</span>
                    </div>
                  </div>

                  {/* Name and specialty bottom absolute overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] bg-blue-500/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-white font-bold tracking-wider uppercase block w-fit mb-1">
                      {trans.specialization}
                    </span>
                    <h3 className="text-base font-extrabold tracking-tight drop-shadow-sm leading-tight">
                      {trans.name}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4 text-xs">
                  {/* Bio */}
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-normal min-h-[50px]">
                    {trans.bio}
                  </p>

                  {/* Details block */}
                  <div className="space-y-2 border-t border-b border-slate-100 dark:border-slate-800 py-3 font-medium">
                    {/* Languages */}
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{t('languagesSpoken')}: <strong className="text-slate-700 dark:text-slate-200">{trans.languages}</strong></span>
                    </div>

                    {/* Working days */}
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{t('specWorkingDays')}: <strong className="text-slate-700 dark:text-slate-200">{trans.workingDays.split(',')[0]}</strong></span>
                    </div>
                  </div>

                  {/* Provided Services */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {t('specMainServices')}
                    </span>
                    <ul className="space-y-1">
                      {trans.services.map((srv, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 stroke-[3]" />
                          <span>{srv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 space-y-2">
                <button
                  onClick={() => openModal(specialist)}
                  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-extrabold text-xs py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-750 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>{t('specDetailsBtn')}</span>
                </button>
                <button
                  onClick={() => onBookSpecialist(specialist.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.99] cursor-pointer group"
                >
                  <span>{t('specBookBtn')}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Premium Modal Details Popup */}
      {selectedSpecialist && (() => {
        const trans = selectedSpecialist.translations[lang] || selectedSpecialist.translations['en'];
        return (
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={closeModal}
          >
            <div 
              className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-2 rounded-full transition-colors z-10 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Banner / Header */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-100 dark:border-slate-800/80">
                {/* Photo Column */}
                <div className="md:col-span-5 relative h-64 md:h-full min-h-[240px] bg-slate-50 dark:bg-slate-950">
                  <img 
                    src={selectedSpecialist.avatar} 
                    alt={trans.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent md:hidden" />
                </div>

                {/* Primary Title Info Column */}
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md font-extrabold uppercase tracking-widest inline-block">
                      {trans.specialization}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {trans.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-amber-500 stroke-none" />
                        <span>{selectedSpecialist.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                        <Award className="w-4 h-4" />
                        <span>{selectedSpecialist.experience} {t('specYears')} {t('specExperienceLabel')}</span>
                      </div>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Sparkles className="w-4 h-4" />
                        <span>{selectedSpecialist.completedProcedures} {t('specCompletedProcedures')}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{trans.bio}"
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        {t('languagesSpoken')}
                      </span>
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-semibold">
                        <Globe className="w-3.5 h-3.5 text-blue-500" />
                        <span>{trans.languages}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        {t('specWorkingDays')}
                      </span>
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span className="truncate">{trans.workingDays}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Body Info Sections */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Education, Certs, Achievements */}
                  <div className="space-y-5">
                    {/* Education */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span>{t('specEducation')}</span>
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                        {trans.education}
                      </p>
                    </div>

                    {/* Certifications */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-blue-500" />
                        <span>{t('specCertificates')}</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                        {trans.certifications}
                      </p>
                    </div>

                    {/* Achievements */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>{t('specAchievements')}</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                        {trans.achievements}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Skills, Why Choose & Services */}
                  <div className="space-y-5">
                    {/* Professional Skills */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-blue-500" />
                        <span>{t('specSkills')}</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {trans.skills.map((skill, i) => (
                          <span key={i} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Why Choose Me */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                        <span>{t('specWhyChoose')}</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                        {trans.whyChoose}
                      </p>
                    </div>

                    {/* Main services provided */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-blue-500" />
                        <span>{t('specMainServices')}</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {trans.services.map((service, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-850 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Booking Action */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {t('specBookBtn')}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {t('bookEliteServiceBookingDesc')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onBookSpecialist(selectedSpecialist.id);
                      closeModal();
                    }}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/15 active:scale-[0.99] cursor-pointer group"
                  >
                    <span>{t('specBookBtn')}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
