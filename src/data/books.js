/**
 * Mock book data — 16 books across 6 categories.
 * Structure is designed to map cleanly to a future REST API response.
 *
 * Future backend: replace this file's export with an API call:
 *   GET /api/books          → list
 *   GET /api/books/:id      → single book
 *   GET /api/books?category=Technology  → filtered
 */

export const CATEGORIES = ['All', 'Technology', 'Fiction', 'Science', 'History', 'Self-Help', 'Business']

export const books = [
  // Technology
  {
    id: 'b001',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    category: 'Technology',
    price: 39.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    description:
      'A collection of tips that document a path to programming mastery. Straight from the programming trenches, this classic title examines the core process of software development.',
    rating: 4.8,
    pages: 352,
    relatedIds: ['b002', 'b003'],
  },
  {
    id: 'b002',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Technology',
    price: 35.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8775116-L.jpg',
    description:
      'A handbook of agile software craftsmanship. Packed with best practices and principles that help write clean, readable, and maintainable code.',
    rating: 4.7,
    pages: 431,
    relatedIds: ['b001', 'b003'],
  },
  {
    id: 'b003',
    title: 'Design Patterns',
    author: 'Erich Gamma et al.',
    category: 'Technology',
    price: 44.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8739208-L.jpg',
    description:
      'The classic Gang of Four book that describes 23 foundational software design patterns. Essential reading for every software engineer.',
    rating: 4.6,
    pages: 395,
    relatedIds: ['b001', 'b002'],
  },

  // Fiction
  {
    id: 'b004',
    title: '1984',
    author: 'George Orwell',
    category: 'Fiction',
    price: 12.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8743274-L.jpg',
    description:
      'A dystopian novel set in a totalitarian society ruled by Big Brother. A chilling and prescient portrayal of surveillance, censorship, and propaganda.',
    rating: 4.9,
    pages: 328,
    relatedIds: ['b005', 'b006'],
  },
  {
    id: 'b005',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    category: 'Fiction',
    price: 13.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8743188-L.jpg',
    description:
      'A futuristic novel depicting a seemingly utopian society achieved through technological control, conditioning, and the elimination of natural human experience.',
    rating: 4.7,
    pages: 311,
    relatedIds: ['b004', 'b006'],
  },
  {
    id: 'b006',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    price: 10.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    description:
      'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan, set against the Jazz Age backdrop of the American Dream.',
    rating: 4.5,
    pages: 180,
    relatedIds: ['b004', 'b005'],
  },

  // Science
  {
    id: 'b007',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    price: 15.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8739050-L.jpg',
    description:
      'From the Big Bang to black holes, Hawking explores the deepest questions of the cosmos in language accessible to every curious reader.',
    rating: 4.8,
    pages: 212,
    relatedIds: ['b008', 'b009'],
  },
  {
    id: 'b008',
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    category: 'Science',
    price: 17.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8739155-L.jpg',
    description:
      'Dawkins popularised the gene-centred view of evolution and introduced the concept of the meme, in this landmark work of popular science.',
    rating: 4.6,
    pages: 360,
    relatedIds: ['b007', 'b009'],
  },
  {
    id: 'b009',
    title: 'Cosmos',
    author: 'Carl Sagan',
    category: 'Science',
    price: 18.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8775091-L.jpg',
    description:
      'Carl Sagan\'s landmark exploration of the universe, interweaving the history of science, human curiosity, and our place in the cosmos.',
    rating: 4.9,
    pages: 365,
    relatedIds: ['b007', 'b008'],
  },

  // History
  {
    id: 'b010',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'History',
    price: 22.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8739179-L.jpg',
    description:
      'A sweeping narrative of human history from the Stone Age to the present, examining how Homo sapiens came to dominate the Earth.',
    rating: 4.9,
    pages: 443,
    relatedIds: ['b011'],
  },
  {
    id: 'b011',
    title: 'Guns, Germs, and Steel',
    author: 'Jared Diamond',
    category: 'History',
    price: 19.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8739116-L.jpg',
    description:
      'A Pulitzer Prize–winning account of why some societies became dominant in world history, examining geography, agriculture, and technology.',
    rating: 4.7,
    pages: 498,
    relatedIds: ['b010'],
  },

  // Self-Help
  {
    id: 'b012',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    price: 24.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/10965962-L.jpg',
    description:
      'A proven framework for building good habits and breaking bad ones. Packed with evidence-backed strategies and memorable stories.',
    rating: 4.9,
    pages: 320,
    relatedIds: ['b013', 'b014'],
  },
  {
    id: 'b013',
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    category: 'Self-Help',
    price: 16.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8739050-L.jpg',
    description:
      'A guide to spiritual enlightenment, focusing on the importance of living in the present moment and freeing yourself from the mind.',
    rating: 4.6,
    pages: 229,
    relatedIds: ['b012', 'b014'],
  },
  {
    id: 'b014',
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Self-Help',
    price: 21.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8775116-L.jpg',
    description:
      'Rules for focused success in a distracted world. Newport argues that the ability to perform deep work is becoming increasingly rare and valuable.',
    rating: 4.7,
    pages: 296,
    relatedIds: ['b012', 'b013'],
  },

  // Business
  {
    id: 'b015',
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Business',
    price: 26.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8739155-L.jpg',
    description:
      'Notes on startups, or how to build the future. Thiel offers contrarian thinking about innovation and what it takes to build a truly great company.',
    rating: 4.7,
    pages: 224,
    relatedIds: ['b016'],
  },
  {
    id: 'b016',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'Business',
    price: 23.99,
    coverUrl: 'https://covers.openlibrary.org/b/id/8739208-L.jpg',
    description:
      'How today\'s entrepreneurs use continuous innovation to create radically successful businesses, using validated learning and rapid iteration.',
    rating: 4.8,
    pages: 336,
    relatedIds: ['b015'],
  },
]
