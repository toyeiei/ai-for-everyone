
-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    video_url VARCHAR(500),
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant permissions for lessons
GRANT SELECT ON lessons TO anon;
GRANT ALL PRIVILEGES ON lessons TO authenticated;

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Grant permissions for user_progress
GRANT ALL PRIVILEGES ON user_progress TO authenticated;

-- Enable RLS for user_progress to ensure users only see their own progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);

-- Sample data
INSERT INTO lessons (title, content, video_url, "order") VALUES
('Introduction to React', '# Welcome to React Course\n\nReact is a JavaScript library for building user interfaces.\n\n## What you will learn\n- Components\n- Props\n- State\n- Hooks', 'https://www.youtube.com/watch?v=Tn6-PIqc4UM', 1),
('Understanding State', '# State in React\n\nState is a built-in React object that is used to contain data or information about the component.', 'https://www.youtube.com/watch?v=35lXWvCuM8o', 2),
('Effect Hook', '# The useEffect Hook\n\nThe Effect Hook lets you perform side effects in function components.', 'https://www.youtube.com/watch?v=0ZJgIjIuY7U', 3),
('Custom Hooks', '# Building Custom Hooks\n\nBuilding your own Hooks lets you extract component logic into reusable functions.', null, 4);
