-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_or TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_or TEXT NOT NULL,
    image_url TEXT,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Create public read policy
CREATE POLICY "Public News Read" ON public.news
    FOR SELECT USING (true);

-- Insert some initial mock data
INSERT INTO public.news (title_en, title_or, content_en, content_or, category)
VALUES 
('Digital Land Portal Launch', 'Eebba Poortaalii Lafaa Dijitaalaa', 'We are proud to announce the official launch of the Haramaya digital land management portal.', 'Baga gammaddan! Poortaaliin bulchiinsa lafaa dijitaalaa Haramayaa ifatti banameera.', 'System'),
('New Tax Regulations 2026', 'Qajeelfama Gibiraa Haarawa 2026', 'Updated guidelines for property tax assessment and collection are now in effect.', 'Qajeelfamni kaffaltii gibiraa haaromfame hojiirra ooleera.', 'Policy');
