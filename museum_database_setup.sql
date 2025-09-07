-- Museum Content Management Database Setup
-- Run this script in your Supabase SQL editor to create the necessary tables

-- Create museum_artifacts table
CREATE TABLE IF NOT EXISTS museum_artifacts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  english_text TEXT NOT NULL,
  aeta_text TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'hunting',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create museum_languages table
CREATE TABLE IF NOT EXISTS museum_languages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  speakers TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create museum_festivals table
CREATE TABLE IF NOT EXISTS museum_festivals (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  month TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create museum_rituals table
CREATE TABLE IF NOT EXISTS museum_rituals (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  age TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create museum_videos table
CREATE TABLE IF NOT EXISTS museum_videos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT,
  duration TEXT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for museum_artifacts
INSERT INTO museum_artifacts (title, description, english_text, aeta_text, category) VALUES
(
  'Arrow Pangal (Broad-tipped Hunting Arrow)',
  'Traditional hunting implement',
  'The Arrow Pangal is a traditional hunting arrow used by Aeta hunters. It features a broad, leaf-shaped tip designed for maximum impact on small game. The arrow is crafted from local bamboo and hardwood, with natural feathers for stability. This design reflects the Aeta people''s deep understanding of their environment and hunting techniques.',
  'Ang Arrow Pangal ay tradisyonal na pana na ginagamit ng mga Aeta na mangangaso. May malapad na dulo na hugis dahon para sa maximum na epekto sa maliit na hayop. Gawa ito sa lokal na kawayan at hardwood, na may natural na balahibo para sa katatagan. Ang disenyong ito ay nagpapakita ng malalim na pag-unawa ng mga Aeta sa kanilang kapaligiran at mga pamamaraan ng pangangaso.',
  'hunting'
),
(
  'Bangkaw/Sibat (Lightweight Hunting Spear)',
  'Traditional hunting spear',
  'The Bangkaw or Sibat is a lightweight hunting spear traditionally used by Aeta hunters. It features a sharp metal tip attached to a long wooden shaft. This weapon demonstrates the Aeta people''s skill in crafting tools from available materials and their expertise in close-range hunting techniques.',
  'Ang Bangkaw o Sibat ay magaan na sibat na ginagamit ng mga Aeta na mangangaso. May matalas na metal na dulo na nakakabit sa mahabang kahoy na hawakan. Ang sandatang ito ay nagpapakita ng kasanayan ng mga Aeta sa paggawa ng mga kagamitan mula sa available na materyales at kanilang expertise sa close-range na pamamaraan ng pangangaso.',
  'hunting'
),
(
  'Bahag (Traditional Loincloth)',
  'Traditional male clothing',
  'The Bahag is the traditional male garment of the Aeta people, consisting of a rectangular piece of cloth wrapped around the waist and between the legs. This simple yet practical clothing reflects the Aeta people''s adaptation to their tropical environment and their minimalist approach to clothing that allows for freedom of movement during hunting and daily activities.',
  'Ang Bahag ay tradisyonal na damit ng mga lalaking Aeta, na binubuo ng rectangular na piraso ng tela na nakabalot sa baywang at sa pagitan ng mga binti. Ang simpleng ngunit praktikal na damit na ito ay nagpapakita ng pag-angkop ng mga Aeta sa kanilang tropical na kapaligiran at kanilang minimalist na approach sa damit na nagbibigay ng kalayaan sa paggalaw habang nangangaso at gumagawa ng pang-araw-araw na gawain.',
  'clothing'
),
(
  'Indigenous Jewelry Collection',
  'Traditional adornments',
  'Aeta jewelry reflects their deep connection to nature and spiritual beliefs. Forest seed necklaces symbolize abundance and fertility, while shell bracelets represent protection from water spirits. Ceremonial beadwork often tells stories of ancestors and community history, serving as both decoration and cultural documentation.',
  'Ang mga alahas ng Aeta ay nagpapakita ng kanilang malalim na koneksyon sa kalikasan at espirituwal na paniniwala. Ang mga kuwintas na gawa sa buto ng puno ay sumasagisag sa kasaganaan at fertility, habang ang mga pulseras na gawa sa kabibe ay kumakatawan sa proteksyon mula sa mga espiritu ng tubig. Ang mga ceremonial na beadwork ay madalas na nagsasabi ng mga kwento ng mga ninuno at kasaysayan ng komunidad, na nagsisilbing dekorasyon at cultural na dokumentasyon.',
  'jewelry'
);

-- Insert sample data for museum_languages
INSERT INTO museum_languages (name, region, speakers) VALUES
('Mag-antsi', 'Zambales, Tarlac', '~15,000'),
('Mag-indi', 'Pampanga, Bataan', '~8,000'),
('Abellen', 'Tarlac', '~3,000');

-- Insert sample data for museum_festivals
INSERT INTO museum_festivals (name, description, month) VALUES
('Pamaghati', 'Harvest festival celebrating nature''s bounty', 'March'),
('Pangisda', 'Fishing ritual honoring water spirits', 'June'),
('Pamana', 'Ancestral worship ceremony', 'November');

-- Insert sample data for museum_rituals
INSERT INTO museum_rituals (name, description, age) VALUES
('Pamaghati sa Binata', 'Coming-of-age ritual for young men', '14-16'),
('Pamaghati sa Dalaga', 'Coming-of-age ritual for young women', '12-14'),
('Pamaghati sa Matanda', 'Elder wisdom ceremony', '60+');

-- Insert sample data for museum_videos
INSERT INTO museum_videos (title, description, duration) VALUES
('Traditional Aeta Dance', 'The Pamaghati dance celebrating harvest and community unity', '5:32'),
('Musical Instruments', 'Traditional bamboo instruments and their cultural significance', '3:45'),
('Ceremonial Rituals', 'Sacred ceremonies and spiritual practices of the Aeta people', '7:18');

-- Create storage bucket for museum images (run this in Supabase dashboard)
-- Go to Storage > Create a new bucket named "museum-images"
-- Set it to public and enable RLS policies

-- Enable Row Level Security (RLS)
ALTER TABLE museum_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE museum_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE museum_festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE museum_rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE museum_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to museum_artifacts" ON museum_artifacts
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to museum_languages" ON museum_languages
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to museum_festivals" ON museum_festivals
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to museum_rituals" ON museum_rituals
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to museum_videos" ON museum_videos
  FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update/delete (admin functionality)
CREATE POLICY "Allow authenticated users to insert museum_artifacts" ON museum_artifacts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update museum_artifacts" ON museum_artifacts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete museum_artifacts" ON museum_artifacts
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert museum_languages" ON museum_languages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update museum_languages" ON museum_languages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete museum_languages" ON museum_languages
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert museum_festivals" ON museum_festivals
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update museum_festivals" ON museum_festivals
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete museum_festivals" ON museum_festivals
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert museum_rituals" ON museum_rituals
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update museum_rituals" ON museum_rituals
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete museum_rituals" ON museum_rituals
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert museum_videos" ON museum_videos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update museum_videos" ON museum_videos
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete museum_videos" ON museum_videos
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_museum_artifacts_category ON museum_artifacts(category);
CREATE INDEX IF NOT EXISTS idx_museum_artifacts_created_at ON museum_artifacts(created_at);
CREATE INDEX IF NOT EXISTS idx_museum_languages_name ON museum_languages(name);
CREATE INDEX IF NOT EXISTS idx_museum_festivals_month ON museum_festivals(month);
CREATE INDEX IF NOT EXISTS idx_museum_videos_title ON museum_videos(title);
