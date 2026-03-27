export type ArtworkCategory =
  | "all"
  | "paintings"
  | "drawings"
  | "inventions"
  | "anatomy";

export interface Artwork {
  id: string;
  title: string;
  year: string;
  category: Exclude<ArtworkCategory, "all">;
  description: string;
  image: string;
  aspectRatio: "portrait" | "landscape" | "square";
  medium?: string;
  location?: string;
}

export const artworks: Artwork[] = [
  {
    id: "mona-lisa",
    title: "Mona Lisa",
    year: "1503-1519",
    category: "paintings",
    description:
      "The most famous painting in the world, known for her enigmatic smile and revolutionary sfumato technique.",
    image:
      "https://images.unsplash.com/photo-1423742774270-6884aac775fa?w=800&q=80",
    aspectRatio: "portrait",
    medium: "Oil on poplar panel",
    location: "Louvre Museum, Paris",
  },
  {
    id: "last-supper",
    title: "The Last Supper",
    year: "1495-1498",
    category: "paintings",
    description:
      "A masterpiece depicting the moment Jesus announces that one of his disciples will betray him.",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    aspectRatio: "landscape",
    medium: "Tempera and oil on gesso",
    location: "Santa Maria delle Grazie, Milan",
  },
  {
    id: "vitruvian-man",
    title: "Vitruvian Man",
    year: "c. 1490",
    category: "drawings",
    description:
      "A study of the ideal human body proportions, blending art and science in perfect harmony.",
    image:
      "https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=800&q=80",
    aspectRatio: "square",
    medium: "Pen and ink on paper",
    location: "Gallerie dell'Accademia, Venice",
  },
  {
    id: "lady-ermine",
    title: "Lady with an Ermine",
    year: "1489-1490",
    category: "paintings",
    description:
      "Portrait of Cecilia Gallerani, mistress of Ludovico Sforza, Duke of Milan.",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80",
    aspectRatio: "portrait",
    medium: "Oil on walnut panel",
    location: "Czartoryski Museum, Kraków",
  },
  {
    id: "flying-machine",
    title: "Flying Machine Design",
    year: "c. 1488",
    category: "inventions",
    description:
      "One of Leonardo's most famous invention sketches, inspired by the flight of birds.",
    image:
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80",
    aspectRatio: "landscape",
    medium: "Pen and ink on paper",
  },
  {
    id: "anatomical-studies",
    title: "Anatomical Studies of the Shoulder",
    year: "c. 1510",
    category: "anatomy",
    description:
      "Detailed studies of human anatomy that were centuries ahead of their time.",
    image:
      "https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=800&q=80",
    aspectRatio: "portrait",
    medium: "Pen and ink with wash",
  },
  {
    id: "annunciation",
    title: "Annunciation",
    year: "1472-1475",
    category: "paintings",
    description:
      "An early masterwork depicting the Angel Gabriel announcing to Mary that she will conceive Jesus.",
    image:
      "https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=800&q=80",
    aspectRatio: "landscape",
    medium: "Oil and tempera on panel",
    location: "Uffizi Gallery, Florence",
  },
  {
    id: "horse-studies",
    title: "Studies of Horses",
    year: "c. 1490",
    category: "drawings",
    description:
      "Preparatory drawings for the never-completed Gran Cavallo statue.",
    image:
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
    aspectRatio: "landscape",
    medium: "Silverpoint on blue prepared paper",
  },
  {
    id: "tank-design",
    title: "Armored Vehicle Design",
    year: "c. 1485",
    category: "inventions",
    description:
      "A precursor to the modern tank, designed for Ludovico Sforza.",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    aspectRatio: "square",
    medium: "Pen and ink on paper",
  },
  {
    id: "heart-studies",
    title: "Studies of the Heart",
    year: "c. 1513",
    category: "anatomy",
    description:
      "Revolutionary anatomical drawings of the human heart and its vessels.",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80",
    aspectRatio: "portrait",
    medium: "Pen and ink on paper",
  },
  {
    id: "virgin-rocks",
    title: "Virgin of the Rocks",
    year: "1483-1486",
    category: "paintings",
    description:
      "A masterpiece showing the Virgin Mary with the infant Jesus, John the Baptist, and an angel.",
    image:
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80",
    aspectRatio: "portrait",
    medium: "Oil on panel",
    location: "Louvre Museum, Paris",
  },
  {
    id: "skull-studies",
    title: "Studies of the Human Skull",
    year: "c. 1489",
    category: "anatomy",
    description:
      "Detailed cross-sections revealing Leonardo's scientific approach to understanding human anatomy.",
    image:
      "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800&q=80",
    aspectRatio: "square",
    medium: "Pen and ink on paper",
  },
];

export const categories: { value: ArtworkCategory; label: string }[] = [
  { value: "all", label: "All Works" },
  { value: "paintings", label: "Paintings" },
  { value: "drawings", label: "Drawings" },
  { value: "inventions", label: "Inventions" },
  { value: "anatomy", label: "Anatomy" },
];
