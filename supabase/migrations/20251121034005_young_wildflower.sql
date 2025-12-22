/*
  # Add sample vocabulary data

  1. Sample Categories
    - Basic Techniques
    - Game Rules
    - Equipment
    - Positions

  2. Sample Vocabulary Terms
    - Various volleyball terms with definitions and examples
    - Different difficulty levels
    - Associated with appropriate categories

  3. Security
    - Uses existing RLS policies
*/

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Basic Techniques', 'Fundamental volleyball skills and movements'),
  ('Game Rules', 'Official volleyball rules and regulations'),
  ('Equipment', 'Volleyball equipment and court setup'),
  ('Positions', 'Player positions and roles on the court')
ON CONFLICT (name) DO NOTHING;

-- Insert sample vocabulary terms
INSERT INTO vocabulary_terms (term, definition, example, category_id, difficulty_level) VALUES
  (
    'Spike',
    'A forceful downward attack hit by a player jumping above the net',
    'The outside hitter delivered a powerful spike that the defense could not dig.',
    (SELECT id FROM categories WHERE name = 'Basic Techniques'),
    2
  ),
  (
    'Dig',
    'A defensive move where a player passes a hard-driven ball, usually close to the floor',
    'The libero made an incredible dig to keep the rally alive.',
    (SELECT id FROM categories WHERE name = 'Basic Techniques'),
    2
  ),
  (
    'Set',
    'An overhead pass that positions the ball for an attack',
    'The setter delivered a perfect set to the middle hitter.',
    (SELECT id FROM categories WHERE name = 'Basic Techniques'),
    1
  ),
  (
    'Serve',
    'The action of putting the ball into play at the start of each rally',
    'She served an ace that landed just inside the back line.',
    (SELECT id FROM categories WHERE name = 'Basic Techniques'),
    1
  ),
  (
    'Block',
    'A defensive play where players jump with arms extended above the net to deflect an attack',
    'The middle blocker timed the block perfectly to stuff the opponent''s attack.',
    (SELECT id FROM categories WHERE name = 'Basic Techniques'),
    3
  ),
  (
    'Libero',
    'A specialized defensive player who wears a different colored jersey and has special substitution privileges',
    'The libero is not allowed to attack the ball above the net height.',
    (SELECT id FROM categories WHERE name = 'Positions'),
    3
  ),
  (
    'Rotation',
    'The clockwise movement of players around the court after winning the serve',
    'After the side-out, the team rotated and the setter moved to the front row.',
    (SELECT id FROM categories WHERE name = 'Game Rules'),
    2
  ),
  (
    'Side-out',
    'When the receiving team wins the rally and gains the right to serve',
    'The team earned a side-out and now has the opportunity to score.',
    (SELECT id FROM categories WHERE name = 'Game Rules'),
    2
  ),
  (
    'Attack Line',
    'The line 3 meters from the net that separates the front and back court',
    'Back row players cannot attack the ball above net height when in front of the attack line.',
    (SELECT id FROM categories WHERE name = 'Equipment'),
    3
  ),
  (
    'Antenna',
    'Flexible rods attached to the net that mark the sideline boundaries above the net',
    'The ball hit the antenna and was ruled out of bounds.',
    (SELECT id FROM categories WHERE name = 'Equipment'),
    2
  ),
  (
    'Pancake',
    'A defensive technique where a player slides their hand flat on the floor to dig a ball',
    'The defender made a spectacular pancake dig to save the point.',
    (SELECT id FROM categories WHERE name = 'Basic Techniques'),
    4
  ),
  (
    'Quick Set',
    'A low, fast set delivered to a hitter who is already in the air',
    'The middle hitter connected on a quick set for an unstoppable attack.',
    (SELECT id FROM categories WHERE name = 'Basic Techniques'),
    4
  ),
  (
    'Float Serve',
    'A serve hit with no spin that causes the ball to move unpredictably through the air',
    'The float serve dropped suddenly, causing the passer to miss the ball.',
    (SELECT id FROM categories WHERE name = 'Basic Techniques'),
    3
  ),
  (
    'Double Hit',
    'An illegal contact where a player hits the ball twice in succession',
    'The referee called a double hit when the setter''s hands were uneven.',
    (SELECT id FROM categories WHERE name = 'Game Rules'),
    2
  ),
  (
    'Net Violation',
    'An illegal play where a player touches the net during play',
    'The middle blocker was called for a net violation after touching the net on the follow-through.',
    (SELECT id FROM categories WHERE name = 'Game Rules'),
    1
  ),
  (
    'Outside Hitter',
    'A player who attacks from the left side of the court (position 4)',
    'The outside hitter is typically the team''s primary offensive weapon.',
    (SELECT id FROM categories WHERE name = 'Positions'),
    2
  ),
  (
    'Middle Blocker',
    'A player who specializes in blocking and quick attacks from the center of the net',
    'The middle blocker must be ready to block attacks from multiple angles.',
    (SELECT id FROM categories WHERE name = 'Positions'),
    3
  ),
  (
    'Setter',
    'The player responsible for setting up attacks by delivering the second contact',
    'A good setter can make average hitters look great with precise ball placement.',
    (SELECT id FROM categories WHERE name = 'Positions'),
    2
  ),
  (
    'Back Row Attack',
    'An attack made by a back row player who jumps from behind the attack line',
    'The libero surprised everyone with a back row attack that scored the winning point.',
    (SELECT id FROM categories WHERE name = 'Basic Techniques'),
    4
  ),
  (
    'Joust',
    'When two opposing players contact the ball simultaneously above the net',
    'The joust at the net resulted in the ball falling back to the attacking team''s side.',
    (SELECT id FROM categories WHERE name = 'Basic Techniques'),
    5
  )
ON CONFLICT DO NOTHING;